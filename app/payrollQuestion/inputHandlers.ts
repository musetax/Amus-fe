import { FormData } from "./types";
import { formatCurrency, seasonalVariationOptions, calculateAnnualIncomeFromHourly } from "./utils";

export interface InputHandlerResult {
  formData: FormData;
  userMessage: string;
  botMessage?: string;
  error?: string;
}

/**
 * Handles age input
 */
export const handleAgeInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped) {
    return {
      formData: { ...formData, age: "" },
      userMessage: "I'll skip this question",
    };
  }

  const age = parseInt(value, 10);
  if (isNaN(age) || age < 0) {
    return { error: "Age must be a positive number." };
  }
  if (age < 13 || age > 99) {
    return { error: "Please enter a valid age (13-99)." };
  }

  return {
    formData: { ...formData, age: age.toString() },
    userMessage: `I am ${age} years old`,
  };
};

/**
 * Handles income type input
 */
export const handleIncomeTypeInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped) {
    return {
      formData: { ...formData, income_type: "" },
      userMessage: "I'll skip this question",
    };
  }

  const lowerValue = value.toLowerCase().trim();
  if (lowerValue !== "salary" && lowerValue !== "hourly") {
    return { error: "Please select either 'Salary' or 'Hourly'." };
  }

  const message =
    lowerValue === "salary"
      ? "I earn a fixed annual Salary."
      : "I am paid Hourly for my work.";

  return {
    formData: { ...formData, income_type: lowerValue },
    userMessage: message,
  };
};

/**
 * Handles annual salary input
 */
export const handleAnnualSalaryInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped) {
    return {
      formData: { ...formData, annual_salary: "" },
      userMessage: "I'll skip this question",
    };
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue) || numValue < 0) {
    return { error: "Annual Salary must be a positive number." };
  }
  if (numValue > 500000) {
    return { error: "Annual Salary cannot exceed $500,000." };
  }

  return {
    formData: { ...formData, annual_salary: numValue.toString() },
    userMessage: `My annual Salary is ${formatCurrency(numValue)}`,
  };
};

/**
 * Handles hourly rate input
 */
export const handleHourlyRateInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped) {
    return {
      formData,
      userMessage: "I'll skip this question",
    };
  }

  const rate = parseFloat(value);
  if (isNaN(rate) || rate <= 0) {
    return { error: "Please enter a valid Hourly rate (greater than 0)." };
  }

  return {
    formData: { ...formData, hourly_rate: rate.toString() },
    userMessage: `My Hourly rate is $${rate}`,
  };
};

/**
 * Handles average hours per week input
 */
export const handleAverageHoursInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped) {
    return {
      formData,
      userMessage: "I'll skip this question",
    };
  }

  const hours = parseFloat(value);
  if (isNaN(hours) || hours <= 0 || hours > 100) {
    return { error: "Please enter a valid number of hours (1–100)." };
  }

  return {
    formData: { ...formData, average_hours_per_week: hours.toString() },
    userMessage: `I work about ${hours} hours per week.`,
  };
};

/**
 * Handles seasonal variation input
 */
export const handleSeasonalVariationInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped) {
    return {
      formData,
      userMessage: "I'll skip this question",
    };
  }

  const validValues = ["none", "low", "moderate", "high"];
  const val = value.toLowerCase();
  if (!validValues.includes(val)) {
    return { error: "Please select a valid seasonal variation option." };
  }

  const selectedOption = seasonalVariationOptions.find((opt) => opt.value === val);
  const updatedFormData: any = { ...formData, seasonal_variation: val };

  let botMessage: string | undefined;

  // Calculate estimated annual income if hourly
  if (
    updatedFormData.income_type === "hourly" &&
    updatedFormData.hourly_rate &&
    updatedFormData.average_hours_per_week
  ) {
    const annual = calculateAnnualIncomeFromHourly(
      parseFloat(updatedFormData.hourly_rate),
      parseFloat(updatedFormData.average_hours_per_week),
      val
    );
    updatedFormData.estimated_annual_income = annual.toFixed(2);
    botMessage = `Got it! Your estimated annual income is around $${annual.toFixed(2)}.`;
  }

  return {
    formData: updatedFormData,
    userMessage: `My work has ${selectedOption?.label.toLowerCase()}.`,
    botMessage,
  };
};

/**
 * Handles spouse income input
 */
export const handleSpouseIncomeInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped) {
    return {
      formData: { ...formData, spouse_income: "" },
      userMessage: "I'll skip this question",
    };
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue) || numValue < 0) {
    return { error: "Spouse income must be a positive number." };
  }
  if (numValue > 500000) {
    return { error: "Spouse income cannot exceed $500,000." };
  }

  return {
    formData: { ...formData, spouse_income: numValue.toString() },
    userMessage: `My spouse's annual income is ${formatCurrency(numValue)}`,
  };
};

/**
 * Handles pay frequency input
 */
export const handlePayFrequencyInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult => {
  return {
    formData: { ...formData, pay_frequency: isSkipped ? "" : value },
    userMessage: isSkipped ? "I'll skip this question" : `I get paid ${value.toLowerCase()}`,
  };
};

/**
 * Handles current withholding input
 */
export const handleCurrentWithholdingInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped) {
    return {
      formData: { ...formData, current_withholding_per_paycheck: "" },
      userMessage: "I'll skip this question",
    };
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue) || numValue < 0) {
    return { error: "Withholding must be a positive number." };
  }
  console.log(formData.annual_salary,"formData.annual_salary")
  if (formData.annual_salary && numValue > Number(formData.annual_salary)) {
    return { error: "Withholding cannot exceed your annual Salary." };
  }

  return {
    formData: { ...formData, current_withholding_per_paycheck: numValue.toString() },
    userMessage: `My current withholding is ${formatCurrency(numValue)} per paycheck`,
  };
};

