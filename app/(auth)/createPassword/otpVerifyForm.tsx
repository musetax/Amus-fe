"use client";
import { Key, useEffect, useState } from "react";

const OtpVerifyForm = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(59);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };
  return (
    <div className="block">
      <div className="flex gap-2 sm:gap-4 justify-center">
        {otp.map(
          (
            data: string | number | readonly string[] | undefined,
            index: Key | null | undefined
          ) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={data || ""}
              onChange={(e) =>
                handleChange(e.target as HTMLInputElement, index as number)
              }
              onFocus={(e) => e.target.select()}
              className="w-12 h-12 xl:w-[76px] xl:h-[60px] bg-white text-cyanBlue text-center text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-darkBlue1"
            />
          )
        )}
      </div>
      <div className="flex items-center justify-center my-5">
        <button className="bg-gradient-to-r from-[#4E88F0] to-[#7F71FC] bg-clip-text text-transparent text-base font-medium">
          Resend OTP
        </button>
      </div>
    </div>
  );
};
export default OtpVerifyForm;
