"use client";

import React, { useState, useEffect } from 'react';
import { Drawer, Slider, Select } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    X,
    Home,
    Building2,
    Warehouse,
    MapPin,
    Palmtree,
    BedDouble,
    PoundSterling,
    Search
} from 'lucide-react';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FilterModal = ({ isOpen, onClose }: FilterModalProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // States linked dynamically to SearchParams
    const [activeType, setActiveType] = useState<string>("DETACHED");
    const [minPrice, setMinPrice] = useState<string>("0");
    const [maxPrice, setMaxPrice] = useState<string>("any");
    const [radius, setRadius] = useState<number>(5);
    const [beds, setBeds] = useState<string>("Any");
    const [baths, setBaths] = useState<string>("Any");
    const [addedDate, setAddedDate] = useState<string>("any");
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    // Synchronize states with URL SearchParams when modal opens
    useEffect(() => {
        if (isOpen) {
            setActiveType(searchParams.get("propertyType") || "DETACHED");
            setMinPrice(searchParams.get("minPrice") || "0");
            setMaxPrice(searchParams.get("maxPrice") || "any");

            const radiusParam = searchParams.get("radiusInMiles");
            if (radiusParam) {
                setRadius(Number(radiusParam) || 40);
            } else {
                setRadius(40);
            }

            const bedsParam = searchParams.get("bedrooms");
            setBeds(bedsParam ? (bedsParam === "4" ? "4+" : bedsParam) : "Any");

            const bathsParam = searchParams.get("bathrooms");
            setBaths(bathsParam ? (bathsParam === "4" ? "4+" : bathsParam) : "Any");

            setAddedDate(searchParams.get("timeFilter") || "any");

            const featuresParam = searchParams.get("features") || "";
            setSelectedFeatures(featuresParam ? featuresParam.split(",").filter(Boolean) : []);
        }
    }, [isOpen, searchParams]);

    const propertyTypes = [
        { id: 'DETACHED', name: 'Detached', icon: <Home size={22} />, desc: 'Stand-alone' },
        { id: 'SEMI', name: 'Semi', icon: <Building2 size={22} />, desc: 'Semi-detached' },
        { id: 'TERRACED', name: 'Terraced', icon: <Warehouse size={22} />, desc: 'Row housing' },
        { id: 'BANGLOW', name: 'Bungalow', icon: <Palmtree size={22} />, desc: 'Single story' },
        { id: 'FLAT', name: 'Flat', icon: <Building2 size={22} />, desc: 'Apartment' },
        { id: 'PARK_HOME', name: 'Park Home', icon: <Warehouse size={22} />, desc: 'Mobile/Modular' }
    ];

    const dateOptions = [
        { label: 'Seven Days', value: 'sevenDays' },
        { label: 'Three Days', value: 'threeDays' },
        { label: 'Twenty Four Hours', value: 'twentyFourHours' },
        { label: 'Any', value: 'any' }
    ];

    const handleSearch = () => {
        // Start from existing search parameters to preserve listingType, lat, lng, searchTerm
        const nextParams = new URLSearchParams(searchParams.toString());

        // Update parameters based on states
        if (activeType) {
            nextParams.set("propertyType", activeType);
        } else {
            nextParams.delete("propertyType");
        }

        if (minPrice && minPrice !== "0") {
            nextParams.set("minPrice", minPrice);
        } else {
            nextParams.delete("minPrice");
        }

        if (maxPrice && maxPrice !== "any") {
            nextParams.set("maxPrice", maxPrice);
        } else {
            nextParams.delete("maxPrice");
        }

        if (beds && beds !== "Any") {
            nextParams.set("bedrooms", beds.replace("+", ""));
        } else {
            nextParams.delete("bedrooms");
        }

        if (baths && baths !== "Any") {
            nextParams.set("bathrooms", baths.replace("+", ""));
        } else {
            nextParams.delete("bathrooms");
        }

        if (selectedFeatures && selectedFeatures.length > 0) {
            nextParams.set("features", selectedFeatures.join(","));
        } else {
            nextParams.delete("features");
        }

        if (addedDate && addedDate !== "any") {
            nextParams.set("timeFilter", addedDate);
        } else {
            nextParams.delete("timeFilter");
        }

        if (radius) {
            nextParams.set("radiusInMiles", String(radius));
        } else {
            nextParams.delete("radiusInMiles");
        }

        router.push(`/find-properties?${nextParams.toString()}`);
        onClose();
    };

    const handleReset = () => {
        setActiveType("DETACHED");
        setMinPrice("0");
        setMaxPrice("any");
        setRadius(5);
        setBeds("Any");
        setBaths("Any");
        setAddedDate("any");
        setSelectedFeatures([]);
    };

    return (
        <Drawer
            open={isOpen}
            onClose={onClose}
            placement="right"
            width={500}
            closable={false}
            styles={{
                body: { padding: 0 },
                mask: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(26, 60, 110, 0.2)' }
            }}
            className="premium-filter-drawer"
        >
            {/* Drawer Content */}
            <div className="flex flex-col h-full bg-white">

                {/* Sticky Header */}
                <div className="bg-[#1a3c6e] p-6 text-white sticky top-0 z-10">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-xl font-semibold tracking-tight">Search Filters</h3>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                        >
                            <X size={18} className="text-white" />
                        </button>
                    </div>
                    <p className="text-white/60 text-[13px]">Fine-tune your property matches</p>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                    {/* Section: Type */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-lg bg-[#1a3c6e]/5 flex items-center justify-center text-[#1a3c6e]">
                                <Home size={14} />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900">Property Style</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {propertyTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setActiveType(type.id)}
                                    className={`flex flex-col items-start p-4 border-2 rounded-xl transition-all gap-1.5 text-left relative group ${activeType === type.id
                                        ? 'border-[#1a3c6e] bg-[#1a3c6e] text-white shadow-lg shadow-[#1a3c6e]/10'
                                        : 'border-gray-50 bg-gray-50/50 cursor-pointer hover:border-gray-200'
                                        }`}
                                >
                                    <div className={`${activeType === type.id ? 'text-white' : 'text-[#1a3c6e]'}`}>
                                        {type.icon}
                                    </div>
                                    <div>
                                        <div className={`text-sm font-semibold ${activeType === type.id ? 'text-white' : 'text-gray-900'}`}>{type.name}</div>
                                        <div className={`text-[11px] ${activeType === type.id ? 'text-white/70' : 'text-gray-500'}`}>{type.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Section: Financials */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-lg bg-[#1a3c6e]/5 flex items-center justify-center text-[#1a3c6e]">
                                <PoundSterling size={14} />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900">Budget</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-500 ml-1">Min Price</label>
                                <Select
                                    className="w-full h-11"
                                    value={minPrice}
                                    onChange={setMinPrice}
                                    options={[
                                        { value: '0', label: 'No Min' },
                                        { value: '50000', label: '£50k' },
                                        { value: '100000', label: '£100k' },
                                        { value: '150000', label: '£150k' },
                                        { value: '200000', label: '£200k' },
                                        { value: '250000', label: '£250k' },
                                        { value: '300000', label: '£300k' },
                                        { value: '400000', label: '£400k' },
                                        { value: '500000', label: '£500k' },
                                        { value: '750000', label: '£750k' },
                                        { value: '1000000', label: '£1M' },
                                        { value: '1500000', label: '£1.5M' },
                                        { value: '2000000', label: '£2M' },
                                        { value: '5000000', label: '£5M' },
                                    ]}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-500 ml-1">Max Price</label>
                                <Select
                                    className="w-full h-11"
                                    value={maxPrice}
                                    onChange={setMaxPrice}
                                    options={[
                                        { value: 'any', label: 'No Max' },
                                        { value: '50000', label: '£50k' },
                                        { value: '100000', label: '£100k' },
                                        { value: '150000', label: '£150k' },
                                        { value: '200000', label: '£200k' },
                                        { value: '250000', label: '£250k' },
                                        { value: '300000', label: '£300k' },
                                        { value: '400000', label: '£400k' },
                                        { value: '500000', label: '£500k' },
                                        { value: '750000', label: '£750k' },
                                        { value: '1000000', label: '£1M' },
                                        { value: '1500000', label: '£1.5M' },
                                        { value: '2000000', label: '£2M' },
                                        { value: '5000000', label: '£5M' },
                                    ]}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section: Radius */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-lg bg-[#1a3c6e]/5 flex items-center justify-center text-[#1a3c6e]">
                                <MapPin size={14} />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900">Search Radius</h4>
                        </div>
                        <div className="px-2 pt-2">
                            <Slider
                                min={0}
                                max={50}
                                value={radius}
                                onChange={setRadius}
                                marks={{
                                    0: { style: { fontSize: '10px', fontWeight: 600 }, label: 'Exact' },
                                    10: { style: { fontSize: '10px', fontWeight: 600 }, label: '10mi' },
                                    20: { style: { fontSize: '10px', fontWeight: 600 }, label: '20mi' },
                                    30: { style: { fontSize: '10px', fontWeight: 600 }, label: '30mi' },
                                    40: { style: { fontSize: '10px', fontWeight: 600 }, label: '40mi' },
                                    50: { style: { fontSize: '10px', fontWeight: 600 }, label: '50mi' },
                                }}
                                tooltip={{
                                    formatter: (val) => val === 0 ? 'Exact match' : `Within ${val} miles`,
                                    open: true
                                }}
                                className="premium-slider"
                            />
                        </div>
                    </section>

                    {/* Section: Rooms */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-lg bg-[#1a3c6e]/5 flex items-center justify-center text-[#1a3c6e]">
                                <BedDouble size={14} />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900">Rooms</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-600 ml-1">Bedrooms</label>
                                <div className="flex gap-1 p-1 bg-gray-50 rounded-lg border border-gray-100">
                                    {['Any', '1', '2', '3', '4+'].map((num) => (
                                        <button key={num} onClick={() => setBeds(num)} className={`flex-1 h-9 rounded-md font-semibold text-[11px] transition-all ${beds === num ? 'bg-white text-[#1a3c6e] shadow-sm' : 'text-gray-400 hover:text-gray-600 cursor-pointer'}`}>{num}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-600 ml-1">Bathrooms</label>
                                <div className="flex gap-1 p-1 bg-gray-50 rounded-lg border border-gray-100">
                                    {['Any', '1', '2', '3', '4'].map((num) => (
                                        <button key={num} onClick={() => setBaths(num)} className={`flex-1 h-9 rounded-md font-semibold text-[11px] transition-all ${baths === num ? 'bg-white text-[#1a3c6e] shadow-sm' : 'text-gray-400 hover:text-gray-600 cursor-pointer'}`}>{num}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Advanced */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-lg bg-[#1a3c6e]/5 flex items-center justify-center text-[#1a3c6e]">
                                <Warehouse size={14} />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900">Advanced Filters</h4>
                        </div>
                        <div className="space-y-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-600 ml-1">Listed since</label>
                                <div className="flex flex-wrap gap-1.5 p-1 bg-gray-50 rounded-lg border border-gray-100">
                                    {dateOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setAddedDate(opt.value)}
                                            className={`flex-1 min-w-[70px] h-9 cursor-pointer rounded-md font-semibold text-[11px] transition-all ${addedDate === opt.value ? 'bg-white text-[#1a3c6e] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                                <label className="text-xs font-semibold text-gray-600 ml-1">Features</label>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    className="w-full min-h-11"
                                    placeholder="Select features..."
                                    value={selectedFeatures}
                                    onChange={setSelectedFeatures}
                                    options={[
                                        { value: 'GARDEN', label: 'Garden' },
                                        { value: 'PARKING', label: 'Parking' },
                                        { value: 'SWIMMING_POOL', label: 'Swimming Pool' },
                                        { value: 'CHAIN_FEE', label: 'Chain Free' },
                                        { value: 'NEW_BUILD', label: 'New Build' },
                                        { value: 'LIFT', label: 'Lift' },
                                        { value: 'TERRACE', label: 'Terrace' },
                                        { value: 'BALCONY', label: 'Balcony' },
                                        { value: 'CONCIERGE', label: 'Concierge' },
                                        { value: 'GYM', label: 'Gym' },
                                        { value: 'ALARM_SYSTEM', label: 'Alarm System' },
                                        { value: 'DRIVEWAY', label: 'Driveway' },
                                        { value: 'OFF_STREET_PARKING', label: 'Off Street Parking' },
                                        { value: 'SOLAR_PANELS', label: 'Solar Panels' },
                                        { value: 'UNDER_FLOOR_HEATING', label: 'Under Floor Heating' },
                                        { value: 'FITTED_KITCHEN', label: 'Fitted Kitchen' },
                                    ]}
                                />
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 bg-white">
                    <div className="flex gap-3">
                        <button
                            onClick={handleReset}
                            className="flex-1 h-11 cursor-pointer rounded-lg font-semibold text-gray-500 hover:bg-gray-50 transition-all text-xs"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSearch}
                            className="flex-[2] h-11 cursor-pointer rounded-lg font-semibold bg-[#14b8a6] text-white hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2 shadow-md shadow-[#14b8a6]/10"
                        >
                            <Search size={16} />
                            <span>Search Properties</span>
                        </button>
                    </div>
                </div>

            </div>
        </Drawer>
    );
};

export default FilterModal;
