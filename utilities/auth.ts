import Cookies from "js-cookie";
import { default as axios } from "axios";

export const getAccessToken = () => localStorage.getItem("authTokenMuse");
export const getRefreshToken = () => localStorage.getItem("refreshTokenMuse");

export const setTokens = (accessToken: string, refreshToken?: string) => {
  localStorage.setItem("authTokenMuse", accessToken);
  Cookies.set("authTokenMuse", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshTokenMuse", refreshToken);
    Cookies.set("refreshTokenMuse", refreshToken);
  }
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
    const rawKey = localStorage.getItem("url_type");
  // Ensure we have a string and convert to lower-case only if required
  const serviceKey = rawKey ? rawKey.toLowerCase() : "";
  try {
    const response = await axios.post(`https://dev-onboarding-api.musetax.com/v1/login/refresh`, {
      refresh_token: refreshToken,
    },{
      headers: {
        "Content-Type": "application/json",
        "Service-Key": serviceKey,   // 👈 add your service key header
      },
    }
  );

    const newAccessToken = response.data?.tokens?.AccessToken;
    const newRefreshToken = response.data?.tokens?.RefreshToken;

    if (newAccessToken) {
      setTokens(newAccessToken, newRefreshToken);
      return newAccessToken;
    }
  } catch (err) {
    localStorage.removeItem("authTokenMuse");
    localStorage.removeItem("refreshTokenMuse");
    Cookies.remove("authTokenMuse");
    Cookies.remove("refreshTokenMuse");
    window.location.href = "/login"; // force re-login
  }

  return null;
};

// Axios interceptor setup for automatic token refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
