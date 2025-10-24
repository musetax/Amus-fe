import React, { useState, useRef, useEffect } from "react";

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>(
    formData[field.name]?.selected || []
  );
  const [amounts, setAmounts] = useState<Record<string, string>>(
    formData[field.name]?.amounts || {}
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    let updated: string[];
    let updatedAmounts = { ...amounts };

    if (selected.includes(option)) {
      updated = selected.filter((item) => item !== option);
      delete updatedAmounts[option]; // remove its amount when deselected
    } else {
      updated = [...selected, option];
      updatedAmounts[option] = ""; // add empty input for new selection
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
    <div className="relative" ref={dropdownRef}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {/* Dropdown */}
        <div style={{ position: "relative" }}>
          <label
            htmlFor={field.name}
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            {label}
            <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>
          </label>
          <div
            onClick={() => setIsOpen((prev) => !prev)}
            className={`w-full border ${
              errors[field.name] ? "border-red-500" : "border-gray-300"
            } rounded-2xl px-2 py-2 bg-white text-gray-900 flex flex-wrap gap-1 items-center cursor-pointer`}
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: "14px",
              border: errors[field.name]
                ? "1px solid #ef4444"
                : "1px solid #d1d5db",
              borderRadius: "10px",
              outline: "none",
              transition: "all 0.2s",
              backgroundColor: "#ffffff",
              cursor: "text",
            }}
          >
            {selected.length > 0 ? (
              selected.map((option) => (
                <span
                  key={option}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-xl text-sm flex items-center gap-1"
                >
                  {option}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(option);
                    }}
                    className="bg_custom"
                    style={{
                      color: "#ffffff",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">Select options...</span>
            )}
          </div>

          {/* Dropdown options */}
          {isOpen && (
            <div
              className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-y-auto custom-scrollbar"
              style={{ maxHeight: 120 }}
            >
              {field.options.map((option) => (
                <div
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center gap-2 ${
                    selected.includes(option) ? "bg-blue-100" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    readOnly
                    className="accent-blue-500"
                  />
                  <span className="text-gray-700 text-sm">{option}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Dynamic inputs for selected options */}
        {selected.length > 0 && (
          <>
            {selected.map((option) => (
              <div key={option} style={{ marginBottom: 5 }}>
                <label
                  htmlFor={field.name}
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  {option}
                </label>
                <input
                  type="number"
                  value={amounts[option] || ""}
                  onChange={(e) => handleAmountChange(option, e.target.value)}
                  placeholder={`${option}`}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "14px",
                    border: errors[field.name]
                      ? "1px solid #ef4444"
                      : "1px solid #d1d5db",
                    borderRadius: "10px",
                    outline: "none",
                    transition: "all 0.2s",
                    backgroundColor: "#ffffff",
                    cursor: "text",
                  }}
                  className="w-full  bg-white border h-10 rounded-2xl focus:outline-none focus:ring-0 outline-none text-gray-900"
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomMultiSelect;
