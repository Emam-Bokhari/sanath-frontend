"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { getImage } from "@/lib/api-fech";
import Link from "next/link";
import { getPrimaryBadge, formatActivityDate } from "@/lib/badge-utils";
import PropertyBadge from "@/components/common/PropertyBadge";

interface Props {
  properties: any[];
}

export default function PropertyMap({ properties }: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
  });

  const [selectedId, setSelectedId] = useState<string | null>(
    null
  );

  const [map, setMap] = useState<any>(null);

  const searchParams = useSearchParams();

  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");

  const handleMarkerClick = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
  };

  // No properties
  if (!properties || properties.length === 0) {
    return (
      <div className="w-full h-[700px] flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <p className="text-gray-500 font-semibold text-lg">
          No properties found with coordinates.
        </p>

        <p className="text-gray-400 text-sm mt-1">
          Try widening your search area.
        </p>
      </div>
    );
  }

  // Dynamic center
  const center = useMemo(() => {
    // Search param priority
    if (latParam && lngParam) {
      return {
        lat: Number(latParam),
        lng: Number(lngParam),
      };
    }

    const validCoords = properties
      .map((property) => {
        const coords = property.location?.coordinates;

        if (!coords || coords.length < 2) {
          return null;
        }

        return {
          lat: Number(coords[1]),
          lng: Number(coords[0]),
        };
      })
      .filter(Boolean) as { lat: number; lng: number }[];

    // Fallback center
    if (validCoords.length === 0) {
      return {
        lat: 51.5074,
        lng: -0.1278,
      };
    }

    const lats = validCoords.map((c) => c.lat);
    const lngs = validCoords.map((c) => c.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    return {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2,
    };
  }, [properties, latParam, lngParam]);

  // Fit bounds dynamically
  const onLoad = useCallback(
    (mapInstance: any) => {
      setMap(mapInstance);

      // Search location priority
      if (latParam && lngParam) {
        mapInstance.setCenter({
          lat: Number(latParam),
          lng: Number(lngParam),
        });

        mapInstance.setZoom(12);
        return;
      }

      const bounds =
        new window.google.maps.LatLngBounds();

      properties.forEach((property) => {
        const coords = property.location?.coordinates;

        if (!coords || coords.length < 2) return;

        const [longitude, latitude] = coords;

        bounds.extend({
          lat: Number(latitude),
          lng: Number(longitude),
        });
      });

      mapInstance.fitBounds(bounds);

      // Optional padding
      mapInstance.panToBounds(bounds, {
        top: 80,
        right: 80,
        bottom: 80,
        left: 80,
      });
    },
    [properties, latParam, lngParam]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Selected property
  const selectedProperty = selectedId
    ? properties.find((p) => p._id === selectedId)
    : null;

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-[700px] flex items-center justify-center bg-gray-50 border border-gray-200 rounded-2xl">
        <div className="text-center text-gray-500 font-medium">
          Loading Map...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
      {/* Interactive Google Maps */}
      <div className="w-full h-[700px]">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {properties.map((property) => {
            const coords =
              property.location?.coordinates;

            if (!coords || coords.length < 2) {
              return null;
            }

            const [longitude, latitude] = coords;

            return (
              <Marker
                key={property._id}
                position={{
                  lat: Number(latitude),
                  lng: Number(longitude),
                }}
                onClick={() =>
                  handleMarkerClick(property._id)
                }
              >
                {/* {selectedId === property._id && (
                  <InfoWindow
                    position={{
                      lat: Number(latitude),
                      lng: Number(longitude),
                    }}
                    onCloseClick={() =>
                      setSelectedId(null)
                    }
                  >
                    <div className="p-1 min-w-[150px] text-gray-900">
                      <p className="font-extrabold text-[#14b8a6] text-sm">
                        £
                        {property.price?.toLocaleString() ||
                          property.askingPrice?.toLocaleString() ||
                          "POA"}4444
                      </p>

                      <p className="text-[11px] font-semibold text-gray-700 mt-0.5 truncate max-w-[180px]">
                        {property.propertyBedrooms
                          ? `${property.propertyBedrooms} bed `
                          : ""}
                        {property.propertyType ||
                          "Property"}
                      </p>
                    </div>
                  </InfoWindow>
                )} */}
              </Marker>
            );
          })}
        </GoogleMap>
      </div>

      {/* Floating Property Card */}
      {selectedProperty && (() => {
        const mapBadge = getPrimaryBadge(selectedProperty);
        const mapActivity = formatActivityDate(selectedProperty);
        const mapPhoto =
          selectedProperty?.photos && selectedProperty.photos[0]
            ? getImage(selectedProperty.photos[0])
            : selectedProperty?.threeSixtyTour
            ? getImage(selectedProperty.threeSixtyTour)
            : "/cardImg.png";

        return (
          <Link href={`/properties/${selectedProperty._id}`}>
            <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-2xl p-4 w-80 z-20 hidden lg:block border border-gray-100 transition-all duration-300">
              <div className="flex gap-3">
                <div className="w-24 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <img
                    src={mapPhoto}
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                  {mapBadge && (
                    <div className="absolute top-1 left-1">
                      <PropertyBadge badge={mapBadge} size="xs" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-xl text-[#14b8a6]">
                      £
                      {selectedProperty.price?.toLocaleString() ||
                        selectedProperty.askingPrice?.toLocaleString() ||
                        "POA"}
                    </span>

                    {selectedProperty.originalPrice &&
                      selectedProperty.originalPrice >
                        (selectedProperty.askingPrice ?? 0) && (
                        <span className="text-[11px] text-gray-400 line-through">
                          £{selectedProperty.originalPrice.toLocaleString()}
                        </span>
                      )}
                  </div>

                  <p className="font-semibold mt-1 text-sm text-gray-900 truncate">
                    {selectedProperty.propertyBedrooms
                      ? `${selectedProperty.propertyBedrooms} bed `
                      : ""}
                    {selectedProperty.propertyType || "Property"}
                  </p>

                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {selectedProperty.address ||
                      selectedProperty.location?.address ||
                      "Address unavailable"}
                  </p>

                  <p className="text-[10px] text-gray-400 mt-2 font-medium">
                    {mapActivity.text || "Selected on interactive map"}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })()}

      {/* Bottom Note */}
      <div className="absolute bottom-4 right-4 bg-white/90 text-xs text-gray-500 px-3 py-1 rounded">
        Interactive Google Map • Zoom &amp; pan
        supported
      </div>
    </div>
  );
}