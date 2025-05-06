import React, { useState } from "react";

type TaxDataModalProps = {
  isOpen: boolean;
  onClose: () => void;
  apiCall: (data: any) => void;
};

const TaxDataModal: React.FC<TaxDataModalProps> = ({ isOpen, onClose, apiCall }) => {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    age: "",
    blind: "",
    filing_status: "",
    start_pay_date_dt: "",
    most_recent_pay_date_dt: "",
    yearlySalary: "",
    payFrequency: "",
    withholdingYTD: "",
    lastPaycheckWithholding: "",
    payroll_id: "",
    four_pay_cycle: false,
    left_job: false,
    take_standard_deduction: false,
    more_than_one_job: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Valid email is required.";
    if (!formData.first_name) newErrors.first_name = "First name is required.";
    if (!formData.middle_name) newErrors.middle_name = "Middle name is required.";
    if (!formData.last_name) newErrors.last_name = "Last name is required.";
    if (!formData.age || isNaN(Number(formData.age))) newErrors.age = "Valid age is required.";
    if (!formData.blind) newErrors.blind = "Blind status is required.";
    if (!formData.filing_status) newErrors.filing_status = "Filing status is required.";
    if (!formData.payroll_id) newErrors.payroll_id = "Payroll ID is required.";
    if (!formData.start_pay_date_dt) newErrors.start_pay_date_dt = "Start pay date is required.";
    if (!formData.most_recent_pay_date_dt) newErrors.most_recent_pay_date_dt = "Most recent pay date is required.";
    if (!formData.yearlySalary || isNaN(Number(formData.yearlySalary))) newErrors.yearlySalary = "Valid yearly salary is required.";
    if (!formData.payFrequency) newErrors.payFrequency = "Pay frequency is required.";
    if (!formData.withholdingYTD || isNaN(Number(formData.withholdingYTD))) newErrors.withholdingYTD = "Valid YTD withholding is required.";
    if (!formData.lastPaycheckWithholding || isNaN(Number(formData.lastPaycheckWithholding))) newErrors.lastPaycheckWithholding = "Valid last paycheck withholding is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const payload = {
      email: formData.email,
      tax_info: {
        age: Number(formData.age),
        blind: formData.blind === "yes",
        filing_status: formData.filing_status,
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name,
        four_pay_cycle: formData.four_pay_cycle,
        left_job: formData.left_job,
        most_recent_pay_date_dt: formData.most_recent_pay_date_dt,
        start_pay_date_dt: formData.start_pay_date_dt,
        payroll_id: formData.payroll_id,
        take_standard_deduction: formData.take_standard_deduction,
        more_than_one_job: formData.more_than_one_job,
        self_jobs: [
          {
            original_withholding_ytd: formData.withholdingYTD,
            pay_frequency: formData.payFrequency,
            withholding_on_last_paycheck: formData.lastPaycheckWithholding,
            yearly_salary: formData.yearlySalary,
          },
        ],
        spouse_jobs: [
          {
            original_withholding_ytd: "",
            pay_frequency: "",
            withholding_on_last_paycheck: "",
            yearly_salary: "",
          },
        ],
        dependents: [
          {
            age: 0,
            is_disabled: false,
            is_living_together: true,
            is_student: false,
          },
        ],
        deductions: {
          additionalProp1: 0,
          additionalProp2: 0,
          additionalProp3: 0,
        },
        other_incomes: {
          additionalProp1: 0,
          additionalProp2: 0,
          additionalProp3: 0,
        },
        requested_checkboost: 0,
        goal: {
          additionalProp1: {},
        },
      },
    };

    console.log("Payload to be sent:", payload);
    localStorage.setItem("email", payload.email);
    apiCall(payload);
    onClose();
  };

  const renderInputError = (name: string) =>
    errors[name] ? <p className="text-red-600 text-sm mt-1">{errors[name]}</p> : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-3xl relative overflow-y-auto max-h-screen">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 text-xl">
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-6">Tax Data Entry</h2>

        <div className="space-y-8">
          {/* Personal Info */}
          <section className="bg-gray-50 p-5 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["email", "Email *", "email"],
                ["first_name", "First Name *", "text"],
                ["middle_name", "Middle Name", "text"],
                ["last_name", "Last Name *", "text"],
                ["age", "Age *", "number"],
                ["payroll_id", "Payroll ID", "text"],
                ["start_pay_date_dt", "Start Pay Date", "date"],
                ["most_recent_pay_date_dt", "Most Recent Pay Date", "date"],
              ].map(([name, label, type]) => (
                <label key={name} className="flex flex-col">
                  {label}
                  <input
                    type={type}
                    name={name}
                    value={(formData[name as keyof typeof formData] ?? "").toString()}
                    onChange={handleChange}
                    className="mt-1 p-3 rounded-lg border"
                  />
                  {renderInputError(name)}
                </label>
              ))}

              <label className="flex flex-col">
                Filing Status *
                <select name="filing_status" value={formData.filing_status} onChange={handleChange} className="mt-1 p-3 rounded-lg border">
                  <option value="">Select Filing Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="head_of_household">Head of Household</option>
                </select>
                {renderInputError("filing_status")}
              </label>

              <label className="flex flex-col">
                Blind?
                <select name="blind" value={formData.blind} onChange={handleChange} className="mt-1 p-3 rounded-lg border">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                {renderInputError("blind")}
              </label>
            </div>
          </section>

          {/* Booleans */}
          <section className="bg-gray-50 p-5 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["four_pay_cycle", "left_job", "take_standard_deduction", "more_than_one_job"].map((key) => (
                <label key={key} className="flex items-center space-x-3">
                  <input type="checkbox" name={key} checked={formData[key as keyof typeof formData] as boolean} onChange={handleChange} />
                  <span className="capitalize">{key.replace(/_/g, " ")}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Job Info */}
          <section className="bg-gray-50 p-5 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Job & Income Information</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                ["yearlySalary", "Yearly Salary *"],
                ["withholdingYTD", "Withholding YTD"],
                ["lastPaycheckWithholding", "Last Paycheck Withholding"],
              ].map(([name, label]) => (
                <label key={name} className="flex flex-col">
                  {label}
                  <input
                    type="number"
                    name={name}
                    value={(formData[name as keyof typeof formData] ?? "").toString()}
                    onChange={handleChange}
                    className="mt-1 p-3 rounded-lg border"
                  />
                  {renderInputError(name)}
                </label>
              ))}

              <label className="flex flex-col">
                Pay Frequency *
                <select name="payFrequency" value={formData.payFrequency} onChange={handleChange} className="mt-1 p-3 rounded-lg border">
                  <option value="">Select Frequency</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                {renderInputError("payFrequency")}
              </label>
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg">
              Save Changes
            </button>
            <button onClick={onClose} className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxDataModal;
