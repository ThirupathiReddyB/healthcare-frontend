import axios from "axios";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";

// Function to get the token from sessionStorage
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Function to decode token and check if it's expiring soon
export const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp <= currentTime + 20; // 20 seconds before expiration
  } catch (error) {
    console.error("Invalid token", error);
    return false; // Assuming invalid token is not expiring soon
  }
};

// Axios instance with base URL and headers
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

// Request interceptor to add Authorization header and check token expiration
apiClient.interceptors.request.use(
  async (config) => {
    const token = getToken();
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const token = getToken();

    const originalRequest = error?.config;
    if (
      error.response &&
      error.response.status === 401 &&
      token &&
      isTokenExpiringSoon(token) &&
      !originalRequest?.sent
    ) {
      originalRequest.sent = true;
      try {
        const response = await apiClient.post(
          `/refreshToken`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const newRefreshToken = response.data.data.refreshToken;

        if (!newRefreshToken) {
          throw new Error("Failed to refresh token");
        }
        localStorage.setItem("token", newRefreshToken); // Assuming new refresh token acts as a new access token

        originalRequest.headers.Authorization = `Bearer ${newRefreshToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");

        toast.error("Session expired. Please log in again.");
        return Promise.reject(new Error("Session expired. Please log in again."));
      }
    } else if (error.response && error.response.status === 403) {
      try {
        localStorage.removeItem("token");
        window.location.href = "/";
      } catch (error) {
        console.error(error);
      }
    }

    return Promise.reject(error instanceof Error ? error : new Error(error?.message || "Unknown error occurred"));
  }
);

// Wrapper function to make API requests
export const request = ({ ...options }) => {
  return apiClient(options);
};

export default apiClient;
