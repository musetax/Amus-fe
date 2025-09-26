"use client";

import { default as axios } from "axios";
import "../utilities/auth"; // Import to activate axios interceptors
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
    const response = await axios.get(`https://2b8c3cf85ec5.ngrok-free.app/user?user_id=${userId}`,
     { headers:{
        "ngrok-skip-browser-warning": "69420",
      }}
    );

    return response.data;
  } catch {
    throw new Error('Failed to create user info');
  }
}
export const payrollDetailsUpdate=async(userId:string,payload:any)=>{
   try {
    const response = await axios.patch(`https://2b8c3cf85ec5.ngrok-free.app/user/${userId}`,payload);

    return response.data;
  } catch {
    throw new Error('Failed to create user info');
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
    console.log(response)
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
