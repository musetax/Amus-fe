import React, { useState, useEffect, useRef } from "react";
import CheckboxDeductions from './checkBox'


const SendHorizontalIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    color="inherit"
    className="e1t4gh341 st-emotion-cache-1f3w014 ex0cdmw0"
  >
    <rect width="24" height="24" fill="none"></rect>
    <path d="M3 5.51v3.71c0 .46.31.86.76.97L11 12l-7.24 1.81c-.45.11-.76.51-.76.97v3.71c0 .72.73 1.2 1.39.92l15.42-6.49c.82-.34.82-1.5 0-1.84L4.39 4.58C3.73 4.31 3 4.79 3 5.51z"></path>
  </svg>
);

const TooltipIconButton: React.FC<{
  tooltip: string;
  variant?: string;
  size?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, disabled, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-1 rounded hover:bg-gray-100 transition-colors ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
  >
    {children}
  </button>
);

interface payload {
  payroll: TaxData;
  // paycheck: paycheck;
}

interface TaxData {
  age?: string;
  income_type: string;
  annual_salary: string;
  filing_status: string;
  pay_frequency: string;
  current_withholding_per_paycheck: string;
  spouse_income?: string;
  additional_yesorno?: string;
  additional_income?: string;
  standard_deduction?: string;
  deductions?: string;
  dependents_yesorno?: string;
  dependents?: string;
  current_date?: string;
  home_address?: string;
  work_address?: string;
}

interface paycheck {
  income_type: string;
  salary: string;
  filing_status: string;
  pay_frequency: string;
  spouse_income?: string;
  dependents?: string;
  home_address?: string;
  work_address?: string;
  age?: number;
  pre_tax_deductions?: string;
  post_tax_deduction?: string;
}

interface TaxChatbotProps {
  onComplete?: (taxData: payload) => void;
  onContinueToChat?: () => void;
  image?: string;
  companyLogo?: string
  prefilledData?: Partial<TaxData>;
}

type Option = {
  label: string;
  value: string;
};

interface MessageContent {
  content?: string;
  inputType?: string;
  placeholder?: string;
  selectType?: string;
  options?: Option[];
}

interface Message {
  type: "bot" | "user";
  content: string | MessageContent;
  options?: Option[];
  inputType?: string;
  placeholder?: string;
  createdAt: Date;
}

interface FormData {
  filing_status: string | null;
  age: string | null;
  annual_salary: string | null;
  spouse_income: string | null;
  pay_frequency: string | null;
  current_withholding_per_paycheck: string | null;
  additional_yesorno: string | null;
  additional_income: string | null;
  standard_deduction: string | null;
  deductions: string | null;
  dependents_yesno: string | null;
  dependents: string | null;
  current_date: string | null;
  home_address: string | null;
  work_address: string | null;
}

interface TaxUserMessageProps {
  message: Message;
  image?: string;
}

interface TaxBotMessageProps {
  message: Message;
  isLast: boolean;
  onOptionSelect: (option: string) => void;
  onInputSubmit: (value: string) => void;
  currentStep: string;
  isTyping: boolean;
  error: string;
  companyLogo?: string
}

interface TaxInputFieldProps {
  type: string;
  placeholder: string;
  onSubmit: (value: string) => void;
}

interface SummaryCardProps {
  icon: React.ComponentType;
  title: string;
  value: string;
  color: string;
}

type StepType =
  | "filing_status"
  | "head_of_household"
  | "age"
  | "dependents_yesno"
  | "standard_deduction"
  | "annual_salary"
  | "spouse_income"
  | "pay_frequency"
  | "current_withholding"
  | "additional_yesorno"
  | "additional_income"
  | "deductions"
  | "dependents"
  | "current_date"
  | "work_address"
  | "home_address"
  | "complete"
  | "saved";


// Helper function to format time
const formatTime = (date: Date | number): string => {
  const d = new Date(date);
  return d
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace("AM", "AM")
    .replace("PM", "PM");
};

