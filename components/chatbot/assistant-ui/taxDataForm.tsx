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
  pre_tax_deductions?: any;
  post_tax_deductions?: any;
  age?: number;
  is_refund_data_fill?: boolean;
  is_paycheck_data_fill?: boolean;
}

export const TaxDataForm: React.FC<{
  taxData: TaxData;
  onSave: (payload: TaxData) => void;
  onCancel?: () => void;
}> = ({ taxData, onSave, onCancel }) => {
  const defaultFields: TaxData = {
    income_type: undefined,
    annual_salary: undefined,
    hourly_rate: undefined,
    average_hours_per_week: undefined,
    seasonal_variation: undefined,
    estimated_annual_income: undefined,
    filing_status: undefined,
    pay_frequency: undefined,
    current_withholding_per_paycheck: undefined,
    additional_income: undefined,
    deductions: undefined,
    dependents: undefined,
    spouse_income: undefined,
    home_address: "",
    work_address: "",
    pre_tax_deductions: undefined,
    post_tax_deductions: undefined,
    age: undefined,
  };

  const normalizeField = (field: string, value: any) => {
    if (!value) return value;

    const lowercase =
      typeof value === "string" ? value.trim().toLowerCase() : value;

    switch (field) {
      case "income_type":
        return ["salary", "hourly"].includes(lowercase) ? lowercase : undefined;

      case "filing_status":
        if (lowercase === "married" || lowercase === "married_joint")
          return "married_joint";
        if (lowercase === "single") return "single";
        if (
          lowercase === "head_of_household" ||
          lowercase === "head of household"
        )
          return "head_of_household";
        return undefined;

      case "pay_frequency":
        if (
          ["weekly", "bi-weekly", "semi-monthly", "monthly"].includes(lowercase)
        )
          return lowercase;
        if (lowercase === "biweekly") return "bi-weekly";
        if (lowercase === "semimonthly") return "semi-monthly";
        return undefined;

      default:
        return value;
    }
  };

  const normalizedTaxData = Object.fromEntries(
    Object.entries(taxData || {}).map(([key, value]) => [
      key,
      normalizeField(key, value),
    ])
  );

  const [form, setForm] = useState<any>({
    ...defaultFields,
    ...normalizedTaxData,
  });
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

  const requiredFields = [
    "age",
    "filing_status",
    "income_type",
    "pay_frequency",
    "home_address",
    "work_address",
  ];

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

  const formatFieldLabel = (field: string) => {
    if (field === "home_address") return "Home Zipcode";
    if (field === "work_address") return "Work Zipcode";

    return field
      .replace(/_/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const isEmptyValue = (value: any) =>
    value === undefined ||
    value === null ||
    value === "" ||
    (typeof value === "string" && value.trim() === "");

  const getFieldError = (field: string, values: Record<string, any>) => {
    const value = values[field];

    if (requiredFields.includes(field) && isEmptyValue(value)) {
      return `${formatFieldLabel(field)} is required`;
    }

    switch (field) {
      case "spouse_income":
        if (
          values.filing_status === "married_joint" &&
          isEmptyValue(value)
        ) {
          return "Spouse income is required for married filing status";
        }
        break;
      case "annual_salary":
        if (
          values.income_type === "salary" &&
          isEmptyValue(value)
        ) {
          return "Annual salary is required for salary income type";
        }
        break;
      case "hourly_rate":
        if (
          values.income_type === "hourly" &&
          isEmptyValue(value)
        ) {
          return "Hourly rate is required for hourly income type";
        }
        break;
      case "average_hours_per_week":
        if (
          values.income_type === "hourly" &&
          isEmptyValue(value)
        ) {
          return "Average hours per week is required for hourly income type";
        }
        break;
      case "seasonal_variation":
        if (
          values.income_type === "hourly" &&
          isEmptyValue(value)
        ) {
          return "Seasonal variation is required for hourly income type";
        }
        break;
      case "home_address":
        if (!isEmptyValue(value) && !/^\d{5}$/.test(String(value).trim())) {
          return "Enter a valid 5-digit ZIP code";
        }
        break;
      case "work_address":
        if (!isEmptyValue(value) && !/^\d{5}$/.test(String(value).trim())) {
          return "Enter a valid 5-digit ZIP code";
        }
        break;
      case "current_date":
        if (
          value &&
          dayjs(value).isAfter(dayjs())
        ) {
          return "Date cannot be in the future";
        }
        break;
      case "age":
        if (!isEmptyValue(value)) {
          const age = Number(value);
          if (isNaN(age) || age < 13 || age > 99) {
            return "Age must be between 13 and 99";
          }
        }
        break;
      default:
        break;
    }

    return undefined;
  };

  const handleChange = (field: string, value: any) => {
    let newValue = value;
    if (numberFields.includes(field)) {
      newValue = value === "" ? undefined : Number(value);
    }

    const updated = { ...form, [field]: newValue };

    if (
      field === "hourly_rate" ||
      field === "average_hours_per_week" ||
      field === "seasonal_variation"
    ) {
      if (form.income_type === "hourly") {
        const seasonal = seasonalVariationOptions.find(
          (o) => o.value === updated.seasonal_variation
        );
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
    setErrors((prevErrors: Record<string, string>) => {
      const nextErrors = { ...prevErrors };
      const affectedFields = new Set<string>([field]);

      if (field === "income_type") {
        ["annual_salary", "hourly_rate", "average_hours_per_week", "seasonal_variation"].forEach(
          (f) => affectedFields.add(f)
        );
      }

      if (field === "filing_status") {
        affectedFields.add("spouse_income");
      }

      affectedFields.forEach((f) => {
        const error = getFieldError(f, updated);
        if (error) {
          nextErrors[f] = error;
        } else {
          delete nextErrors[f];
        }
      });

      return nextErrors;
    });
  };

  const sumArray = (arr: any) =>
    Array.isArray(arr)
      ? arr.reduce((sum, item) => sum + (item?.amount || 0), 0)
      : 0;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    const fieldsToValidate = new Set<string>([
      ...requiredFields,
      "spouse_income",
      "annual_salary",
      "hourly_rate",
      "average_hours_per_week",
      "seasonal_variation",
      "home_address",
      "work_address",
      "current_date",
      "age",
    ]);

    fieldsToValidate.forEach((field) => {
      const error = getFieldError(field, form);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!validate()) return;

    const updatedForm = {
      ...form,
      pre_tax_deductions: Array.isArray(form.pre_tax_deductions)
        ? sumArray(form.pre_tax_deductions)
        : form.pre_tax_deductions,
      post_tax_deductions: Array.isArray(form.post_tax_deductions)
        ? sumArray(form.post_tax_deductions)
        : form.post_tax_deductions,
      deductions: Array.isArray(form.deductions)
        ? sumArray(form.deductions)
        : form.deductions,
    };

    console.log("Submitting form:", updatedForm);
    onSave(updatedForm);
  };

  const renderField = (key: string, value: any) => {
    const dropdownFields: any = {
      income_type: incomeTypeOptions,
      filing_status: filingStatusOptions,
      seasonal_variation: seasonalVariationOptions.map(({ value, label }) => ({
        value,
        label,
      })),
      pay_frequency: payFrequencyOptions,
    };
    const getPlaceholder = (field: string) => {
      const label = formatFieldLabel(field);

      if (dropdownFields[field]) return `Select ${label}`;
      if (numberFields.includes(field)) return `Enter ${label}`;
      if (field === "current_date") return "";
      if (field === "home_address") return "Enter Home Zipcode";
      if (field === "work_address") return "Enter Work Zipcode";
      return `Enter ${label}`;
    };

    const placeholder = getPlaceholder(key);
    if (dropdownFields[key]) {
      const options = dropdownFields[key];
      const current = options.find((o: any) => o.value === value) ? value : "";
      return (
        <select
          value={current}
          onChange={(e) => handleChange(key, e.target.value)}
          style={{ height: 40 }}
          className={`border rounded-lg px-3 py-2 text-sm text-gray-700 w-full sm:w-48 ${
            submitted && errors[key]
              ? "border-red bg-red-50"
              : "border-gray-300"
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
          style={{ height: 40 }}
        />
      );
    }

    if (numberFields.includes(key)) {
      return (
        <input
          type="number"
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => handleChange(key, e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
          className={`border rounded-lg px-3 py-2 text-sm text-gray-700 w-full sm:w-48 ${
            submitted && errors[key] ? "border-red" : "border-gray-300"
          }`}
          style={{ height: 40 }}
        />
      );
    }

    return (
      <input
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => handleChange(key, e.target.value)}
        className={`border rounded-lg px-3 py-2 text-sm text-gray-700 w-full sm:w-48 ${
          submitted && errors[key] ? "border-red" : "border-gray-300"
        }`}
        style={{ height: 40 }}
      />
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 sm:p-8 space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center">
        Tax Data Form
      </h2>

      <div className="grid grid-cols-1 gap-x-8 gap-y-4">
        {Object.entries(form).map(([key, value]) => {
          if (
            [
              "pre_tax_deductions",
              "post_tax_deductions",
              "deductions",
            ].includes(key)
          )
            return null;

          if (
            form.income_type === "salary" &&
            [
              "hourly_rate",
              "average_hours_per_week",
              "seasonal_variation",
            ].includes(key)
          )
            return null;
          if (form.income_type === "hourly" && key === "annual_salary")
            return null;
          if (form.filing_status !== "married_joint" && key === "spouse_income")
            return null;
          const label = formatFieldLabel(key);
          const isRequiredField = requiredFields.includes(key);
          {
            console.log("Rendering field:", key, value);
          }
          return (
            <div
              key={key}
              className="flex flex-col"
              style={{ marginBottom: 8 }}
            >
              <label
                className="font-medium text-gray-700 mb-1 capitalize"
                style={{
                  fontSize: 14,
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "start",
                  gap: 4,
                }}
              >
                {label}
                {isRequiredField && (
                  <span
                    style={{
                      color: errors[key] ? "red" : "#f97316",
                      fontWeight: 600,
                    }}
                  >
                    *
                  </span>
                )}
                {/* {key.replace(/_/g, " ")} */}
              </label>
              {renderField(key, value)}
              {errors[key] && (
                <span
                  className="text-red-500 text-xs mt-1"
                  style={{ color: "red" }}
                >
                  {errors[key]}
                </span>
              )}
            </div>
          );
        })}

        {/* 🧾 Deduction Arrays */}
        {["pre_tax_deductions", "post_tax_deductions", "deductions"].map(
          (fieldKey) => {
            const arr = form[fieldKey];
            if (!Array.isArray(arr) || arr.length === 0) return null;

            return (
              <div
                key={fieldKey}
                className="mt-4 border-t pt-4 bg-gray-50 rounded-lg p-3"
              >
                <h3 className="text-md font-semibold text-gray-700 mb-2">
                  {formatFieldLabel(fieldKey)}
                </h3>

                {arr.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between mb-2 space-x-3"
                  >
                    <span className="text-sm text-gray-800 w-1/2">
                      {item.deduction_type}
                    </span>
                    <input
                      type="number"
                      value={item.amount ?? ""}
                      onChange={(e) => {
                        const updatedArr = [...arr];
                        updatedArr[index].amount = Number(e.target.value) || 0;
                        setForm({ ...form, [fieldKey]: updatedArr });
                      }}
                      className="border rounded-lg px-3 py-1 text-sm text-gray-700 w-32"
                      style={{ height: 40 }}
                    />
                  </div>
                ))}

                <div className="mt-2 text-right font-medium text-gray-700">
                  Total:{" "}
                  {arr
                    .reduce((sum, item) => sum + (item.amount || 0), 0)
                    .toFixed(2)}
                </div>
              </div>
            );
          }
        )}
      </div>

      <div className="flex justify-center flex-col gap-3 pt-6">
        <button
          onClick={onCancel}
          className="px-6 py-2 rounded-full font-medium text-white w-full sm:w-auto"
          style={{
            border: "1px solid rgb(81, 141, 231)",
            color: "rgb(81, 141, 231)",
            backgroundColor: "transparent",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded-full font-medium text-white shadow-md w-full sm:w-auto"
          style={{ backgroundColor: "rgb(81, 141, 231)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgb(65, 120, 210)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "rgb(81, 141, 231)")
          }
        >
          Save
        </button>
      </div>
    </div>
  );
};
