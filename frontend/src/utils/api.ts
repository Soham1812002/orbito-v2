import axios, { AxiosError } from "axios";
import { showToast } from "../lib/toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/v1/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// 1. Request Interceptor: Injects Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("orbito_token") || localStorage.getItem("orbito_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Canceled Query Suppression, Token Expiry Trapping, Global Error Toasts
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    // 2a. Canceled Query Suppression
    if (error.code === "ERR_CANCELED" || axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const responseData = error.response?.data;

    // 2b. Token Expiry Trapping
    if (status === 401 && responseData?.message === "Token Expired") {
      sessionStorage.removeItem("orbito_token");
      sessionStorage.removeItem("orbito_user");
      localStorage.removeItem("orbito_token");
      localStorage.removeItem("orbito_user");
      showToast.error("Session expired. Please sign in again.");
      window.location.href = "/sign-in";
      return Promise.reject(error);
    }

    // 2c. Global Error Toasts (suppress intentional 404s if desired or display custom errors)
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
