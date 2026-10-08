"use client";

import { useState } from "react";
import { Empty } from "antd";
import EnquiryItem from "./EnquiryItem";
import EnquiryDetailModal from "./EnquiryDetailModal";
import type { Enquiry } from "@/types/enquiry";


export default function EnquiryList({ enquiries }: any) {
    const [selected, setSelected] = useState<Enquiry | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleClick = (enquiry: Enquiry) => {
        setSelected(enquiry);
        setDrawerOpen(true);
    };

    if (enquiries.length === 0) {
        return <Empty description="No enquiries yet" className="py-10" />;
    }

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-6">
                {enquiries.map((item: any) => (
                    <EnquiryItem
                        key={item._id}
                        enquiry={item}
                        onClick={handleClick}
                    />
                ))}
            </div>

            <EnquiryDetailModal
                enquiry={selected}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
        </>
    );
}