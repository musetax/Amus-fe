import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getSessionId } from "@/services/chatbot";

type TaxDataModalProps = {
  isOpen: boolean;
  onClose: () => void;
  apiCall: (data: any) => void;
};

const PAY_FREQUENCIES = [
  "biweekly",
  "weekly",
  "semimonthly",
  "monthly",
  "quarterly",
  "daily",
  "semiannually",
];

const TaxDataSchema = Yup.object().shape({
  first_name: Yup.string()
    .matches(/^\S+$/, "First name cannot contain spaces.")
    .required("First name is required."),
  last_name: Yup.string()
    .matches(/^\S+$/, "Last name cannot contain spaces.")
    .required("Last name is required."),
  age: Yup.number()
    .typeError("Age must be a number.")
    .min(13, "Must be at least 13")
    .max(149, "Must be under 150")
    .required("Age is required."),
  blind: Yup.string()
    .oneOf(["yes", "no", "true", "false"], "Must be yes or no")
    .required("Blind status is required."),
  filing_status: Yup.string().required("Filing status is required."),
  start_pay_date_dt: Yup.string()
    .required("Start pay date is required.")
    .test(
      "start-before-recent",
      "The start pay date must be before the most recent pay date.",
      function (value) {
        const { most_recent_pay_date_dt } = this.parent;
        if (!value || !most_recent_pay_date_dt) return true;
        const start = new Date(value);
        const recent = new Date(most_recent_pay_date_dt);
        return start <= recent;
      }
    ),
  most_recent_pay_date_dt: Yup.string().required(
    "Most recent pay date is required."
  ),
  yearlySalary: Yup.number()
    .typeError("Salary must be a number")
    .positive("Yearly Salary must be greater than 0")
    .max(500000, "Yearly Salary cannot exceed $500,000")
    .required("Yearly Salary Required"),
  payFrequency: Yup.string().required("Pay frequency is required."),
  withholdingYTD: Yup.number()
    .typeError("YTD must be a number")
    .min(0, "Withholding YTD must be non-negative")
    .required("With Holding YTD Required")
    .test(
      "ytd-less-than-yearly",
      "Withholding YTD must be less than Yearly Salary",
      function (value) {
        const { yearlySalary } = this.parent;
        return value == null || yearlySalary == null || value < yearlySalary;
      }
    ),
  lastPaycheckWithholding: Yup.number()
    .typeError("Withholding must be a number")
    .min(0, "Must be non-negative")
    .required("Last PayCheck Withholding Required")
    .test(
      "last-withholding-lte-ytd",
      "Last Paycheck Withholding must be less than or equal to Total Withholding",
      function (value) {
        const { withholdingYTD } = this.parent;
        return (
          value == null || withholdingYTD == null || value <= withholdingYTD
        );
      }
    ),
  take_standard_deduction: Yup.boolean(),
  four_pay_cycle: Yup.boolean(),
  left_job: Yup.boolean(),
});

