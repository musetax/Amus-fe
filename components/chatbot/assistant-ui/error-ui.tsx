import { AlertTriangle } from "lucide-react";
import React, { useEffect } from "react";
const addBounceKeyframes = () => {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `;
  document.head.appendChild(style);
};
export const ErrorBanner = ({ message }: { message: string }) => {
     useEffect(() => {
    addBounceKeyframes(); // inject keyframes when component mounts
  }, []);
  return (
    <div className="w-full flex justify-center items-center py-4 animate-fadeIn" style={{height:"calc(100vh - 140px)"}}>
     <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px 0",
      }}
    >
      <div
        style={{
          backgroundColor: "#FEE2E2", // red-100
          border: "1px solid #FEE2E2", // red-600
          borderRadius: "6px",
          padding: "16px",
          maxWidth: "600px",
          width: "100%",
          margin: "0 16px",
        }}
      >
        <div style={{ display: "flex",flexDirection:"column", alignItems: "center",justifyContent:"center", gap: "12px" }}>
          <AlertTriangle
            style={{
              width: "40px",
              height: "40px",
              color: "#DC2626", // red-600
              animation: "bounce 1s infinite",
              flexShrink: 0,
              marginTop: "2px",
            }}
          />
          <div>
            <p
              style={{
                color: "#991B1B", // red-800
                fontWeight: 600,
                fontSize: "18px",
                marginBottom: "4px",
                textAlign:"center"
              }}
            >
              Warning
            </p>
            <p style={{ color: "#B91C1C", fontSize: "14px" }}>{message}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};



// type StepType = "filing_status" | "head_of_household_confirm" | "annual_salary" | "spouse_income" | "pay_frequency" | "current_withholding" | "additional_income" | "deductions" | "dependents" | "start_pay_date" | "most_recent_pay_date" | "complete" | "saved";
// const DollarSign: React.FC = () => <div className="text-white text-lg">💰</div>;
// const User: React.FC = () => <div className="text-white text-lg">👤</div>;
// const Heart: React.FC = () => <div className="text-white text-lg">💕</div>;
// const Calendar: React.FC = () => <div className="text-white text-lg">📅</div>;
// const CheckCircle: React.FC<{ className?: string }> = ({ className }) => <div className={`text-xl ${className}`}>✅</div>;
// const RotateCcw: React.FC = () => <div className="text-base">🔄</div>;
// const Briefcase: React.FC = () => <div className="text-white text-lg">💼</div>;
// const Document: React.FC = () => <div className="text-white text-lg">📝</div>;
// const Family: React.FC = () => <div className="text-white text-lg">👨‍👩‍👧</div>;
// const DateIcon: React.FC = () => <div className="text-white text-lg">📆</div>;
// {formData.additional_income && (
//                   <SummaryCard
//                     icon={Briefcase}
//                     title="Additional Income"
//                     value={`${Number(formData.additional_income).toLocaleString()}`}
//                     color="bg-indigo-500"
//                   />
//                 )}
//                 {formData.deductions && (
//                   <SummaryCard
//                     icon={Document}
//                     title="Deductions"
//                     value={`${Number(formData.deductions).toLocaleString()}`}
//                     color="bg-yellow-500"
//                   />
//                 )}
//                 {formData.dependents && (
//                   <SummaryCard
//                     icon={Family}
//                     title="Dependents"
//                     value={formData.dependents}
//                     color="bg-teal-500"
//                   />
//                 )}
//                 {formData.start_pay_date_dt && (
//                   <SummaryCard
//                     icon={DateIcon}
//                     title="Start Date"
//                     value={new Date(formData.start_pay_date_dt).toLocaleDateString()}
//                     color="bg-cyan-500"
//                   />
//                 )}
//                 {formData.most_recent_pay_date_dt && (
//                   <SummaryCard
//                     icon={DateIcon}
//                     title="Recent Pay Date"
//                     value={new Date(formData.most_recent_pay_date_dt).toLocaleDateString()}
//                     color="bg-lime-500"
//                   />
//                 )}

//                   const handleRestart = () => {
//     setCurrentStepIndex(0);
//     setCurrentStep(questionsToAsk[0] || "complete");
//     setMessages([]);
//     setFormData({
//       filing_status: prefilledData.filing_status || null,
//       head_of_household_qualified: null,
//       annual_salary: prefilledData.annual_salary || null,
//       spouse_income: prefilledData.spouse_income || null,
//       pay_frequency: prefilledData.pay_frequency || null,
//       current_withholding_per_paycheck: prefilledData.current_withholding_per_paycheck || null,
//       additional_income: prefilledData.additional_income || null,
//       deductions: prefilledData.deductions || null,
//       dependents: prefilledData.dependents || null,
//       start_pay_date_dt: prefilledData.start_pay_date_dt || null,
//       most_recent_pay_date_dt: prefilledData.most_recent_pay_date_dt || null,
//     });
//     addInitialMessage();
//   };

//   const handleSaveAndComplete = () => {
//     const taxData: TaxData = {
//       income_type: "W2",
//       annual_salary: formData.annual_salary || "",
//       filing_status: formData.filing_status || "",
//       pay_frequency: formData.pay_frequency || "",
//       current_withholding_per_paycheck: formData.current_withholding_per_paycheck || "",
//       spouse_income: formData.spouse_income || undefined,
//       additional_income: formData.additional_income || undefined,
//       deductions: formData.deductions || undefined,
//       dependents: formData.dependents || undefined,
//       start_pay_date_dt: formData.start_pay_date_dt || undefined,
//       most_recent_pay_date_dt: formData.most_recent_pay_date_dt || undefined,
//     };


//       case "deductions":
//         updatedFormData.deductions = value || null;
//         break;
//       case "dependents":
//         updatedFormData.dependents = value || null;
//         break;
//       case "start_pay_date":
//         updatedFormData.start_pay_date_dt = value || null;
//         break;
//       case "most_recent_pay_date":
//         updatedFormData.most_recent_pay_date_dt = value || null;
//         break;
//            case "additional_income":
//         addBotMessage({
//           content: "Do you have any additional income? (Optional - freelance, investments, etc.)",
//           inputType: "number",
//           placeholder: "Enter additional annual income or skip",
//         });
//         break;
//       case "deductions":
//         addBotMessage({
//           content: "Do you have any deductions? (Optional - mortgage, charitable contributions, etc.)",
//           inputType: "number",
//           placeholder: "Enter annual deductions or skip",
//         });
//         break;
//       case "dependents":
//         addBotMessage({
//           content: "How many dependents do you have? (Optional)",
//           inputType: "number",
//           placeholder: "Enter number of dependents or skip",
//         });
//         break;
//       case "start_pay_date":
//         addBotMessage({
//           content: "When did you start your current job? (Optional)",
//           inputType: "date",
//           placeholder: "Select start date or skip",
//         });
//         break;
//       case "most_recent_pay_date":
//         addBotMessage({
//           content: "What was your most recent pay date? (Optional)",
//           inputType: "date",
//           placeholder: "Select most recent pay date or skip",
//         });
//         break;