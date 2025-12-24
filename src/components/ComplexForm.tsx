import React, { useState } from "react";
import {
  App,
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Button,
  Card,
  Typography,
  Alert,
} from "antd";
import { formService } from "../services/formService";
import type { FormPayload } from "../services/formService";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export const ComplexForm: React.FC = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish = async (values: FormPayload) => {
    setLoading(true);
    setServerError(null);

    try {
      await formService.submit(values);
      message.success("Form submitted successfully!");
      form.resetFields();
      setTimeout(() => navigate("/"), 1000);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const rawData = error.response.data;
        const errorData = rawData.details || rawData;

        const keyMap: Record<string, string> = {
          full_name: "fullName",
          contact_method: "contactMethod",
          agree_terms: "agreeTerms",
        };

        const formErrors = Object.keys(errorData).map((backendKey) => {
          const frontendKey = keyMap[backendKey] || backendKey;
          return {
            name: frontendKey,
            errors: Array.isArray(errorData[backendKey])
              ? errorData[backendKey]
              : [errorData[backendKey]],
          };
        });

        form.setFields(formErrors);
        message.error("Please fix the validation errors shown below.");
      } else {
        setServerError(
          "An unexpected server error occurred. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-2xl shadow-md dark:bg-zinc-900 dark:border-zinc-800">
        <Title level={3} className="text-center mb-6 dark:text-white">
          New Entry Form
        </Title>
        {serverError && (
          <Alert message={serverError} type="error" showIcon className="mb-6" />
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ contactMethod: "email" }}
          autoComplete="off"
        >
          <Form.Item
            label={<span className="dark:text-gray-300">Full Name</span>}
            name="fullName"
            hasFeedback
            rules={[
              { required: true, message: "Please input your full name" },
              { min: 3, message: "Full name must be at least 3 characters" },
              { max: 100, message: "Full name must be at most 100 characters" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            label={<span className="dark:text-gray-300">Email</span>}
            name="email"
            hasFeedback
            rules={[
              { required: true, message: "Please input your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="john@example.com"
              type="email"
            />
          </Form.Item>

          <Form.Item
            label={<span className="dark:text-gray-300">Password</span>}
            name="password"
            hasFeedback
            rules={[
              { required: true },
              { min: 8 },
              { pattern: /[A-Z]/, message: "Uppercase required" },
              { pattern: /[a-z]/, message: "Lowercase required" },
              { pattern: /\d/, message: "Digit required" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            label={
              <span className="dark:text-gray-300">
                Preferred Contact Method
              </span>
            }
            name="contactMethod"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="email">Email Only</Option>
              <Option value="phone">Phone Only</Option>
              <Option value="both">Both</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) =>
              prev.contactMethod !== curr.contactMethod
            }
          >
            {({ getFieldValue }) => {
              const method = getFieldValue("contactMethod");
              const required = method === "phone" || method === "both";
              return (
                <Form.Item
                  label={
                    <span className="dark:text-gray-300">Phone Number</span>
                  }
                  name="phone"
                  rules={[
                    { required, message: "Phone is required" },
                    {
                      pattern: /^[0-9+\-\s()]*$/,
                      message: "Invalid phone characters",
                    },
                    {
                      min: 10,
                      message: "Phone number must be at least 10 digits",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder={
                      required ? "Required (min 10 chars)" : "Optional"
                    }
                    type="tel"
                  />
                </Form.Item>
              );
            }}
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={<span className="dark:text-gray-300">Age</span>}
              name="age"
              rules={[
                {
                  type: "number",
                  min: 1,
                  max: 150,
                  message: "Valid age required",
                },
              ]}
            >
              <InputNumber
                className="w-full"
                min={1}
                max={150}
                precision={0}
                placeholder="Age"
                changeOnWheel
                onKeyDown={(e) => {
                  if (
                    [
                      "Backspace",
                      "Tab",
                      "Enter",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowDown",
                    ].includes(e.key)
                  ) {
                    return;
                  }
                  if (!/^[0-9]$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              label={<span className="dark:text-gray-300">Country</span>}
              name="country"
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className="dark:text-gray-300">Website</span>}
            name="website"
            rules={[{ type: "url", message: "Please enter a valid URL" }]}
          >
            <Input prefix={<GlobalOutlined />} type="url" />
          </Form.Item>

          <Form.Item
            label={<span className="dark:text-gray-300">Bio</span>}
            name="bio"
            rules={[{ max: 500, message: "Bio cannot exceed 500 characters" }]}
          >
            <TextArea rows={4} showCount maxLength={500} />
          </Form.Item>

          <Form.Item
            name="agreeTerms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, val) =>
                  val ? Promise.resolve() : Promise.reject("Agree to terms"),
              },
            ]}
          >
            <Checkbox className="dark:text-gray-300">
              I agree to the Terms
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
