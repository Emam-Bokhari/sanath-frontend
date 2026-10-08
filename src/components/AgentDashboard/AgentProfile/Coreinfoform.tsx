"use client";

import { AgencyProfile } from "@/types/enquiry";
import { Form, Input } from "antd";

interface Props {
    data: Pick<AgencyProfile, "agencyName" | "contactPerson" | "email" | "phone">;
    onChange: (key: keyof AgencyProfile, value: string) => void;
}

export default function CoreInfoForm({ data, onChange }: Props) {
    return (
        <div className="mb-6">
            <div className="max-w-xl">
                <div>
                    <label className="block text-[14px] font-semibold text-slate-700 mb-2">Agency Name</label>
                    <Input
                        value={data.agencyName}
                        onChange={(e) => onChange("agencyName", e.target.value)}
                        size="large"
                        className="!rounded-xl h-12"
                    />
                </div>
            </div>
        </div>
    );
}