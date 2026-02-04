"use client";

import { default as axios } from "axios";
import "../utilities/auth"; // Import to activate axios interceptors
import { axiosInstanceAuth } from "../utilities/auth";
export const downloadPdf = async (email: string, sessionId: any, url_type: any) => {
  try {
    const response = await axios.post('https://amus-devapi.musetax.com/v1/api/export/chats', {
      email: email,
      session_id: sessionId,
      chat_type: url_type
    });

    return response.data;
  }
  catch {
    throw new Error('Failed to download Pdf');
  }
}
export const sendEmail = async (email: string, sessionId: any, url_type: any) => {
  try {
    const response = await axios.post('https://amus-devapi.musetax.com/v1/api/export/email-notification', {
      email: email,
      session_id: sessionId,
      chat_type: url_type
    });

    return response.data;
  }
  catch {
    throw new Error('Failed to send email');
  }
}
export const createUserInfo = async (taxPayload: any, email: string, url_type: any) => {
  try {
    const response = await axios.post(`https://amus-devapi.musetax.com/api/tax_education/create-user-info/${url_type}`, {
      email_id: email,
      userinfo: taxPayload
    });

    return response.data;
  } catch {
    throw new Error('Failed to create user info');
  }
}

export const getPayrollDetails=async(userId:string)=>{
   try {
    const response = await axiosInstanceAuth.get(`/user?user_id=${userId}`,
    //  { headers:{
    //     "ngrok-skip-browser-warning": "69420",
    //   }}
    );

    return response.data;
  } catch (error:any){

    throw error
  }
}
export const uploadOcrData = async (userId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // backend expects the PDF file under key "file"

    const response = await axiosInstanceAuth.post(
      `https://dev-ocr.musetax.com/Azure/paycheck_form?user_id=${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "69420",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("OCR Upload Error:", error);
    throw error;
  }
};
export const payrollDetailsUpdate=async(userId:string,payload:any)=>{
   try {
    const response = await axiosInstanceAuth.patch(`/user/${userId}`,payload);

    return response.data;
  } catch(error:any) {
    throw error;
  }
}

interface TokenPayload {
  client_id: string,
  client_secret: string
}

const tokenStore = (data: any) => {
  localStorage.setItem('authTokenMuse', data.access_token)
  localStorage.setItem("refreshTokenMuse", data.refresh_token)
}

export const tokenCreateFromclientIdandSecret = async (payload: TokenPayload) => {
  try {
    const response = await axios.post(`https://api-stgbe.musetax.com/auth/token`, payload)
    tokenStore(response.data)
    return response


  } catch (error: any) {
    console.log(error, "error")
    throw new Error('Failed to create token');
  }
}

interface UserAndSessionId {
  payroll_details: any;
  company_name: string;
  first_name:string,
  email:string,
  last_name:string
}

// Store session ID with 1-day expiry
const storeSessionId = (data: { session_id: string }) => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 1 day in ms

  // Store original session ID
  localStorage.setItem("originalSessionId", data.session_id);

  // Store expiry timestamp
  const expiryTime = Date.now() + ONE_DAY_MS;
  localStorage.setItem("sessionExpiry", expiryTime.toString());
};

// Get session ID if not expired, else return null
export const getSessionId = (): string | null => {
  const expiryStr = localStorage.getItem("sessionExpiry");
  const sessionId = localStorage.getItem("originalSessionId");

  if (!expiryStr || !sessionId) return null;

  const expiryTime = parseInt(expiryStr, 10);
  if (Date.now() > expiryTime) {
    // Session expired
    return null;
  }

  // Session still valid → return original session ID
  return sessionId;
};



// API call to get session ID and store it
export const getUserAndSessionId = async (
  sessionPayload: UserAndSessionId
) => {
  try {
    const response = await axios.post(
      `https://api-stgbe.musetax.com/auth/token`, // <-- verify endpoint
      sessionPayload
    );
    console.log(response.data);

    // Store session ID with 1 day expiry
    storeSessionId({ session_id: response.data.session_id });

    return response.data; // return only the data
  } catch (error: any) {
    console.error(error, "Error fetching session ID");
    throw new Error("Failed to get session id");
  }
};

