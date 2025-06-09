"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import OTPInput from "react-otp-input";
import { createNewPassword, forgotPassword, resendOtp } from "../api/auth/authApis";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const TIMER_KEY = "otp_timer_expiry";

const ChangePasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  new_password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must include at least one special character")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("new_password")], "Passwords must match")
    .required("Confirm your password"),
  confirmation_code: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

const ChangePasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("amus-email");
    if (storedEmail) setEmail(storedEmail);

    const expiry = localStorage.getItem(TIMER_KEY);
    const now = Date.now();
    if (expiry && +expiry > now) {
      setTimer(Math.floor((+expiry - now) / 1000));
    } else {
      startTimer();
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            localStorage.removeItem(TIMER_KEY);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const startTimer = () => {
    const expiryTime = Date.now() + 60 * 1000;
    localStorage.setItem(TIMER_KEY, expiryTime.toString());
    setTimer(60);
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found. Please reload the page.");
      return;
    }

    setResendLoading(true);
    try {
      const response = await forgotPassword(email);
      if (response?.status_code == 200) {
        toast.success(response?.message || "OTP resent successfully", { toastId: "resend" });
        startTimer();
      } else {
        toast.error(response?.detail || "Failed to resend OTP", { toastId: "resendFail" });
      }
    } catch (error) {
      toast.error("Error resending OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const handleChangePassword = async (values: {
    new_password: string;
    confirmation_code: string;
    email: string;
  }) => {
    setLoading(true);
    try {
      const response = await createNewPassword(values);
      if (response?.status_code === 200) {
        toast.success("Password changed successfully");
        localStorage.removeItem("email");
        localStorage.removeItem(TIMER_KEY);
        router.push("/login");
      } else {
        toast.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Change Password</h1>
      <Formik
        enableReinitialize
        initialValues={{
          new_password: "",
          confirmPassword: "",
          confirmation_code: "",
          email: email || "",
        }}
        validationSchema={ChangePasswordSchema}
        onSubmit={handleChangePassword}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-5">
            {/* OTP */}
            <div>
              <label className="block mb-1 font-medium">OTP</label>
              <div className="flex justify-center">
                <OTPInput
                  value={values.confirmation_code}
                  onChange={(val) => setFieldValue("confirmation_code", val)}
                  numInputs={6}
                  inputType="tel"
                  renderInput={(props) => <input {...props} />}
                  inputStyle={{
                    width: "2.8rem",
                    height: "2.8rem",
                    margin: "0 0.4rem",
                    fontSize: "1.25rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #ccc",
                    textAlign: "center",
                    outline: "none",
                  }}
                />
              </div>
              <ErrorMessage
                name="confirmation_code"
                component="div"
                className="text-red-500 text-sm text-center mt-1"
              />

              {/* Resend Button */}
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendLoading || timer > 0}
                  className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                >
                  {resendLoading
                    ? "Resending OTP..."
                    : timer > 0
                    ? `Resend OTP in ${timer}s`
                    : "Resend OTP"}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block mb-1 font-medium">New Password</label>
              <div className="relative">
                <Field
                  type={showNewPassword ? "text" : "password"}
                  name="new_password"
                  className="w-full border px-3 py-2 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
              <ErrorMessage
                name="new_password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-1 font-medium">Confirm Password</label>
              <div className="relative">
                <Field
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full border px-3 py-2 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePasswordPage;
