"use client";

import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { apiFetch } from "@/lib/api-fech";

function getStrength(pw: string): number {
    if (!pw || pw.length === 0) return 0;
    if (pw.length < 6) return 1;
    if (pw.length < 8) return 2;
    const hasUpper = /[A-Z]/.test(pw);
    const hasNum = /\d/.test(pw);
    const hasSymbol = /[^a-zA-Z0-9]/.test(pw);
    const extras = [hasUpper, hasNum, hasSymbol].filter(Boolean).length;
    return extras >= 2 ? 4 : 3;
}

const strengthConfig = [
    { label: "", color: "bg-gray-200" },
    { label: "Weak", color: "bg-red-400" },
    { label: "Fair", color: "bg-orange-400" },
    { label: "Good", color: "bg-yellow-400" },
    { label: "Strong", color: "bg-[#14b8a6]" },
];

export default function ChangePasswordForm() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [notificationApi, contextHolder] = notification.useNotification();

    // Dynamically watch newPassword for real-time strength bar calculation
    const newPassword = Form.useWatch("newPassword", form) || "";
    const strength = getStrength(newPassword);

    const onFinish = async (values: any) => {
        console.log(values);
        setLoading(true);
        try {
            // Call change password endpoint with old and new password fields
            await apiFetch("/auth/change-password", {
                method: "POST",
                body: JSON.stringify({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                    confirmPassword: values.confirmPassword
                }),
            }, "client");

            notificationApi.success({
                message: "Password updated successfully",
                placement: "topRight",
            });
            form.resetFields();
        } catch (err: any) {
            console.error("ChangePasswordForm error:", err);
            notificationApi.error({
                message: err?.message || "Failed to update password",
                placement: "topRight",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            {contextHolder}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 animate-in fade-in duration-500">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                >
                    <Form.Item
                        label={<span className="text-[14px] font-semibold text-slate-700">Current Password</span>}
                        name="currentPassword"
                        rules={[{ required: true, message: "Please enter your current password" }]}
                    >
                        <Input.Password
                            placeholder="Enter current password"
                            className="!rounded-xl h-12 hover:border-[#1a3c6e] focus:border-[#1a3c6e] focus:shadow-none transition-all"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-[14px] font-semibold text-slate-700">New Password</span>}
                        name="newPassword"
                        rules={[
                            { required: true, message: "Please enter a new password" },
                            { min: 8, message: "Password must be at least 8 characters" }
                        ]}
                    >
                        <Input.Password
                            placeholder="Enter new password"
                            className="!rounded-xl h-12 hover:border-[#1a3c6e] focus:border-[#1a3c6e] focus:shadow-none transition-all"
                        />
                    </Form.Item>

                    {/* Strength Bar */}
                    <div className="mb-6 -mt-2">
                        <div className="flex gap-1.5 mt-1">
                            {[1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${strength >= level ? strengthConfig[strength].color : "bg-slate-100"
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-[12px] text-slate-400 mt-2 font-medium">
                            {newPassword.length === 0
                                ? "Must be at least 8 characters"
                                : `Strength: ${strengthConfig[strength].label}`}
                        </p>
                    </div>

                    <Form.Item
                        label={<span className="text-[14px] font-semibold text-slate-700">Confirm New Password</span>}
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: "Please confirm your new password" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Repeat new password"
                            className="!rounded-xl h-12 hover:border-[#1a3c6e] focus:border-[#1a3c6e] focus:shadow-none transition-all"
                        />
                    </Form.Item>

                    <div className="pt-2">
                        <Button
                            htmlType="submit"
                            type="primary"
                            loading={loading}
                            className="w-full !h-12 !rounded-xl !bg-[#1a3c6e] !border-[#1a3c6e] text-white font-bold text-base hover:!scale-[1.01] active:!scale-95 transition-all shadow-md shadow-[#1a3c6e]/20"
                        >
                            Update Password
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}