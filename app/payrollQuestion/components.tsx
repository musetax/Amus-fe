import React, { useState, useEffect, useRef } from "react";
import CheckboxDeductions from "../checkBox";
import {
  TaxUserMessageProps,
  TaxBotMessageProps,
  TaxInputFieldProps,
  SummaryCardProps,
  MessageContent,
} from "./types";
import { SendHorizontalIcon, TooltipIconButton, CompanyLogo } from "./icons";
import { formatTime } from "./utils";
import Image from "next/image";

// Tax User Message Component
export const TaxUserMessage: React.FC<TaxUserMessageProps> = ({
  message,
  image,
}) => {
  const time = formatTime(message.createdAt || Date.now());

  return (
    <div className="grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 [&:where(>*)]:col-start-2 w-full max-w-[var(--thread-max-width)] py-2">
      <div style={{ minWidth: "70px" }}>
        <div className="flex flex-col items-end col-start-1 row-start-2 mr-3 mt-2.5"></div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "end",
          gap: "8px",
          alignItems: "start",
          paddingLeft: "16px",
          paddingRight: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
          }}
        >
          <div className="bg_custom max-w-[calc(var(--thread-max-width)*0.8)] text-sm break-all break-words rounded-3xl px-5 py-2.5 col-start-2 row-start-2">
            <pre
              className="whitespace-normal text-white"
              style={{ fontSize: "14px", fontWeight: "normal" }}
            >
              {typeof message.content === "string" ? message.content : ""}
            </pre>
          </div>
          <span
            style={{ color: "#45556c", fontSize: "12px", marginTop: "4px" }}
          >
            {time}
          </span>
        </div>
        {image ? (
          <Image
            width={25}
            height={25}
            style={{
              width: "25px",
              height: "25px",
              minHeight: "25px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
            src={image}
            alt="useIcon"
          />
        ) : (
          <Image
            width={25}
            height={25}
            style={{
              width: "25px",
              height: "25px",
              minHeight: "25px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
            src="https://i.ibb.co/Ty3Grj0/dummy-Icon.png"
            alt="useIcon"
          />
        )}
      </div>
    </div>
  );
};

// Tax Bot Message Component
export const TaxBotMessage: React.FC<TaxBotMessageProps> = ({
  message,
  isLast,
  onOptionSelect,
  onInputSubmit,
  currentStep,
  isTyping,
  error,
  companyLogo,
  inputKey,
}) => {
  const time = formatTime(message.createdAt || Date.now());

  return (
    <>
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
            width: "100%",
            paddingLeft: "16px",
            paddingRight: "10px",
          }}
        >
          <span
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#ffffff",
              borderRadius: "50%",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #518DE7",
              position: "relative",
              top: "14px",
            }}
          >
            <CompanyLogo src={companyLogo} />
          </span>
          <div className="grid grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] relative w-full max-w-[var(--thread-max-width)] py-4 pr-2">
            <div className="text-foreground break-words leading-7 col-span-2 col-start-2 row-start-1 my-1.5">
              <pre
                className="whitespace-normal text-sm"
                style={{ color: "#31333f", fontSize: 14 }}
              >
                {typeof message.content === "object"
                  ? (message.content as MessageContent).content
                  : message.content}
              </pre>

              {message.options && isLast && !isTyping && (
                <div
                  className="mt-4 space-y-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  {message.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onOptionSelect(option.value)}
                      className="block py-2 px-4 text-left text-sm bg-white text-gray-900 rounded-2xl hover:bg-blue-50 hover:border-blue-400 active:scale-95 transition-all duration-150 font-medium border border-gray-200 shadow-sm hover:shadow"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              {typeof message.content === "object" &&
                (message.content as MessageContent).selectType ===
                  "drop-down" &&
                isLast &&
                !isTyping && (
                  <div className="mt-4">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          if (e.target.value === "Other") {
                            const customValue = prompt(
                              "Please enter your custom pay frequency:"
                            );
                            if (customValue && customValue.trim()) {
                              onInputSubmit(customValue);
                            }
                          } else {
                            onInputSubmit(e.target.value);
                          }
                          e.target.value = "";
                        }
                      }}
                      className="w-full px-4 py-1 bg-white border border-gray-300 h-10 rounded-2xl focus:outline-none focus:ring-0 outline-none text-gray-900"
                      defaultValue=""
                    >
                      <option value="" disabled hidden>
                        {(message.content as MessageContent).placeholder}
                      </option>
                      {(message.content as MessageContent).options?.map(
                        (option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}
              {typeof message.content === "object" &&
                (message.content as MessageContent).selectType === "dropdown" &&
                isLast &&
                !isTyping && (
                  <div className="mt-4">
                    {/* <select
                      onChange={(e) => {
                        if (e.target.value) {
                          if (e.target.value === "Other") {
                            const customValue = prompt(
                              "Please enter your custom pay frequency:"
                            );
                            if (customValue && customValue.trim()) {
                              onInputSubmit(customValue);
                            }
                          } else {
                            onInputSubmit(e.target.value);
                          }
                          e.target.value = "";
                        }
                      }}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        {(message.content as MessageContent).placeholder}
                      </option>
                      {(message.content as MessageContent).options?.map(
                        (option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        )
                      )}
                    </select> */}
                    <div
                      className="mt-0 space-y-2"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      {(message.content as MessageContent).options?.map(
                        (option) => (
                          <button
                            key={option.value}
                            onClick={() => onOptionSelect(option.value)}
                            className="block py-2 px-4 text-left text-sm bg-white text-gray-900 rounded-2xl hover:bg-blue-50 hover:border-blue-400 active:scale-95 transition-all duration-150 font-medium border border-gray-200 whitespace-nowrap shadow-sm hover:shadow"
                          >
                            {option.label}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

              {typeof message.content === "object" &&
                (message.content as MessageContent).selectType === "checkbox" &&
                isLast &&
                !isTyping && (
                  <CheckboxDeductions
                    options={(message.content as MessageContent).options || []}
                    onSubmit={(selectedDeductions) => {
                      if (selectedDeductions.length === 0) {
                        onInputSubmit("skip");
                      } else {
                        onInputSubmit(JSON.stringify(selectedDeductions));
                      }
                    }}
                  />
                )}

              <span
                style={{ color: "#45556c", fontSize: "12px", marginTop: "4px" }}
              >
                {time}
              </span>

              {typeof message.content === "object" &&
                (message.content as MessageContent).inputType &&
                isLast &&
                currentStep !== "filing_status" &&
                currentStep !== "complete" &&
                !isTyping && (
                  <div
                    className="space-y-2"
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      padding: "0 0px",
                    }}
                  >
                    <TaxInputField
                      key={inputKey}
                      type={(message.content as MessageContent).inputType!}
                      placeholder={
                        (message.content as MessageContent).placeholder!
                      }
                      onSubmit={onInputSubmit}
                    />
                    {error && (
                      <div
                        className="mt-2 text-red-600 text-sm"
                        style={{
                          color: "#dc2626",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {error}
                      </div>
                    )}
                    <div className="flex items-center justify-center mt-2">
                      {(currentStep === "additional_income" ||
                        currentStep === "deductions" ||
                        currentStep === "dependents" ||
                        currentStep === "start_pay_date" ||
                        currentStep === "current_date" ||
                        currentStep === "pre_tax_deductions" ||
                        currentStep === "post_tax_deductions") && (
                        <button
                          onClick={() => onInputSubmit("skip")}
                          className="text-sm text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
                        >
                          Skip this question
                        </button>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Tax Input Field Component
export const TaxInputField: React.FC<TaxInputFieldProps> = ({
  type,
  placeholder,
  onSubmit,
}) => {
  const [value, setValue] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Real-time validation
  const validateInput = (val: string, inputType: string): string => {
    if (!val.trim()) return "";

    switch (inputType) {
      case "number":
        const num = parseFloat(val);
        if (isNaN(num)) return "Please enter a valid number";
        if (num < 0) return "Value cannot be negative";
        if (num > 1000000) return "Value seems too large";
        break;
      case "date":
        const date = new Date(val);
        const today = new Date();
        if (isNaN(date.getTime())) return "Please enter a valid date";
        if (date > today) return "Date cannot be in the future";
        break;
      case "text":
        // ZIP code validation if it looks like a ZIP
        if (/^\d{5}/.test(val)) {
          const zipRegex = /^\d{5}(-\d{4})?$/;
          if (!zipRegex.test(val))
            return "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)";
        }
        break;
    }
    return "";
  };

  const handleSubmit = (): void => {
    if (!value.trim()) return;

    const error = validateInput(value, type);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError("");
    onSubmit(value);
    // Value will be cleared by key change on success, preserved on error
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (type === "number" && Number(newValue) < 0) {
      return;
    }

    setValue(newValue);

    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError("");
    }

    // Show real-time feedback for obvious errors
    if (newValue.trim()) {
      const error = validateInput(newValue, type);
      if (error && newValue.length > 3) {
        // Only show after some input
        setValidationError(error);
      }
    }
  };

  const hasError = !!validationError;
  const borderColor = hasError ? "border-red-300" : "border-[#E9E9E9]";

  return (
    <div className="mt-4">
      <div
        className={`focus-within:border-ring/20 flex w-full flex-wrap items-end rounded-full border ${borderColor} bg-inherit px-2.5 py-0 shadow-sm transition-colors ease-in gap-2 bg-white`}
      >
        <input
          ref={inputRef}
          type={type}
          value={value}
          onWheel={(e) => {
            if (type === "number") {
              (e.target as HTMLInputElement).blur();
            }
          }}
          onKeyDown={(e) => {
            if (
              type === "number" &&
              (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+")
            ) {
              e.preventDefault();
            }
          }}
          min={type === "number" ? 0 : undefined}
          max={
            type === "date" ? new Date().toISOString().split("T")[0] : undefined
          }
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="placeholder:text-muted-foreground custom_input flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
          aria-invalid={hasError}
          aria-describedby={hasError ? "input-error" : undefined}
        />
        <TooltipIconButton
          tooltip="Send"
          variant="default"
          className="my-2.5 size-8 p-0 rounded-full transition-opacity ease-in"
          onClick={handleSubmit}
          disabled={!value.trim() || hasError}
        >
          <SendHorizontalIcon />
        </TooltipIconButton>
      </div>
      {hasError && (
        <p id="input-error" className="mt-2 text-xs text-red-600" role="alert">
          {validationError}
        </p>
      )}
    </div>
  );
};

// Summary Card Component
export const SummaryCard: React.FC<SummaryCardProps> = ({
  icon: Icon,
  title,
  value,
  color,
}) => (
  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm">
    <div className="flex items-center gap-2">
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color}`}
      >
        <Icon />
      </div>
      <div>
        <p className="text-xs text-gray-600 uppercase tracking-wide">{title}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);
