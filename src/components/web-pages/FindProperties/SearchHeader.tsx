"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, SlidersHorizontal } from "lucide-react";
import FilterModal from "./FilterModal";
import { useRouter, useSearchParams } from "next/navigation";

export const SearchHeader = ({
  setViewMode,
}: {
  setViewMode: (tab: "list" | "map") => void;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const getListType = searchParams.get("listingType");

  const [searchIntent, setSearchIntent] = useState<"SALE" | "RENT">(
    getListType === "RENT" ? "RENT" : "SALE"
  );

  // Location states
  const [query, setQuery] = useState("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  // Sync listing type from URL
  useEffect(() => {
    setSearchIntent(getListType === "RENT" ? "RENT" : "SALE");
  }, [getListType]);

  // Google Places Autocomplete
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    if (!apiKey) {
      console.warn("Google Maps API Key missing");
      return;
    }

    const initAutocomplete = () => {
      if (
        !(window as any).google?.maps?.places ||
        !inputRef.current
      ) {
        return;
      }

      // destroy old
      if (autocompleteRef.current) {
        autocompleteRef.current = null;
      }

      const autocomplete =
        new (window as any).google.maps.places.Autocomplete(
          inputRef.current,
          {
            fields: ["formatted_address", "geometry", "name"],
            types: ["geocode"],
          }
        );

      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (!place?.geometry?.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        const address =
          place.formatted_address ||
          place.name ||
          "";

        setQuery(address);

        setCoordinates({
          lat,
          lng,
        });

        // GET LATEST PARAMS
        const currentParams = new URLSearchParams(
          window.location.search
        );

        currentParams.set("lat", String(lat));
        currentParams.set("lng", String(lng));
        currentParams.set("listingType", String(searchIntent));
        currentParams.set("sort", String("nearest"));

        // keep all existing filters
        router.push(
          `/find-properties?${currentParams.toString()}`
        );
      });
    };

    // already loaded
    if ((window as any).google?.maps?.places) {
      initAutocomplete();
      return;
    }

    // prevent duplicate script
    const existingScript = document.getElementById(
      "google-maps-script"
    );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        initAutocomplete
      );
      return;
    }

    const script = document.createElement("script");

    script.id = "google-maps-script";

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;

    script.async = true;
    script.defer = true;

    script.onload = initAutocomplete;

    document.head.appendChild(script);

    return () => {
      autocompleteRef.current = null;
    };
  }, []); // IMPORTANT
  // Change listing type
  const handleSetListType = (type: "SALE" | "RENT") => {
    setSearchIntent(type);

    const params = new URLSearchParams(
      window.location.search
    );

    params.set("listingType", type);

    router.push(`/find-properties?${params.toString()}`);
  };

  // Clear filters
  const handleClearFilters = () => {
    setQuery("");
    setCoordinates(null);

    const nextParams = new URLSearchParams();

    if (searchIntent) {
      nextParams.set("listingType", searchIntent);
    }

    router.push(
      `/find-properties?${nextParams.toString()}`
    );
  };

  // Input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;

    setQuery(val);

    // If input cleared
    if (!val.trim()) {
      setCoordinates(null);

      const nextParams = new URLSearchParams(
        window.location.search
      );

      nextParams.delete("lat");
      nextParams.delete("lng");
      nextParams.delete("location");
      nextParams.delete("q");

      router.push(
        `/find-properties?${nextParams.toString()}`
      );
    }
  };

  return (
    <div className="bg-white pt-4 pb-4 px-4 md:px-8 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Buy / Rent */}
        <div className="flex bg-gray-100/80 p-1 w-fit rounded-xl mb-5 shadow-inner">
          <button
            onClick={() => handleSetListType("SALE")}
            className={`px-8 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-all duration-300 ${searchIntent === "SALE"
              ? "bg-white text-[#1a3c6e] shadow-sm"
              : "text-gray-400 hover:text-gray-600"
              }`}
          >
            Sale
          </button>

          <button
            onClick={() => handleSetListType("RENT")}
            className={`px-8 py-2 cursor-pointer rounded-lg text-sm font-semibold transition-all duration-300 ${searchIntent === "RENT"
              ? "bg-white text-[#1a3c6e] shadow-sm"
              : "text-gray-400 hover:text-gray-600"
              }`}
          >
            Rent
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Input */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center px-5 h-[52px] group transition-all focus-within:border-[#1a3c6e] focus-within:ring-2 ring-[#1a3c6e]/5">
            <MapPin
              className="text-[#1a3c6e] mr-3 opacity-40"
              size={18}
            />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Area, station or postcode..."
              className="w-full bg-transparent border-none outline-none text-gray-900 font-medium placeholder:text-gray-400 text-sm"
            />
          </div>

          <div className="flex gap-2 items-stretch h-[52px]">
            {/* Filters */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="px-6 cursor-pointer bg-white hover:bg-gray-50 border border-gray-200 text-[#1a3c6e] rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-sm active:scale-95"
            >
              <SlidersHorizontal
                size={18}
                className="opacity-60"
              />

              <span className="text-sm">Filters</span>
            </button>

            {/* Clear */}
            <button
              onClick={handleClearFilters}
              className="px-8 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all active:scale-95 shadow-sm"
            >
              <span className="whitespace-nowrap">
                Clear Filters
              </span>
            </button>
          </div>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <style
        dangerouslySetInnerHTML={{
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

          .pac-item:hover {
              background: #f9fafb !important;
          }

          .pac-item-query {
              color: #111827 !important;
              font-size: 14px !important;
          }

          .pac-icon {
              opacity: 0.6 !important;
          }
          `,
        }}
      />
    </div>
  );
};

export default SearchHeader;