import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { showToast } from "@/lib/toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "/v1/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// 1. Request Interceptor: Injects Bearer token if present (hybrid compatibility)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      sessionStorage.getItem("orbito_token") || localStorage.getItem("orbito_token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mutex & queue for concurrent 401 silent refresh handling
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const handleSessionTermination = (message = "Session expired. Please sign in again.") => {
  sessionStorage.removeItem("orbito_token");
  sessionStorage.removeItem("orbito_user");
  localStorage.removeItem("orbito_token");
  localStorage.removeItem("orbito_user");

  if (typeof window !== "undefined" && !window.location.pathname.includes("/sign-in")) {
    showToast.error(message);
    window.location.href = "/sign-in";
  }
};

// 2. Response Interceptor: Silent Refresh Mutex, Token Rotation, Canceled Query Suppression
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    // 2a. Canceled Query Suppression
    if (error.code === "ERR_CANCELED" || axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const responseData = error.response?.data;
    const isRefreshEndpoint = originalRequest?.url?.includes("/auth/refresh");
    const isLoginEndpoint = originalRequest?.url?.includes("/auth/login");

    // 2b. Refresh Token Failure Trapping: If refresh itself fails or returns 401, force logout
    if (isRefreshEndpoint && status === 401) {
      const reason = responseData?.message || "Session expired. Please sign in again.";
      handleSessionTermination(reason);
      return Promise.reject(error);
    }

    // 2c. Silent Token Refresh on 401 Token Expired
    const isTokenExpired =
      status === 401 &&
      (responseData?.code === "TOKEN_EXPIRED" || responseData?.message === "Token Expired");

    if (isTokenExpired && originalRequest && !originalRequest._retry && !isLoginEndpoint) {
      if (isRefreshing) {
        // Queue parallel requests until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call backend refresh endpoint; browser sends httpOnly orbito_refresh_token cookie
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshErr: any) {
        processQueue(refreshErr);
        const errMsg =
          refreshErr.response?.data?.message || "Session expired. Please sign in again.";
        handleSessionTermination(errMsg);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // 2d. Explicit Session Invalidation (Token not found in DB, revoked family, or missing refresh token)
    if (
      status === 401 &&
      (responseData?.code === "SESSION_NOT_FOUND" ||
        responseData?.code === "SESSION_REVOKED" ||
        responseData?.code === "TOKEN_THEFT_DETECTED" ||
        responseData?.code === "REFRESH_TOKEN_INVALID" ||
        responseData?.code === "REFRESH_TOKEN_MISSING")
    ) {
      handleSessionTermination(responseData?.message);
      return Promise.reject(error);
    }

    // 2e. Global Error Toasts (suppress mock fallback endpoints when DB/backend is offline)
    const isMockFallbackUrl =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/me") ||
      originalRequest?.url?.includes("/reports/") ||
      originalRequest?.url?.includes("/audit-logs") ||
      originalRequest?.url?.includes("/system-configs") ||
      originalRequest?.url?.includes("/app-configs") ||
      originalRequest?.url?.includes("/users") ||
      originalRequest?.url?.includes("/roles") ||
      originalRequest?.url?.includes("/poi") ||
      originalRequest?.url?.includes("/geofence") ||
      originalRequest?.url?.includes("/alerts") ||
      originalRequest?.url?.includes("/vehicles") ||
      originalRequest?.url?.includes("/maintenance") ||
      originalRequest?.url?.includes("/dispatch") ||
      originalRequest?.url?.includes("/compliance");

    if (isMockFallbackUrl) {
      return Promise.reject(error);
    }

    if (status && status >= 400 && status !== 404) {
      let message = "An unexpected error occurred";
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        message = responseData.errors.join(", ");
      } else if (responseData?.message) {
        message = responseData.message;
      } else if (responseData?.error) {
        message = responseData.error;
      }
      showToast.error(message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
