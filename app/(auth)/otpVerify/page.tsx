"use client";
import MainLogo from "public/images/newAuth/main-logo.svg";
import WelcomeFrontImg from "public/images/newAuth/otp-front-img.png";
import AuthView from "@/components/common/authView";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const OtpVerification = () => {
  const router = useRouter();
  const email = localStorage.getItem("VerifyOtp");

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isClicked, setIsClicked] = useState(false);

  const handleResendOtp = async () => {};
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let value = e.target.value;

    if (value.match(/[^0-9]/)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear global error if it's set
    if (error) {
      setError("");
    }

    // Focus next input if current one is filled
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
    setLoading(true);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();

    // Ensure only digits are pasted and fit within the OTP length
    if (/^\d+$/.test(pasteData) && pasteData.length <= otp.length) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);

      // Focus the next empty input after the pasted digits
      const nextIndex =
        pasteData.length < otp.length ? pasteData.length : otp.length - 1;
      inputRefs.current[nextIndex]?.focus();

      // Clear any existing error
      if (error) {
        setError("");
      }
    } else {
      setError("Please paste a valid numeric OTP.");
    }
  };
  const goBack = () => {
    router.push("/signin");
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap bg-white">
      <div className="w-full xl:w-1/2 hidden xl:block">
        <AuthView
          title="Welcome"
          desc="Your trusted platform
          for seamless administration and security."
          imgSrc={WelcomeFrontImg}
        />
      </div>
      <div className="w-full xl:w-1/2 px-4 py-5 xl:p-20">
        <div className="flex items-center justify-between w-full">
          <Link href="/">
            <Image src={MainLogo} width={152} height={40} alt="icon" />
          </Link>
        </div>

        <div className="mt-10 xl:mt-[100px] max-w-[560px] mx-auto xl:ml-0 flex items-center justify-center">
          <div className="bg-white py-8 rounded-lg w-full">
            <div className="mb-12">
              <h1 className="text-2xl xl:text-[40px] xl:leading-[44px] font-semibold text-cyanBlue mb-3">
                OTP Verification
              </h1>
              <p className="text-textgray text-base xl:text-lg my-0">
                Enter the OTP sent to <b>{email}</b> for verification.
              </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div className="flex gap-2 sm:gap-4 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                    maxLength={1}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`w-12 h-12 xl:w-[76px] bg-white xl:h-[60px] text-cyanBlue text-center text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                      error ? "border-red-500" : "border-gray-300"
                    }`}

                    // className={`w-12 h-12 text-center text-lg outline-none transition-colors text-black dark:text-white duration-300 bg-[#F5F8FF] dark:bg-gray-700 font-semibold border rounded-lg ${
                    //   error ? "border-red-500" : "border-gray-300"
                    // }`}
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full relative bg-btnBgGradient1 mt-8 h-[42px] text-lg font-medium  text-white py-1 px-4 rounded-full hover:from-primary hover:to-purpal focus:outline-none focus:ring-0 shadow-none outline-none"
              >
                <span className="relative z-10">
                  {loading ? "Verifying..." : "Verify"}
                </span>
                {isClicked && (
                  <span className="absolute inset-0 bg-white/20 animate-pulse"></span>
                )}
              </button>
            </form>
            <div className="flex justify-between items-center mt-12">
              {/* <div
                className={`text-base xl:text-lg flex items-center justify-end gap-1 font-normal text-textgray
                  ${
                  isResendDisabled ? "pointer-events-none opacity-50" : ""
                }
                `}
              ></div */}
              <div className="text-center mt-4">
                <button
                  type="button" // Prevents form submission
                  onClick={handleResendOtp}
                  disabled={isResendDisabled}
                  className="bg-gradient-to-r from-[#4E88F0] to-[#7F71FC] bg-clip-text text-transparent  font-medium text-base xl:text-lg flex items-center gap-1 "
                >
                  {isResendDisabled
                    ? `Didn’t receive the OTP ${timer}s`
                    : "Resend OTP"}
                </button>
              </div>

              <div></div>
            </div>
            <div className="block mt-12 w-full flex justify-center items-center">
              {/* <Link href="/signin"> */}
              <div
                className="bg-gradient-to-r from-[#4E88F0] to-[#7F71FC] bg-clip-text text-transparent font-medium text-base mt-5 flex items-center gap-1 cursor-pointer"
                onClick={goBack}
              >
                <ArrowLeft />
                Back to Login
              </div>
              {/* </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OtpVerification;
