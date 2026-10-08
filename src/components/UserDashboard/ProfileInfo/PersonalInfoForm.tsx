"use client";

import { DatePicker, Input } from "antd";
import dayjs from "dayjs";
interface Props {
    data: { fullName: string; email: string; phone: string, dateOfBirth?: Date | string };
    onChange: (field: string, value: any) => void;
}

export default function PersonalInfoForm({ data, onChange }: Props) {
    return (
        <div>
            <h3 className="text-base font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <Input
                        value={data.fullName}
                        onChange={(e) => onChange("fullName", e.target.value)}
                        className="rounded-xl h-12 bg-gray-50/50 border-gray-200 hover:border-[#0f2d5e]/50 focus:border-[#0f2d5e] focus:ring-4 focus:ring-[#0f2d5e]/10 transition-all text-base"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <Input
                        type="email"
                        value={data.email}
                        disabled
                        onChange={(e) => onChange("email", e.target.value)}
                        className="rounded-xl h-12 bg-gray-50/50 border-gray-200 hover:border-[#0f2d5e]/50 focus:border-[#0f2d5e] focus:ring-4 focus:ring-[#0f2d5e]/10 transition-all text-base"
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <Input
                        value={data.phone}
                        onChange={(e) => onChange("phone", e.target.value)}
                        className="rounded-xl h-12 bg-gray-50/50 border-gray-200 hover:border-[#0f2d5e]/50 focus:border-[#0f2d5e] focus:ring-4 focus:ring-[#0f2d5e]/10 transition-all text-base"
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                    <DatePicker
                        value={data.dateOfBirth ? dayjs(data.dateOfBirth) : null}
                        onChange={(date) => onChange("dateOfBirth", date ? date.toDate() : "")}
                        className="w-full rounded-xl h-12 bg-gray-50/50 border-gray-200 hover:border-[#0f2d5e]/50 focus:border-[#0f2d5e] focus:ring-4 focus:ring-[#0f2d5e]/10 transition-all text-base"
                    />
                </div>
            </div>
        </div>
    );
}