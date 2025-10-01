import React, { useState, useEffect, useRef } from "react";

// Simple icon components to replace lucide-react
// const PencilIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
//   </svg>
// );

const CopyIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const SendHorizontalIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22 11 13 2 9 22 2z" />
  </svg>
);

// const Volume2Icon: React.FC<{ size?: number }> = ({ size = 16 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
//     <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
//   </svg>
// );

// Simple tooltip icon button component
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
    className={`p-1 rounded hover:bg-gray-100 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);

// Type definitions
interface TaxData {
  income_type: string;
  annual_salary: string;
  filing_status: string;
  pay_frequency: string;
  current_withholding_per_paycheck: string;
  spouse_income?: string;
  // NEW OPTIONAL FIELDS ADDED ↓
  additional_income?: string;
  deductions?: string;
  dependents?: string;
  current_date?: string;
  // most_recent_pay_date?: string;
}

interface TaxChatbotProps {
  onComplete?: (taxData: TaxData) => void;
  onContinueToChat?: () => void;
  image?: string;
  prefilledData?: Partial<TaxData>;
}

interface MessageContent {
  content?: string;
  inputType?: string;
  placeholder?: string;
  selectType?: string;
  options?: string[];
}

interface Message {
  type: "bot" | "user";
  content: string | MessageContent;
  options?: string[];
  inputType?: string;
  placeholder?: string;
  createdAt: Date;
}

interface FormData {
  filing_status: string | null;
  annual_salary: string | null;
  spouse_income: string | null;
  pay_frequency: string | null;
  current_withholding_per_paycheck: string | null;
  // NEW FIELDS ADDED ↓
  additional_income: string | null;
  deductions: string | null;
  dependents: string | null;
  current_date: string | null;
  // most_recent_pay_date: string | null;
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
  error: string
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

// type StepType = "filing_status" | "annual_salary" | "spouse_income" | "pay_frequency" | "current_withholding" | "complete" | "saved";
type StepType = "filing_status" | "annual_salary" | "spouse_income" | "pay_frequency" | "current_withholding" | "additional_income" | "deductions" | "dependents" | "current_date" | "complete" | "saved";

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
    <div className="grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 [&:where(>*)]:col-start-2 w-full max-w-[var(--thread-max-width)] py-4">
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
            <pre className="whitespace-normal text-white font-sans">
              {typeof message.content === "string" ? message.content : ""}
            </pre>
          </div>
          <span style={{ color: "#45556c", fontSize: "12px", marginTop: "4px" }}>
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
  error
}) => {
  const time = formatTime(message.createdAt || Date.now());

  return (
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
          alt="useIcon"
        />
      </span>
      <div className="grid grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] relative w-full max-w-[var(--thread-max-width)] py-4 pr-2">
        <div className="text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words leading-7 col-span-2 col-start-2 row-start-1 my-1.5">
          <pre className="whitespace-normal text-sm leading-relaxed font-sans">
            {typeof message.content === "object" ? (message.content as MessageContent).content : message.content}
          </pre>

          {message.options && isLast && !isTyping && (
            <div className="mt-4 space-y-2">
              {message.options.map((option) => (
                <button
                  key={option}
                  onClick={() => onOptionSelect(option)}
                  className="block w-full p-3 text-left text-sm bg-white text-gray-900 rounded-2xl hover:bg-gray-50 transition-colors font-medium border border-gray-200"
                >
                  {option}
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
                        const customValue = prompt("Please enter your custom pay frequency:");
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
                  {(message.content as MessageContent).options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}

          {typeof message.content === "object" &&
            (message.content as MessageContent).inputType &&
            isLast &&
            currentStep !== "filing_status" &&
            currentStep !== "complete" &&
            !isTyping && (
              <div className="mt-4 space-y-2">
                <TaxInputField
                  type={(message.content as MessageContent).inputType!}
                  placeholder={(message.content as MessageContent).placeholder!}
                  onSubmit={onInputSubmit}
                />
                {/* Display error message below input */}
                {error && (
                  <p className="text-red-600 text-sm mt-1">
                    {error}
                  </p>
                )}
                {/* NEW: Skip button for optional fields ↓ */}
                {(currentStep === "additional_income" ||
                  currentStep === "deductions" ||
                  currentStep === "dependents" ||
                  currentStep === "current_date"
                  // ||
                  // currentStep === "most_recent_pay_date"
                )
                  && (
                    <button
                      onClick={() => onInputSubmit("skip")}
                      className="w-full p-3 text-sm bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-medium"
                    >
                      Skip this question
                    </button>
                  )}
              </div>
            )}

          <span style={{ color: "#45556c", fontSize: "12px", marginTop: "4px" }}>
            {time}
          </span>
        </div>

        <div className="text-muted-foreground flex gap-1 col-start-3 row-start-2 -ml-1">
          <TooltipIconButton tooltip="Copy" variant="ghost" size="sm">
            <CopyIcon size={16} />
          </TooltipIconButton>
          {/* <TooltipIconButton tooltip="Speak" variant="ghost" size="sm">
            <Volume2Icon size={16} />
          </TooltipIconButton> */}
        </div>
      </div>

    </div>
  );
};

// Tax Input Field Component
const TaxInputField: React.FC<TaxInputFieldProps> = ({ type, placeholder, onSubmit }) => {
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
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="placeholder:text-muted-foreground custom_input flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
        />
        <TooltipIconButton
          tooltip="Send"
          variant="default"
          className="my-2.5 size-8 p-2 bg-gradient-to-r from-green-600 to-green-500 rounded-full transition-opacity ease-in"
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
const CheckCircle: React.FC<{ className?: string }> = ({ className }) => <div className={`text-xl ${className}`}>✅</div>;
const RotateCcw: React.FC = () => <div className="text-base">🔄</div>;

const SummaryCard: React.FC<SummaryCardProps> = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon />
      </div>
      <div>
        <p className="text-xs text-gray-600 uppercase tracking-wide">{title}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const TaxChatbot: React.FC<TaxChatbotProps> = ({
  onComplete,
  onContinueToChat,
  prefilledData = {},
  image = ''
}) => {
  // Helper function to determine what needs to be asked
  const getQuestionsToAsk = (): StepType[] => {
    const questions: StepType[] = [];

    if (!prefilledData.filing_status) {
      questions.push("filing_status");
    }

    if (!prefilledData.annual_salary) {
      questions.push("annual_salary");
    }

    if ((prefilledData.filing_status === "Married" || prefilledData.filing_status === "married") && !prefilledData.spouse_income) {
      questions.push("spouse_income");
    }

    if (!prefilledData.pay_frequency) {
      questions.push("pay_frequency");
    }

    if (!prefilledData.current_withholding_per_paycheck) {
      questions.push("current_withholding");
    }

    // NEW: Always ask optional questions ↓
    questions.push("additional_income");
    questions.push("deductions");
    questions.push("dependents");
    questions.push("current_date");
    // questions.push("most_recent_pay_date");

    return questions;
  };

  const [questionsToAsk] = useState<StepType[]>(getQuestionsToAsk());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const [formData, setFormData] = useState<FormData>({
    filing_status: prefilledData.filing_status || null,
    annual_salary: prefilledData.annual_salary || null,
    spouse_income: prefilledData.spouse_income || null,
    pay_frequency: prefilledData.pay_frequency || null,
    current_withholding_per_paycheck: prefilledData.current_withholding_per_paycheck || null,
    // NEW FIELDS INITIALIZED ↓
    additional_income: null,
    deductions: null,
    dependents: null,
    current_date: null,
    // most_recent_pay_date: null,
  });

  const [currentStep, setCurrentStep] = useState<StepType>(
    questionsToAsk.length > 0 ? questionsToAsk[0] : "complete"
  );

  const generateInitialMessage = (): Message => {
    if (questionsToAsk.length === 0) {
      return {
        type: "bot",
        content: "Great! I see you already have all your tax information filled out. Let me show you a summary:",
        createdAt: new Date(),
      };
    }

    const prefilledCount = Object.values(prefilledData).filter(value => value && value !== "").length;
    let greeting = "Hi! I'm your tax information assistant.";

    if (prefilledCount > 0) {
      greeting += ` I can see you already have some tax information filled out. Let me collect the remaining details.`;
    } else {
      greeting += " I'll help you collect the information needed for your tax calculation.";
    }

    switch (questionsToAsk[0]) {
      case "filing_status":
        return {
          type: "bot",
          content: `${greeting}\n\nLet's start with your filing status:`,
          options: ["Single", "Married"],
          createdAt: new Date(),
        };
      case "annual_salary":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nI need to know your annual salary:`,
            inputType: "number",
            placeholder: "Enter your annual salary (e.g., 75000)...",
          },
          createdAt: new Date(),
        };
      case "spouse_income":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nSince you're married, I need your spouse's annual income:`,
            inputType: "number",
            placeholder: "Enter spouse annual income...",
          },
          createdAt: new Date(),
        };
      case "pay_frequency":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nI need to know how often you get paid:`,
            selectType: "dropdown",
            options: ["Weekly", "Bi-weekly", "Semi-monthly", "Monthly"],
            placeholder: "Select your pay frequency...",
          },
          createdAt: new Date(),
        };
      case "current_withholding":
        return {
          type: "bot",
          content: {
            content: `${greeting}\n\nWhat is your current withholding amount per paycheck?`,
            inputType: "number",
            placeholder: "Enter withholding amount per paycheck...",
          },
          createdAt: new Date(),
        };
      case "additional_income":
        return {
          type: 'bot',
          content: {
            content: `${greeting}\n\nIf you have any additional income (e.g., freelance, investments, or rental), please enter the total amount. If not, you can skip this question.`,
            inputType: "number",
            placeholder: "Enter additional income.. or skip",

          },
          createdAt: new Date(),

        }
      case "deductions":
        return {
          type: 'bot',
          content: {
            content: `${greeting}\n\nIf you have any deductions (such as mortgage interest, charitable contributions, or medical expenses), please enter the total amount. If not, you can skip this question.`,
            inputType: "number",
            placeholder: "Enter number of dependents or skip",

          },
          createdAt: new Date(),

        }
      case "dependents":
        return {
          type: 'bot',
          content: {
            content: `${greeting}\n\nHow many dependents do you have? (Optional)`,
            inputType: "number",
            placeholder: "Enter number of dependents or skip",

          },
          createdAt: new Date(),

        }
      case "current_date":
        return {
          type: 'bot',
          content: {
            content: `${greeting}\n\nWhen did you start your current job? (Optional)`,
            inputType: "date",
            placeholder: "Select start date or skip",

          },
          createdAt: new Date(),

        }
      // case "most_recent_pay_date":
      //   return {
      //     type: 'bot',
      //     content: {
      //       content: `${greeting}\n\nWhat was your most recent pay date? (Optional)`,
      //       inputType: "date",
      //       placeholder: "Select most recent pay date or skip",

      //     },
      //     createdAt: new Date(),

      //   }
      default:
        return {
          type: "bot",
          content: greeting,
          createdAt: new Date(),
        };
    }
  };

  const [messages, setMessages] = useState<Message[]>([generateInitialMessage()]);
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

  const addMessage = (type: "bot" | "user", content: string | MessageContent): void => {
    setIsTyping(true);
    setTimeout(
      () => {
        setMessages((prev) => [...prev, {
          type,
          content,
          createdAt: new Date()
        }]);
        setIsTyping(false);
      },
      type === "bot" ? 800 : 0
    );
  };

  const moveToNextQuestion = (): void => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= questionsToAsk.length) {
      addMessage("bot", "Perfect! I have all the information I need. Let me summarize everything for you:");
      setCurrentStep("complete");
    } else {
      setCurrentQuestionIndex(nextIndex);
      const nextStep = questionsToAsk[nextIndex];
      setCurrentStep(nextStep);

      switch (nextStep) {
        case "annual_salary":
          addMessage("bot", {
            content: "Perfect! Now I need to know your annual salary to calculate your tax information accurately.",
            inputType: "number",
            placeholder: "Enter your annual salary (e.g., 75000)...",
          });
          break;
        case "spouse_income":
          addMessage("bot", {
            content: "Since you're married, I also need your spouse's annual income.",
            inputType: "number",
            placeholder: "Enter spouse annual income...",
          });
          break;
        case "pay_frequency":
          addMessage("bot", {
            content: "Great! Now I need to know how often you get paid.",
            selectType: "dropdown",
            options: ["Weekly", "Bi-weekly", "Semi-monthly", "Monthly"],
            placeholder: "Select your pay frequency...",
          });
          break;
        case "current_withholding":
          addMessage("bot", {
            content: "Finally, what is your current withholding amount per paycheck?",
            inputType: "number",
            placeholder: "Enter withholding amount per paycheck...",
          });
          break;
        // Add these cases to the switch statement in moveToNextQuestion
        case "additional_income":
          addMessage("bot", {
            content: "If you have any additional income (e.g., freelance, investments, or rental), please enter the total amount. If not, you can skip this question.",
            inputType: "number",
            placeholder: "Enter additional annual income or skip",
          });
          break;

        case "deductions":
          addMessage("bot", {
            content: "If you have any deductions (such as mortgage interest, charitable contributions, or medical expenses), please enter the total amount. If not, you can skip this question.",
            inputType: "number",
            placeholder: "Enter annual deductions or skip",
          });
          break;

        case "dependents":
          addMessage("bot", {
            content: "How many dependents do you have? (Optional)",
            inputType: "number",
            placeholder: "Enter number of dependents or skip",
          });
          break;

        case "current_date":
          addMessage("bot", {
            content: "When did you start your current job? (Optional)",
            inputType: "date",
            placeholder: "Select start date or skip",
          });
          break;

        // case "most_recent_pay_date":
        //   addMessage("bot", {
        //     content: "What was your most recent pay date? (Optional)",
        //     inputType: "date",
        //     placeholder: "Select most recent pay date or skip",
        //   });
        //   break;
      }
    }
  };

  const handleFilingStatusSelect = (status: string): void => {
    setFormData((prev) => ({ ...prev, filing_status: status }));
    addMessage("user", `I am ${status.toLowerCase()}`);
    moveToNextQuestion();
  };
  const [error, setError] = useState<string>("");

  const handleInputSubmit = (value: string): void => {
    setError(""); // reset before validation
    if (!value.trim()) return;

    const isSkipped = value.toLowerCase() === "skip";
    const numValue = parseFloat(value);

    const today = new Date();

    switch (currentStep) {
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
        setFormData((prev) => ({ ...prev, annual_salary: isSkipped ? "" : numValue.toString() }));
        addMessage("user", isSkipped ? "I'll skip this question" : `My annual salary is $${numValue.toLocaleString()}`);
        moveToNextQuestion();
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
        setFormData((prev) => ({ ...prev, spouse_income: isSkipped ? "" : numValue.toString() }));
        addMessage("user", isSkipped ? "I'll skip this question" : `My spouse's annual income is $${numValue.toLocaleString()}`);
        moveToNextQuestion();
        break;

      case "pay_frequency":
        if (isSkipped) {
          addMessage("user", "I'll skip this question");
        } else {
          setFormData((prev) => ({ ...prev, pay_frequency: value }));
          addMessage("user", `I get paid ${value.toLowerCase()}`);
        }
        moveToNextQuestion();
        break;

      case "current_withholding":
        if (!isSkipped) {
          if (isNaN(numValue) || numValue < 0) {
            setError("Withholding must be a positive number.");
            return;
          }
          if (formData.annual_salary && numValue > Number(formData.annual_salary)) {
            setError("Withholding cannot exceed your annual salary.");
            return;
          }
        }
        setFormData((prev) => ({ ...prev, current_withholding_per_paycheck: isSkipped ? "" : numValue.toString() }));
        addMessage("user", isSkipped ? "I'll skip this question" : `My current withholding is $${numValue} per paycheck`);
        moveToNextQuestion();
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
        setFormData((prev) => ({ ...prev, additional_income: isSkipped ? "" : numValue.toString() }));
        addMessage("user", isSkipped ? "I'll skip this question" : `My additional annual income is $${numValue.toLocaleString()}`);
        moveToNextQuestion();
        break;

      case "deductions":
        if (!isSkipped) {
          if (isNaN(numValue) || numValue < 0) {
            setError("Deductions must be a positive number.");
            return;
          }
          if (formData.annual_salary && numValue > Number(formData.annual_salary)) {
            setError("Deductions cannot exceed your annual salary.");
            return;
          }
        }
        setFormData((prev) => ({ ...prev, deductions: isSkipped ? "" : numValue.toString() }));
        addMessage("user", isSkipped ? "I'll skip this question" : `My annual deductions are $${numValue.toLocaleString()}`);
        moveToNextQuestion();
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
        setFormData((prev) => ({ ...prev, dependents: isSkipped ? "" : numValue.toString() }));
        addMessage("user", isSkipped ? "I'll skip this question" : `I have ${numValue} dependent(s)`);
        moveToNextQuestion();
        break;

      case "current_date":
        if (!isSkipped) {
          const dateValue = new Date(value);
          if (isNaN(dateValue.getTime())) {
            setError("Please enter a valid date.");
            return;
          }
          if (dateValue > today) {
            setError("Start date cannot be in the future.");
            return;
          }

          // Format as yyyy-mm-dd
          const formattedDate = dateValue.toISOString().split("T")[0];
          setFormData((prev) => ({
            ...prev,
            current_date: formattedDate
          }));
          addMessage("user", `My job start date is ${formattedDate}`);
        } else {
          setFormData((prev) => ({ ...prev, current_date: "" }));
          addMessage("user", "I'll skip this question");
        }

        moveToNextQuestion();
        break;

      // case "most_recent_pay_date":
      //   if (!isSkipped) {
      //     const dateValue = new Date(value);
      //     if (isNaN(dateValue.getTime())) {
      //       setError("Please enter a valid date.");
      //       return;
      //     }
      //     if (dateValue > today) {
      //       setError("Pay date cannot be in the future.");
      //       return;
      //     }
      //   }
      //   setFormData((prev) => ({ ...prev, most_recent_pay_date: isSkipped ? "" : value }));
      //   addMessage("user", isSkipped ? "I'll skip this question" : `My most recent pay date was ${value}`);
      //   moveToNextQuestion();
      //   break;

      default:
        break;
    }
  };



  const resetChat = (): void => {
    const newQuestionsToAsk = getQuestionsToAsk();
    setMessages([generateInitialMessage()]);
    setCurrentStep(newQuestionsToAsk.length > 0 ? newQuestionsToAsk[0] : "complete");
    setCurrentQuestionIndex(0);
    setFormData({
      filing_status: prefilledData.filing_status || null,
      annual_salary: prefilledData.annual_salary || null,
      spouse_income: prefilledData.spouse_income || null,
      pay_frequency: prefilledData.pay_frequency || null,
      current_withholding_per_paycheck: prefilledData.current_withholding_per_paycheck || null,
      // NEW: Reset optional fields ↓
      additional_income: null,
      deductions: null,
      dependents: null,
      current_date: null,
      // most_recent_pay_date: null,
    });
    setIsSaving(false);
    setSaveError(null);
  };

  const handleSaveTaxes = async (): Promise<void> => {
    setIsSaving(true);
    setSaveError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const taxDataToSave: TaxData = {
        income_type: "salary",
        annual_salary: formData.annual_salary!,
        filing_status: formData.filing_status!,
        pay_frequency: formData.pay_frequency!,
        current_withholding_per_paycheck: formData.current_withholding_per_paycheck!,
        spouse_income: formData.spouse_income || undefined,
        // NEW: Include optional fields ↓
        additional_income: formData.additional_income || undefined,
        deductions: formData.deductions || undefined,
        dependents: formData.dependents || undefined,
        current_date: formData.current_date || undefined,
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
    <div className="bg-inherit h-full">
      <div
        style={{
          height: "calc(100vh - 210px)",
          minHeight: "120px",
          maxHeight: "740px",
        }}
        className="flex flex-col items-center chat-scroll overflow-y-scroll scroll-smooth bg-inherit pr-0 pl-3 pt-0"
      >
        <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col px-4">
          <div className="flex w-full flex-grow flex-col items-center justify-center">
            <p className="mt-4 font-medium text-sm">
              Stuck with Taxes. No Worries Uncle Sam is Here
            </p>
          </div>
        </div>

        {messages.map((message, index) => (
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
        ))}

        {isTyping && (
          <div style={{
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
            width: "100%",
            paddingLeft: "16px",
            paddingRight: "10px",
          }}>
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
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
        <div className="min-h-8 flex-grow" />
      </div>

      {currentStep === "complete" && (
        <div className=" bg-[#255be305] bottom-0 px-3 pt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg pb-2">
          <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-3 mb-6" style={{ marginBottom: "20px" }}>
              <CheckCircle className="text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">
                {questionsToAsk.length === 0 ? "Tax Information Already Complete!" : "Information Collection Complete!"}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <SummaryCard
                icon={User}
                title="Filing Status"
                value={formData.filing_status || ""}
                color="bg-gradient-to-r from-purple-600 to-purple-400"
              />
              <SummaryCard
                icon={DollarSign}
                title="Annual Salary"
                value={`$${formData.annual_salary?.toLocaleString()}`}
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
                value={formData.pay_frequency || ""}
                color="bg-gradient-to-r from-green-600 to-green-400"
              />
              <SummaryCard
                icon={DollarSign}
                title="Current Withholding"
                value={`$${formData.current_withholding_per_paycheck} per paycheck`}
                color="bg-gradient-to-r from-blue-600 to-blue-400"
              />

              {/* NEW: Optional fields only show if they have values ↓ */}
              {formData.additional_income && (
                <SummaryCard
                  icon={DollarSign}
                  title="Additional Income"
                  value={`$${formData.additional_income?.toLocaleString()}`}
                  color="bg-gradient-to-r from-teal-600 to-teal-400"
                />
              )}
              {formData.deductions && (
                <SummaryCard
                  icon={DollarSign}
                  title="Deductions"
                  value={`$${formData.deductions?.toLocaleString()}`}
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
              {/* {formData.most_recent_pay_date && (
                <SummaryCard
                  icon={Calendar}
                  title="Recent Pay Date"
                  value={formData.most_recent_pay_date}
                  color="bg-gradient-to-r from-amber-600 to-amber-400"
                />
              )} */}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center" style={{ marginTop: "10px" }}>
              <button
                onClick={resetChat}
                disabled={isSaving}
                style={{ paddingTop: "12px", paddingBottom: "12px" }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-2xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                <RotateCcw />
                Start Over
              </button>
              <button
                onClick={handleSaveTaxes}
                disabled={isSaving}
                style={{ paddingTop: "12px", paddingBottom: "12px", backgroundColor: "#1595ea", color: "#ffffff", border: "1px solid #1595ea" }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-2xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
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

      {currentStep === "saved" && (
        <div className="sticky bg-[#255be305] bottom-0 px-3 pt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg pb-2">
          <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 mb-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-green-500 rounded-3xl mb-4">
                <CheckCircle className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tax Information Saved Successfully!</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your tax information has been saved. You can now continue to chat with me about your taxes.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 max-w-lg mx-auto">
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>💡 Pro Tip:</strong> You can now continue to chat with me about your taxes, ask questions, or request updates anytime!
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