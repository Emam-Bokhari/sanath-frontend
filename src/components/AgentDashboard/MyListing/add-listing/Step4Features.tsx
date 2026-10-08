"use client";

import { FEATURES } from "@/Mockdata";
import { ListingFormData } from "@/types/listing";
import { Input } from "antd";

const { TextArea } = Input;

interface Step4Props {
    data: ListingFormData;
    onChange: (updates: Partial<ListingFormData>) => void;
}

export default function Step4Features({ data, onChange }: Step4Props) {
    const FEATURES_LIST = Object.values(FEATURES);

    const toggleFeature = (feature: string) => {
        const current = data.features || [];
        const updated = current.includes(feature)
            ? current.filter((f) => f !== feature)
            : [...current, feature];
        onChange({ features: updated });
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Property Features</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FEATURES_LIST.map((feature: string) => {
                        const isSelected = data.features?.includes(feature);
                        const label = feature.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
                        
                        return (
                            <button
                                key={feature}
                                type="button"
                                onClick={() => toggleFeature(feature)}
                                className={`px-4 py-3 text-sm rounded-xl border text-left transition-all flex items-center justify-between ${isSelected
                                    ? "border-[#1a3c6e] bg-blue-50 text-[#1a3c6e] font-bold shadow-sm"
                                    : "border-gray-100 text-gray-600 hover:border-[#1a3c6e] hover:text-[#1a3c6e] bg-white"
                                    }`}
                            >
                                <span className="truncate">{label}</span>
                                {isSelected && <span className="text-[#1a3c6e]">✓</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Detailed Description</label>
                <TextArea
                    rows={8}
                    placeholder="Provide a comprehensive description of the property, including unique selling points, recent renovations, and local area highlights..."
                    value={data.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    className="!rounded-2xl !p-4 border-gray-100 focus:border-[#1a3c6e] hover:border-gray-200 transition-all resize-none"
                />
            </div>
        </div>
    );
}