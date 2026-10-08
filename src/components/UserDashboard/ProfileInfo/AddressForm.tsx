"use client";

import { Input } from "antd";

interface Props {
  data: { addressLine: string; city: string; postalCode: string; country: string };
  onChange: (field: string, value: string) => void;
}

export default function AddressForm({ data, onChange }: Props) {
  return (
    <div>
      <h3 className="text-base font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line</label>
          <Input
            value={data.addressLine}
            onChange={(e) => onChange("addressLine", e.target.value)}
            className="rounded-xl h-12 bg-gray-50/50 border-gray-200 hover:border-[#0f2d5e]/50 focus:border-[#0f2d5e] focus:ring-4 focus:ring-[#0f2d5e]/10 transition-all text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">City / Town</label>
          <Input
            value={data.city}
            onChange={(e) => onChange("city", e.target.value)}
            className="rounded-xl h-12 bg-gray-50/50 border-gray-200 hover:border-[#0f2d5e]/50 focus:border-[#0f2d5e] focus:ring-4 focus:ring-[#0f2d5e]/10 transition-all text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Postcode</label>
          <Input
            value={data.postalCode}
            onChange={(e) => onChange("postalCode", e.target.value)}
            className="rounded-xl h-12 bg-gray-50/50 border-gray-200 hover:border-[#0f2d5e]/50 focus:border-[#0f2d5e] focus:ring-4 focus:ring-[#0f2d5e]/10 transition-all text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
          <Input
            value={data.country}
            onChange={(e) => onChange("country", e.target.value)}
            className="rounded-xl h-12 bg-gray-50/50 border-gray-200 hover:border-[#0f2d5e]/50 focus:border-[#0f2d5e] focus:ring-4 focus:ring-[#0f2d5e]/10 transition-all text-base"
          />
        </div>
      </div>
    </div>
  );
}