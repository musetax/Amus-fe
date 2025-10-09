import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
// import { toast } from "react-toastify";

// ========== Environment Setup ==========
// const appEnv = process.env.NEXT_PUBLIC_APP_ENV;

// export const API_URL =
//   appEnv === "prod"
//     ? process.env.NEXT_PUBLIC_API_URL_PROD
//     : process.env.NEXT_PUBLIC_API_URL_DEV;

export const AUTH_API_URL = process.env.NEXT_PUBLIC_BACKEND_API;

// ========== Token Helpers ==========
export const getTokens = () => ({
  accessToken: localStorage.getItem("authTokenMuse"),
  refreshToken: localStorage.getItem("refreshTokenMuse"),
  clientId:localStorage.getItem('clientId'),
  clientSecret:localStorage.getItem('clientSecret')
});
export const axiosInstanceAuth: AxiosInstance = axios.create({
  baseURL: AUTH_API_URL ,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstanceAuth.interceptors.request.use((config) => {
  config.headers["service-key"] = "checkboost";
  return config;
});
axiosInstanceAuth.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    const { accessToken } = getTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstanceAuth.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // if (error?.response?.status === 500) {
    //   toast.error(error?.response?.data?.message, { toastId: "block-auth" });
    // }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstanceAuth(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

const setTokens = (accessToken: string, refreshToken?: string) => {
  localStorage.setItem("authTokenMuse", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshTokenMuse", refreshToken);
  }
};

export const refreshToken = async (): Promise<string | null> => {
  try {
    const { clientId,clientSecret } = getTokens();
    // if (!refreshToken) throw new Error("No refresh token available");
    
    let payload={
       client_id:clientId,
        client_secret: clientSecret,
    }
    const response = await axios.post('https://api-be.musetax.com/auth/token',payload)

    const newAccessToken = response.data.access_token;
    const newRefreshToken = '';

    if (newAccessToken) {
      setTokens(newAccessToken, newRefreshToken);
      return newAccessToken;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.clear();
    // window.location.href = "/signin";
    return null;
  }
};

// ========== Main App Axios Instance ==========
// const axiosInstance: AxiosInstance = axios.create({
//   baseURL: API_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//     "accept":"application/json"
//   },
// });

// ========== Auth Axios Instance ==========

// ========== Request Interceptor for Main API ==========
// axiosInstance.interceptors.request.use(
//   async (
//     config: InternalAxiosRequestConfig
//   ): Promise<InternalAxiosRequestConfig> => {
//     const { accessToken } = getTokens();
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// ========== Request Interceptor for Auth API ==========


// ========== Response Interceptor for Main API ==========
// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error?.response?.status === 500) {
//       toast.error(error?.response?.data?.message, { toastId: "block" });
//     }

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const newAccessToken = await refreshToken();
//       if (newAccessToken) {
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return axiosInstance(originalRequest);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// ========== Response Interceptor for Auth API ==========


// ========== Export ==========
// export default axiosInstance;