export const calculateTaxScenarios = async (
  userId: string,
  sessionId: string,
  originalPayroll: any,
  modifiedPayroll: any,
  userIntent: "tax_refund_calculation" | "tax_paycheck_calculation",
  onChunk?: (text: string) => void
) => {
  try {
    // Build the payload based on the user intent
    const payload: any = {
      message: "calculate my tax",
      session_id: sessionId,
      user_id: userId,
      user_intent: userIntent,
    };

    // Add paycheck data if available
    if (modifiedPayroll) {
      payload.paycheck = {
        income_type: modifiedPayroll.income_type || "salary",
        salary: modifiedPayroll.salary || modifiedPayroll.annual_salary || 0,
        hourly_rate: modifiedPayroll.hourly_rate || 0,
        hours_per_week: modifiedPayroll.hours_per_week || 0,
        pay_frequency: modifiedPayroll.pay_frequency || "weekly",
        filing_status: modifiedPayroll.filing_status || "single",
        home_address: modifiedPayroll.home_address || "10001",
        work_address: modifiedPayroll.work_address || "10001",
        spouse_income: modifiedPayroll.spouse_income || 0,
        pre_tax_deductions: modifiedPayroll.pre_tax_deductions || 0,
        post_tax_deductions: modifiedPayroll.post_tax_deductions || 0,
        dependents: modifiedPayroll.dependents || 0,
        age: modifiedPayroll.age || 22,
      };
    }

    // Add refund data if user intent is tax_refund_calculation
    if (userIntent === "tax_refund_calculation" && modifiedPayroll) {
      payload.refund = {
        app_enum: "amus",
        first_name: modifiedPayroll.first_name || "",
        middle_name: modifiedPayroll.middle_name || "",
        last_name: modifiedPayroll.last_name || "",
        income_type: modifiedPayroll.income_type || "salary",
        annual_salary: modifiedPayroll.annual_salary || modifiedPayroll.salary || 0,
        hourly_rate: modifiedPayroll.hourly_rate || 0,
        average_hours_per_week: modifiedPayroll.hours_per_week || 0,
        seasonal_variation: "none",
        estimated_annual_income: modifiedPayroll.estimated_annual_income || modifiedPayroll.annual_salary || 0,
        filing_status: modifiedPayroll.filing_status || "single",
        pay_frequency: modifiedPayroll.pay_frequency || "weekly",
        current_withholding_per_paycheck: modifiedPayroll.current_withholding_per_paycheck || 0,
        desired_boost_per_paycheck: 0,
        additional_income: modifiedPayroll.additional_income || 0,
        deductions: modifiedPayroll.deductions || modifiedPayroll.pre_tax_deductions || 0,
        dependents: modifiedPayroll.dependents || 0,
        spouse_income: modifiedPayroll.spouse_income || 0,
        current_date: new Date().toISOString(),
        paychecks_already_received: modifiedPayroll.paychecks_already_received || 0,
      };
    }

    // Make streaming request
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}tax-calculate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authTokenMuse")}`,
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok || !response.body) {
      throw new Error("Bad response from tax-calculate API");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunkStr = decoder.decode(value, { stream: true });
      const lines = chunkStr.split("\n");

      for (const line of lines) {
        if (!line.trim()) continue;

        if (line.startsWith("data: ")) {
          const jsonStr = line.slice("data: ".length).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;

          try {
            const json = JSON.parse(jsonStr);

            if (json.response || json.message) {
              const chunk = json.response || json.message;
              accumulated += chunk;

              // Call the callback with each chunk
              if (onChunk) {
                onChunk(accumulated);
              }
            }
          } catch (err) {
            console.error("JSON parse error:", jsonStr, err);
          }
        }
      }
    }

    return accumulated;
  } catch (error: any) {
    console.error("Error calculating tax scenarios:", error);
    throw error;
  }
};
