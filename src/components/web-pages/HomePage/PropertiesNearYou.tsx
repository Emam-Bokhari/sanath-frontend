"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Skeleton } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PropertyCard, { type Property } from "./PropertyCard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function PropertiesNearYou({ data }: { data: any }) {

    const router = useRouter();
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.log("Geolocation error:", error.message);
                }
            );
        }
    }, []);

    useEffect(() => {
        if (coords?.lat && coords?.lng) {
            router.push(`/?lat=${coords.lat}&lng=${coords.lng}`, { scroll: false });
        }
    }, [coords, router]);

    console.log({ coords });
    return (
        <section className="bg-white py-16 sm:py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading Area */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                            Properties near you
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">Handpicked homes in your favorite neighborhoods</p>
                    </div>

                    {/* Desktop Navigation Arrows */}
                    <div className="hidden md:flex gap-3">
                        <button className="prop-prev w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#1a3c6e] hover:text-white hover:border-[#1a3c6e] transition-all shadow-sm">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="prop-next w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#1a3c6e] hover:text-white hover:border-[#1a3c6e] transition-all shadow-sm">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Loading skeletons */}

                <div className="relative -mx-4 px-4">
                    <Swiper
                        modules={[Pagination, Navigation]}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true
                        }}
                        navigation={{
                            prevEl: '.prop-prev',
                            nextEl: '.prop-next',
                        }}
                        spaceBetween={24}
                        slidesPerView={1.2}
                        breakpoints={{
                            640: { slidesPerView: 2.2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 3.2 },
                        }}
                        className="property-swiper !pb-14"
                    >
                        {data?.map((property: any) => (
                            <SwiperSlide key={property.id} className="h-auto">
                                <PropertyCard property={property} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* Swiper custom styles */}
            <style jsx global>{`
                .property-swiper .swiper-pagination {
                    bottom: 0px !important;
                }
                .property-swiper .swiper-pagination-bullet {
                    background: #cbd5e1;
                    opacity: 1;
                    width: 6px;
                    height: 6px;
                    transition: all 0.3s ease;
                }
                .property-swiper .swiper-pagination-bullet-active {
                    background: #14b8a6;
                    width: 24px;
                    border-radius: 4px;
                }
                .swiper-button-disabled {
                    opacity: 0.3;
                    cursor: not-allowed !important;
                }
            `}</style>
        </section>
    );
}