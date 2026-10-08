"use client";

import { AgencyProfile } from "@/types/enquiry";
import { Input } from "antd";

interface Props {
    data: Pick<AgencyProfile, "website" | "companyRegNumber" | "addressLine1" | "city" | "postcode" | "description">;
    onChange: (key: keyof AgencyProfile, value: string) => void;
}

export default function BusinessDetailsForm({ data, onChange }: Props) {
    return (
        <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Business Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Website</label>
                    <Input
                        value={data.website}
                        onChange={(e) => onChange("website", e.target.value)}
                        size="large"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Company Reg Number</label>
                    <Input
                        value={data.companyRegNumber}
                        onChange={(e) => onChange("companyRegNumber", e.target.value)}
                        size="large"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Office Address Line 1</label>
                    <Input
                        value={data.addressLine1}
                        onChange={(e) => onChange("addressLine1", e.target.value)}
                        size="large"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">City</label>
                    <Input
                        value={data.city}
                        onChange={(e) => onChange("city", e.target.value)}
                        size="large"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Postcode</label>
                    <Input
                        value={data.postcode}
                        onChange={(e) => onChange("postcode", e.target.value)}
                        size="large"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Agency Description</label>
                    <Input.TextArea
                        rows={4}
                        value={data.description}
                        onChange={(e) => onChange("description", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}