/**
 * Handles additional income yes/no input
 */
export const handleAdditionalYesNoInput = (
  value: string,
  formData: FormData
): InputHandlerResult => {
  return {
    formData: { ...formData, additional_yesorno: value },
    userMessage:
      value === "yes"
        ? "Yes, I have additional income"
        : "No, I don't have additional income",
  };
};

/**
 * Handles additional income amount input
 */
export const handleAdditionalIncomeInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped) {
    return {
      formData: { ...formData, additional_income: "" },
      userMessage: "I'll skip this question",
    };
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue) || numValue < 0) {
    return { error: "Additional income must be a positive number." };
  }
  if (numValue > 500000) {
    return { error: "Additional income cannot exceed $500,000." };
  }

  return {
    formData: { ...formData, additional_income: numValue.toString() },
    userMessage: `My additional annual income is ${formatCurrency(numValue)}`,
  };
};

/**
 * Handles standard deduction input
 */
export const handleStandardDeductionInput = (
  value: string,
  formData: FormData
): InputHandlerResult => {
  return {
    formData: { ...formData, standard_deduction: value },
    userMessage:
      value === "yes" ? "Yes, I want the standard deduction" : "No, I'll itemize",
  };
};

/**
 * Handles deductions input
 */
export const handleDeductionsInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped || value === "skip") {
    return {
      formData: { ...formData, deductions: [] },
      userMessage: "I'll skip deductions",
    };
  }

  try {
    const parsedDeductions = JSON.parse(value);
    const deductionSummary = parsedDeductions
      .map(
        (d: any) =>
          `${d.type.replace(/_/g, " ")}: ${formatCurrency(parseFloat(d.amount))}`
      )
      .join(", ");

    return {
      formData: { ...formData, deductions: parsedDeductions },
      userMessage: `My deductions: ${deductionSummary}`,
    };
  } catch {
    return { error: "Invalid deduction data" };
  }
};

/**
 * Handles dependents yes/no input
 */
export const handleDependentsYesNoInput = (
  value: string,
  formData: FormData
): InputHandlerResult => {
  return {
    formData: { ...formData, dependents_yesno: value },
    userMessage:
      value === "yes" ? "Yes, I have dependents" : "No, I don't have dependents",
  };
};

/**
 * Handles dependents count input
 */
export const handleDependentsInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped) {
    return {
      formData: { ...formData, dependents: "" },
      userMessage: "I'll skip this question",
    };
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue) || numValue < 0) {
    return { error: "Dependents must be a positive number." };
  }
  if (numValue > 5) {
    return { error: "Dependents cannot exceed 5." };
  }

  return {
    formData: { ...formData, dependents: numValue.toString() },
    userMessage: `I have ${numValue} dependent(s)`,
  };
};

/**
 * Handles current date input
 */
export const handleCurrentDateInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped) {
    return {
      formData: { ...formData, current_date: "" },
      userMessage: "I'll skip this question.",
    };
  }

  const dateValue = new Date(value);
  const today = new Date();

  if (isNaN(dateValue.getTime())) {
    return { error: "Please select a valid date" };
  }
  if (dateValue > today) {
    return { error: "Please select a valid date." };
  }

  const formattedDate = dateValue.toISOString().split("T")[0];

  return {
    formData: { ...formData, current_date: formattedDate },
    userMessage: `The date of my last paycheck was ${formattedDate}.`,
  };
};

/**
 * Handles work address input
 */
export const handleWorkAddressInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped) {
    return {
      formData: { ...formData, work_address: "" },
      userMessage: "I'll skip this question.",
    };
  }

  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(value)) {
    return {
      error: "Please enter a valid U.S. ZIP code (e.g., 12345 or 12345-6789).",
    };
  }

  return {
    formData: { ...formData, work_address: value },
    userMessage: `My work ZIP code is ${value}.`,
  };
};

/**
 * Handles home address input
 */
export const handleHomeAddressInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped) {
    return {
      formData: { ...formData, home_address: "" },
      userMessage: "I'll skip this question.",
    };
  }

  const zip = value.trim();
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zip)) {
    return {
      error: "Please enter a valid U.S ZIP code (e.g., 12345 or 12345-6789).",
    };
  }

  return {
    formData: { ...formData, home_address: zip },
    userMessage: `My home ZIP code is ${zip}.`,
  };
};

/**
 * Handles pre-tax deductions input
 */
export const handlePreTaxDeductionsInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped) {
    return {
      formData: { ...formData, pre_tax_deductions: "0" },
      userMessage: "I'll skip this question",
    };
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue) || numValue < 0) {
    return { error: "Pre-tax deductions must be a positive number." };
  }

  return {
    formData: { ...formData, pre_tax_deductions: numValue.toString() },
    userMessage: `My pre-tax deductions are ${formatCurrency(numValue)}`,
  };
};

/**
 * Handles post-tax deductions input
 */
export const handlePostTaxDeductionsInput = (
  value: string,
  formData: FormData,
  isSkipped: boolean
): InputHandlerResult | { error: string } => {
  if (isSkipped) {
    return {
      formData: { ...formData, post_tax_deductions: "0" },
      userMessage: "I'll skip this question",
    };
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue) || numValue < 0) {
    return { error: "Post-tax deductions must be a positive number." };
  }

  return {
    formData: { ...formData, post_tax_deductions: numValue.toString() },
    userMessage: `My post-tax deductions are ${formatCurrency(numValue)}`,
  };
};
