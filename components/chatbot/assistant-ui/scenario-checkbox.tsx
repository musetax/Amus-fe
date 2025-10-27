"use client";

import { useState, useEffect } from "react";
import { useThreadRuntime } from "@assistant-ui/react";
import { getPayrollDetails } from "../../../app/taxModelAdapter";
import { Check } from "lucide-react";
interface ScenarioCheckboxProps {
  userId: string;
  sessionId: string;
  agentIntent: "tax_refund_calculation" | "tax_paycheck_calculation";
  setShowScenarios: (value: boolean) => void;
}

interface Scenario {
  id: string;
  label: string;
  description: string;
}
interface CustomCheckboxProps {
  checked: boolean;
  onChange: () => void;
}
export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
}) => {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "start",
        cursor: "pointer",
        userSelect: "none",
        position: "relative",
      }}
    >
      {/* Hidden native checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          position: "absolute",
          opacity: 0,
          width: 0,
          height: 0,
        }}
      />

      {/* Custom box */}
      <div
        style={{
          width: "18px",
          height: "18px",
          border: checked ? "1px solid #518DE7" : "1px solid #d1d5db",
          backgroundColor: checked ? "#518DE7" : "#ffffff",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
        }}
      >
        {checked && <Check size={14} color="#ffffff" strokeWidth={3} />}
      </div>
    </label>
  );
};
const scenarios: Scenario[] = [
  {
    id: "got_married",
    label: "Got Married",
    description: "Change filing status to married filing jointly",
  },
  { id: "had_child", label: "Had a Child", description: "Add one dependent" },
  {
    id: "received_raise",
    label: "Received a 10% Raise",
    description: "Increase annual salary by 10%",
  },
  {
    id: "no_tax_state",
    label: "Moved to a No-Tax State",
    description: "Update home address to 77001",
  },
  {
    id: "high_tax_state",
    label: "Moved to a High-Tax State",
    description: "Update home address to 94102",
  },
  {
    id: "maxed_401k",
    label: "Maxed Out 401(k)",
    description: "Maximize 401(k) contributions",
  },
];

