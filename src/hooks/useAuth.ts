import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { STORAGE_KEYS } from "../constants";
import type { User } from "../types/";
import { App } from "antd";

export const useAuth = () => {
  const { message } = App.useApp();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (values: { username: string; password: string }) => {
    try {
      const response = await authService.login(
        values.username,
        values.password
      );
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh);

      setUser(response.user);

      message.success("Login successful!");
      return true;
    } catch (error: any) {
      const data = error.response?.data;
      const msg =
        data?.details?.message ||
        data?.error ||
        data?.detail ||
        "Login failed.";
      message.error(msg);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      setUser(null);
      message.info("Logged out successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during logout';
      message.warning(errorMessage);
    }
  };

  return { user, isAuthenticated: !!user, isLoading: loading, login, logout };
};
