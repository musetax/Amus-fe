"use client";
import { Asterisk } from "lucide-react";
import React, { ChangeEvent, FocusEvent, useState } from "react";

interface IconInputProps {
  icon?: string;
  iconAlt?: string;
  name: string;
  value?: string;
  type?: string;
  className?: string;
  parentClass?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  error?: string;
  readOnly?: boolean; // ✅ Add this line
}

const CustomLabelInput: React.FC<IconInputProps> = ({
  name,
  value,
  type = "text",
  className,
  placeholder,
  onChange,
  onBlur,
  onFocus,
  parentClass,
  error,
  readOnly,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  const labelStyle: React.CSSProperties = {
    position: "absolute",
    left: isFocused || value ? "5px" : "16px",
    top: isFocused || value ? "-10px" : "50%",
    transform: isFocused || value ? "translateY(0)" : "translateY(-50%)",
    fontSize: isFocused || value ? "14px" : "18px",
    fontWeight: isFocused || value ? "600" : "500",
    transition: "all 0.3s ease-in-out",
    backgroundColor: isFocused || value ? "white" : "transparent",
    padding: isFocused || value ? "0 4px" : "0",
    color: isFocused || value ? "#042567" : "#52628280",
  };

  return (
    <>
      <div className="relative w-full">
        <div className={`relative w-full `}>
          {placeholder && (
            <label
              htmlFor={name}
              style={labelStyle}
              className={`flex items-start`}
            >
              {placeholder}{" "}
            </label>
          )}
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            className={`w-full h-14 border rounded-xl px-5 outline-none ring-0 shadow-none focus:outline-none focus:ring-0 text-base transition-colors duration-300 
               bg-white text-[#042567]  font-medium
              ${className} ${
              isFocused || value ? "border-[#5B77B1]" : "border-lightgray"
            }`}
            placeholder={isFocused ? "" : ""}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-label={name}
            readOnly={readOnly} // ✅ Apply it here
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm font-primary text-left">{error}</p>
        )}
      </div>
    </>
  );
};

export default CustomLabelInput;
