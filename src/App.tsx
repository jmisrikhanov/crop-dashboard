import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, theme, App as AntdApp, Spin } from "antd";

import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { MainLayout } from "./components/MainLayout";
import { DashboardContent } from "./components/DashboardContent";
import { ComplexForm } from "./components/ComplexForm";

import { useAuth } from "./hooks/useAuth";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center dark:bg-black">
        <Spin size="large" />
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AppContent = () => {
  const { isDarkMode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: "#1677ff" },
      }}
    >
      <AntdApp>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardContent />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/form"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ComplexForm />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AntdApp>
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
