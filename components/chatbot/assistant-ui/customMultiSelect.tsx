import React, { useState } from "react";

interface CustomMultiSelectProps {
  field: {
    name: string;
    options: string[];
  };
  label: string;
  formData: Record<string, any>;
  handleInputChange: (name: string, value: any) => void;
  errors?: Record<string, string>;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  field,
  label,
  formData,
  handleInputChange,
  errors = {},
}) => {
  const [selected, setSelected] = useState<string[]>(
    formData[field.name]?.selected || []
  );
  const [amounts, setAmounts] = useState<Record<string, string>>(
    formData[field.name]?.amounts || {}
  );

  const toggleOption = (option: string) => {
    let updated: string[];
    const updatedAmounts = { ...amounts };

    if (selected.includes(option)) {
      updated = selected.filter((item) => item !== option);
      delete updatedAmounts[option];
    } else {
      updated = [...selected, option];
      updatedAmounts[option] = "";
    }

    setSelected(updated);
    setAmounts(updatedAmounts);
    handleInputChange(field.name, {
      selected: updated,
      amounts: updatedAmounts,
    });
  };

  const handleAmountChange = (option: string, value: string) => {
    const updated = { ...amounts, [option]: value };
    setAmounts(updated);
    handleInputChange(field.name, { selected, amounts: updated });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {/* Label */}
      <div>
        <label
          htmlFor={field.name}
          className="block text-sm font-medium text-gray-700"
          style={{ marginBottom: 8 }}
        >
          {label}
          <span style={{ marginLeft: 4, color: "red" }}>*</span>
        </label>

        {/* Options as checkboxes */}
        <div className="flex flex-wrap gap-2">
          {field.options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
                className="accent-blue-500"
              />
              <span className="text-gray-700" style={{ fontSize: "14px" }}>
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>
      {/* Dynamic inputs for selected options */}
      {selected.length > 0 &&
        selected.map((option) => (
          <div key={option}>
            <label
              htmlFor={option}
              className="block text-sm font-medium text-gray-700"
              style={{ marginBottom: 4 }}
            >
              {option}
            </label>
            <input
              type="number"
              value={amounts[option] || ""}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = parseFloat(value);
                // Prevent negative values
                if (value === "" || (!isNaN(numValue) && numValue >= 0)) {
                  handleAmountChange(option, value);
                }
              }}
              onWheel={(e) => {
                // Prevent scroll changing number value
                e.currentTarget.blur();
              }}
              min="0"
              step="any"
              placeholder={`Enter amount for ${option}`}
              className={`w-full border ${
                errors[field.name] ? "border-red-500" : "border-gray-300"
              } rounded-2xl px-3 py-2 text-gray-900 focus:outline-none`}
            />
          </div>
        ))}
    </div>
  );
};

export default CustomMultiSelect;
