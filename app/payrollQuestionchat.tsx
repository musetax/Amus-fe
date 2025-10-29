import React, { useState, useEffect, useRef } from "react";

// Import types
import {
  TaxChatbotProps,
  FormData,
  Message,
  StepType,
  // Payload,
  TaxData,
} from "./payrollQuestion/types";

// Import components
import { TaxUserMessage, TaxBotMessage } from "./payrollQuestion/components";
import { SummarySection } from "./payrollQuestion/SummarySection";
import { SavedSection } from "./payrollQuestion/SavedSection";

// Import message generator
import {
  generateInitialMessage,
  generateMessageForStep,
} from "./payrollQuestion/messageGenerator";

// Import question flow
import {
  getQuestionsToAsk,
  getNextQuestionIndex,
} from "./payrollQuestion/questionFlow";

// Import input handlers
import * as InputHandlers from "./payrollQuestion/inputHandlers";
import Image from "next/image";

const TaxChatbot: React.FC<TaxChatbotProps> = ({
  onComplete,
  onContinueToChat,
  prefilledData = {},
  allfillData={},
  image = "",
  companyLogo,
  agentIntent = "tax_refund_calculation", // Default to refund if not provided
}) => {
  const [questionsToAsk] = useState<StepType[]>(
    getQuestionsToAsk(prefilledData, agentIntent,allfillData)
  );
  console.log(prefilledData,"]]]]")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const [formData, setFormData] = useState<FormData>({
    first_name: prefilledData.first_name || null,
    middle_name: prefilledData.middle_name || null,
    last_name: prefilledData.last_name || null,
    age: prefilledData.age?.toString() || null,
    income_type: prefilledData.income_type || null,
    annual_salary: prefilledData.annual_salary?.toString() || null,
    hourly_rate: prefilledData.hourly_rate?.toString() || null,
    average_hours_per_week:
      prefilledData.average_hours_per_week?.toString() || null,
    seasonal_variation: prefilledData.seasonal_variation || null,
    estimated_annual_income:
      prefilledData.estimated_annual_income?.toString() || null,
    filing_status: prefilledData.filing_status || null,
    pay_frequency: prefilledData.pay_frequency || null,
    current_withholding_per_paycheck:
      prefilledData.current_withholding_per_paycheck?.toString() || null,
    desired_boost_per_paycheck:
      prefilledData.desired_boost_per_paycheck?.toString() || null,
    spouse_income: prefilledData.spouse_income?.toString() || null,
    additional_yesorno: null,
    additional_income: prefilledData.additional_income?.toString() || null,
    standard_deduction: null,
    deductions: prefilledData.deductions || null,
    dependents_yesno: null,
    dependents: prefilledData.dependents?.toString() || null,
    current_date: prefilledData.current_date || null,
    paychecks_already_received:
      prefilledData.paychecks_already_received?.toString() || null,
    home_address: prefilledData.home_address || null,
    work_address: prefilledData.work_address || null,
    pre_tax_deductions: prefilledData.pre_tax_deductions?.toString() || null,
    post_tax_deductions: prefilledData.post_tax_deductions?.toString() || null,
    // is_all_data_fill:true
    "is_refund_data_fill": agentIntent === 'tax_refund_calculation' ? true : allfillData.is_refund_data_fill,
    "is_paycheck_data_fill": agentIntent === 'tax_paycheck_calculation' ? true : allfillData.is_paycheck_data_fill,
  });

  const [currentStep, setCurrentStep] = useState<StepType>(
    questionsToAsk.length > 0 ? questionsToAsk[0] : "complete"
  );

  const [messages, setMessages] = useState<Message[]>([
    generateInitialMessage(questionsToAsk, prefilledData),
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [inputKey, setInputKey] = useState<number>(0);
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

  const addMessage = (type: "bot" | "user", content: string | any): void => {
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

  const moveToNextQuestion = (data: FormData): void => {
    const nextIndex = getNextQuestionIndex(
      currentQuestionIndex,
      questionsToAsk,
      data
    );

    // End of questions
    if (nextIndex >= questionsToAsk.length) {
      addMessage(
        "bot",
        "Perfect! I have all the information I need. Let me summarize everything for you:"
      );
      setCurrentStep("complete");
      return;
    }

    // Move to next valid step
    setCurrentQuestionIndex(nextIndex);
    const nextStep = questionsToAsk[nextIndex];
    setCurrentStep(nextStep);

    // Generate message for next step
    const nextMessage = generateMessageForStep(nextStep, "", data as any);
    addMessage("bot", nextMessage.content);
  };

  const handleFilingStatusSelect = (value: string): void => {
    setError("");
    let result: any;

    // Route to appropriate handler based on current step
    switch (currentStep) {
      case "filing_status":
        result = {
          formData: { ...formData, filing_status: value },
          userMessage: value === "married_joint" ? "I am Married" : `I am ${value}`,
        };
        break;

      case "income_type":
        result = InputHandlers.handleIncomeTypeInput(value, formData, false);
        break;

      case "head_of_household":
        result = {
          formData: { ...formData, filing_status: value === "yes" ? 'head_of_household' : formData.filing_status },
          userMessage: value === "yes" ? "Yes, I am head of household" : "No, I am not head of household",
        };
        break;

      case "pay_frequency":
        result = InputHandlers.handlePayFrequencyInput(value, formData, false);
        break;

      case "seasonal_variation":
        result = InputHandlers.handleSeasonalVariationInput(value, formData, false);
        break;

      case "additional_yesorno":
        result = InputHandlers.handleAdditionalYesNoInput(value, formData);
        break;

      case "standard_deduction":
        result = InputHandlers.handleStandardDeductionInput(value, formData);
        break;

      case "dependents_yesno":
        result = InputHandlers.handleDependentsYesNoInput(value, formData);
        break;

      case "dependents":
        result = InputHandlers.handleDependentsInput(value, formData, false);
        break;

      default:
        // Default handler for unhandled dropdowns
        result = {
          formData: { ...formData, [currentStep]: value },
          userMessage: value,
        };
        break;
    }

    // Handle error
    if ("error" in result) {
      setError(result.error);
      return;
    }

    // Update form data and add messages
    setFormData(result.formData);
    addMessage("user", result.userMessage);

    // Add bot message if exists
    if (result.botMessage) {
      addMessage("bot", result.botMessage);
    }

    // Clear input field by changing key
    setInputKey(prev => prev + 1);

    // Move to next question
    moveToNextQuestion(result.formData);
  };

  const handleInputSubmit = (value: string): void => {
    setError("");
    if (!value.trim()) return;

    const isSkipped = value.toLowerCase() === "skip";
    let result: any;

    // Route to appropriate handler based on current step
    switch (currentStep) {
      case "age":
        result = InputHandlers.handleAgeInput(value, formData, isSkipped);
        break;

      case "income_type":
        result = InputHandlers.handleIncomeTypeInput(
          value,
          formData,
          isSkipped
        );
        break;

      case "annual_salary":
        result = InputHandlers.handleAnnualSalaryInput(
          value,
          formData,
          isSkipped
        );
        break;

      case "hourly_rate":
        result = InputHandlers.handleHourlyRateInput(
          value,
          formData,
          isSkipped
        );
        break;

      case "average_hours_per_week":
        result = InputHandlers.handleAverageHoursInput(
          value,
          formData,
          isSkipped
        );
        break;

      case "seasonal_variation":
        result = InputHandlers.handleSeasonalVariationInput(
          value,
          formData,
          isSkipped
        );
        break;

      case "spouse_income":
        result = InputHandlers.handleSpouseIncomeInput(
          value,
          formData,
          isSkipped
        );
        break;

      case "pay_frequency":
        result = InputHandlers.handlePayFrequencyInput(
          value,
          formData,
          isSkipped
        );
        break;

      case "current_withholding":
        result = InputHandlers.handleCurrentWithholdingInput(
          value,
          formData,
          isSkipped
        );
        break;

      case "additional_yesorno":
        result = InputHandlers.handleAdditionalYesNoInput(value, formData);
        break;

      case "additional_income":
        result = InputHandlers.handleAdditionalIncomeInput(
          value,
          formData,
          isSkipped
        );
        break;

      case "standard_deduction":
        result = InputHandlers.handleStandardDeductionInput(value, formData);
        break;

      case "deductions":
        result = InputHandlers.handleDeductionsInput(
          value,
          formData,
          isSkipped
        );
        break;

      case "dependents_yesno":
        result = InputHandlers.handleDependentsYesNoInput(value, formData);
        break;

      case "dependents":
        result = InputHandlers.handleDependentsInput(
          value,
          formData,
          isSkipped
        );
        break;

      case "current_date":
        result = InputHandlers.handleCurrentDateInput(
          value,
          formData,
          isSkipped
        );
        break;

      case "work_address":
        result = InputHandlers.handleWorkAddressInput(
          value,
          formData,
          isSkipped
        );
        break;

      case "home_address":
        result = InputHandlers.handleHomeAddressInput(
          value,
          formData,
          isSkipped
        );
        break;

      case "pre_tax_deductions":
        result = InputHandlers.handlePreTaxDeductionsInput(
          value,
          formData,
          isSkipped
        );
        break;

      case "post_tax_deductions":
        result = InputHandlers.handlePostTaxDeductionsInput(
          value,
          formData,
          isSkipped
        );
        break;

      default:
        // Default handler
        result = {
          formData,
          userMessage: value,
        };
        break;
    }

    // Handle error
    if ("error" in result) {
      setError(result.error);
      return;
    }

    // Update form data and add messages
    setFormData(result.formData);
    addMessage("user", result.userMessage);

    // Add bot message if exists
    if (result.botMessage) {
      addMessage("bot", result.botMessage);
    }

    // Clear input field by changing key
    setInputKey(prev => prev + 1);

    // Move to next question
    moveToNextQuestion(result.formData);
  };

  const handleSaveTaxes = async (): Promise<void> => {
    setIsSaving(true);
    setSaveError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const taxDataToSave: TaxData = {
        // payroll: {
        first_name: formData.first_name || undefined,
        middle_name: formData.middle_name || undefined,
        last_name: formData.last_name || undefined,
        age: formData.age ? Number(formData.age) : undefined,
        income_type: (formData.income_type as any) || undefined,
        annual_salary:
          formData.income_type === "salary"
            ? Number(formData.annual_salary)
            : undefined,
        hourly_rate:
          formData.income_type === "hourly"
            ? Number(formData.hourly_rate)
            : undefined,
        average_hours_per_week:
          formData.income_type === "hourly"
            ? Number(formData.average_hours_per_week)
            : undefined,
        seasonal_variation: (formData.seasonal_variation as any) || undefined,
        estimated_annual_income: formData.estimated_annual_income
          ? Number(formData.estimated_annual_income)
          : undefined,
        filing_status: (formData.filing_status as any) || undefined,
        pay_frequency: (formData.pay_frequency as any) || undefined,
        current_withholding_per_paycheck:
          formData.current_withholding_per_paycheck
            ? Number(formData.current_withholding_per_paycheck)
            : undefined,
        spouse_income: formData.spouse_income
          ? Number(formData.spouse_income)
          : undefined,
        additional_income: formData.additional_income
          ? Number(formData.additional_income)
          : undefined,

        deductions: Array.isArray(formData.deductions)
          ? formData.deductions.reduce(
            (sum: number, item: any) => sum + Number(item.amount || 0),
            0
          )
          : undefined,

        dependents: formData.dependents
          ? Number(formData.dependents)
          : undefined,
        current_date: formData.current_date || undefined,
        paychecks_already_received: formData.paychecks_already_received
          ? Number(formData.paychecks_already_received)
          : undefined,
        home_address: formData.home_address || undefined,
        work_address: formData.work_address || undefined,
        pre_tax_deductions: formData.pre_tax_deductions
          ? Number(formData.pre_tax_deductions)
          : undefined,
        post_tax_deductions: formData.post_tax_deductions
          ? Number(formData.post_tax_deductions)
          : undefined,
        // is_all_data_fill:true
        "is_refund_data_fill": agentIntent === 'tax_refund_calculation' ? true : formData.is_refund_data_fill,
        "is_paycheck_data_fill": agentIntent === 'tax_paycheck_calculation' ? true : formData.is_paycheck_data_fill,

        // },
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
              companyLogo={companyLogo}
              inputKey={inputKey}
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
              <Image
                width={25}
                height={25}
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
          <SummarySection
            formData={formData}
            questionsToAsk={questionsToAsk}
            onSave={handleSaveTaxes}
            isSaving={isSaving}
            saveError={saveError}
          />
        )}
      </div>

      {currentStep === "saved" && (
        <SavedSection onContinue={handleContinueToChat} />
      )}
    </div>
  );
};

export default TaxChatbot;
