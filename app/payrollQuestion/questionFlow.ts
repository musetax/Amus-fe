import { StepType, FormData, TaxData } from "./types";

type AgentIntent = "tax_refund_calculation" | "tax_paycheck_calculation";

/**
 * Determines which questions to ask based on prefilled data and agent intent
 */
export const getQuestionsToAsk = (
  prefilledData: Partial<TaxData>,
  agentIntent: AgentIntent,
  allfillData:any
): StepType[] => {
  const questions: StepType[] = [];

  // ============================================
  // COMMON QUESTIONS (for both refund and paycheck)
  // ============================================

  // Filing status
  if (!prefilledData.filing_status) {
    questions.push("filing_status");
    questions.push('head_of_household')
  }

  // Age

  // Income type
  if (!prefilledData.income_type) {
    questions.push("income_type");
  }

  // Salary or hourly questions - skip logic will handle which to show
  if (!prefilledData.annual_salary) questions.push("annual_salary");
  if (!prefilledData.hourly_rate &&(!prefilledData.income_type||prefilledData.income_type==="hourly")) questions.push("hourly_rate");
  if (!prefilledData.average_hours_per_week &&(!prefilledData.income_type||prefilledData.income_type==="hourly")) questions.push("average_hours_per_week");
  if (!prefilledData.seasonal_variation &&(!prefilledData.income_type||prefilledData.income_type==="hourly") ) questions.push("seasonal_variation");

  // Pay frequency
  if (!prefilledData.pay_frequency) questions.push("pay_frequency");

    // Dependents (common for both)
    console.log(!prefilledData.dependents &&!allfillData.is_refund_data_fill&&!allfillData.is_paycheck_data_fill,"[[[]p[pl")
  if (!prefilledData.dependents &&!allfillData.is_refund_data_fill&&!allfillData.is_paycheck_data_fill) {
    questions.push("dependents_yesno");
    questions.push("dependents");
  }
console.log()
  // Spouse income (if married filing jointly)
  if ((!prefilledData.spouse_income ||prefilledData.spouse_income===0)&& (prefilledData.filing_status === 'married_joint' ||!prefilledData.filing_status)) {
    questions.push("spouse_income");
  }
    if (!prefilledData.age) questions.push("age");

    if (!prefilledData.home_address) questions.push("home_address");
    if (!prefilledData.work_address) questions.push("work_address");
  // ============================================
  // AGENT INTENT SPECIFIC QUESTIONS
  // ============================================

  if (agentIntent === "tax_refund_calculation") {
    // Refund-specific questions
    if (!prefilledData.current_withholding_per_paycheck) {
      questions.push("current_withholding");
    }

    // Additional income
    if (!prefilledData.additional_income) {
      questions.push("additional_yesorno");
      questions.push("additional_income");
    }

    // Deductions
    if (!prefilledData.deductions) {
      questions.push("standard_deduction");
      questions.push("deductions");
    }

    // Current date
    if (!prefilledData.current_date) questions.push("current_date");

  } else if (agentIntent === "tax_paycheck_calculation") {
    // Paycheck-specific questions

    if (!prefilledData.pre_tax_deductions) questions.push("pre_tax_deductions");
    if (!prefilledData.post_tax_deductions) questions.push("post_tax_deductions");
  }

  return questions;
};

/**
 * Determines if a question should be skipped based on form data
 */
export const shouldSkipQuestion = (
  step: StepType,
  data: FormData
): boolean => {
  console.log(data, "======")
  // Skip additional income if user said no
  if (step === "additional_income" && data.additional_yesorno === "no") {
    return true;
  }
  if (step === "head_of_household" && data.filing_status === 'married_joint'){ return true;}
  // Skip dependents if user said no
  if (step === "dependents" && data.dependents_yesno === "no") {
    return true;
  }

  // Skip salary questions for hourly users
  if (step === "annual_salary" && data.income_type === "hourly") {
    return true;
  }
  if (step === 'spouse_income' && (data.filing_status === "single"||data.filing_status==="head_of_household")) {return true}
  // Skip hourly-specific questions for salary users
  if (
    ["hourly_rate", "average_hours_per_week", "seasonal_variation"].includes(step) &&
    data.income_type === "salary"
  ) {
    return true;
  }

  return false;
};

/**
 * Gets the next valid question index
 */
export const getNextQuestionIndex = (
  currentIndex: number,
  questionsToAsk: StepType[],
  formData: FormData
): number => {
  let nextIndex = currentIndex + 1;

  // Skip questions conditionally
  while (nextIndex < questionsToAsk.length) {
    const nextStep = questionsToAsk[nextIndex];

    if (shouldSkipQuestion(nextStep, formData)) {
      nextIndex++;
      continue;
    }

    break;
  }

  return nextIndex;
};
