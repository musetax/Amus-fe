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
export const AUTH_API_URL_ONBOARDING = process.env.NEXT_PUBLIC_ONBOARDING_BASE_URL;
export const AUTH_API_URL_CHECKBOOST = process.env.NEXT_PUBLIC_CHECKBOOST_BASE_URL;

// ========== Token Helpers ==========
export const getTokens = () => ({
  accessToken: localStorage.getItem("authTokenMuse"),
  refreshToken: localStorage.getItem("refreshTokenMuse"),
  clientId: localStorage.getItem('clientId'),
  clientSecret: localStorage.getItem('clientSecret')
});
export const axiosInstanceAuth: AxiosInstance = axios.create({
  baseURL: AUTH_API_URL,
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

export const handleLogout = (redirectUrl?: string) => {
  localStorage.clear();
  redirectUrl = AUTH_API_URL_CHECKBOOST;
  if (typeof window !== "undefined") {
    const targetUrl = redirectUrl || "/";
    try {
      // If in an iframe, try to redirect the parent window
      if (window.top && window.top !== window) {
        window.top.location.href = targetUrl;
      } else {
        window.location.href = targetUrl;
      }
    } catch (e) {
      // Fallback if window.top is inaccessible (cross-origin)
      window.location.href = targetUrl;
    }
  }
};

export const refreshToken = async (): Promise<string | null> => {
  try {
    const { refreshToken: refreshTokenValue } = getTokens();
    if (!refreshTokenValue) {
      // No refresh token available - user needs to login again
      console.error("No refresh token available");
      handleLogout();
      return null;
    }

    // Use a separate axios instance to avoid interceptor loops
    // We need to make a direct call without going through interceptors
    const refreshAxios = axios.create({
      baseURL: AUTH_API_URL_ONBOARDING,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "service-key": "checkboost",
      },
    });

    // API expects refresh_token in the request body
    // Try the most common endpoint first: /v1/login/refresh
    let response;
    try {
      // First try with body (most common format)
      response = await refreshAxios.post(`/v1/login/refresh`, {
        refresh_token: refreshTokenValue,
      });
    } catch (firstError: any) {
      // If 404, try alternative endpoint
      if (firstError?.response?.status === 404) {
        try {
          response = await refreshAxios.post(`/v1/refresh`, {
            refresh_token: refreshTokenValue,
          });
        } catch (secondError: any) {
          // If both endpoints fail, try form-urlencoded format
          if (
            secondError?.response?.status === 400 ||
            secondError?.response?.status === 422
          ) {
            try {
              const formData = new URLSearchParams({
                refresh_token: refreshTokenValue,
              });
              response = await refreshAxios.post(`/v1/login/refresh`, formData, {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              });
              console.log(response, "33333333333333");
            } catch (formError) {
              // All formats failed, throw the original error
              throw firstError;
            }
          } else {
            throw secondError;
          }
        }
      } else {
        // For other errors, throw immediately
        throw firstError;
      }
    }

    // Handle different possible response structures
    const newAccessToken =
      response.data?.tokens?.AccessToken ||
      response.data?.data?.tokens?.AccessToken ||
      response.data?.access_token ||
      response.data?.accessToken ||
      response.data?.tokens?.access_token;

    const newRefreshToken =
      response.data?.tokens?.RefreshToken ||
      response.data?.data?.tokens?.RefreshToken ||
      response.data?.refresh_token ||
      response.data?.refreshToken ||
      response.data?.tokens?.refresh_token;

    if (newAccessToken) {
      // Successfully got new tokens - save them
      setTokens(newAccessToken, newRefreshToken);
      console.log("✅ Token refreshed successfully");
      return newAccessToken;
    } else {
      // Failed to create new token from refresh token - logout
      console.error(
        "Failed to refresh token: No access token in response",
        response.data
      );
      handleLogout();
      return null;
    }
  } catch (error: any) {
    // Check if the error is due to invalid/expired refresh token
    const status = error?.response?.status;
    const hasResponse = !!error?.response;

    // If we got a response from the server, check the status code
    if (hasResponse) {
      // 401, 403, 400, 422 typically mean invalid/expired refresh token
      // These mean we cannot create a new token from the refresh token
      if (status === 401 || status === 403 || status === 400 || status === 422) {
        // Refresh token is invalid or expired - cannot create new token, logout
        console.error(
          "❌ Cannot create new token from refresh token (status:",
          status,
          "):",
          error?.response?.data || error
        );
        handleLogout();
        return null;
      } else {
        // Other server errors (500, 502, etc.) - might be temporary
        // Try to continue, but log the error
        console.error(
          "Error refreshing token (server error, status:",
          status,
          "):",
          error
        );
        // Return null but don't logout - let the request fail naturally
        // User can retry later
        return null;
      }
    } else {
      // No response means network error or timeout
      // Don't logout on network errors - user can retry
      console.error("Error refreshing token (network error):", error);
      return null;
    }
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
