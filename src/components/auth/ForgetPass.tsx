"use client";

import { useState } from "react";
import { Form, Button, Input } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch } from "@/lib/api-fech";
import {notification} from "antd";
export default function ForgotPasswordForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const [notificationApi, contextHolder] = notification.useNotification();


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    payload: { email: string }
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiFetch<any>("/auth/forget-password", {
        method: "POST",
        body: JSON.stringify({ email: payload?.email }),
      }, "client");

      if (response?.success) {
        notificationApi.success({
          message: response?.message || "Reset link sent!",
        });
        router.push(`/auth/verify-otp?email=${encodeURIComponent(payload?.email ?? "")}&type=forgot`);
      } else {
        if (response?.error && Array.isArray(response.error)) {
          response.error.forEach((err: { message: string }) =>
            notificationApi.error({
              message: err.message,
            })
          );
        } else {
          notificationApi.error({
            message: response?.message || "Something went wrong!",
          });
        }
      }
    } catch (err: any) {
      console.error("ForgotPasswordForm error:", err);
      notificationApi.error({
        message: err?.message || "Unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {contextHolder}
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-40 h-40 rounded-2xl flex items-center justify-center mx-auto">
          <Image height={120} width={160} src="/logo.png" alt="logo" className="h-auto" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#1a3c6e]">Forgot Password?</h2>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-xs mx-auto">
          No worries! Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <div className="border border-blue-100 rounded-2xl p-7 shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) =>
            handleSubmit(
              new Event("submit") as unknown as React.FormEvent<HTMLFormElement>,
              values
            )
          }
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label={
              <span className="text-sm font-medium text-gray-700">Email Address</span>
            }
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="your.email@example.com"
              size="large"
              className="!rounded-lg !border-gray-200 hover:!border-[#1a3c6e] focus:!border-[#1a3c6e] !bg-gray-50/50"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            className="!bg-[#1a3c6e] !border-[#1a3c6e] !rounded-lg !font-semibold !mt-1"
          >
            Send Reset Link
          </Button>
        </Form>

        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#1a3c6e] transition-colors font-medium mt-5"
        >
          <ArrowLeftOutlined className="text-xs" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}