// Tax User Message Component
const TaxUserMessage: React.FC<TaxUserMessageProps> = ({ message, image }) => {
  const time = formatTime(message.createdAt || Date.now());

  return (
    <div className="grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 [&:where(>*)]:col-start-2 w-full max-w-[var(--thread-max-width)] py-2">
      <div style={{ minWidth: "70px" }}>
        <div className="flex flex-col items-end col-start-1 row-start-2 mr-3 mt-2.5">
          {/* <TooltipIconButton tooltip="Edit" variant="ghost" size="sm">
            <PencilIcon size={16} />
          </TooltipIconButton> */}
        </div>
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
          <img
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
          <img
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
const TaxBotMessage: React.FC<TaxBotMessageProps> = ({
  message,
  isLast,
  onOptionSelect,
  onInputSubmit,
  currentStep,
  isTyping,
  error,
  companyLogo
}) => {
  const time = formatTime(message.createdAt || Date.now());
  console.log(message, "=============-------------")
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
            {companyLogo ? <img
              src={companyLogo}
              width="60"
              height="41"
            /> :
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="41"
                viewBox="0 0 60 41"
                fill="none"
              >
                <path
                  d="M12.7905 7.42385L1.20752 31.1693C-0.502414 34.6745 1.17634 38.2925 4.9571 39.2503C8.73794 40.2081 13.189 38.1427 14.899 34.6375L26.482 10.892C28.192 7.38677 26.5131 3.76859 22.7323 2.81097C18.9515 1.85316 14.5005 3.91858 12.7905 7.42385Z"
                  fill="url(#paint0_linear_7768_1391)"
                />
                <path
                  d="M27.7745 7.0597L34.9048 21.6752C36.5827 25.1143 34.9357 28.6641 31.2263 29.6037C27.5169 30.5435 23.1499 28.5174 21.4722 25.0783L14.3417 10.4628C12.6637 7.02373 14.3107 3.47396 18.0201 2.53433C21.7295 1.59451 26.0967 3.62062 27.7745 7.0597Z"
                  fill="url(#paint1_linear_7768_1391)"
                />
                <path
                  d="M30.0391 7.08014L22.9286 21.6547C21.2453 25.1051 22.8975 28.6665 26.6189 29.6095C30.3406 30.5523 34.7221 28.5195 36.4055 25.0691L43.5158 10.4946C45.1993 7.04417 43.547 3.48272 39.8253 2.53993C36.1039 1.59696 31.7224 3.62975 30.0391 7.08014Z"
                  fill="url(#paint2_linear_7768_1391)"
                />
                <path
                  d="M45.5962 7.19045L57.2931 31.1693C59.0031 34.6746 57.3244 38.2927 53.5436 39.2504C49.7629 40.2082 45.3116 38.1427 43.6017 34.6375L31.9048 10.6586C30.1948 7.15337 31.8737 3.53519 35.6544 2.57757C39.435 1.61976 43.8864 3.68518 45.5962 7.19045Z"
                  fill="url(#paint3_linear_7768_1391)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_7768_1391"
                    x1="4.04851"
                    y1="38.9984"
                    x2="28.5694"
                    y2="6.83259"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#69DEC6" />
                    <stop offset="1" stop-color="#49C2D4" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_7768_1391"
                    x1="16.9186"
                    y1="3.08128"
                    x2="44.3829"
                    y2="35.4655"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#48C2D4" />
                    <stop offset="1" stop-color="#1595EA" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_7768_1391"
                    x1="25.1579"
                    y1="29.422"
                    x2="62.1925"
                    y2="-12.9475"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#1695EA" />
                    <stop offset="1" stop-color="#548CE7" />
                  </linearGradient>
                  <linearGradient
                    id="paint3_linear_7768_1391"
                    x1="36.5681"
                    y1="2.06437"
                    x2="61.2194"
                    y2="35.6826"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#518DE7" />
                    <stop offset="1" stop-color="#7687E5" />
                  </linearGradient>
                </defs>
              </svg>}
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
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {message.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onOptionSelect(option.value)}
                      className="block py-2 px-4 text-left text-sm bg-white text-gray-900 rounded-2xl hover:bg-gray-50 transition-colors font-medium border border-gray-200"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {typeof message.content === "object" &&
                (message.content as MessageContent).selectType === "dropdown" &&
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
                    </select>
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
                    <div className="flex items-center justify-center mt-1">
                      {(currentStep === "additional_income" ||
                        currentStep === "deductions" ||
                        currentStep === "dependents" ||
                        currentStep === "start_pay_date" ||
                        currentStep === "work_address" ||
                        currentStep === "home_address" ||
                        currentStep === "current_date") && (
                          <button
                            onClick={() => onInputSubmit("skip")}
                            className="p-0 font-medium"
                            style={{
                              background: "transparent",
                              color: "#518DE7",
                              textDecoration: "underline",
                              fontSize: "14px",
                            }}
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
const TaxInputField: React.FC<TaxInputFieldProps> = ({
  type,
  placeholder,
  onSubmit,
}) => {
  const [value, setValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (): void => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="mt-4">
      <div className="focus-within:border-ring/20 flex w-full flex-wrap items-end rounded-full border border-[#E9E9E9] bg-inherit px-2.5 py-0 shadow-sm transition-colors ease-in gap-2 bg-white">
        <input
          ref={inputRef}
          type={type}
          value={value}
          onWheel={(e) => {
            if (type === "number") {
              (e.target as HTMLInputElement).blur(); // ✅ Type cast to fix TS error
            }
          }}
          onKeyDown={(e) => {
            if (type === "number" && (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+")) {
              e.preventDefault(); // ⬅️ block minus, exponent, and plus
            }
          }}
          min={type === "number" ? 0 : undefined} // ⬅️ HTML-level restriction
          onChange={(e) => {
            // prevent negative values
            if (type === "number" && Number(e.target.value) < 0) {
              return;
            }
            setValue(e.target.value);
          }}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="placeholder:text-muted-foreground custom_input flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
        />
        <TooltipIconButton
          tooltip="Send"
          variant="default"
          className="my-2.5 size-8 p-0  rounded-full transition-opacity ease-in"
          onClick={handleSubmit}
          disabled={!value.trim()}
        >
          <SendHorizontalIcon />
        </TooltipIconButton>
      </div>
    </div>
  );
};

// Icon components for summary
const DollarSign: React.FC = () => <div className="text-white text-lg">💰</div>;
const User: React.FC = () => <div className="text-white text-lg">👤</div>;
const Heart: React.FC = () => <div className="text-white text-lg">💕</div>;
const Calendar: React.FC = () => <div className="text-white text-lg">📅</div>;
const CheckCircle: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`text-xl ${className}`}>✅</div>
);
const Home: React.FC = () => <div className="text-white text-lg">🏠</div>;

const SummaryCard: React.FC<SummaryCardProps> = ({
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

const TaxChatbot: React.FC<TaxChatbotProps> = ({
  onComplete,
  onContinueToChat,
  prefilledData = {},
  image = "",
  companyLogo
}) => {
  const getQuestionsToAsk = (): StepType[] => {
    const questions: StepType[] = [];

    if (!prefilledData.filing_status) {
      questions.push("filing_status");
    }
    if (!prefilledData.age) {
      questions.push('age')
    }
    // if(prefilledData)


    if (!prefilledData.annual_salary) {
      questions.push("annual_salary");
    }

    if (
      (prefilledData.filing_status === "Married" ||
        prefilledData.filing_status === "married_joint") &&
      !prefilledData.spouse_income
    ) {
      questions.push("spouse_income");
    }

    if (!prefilledData.pay_frequency) {
      questions.push("pay_frequency");
    }

    if (!prefilledData.current_withholding_per_paycheck) {
      questions.push("current_withholding");
    }

    questions.push("additional_yesorno");
    questions.push("additional_income");
    questions.push("standard_deduction");
    questions.push("deductions");
    questions.push("dependents_yesno");
    questions.push("dependents");
    questions.push("current_date");
    questions.push("work_address");
    questions.push("home_address");

    return questions;
  };

  const [questionsToAsk] = useState<StepType[]>(getQuestionsToAsk());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const [formData, setFormData] = useState<FormData>({
    filing_status: prefilledData.filing_status || null,
    age: prefilledData.age || null,
    annual_salary: prefilledData.annual_salary || null,
    spouse_income: prefilledData.spouse_income || null,
    pay_frequency: prefilledData.pay_frequency || null,
    current_withholding_per_paycheck:
      prefilledData.current_withholding_per_paycheck || null,
    additional_yesorno: prefilledData.additional_yesorno || null,
    additional_income: null,
    standard_deduction: prefilledData.standard_deduction || null,
    deductions: prefilledData.deductions || null,
    dependents_yesno: null,
    dependents: null,
    current_date: null,
    home_address: null,
    work_address: null,
  });

  const [currentStep, setCurrentStep] = useState<StepType>(
    questionsToAsk.length > 0 ? questionsToAsk[0] : "complete"
  );

  const generateInitialMessage = (): Message => {
    if (questionsToAsk.length === 0) {
      return {
        type: "bot",
        content:
          "Great! I see you already have all your tax information filled out. Let me show you a summary:",
        createdAt: new Date(),
      };
    }

    const prefilledCount = Object.values(prefilledData).filter(
      (value) => value && value !== ""
    ).length;
    let greeting = "Hi! I'm your tax information assistant.";

    if (prefilledCount > 0) {
      greeting += ` I can see you already have some tax information filled out. Let me collect the remaining details.`;
    } else {
      greeting +=
        " I'll help you collect the information needed for your tax calculation.";
    }

    switch (questionsToAsk[0]) {
      case "filing_status":
        return {
          type: "bot",
          content: `${greeting}\n\nLet's start with your filing status:`,
          options: [
            { label: "Single", value: "single" },
            { label: "Married", value: "married_joint" },
          ],
          createdAt: new Date(),
        };

      case "head_of_household":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nAre you the head of household?\nHead of Household is a filing status for unmarried persons with a qualified person.`,
            selectType: "dropdown",
            options: [
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ],
            placeholder: "Select Yes or No",
          },
          createdAt: new Date(),
        };

      case "age":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nPlease enter your age (must be between 13 and 100):`,
            inputType: "number",
            placeholder: "Enter your age",
          },
          createdAt: new Date(),
        };

      case "annual_salary":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nI need to know your annual salary:`,
            inputType: "number",
            placeholder: "Enter your annual salary (e.g., 75000)",
          },
          createdAt: new Date(),
        };

      case "spouse_income":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nSince you're married, I need your spouse's annual income:`,
            inputType: "number",
            placeholder: "Enter spouse annual income",
          },
          createdAt: new Date(),
        };

      case "pay_frequency":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nI need to know how often you get paid:`,
            selectType: "dropdown",
            options: [
              { label: "Weekly", value: "weekly" },
              { label: "Bi-weekly", value: "bi-weekly" },
              { label: "Semi-monthly", value: "semi-monthly" },
              { label: "Monthly", value: "monthly" },
            ],
            placeholder: "Select your pay frequency",
          },
          createdAt: new Date(),
        };

      case "current_withholding":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nWhat is your current withholding amount per paycheck?`,
            inputType: "number",
            placeholder: "Enter withholding amount per paycheck",
          },
          createdAt: new Date(),
        };

      case "additional_yesorno":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nDo you have any additional income?`,
            selectType: "dropdown",
            options: [
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ],
            placeholder: "Select Yes or No",
          },
          createdAt: new Date(),
        };

      case "additional_income":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nIf you have any additional income (e.g., freelance, investments, or rental), please enter the total amount. If not, you can skip this question.`,
            inputType: "number",
            placeholder: "Enter additional annual income or type 'skip'",
          },
          createdAt: new Date(),
        };

      case "standard_deduction":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nDo you want to take the standard deduction?`,
            selectType: "dropdown",
            options: [
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ],
            placeholder: "Select Yes or No",
          },
          createdAt: new Date(),
        };

      case "deductions":
        if (prefilledData.standard_deduction === "yes") {
          return {
            type: "bot",
            content: {
              content: `${greeting}\n\nSince you are taking the standard deduction, you can optionally select:`,
              selectType: "checkbox",
              options: [
                { label: "IRA Contribution", value: "ira_contribution" },
                { label: "Student Loan Interest", value: "student_loan_interest" },
              ],
              placeholder: "Select any that apply (optional)",
            },
            createdAt: new Date(),
          };
        } else {
          return {
            type: "bot",
            content: {
              content: `${greeting}\n\nWhich deductions apply to you? Select all that apply:`,
              selectType: "checkbox",
              options: [
                { label: "IRA Contribution", value: "ira_contribution" },
                { label: "Student Loan Interest", value: "student_loan_interest" },
                { label: "State or Local Tax", value: "state_local_tax" },
                { label: "Medical Expenses", value: "medical_expenses" },
                { label: "Other Deductions", value: "other_deduction" },
                { label: "Charitable Donations", value: "charitable_donation" },
                { label: "Home Mortgage Interest", value: "home_mortgage_interest" },
              ],
              placeholder: "Select all that apply",
            },
            createdAt: new Date(),
          };
        }

      case "dependents_yesno":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nDo you have any dependents?`,
            selectType: "dropdown",
            options: [
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ],
            placeholder: "Select Yes or No",
          },
          createdAt: new Date(),
        };

      case "dependents":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nHow many dependents do you have?`,
            selectType: "dropdown",
            options: [
              { label: "1", value: "1" },
              { label: "2", value: "2" },
              { label: "3", value: "3" },
              { label: "4", value: "4" },
              { label: "5", value: "5" },
            ],
            placeholder: "Select number of dependents",
          },
          createdAt: new Date(),
        };

      case "current_date":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nWhat was the date of your last paycheck?`,
            inputType: "date",
            placeholder: "Select the date of your last paycheck",
          },
          createdAt: new Date(),
        };

      case "work_address":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nPlease enter your work ZIP code:`,
            inputType: "text",
            placeholder: "Enter work ZIP code",
          },
          createdAt: new Date(),
        };

      case "home_address":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nPlease enter your home ZIP code:`,
            inputType: "text",
            placeholder: "Enter home ZIP code",
          },
          createdAt: new Date(),
        };

      default:
        return {
          type: "bot",
          content: greeting,
          createdAt: new Date(),
        };
    }
  };


  const [messages, setMessages] = useState<Message[]>([
    generateInitialMessage(),
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (questionsToAsk.length === 0) {
      setCurrentStep("complete");
    }
  }, [questionsToAsk.length]);

  const addMessage = (
    type: "bot" | "user",
    content: string | MessageContent
  ): void => {
    setIsTyping(true);
    setTimeout(
      () => {
        setMessages((prev) => [
          ...prev,
          {
            type,
            content,
            createdAt: new Date(),
          },
        ]);
        setIsTyping(false);
      },
      type === "bot" ? 800 : 0
    );
  };

  const moveToNextQuestion = (data: typeof formData): void => {
    let nextIndex = currentQuestionIndex + 1;

    // Keep looping until you find a valid next question
    while (nextIndex < questionsToAsk.length) {
      const nextStep = questionsToAsk[nextIndex];
      console.log(nextStep, "]]]]]]]]]]]", data);

      // Skip "additional_income" if user said no
      if (nextStep === "additional_income" && data.additional_yesorno === "no") {
        nextIndex++;
        continue;
      }

      // Skip "dependents" if user said no
      if (nextStep === "dependents" && data.dependents_yesno === "no") {
        nextIndex++;
        continue;
      }

      // Found a valid next question
      break;
    }

    // If no more questions left, show completion message
    if (nextIndex >= questionsToAsk.length) {
      addMessage(
        "bot",
        "Perfect! I have all the information I need. Let me summarize everything for you:"
      );
      setCurrentStep("complete");
      return;
    }

    // Move to the valid next question
    setCurrentQuestionIndex(nextIndex);
    const nextStep = questionsToAsk[nextIndex];
    setCurrentStep(nextStep);

    // Handle the next message based on question type
    switch (nextStep) {
      case "head_of_household":
        addMessage("bot", {
          content:
            "Are you the head of household?\nHead of Household is a filing status for unmarried persons with a qualified person.",
          selectType: "dropdown",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
          placeholder: "Select Yes or No",
        });
        break;

      case "age":
        addMessage("bot", {
          content: "Please enter your age (must be between 13 and 100):",
          inputType: "number",
          placeholder: "Enter your age",
        });
        break;

      case "annual_salary":
        addMessage("bot", {
          content:
            "Perfect! Now I need to know your annual salary to calculate your tax information accurately.",
          inputType: "number",
          placeholder: "Enter your annual salary (e.g., 75000)",
        });
        break;

      case "spouse_income":
        addMessage("bot", {
          content:
            "Since you're married, I also need your spouse's annual income.",
          inputType: "number",
          placeholder: "Enter spouse annual income",
        });
        break;

      case "pay_frequency":
        addMessage("bot", {
          content: "Great! Now I need to know how often you get paid.",
          selectType: "dropdown",
          options: [
            { label: "Weekly", value: "weekly" },
            { label: "Bi-weekly", value: "bi-weekly" },
            { label: "Semi-monthly", value: "semi-monthly" },
            { label: "Monthly", value: "monthly" },
          ],
          placeholder: "Select your pay frequency",
        });
        break;

      case "current_withholding":
        addMessage("bot", {
          content:
            "Finally, what is your current withholding amount per paycheck?",
          inputType: "number",
          placeholder: "Enter withholding amount per paycheck",
        });
        break;

      case "additional_yesorno":
        addMessage("bot", {
          content: "Do you have any additional income?",
          selectType: "dropdown",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
          placeholder: "Select Yes or No",
        });
        break;

      case "additional_income":
        addMessage("bot", {
          content:
            "If you have any additional income (e.g., freelance, investments, or rental), please enter the total amount. If not, you can skip this question.",
          inputType: "number",
          placeholder: "Enter additional annual income or type 'skip'",
        });
        break;

      case "standard_deduction":
        addMessage("bot", {
          content: "Do you want to take the standard deduction?",
          selectType: "dropdown",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
          placeholder: "Select Yes or No",
        });
        break;

      case "deductions":
        if (data.standard_deduction === "yes") {
          addMessage("bot", {
            content:
              "Since you are taking the standard deduction, you can optionally select:",
            selectType: "checkbox",
            options: [
              { label: "IRA Contribution", value: "ira_contribution" },
              { label: "Student Loan Interest", value: "student_loan_interest" },
            ],
            placeholder: "Select any that apply (optional)",
          });
        } else {
          addMessage("bot", {
            content: "Which deductions apply to you? Select all that apply:",
            selectType: "checkbox",
            options: [
              { label: "IRA Contribution", value: "ira_contribution" },
              { label: "Student Loan Interest", value: "student_loan_interest" },
              { label: "State or Local Tax", value: "state_local_tax" },
              { label: "Medical Expenses", value: "medical_expenses" },
              { label: "Other Deductions", value: "other_deduction" },
              { label: "Charitable Donations", value: "charitable_donation" },
              { label: "Home Mortgage Interest", value: "home_mortgage_interest" },
            ],
            placeholder: "Select all that apply",
          });
        }
        break;

      case "dependents_yesno":
        addMessage("bot", {
          content: "Do you have any dependents?",
          selectType: "dropdown",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
          placeholder: "Select Yes or No",
        });
        break;

      case "dependents":
        addMessage("bot", {
          content: "How many dependents do you have?",
          selectType: "dropdown",
          options: [
            { label: "One", value: "1" },
            { label: "Two", value: "2" },
            { label: "Three", value: "3" },
            { label: "Four", value: "4" },
            { label: "Five", value: "5" },
          ],
          placeholder: "Select number of dependents",
        });
        break;

      case "current_date":
        addMessage("bot", {
          content: "What was the date of your last paycheck?",
          inputType: "date",
          placeholder: "Select the date of your last paycheck",
        });
        break;

      case "work_address":
        addMessage("bot", {
          content: "Please enter your work ZIP code:",
          inputType: "text",
          placeholder: "Enter work ZIP code",
        });
        break;

      case "home_address":
        addMessage("bot", {
          content: "Please enter your home ZIP code:",
          inputType: "text",
          placeholder: "Enter home ZIP code",
        });
        break;
    }
  };




  const handleFilingStatusSelect = (status: string): void => {
    const updatedData = {
      ...formData,
      filing_status: status,
    };

    setFormData(updatedData);

    addMessage(
      "user",
      `I am ${status.toLowerCase() === "married_joint"
        ? "Married"
        : status.toLowerCase()
      }`
    );

    moveToNextQuestion(updatedData);
  };
  const [error, setError] = useState<string>("");

  const handleInputSubmit = (value: string): void => {
    setError("");
    if (!value.trim()) return;

    const isSkipped = value.toLowerCase() === "skip";
    const numValue = parseFloat(value);
    const today = new Date();

    switch (currentStep) {
      case "age":
        let ageValue = "";
        if (!isSkipped) {
          const age = parseInt(value, 10);

          if (isNaN(age) || age < 0) {
            setError("Age must be a positive number.");
            return;
          }
          if (age < 13 || age > 99) {
            setError("Please enter a valid age (13-99).");
            return;
          }

          ageValue = age.toString();
          addMessage("user", `I am ${age} years old`);
        } else {
          addMessage("user", "I'll skip this question");
        }

        const ageData = {
          ...formData,
          age: ageValue,
        };

        setFormData(ageData);
        moveToNextQuestion(ageData);
        break;
      case "annual_salary":
        if (!isSkipped) {
          if (isNaN(numValue) || numValue < 0) {
            setError("Annual salary must be a positive number.");
            return;
          }
          if (numValue > 500000) {
            setError("Annual salary cannot exceed $500,000.");
            return;
          }
        }

        const salaryData = {
          ...formData,
          annual_salary: isSkipped ? "" : numValue.toString(),
        };

        setFormData(salaryData);
        addMessage(
          "user",
          isSkipped
            ? "I'll skip this question"
            : `My annual salary is ${formatCurrency(numValue)}`
        );
        moveToNextQuestion(salaryData);
        break;

      case "spouse_income":
        if (!isSkipped) {
          if (isNaN(numValue) || numValue < 0) {
            setError("Spouse income must be a positive number.");
            return;
          }
          if (numValue > 500000) {
            setError("Spouse income cannot exceed $500,000.");
            return;
          }
        }

        const spouseData = {
          ...formData,
          spouse_income: isSkipped ? "" : numValue.toString(),
        };

        setFormData(spouseData);
        addMessage(
          "user",
          isSkipped
            ? "I'll skip this question"
            : `My spouse's annual income is ${formatCurrency(numValue)}`
        );
        moveToNextQuestion(spouseData);
        break;

      case "pay_frequency":
        const payFreqData = {
          ...formData,
          pay_frequency: isSkipped ? "" : value,
        };

        setFormData(payFreqData);
        addMessage(
          "user",
          isSkipped ? "I'll skip this question" : `I get paid ${value.toLowerCase()}`
        );
        moveToNextQuestion(payFreqData);
        break;

      case "current_withholding":
        if (!isSkipped) {
          if (isNaN(numValue) || numValue < 0) {
            setError("Withholding must be a positive number.");
            return;
          }
          if (
            formData.annual_salary &&
            numValue > Number(formData.annual_salary)
          ) {
            setError("Withholding cannot exceed your annual salary.");
            return;
          }
        }

        const withholdingData = {
          ...formData,
          current_withholding_per_paycheck: isSkipped ? "" : numValue.toString(),
        };

        setFormData(withholdingData);
        addMessage(
          "user",
          isSkipped
            ? "I'll skip this question"
            : `My current withholding is ${formatCurrency(numValue)} per paycheck`
        );
        moveToNextQuestion(withholdingData);
        break;

      case "additional_yesorno":
        const additionalYesNoData = {
          ...formData,
          additional_yesorno: value,
        };

        setFormData(additionalYesNoData);
        addMessage(
          "user",
          value === "yes"
            ? "Yes, I have additional income"
            : "No, I don't have additional income"
        );
        moveToNextQuestion(additionalYesNoData);
        break;

      case "additional_income":
        if (!isSkipped) {
          if (isNaN(numValue) || numValue < 0) {
            setError("Additional income must be a positive number.");
            return;
          }
          if (numValue > 500000) {
            setError("Additional income cannot exceed $500,000.");
            return;
          }
        }

        const additionalIncomeData = {
          ...formData,
          additional_income: isSkipped ? "" : numValue.toString(),
        };

        setFormData(additionalIncomeData);
        addMessage(
          "user",
          isSkipped
            ? "I'll skip this question"
            : `My additional annual income is ${formatCurrency(numValue)}`
        );
        moveToNextQuestion(additionalIncomeData);
        break;

      case "standard_deduction":
        const standardDeductionData = {
          ...formData,
          standard_deduction: value,
        };

        setFormData(standardDeductionData);
        addMessage(
          "user",
          value === "yes"
            ? "Yes, I want the standard deduction"
            : "No, I'll itemize"
        );
        moveToNextQuestion(standardDeductionData);
        break;

      case "deductions":
        let deductionsData;

        if (isSkipped || value === "skip") {
          deductionsData = {
            ...formData,
            deductions: [],
          };
          addMessage("user", "I'll skip deductions");
        } else {
          try {
            const parsedDeductions = JSON.parse(value);
            deductionsData = {
              ...formData,
              deductions: parsedDeductions,
            };

            const deductionSummary = parsedDeductions
              .map(
                (d: any) =>
                  `${d.type.replace(/_/g, " ")}: ${formatCurrency(
                    parseFloat(d.amount)
                  )}`
              )
              .join(", ");
            addMessage("user", `My deductions: ${deductionSummary}`);
          } catch (e) {
            setError("Invalid deduction data");
            return;
          }
        }

        setFormData(deductionsData);
        moveToNextQuestion(deductionsData);
        break;

      case "dependents_yesno":
        const dependentsYesNoData = {
          ...formData,
          dependents_yesno: value,
        };

        setFormData(dependentsYesNoData);
        addMessage(
          "user",
          value === "yes"
            ? "Yes, I have dependents"
            : "No, I don't have dependents"
        );
        moveToNextQuestion(dependentsYesNoData);
        break;

      case "dependents":
        if (!isSkipped) {
          if (isNaN(numValue) || numValue < 0) {
            setError("Dependents must be a positive number.");
            return;
          }
          if (numValue > 5) {
            setError("Dependents cannot exceed 5.");
            return;
          }
        }

        const dependentsData = {
          ...formData,
          dependents: isSkipped ? "" : numValue.toString(),
        };

        setFormData(dependentsData);
        addMessage(
          "user",
          isSkipped
            ? "I'll skip this question"
            : `I have ${numValue} dependent(s)`
        );
        moveToNextQuestion(dependentsData);
        break;

      case "current_date":
        if (!isSkipped) {
          const dateValue = new Date(value);
          if (isNaN(dateValue.getTime())) {
            setError("Please enter a valid date.");
            return;
          }
          if (dateValue > today) {
            setError("The date cannot be in the future.");
            return;
          }

          const formattedDate = dateValue.toISOString().split("T")[0];
          const currentDateData = {
            ...formData,
            current_date: formattedDate,
          };

          setFormData(currentDateData);
          addMessage(
            "user",
            `The date of my last paycheck was ${formattedDate}.`
          );
          moveToNextQuestion(currentDateData);
        } else {
          const currentDateSkippedData = {
            ...formData,
            current_date: "",
          };

          setFormData(currentDateSkippedData);
          addMessage("user", "I'll skip this question.");
          moveToNextQuestion(currentDateSkippedData);
        }
        break;

      case "work_address":
        if (!isSkipped) {
          const zipRegex = /^\d{5}(-\d{4})?$/;
          if (!zipRegex.test(value)) {
            setError(
              "Please enter a valid U.S. ZIP code (e.g., 12345 or 12345-6789)."
            );
            return;
          }

          const workAddressData = {
            ...formData,
            work_address: value,
          };

          setFormData(workAddressData);
          addMessage("user", `My work ZIP code is ${value}.`);
          moveToNextQuestion(workAddressData);
        } else {
          const workAddressSkippedData = {
            ...formData,
            work_address: "",
          };

          setFormData(workAddressSkippedData);
          addMessage("user", "I'll skip this question.");
          moveToNextQuestion(workAddressSkippedData);
        }
        break;

      case "home_address":
        if (!isSkipped) {
          const zip = value.trim();
          const zipRegex = /^\d{5}(-\d{4})?$/;
          if (!zipRegex.test(zip)) {
            setError(
              "Please enter a valid U.S. ZIP code (e.g., 12345 or 12345-6789)."
            );
            return;
          }

          const homeAddressData = {
            ...formData,
            home_address: zip,
          };

          setFormData(homeAddressData);
          addMessage("user", `My home ZIP code is ${zip}.`);
          moveToNextQuestion(homeAddressData);
        } else {
          const homeAddressSkippedData = {
            ...formData,
            home_address: "",
          };

          setFormData(homeAddressSkippedData);
          addMessage("user", "I'll skip this question.");
          moveToNextQuestion(homeAddressSkippedData);
        }
        break;

      default:
        break;
    }
  };


  // const resetChat = (): void => {
  //   const newQuestionsToAsk = getQuestionsToAsk();
  //   setMessages([generateInitialMessage()]);
  //   setCurrentStep(
  //     newQuestionsToAsk.length > 0 ? newQuestionsToAsk[0] : "complete"
  //   );
  //   setCurrentQuestionIndex(0);
  //   setFormData({
  //     filing_status: prefilledData.filing_status || null,
  //     annual_salary: prefilledData.annual_salary || null,
  //     spouse_income: prefilledData.spouse_income || null,
  //     pay_frequency: prefilledData.pay_frequency || null,
  //     current_withholding_per_paycheck:
  //       prefilledData.current_withholding_per_paycheck || null,
  //     // NEW: Reset optional fields ↓
  //     additional_income: null,
  //     deductions: null,
  //     dependents: null,
  //     current_date: null,
  //     work_address: prefilledData.work_address || null,
  //     home_address: prefilledData.home_address || null,
  //     // most_recent_pay_date: null,
  //   });
  //   setIsSaving(false);
  //   setSaveError(null);
  // };
  const formatCurrency = (amount: any) => {
    if (amount == null || amount === "") return "";

    // Convert to number if it's a string
    const num = Number(amount);
    // If still invalid, return empty string
    if (isNaN(num)) return "";

    if (num >= 1_000_000_000) {
      // Format as billions
      return `$${(num / 1_000_000_000).toFixed(1)}B`;
    } else if (num >= 1_000_000) {
      // Format as millions
      return `$${(num / 1_000_000).toFixed(1)}M`;
    }

    // Format normally for smaller amounts
    return `$${num.toLocaleString()}`;
  };


  const handleSaveTaxes = async (): Promise<void> => {
    setIsSaving(true);
    setSaveError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const taxDataToSave: payload = {
        payroll: {
          income_type: "salary",
          annual_salary: formData.annual_salary!,
          filing_status: formData.filing_status!,
          pay_frequency: formData.pay_frequency!,
          current_withholding_per_paycheck:
            formData.current_withholding_per_paycheck!,
          spouse_income: formData.spouse_income || undefined,
          // NEW: Include optional fields ↓
          additional_income: formData.additional_income || undefined,
          deductions: formData.deductions || undefined,
          dependents: formData.dependents || undefined,
          current_date: formData.current_date || undefined,
        },
        // paycheck: {
        //   income_type: "salary",
        //   salary: formData.annual_salary!,
        //   filing_status: formData.filing_status!,
        //   pay_frequency: formData.pay_frequency!,
        //   // current_withholding_per_paycheck: formData.current_withholding_per_paycheck!,
        //   spouse_income: formData.spouse_income || undefined,
        //   // NEW: Include optional fields ↓
        //   // additional_income: formData.additional_income || undefined,
        //   // deductions: formData.deductions || undefined,
        //   dependents: formData.dependents || undefined,
        //   // current_date: formData.current_date || undefined,
        //   home_address: formData.home_address || undefined,
        //   work_address: formData.work_address || undefined,
        //   age: undefined,
        // },
        // most_recent_pay_date: formData.most_recent_pay_date || undefined
      };

      if (onComplete) {
        onComplete(taxDataToSave);
      }

      setCurrentStep("saved");
    } catch (error) {
      console.error("Error saving tax information:", error);
      setSaveError("Failed to save your tax information. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinueToChat = (): void => {
    if (onContinueToChat) {
      onContinueToChat();
    }
  };

  return (
    <div className="bg-inherit" style={{ height: "calc(100vh - 138px)" }}>
      <div
        style={{
          height: "calc(100vh - 210px)",
          minHeight: "120px",
          maxHeight: "740px",
          paddingTop: "20px",
        }}
        className="flex flex-col items-center chat-scroll overflow-y-scroll scroll-smooth bg-inherit pr-0 pl-3 pt-0"
      >
        {/* <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col px-4">
          <div className="flex w-full flex-grow flex-col items-center justify-center">
            <p
              className="mt-4 font-medium text-sm"
              style={{ color: "#31333f", fontWeight: 600, fontSize: 18 }}
            >
              Stuck with Taxes. No Worries Uncle Sam is Here
            </p>
          </div>
        </div> */}

        {messages.map((message, index) =>
          message.type === "user" ? (
            <TaxUserMessage key={index} message={message} image={image} />
          ) : (
            <TaxBotMessage
              key={index}
              message={message}
              isLast={index === messages.length - 1}
              onOptionSelect={handleFilingStatusSelect}
              onInputSubmit={handleInputSubmit}
              currentStep={currentStep}
              isTyping={isTyping}
              error={error}
            />
          )
        )}

        {isTyping && (
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
            <span style={{ position: "relative", top: "10px" }}>
              <img
                style={{
                  width: "25px",
                  height: "25px",
                  minWidth: "25px",
                  minHeight: "25px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  background: "white",
                }}
                src="https://appweb-bucket.s3.us-east-1.amazonaws.com/muse-logo.png"
                alt="botIcon"
              />
            </span>
            <div className="bg-gray-100 text-gray-900 px-6 py-4 rounded-3xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {currentStep === "complete" && (
          <div className="  bottom-0 px-3 pt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg pb-2">
            <div className="w-full bg-white border border-gray-200 rounded-2xl p-3 mb-4">
              <div
                className="flex items-center gap-3 mb-6"
                style={{ marginBottom: "20px" }}
              >
                <CheckCircle className="text-green-600 text-base" />
                <h3 className="text-base font-semibold text-gray-900">
                  {questionsToAsk.length === 0
                    ? "Tax Information Already Complete!"
                    : "Information Collection Complete!"}
                </h3>
              </div>

              <div className="flex items-center flex-wrap gap-2 mb-6">
                <SummaryCard
                  icon={User}
                  title="Filing Status"
                  value={
                    formData.filing_status === "married_joint"
                      ? "Married"
                      : formData.filing_status
                        ? formData.filing_status.charAt(0).toUpperCase() +
                        formData.filing_status.slice(1)
                        : ""
                  }
                  color="bg-gradient-to-r from-purple-600 to-purple-400"
                />

                <SummaryCard
                  icon={DollarSign}
                  title="Annual Salary"
                  value={formatCurrency(formData.annual_salary)}
                  color="bg-gradient-to-r from-orange-600 to-orange-400"
                />
                {formData.spouse_income && (
                  <SummaryCard
                    icon={Heart}
                    title="Spouse Income"
                    value={`$${formData.spouse_income?.toLocaleString()}`}
                    color="bg-gradient-to-r from-pink-600 to-pink-400"
                  />
                )}
                <SummaryCard
                  icon={Calendar}
                  title="Pay Frequency"
                  value={
                    formData.pay_frequency
                      ? formData.pay_frequency.charAt(0).toUpperCase() +
                      formData.pay_frequency.slice(1)
                      : ""
                  }
                  color="bg-gradient-to-r from-green-600 to-green-400"
                />

                <SummaryCard
                  icon={DollarSign}
                  title="Current Withholding"
                  value={`${formatCurrency(formData.current_withholding_per_paycheck)} per paycheck`}
                  color="bg-gradient-to-r from-blue-600 to-blue-400"
                />

                {/* NEW: Optional fields only show if they have values ↓ */}
                {formData.additional_income && (
                  <SummaryCard
                    icon={DollarSign}
                    title="Additional Income"
                    value={formatCurrency(formData.additional_income)}
                    color="bg-gradient-to-r from-teal-600 to-teal-400"
                  />
                )}
                {formData.deductions && (
                  <SummaryCard
                    icon={DollarSign}
                    title="Deductions"
                    value={formatCurrency(formData.deductions)}
                    color="bg-gradient-to-r from-indigo-600 to-indigo-400"
                  />
                )}
                {formData.dependents && (
                  <SummaryCard
                    icon={User}
                    title="Dependents"
                    value={formData.dependents}
                    color="bg-gradient-to-r from-rose-600 to-rose-400"
                  />
                )}
                {formData.current_date && (
                  <SummaryCard
                    icon={Calendar}
                    title="Job Start Date"
                    value={formData.current_date}
                    color="bg-gradient-to-r from-cyan-600 to-cyan-400"
                  />
                )}
                {formData.work_address && (
                  <SummaryCard
                    icon={Home} // You can use any relevant icon
                    title="Work Address"
                    value={formData.work_address}
                    color="bg-gradient-to-r from-lime-600 to-lime-400"
                  />
                )}
                {formData.home_address && (
                  <SummaryCard
                    icon={Home} // You can use any relevant icon
                    title="Home Address"
                    value={formData.home_address}
                    color="bg-gradient-to-r from-yellow-600 to-yellow-400"
                  />
                )}
                {/* {formData.most_recent_pay_date && (
                <SummaryCard
                  icon={Calendar}
                  title="Recent Pay Date"
                  value={formData.most_recent_pay_date}
                  color="bg-gradient-to-r from-amber-600 to-amber-400"
                />
              )} */}
              </div>

              <div
                className="flex flex-col sm:flex-row gap-3 items-center justify-center"
                style={{ marginTop: "40px" }}
              >
                {/* <button
                onClick={resetChat}
                disabled={isSaving}
                style={{
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  fontSize: "14px",
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-2xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                <RotateCcw />
                Start Over
              </button> */}
                <button
                  onClick={handleSaveTaxes}
                  disabled={isSaving}
                  style={{
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    backgroundColor: "#1595ea",
                    color: "#ffffff",
                    border: "1px solid #1595ea",
                    fontSize: "14px",
                  }}
                  className="flex items-center  justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-2xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save My Information"}
                </button>
              </div>

              {saveError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-red-600 text-sm">{saveError}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {currentStep === "saved" && (
        <div className="sticky bg-[#255be305] bottom-0 px-3 pt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg pb-2">
          <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 mb-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-green-500 rounded-3xl mb-4">
                <CheckCircle className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Tax Information Saved Successfully!
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your tax information has been saved. You can now continue to
                chat with me about your taxes.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 max-w-lg mx-auto">
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>💡 Pro Tip:</strong> You can now continue to chat with
                  me about your taxes, ask questions, or request updates
                  anytime!
                </p>
              </div>

              <button
                onClick={handleContinueToChat}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl font-semibold hover:bg-opacity-90 transition-all duration-200"
              >
                Continue to Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxChatbot;
