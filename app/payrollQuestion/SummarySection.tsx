import React from "react";
import { FormData } from "./types";
import { SummaryCard } from "./components";
import { DollarSign, User, Heart, Calendar, CheckCircle, Home } from "./icons";
import { formatCurrency } from "./utils";

interface SummarySectionProps {
  formData: FormData;
  questionsToAsk: any[];
  onSave: () => void;
  isSaving: boolean;
  saveError: string | null;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  formData,
  questionsToAsk,
  onSave,
  isSaving,
  saveError,
}) => {
  console.log(formData.deductions, "=======p[]p[l[pl");
  return (
    <div className="bottom-0 px-3 pt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg pb-2">
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-3 mb-4">
        <div
          className="flex items-center gap-3 mb-6"
          style={{ marginBottom: "20px" }}
        >
          <CheckCircle className="text-green-600 text-base" />
          <h3 className="text-base font-semibold text-gray-900">
            {questionsToAsk.length === 0
              ? "Tax Information Already Complete!"
              : "Information Collection Complete!"}
          </h3>
        </div>

        <div className="flex items-center flex-wrap gap-2 mb-6">
          {/* Filing Status */}
          {formData.filing_status && (
            <SummaryCard
              icon={User}
              title="Filing Status"
              value={
                formData.filing_status === "married_joint"
                  ? "Married"
                  :formData.filing_status === "head_of_household"?"Head of household": formData.filing_status.charAt(0).toUpperCase() +
                    formData.filing_status.slice(1)
              }
              color="bg-gradient-to-r from-purple-600 to-purple-400"
            />
          )}

          {/* Age */}
          {formData.age && (
            <SummaryCard
              icon={User}
              title="Age"
              value={`${formData.age} years`}
              color="bg-gradient-to-r from-indigo-600 to-indigo-400"
            />
          )}

          {/* Income Type */}
          {formData.income_type && (
            <SummaryCard
              icon={DollarSign}
              title="Income Type"
              value={
                formData.income_type.charAt(0).toUpperCase() +
                formData.income_type.slice(1)
              }
              color="bg-gradient-to-r from-cyan-600 to-cyan-400"
            />
          )}

          {/* Annual Salary (for salary type) */}
          {formData.annual_salary && formData.income_type === "salary" && (
            <SummaryCard
              icon={DollarSign}
              title="Annual Salary"
              value={formatCurrency(formData.annual_salary)}
              color="bg-gradient-to-r from-orange-600 to-orange-400"
            />
          )}

          {/* Hourly Rate (for hourly type) */}
          {formData.hourly_rate && formData.income_type === "hourly" && (
            <SummaryCard
              icon={DollarSign}
              title="Hourly Rate"
              value={`$${formData.hourly_rate}/hr`}
              color="bg-gradient-to-r from-orange-600 to-orange-400"
            />
          )}

          {/* Average Hours Per Week */}
          {formData.average_hours_per_week && formData.income_type === "hourly"&& (
            <SummaryCard
              icon={Calendar}
              title="Avg Hours/Week"
              value={`${formData.average_hours_per_week} hours`}
              color="bg-gradient-to-r from-teal-600 to-teal-400"
            />
          )}

          {/* Seasonal Variation */}
          {formData.seasonal_variation&& formData.income_type === "hourly" && (
            <SummaryCard
              icon={Calendar}
              title="Seasonal Variation"
              value={
                formData.seasonal_variation.charAt(0).toUpperCase() +
                formData.seasonal_variation.slice(1)
              }
              color="bg-gradient-to-r from-sky-600 to-sky-400"
            />
          )}

          {/* Estimated Annual Income (for hourly) */}
          {formData.estimated_annual_income && (
            <SummaryCard
              icon={DollarSign}
              title="Est. Annual Income"
              value={formatCurrency(formData.estimated_annual_income)}
              color="bg-gradient-to-r from-emerald-600 to-emerald-400"
            />
          )}

          {/* Spouse Income - only show if user filled it and it's not $0 */}
          {formData.spouse_income && formData.spouse_income !== "0" && (
            <SummaryCard
              icon={Heart}
              title="Spouse Income"
              value={formatCurrency(formData.spouse_income)}
              color="bg-gradient-to-r from-pink-600 to-pink-400"
            />
          )}

          {/* Pay Frequency */}
          {formData.pay_frequency && (
            <SummaryCard
              icon={Calendar}
              title="Pay Frequency"
              value={
                formData.pay_frequency.charAt(0).toUpperCase() +
                formData.pay_frequency.slice(1)
              }
              color="bg-gradient-to-r from-green-600 to-green-400"
            />
          )}

          {/* Current Withholding */}
          {formData.current_withholding_per_paycheck && (
            <SummaryCard
              icon={DollarSign}
              title="Current Withholding"
              value={`${formatCurrency(
                formData.current_withholding_per_paycheck
              )} per paycheck`}
              color="bg-gradient-to-r from-blue-600 to-blue-400"
            />
          )}

          {/* Additional Income - only show if user filled it and it's not $0 */}
          {formData.additional_income && formData.additional_income !== "0" && (
            <SummaryCard
              icon={DollarSign}
              title="Additional Income"
              value={formatCurrency(formData.additional_income)}
              color="bg-gradient-to-r from-violet-600 to-violet-400"
            />
          )}

          {/* Standard Deduction */}
          {formData.standard_deduction && (
            <SummaryCard
              icon={CheckCircle}
              title="Standard Deduction"
              value={formData.standard_deduction === "yes" ? "Yes" : "No"}
              color="bg-gradient-to-r from-indigo-600 to-indigo-400"
            />
          )}

          {/* Deductions - show selected deductions */}
          {formData.deductions &&
            Array.isArray(formData.deductions) &&
            formData.deductions.length > 0 &&
            (() => {
              // const labels: { [key: string]: string } = {
              //   ira_contribution: "IRA Contribution",
              //   student_loan_interest: "Student Loan Interest",
              //   state_local_tax: "State/Local Tax",
              //   medical_expenses: "Medical Expenses",
              //   other_deduction: "Other Deductions",
              //   charitable_donation: "Charitable Donations",
              //   home_mortgage_interest: "Home Mortgage Interest"
              // };
              const deductionsList = formData.deductions.reduce(
                (sum, item) => sum + Number(item.amount),
                0
              );

              return (
                <SummaryCard
                  icon={CheckCircle}
                  title="Deductions"
                  value={deductionsList}
                  color="bg-gradient-to-r from-purple-600 to-purple-400"
                />
              );
            })()}

          {/* Dependents */}
          {formData.dependents && formData.dependents !== "0" && (
            <SummaryCard
              icon={User}
              title="Dependents"
              value={`${formData.dependents} dependent(s)`}
              color="bg-gradient-to-r from-rose-600 to-rose-400"
            />
          )}

          {/* Pre-Tax Deductions */}
          {formData.pre_tax_deductions &&
            formData.pre_tax_deductions !== "0" && (
              <SummaryCard
                icon={DollarSign}
                title="Pre-Tax Deductions"
                value={formatCurrency(formData.pre_tax_deductions)}
                color="bg-gradient-to-r from-amber-600 to-amber-400"
              />
            )}

          {/* Post-Tax Deductions */}
          {formData.post_tax_deductions &&
            formData.post_tax_deductions !== "0" && (
              <SummaryCard
                icon={DollarSign}
                title="Post-Tax Deductions"
                value={formatCurrency(formData.post_tax_deductions)}
                color="bg-gradient-to-r from-red-600 to-red-400"
              />
            )}

          {/* Last Paycheck Date */}
          {formData.current_date && (
            <SummaryCard
              icon={Calendar}
              title="Last Paycheck Date"
              value={formData.current_date}
              color="bg-gradient-to-r from-fuchsia-600 to-fuchsia-400"
            />
          )}

          {/* Work Address */}
          {formData.work_address && (
            <SummaryCard
              icon={Home}
              title="Work ZIP Code"
              value={formData.work_address}
              color="bg-gradient-to-r from-lime-600 to-lime-400"
            />
          )}

          {/* Home Address */}
          {formData.home_address && (
            <SummaryCard
              icon={Home}
              title="Home ZIP Code"
              value={formData.home_address}
              color="bg-gradient-to-r from-yellow-600 to-yellow-400"
            />
          )}
        </div>

        <div
          className="flex flex-col sm:flex-row gap-3 items-center justify-center"
          style={{ marginTop: "32px" }}
        >
          <button
            onClick={onSave}
            disabled={isSaving}
            className="group bg_custom relative inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium rounded-full shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-600 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:active:scale-100"
            style={{
              minWidth: "160px",
            }}
          >
            {isSaving ? (
              <>
                <span>Saving...</span>
              </>
            ) : (
              <>
              
                <span>Save Information</span>
              </>
            )}
          </button>
        </div>

        {saveError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-600 text-sm">{saveError}</p>
          </div>
        )}
      </div>
    </div>
  );
};
