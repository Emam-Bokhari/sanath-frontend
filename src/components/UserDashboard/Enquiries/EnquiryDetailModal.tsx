"use client";

import { Modal } from "antd";
import {
    ArrowLeftOutlined,
    PhoneOutlined,
    MailOutlined,
    CheckCircleFilled,
} from "@ant-design/icons";
import Image from "next/image";
import { getImage } from "@/lib/api-fech";

interface Props {
    enquiry: any | null; // Using any for the API payload structure
    open: boolean;
    onClose: () => void;
}

export default function EnquiryDetailModal({
    enquiry,
    open,
    onClose,
}: Props) {
    if (!enquiry) return null;

    const listing = enquiry?.listingId || {};
    const imageSrc = listing.photos?.[0] ? getImage(listing.photos[0]) : "/cardImg.png";
    const propertyTitle = listing.title || "Property";
    const price = listing.askingPrice ? `£${listing.askingPrice.toLocaleString()}` : "POA";
    const sentOn = enquiry?.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : "";
    const agentInfo = enquiry?.listingId?.agentId || {};

    console.log(agentInfo);
    // Attempting to construct a readable address from the listing data
    const address = listing.location?.address || [listing.city, listing.postalCode].filter(Boolean).join(", ") || "Address unavailable";

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={700}
            closable={true}
            styles={{
                body: { padding: 0, background: "#f8fafc" },
            }}
        >
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center gap-3">
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeftOutlined className="text-gray-600 text-sm" />
                </button>
                <div>
                    <h2 className="font-bold text-gray-900 text-base">
                        Enquiry Details
                    </h2>
                    <p className="text-gray-400 text-xs">
                        Sent on {sentOn}
                    </p>
                </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
                {/* Success Banner */}
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-3">
                    <CheckCircleFilled className="text-green-500 text-lg mt-0.5 shrink-0" />
                    <div>
                        <p className="font-semibold text-green-700 text-sm">
                            Your enquiry was securely sent to the agent.
                        </p>
                        <p className="text-green-600 text-xs mt-0.5">
                            They will contact you directly via phone or email to assist
                            with your request.
                        </p>
                    </div>
                </div>

                {/* Property Card */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 items-center">
                    <div className="relative w-20 h-16 sm:w-24 sm:h-20 rounded-lg overflow-hidden shrink-0">
                        <Image
                            src={imageSrc}
                            alt={propertyTitle}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                            {propertyTitle}
                        </h3>
                        <p className="text-[#0f2d5e] font-bold text-sm mt-0.5">
                            {price}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                            {address}
                        </p>
                    </div>
                </div>

                {/* Agent + Message */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Sent To */}
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                            Sent To
                        </p>
                        <div className="flex items-start gap-3">
                            {
                                agentInfo?.profileImage ? (
                                    <img className="w-10 h-10 rounded-lg bg-[#0f2d5e] flex items-center justify-center text-white font-bold text-sm shrink-0" src={getImage(agentInfo.profileImage)} alt="" />
                                ) : (
                                    <div className="w-10 h-10 rounded-lg bg-[#0f2d5e] flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {agentInfo?.name[0]}
                                    </div>
                                )
                            }
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 text-sm">
                                    {agentInfo?.name}
                                </p>
                                <p className="text-gray-400 text-xs mb-3">
                                    Property Agency
                                </p>

                                <div className="space-y-2">
                                    {
                                        agentInfo?.phone && (
                                            <a
                                                href={`tel:${agentInfo?.phone}`}
                                                className="text-gray-600 text-xs flex items-center gap-2 hover:text-[#1a3c6e] transition-colors"
                                            >
                                                <PhoneOutlined className="text-[#1a3c6e] text-xs" />
                                                {agentInfo?.phone}
                                            </a>
                                        )
                                    }
                                    <a
                                        href={`mailto:${agentInfo?.email}`}
                                        className="text-gray-600 text-xs flex items-center gap-2 hover:text-[#1a3c6e] transition-colors"
                                    >
                                        <MailOutlined className="text-[#1a3c6e] text-xs" />
                                        {agentInfo?.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Your Message */}
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                            Your Message
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            "{enquiry.message}"
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
}