"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import OTPInput from "react-otp-input";
import * as Yup from "yup";
import { withAuth } from "../utils/withAuth";
import { verifyOtp } from "../api/auth/authApis"; // Replace with your API call

const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .length(6, "OTP must be 6 digits"),
  email: Yup.string().email().required("Email is required"),
});

const VerifyOtpPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleVerifyOtp = async (values: { otp: string; email: string }) => {
    setLoading(true);
    try {
      const response = await verifyOtp(values);
      console.log("OTP verified:", response);
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Verify OTP</h1>

      <Formik
        enableReinitialize
        initialValues={{ otp: "", email }}
        validationSchema={OtpSchema}
        onSubmit={handleVerifyOtp}
      >
        {({ setFieldValue, values }) => (
          <Form className="space-y-5">
            <div className="text-center">
              <OTPInput
                value={values.otp}
                onChange={(otp) => setFieldValue("otp", otp)}
                numInputs={6}
                shouldAutoFocus
                inputType="number"
                inputStyle="mx-1 w-10 h-10 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                renderInput={(props) => <input {...props} />}
              />
              <ErrorMessage
                name="otp"
                component="div"
                className="text-red-500 text-sm mt-2"
              />
            </div>

            <Field type="hidden" name="email" />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default withAuth(VerifyOtpPage);
