"use client";

import Image from "next/image";
import { RightOutlined } from "@ant-design/icons";
import { getImage } from "@/lib/api-fech";

interface Props {
    enquiry: any; // Dynamic API payload
    onClick: (enquiry: any) => void;
}

export default function EnquiryItem({ enquiry, onClick }: Props) {
    const listing = enquiry?.listingId || {};
    const imageSrc = listing.photos?.[0] ? getImage(listing.photos[0]) : "/cardImg.png";
    const propertyTitle = listing.title || "Property";
    const price = listing.askingPrice ? `£${listing.askingPrice.toLocaleString()}` : "POA";
    const timeAgo = enquiry?.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : "";
    const sentTo = "Agent"; // Defaulting to Agent if not provided

    return (
        <div
            className={`flex flex-col sm:flex-row gap-4 py-5 cursor-pointer hover:bg-gray-50 transition-colors rounded-xl px-2 -mx-2 border-b border-gray-100 last:border-b-0`}
            onClick={() => onClick(enquiry)}
        >
            {/* Thumbnail */}
            <div className="relative w-full sm:w-36 h-40 sm:h-24 rounded-xl overflow-hidden shrink-0">
                <Image src={imageSrc} alt={propertyTitle} fill className="object-cover" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">{propertyTitle}</h3>
                    <span className="text-gray-400 text-xs shrink-0">{timeAgo}</span>
                </div>

                <p className="text-[#0f2d5e] font-bold text-sm mt-0.5">{price}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                    Sent to:{" "}
                    <span className="text-[#14b8a6] font-medium">{sentTo}</span>
                </p>

                <div className="mt-3 bg-gray-50 rounded-lg px-3 py-2 text-gray-600 text-xs border border-gray-100 line-clamp-2">
                    "{enquiry.message}"
                </div>

                <div className="flex items-center justify-between mt-2">
                    <p className="text-gray-400 text-xs">Agent will reply via email/phone</p>
                    <button className="flex items-center gap-1 text-[#0f2d5e] font-bold text-xs hover:text-[#14b8a6] transition-colors">
                        View Details <RightOutlined className="text-[10px]" />
                    </button>
                </div>
            </div>
        </div>
    );
}