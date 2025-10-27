import { Message, StepType, TaxData } from "./types";
import { seasonalVariationOptions } from "./utils";

export const generateInitialMessage = (
  questionsToAsk: StepType[],
  prefilledData: Partial<TaxData>
): Message => {
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

  return generateMessageForStep(questionsToAsk[0], greeting, prefilledData);
};

export const generateMessageForStep = (
  step: StepType,
  greeting: string = "",
  prefilledData: any = {}
): Message => {
  const greetingPrefix = greeting ? `${greeting}\n\n` : "";

  switch (step) {
    case "filing_status":
      return {
        type: "bot",
        content: `${greetingPrefix}Let's start with your filing status:`,
        options: [
          { label: "Single", value: "single" },
          { label: "Married", value: "married_joint" },
        ],
        createdAt: new Date(),
      };

    case "income_type":
      return {
        type: "bot",
        content: {
          content: `${greetingPrefix}Let's start with your income type:`,
          selectType: "dropdown",
          options: [
            { label: "Hourly", value: "hourly" },
            { label: "Salary", value: "salary" },
          ],
          placeholder: "Select income type",
        },
        createdAt: new Date(),
      };

    case "head_of_household":
      return {
        type: "bot",
        content: {
          content: `${greetingPrefix}Are you  head of household?`,
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
          content: `${greetingPrefix}Please enter your age :`,
          inputType: "number",
          placeholder: "Enter your age (must be between 13 and 100)",
        },
        createdAt: new Date(),
      };

    case "hourly_rate":
      return {
        type: "bot",
        content: {
          content: "What is your Hourly rate?",
          inputType: "number",
          placeholder: "Enter Hourly rate (e.g., 25)",
        },
        createdAt: new Date(),
      };

    case "average_hours_per_week":
      return {
        type: "bot",
        content: {
          content: "How many hours do you work on average per week?",
          inputType: "number",
          placeholder: "Enter hours (e.g., 40)",
        },
        createdAt: new Date(),
      };

    case "seasonal_variation":
      return {
        type: "bot",
        content: {
          content: "How consistent are your work hours throughout the year?",
          selectType: "dropdown",
          options: seasonalVariationOptions.map((opt) => ({
            label: opt.label,
            value: opt.value,
          })),
          placeholder: "Select seasonal variation",
        },
        createdAt: new Date(),
      };

    case "annual_salary":
      return {
        type: "bot",
        content: {
          content: `${greetingPrefix}What is your annual Salary?`,
          inputType: "number",
          placeholder: "Enter annual Salary (e.g., 75000)",
        },
        createdAt: new Date(),
      };

    case "spouse_income":
      return {
        type: "bot",
        content: {
          content: `${greetingPrefix}Since you're married, I also need your spouse's annual income.`,
          inputType: "number",
          placeholder: "Enter spouse annual income",
        },
        createdAt: new Date(),
      };

    case "pay_frequency":
      return {
        type: "bot",
        content: {
          content: `${greetingPrefix}Great! Now I need to know how often you get paid.`,
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
          content: `${greetingPrefix} What is your current withholding amount per paycheck?`,
          inputType: "number",
          placeholder: "Enter withholding amount per paycheck",
        },
        createdAt: new Date(),
      };

    case "additional_yesorno":
      return {
        type: "bot",
        content: {
          content: `${greetingPrefix}Do you have any additional income?`,
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
          content: `${greetingPrefix}Please enter your additional annual income (e.g., freelance, investments, or rental):`,
          inputType: "number",
          placeholder: "Enter additional annual income",
        },
        createdAt: new Date(),
      };

    case "standard_deduction":
      return {
        type: "bot",
        content: {
          content: `${greetingPrefix}Do you want to take the standard deduction?`,
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
            content: `${greetingPrefix}Since you are taking the standard deduction, you can optionally select:`,
            selectType: "checkbox",
            options: [
              { label: "IRA Contribution", value: "ira_contribution" },
              {
                label: "Student Loan Interest",
                value: "student_loan_interest",
              },
            ],
            placeholder: "Select any that apply (optional)",
          },
          createdAt: new Date(),
        };
      } else {
        return {
          type: "bot",
          content: {
            content: `${greetingPrefix}Which deductions apply to you? Select all that apply:`,
            selectType: "checkbox",
            options: [
              { label: "IRA Contribution", value: "ira_contribution" },
              {
                label: "Student Loan Interest",
                value: "student_loan_interest",
              },
              { label: "State or Local Tax", value: "state_local_tax" },
              { label: "Medical Expenses", value: "medical_expenses" },
              { label: "Charitable Donations", value: "charitable_donation" },
              {
                label: "Home Mortgage Interest",
                value: "home_mortgage_interest",
              },
              { label: "Other Deductions", value: "other_deduction" },
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
          content: `${greetingPrefix}Do you have any dependents?`,
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
          content: `${greetingPrefix}How many dependents do you have?`,
          selectType: "drop-down",
          options: [
            { label: "One", value: "1" },
            { label: "Two", value: "2" },
            { label: "Three", value: "3" },
            { label: "Four", value: "4" },
            { label: "Five", value: "5" },
          ],
          placeholder: "Select number of dependents",
        },
        createdAt: new Date(),
      };

    case "current_date":
      return {
        type: "bot",
        content: {
          content: `${greetingPrefix}When did you receive your last paycheck?`,
          inputType: "date",
          placeholder: "Select the date of your last paycheck",
        },
        createdAt: new Date(),
      };

    case "work_address":
      return {
        type: "bot",
        content: {
          content: `${greetingPrefix}Please enter your work ZIP code:`,
          inputType: "number",
          placeholder: "Enter work ZIP code",
        },
        createdAt: new Date(),
      };

    case "home_address":
      return {
        type: "bot",
        content: {
          content: `${greetingPrefix}Please enter your home ZIP code:`,
          inputType: "number",
          placeholder: "Enter home ZIP code",
        },
        createdAt: new Date(),
      };

    case "pre_tax_deductions":
      return {
        type: "bot",
        content: {
          content: "Please enter your total pre-tax deductions :",
          inputType: "number",
          placeholder: "e.g., 2000",
        },
        createdAt: new Date(),
      };

    case "post_tax_deductions":
      return {
        type: "bot",
        content: {
          content: "Please enter your total post-tax deductions :",
          inputType: "number",
          placeholder: "e.g., 500",
        },
        createdAt: new Date(),
      };

    default:
      return {
        type: "bot",
        content: greeting || "Let's continue with your tax information.",
        createdAt: new Date(),
      };
  }
};
