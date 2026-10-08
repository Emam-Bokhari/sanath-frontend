import Image from "next/image";

export default function MissionSection() {
    return (
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Image — left on desktop */}
                    <div className="relative w-full h-64 sm:h-80 lg:h-[420px] rounded-2xl overflow-hidden shadow-lg order-2 lg:order-1">
                        <Image
                            src="/about-img2.jpg"
                            alt="Modern house exterior"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Text — right on desktop */}
                    <div className="order-1 lg:order-2">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                            Our Mission
                        </h2>
                        <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                            <p>
                                Our mission is to simplify property discovery by creating a
                                platform where users can easily explore listings, compare
                                options, and connect directly with agents.
                            </p>
                            <p>
                                We focus on building tools that make property search clear and
                                efficient. Instead of overwhelming users with complex systems,
                                we prioritize clean design, reliable information, and a smooth
                                user experience.
                            </p>
                            <p>
                                Our goal is to reduce the time and effort required to find the
                                right property.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}