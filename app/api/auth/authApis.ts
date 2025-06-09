// src/api/authApi.ts
 import { axiosInstanceAuth } from "@/utilities/axios";
import { API_ENDPOINTS } from "../endPoints";
import { toast } from "react-toastify"; // adjust import as per your toast library

export const registerUser = async (values: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await axiosInstanceAuth.post(API_ENDPOINTS.REGISTER, values);
    return res.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Registration failed");
    throw error;
  }
};

export const resendOtp = async (email: string) => {
  try {
    const res = await axiosInstanceAuth.post(API_ENDPOINTS.RESEND_OTP, { email });
    return res.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to resend OTP");
    throw error;
  }
};

export const verifyOtp = async (data: { email: string; confirmation_code: string }) => {
  try {
    const res = await axiosInstanceAuth.post(API_ENDPOINTS.VERIFY_EMAIL, data);
    return res.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || "OTP verification failed");
    throw error;
  }
};

export const loginUser = async (values: {
  email: string;
  password: string;
}) => {
  try {
    const res = await axiosInstanceAuth.post(API_ENDPOINTS.LOGIN, values);
    return res.data;
  } catch (error: any) {
    console.log(error,'errorerrorerror');
    
    toast.error(error.response?.data?.detail || "Login failed");
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const res = await axiosInstanceAuth.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    return res.data;
  } catch (error: any) {
    toast.error(error.response?.data?.detail || "Forgot password request failed");
    throw error;
  }
};

export const createNewPassword = async (values: {
  email: string;
  confirmation_code:string;
  new_password: string;
  
 }) => {
  try {
    const res = await axiosInstanceAuth.post(API_ENDPOINTS.CREATE_NEW_PASSWORD, values);
    return res.data;
  } catch (error: any) {
    toast.error(error.response?.data?.detail || "Creating new password failed");
    throw error;
  }
};

export const resetPassword = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  try {
    const res = await axiosInstanceAuth.post(API_ENDPOINTS.RESET_PASSWORD, data);
    return res.data;
  } catch (error: any) {
    toast.error(error.response?.data?.detail || "Password reset failed");
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axiosInstanceAuth.get(API_ENDPOINTS.GET_ALL_USERS);
    return res.data;
  } catch (error: any) {
    toast.error(error.response?.data?.detail || "Failed to fetch users");
    throw error;
  }
};


export const logOut = async () => {
  try {
    const res = await axiosInstanceAuth.get(API_ENDPOINTS.LOGOUT);
    return res.data;
  } catch (error: any) {
   console.log(error.response?.data?.detail);
    throw error;
  }
};
