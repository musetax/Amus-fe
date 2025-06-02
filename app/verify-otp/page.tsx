"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import OTPInput from "react-otp-input";
import * as Yup from "yup";
import { verifyOtp, resendOtp } from "../api/auth/authApis";
import { withGuest } from "../utils/withGuest";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
 
const OtpSchema = Yup.object().shape({
  confirmation_code: Yup.string()
    .required("OTP is required")
    .length(6, "OTP must be 6 digits"),
  email: Yup.string().email().required("Email is required"),
});

const VerifyOtpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  // On mount: fetch stored email and timer from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);

    const expiryTime = Date.now() + 60 * 1000;
    localStorage.setItem("otp_resend_expiry", expiryTime.toString());
    setTimeLeft(60);
  }, []);

  // Countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("otp_resend_expiry");
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleVerifyOtp = async (values: {
    confirmation_code: string;
    email: string;
  }) => {
    setLoading(true);
    try {
      const response = await verifyOtp(values);
      if (response?.status_code === 200) {
        toast.success(response?.message, { toastId: "very" });
        router.push(`/login`);
      } else {
        toast.error(response?.detail || "OTP verification failed", {
          toastId: "not",
        });
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found. Please reload the page.");
      return;
    }

    setResendLoading(true);
    try {
      const response = await resendOtp(email);
      if (response?.status_code === 200) {
        toast.success(response?.message || "OTP resent successfully");

        // Start 60-second countdown and store expiry
        const expiryTime = Date.now() + 60 * 1000;
        localStorage.setItem("otp_resend_expiry", expiryTime.toString());
        setTimeLeft(60);
      } else {
        toast.error(response?.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Verify OTP
        </h1>

        <Formik
          enableReinitialize
          initialValues={{ confirmation_code: "", email }}
          validationSchema={OtpSchema}
          onSubmit={handleVerifyOtp}
        >
          {({ setFieldValue, values }) => (
            <Form className="space-y-6">
              <div className="flex justify-center">
                <OTPInput
                  value={values.confirmation_code}
                  onChange={(confirmation_code) =>
                    setFieldValue("confirmation_code", confirmation_code)
                  }
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
                  shouldAutoFocus
                  containerStyle={{ justifyContent: "center" }}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData("text").trim();
                    if (/^\d{6}$/.test(pasted)) {
                      setFieldValue("confirmation_code", pasted);
                    }
                    e.preventDefault();
                  }}
                />
              </div>
              <ErrorMessage
                name="confirmation_code"
                component="div"
                className="text-red-500 text-sm text-center"
              />
              <Field type="hidden" name="email" />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center">
          {timeLeft > 0 ? (
            <p className="text-gray-500">
              Resend OTP in <span className="font-semibold">{timeLeft}</span> seconds
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="text-indigo-600 hover:underline disabled:opacity-50"
            >
              {resendLoading ? "Resending OTP..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default withGuest(VerifyOtpPage);
