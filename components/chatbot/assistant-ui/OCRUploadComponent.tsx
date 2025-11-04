"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { TaxDataForm } from "./taxDataForm";
import Image from "next/image";

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

export const OCRUploadComponent: React.FC<{
  userId: string;
  onComplete: (data: TaxData) => void;
}> = ({ userId, onComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [taxData, setTaxData] = useState<any | null>(null);
  // const [editMode, setEditMode] = useState(false);

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

    const sumArray = (arr: any[] | null | undefined): number =>
      Array.isArray(arr)
        ? arr.reduce((sum, item) => sum + (item?.amount || 0), 0)
        : 0;

    return {
      ...data,
      pre_tax_deductions: sumArray(data.pre_tax_deductions),
      post_tax_deductions: sumArray(data.post_tax_deductions),
      deductions: sumArray(data.deductions),
    };
  };

  // ✅ Proceed to upload and get OCR data
  const handleProceed = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const result = await uploadOcrData(userId, file);
      const reponse = convertResponse(result);
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
//   const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setFile(file);
    } else {
      alert("Please upload a valid PDF file.");
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
        onCancel={() => {setFile(null) ;setTaxData(null)}} // <-- wrapped in arrow function
      />
    );
  }
  const handleOpenPDF = (file:any) => {
     if (!file) return;

  // Create a blob URL for the PDF file
  const fileURL = URL.createObjectURL(file);

  // Open the file in a new browser tab
  window.open(fileURL, "_blank");

  };
  // 🔹 Otherwise show upload UI
  return (
    <div className="absolute inset-0 bg-[#49C2D420] flex justify-center items-center z-50">
      <div
         onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
        className=" w-full rounded-2xl shadow p-4 relative"
        style={{ maxWidth: "290px", backgroundColor: "rgba(81, 141, 231,0.1)" }}
      >
        <h2 className="text-base font-semibold mb-2">Upload file</h2>

        {!file ? (
          <>
            <label
              htmlFor="fileInput"
              className="flex flex-col items-center justify-center  rounded-xl cursor-pointer hover:bg-gray-50 transition"
              style={{
                paddingTop: "20px",
                paddingBottom: "20px",
                paddingLeft: "40px",
                paddingRight: "40px",
                border: "1px dashed rgba(81, 141, 231,0.6)",
              }}
            >
              <div className="flex flex-col items-center">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 1024 1024"
                  height="32px"
                  width="32px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M763.024 259.968C718.4 141.536 622.465 66.527 477.553 66.527c-184.384 0-313.392 136.912-324.479 315.536C64.177 410.495.002 501.183.002 603.903c0 125.744 98.848 231.968 215.823 231.968h92.448c17.664 0 32-14.336 32-32 0-17.68-14.336-32-32-32h-92.448c-82.304 0-152.832-76.912-152.832-167.968 0-80.464 56.416-153.056 127.184-165.216l29.04-5.008-2.576-29.328-.24-.368c0-155.872 102.576-273.44 261.152-273.44 127.104 0 198.513 62.624 231.537 169.44l6.847 22.032 23.056.496c118.88 2.496 223.104 98.945 223.104 218.77 0 109.055-72.273 230.591-181.696 230.591h-73.12c-17.664 0-32 14.336-32 32 0 17.68 14.336 32 32 32l72.88-.095c160-4.224 243.344-157.071 243.344-294.495 0-147.712-115.76-265.744-260.48-281.312zM535.985 514.941c-.176-.192-.241-.352-.354-.512l-8.095-8.464c-4.432-4.688-10.336-7.008-16.24-6.976-5.905-.048-11.777 2.288-16.289 6.975l-8.095 8.464c-.16.16-.193.353-.336.513L371.072 642.685c-8.944 9.344-8.944 24.464 0 33.84l8.064 5.471c8.945 9.344 23.44 6.32 32.368-3.024l68.113-75.935v322.432c0 17.664 14.336 32 32 32s32-14.336 32-32V603.34l70.368 77.631c8.944 9.344 23.408 12.369 32.336 3.025l8.064-5.472c8.945-9.376 8.945-24.496 0-33.84z"></path>
                </svg>
                <p
                  className="text-gray-600 text-sm text-center"
                  style={{ marginTop: 8 }}
                >
                  Drag and Drop file here or{" "}
                  <span className="text-[#255BE3] font-medium">
                    Choose file
                  </span>
                </p>
              </div>
            </label>

            <input
              type="file"
              id="fileInput"
              accept=".pdf"
              className="hidden"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <div
              className="flex justify-between w-full px-0 text-xs text-gray-400"
              style={{ marginTop: 10 }}
            >
              <span>Supported format: PDF</span>
              <span>Maximum size: 5MB</span>
            </div>
          </>
        ) : (
          <div
            className="relative mt-3  rounded-lg p-4 bg-gray-50"
            style={{
              padding: "10px",
              border: "1px dashed rgba(81, 141, 231,0.6)",
            }}
          >
            <button
              onClick={handleRemoveFile}
              className=" text-white hover:text-gray-600"
              style={{
                position: "absolute",
                right: "22px",
                top: "1px",
                background: "rgb(81, 141, 231)",
                borderRadius: "50px",
                padding: 2,
                cursor: "pointer",
              }}
            >
              <X size={14} />
            </button>

            {/* Preview Section */}
            <div className="flex flex-col items-center justify-center mb-4">
              {file.type === "application/pdf" ? (
                // PDF Preview
                // <iframe
                //   src={URL.createObjectURL(file)}
                //   className="w-full rounded-lg border"
                //   title="PDF Preview"
                //   style={{ height: "100%" }}
                // ></iframe>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="60px"
                  height="60px"
                  viewBox="-4 0 40 40"
                  fill="none"
                >
                  <path
                    d="M25.6686 26.0962C25.1812 26.2401 24.4656 26.2563 23.6984 26.145C22.875 26.0256 22.0351 25.7739 21.2096 25.403C22.6817 25.1888 23.8237 25.2548 24.8005 25.6009C25.0319 25.6829 25.412 25.9021 25.6686 26.0962ZM17.4552 24.7459C17.3953 24.7622 17.3363 24.7776 17.2776 24.7939C16.8815 24.9017 16.4961 25.0069 16.1247 25.1005L15.6239 25.2275C14.6165 25.4824 13.5865 25.7428 12.5692 26.0529C12.9558 25.1206 13.315 24.178 13.6667 23.2564C13.9271 22.5742 14.193 21.8773 14.468 21.1894C14.6075 21.4198 14.7531 21.6503 14.9046 21.8814C15.5948 22.9326 16.4624 23.9045 17.4552 24.7459ZM14.8927 14.2326C14.958 15.383 14.7098 16.4897 14.3457 17.5514C13.8972 16.2386 13.6882 14.7889 14.2489 13.6185C14.3927 13.3185 14.5105 13.1581 14.5869 13.0744C14.7049 13.2566 14.8601 13.6642 14.8927 14.2326ZM9.63347 28.8054C9.38148 29.2562 9.12426 29.6782 8.86063 30.0767C8.22442 31.0355 7.18393 32.0621 6.64941 32.0621C6.59681 32.0621 6.53316 32.0536 6.44015 31.9554C6.38028 31.8926 6.37069 31.8476 6.37359 31.7862C6.39161 31.4337 6.85867 30.8059 7.53527 30.2238C8.14939 29.6957 8.84352 29.2262 9.63347 28.8054ZM27.3706 26.1461C27.2889 24.9719 25.3123 24.2186 25.2928 24.2116C24.5287 23.9407 23.6986 23.8091 22.7552 23.8091C21.7453 23.8091 20.6565 23.9552 19.2582 24.2819C18.014 23.3999 16.9392 22.2957 16.1362 21.0733C15.7816 20.5332 15.4628 19.9941 15.1849 19.4675C15.8633 17.8454 16.4742 16.1013 16.3632 14.1479C16.2737 12.5816 15.5674 11.5295 14.6069 11.5295C13.948 11.5295 13.3807 12.0175 12.9194 12.9813C12.0965 14.6987 12.3128 16.8962 13.562 19.5184C13.1121 20.5751 12.6941 21.6706 12.2895 22.7311C11.7861 24.0498 11.2674 25.4103 10.6828 26.7045C9.04334 27.3532 7.69648 28.1399 6.57402 29.1057C5.8387 29.7373 4.95223 30.7028 4.90163 31.7107C4.87693 32.1854 5.03969 32.6207 5.37044 32.9695C5.72183 33.3398 6.16329 33.5348 6.6487 33.5354C8.25189 33.5354 9.79489 31.3327 10.0876 30.8909C10.6767 30.0029 11.2281 29.0124 11.7684 27.8699C13.1292 27.3781 14.5794 27.011 15.985 26.6562L16.4884 26.5283C16.8668 26.4321 17.2601 26.3257 17.6635 26.2153C18.0904 26.0999 18.5296 25.9802 18.976 25.8665C20.4193 26.7844 21.9714 27.3831 23.4851 27.6028C24.7601 27.7883 25.8924 27.6807 26.6589 27.2811C27.3486 26.9219 27.3866 26.3676 27.3706 26.1461ZM30.4755 36.2428C30.4755 38.3932 28.5802 38.5258 28.1978 38.5301H3.74486C1.60224 38.5301 1.47322 36.6218 1.46913 36.2428L1.46884 3.75642C1.46884 1.6039 3.36763 1.4734 3.74457 1.46908H20.263L20.2718 1.4778V7.92396C20.2718 9.21763 21.0539 11.6669 24.0158 11.6669H30.4203L30.4753 11.7218L30.4755 36.2428ZM28.9572 10.1976H24.0169C21.8749 10.1976 21.7453 8.29969 21.7424 7.92417V2.95307L28.9572 10.1976ZM31.9447 36.2428V11.1157L21.7424 0.871022V0.823357H21.6936L20.8742 0H3.74491C2.44954 0 0 0.785336 0 3.75711V36.2435C0 37.5427 0.782956 40 3.74491 40H28.2001C29.4952 39.9997 31.9447 39.2143 31.9447 36.2428Z"
                    fill="#EB5757"
                  />
                </svg>
              ) : file.type.startsWith("image/") ? (
                // Image Preview
                <Image
                  width={24} // 👈 required
                  height={24}
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="max-w-full max-h-[400px] rounded-lg border"
                />
              ) : (
                // Default Icon if not previewable
                <Image
                  width={24} // 👈 required
                  height={24}
                  src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                  alt="pdf"
                  className="w-24 h-24 opacity-80"
                />
              )}
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

        {file && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={()=>handleOpenPDF(file)}
              style={{
                backgroundColor: "transparent",
                padding: "0",
                color: "rgb(81, 141, 231)",
                fontWeight: "500",
                gap: "6px",
                fontSize: "14px",
                textDecoration: "underline",
              }}
            >
              View PDF
            </button>
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
          </div>
        )}
      </div>
    </div>
  );
};
