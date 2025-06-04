import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosInstanceAuth: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstanceAuth.interceptors.request.use((config) => {
  config.headers["service_key"] = "amus";
  return config;
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

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API}auth/login/refresh`,
      {
        refresh_token: refreshToken,
      }
    );

    const newAccessToken = response.data?.tokens?.AccessToken;
    const newRefreshToken = response.data?.tokens?.RefreshToken;

    if (newAccessToken) {
      setTokens(newAccessToken, newRefreshToken);
      return newAccessToken;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
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
  (error: any) => Promise.reject(error)
);

axiosInstanceAuth.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
     const accessToken = Cookies.get("collintoken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// **Response Interceptor**
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status == 401 && !originalRequest._retry) {
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

axiosInstanceAuth.interceptors.response.use(
 (response: AxiosResponse) => response,
  async (error: any) => {
    const originalRequest = error.config;
    if (error.response?.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = Cookies.get("collintoken");
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstanceAuth(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, axiosInstanceAuth };
  