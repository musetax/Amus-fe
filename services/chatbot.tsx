import { default as axios } from "axios";

const BASE_URL = "https://amus-devapi.musetax.com";

export const sendQuery = async (query: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/query`, { query });
    return response.data;
  } catch (error: any) {
    console.log(error, 'error1');
    throw error.response?.data || { message: error.message };
  }
};

export const sendMessagetax = async (data: any, session_id: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/chat/${session_id}/message`, {
      message: data,
    });
    return response.data;
  } catch (error: any) {
    console.log(error, 'error2');
    throw error.response?.data || { message: error.message };
  }
};

export const authenticate = async (data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/chat/checkboost/start`, data);
    return response.data;
  } catch (error: any) {
    console.log(error, 'error3');
    throw error.response?.data || { message: error.message };
  }
};

export const taxProfile = async (taxdata: any, session_id: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/tax-profile/checkboost/${session_id}`, taxdata);
    return response.data;
  } catch (error: any) {
    console.log(error, 'error4');
    throw error.response?.data || { message: error.message };
  }
};
 