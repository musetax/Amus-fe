import axios, {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
  } from "axios";

  
  export const API_URL = "https://api-d.coevbe.musetaxm/";
  export const FRONTEND_URL = "http://localhost:4000/";
  
  
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  // Function to get tokens from localStorage
  const getTokens = () => ({
    accessToken: localStorage.getItem("authTokenMuse"),
    refreshToken: localStorage.getItem("refreshTokenMuse"),
  });
  
  // Function to update tokens in localStorage
  const setTokens = (accessToken: string, refreshToken?: string) => {
    localStorage.setItem("authTokenMuse", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshTokenMuse", refreshToken);
    }
  };
  
  // Function to refresh token
  const refreshToken = async (): Promise<string | null> => {
    try {
      const { refreshToken } = getTokens();
     
      if (!refreshToken) throw new Error("No refresh token available");
  
      const response = await axios.post(`${API_URL}auth/login/refresh`, {
        refresh_token: refreshToken,
      });
  
      const newAccessToken = response.data?.tokens?.AccessToken;
      const newRefreshToken = response.data?.tokens?.RefreshToken;
  
      if (newAccessToken) {
        setTokens(newAccessToken, newRefreshToken);
        return newAccessToken;
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.log("Error refreshing token:", error);
      localStorage.clear();
      window.location.href = "/login";
      return null;
    }
  };
  
  // **Request Interceptor**
  axiosInstance.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {
      const { accessToken } = getTokens();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error:any) => Promise.reject(error)
  );
  
  // **Response Interceptor**
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error:any) => {
      const originalRequest = error.config;
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;
  