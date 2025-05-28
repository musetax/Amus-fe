"use client";
import CustomLabelInput from "@/components/common/customLabelInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FormEvent, ChangeEvent, FocusEvent, useEffect } from "react";
const LoginForm = () => {
  const router = useRouter();
  const initValue = {
    email: "",
    password: "",
    remember: false,
  };
  const [isFocused, setIsFocused] = useState<string>("");
  const [isPwdVisible, setPwdVisible] = useState(false);
  const [data, setData] = useState(initValue);
  const [error, setError] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const captchaRef = useRef<any>(null);
  const [captchaError, setCaptchaError] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handlePwdVisibility = () => {
    setPwdVisible((prev) => !prev);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: name === "remember" ? checked : value.trim(),
    }));
    setError((prevError) => ({ ...prevError, [name]: "" }));
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(e.type === "focus" ? e.target.name : "");
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/signup");
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
  };

  const handleSubmitClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <CustomLabelInput
          iconAlt="Email Icon"
          name="email"
          type="text"
          value={data.email}
          placeholder="Email"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleFocus}
          error={error?.email}
          className={`w-full px-4 py-2 border ${
            error.email ? "border-red-500" : ""
          } rounded focus:outline-none ring-0`}
        />
      </div>

      {/* Password Field */}
      <div>
        <div className="relative flex items-center justify-start w-full">
          <CustomLabelInput
            name="password"
            type={isPwdVisible ? "text" : "password"}
            value={data.password}
            placeholder="Password"
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleFocus}
            error={error?.password}
            className={`w-full pl-4 pr-14 py-2 border ${
              error.password ? "border-red-500" : ""
            } rounded focus:outline-none ring-0`}
          />
          <button
            key={isPwdVisible ? "eye" : "eye-slash"}
            type="button"
            onClick={handlePwdVisibility}
            className="absolute right-4 text-black dark:text-white top-4 mt-3 transform -translate-y-1/2 z-10"
          >
            <span>
              {isPwdVisible ? (
                <BsEye className="text-2xl text-lightGray1 " />
              ) : (
                <BsEyeSlash className="text-2xl text-lightGray1" />
              )}
            </span>
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center">
          {/* <input
            type="checkbox"
            id="keep-logged-in"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="keep-logged-in"
            className="ml-2 block text-base md:text-lg font-normal text-textgray"
          >
            Keep me logged in
          </label> */}
        </div>
        <Link
          href="/forgotPassword"
          className=" text-primaryColor text-base md:text-lg font-medium"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        onClick={handleSubmitClick}
        type="submit"
        className="w-full bg-btnBgGradient1 mt-8 h-[42px] text-lg font-medium  text-white py-1 px-4 rounded-full hover:from-primary hover:to-purpal relative focus:outline-none focus:ring-0 shadow-none outline-none"
        disabled={isLoading}
      >
        <span className="relative z-10">
          {isLoading ? "Signing In..." : " Sign In"}
        </span>
        {isClicked && (
          <span className="absolute inset-0 bg-white/20 animate-pulse"></span>
        )}
      </button>
      <div
        className={`text-base xl:text-lg font-normal flex items-center gap-1 justify-center mt-6 text-textgray `}
      >
        Don't have an account?
        <button
          onClick={handleClick}
          className="relative after:border-b after:border-b-[#4E88F0] after:absolute after:bottom-[4px] after:left-0 after:right-0 bg-gradient-to-r from-[#4E88F0] to-[#7F71FC] bg-clip-text text-transparent text-base md:text-lg font-medium"
        >
          {" "}
          Sign up
        </button>
      </div>
    </form>
  );
};
export default LoginForm;
