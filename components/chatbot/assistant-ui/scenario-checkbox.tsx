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
  type: "checkbox" | "radio";
  checked: boolean;
  onChange: () => void;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  type,
  checked,
  onChange,
}) => {
  const isRadioStyle = type === "radio"; // just controls visuals

  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "start",
        cursor: "pointer",
        userSelect: "none",
        position: "relative",
      }}
      onClick={(e) => {
        e.preventDefault(); // prevent default radio locking behavior
        onChange(); // always toggle
      }}
    >
      <input
        type="checkbox" // ✅ Always checkbox for toggle behavior
        checked={checked}
        onChange={() => {}} // ignore native event
        style={{
          position: "absolute",
          opacity: 0,
          width: 0,
          height: 0,
        }}
      />

      <div
        style={{
          width: "18px",
          height: "18px",
          border: checked ? "1px solid #518DE7" : "1px solid #d1d5db",
          backgroundColor: checked ? "#518DE7" : "#ffffff",
          borderRadius: isRadioStyle ? "50%" : "6px", // ✅ visual style
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          boxSizing: "border-box",
        }}
      >
        {checked && !isRadioStyle && (
          <Check size={14} color="#ffffff" strokeWidth={3} />
        )}
        {checked && isRadioStyle && (
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
            }}
          />
        )}
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
    id: "maxed_401k",
    label: "Maxed Out 401(k)",
    description: "Maximize 401(k) contributions",
  },
  {
    id: "no_tax_state",
    label: "Moved to a No-Tax State",
    description: "Low State Taxes (ex: Florida, Texas, Nevada, etc.)",
  },
  {
    id: "high_tax_state",
    label: "Moved to a High-Tax State",
    description: "High State Taxes (ex:California, New Jersey, New York, etc.)",
  },
];

export const ScenarioCheckbox: React.FC<ScenarioCheckboxProps> = ({
  userId,
  setShowScenarios,
}) => {
  const thread = useThreadRuntime();
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [spouseIncome, setSpouseIncome] = useState<string>("");
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
      // ✅ Radio behavior for state options (but allow deselect)

      if (scenarioId === "no_tax_state" || scenarioId === "high_tax_state") {
        if (prev.includes(scenarioId)) {
          // Allow unselecting
          return prev.filter((id) => id !== scenarioId);
        }
        // Replace the other one
        return [
          ...prev.filter(
            (id) => id !== "no_tax_state" && id !== "high_tax_state"
          ),
          scenarioId,
        ];
      }

      // ✅ Normal toggle for other checkboxes
      const updated = prev.includes(scenarioId)
        ? prev.filter((id) => id !== scenarioId)
        : [...prev, scenarioId];

      if (!updated.includes("got_married")) setSpouseIncome("");
      return updated;
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
        payload.home_address = "77001";
        payload.work_address = "77001";
        break;
      case "high_tax_state":
        payload.home_address = "94102";
        payload.work_address = "94102";
        break;
      case "maxed_401k":
        const age = payload.age || 0;
        payload.pre_tax_deductions = age >= 50 ? 30500 : 23000;
        break;
    }
    return payload;
  };

  const handleCalculate = () => {
    if (selectedScenarios.length === 0 || !payrollData) return;
    if (
      selectedScenarios.includes("got_married") &&
      (!spouseIncome || Number(spouseIncome) <= 0)
    ) {
      alert("Please enter a valid spouse income greater than 0.");
      return;
    }

    setCalculating(true);
    setCompleted(true);

    const userMessage = `calculate my paycheck with updated values`;

    try {
      let modifiedPayroll = {
        ...payrollData.payroll,
        spouse_income: spouseIncome ? Number(spouseIncome) : 0,
      };
      selectedScenarios.forEach((id) => {
        modifiedPayroll = generatePayloadForScenario(id, modifiedPayroll);
      });

      payrollData.payroll = modifiedPayroll;

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
    } catch (error) {
      console.error("Error triggering scenario calculation:", error);
      setCalculating(false);
      setCompleted(false);
    }
  };

  if (completed) return null;

  return (
    <div className="space-y-4 mt-4">
        <p className="text-large text-black">
    Please choose what suits you best.
  </p>
      <div className="flex flex-col flex-wrap gap-3">
        {scenarios.map((scenario) => {
          const isStateOption =
            scenario.id === "no_tax_state" || scenario.id === "high_tax_state";

          return (
            <div key={scenario.id}>
              <label
                className="flex items-start space-x-3 gap-1 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
                style={{
                  border: "1px solid #e5e7eb",
                  paddingLeft: "12px",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  paddingRight: "12px",
                }}
              >
                <CustomCheckbox
                  type={isStateOption ? "radio" : "checkbox"} // ✅ dynamic type
                  checked={selectedScenarios.includes(scenario.id)}
                  onChange={() => handleCheckboxChange(scenario.id)}
                />
                <div className="flex flex-col" style={{ marginLeft: "4px" }}>
                  <span className="text-sm text-[#31333F] font-medium">
                    {scenario.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {scenario.description}
                  </span>
                </div>
              </label>

              {/* Spouse income input only for 'got_married' */}
              {scenario.id === "got_married" &&
                selectedScenarios.includes("got_married") && (
                  <div className="pl-10 mt-1">
                    <input
                      type="number"
                      placeholder="Enter Spouse Income"
                      value={spouseIncome}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) setSpouseIncome(val);
                      }}
                       onWheel={(e) => e.currentTarget.blur()} 

                      className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all"
                      min="0"
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "textfield",
                      }}
                    />
                  </div>
                )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleCalculate}
          disabled={selectedScenarios.length === 0 || calculating}
          className={`flex-1 py-3 px-4 rounded-2xl font-medium text-center transition-colors custom_btn 
      ${selectedScenarios.length === 0 || calculating
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-400 hover:bg-gray-700"
            }`}
          style={{ border: "1px solid #e5e7eb" }}
        >
          {calculating ? "Calculating..." : "Continue"}
        </button>
      </div>
    </div>
  );
};
