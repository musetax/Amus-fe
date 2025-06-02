// src/api/authApi.ts
import axiosInstance from "@/utilities/axios";
import { API_ENDPOINTS } from "../endPoints";

export const registerUser = async (values: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) => {
  const res = await axiosInstance.post(API_ENDPOINTS.REGISTER, values);
  return res.data;
};

export const resendOtp = async (email: string) => {
  const res = await axiosInstance.post(API_ENDPOINTS.RESEND_OTP, { email });
  return res.data;
};

export const verifyEmail = async (data: { email: string; otp: string }) => {
  const res = await axiosInstance.post(API_ENDPOINTS.VERIFY_EMAIL, data);
  return res.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await axiosInstance.post(API_ENDPOINTS.LOGIN, data);
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, {
    email,
  });
  return res.data;
};

export const createNewPassword = async (data: {
  email: string;
  otp: string;
  password: string;
}) => {
  const res = await axiosInstance.post(API_ENDPOINTS.CREATE_NEW_PASSWORD, data);
  return res.data;
};

export const resetPassword = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  const res = await axiosInstance.post(API_ENDPOINTS.RESET_PASSWORD, data);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axiosInstance.get(API_ENDPOINTS.GET_ALL_USERS);
  return res.data;
};
