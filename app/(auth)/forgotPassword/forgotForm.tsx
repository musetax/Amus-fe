"use client";
import CustomLabelInput from "@/components/common/customLabelInput";
import { useRouter } from "next/navigation";
import { useState } from "react";

import React from "react";

const ForgotForm = () => {
  const router = useRouter();

  const initValue = {
    email: "",
  };
  const [isFocused, setIsFocused] = useState("");
  const [data, setData] = useState(initValue);
  const [error, setError] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  // useEffect(() => {
  //   const token = localStorage.getItem("authTokenMuse");

  //   if (token) {
  //     router.push("/");
  //   }
  // }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setData({ ...data, [e.target.name]: value });
    setError({ ...error, [e.target.name]: "" });
  };

  const handleOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.type === "focus") {
      setIsFocused(e.target.name);
    } else {
      setIsFocused("");
    }
  };

  const handleSubmit = async () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
    if (!data.email) {
      setError({ ...error, email: "Please enter your email address." });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      setError({ ...error, email: "Please enter a valid email address." });
      return;
    }

    setIsLoading(true);
  };

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <CustomLabelInput
          iconAlt="Email Icon"
          name="email"
          type="text"
          value={data.email}
          placeholder="Email"
          onChange={handleChange}
          onFocus={handleOnFocus}
          onBlur={handleOnFocus}
          error={error?.email}
          className={`w-full px-4 py-2 border ${
            error.email ? "border-red-500" : ""
          } rounded focus:outline-none ring-0`}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-btnBgGradient1 mt-0 h-[42px] text-lg font-medium  text-white py-1 px-4 rounded-full hover:from-primary hover:to-purpal relative focus:outline-none focus:ring-0 shadow-none outline-none"
        disabled={isLoading}
      >
        <span className="relative z-10">
          {isLoading ? "Loading..." : "Reset Password"}
        </span>
        {isClicked && (
          <span className="absolute inset-0 bg-white/20 animate-pulse"></span>
        )}
      </button>
    </form>
  );
};
export default ForgotForm;
