"use client";

import { useRef, useState } from "react";
import { CameraOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { getImage } from "@/lib/api-fech";

export default function ProfilePhotoUpload({ 
  profilePhoto, 
  onChange,
  title = "Profile Photo"
}: { 
  profilePhoto: string, 
  onChange?: (file: File) => void,
  title?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max file size is 5MB");
      return;
    }

    if (onChange) {
      onChange(file);
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">{title}</h3>
      <div className="flex items-center gap-6">
        <div
          className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer shadow-md group"
          onClick={() => inputRef.current?.click()}
        >
          {preview || profilePhoto ? (
            <img 
              src={preview || getImage(profilePhoto)} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#0f2d5e] to-[#255099] flex items-center justify-center text-white font-bold text-3xl">
              No Image
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <CameraOutlined className="text-white text-2xl" />
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-5 py-2.5 text-sm font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            Change Photo
          </button>
          <p className="text-gray-500 text-xs mt-2">JPG, PNG, or PNG. Max size of 5MB.</p>
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