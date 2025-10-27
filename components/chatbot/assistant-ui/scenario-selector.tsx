"use client";

import { useState, useEffect } from "react";
import { getPayrollDetails, calculateTaxScenarios } from "../../../app/taxModelAdapter";

interface ScenarioSelectorProps {
  userId: string;
  sessionId: string;
  agentIntent: "tax_refund_calculation" | "tax_paycheck_calculation";
  onClose: () => void;
}

interface Scenario {
  id: string;
  label: string;
  description: string;
}

const scenarios: Scenario[] = [
  { id: "got_married", label: "Got Married", description: "Change filing status to married filing jointly" },
  { id: "had_child", label: "Had a Child", description: "Add one dependent" },
  { id: "received_raise", label: "Received a 10% Raise", description: "Increase annual salary by 10%" },
  { id: "no_tax_state", label: "Moved to a No-Tax State", description: "Low State Taxes like Florida, Texas,Nevada,etc" },
  { id: "high_tax_state", label: "Moved to a High-Tax State", description: "High State States like California,New Jersey,New York,etc" },
  { id: "maxed_401k", label: "Maxed Out 401(k)", description: "Maximize 401(k) contributions" },
];

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  userId,
  sessionId,
  agentIntent,
  onClose,
}) => {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [payrollData, setPayrollData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        setLoading(true);
        const response = await getPayrollDetails(userId);
        setPayrollData(response);
      } catch (error) {
        console.error("Error fetching payroll data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, [userId]);

  const handleCheckboxChange = (scenarioId: string) => {
    // Handle mutually exclusive state selection
    if (scenarioId === "no_tax_state" || scenarioId === "high_tax_state") {
      setSelectedScenarios((prev) => {
        const filtered = prev.filter(
          (id) => id !== "no_tax_state" && id !== "high_tax_state"
        );
        return prev.includes(scenarioId) ? filtered : [...filtered, scenarioId];
      });
    } else {
      setSelectedScenarios((prev) =>
        prev.includes(scenarioId)
          ? prev.filter((id) => id !== scenarioId)
          : [...prev, scenarioId]
      );
    }
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
        if (payload.salary) {
          payload.salary = Math.round(payload.salary * 1.1);
        }
        break;

      case "no_tax_state":
         payload.home_address = "77001";
          payload.work_address="77001"
        break;

      case "high_tax_state":
          payload.home_address = "94102";
        payload.work_address="94102"
        break;

      case "maxed_401k":
        const age = payload.age || 0;
        const maxContribution = age >= 50 ? 30500 : 23000;
        payload.pre_tax_deductions = (payload.pre_tax_deductions || 0) + maxContribution;
        break;
    }

    return payload;
  };

  const handleCalculate = async () => {
    if (selectedScenarios.length === 0 || !payrollData) {
      return;
    }

    try {
      setCalculating(true);

      // Apply all selected scenarios to the payroll data
      let modifiedPayroll = { ...payrollData.payroll };
      selectedScenarios.forEach((scenarioId) => {
        modifiedPayroll = generatePayloadForScenario(scenarioId, modifiedPayroll);
      });

      // Call the tax-calculate API
      const response = await calculateTaxScenarios(
        userId,
        sessionId,
        payrollData.payroll,
        modifiedPayroll,
        agentIntent
      );

      setResults(response);
    } catch (error) {
      console.error("Error calculating tax scenarios:", error);
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center justify-center">
            <div className="smooth-ring"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Tax Calculation Results</h2>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Selected Scenarios:</h3>
              <ul className="list-disc list-inside text-blue-800">
                {selectedScenarios.map((id) => {
                  const scenario = scenarios.find((s) => s.id === id);
                  return <li key={id}>{scenario?.label}</li>;
                })}
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setResults(null);
                setSelectedScenarios([]);
              }}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#69DEC6] via-[#49C2D4] to-[#1595EA] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Try Another Scenario
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Check Other Scenarios</h2>
        <p className="text-sm text-gray-600 mb-6">
          Select one or more life events to see how they would affect your taxes:
        </p>

        <div className="space-y-3 mb-6">
          {scenarios.map((scenario) => {
            const isStateScenario =
              scenario.id === "no_tax_state" || scenario.id === "high_tax_state";
            const otherStateSelected = isStateScenario
              ? selectedScenarios.some(
                  (id) => (id === "no_tax_state" || id === "high_tax_state") && id !== scenario.id
                )
              : false;

            return (
              <label
                key={scenario.id}
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedScenarios.includes(scenario.id)
                    ? "border-blue-500 bg-blue-50"
                    : otherStateSelected
                    ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedScenarios.includes(scenario.id)}
                  onChange={() => handleCheckboxChange(scenario.id)}
                  disabled={otherStateSelected}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="ml-3 flex-1">
                  <div className="font-semibold text-gray-800">{scenario.label}</div>
                  <div className="text-sm text-gray-600">{scenario.description}</div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCalculate}
            disabled={selectedScenarios.length === 0 || calculating}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#69DEC6] via-[#49C2D4] to-[#1595EA] text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {calculating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Calculating...
              </span>
            ) : (
              `Calculate Tax (${selectedScenarios.length} selected)`
            )}
          </button>
          <button
            onClick={onClose}
            disabled={calculating}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
