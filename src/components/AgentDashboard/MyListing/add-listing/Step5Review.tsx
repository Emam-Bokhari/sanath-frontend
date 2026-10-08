"use client";

import { ListingFormData } from "@/types/listing";
import { Select } from "antd";

const { Option } = Select;

interface Step5Props {
    data: ListingFormData;
    onChange: (updates: Partial<ListingFormData>) => void;
}

interface ChecklistItem {
    label: string;
    isComplete: boolean;
}

function getChecklist(data: ListingFormData): ChecklistItem[] {
    return [
        {
            label: "Property Basics",
            isComplete: !!(data.title && data.price && data.city && data.streetAddress),
        },
        {
            label: "Photos & Media",
            isComplete: data.photos?.length > 0 || data.existingPhotos?.length > 0,
        },
        {
            label: "Property Information",
            isComplete: !!(data.propertyType && data.beds && data.baths),
        },
        {
            label: "Feature & Description",
            isComplete: !!(data.description && data.description.length > 10),
        },
    ];
}

export default function Step5Review({ data, onChange }: Step5Props) {
    const checklist = getChecklist(data);
    const completeCount = checklist.filter((c) => c.isComplete).length;

    return (
        <div className="space-y-5">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Listing Checklist</h3>
                    <span className="text-[#1a3c6e] font-medium text-sm">
                        {completeCount}/{checklist.length} complete
                    </span>
                </div>
                <div className="divide-y divide-gray-100">
                    {checklist.map((item) => (
                        <div key={item.label} className="flex items-center justify-between px-5 py-3">
                            <span className="text-gray-700 text-sm">{item.label}</span>
                            <span className={`text-sm font-medium ${item.isComplete ? "text-[#1a3c6e]" : "text-amber-500"}`}>
                                {item.isComplete ? "Complete" : "Missing"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}