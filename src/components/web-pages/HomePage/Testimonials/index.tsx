"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
    {
        quote: "Found my dream home in just 3 weeks. The search filters and map view made it so easy to narrow down exactly what I wanted in my budget.",
        name: "Sarah K.",
        role: "First-time buyer, London",
        initials: "SK",
    },
    {
        quote: "MyHome has transformed how I manage my listings. The enquiry dashboard is brilliant — I never miss a lead. My listings get 3x more views.",
        name: "James W.",
        role: "Estate Agent, Manchester",
        initials: "JW",
    },
    {
        quote: "Listed my property and had serious enquiries within 24 hours. The tenant screening info and direct messaging made the whole process seamless.",
        name: "Emma T.",
        role: "Landlord, Edinburgh",
        initials: "ET",
    },
    {
        quote: "The market data and area guides are incredibly useful for investment decisions. Far more detailed than other portals I've used.",
        name: "David R.",
        role: "Property Investor, Birmingham",
        initials: "DR",
    },
];

export default function Testimonials() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-[#f5a623] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                        Testimonials
                    </p>
                    <h2 className="text-gray-900 text-3xl md:text-4xl font-bold">
                        What Our Users Say
                    </h2>
                </div>

                {/* Swiper Carousel */}
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={24}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 4 },
                    }}
                    className="!pb-10"
                >
                    {testimonials.map((t, i) => (
                        <SwiperSlide key={`${t.name}-${i}`}>
                            <TestimonialCard {...t} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}