"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import FilterModal from "../FindProperties/FilterModal";
import { SlidersHorizontal } from "lucide-react";

type SearchTab = "SALE" | "RENT";

const tabConfig: Record<SearchTab, { label: string; placeholder: string; path: string }> = {
    SALE: { label: "Buy", placeholder: "Search homes for sale", path: "/find-properties" },
    RENT: { label: "Rent", placeholder: "Search homes for rent", path: "/find-properties" },
};

export default function HeroSection() {
    const [activeTab, setActiveTab] = useState<SearchTab>("SALE");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const router = useRouter();
    const inputRef = useRef<any>(null);

    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
        if (!apiKey) {
            console.warn("Google Maps API Key (NEXT_PUBLIC_GOOGLE_API_KEY) is missing from environment variables.");
            return;
        }

        // If the script is already loaded or is loading, hook the autocomplete directly
        if (typeof window !== "undefined" && (window as any).google?.maps?.places) {
            initAutocomplete();
            return;
        }

        const existingScript = document.getElementById("google-maps-places-script");
        if (existingScript) return;

        const script = document.createElement("script");
        script.id = "google-maps-places-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            initAutocomplete();
        };
        document.head.appendChild(script);
    }, []);

    const initAutocomplete = () => {
        const inputElement = inputRef.current?.input;
        if (!inputElement || !(window as any).google?.maps?.places) return;

        const autocomplete = new (window as any).google.maps.places.Autocomplete(inputElement, {
            types: ["geocode", "establishment"]
        });

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setCoordinates({ lat, lng });
                setQuery(place.formatted_address || place.name || "");
            } else {
                setQuery(inputElement.value);
            }
        });
    };

    const handleSearch = () => {
        const trimmed = query.trim();
        if (!trimmed) {
            router.push(`/find-properties?listingType=${activeTab}`);
            return;
        }

        const params = new URLSearchParams();
        if (coordinates) {
            params.append("lat", String(coordinates.lat));
            params.append("lng", String(coordinates.lng));
        }

        router.push(`/find-properties?listingType=${activeTab}&${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if (coordinates) {
            setCoordinates(null); // Reset coords if user types manually to fallback to plain search
        }
    };

    return (
        <section className="relative w-full h-[480px] sm:h-[580px] md:h-[580px] flex items-center justify-center overflow-hidden">
            {/* Background image */}
            <Image
                src="/property2.png"
                alt="Beautiful property"
                fill
                className="object-cover  rounded-3xl"
                priority
            />

            {/* Subtle dark veil — keeps image vibrant but text legible */}
            <div className="absolute inset-0 bg-black/40 rounded-3xl" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-6 sm:gap-8">

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-center leading-tight tracking-tight drop-shadow-lg mb-2">
                    <span className="text-white">Property </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-[#14b8a6] drop-shadow-sm">
                        Simplified
                    </span>
                </h1>

                {/* Search card */}
                <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ background: "#201e43" }}>
           

                    {/* Tabs */}
                    <div className="flex border-b border-white/10">
                        {(Object.keys(tabConfig) as SearchTab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                   flex-1 py-4 text-sm font-semibold tracking-wide transition-all cursor-pointer duration-300
                   ${activeTab === tab
                                        ? "text-white bg-white/5 border-b-2 border-[#14b8a6]"
                                        : "text-white/50 hover:text-white/80 hover:bg-white/5"
                                    }
                 `}
                            >
                                {tabConfig[tab].label}
                            </button>
                        ))}
                    </div>

                    {/* Search row */}
                    <div className="px-6 py-8 flex flex-col sm:flex-row gap-4 items-end">
                        {/* Search Container */}
                        <div className="w-full flex flex-col gap-3">
                            <span className="text-white/90 text-sm font-medium tracking-wide pl-1">
                                {tabConfig[activeTab as keyof typeof tabConfig]?.placeholder}
                            </span>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Input */}
                                <Input
                                    ref={inputRef}
                                    size="large"
                                    value={query}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search by location, postcode or area..."
                                    prefix={<SearchOutlined className="text-gray-400 mr-3 text-lg" />}
                                    suffix={
                                        <button
                                            onClick={() => setIsFilterOpen(true)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-[#1a3c6e] cursor-pointer"
                                            title="Open Filters"
                                        >
                                            <SlidersHorizontal size={18} />
                                        </button>
                                    }
                                    className="
                                        flex-1 !rounded-xl !border-0 !bg-white
                                        !text-gray-900 !placeholder-gray-400/80
                                        !h-[56px] !text-[15px] !font-medium shadow-xl !pl-6 !pr-2
                                    "
                                    allowClear
                                />

                                {/* CTA */}
                                <Button
                                    size="large"
                                    onClick={handleSearch}
                                    className="
                                        !h-[56px] !px-12 !rounded-xl !border-0
                                        !bg-[#14b8a6] hover:!bg-[#119e8e]
                                        !text-white !font-semibold !text-[15px]
                                        whitespace-nowrap shrink-0 !cursor-pointer transition-all active:scale-95 shadow-lg shadow-[#14b8a6]/20
                                    "
                                >
                                    Search Properties
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
            />

            <style dangerouslySetInnerHTML={{
                __html: `
                .pac-container {
                    background-color: white !important;
                    border-radius: 16px !important;
                    border: 1px solid rgba(0, 0, 0, 0.08) !important;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                    font-family: inherit !important;
                    margin-top: 8px !important;
                    padding: 8px 0 !important;
                    z-index: 999999 !important;
                }

                @media (max-width: 639px) {
                    .pac-container {
                        width: 92vw !important;
                        left: 4vw !important;
                        margin-top: 12px !important;
                    }
                }

                @media (min-width: 640px) {
                    .pac-container {
                        min-width: 550px !important;
                        width: auto !important;
                        left: 50% !important;
                        margin-top: 14px !important;
                        transform: translateX(-69%) !important;
                    }
                }

                .pac-item {
                    padding: 12px 18px !important;
                    font-size: 14px !important;
                    color: #4b5563 !important;
                    cursor: pointer !important;
                    border-top: 1px solid #f3f4f6 !important;
                    display: flex !important;
                    align-items: center !important;
                    transition: all 0.2s ease !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                }

                .pac-item:first-of-type {
                    border-top: none !important;
                }

                .pac-item:hover {
                    background-color: #f0fdfa !important; /* light teal */
                }

                .pac-item-query {
                    font-size: 14px !important;
                    color: #0f2d5e !important; /* deep blue */
                    font-weight: 600 !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                }

                .pac-matched {
                    color: #14b8a6 !important; /* teal */
                }

                .pac-icon {
                    margin-right: 12px !important;
                    margin-top: 0 !important;
                }
            `}} />
        </section>
    );
}