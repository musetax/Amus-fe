"use client";
import React, { useState } from "react";
import { X, Edit3, Save } from "lucide-react";
import axios from "axios";
import { TaxDataForm } from './taxDataForm'

export interface TaxData {
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    income_type?: "salary" | "hourly";
    annual_salary?: number;
    hourly_rate?: number;
    average_hours_per_week?: number;
    seasonal_variation?: "none" | "low" | "medium" | "high";
    estimated_annual_income?: number;
    filing_status?: "single" | "married_joint" | "head_of_household";
    pay_frequency?: "weekly" | "bi-weekly" | "semi-monthly" | "monthly";
    current_withholding_per_paycheck?: number;
    desired_boost_per_paycheck?: number;
    additional_income?: number;
    deductions?: any;
    dependents?: number;
    spouse_income?: number;
    current_date?: string;
    paychecks_already_received?: number;
    home_address?: string;
    work_address?: string;
    pre_tax_deductions?: number;
    post_tax_deductions?: number;
    age?: number;
    is_refund_data_fill?: boolean;
    is_paycheck_data_fill?: boolean;
}

export const OCRUploadComponent: React.FC<{ userId: string, onComplete: (data: TaxData) => void }> = ({ userId, onComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [taxData, setTaxData] = useState<any | null>(null);
    const [editMode, setEditMode] = useState(false);

    // ✅ Upload Function
    const uploadOcrData = async (userId: string, file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                `https://dev-ocr.musetax.com/vision/extract?user_id=${userId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "ngrok-skip-browser-warning": "69420",
                    },
                    onUploadProgress: (event) => {
                        if (event.total) {
                            const percent = Math.round((event.loaded * 100) / event.total);
                            setProgress(percent);
                        }
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            console.error("Upload failed:", error);
            throw error;
        }
    };

    // ✅ File input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type === "application/pdf") {
                setFile(selectedFile);
            } else {
                alert("Only PDF files are supported!");
                e.target.value = "";
            }
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setProgress(0);
    };
    const convertResponse = (response: any) => {
        const data = response?.data || {};

        const sumArray = (arr: any[] | null | undefined) =>
            Array.isArray(arr)
                ? arr.reduce((sum, item) => sum + (item.amount || 0), 0)
                : 0;


        data.pre_tax_deductions = sumArray(data.pre_tax_deductions),
            data.post_tax_deductions = sumArray(data.post_tax_deductions),
            data.deductions = sumArray(data.deductions)


        return data;
    }

    // ✅ Proceed to upload and get OCR data
    const handleProceed = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const result = await uploadOcrData(userId, file);
            const reponse= convertResponse(result)
            // Assume OCR returns data shaped like TaxData
            // let result = {
            //     data: {
            //         "first_name": "tester",
            //         "middle_name": "",
            //         "last_name": "test",
            //         "income_type": null,
            //         "annual_salary": null,
            //         "hourly_rate": null,
            //         "average_hours_per_week": null,
            //         "seasonal_variation": null,
            //         "estimated_annual_income": null,
            //         "filing_status": null,
            //         "pay_frequency": null,
            //         "current_withholding_per_paycheck": null,
            //         "desired_boost_per_paycheck": null,
            //         "additional_income": 0.0,
            //         "deductions": 0.0,
            //         "dependents": 0,
            //         "spouse_income": 0.0,
            //         "current_date": null,
            //         "paychecks_already_received": null,
            //         "home_address": null,
            //         "work_address": null,
            //         "pre_tax_deductions": null,
            //         "post_tax_deductions": null,
            //         "age": null
            //     }
            // }
            setTaxData(reponse);
            setFile(null);
        } catch {
            alert("Upload failed! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // const handleNestedEditChange = (
    //     section: string,
    //     key: string,
    //     value: string
    // ) => {
    //     setTaxData((prev:any) => {
    //         if (!prev || !prev.data) return prev;
    //         return {
    //             ...prev,
    //             data: {
    //                 ...prev.data,
    //                 [section]: {
    //                     ...prev.data[section],
    //                     [key]: value,
    //                 },
    //             },
    //         };
    //     });
    // };

    // const handleSave = () => {
    //     console.log("Updated TaxData:", taxData);
    //     alert("Details saved successfully!");
    //     // onComplete(taxData)
    //     setEditMode(false);
    // };

    // 🔹 Show Tax Details if available
    // 🔹 Show Tax Details if available
    if (taxData) {
        return (
            <TaxDataForm
                taxData={taxData}
                onSave={(updated) => {
                    console.log("Updated Tax Data:", updated);
                    onComplete(updated);
                }}
            />
        );
    }


    // 🔹 Otherwise show upload UI
    return (
        <div className="fixed inset-0 bg-[#49C2D420] flex justify-center items-center z-50">
            <div className="bg-white w-full rounded-2xl shadow-xl p-6 relative" style={{maxWidth:"430px"}}>
                <h2 className="text-lg font-semibold mb-2">Upload file</h2>

                {!file ? (
                    <>
                        <label
                            htmlFor="fileInput"
                            className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition"
                            style={{paddingTop:"20px",
                                paddingBottom:"20px"
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/109/109612.png"
                                    alt="upload"
                                    className="w-6 h-6 mb-3 opacity-70"
                                />
                                <p className="text-gray-600 text-sm text-center">
                                    Drag and Drop file here or{" "}
                                    <span className="text-[#255BE3] font-medium">Choose file</span>
                                </p>
                            </div>
                        </label>

                        <input
                            type="file"
                            id="fileInput"
                            accept=".pdf"
                            className="hidden"
                            style={{display:"none"}}
                            onChange={handleFileChange}
                        />

                        <div className="flex justify-between w-full px-0 text-xs text-gray-400" style={{marginTop:10}}>
                            <span>Supported format: PDF</span>
                            <span>Maximum size: 5MB</span>
                        </div>
                    </>
                ) : (
                    <div className="relative mt-3 border border-gray-200 rounded-lg p-4 bg-gray-50" style={{padding:"10px"}}>
                        <button
                            onClick={handleRemoveFile}
                            className=" text-white hover:text-gray-600"
                            style={{position:"absolute",
                                right:"22px",
                                top:"1px",
                                background:"rgb(81, 141, 231)",
                                borderRadius:"50px",
                                padding:2,
                                cursor:"pointer"
                            }}
                        >
                            <X size={14} />
                        </button>

                        {/* Preview Section */}
                        <div className="flex flex-col items-center justify-center mb-4" >
                            {file.type === "application/pdf" ? (
                                // PDF Preview
                                <iframe
                                    src={URL.createObjectURL(file)}
                                    className="w-full rounded-lg border"
                                    title="PDF Preview"
                                    style={{height:"100%"}}
                                ></iframe>
                            ) : file.type.startsWith("image/") ? (
                                // Image Preview
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="max-w-full max-h-[400px] rounded-lg border"
                                />
                            ) : (
                                // Default Icon if not previewable
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                                    alt="pdf"
                                    className="w-24 h-24 opacity-80"
                                />
                            )}
                        </div>

                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {(file.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                        </div>
                        {loading && (
                            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-[#255BE3] h-2 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                )}

                {file && <div className="flex justify-end mt-6">
                    <button
                        disabled={loading}
                        onClick={handleProceed}
                        className="px-6 py-2 rounded-full font-medium text-white shadow-md transition-all"
                        style={{
                            backgroundColor: "rgb(81, 141, 231)",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "rgb(65, 120, 210)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "rgb(81, 141, 231)")
                        }
                    >
                        {loading ? "Uploading..." : "Proceed"}
                    </button>
                </div>}
            </div>
        </div>
    );
};
