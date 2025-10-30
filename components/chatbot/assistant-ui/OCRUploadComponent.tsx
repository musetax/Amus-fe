"use client";
import React, { useState } from "react";
import { X, Edit3, Save } from "lucide-react";
import axios from "axios";

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

export const OCRUploadComponent: React.FC<{ userId: string }> = ({ userId }) => {
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
                `https://dev-ocr.musetax.com/Azure/paycheck_form?user_id=${userId}`,
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

    // ✅ Proceed to upload and get OCR data
    const handleProceed = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const result = await uploadOcrData(userId, file);
            // Assume OCR returns data shaped like TaxData
            setTaxData(result);
            setFile(null);
        } catch {
            alert("Upload failed! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleNestedEditChange = (
        section: string,
        key: string,
        value: string
    ) => {
        setTaxData((prev:any) => {
            if (!prev || !prev.data) return prev;
            return {
                ...prev,
                data: {
                    ...prev.data,
                    [section]: {
                        ...prev.data[section],
                        [key]: value,
                    },
                },
            };
        });
    };

    const handleSave = () => {
        console.log("Updated TaxData:", taxData);
        alert("Details saved successfully!");
        setEditMode(false);
    };

    // 🔹 Show Tax Details if available
    if (taxData) {
        return (
            <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-md mt-10 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Details Provided</h2>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="flex items-center text-sm text-[#255BE3] hover:underline"
                    >
                        <Edit3 size={16} className="mr-1" />
                        {editMode ? "Cancel" : "Edit"}
                    </button>
                </div>

                <div className="space-y-4 text-sm text-gray-700">
                    {taxData?.data &&
                        Object.entries(taxData.data).map(([sectionKey, sectionValue]) => (
                            <div
                                key={sectionKey}
                                className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                            >
                                {/* Section Title */}
                                <h3 className="font-semibold text-gray-800 mb-2 capitalize">
                                    {sectionKey.replace(/([A-Z])/g, " $1").trim()}
                                </h3>

                                {/* Section Fields */}
                                <div className="space-y-1">
                                    {Object.entries(sectionValue as Record<string, any>).map(
                                        ([fieldKey, fieldValue]) => (
                                            <div
                                                key={fieldKey}
                                                className="flex justify-between border-b border-gray-100 py-1"
                                            >
                                                <span className="font-medium capitalize">
                                                    {fieldKey.replace(/_/g, " ")}:
                                                </span>

                                                {editMode ? (
                                                    <input
                                                        className="border rounded px-2 py-0.5 text-gray-700 w-40 text-right"
                                                        value={fieldValue ?? ""}
                                                        onChange={(e) =>
                                                            handleNestedEditChange(
                                                                sectionKey,
                                                                fieldKey,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <span className="text-gray-600 text-right">
                                                        {fieldValue?.toString() || "-"}
                                                    </span>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                </div>


                {!editMode && (
                    <div className="flex justify-end mt-5">
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 rounded-full font-medium text-white shadow-md transition-all"
                            style={{
                                backgroundColor: "rgb(81, 141, 231)",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor = "rgb(65, 120, 210)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = "rgb(81, 141, 231)")
                            }    >
                            <Save size={16} className="mr-2" />
                            Save
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // 🔹 Otherwise show upload UI
    return (
        <div className="fixed inset-0 bg-[#49C2D420] flex justify-center items-center z-50">
            <div className="bg-white w-[430px] rounded-2xl shadow-xl p-6 relative">
                <h2 className="text-lg font-semibold mb-5">Upload file</h2>

                {!file ? (
                    <>
                        <label
                            htmlFor="fileInput"
                            className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl py-10 cursor-pointer hover:bg-gray-50 transition"
                        >
                            <div className="flex flex-col items-center">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/109/109612.png"
                                    alt="upload"
                                    className="w-10 h-10 mb-3 opacity-70"
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
                            onChange={handleFileChange}
                        />

                        <div className="flex justify-between w-full px-4 mt-5 text-xs text-gray-400">
                            <span>Supported format: PDF</span>
                            <span>Maximum size: 5MB</span>
                        </div>
                    </>
                ) : (
                    <div className="relative mt-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <button
                            onClick={handleRemoveFile}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center justify-center mb-4">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                                alt="pdf"
                                className="w-24 h-24 opacity-80"
                            />
                        </div>

                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-700 truncate">
                                {file.name}
                            </p>
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
                        disabled={!file || loading}
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
