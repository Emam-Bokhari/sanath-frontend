"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchHeader } from "./SearchHeader";
import { List, Map, Heart } from "lucide-react";
import PropertyList from "./PropertyList";
import PropertyMap from "./PropertyMap";
import { useRouter } from "next/navigation";
import { Select } from "antd";

const FindProperties = ({ data }: { data?: any }) => {
    const searchParams = useSearchParams();
    const location = searchParams.get("location") || searchParams.get("q") || "";
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const router = useRouter();

    const handleShort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", value);
        router.push(`/find-properties?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search Header */}
            <SearchHeader setViewMode={setViewMode} />

            {/* Results Control Bar (Sticky Sub-header feel) */}
            <div className="bg-white sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                        {/* Results Identity (Gestalt Principle: Proximity) */}
                        <div className="flex items-center gap-5">
                            <div className="flex flex-col border-r border-gray-200 pr-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-[#1a3c6e] leading-none">
                                        {data?.length || 0}
                                    </span>
                                    <span className="text-gray-900 font-extrabold text-lg leading-none">
                                        Properties {location ? `in ${location}` : 'Found'}
                                    </span>
                                </div>
                            </div>

                            {/* Save Search (Secondary CTA with Affordance) */}
                            {/* <button className="flex items-center gap-2 px-5 h-10 rounded-xl bg-[#1a3c6e]/5 text-[#1a3c6e] hover:bg-[#1a3c6e] hover:text-white transition-all text-xs font-bold active:scale-95 group">
                                <Heart size={14} className="group-hover:fill-white transition-all" />
                                <span>Save this search</span>
                            </button> */}
                        </div>

                        {/* Display Controls (Utility Hierarchy) */}
                        <div className="flex items-center gap-3">
                            {/* Sort (Fitts Law: Target Size) */}
                            <div className="flex-1 md:flex-none">
                                <Select
                                    value={searchParams.get("sort") || "newest"}
                                    onChange={handleShort}
                                    className="min-w-[180px] h-11 text-xs font-bold"
                                    options={[
                                        { value: 'newest', label: 'Sort by: Newest First' },
                                        { value: 'oldest', label: 'Sort by: Oldest First' },
                                        { value: 'price_low_high', label: 'Price: Low to High' },
                                        { value: 'price_high_low', label: 'Price: High to Low' },
                                        { value: 'nearest', label: 'Nearest First' }
                                    ]}
                                />
                            </div>

                            {/* View Switcher (SaaS Premium Toggle) */}
                            <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`flex items-center gap-2 cursor-pointer px-5 h-9 rounded-lg text-xs font-bold transition-all duration-300
                                        ${viewMode === "list"
                                            ? "bg-white text-[#1a3c6e] shadow-md shadow-gray-200"
                                            : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    <List size={14} />
                                    <span>List</span>
                                </button>
                                <button
                                    onClick={() => setViewMode("map")}
                                    className={`flex items-center gap-2 px-5 h-9 rounded-lg text-xs font-bold transition-all duration-300
                                        ${viewMode === "map"
                                            ? "bg-white text-[#1a3c6e] shadow-md shadow-gray-200"
                                            : "text-gray-400 hover:text-gray-600 cursor-pointer"
                                        }`}
                                >
                                    <Map size={14} />
                                    <span>Map</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

                {/* Conditional Rendering */}
                {viewMode === "list" ? (
                    <PropertyList properties={data} />
                ) : (
                    <PropertyMap properties={data} />
                )}
            </div>
        </div>
    );
};

export default FindProperties;