import React from "react";
import { Layout, Button, Avatar, Typography } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  PlusCircleOutlined,
  BulbOutlined,
  BulbFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";

const { Header, Content } = Layout;
const { Title } = Typography;

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white dark:bg-black border-b dark:border-zinc-800 px-4 md:px-8 flex justify-between items-center h-16 sticky top-0 z-10 transition-colors">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="bg-green-600 p-1.5 rounded text-white font-bold text-lg leading-none">
            Ag
          </div>
          <Title level={4} className="!mb-0 dark:text-white hidden md:block">
            Agri-Dashboard
          </Title>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button
            shape="circle"
            icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
            onClick={toggleTheme}
            className="dark:text-yellow-400 dark:border-gray-600"
          />
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => navigate("/form")}
          >
            <span className="hidden md:inline">New Entry</span>
          </Button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-full border border-gray-100 dark:border-gray-600">
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1677ff" }}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {user
                ? user.first_name && user.first_name !== "string"
                  ? `${user.first_name} ${user.last_name || ""}`.trim()
                  : user.username
                : "User"}
            </span>
          </div>

          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </Header>

      <Content className="p-4 md:p-8 bg-gray-50 dark:bg-black transition-colors">
        <div className="max-w-7xl mx-auto">{children}</div>
      </Content>
    </Layout>
  );
};
