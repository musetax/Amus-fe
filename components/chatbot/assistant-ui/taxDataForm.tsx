"use client";
import React, { useState } from "react";
import dayjs from "dayjs";

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
  is_refund_data_fill?: boolean;
  is_paycheck_data_fill?: boolean;
}

export const TaxDataForm: React.FC<{ taxData: TaxData; onSave: (payload: any) => void }> = ({
  taxData,
  onSave,
}) => {
    const defaultFields: TaxData = {
    // first_name: "",
    // middle_name: "",
    // last_name: "",
    income_type: undefined,
    annual_salary: undefined,
    hourly_rate: undefined,
    average_hours_per_week: undefined,
    seasonal_variation:undefined,
    estimated_annual_income: undefined,
    filing_status: undefined,
    pay_frequency: undefined,
    current_withholding_per_paycheck: undefined,
    // desired_boost_per_paycheck: undefined,
    additional_income: undefined,
    deductions: undefined,
    dependents: undefined,
    spouse_income: undefined,
    current_date: dayjs().format("YYYY-MM-DD"),
    // paychecks_already_received: undefined,
    home_address: "",
    work_address: "",
    pre_tax_deductions: undefined,
    post_tax_deductions: undefined,
    age: undefined,
    // is_refund_data_fill: false,
    // is_paycheck_data_fill: false,
  };
const normalizeField = (field: string, value: any) => {
  if (!value) return value;

  const lowercase = typeof value === "string" ? value.trim().toLowerCase() : value;

  switch (field) {
    case "income_type":
      return ["salary", "hourly"].includes(lowercase) ? lowercase : undefined;

    case "filing_status":
      // allow flexible matching
      if (lowercase === "married" || lowercase === "married_joint") return "married_joint";
      if (lowercase === "single") return "single";
      if (lowercase === "head_of_household" || lowercase === "head of household")
        return "head_of_household";
      return undefined;

    case "pay_frequency":
      if (["weekly", "bi-weekly", "semi-monthly", "monthly"].includes(lowercase))
        return lowercase;
      // fix common spelling variants
      if (lowercase === "biweekly") return "bi-weekly";
      if (lowercase === "semimonthly") return "semi-monthly";
      return undefined;

    default:
      return value;
  }
};
const normalizedTaxData = Object.fromEntries(
  Object.entries(taxData || {}).map(([key, value]) => [key, normalizeField(key, value)])
);

  const [form, setForm] = useState<any>({...defaultFields,...normalizedTaxData } );
  const [errors, setErrors] = useState<any>({});
const [submitted, setSubmitted] = useState(false);

  const incomeTypeOptions = [
    { label: "Hourly", value: "hourly" },
    { label: "Salary", value: "salary" },
  ];

  const filingStatusOptions = [
    { label: "Single", value: "single" },
    { label: "Married", value: "married_joint" },
  ];

  const seasonalVariationOptions = [
    { id: 1, value: "none", label: "Consistent year-round", multiplier: 1.0 },
    { id: 2, value: "low", label: "Low variation (±10%)", multiplier: 0.9 },
    { id: 3, value: "moderate", label: "Moderate (±25%)", multiplier: 0.75 },
    { id: 4, value: "high", label: "High (±40%)", multiplier: 0.6 },
  ];

  const payFrequencyOptions = [
    { label: "Weekly", value: "weekly" },
    { label: "Bi-weekly", value: "bi-weekly" },
    { label: "Semi-monthly", value: "semi-monthly" },
    { label: "Monthly", value: "monthly" },
  ];

  const handleChange = (field: string, value: any) => {
    let updated = { ...form, [field]: value };

    // Auto calculate estimated annual income if hourly
    if (field === "hourly_rate" || field === "average_hours_per_week" || field === "seasonal_variation") {
      if (form.income_type === "hourly") {
        const seasonal = seasonalVariationOptions.find((o) => o.value === updated.seasonal_variation);
        const multiplier = seasonal?.multiplier ?? 1;
        updated.estimated_annual_income = (
          parseFloat(updated.hourly_rate || 0) *
          parseFloat(updated.average_hours_per_week || 0) *
          52 *
          multiplier
        ).toFixed(2);
      }
    }

    setForm(updated);
  };
const validate = () => {
  const newErrors: Record<string, string> = {};

  // ✅ List of always-required fields
  const requiredFields = [
    "age",
    "filing_status",
    "income_type",
    "pay_frequency",
    "home_address",
    "work_address",
  ];

  // ✅ Validate all required fields, including undefined/null
  console.log(form,"=====")
  requiredFields.forEach((key) => {
    const value = form[key];
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "string" && value.trim() === "")
    ) {
      newErrors[key] = `${key.replace(/_/g, " ")} is required`;
    }
  });

  // ✅ Conditional validation based on income type and filing status
  if (form.filing_status === "married_joint") {
    if (
      form.spouse_income === undefined ||
      form.spouse_income === null ||
      form.spouse_income === ""
    ) {
      newErrors.spouse_income = "Spouse income is required for married filing status";
    }
  }

  if (form.income_type === "salary") {
    if (
      form.annual_salary === undefined ||
      form.annual_salary === null ||
      form.annual_salary === ""
    ) {
      newErrors.annual_salary = "Annual salary is required for salary income type";
    }
  }

  if (form.income_type === "hourly") {
    if (
      form.hourly_rate === undefined ||
      form.hourly_rate === null ||
      form.hourly_rate === ""
    ) {
      newErrors.hourly_rate = "Hourly rate is required for hourly income type";
    }
    if (
      form.average_hours_per_week === undefined ||
      form.average_hours_per_week === null ||
      form.average_hours_per_week === ""
    ) {
      newErrors.average_hours_per_week = "Average hours per week is required for hourly income type";
    }
    if (
      form.seasonal_variation === undefined ||
      form.seasonal_variation === null ||
      form.seasonal_variation === ""
    ) {
      newErrors.seasonal_variation = "Seasonal variation is required for hourly income type";
    }
  }

  // ✅ Address format validation (ZIP code)
  if (form.home_address && !/^\d{5}$/.test(form.home_address)) {
    newErrors.home_address = "Enter a valid 5-digit ZIP code";
  }
  if (form.work_address && !/^\d{5}$/.test(form.work_address)) {
    newErrors.work_address = "Enter a valid 5-digit ZIP code";
  }

  // ✅ Date validation
  if (form.current_date && dayjs(form.current_date).isAfter(dayjs())) {
    newErrors.current_date = "Date cannot be in the future";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};




