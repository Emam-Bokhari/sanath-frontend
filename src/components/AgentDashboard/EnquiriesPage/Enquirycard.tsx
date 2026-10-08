"use client";

import { useState } from "react";
import { Button } from "antd";
import { 
  PhoneOutlined, 
  MailOutlined, 
  DownOutlined, 
  UpOutlined, 
  HomeOutlined, 
  CopyOutlined, 
  ArrowRightOutlined 
} from "@ant-design/icons";
import { toast } from "sonner";
import { Enquiry } from "@/types/enquiry";
import { formatListingPrice, getListingAddress, getListingId } from "@/types/listing";
import { getImage } from "@/lib/api-fech";
import Link from "next/link";
import moment from "moment";

interface EnquiryCardProps {
    enquiry: Enquiry;
    onMarkComplete: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function EnquiryCard({ enquiry, onMarkComplete, onDelete }: EnquiryCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Map dynamic data to design variables
    const id = enquiry._id;
    const name = enquiry.name;
    const email = enquiry.email;
    const phone = enquiry.phone;
    const property = enquiry.listingId.title;
    const propertyId = getListingId(enquiry.listingId);
    const message = enquiry.message;
    const timeAgo = moment(enquiry.createdAt).fromNow();
    const image = enquiry.listingId.photos?.[0] ? getImage(enquiry.listingId.photos[0]) : "/cardImg.png";
    const price = formatListingPrice(enquiry.listingId);
    const address = getListingAddress(enquiry.listingId);
    const status = enquiry.status === "CONTACTED" ? "completed" : "new";
    const leadDetails = `${enquiry.listingId.propertyType} • ${enquiry.postalCode}`;

    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const handleCopy = (text: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const handleCall = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.location.href = `tel:${phone}`;
    };

    const handleEmail = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.location.href = `mailto:${email}`;
    };

    return (
        <div
            className={`group overflow-hidden rounded-xl border bg-white shadow-sm transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-md ${
                isExpanded
                    ? "border-[#1a3c6e]/30 ring-1 ring-[#1a3c6e]/10"
                    : "border-gray-200 hover:border-[#1a3c6e]/25"
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Header (Always Visible) */}
            <div className={`relative p-4 sm:p-5 flex items-start justify-between ${isExpanded ? "border-b border-gray-100 bg-[#f8fafc]" : ""}`}>
                <div className="absolute left-0 top-0 h-full w-1 bg-[#1a3c6e]" />
                <div className="flex items-center gap-4 w-full pl-2">
                    <div className="w-12 h-12 rounded-full bg-[#1a3c6e]/5 text-[#1a3c6e] font-extrabold text-sm flex items-center justify-center flex-shrink-0 border border-[#1a3c6e]/10 shadow-inner">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="font-bold text-gray-950 text-[16px] leading-tight">{name}</p>
                            {status === "completed" ? (
                                <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 border border-gray-200">
                                    ✓ Contacted
                                </span>
                            ) : (
                                <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-teal-700 border border-teal-200 animate-pulse">
                                    New lead
                                </span>
                            )}
                            <span className="ml-auto text-xs text-gray-500 whitespace-nowrap hidden sm:block font-semibold bg-gray-100 px-2.5 py-1 rounded-full">{timeAgo}</span>
                        </div>
                        <div className="mb-1.5 flex items-center gap-1.5">
                            <span className="flex items-center justify-center w-5 h-5 rounded bg-[#1a3c6e]/5 text-[#1a3c6e]">
                                <HomeOutlined className="text-[10px]" />
                            </span>
                            <span className="text-[13px] font-bold text-[#1a3c6e] truncate">{property}</span>
                        </div>
                        <p className={`text-[14px] leading-5 text-gray-600 ${isExpanded ? "" : "truncate"}`}>
                            {message}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 pl-3 border-l border-gray-100 h-10 ml-2">
                    <span className="text-xs text-gray-400 whitespace-nowrap block sm:hidden font-medium">{timeAgo}</span>
                    <div className="text-gray-400 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-100 group-hover:text-[#1a3c6e] transition-colors">
                        {isExpanded ? <UpOutlined className="text-[11px]" /> : <DownOutlined className="text-[11px]" />}
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="p-4 sm:p-6 bg-white animate-in slide-in-from-top-2 duration-200">

                    {/* Contact info with copy buttons */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-5 pb-5 border-b border-gray-100">
                        <div className="text-sm flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#1a3c6e] border border-gray-100 shadow-sm">
                                    <MailOutlined />
                                </span>
                                <span className="font-semibold text-gray-900 truncate">{email}</span>
                            </div>
                            <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                className="text-gray-400 hover:!text-[#1a3c6e] flex-shrink-0"
                                onClick={(e) => handleCopy(email, e)}
                            />
                        </div>
                        <div className="text-sm flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#1a3c6e] border border-gray-100 shadow-sm">
                                    <PhoneOutlined />
                                </span>
                                <span className="font-semibold text-gray-900 truncate">{phone}</span>
                            </div>
                            <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                className="text-gray-400 hover:!text-[#1a3c6e] flex-shrink-0"
                                onClick={(e) => handleCopy(phone, e)}
                            />
                        </div>
                    </div>

                    {/* Property Card & Lead Details */}
                    <div className="mb-6">
                        {/* Property Card - Clickable Link */}
                        <Link 
                            href={`/properties/${propertyId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="group/card border border-gray-100 rounded-lg overflow-hidden bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)] flex flex-col hover:border-[#1a3c6e]/30 hover:shadow-md transition-all no-underline w-full"
                        >
                            <div className="px-3 py-1.5 bg-[#f8fafc] border-b border-gray-100 flex items-center justify-between">
                                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1.5 mb-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a3c6e]"></span>
                                    Enquired Property
                                </p>
                                <ArrowRightOutlined className="text-[9px] text-gray-400 group-hover/card:text-[#1a3c6e] group-hover/card:translate-x-0.5 transition-all" />
                            </div>
                            <div className="p-3 flex gap-4 items-center">
                                {image && (
                                    <div className="w-[80px] h-[60px] rounded-md overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                                        <img src={image} alt="Property" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="text-[15px] text-gray-900 font-bold truncate mb-0.5 leading-tight">{property}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        {price && <span className="text-[14px] text-[#1a3c6e] font-bold">{price}</span>}
                                        {address && <span className="text-[13px] text-gray-400 truncate border-l border-gray-200 pl-3">{address}</span>}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                        <div className="flex items-center gap-3">
                            <Button
                                type="primary"
                                icon={<PhoneOutlined />}
                                onClick={handleCall}
                                className="!bg-[#1a3c6e] !border-[#1a3c6e] hover:!bg-[#0f2d5e] !rounded-lg shadow-sm !h-10 !px-5 font-semibold"
                            >
                                Call Lead
                            </Button>
                            <Button
                                icon={<MailOutlined />}
                                onClick={handleEmail}
                                className="!rounded-lg !h-10 !px-5 font-semibold hover:!border-[#1a3c6e] hover:!text-[#1a3c6e]"
                            >
                                Email Lead
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            {status !== "completed" && (
                                <Button
                                    type="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMarkComplete(id);
                                    }}
                                    className="!bg-teal-600 !border-teal-600 hover:!bg-teal-700 !rounded-lg font-bold !h-10 !px-5 shadow-sm"
                                >
                                    Mark Complete
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}