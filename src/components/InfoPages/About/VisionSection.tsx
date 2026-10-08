import Image from "next/image";

export default function VisionSection() {
    return (
        <section className=" py-16 sm:py-20 lg:py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Text */}
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
                            Our Vision
                        </h2>
                        <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                            <p>
                                We believe property discovery should be simple, transparent,
                                and accessible to everyone. Our vision is to build a trusted
                                digital platform where buyers, renters, and investors can
                                confidently explore property opportunities.
                            </p>
                            <p>
                                At the same time, we aim to provide agents with a modern
                                marketplace that helps them reach serious buyers and showcase
                                properties more effectively.
                            </p>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src="/about-img3.jpg"
                            alt="Contemporary building at night"
                            fill
                            
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}