const handleSubmit = () => {
  setSubmitted(true); // mark that user tried to submit
  if (!validate()) return;
  form.is_refund_data_fill=true,
  form.is_paycheck_data_fill=true
  onSave(form);
};


  const renderField = (key: string, value: any) => {
    const dropdownFields: any = {
      income_type: incomeTypeOptions,
      filing_status: filingStatusOptions,
      seasonal_variation: seasonalVariationOptions.map(({ value, label }) => ({ value, label })),
      pay_frequency: payFrequencyOptions,
    };

    if (dropdownFields[key]) {
      const options = dropdownFields[key];
      const current = options.find((o: any) => o.value === value) ? value : "";
      return (
        <select
          value={current}
          onChange={(e) => handleChange(key, e.target.value)}
          // className="border rounded-lg px-3 py-2 text-sm text-gray-700 w-full sm:w-48"
          className={`border rounded-lg px-3 py-2 text-sm text-gray-700 w-full sm:w-48 ${
  submitted && errors[key] ? "border-red bg-red-50" : "border-gray-300"
}`}

        >
          <option value="">Select...</option>
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (key === "current_date") {
      return (
        <input
          type="date"
          value={value || ""}
          max={dayjs().format("YYYY-MM-DD")}
          onChange={(e) => handleChange(key, e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm text-gray-700 w-full sm:w-48"
        />
      );
    }

    const numberFields = [
      "age",
      "annual_salary",
      "hourly_rate",
      "average_hours_per_week",
      "spouse_income",
      "estimated_annual_income",
      "dependents",
      "deductions",
      "additional_income",
      "pre_tax_deductions",
      "post_tax_deductions",
      "current_withholding_per_paycheck",
      "desired_boost_per_paycheck",
      "paychecks_already_received",
    ];

    if (numberFields.includes(key)) {
      return (
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => handleChange(key, e.target.value)}
          className={`border rounded-lg px-3 py-2 text-sm text-gray-700 w-full sm:w-48 ${
  submitted && errors[key] ? "border-red" : "border-gray-300"
}`}
        />
      );
    }

    return (
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => handleChange(key, e.target.value)}
        className={`border rounded-lg px-3 py-2 text-sm text-gray-700 w-full sm:w-48 ${
  submitted && errors[key] ? "border-red" : "border-gray-300"
}`}
      />
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 sm:p-8 space-y-6" style={{paddingBottom:20}}>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center">
        Tax Data Form
      </h2>

      <div className="grid grid-cols-1 gap-x-8 gap-y-4" style={{gap:8,marginBottom:16}}>
        {Object.entries(form).map(([key, value]) => {
          if (form.income_type === "salary" && ["hourly_rate", "average_hours_per_week", "seasonal_variation"].includes(key)) return null;
          if (form.income_type === "hourly" && key === "annual_salary") return null;
          if (form.filing_status !== "married_joint" && key === "spouse_income") return null;

          return (
            <div key={key} className="flex flex-col">
              <label className="font-medium text-gray-700 mb-1 capitalize" style={{fontSize:14,textTransform:"capitalize",marginBottom:"4px"}}>
                {key.replace(/_/g, " ")}
              </label>
              {renderField(key, value)}
              {errors[key] && <span className="text-red-500 text-xs mt-1" style={{color:"red"}}>{errors[key]}</span>}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-6" style={{marginTop:"0px",marginBottom:"22px"}}>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded-full font-medium text-white shadow-md transition-all w-full sm:w-auto"
          style={{ backgroundColor: "rgb(81, 141, 231)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgb(65, 120, 210)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(81, 141, 231)")}
        >
          Save
        </button>
      </div>
    </div>
  );
};
