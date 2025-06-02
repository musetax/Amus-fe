"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./RegisterForm.css";
import { registerUser } from "@/app/api/auth/authApis";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
      first_name: Yup.string().required("First name is required"),
      last_name: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Must contain an uppercase letter")
        .matches(/[a-z]/, "Must contain a lowercase letter")
        .matches(/[0-9]/, "Must contain a number")
        .matches(/[@$!%*?&]/, "Must contain a special character")
        .required("Password is required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const response = await registerUser(values);
        if (response?.status_code == 200) {
          console.log(values.email, "values.emailvalues.email");
          toast.success(response?.message, { toastId: "reg-suc" });
          localStorage.setItem("email", values.email);
          router.push(`/verify-otp`);
          setIsSubmitting(false);
        } else {
          toast.error(response?.detail, { toastId: "reg-er" });
          setIsSubmitting(false);
        }
        // Show success message or redirect
      } catch (error) {
        console.error("Registration error:", error);
      }  
    },
  });

  return (
    <form className="register-form" onSubmit={formik.handleSubmit}>
      <h2>Register</h2>

      <div className="form-group">
        <label>First Name</label>
        <input
          name="first_name"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.first_name}
        />
        {formik.touched.first_name && formik.errors.first_name && (
          <div className="error">{formik.errors.first_name}</div>
        )}
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input
          name="last_name"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.last_name}
        />
        {formik.touched.last_name && formik.errors.last_name && (
          <div className="error">{formik.errors.last_name}</div>
        )}
      </div>

      <div className="form-group">
        <label>Email</label>
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
        <label>Password</label>
        <div className="password-wrapper">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          <span className="toggle-icon" onClick={togglePassword}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {formik.touched.password && formik.errors.password && (
          <div className="error">{formik.errors.password}</div>
        )}
      </div>

      <div className="form-group password-field">
        <label>Confirm Password</label>
        <div className="password-wrapper">
          <input
            name="confirm_password"
            type={showConfirm ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirm_password}
          />
          <span className="toggle-icon" onClick={toggleConfirm}>
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {formik.touched.confirm_password && formik.errors.confirm_password && (
          <div className="error">{formik.errors.confirm_password}</div>
        )}
      </div>

      <button type="submit" className="register-btn" disabled={isSubmitting}>
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;
