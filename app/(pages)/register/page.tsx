"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./RegisterForm.css";
import { registerUser } from "@/app/api/auth/authApis";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirm = () => setShowConfirm((prev) => !prev);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .required("First name is required")
        .matches(/^[^\s]+$/, "First name cannot contain spaces")
        .min(3, "First name must be at least 3 characters")
        .max(50, "First name must be at most 50 characters"),

      last_name: Yup.string()
        .required("Last name is required")
        .matches(/^[^\s]+$/, "Last name cannot contain spaces")
        .min(3, "Last name must be at least 3 characters")
        .max(50, "Last name must be at most 50 characters"),

      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .test(
          "is-strong",
          "Password must be 8-24 characters and include uppercase, lowercase, number, and special character",
          (value) =>
            !!value &&
            value.length >= 8 &&
            value.length <= 24 &&
            /[A-Z]/.test(value) &&
            /[a-z]/.test(value) &&
            /[0-9]/.test(value) &&
            /[@$!%*?&]/.test(value)
        ),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords must match")
        .required("Confirm password is required"),
    }),
    validateOnBlur: false, // <-- disable onBlur validation
    validateOnChange: false, // <-- disable onChange validation
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const response = await registerUser(values);
        console.log(response, "response");

        if (response?.status_code == 200) {
          console.log(values.email, "values.emailvalues.email");
          toast.success(response?.message, { toastId: "reg-suc" });
          localStorage.setItem("amus-email", values.email);
          router.push(`/verify-otp`);
          setIsSubmitting(false);
        }
        if (response?.status_code == 409) {
          console.log(values.email, "values.emailvalues.email");
          toast.success(response?.message, { toastId: "reg-sucx" });
          localStorage.setItem("amus-email", values.email);
          router.push(`/verify-otp`);
          setIsSubmitting(false);
        } else {
          toast.error(response?.detail, { toastId: "reg-er" });
          setIsSubmitting(false);
        }
        // Show success message or redirect
      } catch (error) {
        setIsSubmitting(false);

        console.error("Registration error:", error);
      }
    },
  });

  return (
    <form className="register-form" onSubmit={formik.handleSubmit}>
      <h2>Register</h2>

      <div className="form-group">
        <label>
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          name="first_name"
          type="text"
          onChange={(e) => {
            const noSpaces = e.target.value.replace(/\s/g, "");
            formik.setFieldValue("first_name", noSpaces);
          }}
          onBlur={formik.handleBlur}
          value={formik.values.first_name}
        />
        {formik.touched.first_name && formik.errors.first_name && (
          <div className="error">{formik.errors.first_name}</div>
        )}
      </div>

      <div className="form-group">
        <label>
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          name="last_name"
          type="text"
          onChange={(e) => {
            const noSpaces = e.target.value.replace(/\s/g, "");
            formik.setFieldValue("last_name", noSpaces);
          }}
          onBlur={formik.handleBlur}
          value={formik.values.last_name}
        />
        {formik.touched.last_name && formik.errors.last_name && (
          <div className="error">{formik.errors.last_name}</div>
        )}
      </div>

      <div className="form-group">
        <label>
          Email <span className="text-red-500">*</span>
        </label>
        <input
          name="email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="error">{formik.errors.email}</div>
        )}
      </div>

      <div className="form-group password-field">
        <label>
          Password <span className="text-red-500">*</span>
        </label>
        <div className="password-wrapper">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          <span className="toggle-icon" onClick={togglePassword}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        {formik.touched.password && formik.errors.password && (
          <div className="error">{formik.errors.password}</div>
        )}
      </div>

      <div className="form-group password-field">
        <label>
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="password-wrapper">
          <input
            name="confirm_password"
            type={showConfirm ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirm_password}
          />
          <span className="toggle-icon" onClick={toggleConfirm}>
            {showConfirm ?  <FaEye /> :<FaEyeSlash />}
          </span>
        </div>
        {formik.touched.confirm_password && formik.errors.confirm_password && (
          <div className="error">{formik.errors.confirm_password}</div>
        )}
      </div>

      <button type="submit" className="register-btn" disabled={isSubmitting}>
        {isSubmitting ? "Registering..." : "Register"}
      </button>
      {/* Footer links */}
      <div className="mt-6 text-sm text-center text-gray-600 space-y-2">
        <p>
          Don't have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
