import { apiClient } from "./apiClient";
import type { User, RegisterData } from "../types/";
import { STORAGE_KEYS } from "../constants";

export const authService = {
  login: async (username: string, password: string) => {
    const response = await apiClient.post("/api/auth/login/", {
      username,
      password,
    });
    return {
      access: response.data.access,
      refresh: response.data.refresh,
      user: response.data.user,
    };
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get("/api/auth/user/");
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      const refresh = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      await apiClient.post("/api/auth/logout/", { refresh });
    } catch (error) {
      throw new Error("Logout failed");
    }
  },

  refreshToken: async (refresh: string) => {
    const response = await apiClient.post("/api/auth/token/refresh/", {
      refresh,
    });
    return response.data;
  },

  register: async (values: RegisterData): Promise<void> => {
    await apiClient.post("/api/auth/signup/", values);
  },
};
