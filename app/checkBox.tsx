import React, { useState, useEffect, useRef } from "react";

interface CheckboxDeductionsProps {
  options: Array<{ label: string; value: string }>;
  onSubmit: (selectedDeductions: any[]) => void;
}

const CheckboxDeductions: React.FC<CheckboxDeductionsProps> = ({ options, onSubmit }) => {
    console.log(options,"==============================")
  const [selectedDeductions, setSelectedDeductions] = React.useState<string[]>([]);
  const [deductionValues, setDeductionValues] = React.useState<Record<string, string>>({});
  const [showInputs, setShowInputs] = React.useState(false);

  const handleCheckboxChange = (value: string) => {
    setSelectedDeductions((prev) => {
      if (prev.includes(value)) {
        const updated = prev.filter((v) => v !== value);
        const { [value]: removed, ...rest } = deductionValues;
        setDeductionValues(rest);
        return updated;
      } else {
        return [...prev, value];
      }
    });
  };

  const handleContinue = () => {
    if (selectedDeductions.length > 0) {
      setShowInputs(true);
    } else {
      onSubmit([]);
    }
  };

  const handleValueChange = (deduction: string, value: string) => {
    setDeductionValues((prev) => ({
      ...prev,
      [deduction]: value,
    }));
  };

  const handleSubmitValues = () => {
    const result = selectedDeductions.map((deduction) => ({
      type: deduction,
      amount: deductionValues[deduction] || "0",
    }));
    onSubmit(result);
  };

  if (showInputs) {
    return (
      <div className="space-y-4 mt-4">
        <div className="text-sm font-medium" style={{ color: "#31333f" }}>
          Enter the amount for each deduction:
        </div>
        {selectedDeductions.map((deduction) => {
          const option = options.find((opt) => opt.value === deduction);
          return (
            <div key={deduction} className="space-y-2">
              <label className="text-sm" style={{ color: "#45556c" }}>
                {option?.label}
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                value={deductionValues[deduction] || ""}
                onChange={(e) => handleValueChange(deduction, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: "white", color: "#31333f" }}
              />
            </div>
          );
        })}
        <button
          onClick={handleSubmitValues}
          className="w-full py-3 px-4 text-white rounded-2xl transition-colors font-medium"
          style={{ backgroundColor: "#518DE7" }}
        >
          Submit Deductions
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
          style={{ border: "1px solid #e5e7eb" }}
        >
          <input
            type="checkbox"
            value={option.value}
            checked={selectedDeductions.includes(option.value)}
            onChange={() => handleCheckboxChange(option.value)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            style={{ accentColor: "#518DE7" }}
          />
          <span className="text-sm" style={{ color: "#31333f" }}>
            {option.label}
          </span>
        </label>
      ))}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleContinue}
          className="flex-1 py-3 px-4 text-white rounded-2xl transition-colors font-medium"
          style={{ 
            backgroundColor: selectedDeductions.length === 0 ? "#9ca3af" : "#518DE7",
            cursor: selectedDeductions.length === 0 ? "not-allowed" : "pointer"
          }}
          disabled={selectedDeductions.length === 0}
        >
          Continue
        </button>
        <button
          onClick={() => onSubmit([])}
          className="py-3 px-4 rounded-2xl transition-colors font-medium"
          style={{ 
            backgroundColor: "#f3f4f6", 
            color: "#374151",
            border: "1px solid #e5e7eb"
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
};
export default CheckboxDeductions