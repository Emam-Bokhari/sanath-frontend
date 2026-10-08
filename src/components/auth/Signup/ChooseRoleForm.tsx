"use client";

import { useState } from "react";
import { Button } from "antd";
import { UserOutlined, HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const roles = [
    {
        key: "user",
        icon: <UserOutlined className="text-xl" />,
        title: "Property Seeker",
        desc: "Looking to buy or rent",
    },
    {
        key: "agent",
        icon: <HomeOutlined className="text-xl" />,
        title: "Agent",
        desc: "List and manage properties",
        accent: true,
    },
];

export default function ChooseRoleForm() {
    const [selected, setSelected] = useState<string | null>(null);
    const router = useRouter();

    const handleContinue = () => {
        if (!selected) return toast.error("Please select a role", { id: "choose-role" });
        router.push(`/auth/signup?role=${selected}`);
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-extrabold text-[#1a3c6e]">Choose Role</h2>
                <p className="text-gray-500 mt-1 text-sm">How do you want to use MyHome?</p>
            </div>

            <div className="flex flex-col gap-4 mb-6">
                {roles.map((role) => (
                    <button
                        key={role.key}
                        onClick={() => setSelected(role.key)}
                        className={`flex items-center gap-4 p-4 cursor-pointer rounded-xl border-2 transition-all text-left w-full
              ${selected === role.key
                                ? "border-[#1a3c6e] bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                    >
                        <span
                            className={`w-10 h-10 rounded-full flex items-center justify-center
              ${role.accent ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-[#1a3c6e]"}`}
                        >
                            {role.icon}
                        </span>
                        <div>
                            <p className="font-semibold text-gray-800 text-sm">{role.title}</p>
                            <p className="text-gray-400 text-xs">{role.desc}</p>
                        </div>
                    </button>
                ))}
            </div>

            <Button
                type="primary"
                block
                size="large"
                onClick={handleContinue}
                className="!bg-[#1a3c6e] !border-[#1a3c6e] !rounded-lg !font-semibold"
            >
                Continue
            </Button>
        </div>
    );
}