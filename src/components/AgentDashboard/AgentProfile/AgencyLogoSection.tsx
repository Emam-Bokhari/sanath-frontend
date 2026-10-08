"use client";

import { useRef } from "react";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface Props {
    initials: string;
    onLogoChange?: (file: File) => void;
}

export default function AgencyLogoSection({ initials, onLogoChange }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onLogoChange) onLogoChange(file);
    };

    return (
        <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Agency Logo</h2>
            <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-md bg-teal-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {initials}
                </div>
                <div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        className="hidden"
                        onChange={handleChange}
                    />
                    <Button
                        icon={<UploadOutlined />}
                        onClick={() => fileRef.current?.click()}
                        className="mb-1"
                    >
                        Upload New Logo
                    </Button>
                    <p className="text-xs text-gray-400 mt-1">
                        Recommended size: 400x400px (JPG or PNG).
                    </p>
                </div>
            </div>
        </div>
    );
}