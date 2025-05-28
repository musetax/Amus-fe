"use client";
import CustomLabelInput from "@/components/common/customLabelInput";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

import React, { ChangeEvent, FocusEvent, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FormData {
  confirmationCode: any;
  password: string;
  confirmPassword: string;
}

interface PasswordValidations {
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isMinLength: boolean;
  isMaxLength: boolean;
}

const CreatePasswordForm = () => {
  const router = useRouter();
  // const searchParams = useSearchParams();
  const confirmationCodeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = localStorage.getItem("forgetEmail");

  const initialFormData: FormData = {
    confirmationCode: Array(6).fill(""), // 6 empty slots for the confirmation code
    password: "",
    confirmPassword: "",
  };

  const [isFocused, setIsFocused] = useState<string>("");
  const [data, setData] = useState<FormData>(initialFormData);
  const [passwordValidations, setPasswordValidations] =
    useState<PasswordValidations>({
      hasLowercase: false,
      hasUppercase: false,
      hasNumber: false,
      hasSpecialChar: false,
      isMinLength: false,
      isMaxLength: false,
    });
  const [isPwdVisible, setPwdVisible] = useState(false);
  const [isCnPwdVisible, setCnPwdVisible] = useState(false);
  const [error, setError] = useState<FormData>({
    ...initialFormData,
    confirmationCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authTokenMuse");

    if (email) {
      startTimer();
    }
  }, [email]); // Add `email` to dependencies

  const handlePwdVisibility = (type: "password" | "confirmPassword") => {
    if (type === "password") {
      setPwdVisible(!isPwdVisible);
    } else {
      setCnPwdVisible(!isCnPwdVisible);
    }
  };

  const clearFieldError = (field: keyof FormData) => {
    setError((prevError) => ({
      ...prevError,
      [field]: "",
    }));
  };

  const handleCodeChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;

    if (/^[0-9]$/.test(value) || value === "") {
      const updatedCode = [...data.confirmationCode];
      updatedCode[index] = value;
      setData({ ...data, confirmationCode: updatedCode });

      clearFieldError("confirmationCode");

      if (value && index < 5) {
        confirmationCodeRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Prevent spaces at the beginning
    if (value.startsWith(" ")) {
      return;
    }

    setData({ ...data, password: value });
    validatePassword(value);
    clearFieldError("password");
  };

  const handlePasteOtp = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("text");

    if (/^\d{6}$/.test(pastedData)) {
      const updatedCode = pastedData.split("");
      setData({ ...data, confirmationCode: updatedCode });
      clearFieldError("confirmationCode");

      // Automatically focus on the last field
      confirmationCodeRefs.current[5]?.focus();
    }
  };

  const handleCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const updatedCode = [...data.confirmationCode];
      if (!updatedCode[index] && index > 0) {
        confirmationCodeRefs.current[index - 1]?.focus();
      }
      updatedCode[index] = "";
      setData({ ...data, confirmationCode: updatedCode });
    }
    if (e.key === "ArrowLeft" && index > 0) {
      confirmationCodeRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      confirmationCodeRefs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(e.type === "focus" ? e.target.name : "");
  };

  const validatePassword = (password: string) => {
    setPasswordValidations({
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      isMinLength: password.length >= 8,
      isMaxLength: password.length <= 24 && password.length > 0, // <-- Add this
    });
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newError: any = { ...initialFormData, confirmationCode: "" };

    // Validation for confirmation code
    if (data.confirmationCode.some((code: any) => !code)) {
      newError.confirmationCode = "Please enter the confirmation code.";
      isValid = false;
    }

    // Validation for password
    if (!data.password) {
      newError.password = "Please enter your password.";
      isValid = false;
    } else if (
      !passwordValidations.hasLowercase ||
      !passwordValidations.hasUppercase ||
      !passwordValidations.hasNumber ||
      !passwordValidations.hasSpecialChar ||
      !passwordValidations.isMinLength ||
      !passwordValidations.isMaxLength
    ) {
      newError.password = "Password does not meet the required criteria.";
      isValid = false;
    }
    // Validation for confirm password
    if (!data.confirmPassword) {
      newError.confirmPassword = "Please enter your confirm password.";
      isValid = false;
    } else if (data.password !== data.confirmPassword) {
      newError.confirmPassword =
        "The passwords you entered do not match. Please try again.";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleSubmit = async () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
    if (!validateForm()) return;

    setIsLoading(true);
  };
  const startTimer = () => {
    setIsResendDisabled(true);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setIsResendDisabled(false);
          return 30; // Reset to 30 seconds
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {};

  return (
    <div className="space-y-6">
      {/* <OtpVerifyForm /> */}
      <div className="block max-w-[330px] sm:max-w-[368px] xl:max-w-[534px] mx-auto">
        <div className="flex gap-2 sm:gap-4 justify-center">
          {data.confirmationCode.map((value: any, index: any) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              ref={(el: any) => (confirmationCodeRefs.current[index] = el)}
              maxLength={1}
              value={value}
              onChange={(e) => handleCodeChange(e, index)}
              onKeyDown={(e) => handleCodeKeyDown(e, index)}
              onFocus={handleFocus}
              onPaste={handlePasteOtp} // Add this
              className={`w-12 h-12 xl:w-[76px] xl:h-[60px] text-cyanBlue bg-white text-center text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-darkBlue1 ${
                error.confirmationCode && "border-red-500"
              }`}
            />
          ))}
        </div>
        {error.confirmationCode && (
          <p className="text-left   text-red-500 text-sm mt-2">
            {error.confirmationCode}
          </p>
        )}
        <div className="flex items-center justify-center my-5">
          <button
            type="button"
            className="bg-gradient-to-r from-[#4E88F0] to-[#7F71FC] bg-clip-text text-transparent text-base font-medium"
            onClick={handleResendOtp}
            disabled={isResendDisabled}
          >
            {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
        </div>
      </div>

      {/* Password Input */}
      <div className="relative flex items-center justify-start w-full">
        <CustomLabelInput
          name="password"
          type={isPwdVisible ? "text" : "password"}
          value={data.password}
          placeholder="New Password"
          onChange={handlePasswordChange}
          onFocus={handleFocus}
          onBlur={handleFocus}
          error={error.password}
          className={`w-full px-4 py-2 border ${
            error.password ? "border-red-500" : ""
          } rounded focus:outline-none ring-0 focus:ring-0`}
        />
        <button
          type="button"
          onClick={() => handlePwdVisibility("password")}
          className="absolute right-4 text-black dark:text-white top-4 mt-3 transform -translate-y-1/2 z-10"
        >
          {isPwdVisible ? (
            <BsEye className="text-2xl text-lightGray1" />
          ) : (
            <BsEyeSlash className="text-2xl text-lightGray1" />
          )}
        </button>
      </div>

      {/* Confirm Password Input */}
      <div className="relative flex items-center justify-start w-full">
        <CustomLabelInput
          name="confirmPassword" // ✅ Fixed name
          type={isCnPwdVisible ? "text" : "password"}
          value={data.confirmPassword}
          placeholder="Confirm Password"
          onChange={(e) => {
            const newValue = e.target.value.replace(/^\s+/, ""); // Removes leading spaces
            setData({ ...data, confirmPassword: newValue });

            // Clear error message when user starts typing
            clearFieldError("confirmPassword");
          }}
          onFocus={handleFocus}
          onBlur={handleFocus}
          error={error.confirmPassword}
          className={`w-full px-4 py-2 border ${
            error.confirmPassword ? "border-red-500" : ""
          } rounded focus:outline-none ring-0 focus:ring-0`}
        />
        <button
          type="button"
          onClick={() => handlePwdVisibility("confirmPassword")}
          className="absolute right-4 text-black dark:text-white top-4 mt-3 transform -translate-y-1/2 z-10"
        >
          {isCnPwdVisible ? (
            <BsEye className="text-2xl text-lightGray1" />
          ) : (
            <BsEyeSlash className="text-2xl text-lightGray1" />
          )}
        </button>
      </div>
      <div className="mb-4 text-left">
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
              passwordValidations.isMaxLength
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {passwordValidations.isMaxLength ? "✔" : "✘"} Maximum 24 characters
          </li>
        </ul>
      </div>
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-btnBgGradient1 relative mt-8 h-[42px] text-lg font-medium  text-white py-1 px-4 rounded-full hover:from-primary hover:to-purpal focus:outline-none focus:ring-0 shadow-none outline-none"
      >
        <span className="relative z-10">
          {isLoading ? "Loading..." : "Reset Password"}
        </span>
        {isClicked && (
          <span className="absolute inset-0 bg-white/20 animate-pulse"></span>
        )}
      </button>
    </div>
  );
};

export default CreatePasswordForm;
