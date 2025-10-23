import React, { useState } from "react";
import { LifeEventCategory } from "./life-events-screen";

interface LifeEventsFormProps {
  category: LifeEventCategory;
  onBack: () => void;
  onSave: (data: any) => void;
  userId?: string;
}

export const LifeEventsForm: React.FC<LifeEventsFormProps> = ({
  category,
  onBack,
  onSave,
  userId,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const config = getCategoryConfig();
    if (!config) return false;

    const newErrors: any = {};
    let hasError = false;

    config.fields.forEach((field) => {
      const value = formData[field.name];

      // Skip validation for optional fields (notes/textarea)
      if (field.type === "textarea") {
        return;
      }

      // Check if field is empty or has default/invalid value
      if (!value || value === "" || value === "Select") {
        newErrors[field.name] = `${field.label} is required`;
        hasError = true;
      }

      // Additional validation for number fields
      if (field.type === "number" && value && parseFloat(value) < 0) {
        newErrors[field.name] = `${field.label} must be a positive number`;
        hasError = true;
      }
    });

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async () => {
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // Here you would make an API call to save the data
      await onSave({ category, ...formData, userId });
      setIsSaved(true);
      setShowModal(true);
      setIsSaving(false);
    } catch (error) {
      console.error("Error saving life event data:", error);
      setIsSaving(false);
    }
  };

  const handleContinue = () => {
    // This will redirect back to main menu
    setShowModal(false);
    onBack();
  };

  const getCategoryConfig = () => {
    switch (category) {
      case "disability":
        return {
          title: "Disability Updates",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          ),
          gradient: "from-[#69DEC6] to-[#49C2D4]",
          fields: [
            { name: "disability_status", label: "Disability Status", type: "select", options: ["None", "Temporary", "Permanent", "Partial"] },
            { name: "disability_date", label: "Date of Disability", type: "date" },
            { name: "disability_benefits", label: "Receiving Disability Benefits?", type: "select", options: ["No", "Yes"] },
            { name: "benefit_amount", label: "Monthly Benefit Amount ($)", type: "number" },
            { name: "medical_expenses", label: "Annual Medical Expenses ($)", type: "number" },
            { name: "disability_notes", label: "Additional Notes", type: "textarea" },
          ],
        };
      case "financial_investment":
        return {
          title: "Financial & Investment Updates",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          ),
          gradient: "from-[#1595EA] to-[#548CE7]",
          fields: [
            { name: "investment_type", label: "Investment Type", type: "select", options: ["Select", "Stocks", "Bonds", "Real Estate", "Crypto", "Retirement Account", "Other"] },
            { name: "investment_date", label: "Investment Date", type: "date" },
            { name: "investment_amount", label: "Investment Amount ($)", type: "number" },
            { name: "capital_gains", label: "Capital Gains/Losses ($)", type: "number" },
            { name: "dividend_income", label: "Dividend Income ($)", type: "number" },
            { name: "investment_notes", label: "Additional Notes", type: "textarea" },
          ],
        };
      case "career_income":
        return {
          title: "Career & Income Updates",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          ),
          gradient: "from-[#518DE7] to-[#7687E5]",
          fields: [
            { name: "change_type", label: "Change Type", type: "select", options: ["Select", "New Job", "Promotion", "Salary Increase", "Salary Decrease", "Job Loss", "Retirement"] },
            { name: "change_date", label: "Effective Date", type: "date" },
            { name: "new_annual_income", label: "New Annual Income ($)", type: "number" },
            { name: "previous_income", label: "Previous Annual Income ($)", type: "number" },
            { name: "severance_package", label: "Severance Package ($)", type: "number" },
            { name: "career_notes", label: "Additional Notes", type: "textarea" },
          ],
        };
      case "family_marital":
        return {
          title: "Family & Marital Status Updates",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="23" y1="11" x2="17" y2="11" />
              <line x1="20" y1="8" x2="20" y2="14" />
            </svg>
          ),
          gradient: "from-[#9B8FE3] to-[#C687E7]",
          fields: [
            { name: "status_change", label: "Status Change", type: "select", options: ["Select", "Marriage", "Divorce", "Birth of Child", "Adoption", "Death of Spouse", "Dependent Added", "Dependent Removed"] },
            { name: "event_date", label: "Event Date", type: "date" },
            { name: "dependents_count", label: "Total Number of Dependents", type: "number" },
            { name: "spouse_income", label: "Spouse Annual Income ($)", type: "number" },
            { name: "child_care_expenses", label: "Annual Child Care Expenses ($)", type: "number" },
            { name: "family_notes", label: "Additional Notes", type: "textarea" },
          ],
        };
      default:
        return null;
    }
  };

  const config = getCategoryConfig();
  if (!config) return null;

  console.log("LifeEventsForm - isSaved:", isSaved, "isSaving:", isSaving);

  return (
    <div
      className="flex flex-col h-full"
      style={{
        height: "calc(100vh - 210px)",
        minHeight: "440px",
        maxHeight: "740px",
      }}
    >
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Back Button */}
        <div className="w-full max-w-2xl mx-auto mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Categories</span>
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center mb-6 w-full max-w-2xl mx-auto">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-3 shadow-lg`}
          >
            <div className="scale-75">{config.icon}</div>
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1a202c",
              textAlign: "center",
              marginBottom: "4px",
            }}
          >
            {config.title}
          </h2>
          <p
            style={{
              fontSize: "13px",
              fontWeight: "400",
              color: "#718096",
              textAlign: "center",
            }}
          >
            Fill in the details below to update your profile
          </p>
        </div>

        {/* Form Fields */}
        <div className="w-full max-w-2xl mx-auto space-y-4 pb-6">
          {config.fields.map((field) => (
            <div key={field.name} className="bg-white rounded-lg">
              <label
                htmlFor={field.name}
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                {field.label}
                {field.type !== "textarea" && <span style={{ color: "#ef4444" }}>*</span>}
              </label>
              {field.type === "select" && field.options ? (
                <select
                  id={field.name}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "14px",
                    border: errors[field.name] ? "2px solid #ef4444" : "2px solid #e5e7eb",
                    borderRadius: "10px",
                    outline: "none",
                    transition: "all 0.2s",
                    backgroundColor: "#f9fafb",
                    cursor: "pointer",
                  }}
                  className="focus:border-blue-400 focus:bg-white"
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  rows={3}
                  placeholder="Enter details here... (optional)"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "14px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "10px",
                    outline: "none",
                    transition: "all 0.2s",
                    resize: "vertical",
                    backgroundColor: "#f9fafb",
                    cursor: "text",
                  }}
                  className="focus:border-blue-400 focus:bg-white"
                />
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  placeholder={field.type === "number" ? "0" : field.type === "date" ? "" : "Enter " + field.label.toLowerCase()}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    fontSize: "14px",
                    border: errors[field.name] ? "2px solid #ef4444" : "2px solid #e5e7eb",
                    borderRadius: "10px",
                    outline: "none",
                    transition: "all 0.2s",
                    backgroundColor: "#f9fafb",
                    cursor: "text",
                  }}
                  className="focus:border-blue-400 focus:bg-white"
                />
              )}
              {errors[field.name] && (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#ef4444",
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Action Buttons at Bottom */}
      <div
        className="border-t border-gray-200 bg-white px-6 py-3"
        style={{
          boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="w-full max-w-2xl mx-auto flex gap-3">
          <button
            onClick={onBack}
            type="button"
            style={{
              width: "90px",
              minWidth: "20px",
              padding: "10px 16px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#6b7280",
              backgroundColor: "#f3f4f6",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            className="hover:bg-gray-200 hover:border-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            type="button"
            className={`bg-gradient-to-r ${config.gradient} text-white font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{
              flex: 1,
              padding: "10px 16px",
              fontSize: "14px",
              fontWeight: "600",
              border: "none",
              borderRadius: "8px",
              cursor: isSaving ? "not-allowed" : "pointer",
              color:'black'
            }}
          >
            {isSaving ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              <span>Save</span>
            )}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              maxWidth: "500px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Modal Header */}
            <div
              className={`bg-gradient-to-r ${config.gradient} px-6 py-5 rounded-t-16`}
              style={{ borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}
            >
              <div className="flex items-center justify-center mb-3">
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              </div>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  color: "black",
                  textAlign: "center",
                }}
              >
                Successfully Saved!
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "black",
                  textAlign: "center",
                  marginTop: "8px",
                }}
              >
                Your {config.title.toLowerCase()} have been saved successfully
              </p>
            </div>

            {/* Modal Body - Saved Information */}
            <div style={{ padding: "24px" }}>
              <div
                style={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <h4
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "12px",
                  }}
                >
                  Saved Information:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {config.fields
                    .filter((field) => formData[field.name] && formData[field.name] !== "Select")
                    .map((field) => (
                      <div
                        key={field.name}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "13px",
                          paddingBottom: "8px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <span style={{ color: "#6b7280", fontWeight: "500" }}>
                          {field.label}:
                        </span>
                        <span
                          style={{
                            color: "#1f2937",
                            fontWeight: "600",
                            textAlign: "right",
                            maxWidth: "60%",
                            wordBreak: "break-word",
                          }}
                        >
                          {field.type === "number" && formData[field.name]
                            ? `$${parseFloat(formData[field.name]).toLocaleString()}`
                            : field.type === "date" && formData[field.name]
                            ? new Date(formData[field.name]).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : formData[field.name]}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className={`bg-gradient-to-r ${config.gradient} text-white font-semibold transition-all duration-300 hover:shadow-lg w-full`}
                style={{
                  padding: "12px 20px",
                  fontSize: "15px",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color:'black'
                }}
              >
                <span>Continue to Main Menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
