import axios from "axios";
import { STORAGE_KEYS } from "../constants";

const API_URL = 'https://backendcase.infodecs.dev';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/login/")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post(
          `${API_URL}/api/auth/token/refresh/`,
          { refresh: refreshToken }
        );

        const { access, refresh } = response.data;
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
        if (refresh) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
        }

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
