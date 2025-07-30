"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { loginUser } from "../../api/auth/authApis";
import {
  clearUserData,
  setRedirectUser,
  setUserData,
} from "@/redux/slice/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const LoginPage = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingpage, setLoadingPage] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .max(24, "Password must be at most 24 characters")
        .required("Password is required"),
    }),
    validateOnBlur: false, // <-- disable onBlur validation
    validateOnChange: false, // <-- disable onChange validation
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await loginUser(values);
        console.log(response, "responseresponseresponse");
        if (response?.status_code == 200) {
          const collintoken = response?.tokens;
          if (collintoken) {
            document.cookie = `collintoken=${response?.tokens?.AccessToken}; path=/; Secure; SameSite=Strict;`;
            document.cookie = `collinrefresh=${response?.tokens?.RefreshToken}; path=/; Secure; SameSite=Strict;`;
          }
          dispatch(setUserData(response));
          toast.success(response?.message, { toastId: "login" });
          router.push(`/dashboard`);
          setLoading(false);
        } else {
          toast.success(response?.detail, { toastId: "login" });
          setLoading(false);
        }
        // Show success message or redirect
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    console.log("new buil");

    const params = new URLSearchParams(window.location.search);
    console.log(params?.get("token"), "paramsparamsparams");

    const tokenFromPramms = params?.get("token") || "";
    const nameFromPramms = params?.get("name") || "";
    const emailParams = params?.get("email") || "";
    const handleRedirect = async () => {
      if (tokenFromPramms && nameFromPramms) {
        setLoadingPage(true);
        const token = Cookies.get("collintoken"); // returns the token or undefined
        if (token) {
          // if (response?.status_code == 200) {
          localStorage.clear();
          dispatch(clearUserData(""));
          document.cookie = "collintoken=; path=/; expires=0;";
          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
          });
        }
        console.log("Token:", token);
        localStorage.setItem("chat_email", emailParams);
        document.cookie = `collintoken=${tokenFromPramms}; path=/; Secure; SameSite=Strict;`;
        document.cookie = `collinrefresh=${tokenFromPramms}; path=/; Secure; SameSite=Strict;`;
        await dispatch(setRedirectUser(nameFromPramms));
        setLoadingPage(false);
        router.push(`/dashboard`);
      }
    };

    handleRedirect();
  }, []);
  const Loader = async () => {
    return (
      <div className="flex justify-center items-center">
        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  };

  return (
    <>
      {loadingpage ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <Loader />
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>

            {/* Footer links */}
            <div className="mt-6 text-sm text-center text-gray-600 space-y-2">
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:underline block"
              >
                Forgot Password?
              </Link>
              <p>
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
