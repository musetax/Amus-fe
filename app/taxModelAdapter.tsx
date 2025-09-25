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

