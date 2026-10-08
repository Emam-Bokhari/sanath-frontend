import { Input, Select, Spin } from "antd";
import { ListingFormData } from "../../../../types/listing";
import { useJsApiLoader } from "@react-google-maps/api";
import { useState, useRef, useEffect } from "react";

interface Step1Props {
    data: ListingFormData;
    onChange: (updates: Partial<ListingFormData>) => void;
}

const libraries: ("places")[] = ["places"];

export default function Step1Basics({ data, onChange }: Step1Props) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
        libraries
    });

    const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
    const [fetching, setSubmitting] = useState(false);
    
    // Services
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
    const placesService = useRef<google.maps.places.PlacesService | null>(null);

    useEffect(() => {
        if (isLoaded && !autocompleteService.current) {
            autocompleteService.current = new google.maps.places.AutocompleteService();
            // PlacesService needs a dummy element or a map
            const dummy = document.createElement('div');
            placesService.current = new google.maps.places.PlacesService(dummy);
        }
    }, [isLoaded]);

    const handleSearch = (value: string) => {
        if (!value || !autocompleteService.current) {
            setOptions([]);
            return;
        }

        setSubmitting(true);
        autocompleteService.current.getPlacePredictions(
            { 
                input: value,
                componentRestrictions: { country: "gb" } // Restrict search to United Kingdom
            },
            (predictions, status) => {
                setSubmitting(false);
                if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                    setOptions(predictions.map(p => ({
                        label: p.description,
                        value: p.place_id
                    })));
                } else {
                    setOptions([]);
                }
            }
        );
    };

    const handleSelect = (placeId: string) => {
        if (!placesService.current) return;

        placesService.current.getDetails(
            { placeId, fields: ["address_components", "geometry", "formatted_address"] },
            (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry?.location) {
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();
                    const address = place.formatted_address || "";
                    
                    let city = "";
                    let postcode = "";
                    let country = "";
                    
                    place.address_components?.forEach(component => {
                        const types = component.types;
                        if (types.includes("locality")) {
                            city = component.long_name;
                        } else if (types.includes("postal_code")) {
                            postcode = component.long_name;
                        } else if (types.includes("country")) {
                            country = component.long_name;
                        }
                    });

                    onChange({
                        streetAddress: address,
                        city,
                        postcode,
                        country,
                        coordinates: [lat, lng]
                    });
                }
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Listing Type Toggle */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => onChange({ listingType: "for-sale" })}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${data.listingType === "for-sale"
                        ? "border-[#1a3c6e] bg-blue-50/50 shadow-sm"
                        : "border-gray-100 bg-white hover:border-gray-200"
                        }`}
                >
                    <div className="font-bold text-gray-900 text-base">For Sale</div>
                    <div className="text-sm text-gray-500 mt-0.5">Set asking price</div>
                </button>
                <button
                    type="button"
                    onClick={() => onChange({ listingType: "to-rent" })}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${data.listingType === "to-rent"
                        ? "border-[#1a3c6e] bg-blue-50/50 shadow-sm"
                        : "border-gray-100 bg-white hover:border-gray-200"
                        }`}
                >
                    <div className="font-bold text-gray-900 text-base">To Rent</div>
                    <div className="text-sm text-gray-500 mt-0.5">Set monthly rent</div>
                </button>
            </div>

            {/* Property Title */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Property Title</label>
                <Input
                    size="large"
                    placeholder="e.g. Stunning 4-bed family home with double garage"
                    className="!rounded-xl h-12"
                    value={data.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                />
            </div>

            {/* Asking Price */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                    {data.listingType === "to-rent" ? "Monthly Rent" : "Asking Price"}
                </label>
                <Input
                    size="large"
                    prefix="£"
                    placeholder="0"
                    className="!rounded-xl h-12"
                    value={data.price}
                    onChange={(e) => onChange({ price: e.target.value })}
                />
            </div>

            {/* Custom Address Search using Ant Design Select */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Search Address</label>
                <Select
                    showSearch
                    size="large"
                    placeholder="Search for an address..."
                    className="w-full !rounded-xl custom-select-address"
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={handleSearch}
                    onSelect={handleSelect}
                    notFoundContent={fetching ? <div className="flex justify-center py-2"><Spin size="small" /></div> : null}
                    options={options}
                    loading={fetching}
                    disabled={!isLoaded}
                    style={{ height: '48px' }}
                />
            </div>

            {/* Address Fields */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Postcode</label>
                    <Input
                        size="large"
                        placeholder="e.g. E1 6AN"
                        className="!rounded-xl h-12"
                        value={data.postcode}
                        onChange={(e) => onChange({ postcode: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Country</label>
                    <Input
                        size="large"
                        placeholder="United Kingdom"
                        className="!rounded-xl h-12"
                        value={data.country}
                        onChange={(e) => onChange({ country: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">City</label>
                    <Input
                        size="large"
                        placeholder="London"
                        className="!rounded-xl h-12"
                        value={data.city}
                        onChange={(e) => onChange({ city: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Full Street Address</label>
                    <Input
                        size="large"
                        placeholder="123 Street Name"
                        className="!rounded-xl h-12"
                        value={data.streetAddress}
                        onChange={(e) => onChange({ streetAddress: e.target.value })}
                    />
                </div>
            </div>

            {/* Location Preview */}
            <div className="border border-dashed border-gray-200 rounded-2xl p-4 text-sm text-gray-500 bg-gray-50/50 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    {data.city || data.postcode
                        ? <span className="font-medium text-gray-700">{`${data.streetAddress ? data.streetAddress + ", " : ""}${data.city}${data.postcode ? " " + data.postcode : ""}, ${data.country}`}</span>
                        : "Enter address to preview map location"}
                </div>
                {data.coordinates[0] !== 0 && (
                    <div className="text-[10px] text-gray-400 ml-7 uppercase tracking-wider">
                        Coordinates: {data.coordinates[0].toFixed(6)}, {data.coordinates[1].toFixed(6)}
                    </div>
                )}
            </div>
        </div>
    );
}