import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, App } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, IdcardOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import type { RegisterData } from "../types/";

const { Title, Text } = Typography;

export const SignUpPage: React.FC = () => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterData) => {
    setLoading(true);
    try {
      await authService.register(values);
      message.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const rawData = error.response.data;
        const errorData = rawData.details || rawData;

        const formErrors = Object.keys(errorData).map((field) => ({
          name: field,
          errors: Array.isArray(errorData[field])
            ? errorData[field]
            : [errorData[field]],
        }));
        form.setFields(formErrors);
        message.error("Please fix the errors below.");
      } else {
        message.error(
          "Registration failed. The API might not allow public signups."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black p-4 transition-colors">
      <Card className="w-full max-w-md shadow-lg p-6 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="text-center mb-8">
          <div className="bg-green-50 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserOutlined className="text-2xl text-green-600 dark:text-white" />
          </div>
          <Title level={3} className="!mb-1 dark:text-white">
            Create Account
          </Title>
          <Text type="secondary" className="dark:text-gray-400">
            Join Agri-Dashboard today
          </Text>
        </div>

        <Form
          form={form}
          name="signup"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          scrollToFirstError
        >
          <Form.Item
            label={<span className="dark:text-gray-300">Username</span>}
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username must be at least 3 characters' },
              { pattern: /^[\w.@+-]+$/, message: 'Letters, digits and @/./+/-/_ only.' },
              { max: 150, message: 'Username must be at most 150 characters' }
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="username"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label={<span className="dark:text-gray-300">First Name</span>}
              name="first_name"
              rules={[
                { required: true, message: "Please input your first name!" },
                { min: 2, message: "First name must be at least 2 characters" },
                { max: 30, message: "First name must be at most 30 characters" },
              ]}
            >
              <Input
                size="large"
                prefix={<IdcardOutlined />}
                placeholder="First Name"
              />
            </Form.Item>
            <Form.Item
              label={<span className="dark:text-gray-300">Last Name</span>}
              name="last_name"
              rules={[
                { required: true, message: "Please input your last name!" },
                { min: 2, message: "Last name must be at least 2 characters" },
                { max: 30, message: "Last name must be at most 30 characters" },
              ]}
            >
              <Input
                size="large"
                prefix={<IdcardOutlined />}
                placeholder="Last Name"
              />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className="dark:text-gray-300">Email</span>}
            name="email"
            rules={[{ type: "email" }, { required: true, message: 'Please input your email!' }]}
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="john@example.com"
            />
          </Form.Item>

          <Form.Item
            label={<span className="dark:text-gray-300">Password</span>}
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message: 'Password must contain uppercase, lowercase, and digit',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Create a password"
            />
          </Form.Item>

          <Form.Item
            label={<span className="dark:text-gray-300">Confirm Password</span>}
            name="password_confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Confirm password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="bg-green-600 hover:bg-green-500"
            >
              Sign Up
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text type="secondary" className="dark:text-gray-400">
              Already have an account?{" "}
            </Text>
            <Link
              to="/login"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Login here
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};
