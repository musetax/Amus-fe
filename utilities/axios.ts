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

// Set static service-key for all auth requests
axiosInstanceAuth.interceptors.request.use((config) => {
  config.headers["service-key"] = "amus";
  return config;
});

// ✅ Function to get tokens from Cookies
const getTokens = () => ({
  accessToken: Cookies.get("collintoken"),
  refreshToken: Cookies.get("collinrefresh"),
});

// ✅ Function to set tokens into Cookies
const setTokens = (accessToken: string, refreshToken?: string) => {
  Cookies.set("collintoken", accessToken);
  if (refreshToken) {
    Cookies.set("collinrefresh", refreshToken);
  }
};

// ✅ Refresh Token Logic
export const refreshToken = async (): Promise<string | null> => {
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
    Cookies.remove("collintoken");
    Cookies.remove("collinrefresh");
    window.location.href = "/login";
    return null;
  }
};

// ✅ Request Interceptors (BOTH use cookies now)
const attachTokenInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
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
};

attachTokenInterceptor(axiosInstance);
attachTokenInterceptor(axiosInstanceAuth);

// ✅ Response Interceptors (BOTH retry after refreshing token using cookie)
const attachResponseInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: any) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );
};

attachResponseInterceptor(axiosInstance);
attachResponseInterceptor(axiosInstanceAuth);

// ✅ Export ready-to-use instances
export { axiosInstance, axiosInstanceAuth };
