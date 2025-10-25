import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { clearAuthAndRedirect, isAuthPage, getCurrentPathname } from "./authUtils";

const API_URL = "https://server.momenz.in";
// const API_URL = "http://localhost:5000";

const axiosApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Function to refresh the token
const refreshTokenApi = async () => {
  try {
    const response = await axiosApi.post(API_ENDPOINTS.AUTH.REFRESH, {}, { withCredentials: true });

    if (response?.data?.sessionOut) {
      await axiosApi.post(API_ENDPOINTS.AUTH.LOGOUT, {}, { withCredentials: true });

      Cookies.set(
        "toastMessage",
        JSON.stringify({
          message: "Your session has expired.",
          description: "Please try again.",
        }),
        { expires: 1 }
      );

      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
      throw new Error("Session expired, logging out.");
    }

    if (response?.data?.success) {
      return true;
    } else {
      throw new Error("Token refresh failed");
    }
  } catch (error: any) {
    // If it's a 401 error (no tokens), handle it gracefully
    if (error.response?.status === 401) {
      clearAuthAndRedirect("Session expired", "Please log in again.");
    }
    throw error;
  }
};

// Axios response interceptor to handle token refresh on 401 errors
axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't try to refresh if this IS the refresh endpoint
    const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh');
    
    // Don't try to refresh if we're already on the auth page
    const currentPath = getCurrentPathname();
    const onAuthPage = isAuthPage(currentPath);

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !error.response.sessionOut &&
      !isRefreshEndpoint &&
      !onAuthPage
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshTokenApi();
        if (newToken) {
          return axiosApi(originalRequest);
        } else {
          throw error;
        }
      } catch (refreshError) {
        console.error("Refresh Token Error:", refreshError);
        // If refresh fails, redirect to login
        clearAuthAndRedirect("Session expired", "Please log in again.");
        throw refreshError;
      }
    }

    // If this is the refresh endpoint failing, redirect to login immediately
    if (isRefreshEndpoint && error.response?.status === 401) {
      clearAuthAndRedirect("Session expired", "Please log in again.");
    }

    return Promise.reject(error);
  }
);



// Helper functions for HTTP methods
export async function get<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
  try {
    const response = await axiosApi.get<T>(url, { ...config });
    return response.data;
  } catch (error) {
    if (!axios.isAxiosError(error) || !error.response || error.response.status !== 401) {
      console.error("GET Request Error:", error);
    }
    throw error;
  }
}

export async function post<T>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> {
  try {
    const response = await axiosApi.post<T>(url, data, { ...config });
    return response.data;
  } catch (error) {
    if (!axios.isAxiosError(error) || !error.response || error.response.status !== 401) {
      console.error("POST Request Error:", error);
    }
    throw error;
  }
}

export async function put<T>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> {
  try {
    const response = await axiosApi.put<T>(url, data, { ...config });
    return response.data;
  } catch (error) {
    if (!axios.isAxiosError(error) || !error.response || error.response.status !== 401) {
      console.error("PUT Request Error:", error);
    }
    throw error;
  }
}

// New delete function (named 'del' to match your original)
export async function del<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
  try {
    const response = await axiosApi.delete<T>(url, { ...config });
    return response.data;
  } catch (error) {
    if (!axios.isAxiosError(error) || !error.response || error.response.status !== 401) {
      console.error("DELETE Request Error:", error);
    }
    throw error;
  }
}

// New patch function
export async function patch<T>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> {
  try {
    const response = await axiosApi.patch<T>(url, data, { ...config });
    return response.data;
  } catch (error) {
    if (!axios.isAxiosError(error) || !error.response || error.response.status !== 401) {
      console.error("PATCH Request Error:", error);
    }
    throw error;
  }
}

export default axiosApi;