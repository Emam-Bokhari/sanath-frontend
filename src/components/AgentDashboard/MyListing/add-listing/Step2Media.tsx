"use client";

import { useEffect, useRef, useState } from "react";
import {

    PlusOutlined,
    FileImageOutlined,
    VideoCameraOutlined,
    AppstoreOutlined,
    LinkOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { X } from "lucide-react";
import { getImage } from "@/lib/api-fech";

interface Step2Props {
    data: any;
    onChange: (updates: Partial<any>) => void;
}

// ─── Existing URL item (server images) ────────────────────────────────────────
interface ExistingItemProps {
    url: string;
    type: "image" | "video" | "document";
    onRemove: () => void;
}

function ExistingItem({ url, type, onRemove }: ExistingItemProps) {
    const filename = url.split("/").pop()?.split("?")[0] ?? "file";
    const resolvedUrl = getImage(url);

    if (type === "image") {
        return (
            <div className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 ring-2 ring-[#1a3c6e]/30">
                <Image src={resolvedUrl} alt={filename} fill className="object-cover" unoptimized />
                {/* "Existing" badge */}
                <span className="absolute top-1 left-1 bg-[#1a3c6e] text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                    Saved
                </span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-1 right-1 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                    <X className="text-lg drop-shadow" />
                </button>
            </div>
        );
    }

    if (type === "video") {
        return (
            <div className="relative group aspect-square rounded-lg overflow-hidden bg-gray-900 ring-2 ring-[#1a3c6e]/30">
                <video
                    src={resolvedUrl}
                    className="w-full h-full object-cover"
                    muted
                    onMouseOver={(e) => (e.currentTarget as HTMLVideoElement).play()}
                    onMouseOut={(e) => {
                        const v = e.currentTarget as HTMLVideoElement;
                        v.pause();
                        v.currentTime = 0;
                    }}
                />
                <span className="absolute top-1 left-1 bg-[#1a3c6e] text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium z-10">
                    Saved
                </span>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow group-hover:opacity-0 transition-opacity">
                        <span className="text-gray-800 text-xs ml-0.5">▶</span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-1 right-1 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                    <X className="text-lg drop-shadow" />
                </button>
            </div>
        );
    }

    // Document
    return (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 group">
            <div className="flex items-center gap-2 min-w-0">
                <LinkOutlined className="text-[#1a3c6e] text-base flex-shrink-0" />
                <div className="min-w-0">
                    <p className="text-sm text-gray-700 font-medium truncate">{filename}</p>
                    <p className="text-xs text-[#1a3c6e]">Saved file</p>
                </div>
            </div>
            <button
                type="button"
                onClick={onRemove}
                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 ml-2"
            >
                <X />
            </button>
        </div>
    );
}

// ─── New file preview item ─────────────────────────────────────────────────────
interface NewPreviewItemProps {
    url: string;
    name: string;
    size?: number;
    type: "image" | "video" | "document";
    onRemove: () => void;
}

function NewPreviewItem({ url, name, size, type, onRemove }: NewPreviewItemProps) {
    if (type === "image") {
        return (
            <div className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image src={url} alt={name} fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-1 right-1 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                    <X className="text-lg drop-shadow" />
                </button>
                <p className="absolute bottom-0 left-0 right-0 text-white text-[10px] px-1.5 py-1 bg-black/40 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {name}
                </p>
            </div>
        );
    }

    if (type === "video") {
        return (
            <div className="relative group aspect-square rounded-lg overflow-hidden bg-gray-900">
                <video
                    src={url}
                    className="w-full h-full object-cover"
                    muted
                    onMouseOver={(e) => (e.currentTarget as HTMLVideoElement).play()}
                    onMouseOut={(e) => {
                        const v = e.currentTarget as HTMLVideoElement;
                        v.pause();
                        v.currentTime = 0;
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow group-hover:opacity-0 transition-opacity">
                        <span className="text-gray-800 text-xs ml-0.5">▶</span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="absolute top-1 right-1 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                    <X className="text-lg drop-shadow" />
                </button>
                <p className="absolute bottom-0 left-0 right-0 text-white text-[10px] px-1.5 py-1 bg-black/50 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {name}
                </p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 group">
            <div className="flex items-center gap-2 min-w-0">
                <FileImageOutlined className="text-[#1a3c6e] text-base flex-shrink-0" />
                <div className="min-w-0">
                    <p className="text-sm text-gray-700 font-medium truncate">{name}</p>
                    {size !== undefined && (
                        <p className="text-xs text-gray-400">{(size / 1024).toFixed(0)} KB</p>
                    )}
                </div>
            </div>
            <button
                type="button"
                onClick={onRemove}
                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 ml-2"
            >
                <X />
            </button>
        </div>
    );
}

// ─── Upload Box ────────────────────────────────────────────────────────────────
interface MediaUploadBoxProps {
    label: string;
    icon: React.ReactNode;
    type: "image" | "video" | "document";
    accept?: string;
    multiple?: boolean;
    // new files
    newFiles: File[];
    onNewFilesChange: (files: File[]) => void;
    // existing URLs
    existingUrls: string[];
    onExistingUrlsChange: (urls: string[]) => void;
}

function MediaUploadBox({
    label,
    icon,
    type,
    accept = "image/*",
    multiple = true,
    newFiles,
    onNewFilesChange,
    existingUrls,
    onExistingUrlsChange,
}: MediaUploadBoxProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [newPreviews, setNewPreviews] = useState<{ file: File; url: string }[]>([]);

    // Initialize previews from newFiles prop if it changes or on mount
    useEffect(() => {
        // Create previews for files that don't have one yet
        const currentFiles = newPreviews.map(p => p.file);
        const addedFiles = newFiles.filter(f => !currentFiles.includes(f));
        
        if (addedFiles.length > 0 || newFiles.length !== newPreviews.length) {
            // Cleanup old previews
            newPreviews.forEach(p => URL.revokeObjectURL(p.url));
            
            // Create new previews
            const nextPreviews = newFiles.map(f => ({
                file: f,
                url: URL.createObjectURL(f)
            }));
            setNewPreviews(nextPreviews);
        }

        return () => {
            // We don't revoke here because it would break previews when moving between steps
            // Ideally, the parent should handle the blob URLs or we revoke only on final unmount
        };
    }, [newFiles]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const picked = Array.from(e.target.files);
        // Just update parent, useEffect will handle previews
        onNewFilesChange([...newFiles, ...picked]);
        e.target.value = "";
    };

    const removeNew = (i: number) => {
        const updated = newFiles.filter((_, idx) => idx !== i);
        onNewFilesChange(updated);
    };

    const removeExisting = (i: number) => {
        onExistingUrlsChange(existingUrls.filter((_, idx) => idx !== i));
    };

    const totalCount = existingUrls.length + newPreviews.length;
    const hasAny = totalCount > 0;
    const isGrid = type === "image" || type === "video";

    return (
        <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-[#1a3c6e] transition-colors bg-white">
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                onClick={() => inputRef.current?.click()}
            >
                <div className="flex items-center gap-2">
                    <span className="text-[#1a3c6e] text-lg">{icon}</span>
                    <span className="text-[#1a3c6e] font-semibold text-sm">{label}</span>
                    {hasAny && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {totalCount} file{totalCount !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                    className="flex items-center gap-1 text-xs text-[#1a3c6e] border border-[#1a3c6e] rounded px-2 py-1 hover:bg-blue-50 transition-colors"
                >
                    <PlusOutlined />
                    Add {type === "image" ? "Photos" : type === "video" ? "Videos" : "Files"}
                </button>
            </div>

            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange}
            />

            {/* Empty state */}
            {!hasAny && (
                <div
                    className="flex flex-col items-center justify-center py-8 px-4 cursor-pointer text-gray-400 border-t border-dashed border-gray-200"
                    onClick={() => inputRef.current?.click()}
                >
                    <span className="text-3xl mb-2 opacity-30">{icon}</span>
                    <p className="text-sm">Click to upload or drag & drop</p>
                    <p className="text-xs mt-1 text-gray-300">
                        {type === "image" ? "JPG, PNG, WEBP" : type === "video" ? "MP4, MOV, AVI" : "JPG, PNG, PDF"}
                    </p>
                </div>
            )}

            {/* Previews */}
            {hasAny && (
                <div className="px-4 pb-4 border-t border-gray-100">
                    {/* Section label when both exist */}
                    {existingUrls.length > 0 && newPreviews.length > 0 && (
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-3 mb-1">Saved</p>
                    )}

                    <div className={`grid gap-2 mt-3 ${isGrid ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1"}`}>
                        {existingUrls.map((url, i) => (
                            <ExistingItem key={`ex-${i}`} url={url} type={type} onRemove={() => removeExisting(i)} />
                        ))}
                    </div>

                    {newPreviews.length > 0 && existingUrls.length > 0 && (
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-3 mb-1">New</p>
                    )}

                    <div className={`grid gap-2 ${newPreviews.length > 0 && existingUrls.length > 0 ? "mt-1" : "mt-3"} ${isGrid ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1"}`}>
                        {newPreviews.map((p, i) => (
                            <NewPreviewItem
                                key={`new-${i}`}
                                url={p.url}
                                name={p.file.name}
                                size={p.file.size}
                                type={type}
                                onRemove={() => removeNew(i)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Step 2 export ─────────────────────────────────────────────────────────────
export default function Step2Media({ data, onChange }: Step2Props) {
    return (
        <div className="space-y-4">
            <MediaUploadBox
                label="Property Photos"
                icon={<FileImageOutlined />}
                type="image"
                accept="image/*"
                multiple
                newFiles={data.photos}
                onNewFilesChange={(files) => onChange({ photos: files })}
                existingUrls={data.existingPhotos}
                onExistingUrlsChange={(urls) => onChange({ existingPhotos: urls })}
            />
            <MediaUploadBox
                label="Property Videos"
                icon={<VideoCameraOutlined />}
                type="video"
                accept="video/*"
                multiple
                newFiles={data.videos}
                onNewFilesChange={(files) => onChange({ videos: files })}
                existingUrls={data.existingVideos}
                onExistingUrlsChange={(urls) => onChange({ existingVideos: urls })}
            />
            <MediaUploadBox
                label="Floor Plan"
                icon={<AppstoreOutlined />}
                type="document"
                accept="image/*,application/pdf"
                multiple
                newFiles={data.floorPlan}
                onNewFilesChange={(files) => onChange({ floorPlan: files })}
                existingUrls={data.existingFloorPlan}
                onExistingUrlsChange={(urls) => onChange({ existingFloorPlan: urls })}
            />
            <MediaUploadBox
                label="Brochures & Documents"
                icon={<LinkOutlined />}
                type="document"
                accept=".pdf,.doc,.docx"
                multiple
                newFiles={data.brochures}
                onNewFilesChange={(files) => onChange({ brochures: files })}
                existingUrls={data.existingBrochures}
                onExistingUrlsChange={(urls) => onChange({ existingBrochures: urls })}
            />

            <MediaUploadBox
                label="360° Virtual Tour (Video)"
                icon={<VideoCameraOutlined />}
                type="video"
                accept="video/*"
                multiple={false}
                newFiles={data.threeSixtyTour}
                onNewFilesChange={(files) => onChange({ threeSixtyTour: files })}
                existingUrls={data.existingThreeSixtyTour}
                onExistingUrlsChange={(urls) => onChange({ existingThreeSixtyTour: urls })}
            />
        </div>
    );
}