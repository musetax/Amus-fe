import { getSessionId } from "@/services/chatbot";
import { getCachedEmail } from "@/services/chatSession";
import React, { useState } from "react";

type TaxDataModalProps = {
  isOpen: boolean;
  onClose: () => void;
  apiCall:(data:any)=>void;
};

const TaxDataModal: React.FC<TaxDataModalProps> = ({ isOpen, onClose ,apiCall}) => {

  const [formData, setFormData] = useState({
    first_name: "",
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
    email:getCachedEmail(),
  
    take_standard_deduction:true,
    four_pay_cycle:false,
    payroll_id:'1',
    left_job:false
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const transformDataToTaxFormat = (data: any) => {
    const taxInfo: any = {};
  
    if (data.age) taxInfo.age = parseInt(data.age);
    if (data.blind !== undefined)
      taxInfo.blind = data.blind.toLowerCase?.() === "true";
    if (data.filing_status) taxInfo.filing_status = data.filing_status;
    if (data.first_name) taxInfo.first_name = data.first_name;
    if (data.last_name) taxInfo.last_name = data.last_name;
    if (data.most_recent_pay_date_dt)
      taxInfo.most_recent_pay_date_dt = data.most_recent_pay_date_dt;
    if (data.start_pay_date_dt)
      taxInfo.start_pay_date_dt = data.start_pay_date_dt;

    if (
      data.withholdingYTD ||
      data.payFrequency ||
      data.lastPaycheckWithholding ||
      data.yearlySalary
    ) {
      taxInfo.self_jobs = [
        {
          original_withholding_ytd: data.withholdingYTD || "",
          pay_frequency: data.payFrequency || "",
          withholding_on_last_paycheck: data.lastPaycheckWithholding || "",
          yearly_salary: data.yearlySalary || "",
        },
      ];
    }

    return {
      email: data.email || "",
          session_id: getSessionId(), 

      // W4 calculation failed: Missing required fields: four_pay_cycle, left_job, payroll_id, take_standard_deduction
      tax_info: {
        ...taxInfo,
        four_pay_cycle: data.four_pay_cycle,
        left_job: data.left_job,
        payroll_id: data.payroll_id,
        take_standard_deduction: data.take_standard_deduction,
      },
    };
  };

  
  const handleSave = () => {
    console.log(formData);
    apiCall(transformDataToTaxFormat(formData))
    // Call API or pass data back to parent here
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 text-xl">&times;</button>
        <h2 className="text-2xl font-bold mb-4">Tax Data</h2>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

        <div className="bg-gray-100 p-4 rounded-xl space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} className="p-3 rounded-lg bg-white" />
            <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} className="p-3 rounded-lg bg-white" />
            <input type="text" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="p-3 rounded-lg bg-white" />
            <select name="blind" value={formData.blind} onChange={handleChange} className="p-3 rounded-lg bg-white">
              <option value="">Blind Status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <input type="text" name="filing_status" placeholder="Filing Status" value={formData.filing_status} onChange={handleChange} className="p-3 rounded-lg bg-white" />
            <input type="date" name="start_pay_date_dt" placeholder="Start Pay Date" value={formData.start_pay_date_dt} onChange={handleChange} className="p-3 rounded-lg bg-white" />
          </div>

          <label className="block">
            Most Recent Pay Date
            <input type="date" name="most_recent_pay_date_dt" value={formData.most_recent_pay_date_dt} onChange={handleChange} className="w-full mt-2 p-3 rounded-lg bg-white" />
          </label>
        </div>

        <div className="mt-4 space-y-4">
          <input type="text" name="yearlySalary" placeholder="Yearly Salary" value={formData.yearlySalary} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-100" />
          <input type="text" name="payFrequency" placeholder="Pay frequency" value={formData.payFrequency} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-100" />
          <input type="text" name="withholdingYTD" placeholder="Withholding YTD" value={formData.withholdingYTD} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-100" />
          <input type="text" name="lastPaycheckWithholding" placeholder="Withholding on Last Paycheck" value={formData.lastPaycheckWithholding} onChange={handleChange} className="w-full p-3 rounded-lg bg-gray-100" />
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg">
            Save Changes
          </button>
          <button onClick={onClose} className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxDataModal;
