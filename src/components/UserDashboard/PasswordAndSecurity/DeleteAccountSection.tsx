"use client";

import { useState } from "react";
import { Modal, Button, Input, notification } from "antd";
import { ExclamationCircleOutlined, LockOutlined } from "@ant-design/icons";
import { apiFetch } from "@/lib/api-fech";
import { removeAccessTokenToCookie } from "@/services/removeTokeknFromCookie";
import { logout } from "@/services/auth.service";
import { useRouter } from "next/navigation";


export default function DeleteAccountSection() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [notificationApi, contextHolder] = notification.useNotification();
    const router = useRouter();

    const handleDelete = async () => {
        if (!password) {
            notificationApi.error({
                message: "Please enter your password to confirm deletion.",
                placement: "topRight"
            });
            return;
        }

        setLoading(true);

        try {
            const res = await apiFetch(
                "/users/profile",
                {
                    method: "DELETE",
                    body: JSON.stringify({
                        password,
                    }),
                },
                "client"
            );

            if (res) {
                notificationApi.success({
                    message: "Account deleted successfully.",
                    placement: "topRight",
                });

                // close modal only on success
                setOpen(false);
                setPassword("");

                logout();
                removeAccessTokenToCookie({
                    redirect: "/auth/login"
                });

                router.refresh();
            }
        } catch (err: any) {
            // keep modal open on error
            notificationApi.error({
                message:
                    err.message ||
                    "Failed to delete account. Please check your password.",
                placement: "topRight",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5 sm:p-6">
            {contextHolder}
            <h3 className="text-base font-bold text-red-500 mb-1">Delete Account</h3>
            <p className="text-gray-500 text-sm mb-4">
                Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
                danger
                onClick={() => {
                    setPassword("");
                    setOpen(true);
                }}
                className="!rounded-lg !border-red-400 !text-red-500 hover:!bg-red-50 font-medium"
            >
                Delete My Account
            </Button>

            <Modal
                open={open}
                onCancel={() => {
                    setOpen(false);
                    setPassword("");
                }}
                footer={null}
                centered
                className="!rounded-2xl"
            >
                <div className="text-center py-4">
                    <ExclamationCircleOutlined className="text-5xl text-red-400 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Your Account?</h3>
                    <p className="text-gray-500 text-sm mb-6">
                        This action is permanent and cannot be undone. All your data, saved searches, and enquiries will be removed.
                        Please enter your password to confirm.
                    </p>

                    <div className="mb-6 text-left max-w-[300px] mx-auto">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400 mr-1" />}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            size="large"
                            className="!rounded-lg !border-gray-300 hover:!border-red-400 focus:!border-red-400"
                        />
                    </div>

                    <div className="flex gap-3 justify-center">
                        <Button onClick={() => {
                            setOpen(false);
                            setPassword("");
                        }} className="!rounded-lg px-6">Cancel</Button>
                        <Button
                            danger
                            loading={loading}
                            onClick={handleDelete}
                            className="!rounded-lg px-6 !bg-red-500 !text-white !border-red-500 disabled:opacity-50"
                            disabled={!password}
                        >
                            Yes, Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}