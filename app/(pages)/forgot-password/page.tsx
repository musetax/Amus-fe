"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { forgotPassword } from "../../api/auth/authApis";
import { toast } from "react-toastify";

// Validation schema
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (values: { email: string }) => {
    setLoading(true)

    try {
      const response = await forgotPassword(values?.email)
      localStorage.setItem('amus-email', values?.email)

      if (response.status_code == 200) {
        router.push('/change-password')  // ✅ move this inside success block
      } else {
        toast.error(response.message, { toastId: "reg-er" })
      }
    } catch (error) {
      console.error(error)
      // toast.error("Something went wrong. Please try again.", { toastId: "reg-er" })
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={handleForgotPassword}
      >
        {() => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email Address <span className="text-red-500">*</span></label>
              <Field
                name="email"
                type="email"
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </Form>
        )}
      </Formik>
      <div className="mt-6 text-sm text-center text-gray-600">
        <p>
          Back to{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
