"use client";
import CustomLabelInput from "@/components/common/customLabelInput";
import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BsEye, BsEyeSlash } from "react-icons/bs";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}
const SignUpForm = () => {
  const router = useRouter();
  const captchaRef = useRef<any>(null);

  const [captchaError, setCaptchaError] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordValidations, setPasswordValidations] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isMinLength: false,
  });
  const [focus, setFocus] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isClicked, setIsClicked] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible((prev) => !prev);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      (name === "firstName" || name === "lastName") &&
      !/^[a-zA-Z]*$/.test(value)
    ) {
      return;
    }
    if (value.startsWith(" ")) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear the error for the specific field being changed
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));

    if (name === "password") {
      setPasswordValidations({
        hasLowercase: /[a-z]/.test(value),
        hasUppercase: /[A-Z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecialChar: /[!@#$%^&*]/.test(value),
        isMinLength: value.length >= 8,
      });
    }
  };

  const handleOnFocus = (e: any) => {
    const name = e.target.name as keyof typeof focus;
    setFocus({ ...focus, [name]: !focus[name] });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});
    setLoading(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5">
        <div>
          <CustomLabelInput
            name="firstName"
            type="text"
            value={formData.firstName}
            placeholder="First Name"
            onChange={handleChange}
            onFocus={handleOnFocus}
            onBlur={handleOnFocus}
            error={errors?.firstName}
            className={`w-full px-4 py-2 border ${
              errors.firstName ? "border-red-500" : ""
            } rounded focus:outline-none ring-0`}
          />
        </div>
        <div>
          <CustomLabelInput
            name="lastName"
            type="text"
            value={formData.lastName}
            placeholder="Last Name"
            onChange={handleChange}
            onFocus={handleOnFocus}
            onBlur={handleOnFocus}
            error={errors?.lastName}
            className={`w-full px-4 py-2 border ${
              errors.lastName ? "border-red-500" : ""
            } rounded focus:outline-none ring-0`}
          />
        </div>
        <div>
          <CustomLabelInput
            iconAlt="Email Icon"
            name="email"
            type="text"
            value={formData.email}
            placeholder="Email Address"
            onChange={handleChange}
            onFocus={handleOnFocus}
            onBlur={handleOnFocus}
            error={errors?.email}
            className={`w-full px-4 py-2 border ${
              errors.email ? "border-red-500" : ""
            } rounded focus:outline-none ring-0`}
          />
        </div>
        <div className="relative flex items-center justify-start w-full">
          <CustomLabelInput
            name="password"
            type={passwordVisible ? "text" : "password"}
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            onFocus={handleOnFocus}
            onBlur={handleOnFocus}
            error={errors?.password}
            className={`w-full  pl-4 pr-14 py-2 border ${
              errors.password ? "border-red-500" : ""
            } rounded focus:outline-none ring-0`}
          />
          <button
            key={passwordVisible ? "eye" : "eye-slash"}
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 text-black dark:text-white top-4 mt-3 transform -translate-y-1/2 z-10"
          >
            <span>
              {passwordVisible ? (
                <BsEye className="text-2xl text-lightGray1 " />
              ) : (
                <BsEyeSlash className="text-2xl text-lightGray1" />
              )}
            </span>
          </button>
        </div>
        <div className="relative flex items-center justify-start w-full">
          <CustomLabelInput
            name="confirmPassword"
            type={confirmPasswordVisible ? "text" : "password"}
            value={formData.confirmPassword}
            placeholder="Confirm Password"
            onChange={handleChange}
            onFocus={handleOnFocus}
            onBlur={handleOnFocus}
            error={errors?.confirmPassword}
            className={`w-full  pl-4 pr-14 py-2 border ${
              errors.confirmPassword ? "border-red-500" : ""
            } rounded focus:outline-none ring-0`}
          />
          <button
            key={confirmPasswordVisible ? "eye" : "eye-slash"}
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-4 text-black dark:text-white top-4 mt-3 transform -translate-y-1/2 z-10"
          >
            <span>
              {confirmPasswordVisible ? (
                <BsEye className="text-2xl text-lightGray1 " />
              ) : (
                <BsEyeSlash className="text-2xl text-lightGray1" />
              )}
            </span>
          </button>
        </div>
      </div>
      <div className="mt-4 text-left">
        <p className="text-gray-600 font-medium">Password must contain:</p>
        <ul className="text-sm">
          <li
            className={
              passwordValidations.hasLowercase
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {passwordValidations.hasLowercase ? "✔" : "✘"} At least one
            lowercase letter
          </li>
          <li
            className={
              passwordValidations.hasUppercase
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {passwordValidations.hasUppercase ? "✔" : "✘"} At least one
            uppercase letter
          </li>
          <li
            className={
              passwordValidations.hasNumber ? "text-green-600" : "text-red-600"
            }
          >
            {passwordValidations.hasNumber ? "✔" : "✘"} At least one number
          </li>
          <li
            className={
              passwordValidations.hasSpecialChar
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {passwordValidations.hasSpecialChar ? "✔" : "✘"} At least one
            special character (!@#$%^&*)
          </li>
          <li
            className={
              passwordValidations.isMinLength
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {passwordValidations.isMinLength ? "✔" : "✘"} Minimum 8 characters
          </li>
          <li
            className={
              formData.password.length <= 24 && formData.password.length > 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {formData.password.length <= 24 && formData.password.length > 0
              ? "✔"
              : "✘"}{" "}
            Maximum 24 characters
          </li>
        </ul>
      </div>

      <button
        type="submit"
        className={`relative w-full bg-btnBgGradient1 mt-8 h-[42px] text-lg font-medium text-white py-1 px-4 rounded-full hover:from-primary hover:to-purpal focus:outline-none focus:ring-0 outline-none overflow-hidden transition-transform duration-200`}
        disabled={loading}
      >
        <span className="relative z-10">
          {loading ? "Loading..." : "Sign Up"}
        </span>
        {isClicked && (
          <span className="absolute inset-0 bg-white/20 animate-pulse"></span>
        )}
      </button>
    </form>
  );
};
export default SignUpForm;
