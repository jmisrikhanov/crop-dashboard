import { useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const { Title, Text } = Typography;

export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { username: string; password: string }) => {
        setLoading(true);
        const success = await login(values);
        setLoading(false);
        if (success) navigate("/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black transition-colors">
            <Card className="w-96 shadow-lg p-8 dark:bg-zinc-900 dark:border-zinc-800">
                <div className="text-center mb-8">
                    <div className="bg-blue-50 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LockOutlined className="text-2xl text-blue-500 dark:text-white" />
                    </div>
                    <Title level={3} className="!mb-1 dark:text-white">
                        Welcome Back
                    </Title>
                    <Text type="secondary" className="dark:text-gray-400">
                        Sign in to Agri-Dashboard
                    </Text>
                </div>
                <Form
                    name="login"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label={<span className="dark:text-gray-300">Username</span>}
                        name="username"
                        rules={[{ required: true }]}
                    >
                        <Input size="large" prefix={<UserOutlined />} placeholder="admin" />
                    </Form.Item>
                    <Form.Item
                        label={<span className="dark:text-gray-300">Password</span>}
                        name="password"
                        rules={[{ required: true }]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined />}
                            placeholder="pass"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            loading={loading}
                        >
                            Sign In
                        </Button>
                    </Form.Item>
                    <div className="text-center mt-4">
                        <Text type="secondary" className="dark:text-gray-400">
                            Don't have an account?{" "}
                        </Text>
                        <Link
                            to="/signup"
                            className="text-blue-500 hover:text-blue-400 font-medium"
                        >
                            Sign Up
                        </Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};