export const ScenarioCheckbox: React.FC<ScenarioCheckboxProps> = ({
  userId,
  setShowScenarios,
}) => {
  const thread = useThreadRuntime();
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [payrollData, setPayrollData] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const response = await getPayrollDetails(userId);
        setPayrollData(response);
      } catch (error) {
        console.error("Error fetching payroll data:", error);
      }
    };
    fetchPayrollData();
  }, [userId]);

  const handleCheckboxChange = (scenarioId: string) => {
    setSelectedScenarios((prev) => {
      // Handle mutual exclusivity between no_tax_state and high_tax_state
      if (scenarioId === "no_tax_state" || scenarioId === "high_tax_state") {
        if (prev.includes(scenarioId)) {
          // Uncheck the clicked one if it was already selected
          return prev.filter((id) => id !== scenarioId);
        }
        // Remove the other state if selected, then add the current one
        return [
          ...prev.filter(
            (id) => id !== "no_tax_state" && id !== "high_tax_state"
          ),
          scenarioId,
        ];
      }

      // Normal toggle for other scenarios
      return prev.includes(scenarioId)
        ? prev.filter((id) => id !== scenarioId)
        : [...prev, scenarioId];
    });
  };

  const generatePayloadForScenario = (scenarioId: string, basePayroll: any) => {
    const payload = { ...basePayroll };

    switch (scenarioId) {
      case "got_married":
        payload.filing_status = "married_joint";
        break;
      case "had_child":
        payload.dependents = (payload.dependents || 0) + 1;
        break;
      case "received_raise":
        const currentSalary = payload.annual_salary || payload.salary || 0;
        payload.annual_salary = Math.round(currentSalary * 1.1);
        if (payload.salary) payload.salary = Math.round(payload.salary * 1.1);
        break;
      case "no_tax_state":
        payload.home_address = "73301";
        break;
      case "high_tax_state":
        payload.home_address = "94102";
        break;
      case "maxed_401k":
        const age = payload.age || 0;
        const maxContribution = age >= 50 ? 30500 : 23000;
        payload.pre_tax_deductions = maxContribution;
        break;
    }

    return payload;
  };

  const handleCalculate = () => {
    if (selectedScenarios.length === 0 || !payrollData) return;

    setCalculating(true);
    setCompleted(true); // Hide the checkboxes immediately

    // Build a user message describing selected scenarios
    const scenarioLabels = selectedScenarios
      .map((id) => scenarios.find((s) => s.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    // const userMessage = `Calculate taxes with: ${scenarioLabels}`;
    const userMessage=`calcualte my paycheck with updated values`
    console.log("🚀 Triggering scenario calculation for:", scenarioLabels);

    try {
      // Apply scenario modifications to payroll data
      let modifiedPayroll = { ...payrollData.payroll };
      selectedScenarios.forEach((id) => {
        modifiedPayroll = generatePayloadForScenario(id, modifiedPayroll);
      });

      // Update payroll data so MyModelAdapter can access it
      payrollData.payroll = modifiedPayroll;

      // Simply append the user message - MyModelAdapter will detect the keyword
      // "Calculate taxes with:" and automatically call tax-calculate API
      thread.append({
        role: "user",
        content: [{ type: "text", text: userMessage }],
        metadata: {
          custom: {
            loading: false,
            streaming: true,
            payrollData: payrollData,
            isTaxCalculation: true,
          },
        },
      });
      setShowScenarios(false);
      console.log(
        "✅ User message appended, MyModelAdapter will handle the rest"
      );
    } catch (error) {
      console.error("Error triggering scenario calculation:", error);
      setCalculating(false);
      setCompleted(false);
    }
  };

  // Don't show component after calculation is completed
  if (completed) {
    return null;
  }

  return (
    <div className="space-y-3 mt-4">
      <div className="flex flex-col flex-wrap gap-3">
        {scenarios.map((scenario) => {
          // const isStateScenario =
          //   scenario.id === "no_tax_state" || scenario.id === "high_tax_state";

          return (
            <label
              key={scenario.id}
              className="flex items-start space-x-3 gap-1 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
              style={{
                border: "1px solid #e5e7eb",
                paddingLeft: "12px",
                paddingTop: "8px",
                paddingBottom: "8px",
                paddingRight: "12px",
              }}
            >
              {/* <input
                type="checkbox"
                checked={selectedScenarios.includes(scenario.id)}
                onChange={() => handleCheckboxChange(scenario.id)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-[#518DE7]"
                style={{ position: "relative", top: "3px" }}
              /> */}
              <CustomCheckbox
                checked={selectedScenarios.includes(scenario.id)}
                onChange={() => handleCheckboxChange(scenario.id)}
              />
              <div className="flex flex-col" style={{ marginLeft: "4px" }}>
                <span
                  className="text-sm text-[#31333F] font-medium"
                  style={{ color: "#31333f" }}
                >
                  {scenario.label}
                </span>
                <span className="text-xs text-gray-500">
                  {scenario.description}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleCalculate}
          disabled={selectedScenarios.length === 0 || calculating}
          className={`flex-1 py-3 px-4 rounded-2xl font-medium text-center transition-colors custom_btn 
            
    ${
      selectedScenarios.length === 0 || calculating
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-gray-200 text-gray-400 hover:bg-gray-700"
    }`}
          style={{ border: "1px solid #e5e7eb" }}
        >
          {calculating ? "Calculating..." : "Continue"}
        </button>

        {/* <button
          onClick={() => setSelectedScenarios([])}
          disabled={calculating}
          className="py-3 px-4 rounded-2xl font-medium border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          Skip
        </button> */}
      </div>
    </div>
  );
};
