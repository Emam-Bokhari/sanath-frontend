"use client";

import { ListingFormData } from "@/types/listing";
import { Input, Select } from "antd";

export const PROPERTY_TYPES = [
    { label: "Detached", value: "DETACHED" },
    { label: "Semi-Detached", value: "SEMI" },
    { label: "Terraced", value: "TERRACED" },
    { label: "Bungalow", value: "BANGLOW" },
    { label: "Flat", value: "FLAT" },
    { label: "Park Home", value: "PARK_HOME" },
];

export const TENURE_OPTIONS = ["FREEHOLD", "LEASEHOLD", "SHARE_OF_FREEHOLD"];
export const COUNCIL_TAX_BANDS = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const EPC_RATINGS = ["A", "B", "C", "D", "E", "F", "G"];
const { Option } = Select;

interface Step3Props {
    data: ListingFormData;
    onChange: (updates: Partial<ListingFormData>) => void;
}

export default function Step3Details({ data, onChange }: Step3Props) {
    return (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Property Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PROPERTY_TYPES.map((t) => (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() => onChange({ propertyType: t.value })}
                            className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                                data.propertyType === t.value
                                    ? "bg-[#1a3c6e] text-white border-[#1a3c6e] shadow-md"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3c6e] hover:text-[#1a3c6e]"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Beds</label>
                    <Input
                        size="large"
                        type="number"
                        min={0}
                        placeholder="0"
                        className="!rounded-xl h-12"
                        value={data.beds}
                        onChange={(e) => onChange({ beds: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Baths</label>
                    <Input
                        size="large"
                        type="number"
                        min={0}
                        placeholder="0"
                        className="!rounded-xl h-12"
                        value={data.baths}
                        onChange={(e) => onChange({ baths: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Sq Ft</label>
                    <Input
                        size="large"
                        type="number"
                        min={0}
                        placeholder="0"
                        className="!rounded-xl h-12"
                        value={data.sqFt}
                        onChange={(e) => onChange({ sqFt: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Tenure</label>
                    <Select
                        size="large"
                        className="w-full custom-select"
                        value={data.tenure || undefined}
                        placeholder="Select"
                        onChange={(val) => onChange({ tenure: val })}
                    >
                        {TENURE_OPTIONS.map((t) => {
                            const label = t.split('_').map(word => 
                                word.toUpperCase()
                            ).join(' ');
                            return <Option key={t} value={t}>{label}</Option>;
                        })}
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Council Tax</label>
                    <Select
                        size="large"
                        className="w-full custom-select"
                        value={data.councilTaxBand || undefined}
                        placeholder="Select"
                        onChange={(val) => onChange({ councilTaxBand: val })}
                    >
                        {COUNCIL_TAX_BANDS.map((b) => <Option key={b} value={b}>{b}</Option>)}
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">EPC</label>
                    <Select
                        size="large"
                        className="w-full custom-select"
                        value={data.epc || undefined}
                        placeholder="Select"
                        onChange={(val) => onChange({ epc: val })}
                    >
                        {EPC_RATINGS.map((r) => <Option key={r} value={r}>{r}</Option>)}
                    </Select>
                </div>
            </div>
        </div>
    );
}