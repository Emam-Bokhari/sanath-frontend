"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Skeleton } from "antd";
import "swiper/css";
import "swiper/css/pagination";
import { apiFetch, getImage } from "@/lib/api-fech";

export interface Location {
  _id: string;
  name: string;
  totalListing: number;
  image: string;
}

function LocationCard({ location }: { location: Location }) {
  return (
    <Link
      href={`/find-properties?location=${encodeURIComponent(location.name)}`}
      className="flex flex-col items-center gap-2 group"
    >
      <div className="relative w-full h-40 sm:h-44 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
        <Image
          src={getImage(location.image)}
          alt={location.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <p className="font-semibold text-gray-900 text-sm mt-1 group-hover:text-[#1a3c6e] transition-colors">
        {location.name}
      </p>
      <p className="text-gray-400 text-xs -mt-1">
        {location.totalListing.toLocaleString()}+ Listings
      </p>
    </Link>
  );
}

export default function PopularLocations({
  popularLocations,
}: {
  popularLocations?: Location[];
}) {
  const [locations, setLocations] = useState<Location[]>(
    popularLocations || [],
  );
  const [loading, setLoading] = useState(
    !popularLocations || popularLocations.length === 0,
  );

  useEffect(() => {
    if (popularLocations && popularLocations.length > 0) {
      setLocations(popularLocations);
      setLoading(false);
      return;
    }

    const fetchLocations = async () => {
      try {
        const response = await apiFetch<any>(
          `/popular-locations`,
          {
            method: "GET",
          },
          "client",
        );
        if (response?.success && Array.isArray(response.data)) {
          setLocations(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch popular locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [popularLocations]);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#14b8a6] text-xs font-bold uppercase tracking-widest mb-2">
            Explore by Location
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Popular UK Locations
          </h2>
        </div>

        {/* Skeleton or Empty state */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton.Image active className="!w-full !h-40 !rounded-2xl" />
                <Skeleton
                  active
                  paragraph={{ rows: 1 }}
                  title={false}
                  className="w-20"
                />
              </div>
            ))}
          </div>
        ) : locations.length > 0 ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            spaceBetween={6}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 2.5, spaceBetween: 16 },
              640: { slidesPerView: 3, spaceBetween: 16 },
              900: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 20 },
              1280: { slidesPerView: 6, spaceBetween: 24 },
            }}
            className="!pb-10"
          >
            {locations.map((loc) => (
              <SwiperSlide key={loc._id}>
                <LocationCard location={loc} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center py-10 text-gray-500">
            No popular locations found at the moment.
          </div>
        )}
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #cbd5e1;
          opacity: 1;
          width: 7px;
          height: 7px;
        }
        .swiper-pagination-bullet-active {
          background: #1a3c6e;
          width: 22px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}
