import React, { useState, useEffect } from "react";
import { LifeEventCategory } from "./life-events-screen";
import CustomMultiSelect from "./customMultiSelect";
import {
  getPayrollDetails,
  payrollDetailsUpdate,
} from "../../../app/taxModelAdapter";
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
  const [apiError, setApiError] = useState<string>("");
  const [payrollData, setPayrollData] = useState<any>(null);
  const [isLoadingPayroll, setIsLoadingPayroll] = useState(true);

  // Fetch payroll data on mount
  useEffect(() => {
    const fetchPayrollData = async () => {
      if (userId) {
        try {
          setIsLoadingPayroll(true);
          const data = await getPayrollDetails(userId);
          setPayrollData(data);
        } catch (error) {
          console.error("Error fetching payroll data:", error);
        } finally {
          setIsLoadingPayroll(false);
        }
      } else {
        setIsLoadingPayroll(false);
      }
    };

    fetchPayrollData();
  }, [userId]);

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

      // Skip validation for optional fields and message fields
      if (
        field.label.includes("optional") ||
        field.type === "textarea" ||
        field.type === "file" ||
        field.type === "message"
      ) {
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

      // Validate percentage fields
      if (
        field.name.includes("percentage") &&
        value &&
        (parseFloat(value) < 0 || parseFloat(value) > 100)
      ) {
        newErrors[field.name] = `${field.label} must be between 0 and 100`;
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
    setApiError("");

    try {
      // Prepare payroll update payload
      const payrollUpdatePayload: any = {};

      // Handle family_marital category
      if (category === "family_marital" && formData.event_type) {
        const eventType = formData.event_type;

        if (eventType === "Marriage") {
          payrollUpdatePayload.filing_status = "married_joint";
        } else if (eventType === "Divorce") {
          payrollUpdatePayload.filing_status = "head_of_household";
        } else if (eventType === "Child" || eventType === "Dependent") {
          // Update dependents count
          const dependentCount = parseInt(formData.dependent_count || "0");
          payrollUpdatePayload.dependents = dependentCount;
        }
      }

      // Handle financial_investment category - aggregate deductions
      if (category === "financial_investment" && formData.event_type) {
        const eventTypeData = formData.event_type;

        if (eventTypeData?.selected && eventTypeData?.amounts) {
          let totalDeductions = 0;

          // Sum all the amounts from selected options
          eventTypeData.selected.forEach((option: string) => {
            const amount = parseFloat(eventTypeData.amounts[option] || "0");
            totalDeductions += amount;
          });

          // Add to existing deductions if any
          const currentDeductions = payrollData?.payroll?.deductions || 0;
          payrollUpdatePayload.deductions = currentDeductions + totalDeductions;
        }
      }

      // Handle career_income category
      if (category === "career_income" && formData.change_type) {
        const changeType = formData.change_type;

        if (changeType === "Promotion" || changeType === "Job Change") {
          // Update salary and withholding
          if (formData.annual_salary) {
            payrollUpdatePayload.annual_salary = parseFloat(
              formData.annual_salary
            );
          }
          if (formData.current_withholding_per_paycheck) {
            payrollUpdatePayload.current_withholding_per_paycheck = parseFloat(
              formData.current_withholding_per_paycheck
            );
          }
        } else if (changeType === "Other Income") {
          // Add to additional income
          if (formData.other_income_amount) {
            const currentAdditionalIncome =
              payrollData?.payroll?.additional_income || 0;
            payrollUpdatePayload.additional_income =
              currentAdditionalIncome +
              parseFloat(formData.other_income_amount);
          }
        } else if (changeType === "Spouse Income") {
          // Update spouse income
          if (formData.spouse_income) {
            payrollUpdatePayload.spouse_income = parseFloat(
              formData.spouse_income
            );
          }
        }
      }

      // Update payroll data if there are changes
      if (Object.keys(payrollUpdatePayload).length > 0 && userId) {
        await payrollDetailsUpdate(userId, payrollUpdatePayload);

        // Call the parent onSave callback
        await onSave({ category, ...formData, userId });
        setIsSaved(true);
        setShowModal(true);
      } else {
        throw new Error("No changes to save");
      }
    } catch (error: any) {
      console.error("Error saving life event data:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save life event. Please try again.";
      setApiError(errorMessage);
    } finally {
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
              width="40"
              height="40"
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
            {
              name: "disability_type",
              label: "Type of Disability",
              type: "select",
              options: ["Select", "Blind"],
            },
            // {
            //   name: "disability_percentage",
            //   label: "Percentage (if applicable)",
            //   type: "number",
            // },
            // { name: "onset_date", label: "Date of Onset", type: "date" },
            // {
            //   name: "certifying_authority",
            //   label: "Certifying Authority",
            //   type: "text",
            // },
            // {
            //   name: "document_upload",
            //   label: "Document Upload (optional)",
            //   type: "file",
            // },
          ],
        };
      case "financial_investment":
        return {
          title: "Financial & Investment Updates",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
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
            {
              name: "event_type",
              label: "Type of Event",
              type: "select",
              options: [
                "IRA Contribution",
                "Student Loan Interest",
                "State or Local Tax",
                "Medical Expenses",

                "Charitable Donations",
                "Home Mortgage Interest",
                "Other Deductions",
              ],
            },
            // { name: "event_date", label: "Event Date", type: "date" },
            // { name: "amount", label: "Amount ($)", type: "number" },
            // {
            //   name: "institution_name",
            //   label: "Institution / Platform Name",
            //   type: "text",
            // },
            // { name: "notes", label: "Notes (optional)", type: "textarea" },
          ],
        };
      case "career_income":
        // Determine available options based on filing status
        const careerFilingStatus = payrollData?.payroll?.filing_status;
        const careerOptions = [
          "Select",
          "Promotion",
          "Job Change",
          "Other Income",
        ];

        // Show Spouse Income option only if user is married
        if (careerFilingStatus === "married_joint") {
          careerOptions.push("Spouse Income");
        }

        const careerFields: any[] = [
          {
            name: "change_type",
            label: "Type of Change",
            type: "select",
            options: careerOptions,
          },
        ];

        // Add fields based on selected change type
        const changeType = formData.change_type;

        if (changeType === "Promotion" || changeType === "Job Change") {
          // Add message field to show context
          careerFields.push({
            name: "message_promotion_job",
            label: "",
            type: "message",
            message:
              changeType === "Promotion"
                ? "Congratulations on your promotion! Please update your new salary and withholding information."
                : "You've changed jobs! Please provide your new salary and withholding information.",
          });

          careerFields.push({
            name: "annual_salary",
            label: "New Annual Salary ($)",
            type: "number",
            placeholder: "Enter your new annual salary",
          });

          careerFields.push({
            name: "current_withholding_per_paycheck",
            label: "Current Withholding ($)",
            type: "number",
            placeholder: "Enter your current withholding",
          });
        } else if (changeType === "Other Income") {
          careerFields.push({
            name: "message_other_income",
            label: "",
            type: "message",
            message: "Please enter your additional income amount.",
          });

          careerFields.push({
            name: "other_income_amount",
            label: "Other Income Amount ($)",
            type: "number",
            placeholder: "Enter additional income amount",
          });
        } else if (changeType === "Spouse Income") {
          careerFields.push({
            name: "message_spouse_income",
            label: "",
            type: "message",
            message: "Please enter your spouse's income information.",
          });

          careerFields.push({
            name: "spouse_income",
            label: "Spouse Annual Income ($)",
            type: "number",
            placeholder: "Enter spouse's annual income",
          });
        }

        return {
          title: "Career & Income Updates",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
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
          fields: careerFields,
        };
      case "family_marital":
        // Determine available options based on filing status
        const filingStatus = payrollData?.payroll?.filing_status;
        const eventOptions = ["Select"];
        console.log(payrollData);
        // Show Marriage option only if user is single
        if (filingStatus === "single") {
          eventOptions.push("Marriage");
        }

        // Show Divorce option only if user is married
        // if (filingStatus === "married_joint") {
        // }
        eventOptions.push("Divorce");

        // Always show Child and Dependent options
        eventOptions.push("Child", "Dependent");

        const fields: any[] = [
          {
            name: "event_type",
            label: "Type of Event",
            type: "select",
            options: eventOptions,
          },
        ];

        // Add dependent count dropdown if Child or Dependent is selected
        if (
          formData.event_type === "Child" ||
          formData.event_type === "Dependent"
        ) {
          fields.push({
            name: "dependent_count",
            label: `Number of ${formData.event_type}s`,
            type: "select",
            options: ["Select", "1", "2", "3", "4", "5"],
          });
        }

        return {
          title: "Family & Marital Status Updates",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
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
          fields,
        };
      default:
        return null;
    }
  };

  const config = getCategoryConfig();
  if (!config) return null;

  console.log("LifeEventsForm - isSaved:", isSaved, "isSaving:", isSaving);

  // Show loading state while fetching payroll data for family_marital and career_income categories
  if (
    isLoadingPayroll &&
    (category === "family_marital" || category === "career_income")
  ) {
    return (
      <div
        className="flex flex-col h-full items-center justify-center"
        style={{
          height: "calc(100vh - 210px)",
          minHeight: "440px",
          maxHeight: "740px",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading your information...</p>
        </div>
      </div>
    );
  }

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
      <div
        className="flex-1 overflow-y-auto px-6"
        style={{ paddingBottom: 24 }}
      >
        {/* Back Button */}
        <div
          className="w-full max-w-2xl mx-auto"
          style={{ marginTop: "20px", marginBottom: "30px" }}
        >
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
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-3 shadow-lg`}
          >
            <div className=" bg_custom rounded-full p-3 ">{config.icon}</div>
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1a202c",
              textAlign: "center",
              marginBottom: "4px",
              marginTop: 10,
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

        {/* API Error Banner */}
        {apiError && (
          <div className="w-full max-w-2xl mx-auto mb-4">
            <div
              style={{
                backgroundColor: "#FEE2E2",
                border: "1px solid #EF4444",
                borderRadius: "8px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "start",
                gap: "12px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, marginTop: "2px" }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#991B1B",
                    marginBottom: "4px",
                  }}
                >
                  Error Saving Data
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#991B1B",
                  }}
                >
                  {apiError}
                </p>
              </div>
              <button
                onClick={() => setApiError("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                  color: "#DC2626",
                }}
              >
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div
          className="w-full max-w-2xl mx-auto space-y-4 pb-6"
          style={{ marginTop: 40, display: "inline-block" }}
        >
          <div className="w-full max-w-md " style={{ minHeight: 220 }}>
            {config.fields.map((field) => (
              <div
                key={field.name}
                className="block"
                style={{ marginBottom: 10 }}
              >
                {/* <label
                  htmlFor={field.name}
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  {field.label}
                  {!field.label.includes("optional") &&
                    field.type !== "textarea" &&
                    field.type !== "file" && (
                      <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>
                    )}
                </label> */}
                {field.type === "message" ? (
                  <div
                    style={{
                      backgroundColor: "#EEF2FF",
                      border: "1px solid #C7D2FE",
                      borderRadius: "10px",
                      padding: "12px 16px",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "start",
                      gap: "12px",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#4338CA",
                        lineHeight: "1.5",
                        margin: 0,
                      }}
                    >
                      {field.message}
                    </p>
                  </div>
                ) : field.type === "select" && field.options ? (
                  <>
                    {/* Use CustomMultiSelect only for financial_investment category */}
                    {category === "financial_investment" ? (
                      <CustomMultiSelect
                        field={field}
                        label={field.label}
                        formData={formData}
                        handleInputChange={handleInputChange}
                        errors={errors}
                      />
                    ) : (
                      <>
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
                          {field.label}
                          {!field.label.includes("optional") &&
                            field.type !== "textarea" &&
                            field.type !== "file" && (
                              <span style={{ color: "#ef4444", marginLeft: 4 }}>
                                *
                              </span>
                            )}
                        </label>
                        <select
                          id={field.name}
                          value={formData[field.name] || ""}
                          onChange={(e) =>
                            handleInputChange(field.name, e.target.value)
                          }
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
                            cursor: "pointer",
                            background: "#ffffff",
                          }}
                          className="w-full  bg-white border h-10 rounded-2xl focus:outline-none focus:ring-0 outline-none text-gray-900"
                        >
                          {field.options.map((option: string) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </>
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    rows={3}
                    placeholder="Enter details here... (optional)"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "14px",
                      border: "1px solid #d1d5db",
                      borderRadius: "10px",
                      outline: "none",
                      transition: "all 0.2s",
                      resize: "vertical",
                      backgroundColor: "#ffffff",
                      cursor: "text",
                      minHeight: "80px",
                    }}
                    className="w-full  bg-white border h-10 rounded-2xl focus:outline-none focus:ring-0 outline-none text-gray-900"
                  />
                ) : field.type === "file" ? (
                  <>
                    {/* <input
                      id={field.name}
                      type="file"
                      onChange={(e) =>
                        handleInputChange(field.name, e.target.files?.[0])
                      }
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
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
                        cursor: "pointer",
                      }}
                      className="w-full  bg-white border h-10 rounded-2xl focus:outline-none focus:ring-0 outline-none text-gray-900"
                    /> */}
                    <div className="w-full">
                      <input
                        id={field.name}
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleInputChange(field.name, e.target.files?.[0])
                        }
                        style={{ display: "none" }}
                        className="hidden"
                      />
                      <label
                        htmlFor={field.name}
                        className={` w-full  cursor-pointer bg-white text-gray-700 text-sm hover:bg-gray-50 transition`}
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
                          cursor: "pointer",
                          display: "block",
                        }}
                      >
                        <span>
                          {formData[field.name]?.name
                            ? formData[field.name].name
                            : "Choose a file"}
                        </span>
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs">
                          Browse
                        </span>
                      </label>
                    </div>
                  </>
                ) : (
                  <>
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
                      {field.label}
                      {!field.label.includes("optional") &&
                        field.type !== "textarea" &&
                        field.type !== "file" && (
                          <span style={{ color: "#ef4444", marginLeft: 4 }}>
                            *
                          </span>
                        )}
                    </label>
                    <input
                      id={field.name}
                      type={field.type}
                      value={formData[field.name] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Prevent negative values for number inputs
                        if (field.type === "number") {
                          const numValue = parseFloat(value);
                          if (
                            value === "" ||
                            (!isNaN(numValue) && numValue >= 0)
                          ) {
                            handleInputChange(field.name, value);
                          }
                        } else {
                          handleInputChange(field.name, value);
                        }
                      }}
                      onWheel={(e) => {
                        // Prevent scroll changing number value
                        if (field.type === "number") {
                          e.currentTarget.blur();
                        }
                      }}
                      min={field.type === "number" ? "0" : undefined}
                      step={field.type === "number" ? "any" : undefined}
                      placeholder={
                        field.placeholder ||
                        (field.type === "number"
                          ? "0"
                          : field.type === "date"
                          ? ""
                          : "Enter " + field.label.toLowerCase())
                      }
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
                  </>
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
                    {/* <svg
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
                    </svg> */}
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Action Buttons at Bottom */}
      <div
        className="border-t border-gray-200 bg-white px-6 py-3"
        style={{
          boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.05)",
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <div
          className="w-full max-w-2xl mx-auto"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <button
            onClick={onBack}
            type="button"
            style={{
              width: "90px",
              minWidth: "20px",
              padding: "10px 16px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#11181c",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
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
            className={`bg_custom text-white font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{
              width: "90px",
              minWidth: "20px",
              padding: "10px 16px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#ffffff",
              borderRadius: "20px",
              transition: "all 0.2s",
              cursor: isSaving ? "not-allowed" : "pointer",
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
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Modal Header */}
            <div
              className={`bg-gradient-to-r ${config.gradient} px-6 py-5 rounded-t-16`}
              style={{
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {config.fields
                    .filter(
                      (field) =>
                        formData[field.name] &&
                        formData[field.name] !== "Select" &&
                        field.type !== "message"
                    )
                    .map((field) => {
                      const fieldValue = formData[field.name];

                      // Handle financial investment multi-select with amounts
                      if (
                        category === "financial_investment" &&
                        field.name === "event_type" &&
                        fieldValue?.selected
                      ) {
                        return fieldValue.selected.map((option: string) => (
                          <div
                            key={option}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "13px",
                              paddingBottom: "8px",
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            <span
                              style={{ color: "#6b7280", fontWeight: "500" }}
                            >
                              {option}:
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
                              $
                              {parseFloat(
                                fieldValue.amounts[option] || "0"
                              ).toLocaleString()}
                            </span>
                          </div>
                        ));
                      }

                      // Handle regular fields
                      return (
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
                            {field.type === "number" && fieldValue
                              ? field.name.includes("percentage")
                                ? `${fieldValue}%`
                                : `$${parseFloat(fieldValue).toLocaleString()}`
                              : field.type === "date" && fieldValue
                              ? new Date(fieldValue).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : field.type === "file" && fieldValue
                              ? fieldValue.name || "File uploaded"
                              : fieldValue}
                          </span>
                        </div>
                      );
                    })}
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
                  color: "black",
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
