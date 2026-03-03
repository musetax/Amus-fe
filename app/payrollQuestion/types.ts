// Type definitions for Payroll Question Chatbot

export type StepType =
  | "filing_status"
  | "income_type"
  | "head_of_household"
  | "age"
  | "hourly_rate"
  | "average_hours_per_week"
  | "seasonal_variation"
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
  | "pre_tax_deductions"
  | "post_tax_deductions"
  | "complete"
  | "saved";

export interface TaxData {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  income_type?: "salary" | "hourly";
  annual_salary?: number;
  hourly_rate?: number;
  average_hours_per_week?: number;
  seasonal_variation?: "none" | "low" | "medium" | "high";
  estimated_annual_income?: number;
  filing_status?: "single" | "married_joint" | "head_of_household";
  pay_frequency?: "weekly" | "bi-weekly" | "semi-monthly" | "monthly";
  current_withholding_per_paycheck?: number;
  desired_boost_per_paycheck?: number;
  additional_income?: number;
  deductions?: any;
  dependents?: number;
  spouse_income?: number;
  current_date?: string;
  paychecks_already_received?: number;
  home_address?: string;
  work_address?: string;
  pre_tax_deductions?: number;
  post_tax_deductions?: number;
  age?: number;
  // is_all_data_fill?:boolean
   is_refund_data_fill?:boolean,
  is_paycheck_data_fill?: boolean,
}

export interface FormData {
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  filing_status: string | null;
  income_type: string | null;
  age: string | null;
  annual_salary: string | null;
  hourly_rate: string | null;
  average_hours_per_week: string | null;
  seasonal_variation: string | null;
  estimated_annual_income: string | null;
  pay_frequency: string | null;
  current_withholding_per_paycheck: string | null;
  desired_boost_per_paycheck: string | null;
  spouse_income: string | null;
  additional_yesorno: string | null;
  additional_income: string | null;
  standard_deduction: string | null;
  deductions: any;
  dependents_yesno: string | null;
  dependents: string | null;
  current_date: string | null;
  paychecks_already_received: string | null;
  home_address: string | null;
  work_address: string | null;
  pre_tax_deductions: string | null;
  post_tax_deductions: string | null;
  // is_all_data_fill:boolean,
    is_refund_data_fill?:boolean,
  is_paycheck_data_fill?: boolean,
}

export interface Payload {
  payroll: TaxData;
}

export type Option = {
  label: string;
  value: string;
};

export interface MessageContent {
  content?: string;
  inputType?: string;
  placeholder?: string;
  selectType?: string;
  options?: Option[];
}

export interface Message {
  type: "bot" | "user";
  content: string | MessageContent;
  options?: Option[];
  inputType?: string;
  placeholder?: string;
  createdAt: Date;
}

export interface TaxChatbotProps {
  onComplete?: (taxData: TaxData) => void;
  onContinueToChat?: () => void;
  image?: string;
  companyLogo?: string;
  prefilledData?: Partial<TaxData>;
  allfillData?:any;
  agentIntent?: "tax_refund_calculation" | "tax_paycheck_calculation";
}

export interface TaxUserMessageProps {
  message: Message;
  image?: string;
}

export interface TaxBotMessageProps {
  message: Message;
  isLast: boolean;
  onOptionSelect: (option: string) => void;
  onInputSubmit: (value: string) => void;
  currentStep: string;
  isTyping: boolean;
  error: string;
  companyLogo?: string;
  inputKey?: number;
}

export interface TaxInputFieldProps {
  type: string;
  placeholder: string;
  onSubmit: (value: string) => void;
}

export interface SummaryCardProps {
  icon: React.ComponentType;
  title: string;
  value: string;
  color: string;
}

export interface SeasonalVariationOption {
  id: number;
  value: string;
  label: string;
  multiplier: number;
}
