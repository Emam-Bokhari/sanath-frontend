"use client";

import { useRef, useState } from "react";
import { CameraOutlined } from "@ant-design/icons";

import Image from "next/image";
import { toast } from "sonner";

export default function ProfilePhotoUpload() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const initials = "JS";

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Max file size is 5MB");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <p className="text-sm font-semibold text-gray-700 mb-4">Profile Photo</p>
            <div className="flex items-center gap-5">
                <div
                    className="relative w-16 h-16 rounded-full overflow-hidden cursor-pointer group"
                    onClick={() => inputRef.current?.click()}
                >
                    {preview ? (
                        <Image src={preview} alt="Avatar" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-[#0f2d5e] flex items-center justify-center text-white font-bold text-xl">
                            {initials}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <CameraOutlined className="text-white text-lg" />
                    </div>
                </div>

                <div>
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Change Photo
                    </button>
                    <p className="text-gray-400 text-xs mt-1.5">JPG, GIF or PNG. Max size of 5MB.</p>
                </div>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/gif,image/png"
                className="hidden"
                onChange={handleFile}
            />
        </div>
    );
}