const TaxDataModal: React.FC<TaxDataModalProps> = ({
  isOpen,
  onClose,
  apiCall,
}) => {
  if (!isOpen) return null;

  const initialValues = {
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
    take_standard_deduction: true,
    four_pay_cycle: false,
    payroll_id: "1",
    left_job: false,
  };

  const transformDataToTaxFormat = (data: any) => {
    const taxInfo: any = {
      age: parseInt(data.age),
      blind:
        data.blind.toLowerCase() === "true" ||
        data.blind.toLowerCase() === "yes",
      filing_status: data.filing_status,
      first_name: data.first_name,
      last_name: data.last_name,
      most_recent_pay_date_dt: data.most_recent_pay_date_dt,
      start_pay_date_dt: data.start_pay_date_dt,
      self_jobs: [
        {
          original_withholding_ytd: parseFloat(data.withholdingYTD),
          pay_frequency: data.payFrequency,
          withholding_on_last_paycheck: parseFloat(
            data.lastPaycheckWithholding
          ),
          yearly_salary: parseFloat(data.yearlySalary),
        },
      ],
    };

    return {
      email: data.email || "",
      session_id: getSessionId(),
      tax_info: {
        ...taxInfo,
        four_pay_cycle: data.four_pay_cycle,
        left_job: data.left_job,
        payroll_id: parseInt(data.payroll_id),
        take_standard_deduction: data.take_standard_deduction,
      },
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl relative h-[95vh] overflow-auto hide-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Tax Data</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={TaxDataSchema}
          validateOnBlur={false} // <-- disable onBlur validation
          validateOnChange={true} // <-- this will revalidate when values change
          onSubmit={(values) => {
            apiCall(transformDataToTaxFormat(values));
            onClose();
          }}
        >
          {({ }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  "first_name",
                  "last_name",
                  "age",
                  "filing_status",
                  "payFrequency",
                ].map((field) => (
                  <div key={field}>
                    <label className="block font-medium text-sm text-gray-700 mb-1 capitalize">
                      {field.replace(/_/g, " ")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    {field === "first_name" || field === "last_name" ? (
                      <Field name={field}>
                        {({ field: inputField, form }: any) => (
                          <input
                            {...inputField}
                            placeholder={field === "first_name" ? "First Name" : "Last Name"}
                            className="px-3 py-2 text-sm font-normal rounded-lg bg-white w-full border border-gray-100"
                            onChange={(e) => {
                              const cleanValue = e.target.value.replace(
                                /\d|\s/g,
                                ""
                              );
                              form.setFieldValue(field, cleanValue);
                            }}
                          />
                        )}
                      </Field>
                    ) : field === "age" ? (
                      <Field name="age">
                        {({ field: inputField, form }: any) => (
                          <input
                            {...inputField}
                            placeholder="Age"
                            className="px-3 py-2 text-sm font-normal rounded-lg bg-white w-full border border-gray-100"
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                              form.setFieldValue("age", numericValue);
                            }}
                          />
                        )}
                      </Field>
                    ) : field === "payFrequency" ? (
                      <Field
                        as="select"
                        name="payFrequency"
                        className="px-3 py-2 text-sm font-normal rounded-lg bg-white w-full border border-gray-100"
                      >
                        <option value="">Select Pay Frequency</option>
                        {PAY_FREQUENCIES.map((freq) => (
                          <option key={freq} value={freq}>
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </option>
                        ))}
                      </Field>
                    ) : field === "filing_status" ? (
                      <Field
                        as="select"
                        name="filing_status"
                        className="px-3 py-2 text-sm font-normal rounded-lg bg-white w-full border border-gray-100"
                      >
                        <option value="">Select Filing Status</option>
                        <option value="Single">Single</option>
                        <option value="MarriedFilingJointly">
                          Married Filing Jointly
                        </option>
                        <option value="MarriedFilingSeparately">
                          Married Filing Separately
                        </option>
                        <option value="HeadOfHousehold">
                          Head of Household
                        </option>
                      </Field>
                    ) : null}
                    <ErrorMessage
                      name={field}
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                ))}

                <div>
                  <label className="block font-medium text-sm  text-gray-700 mb-1">
                    Blind Status <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="blind"
                    className="px-3 py-2 text-sm font-normal rounded-lg bg-white w-full border border-gray-100"
                  >
                    <option value="">Blind Status</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Field>
                  <ErrorMessage
                    name="blind"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium text-sm  text-gray-700 mb-1">
                    Start Pay Date <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="date"
                    name="start_pay_date_dt"
                    className="px-3 py-2 text-sm font-normal rounded-lg bg-white w-full border border-gray-100"
                  />
                  <ErrorMessage
                    name="start_pay_date_dt"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm  font-medium text-gray-700 mb-1">
                    Most Recent Pay Date <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="date"
                    name="most_recent_pay_date_dt"
                    className="px-3 py-2 text-sm font-normal rounded-lg bg-white w-full border border-gray-100"
                  />
                  <ErrorMessage
                    name="most_recent_pay_date_dt"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "yearlySalary", label: "Yearly Salary" },
                  { name: "withholdingYTD", label: "Withholding YTD" },
                  {
                    name: "lastPaycheckWithholding",
                    label: "Last Paycheck Withholding",
                  },
                ].map(({ name, label }) => (
                  <div key={name}>
                    <label className="block text-sm  font-medium text-gray-700 mb-1">
                      {label} <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name={name}
                      placeholder={label}
                      className="px-3 py-2 text-sm font-normal rounded-lg bg-white w-full border border-gray-100"
                      onKeyDown={(e: any) => {
                        const allowedKeys = [
                          "Backspace",
                          "Tab",
                          "ArrowLeft",
                          "ArrowRight",
                          "Delete",
                          "Enter",
                        ];
                        if (allowedKeys.includes(e.key)) return;
                        if (/[0-9]/.test(e.key)) return;
                        if (
                          e.key === "." &&
                          !e.currentTarget.value.includes(".")
                        )
                          return;
                        e.preventDefault();
                      }}
                    />
                    <ErrorMessage
                      name={name}
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <label className="flex items-center text-sm  space-x-2">
                  <Field type="checkbox" name="four_pay_cycle" />
                  <span>Four Pay Cycle</span>
                </label>

                <label className="flex items-center text-sm  space-x-2">
                  <Field type="checkbox" name="left_job" />
                  <span>Left Job</span>
                </label>

                <label className="flex items-center text-sm  space-x-2">
                  <Field type="checkbox" name="take_standard_deduction" />
                  <span>Take Standard Deduction</span>
                </label>
              </div>

              <div className="flex justify-end mt-6 space-x-4">
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TaxDataModal;
