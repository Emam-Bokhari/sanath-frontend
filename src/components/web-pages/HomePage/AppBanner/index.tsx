import Image from "next/image";
import Link from "next/link";

export default function AppBanner() {
    return (
        <section className="bg-[#F9FAFB] py-20 px-4 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12">

                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
                        <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-snug mb-4">
                            Buy, Rent, or Explore Properties Anytime
                        </h2>
                        <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                            Use the MyHome app to search properties, view high quality photos,
                            check locations, and contact agents directly. Everything you need
                            to find the right property is in one simple platform.
                        </p>

                        {/* Store Buttons */}
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            {/* Google Play */}
                            <Link
                                href="#"
                                className="flex w-full justify-center md:w-auto items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-gray-700 transition-colors duration-200"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3.18 23.76c.3.17.65.19.97.07l12.5-7.22-2.79-2.79-10.68 9.94zM.54 1.18C.2 1.54 0 2.1 0 2.82v18.36c0 .72.2 1.28.55 1.64l.09.08 10.28-10.28v-.24L.63 1.1l-.09.08zM20.3 10.37l-2.9-1.67-3.09 3.09 3.09 3.09 2.92-1.68c.83-.48.83-1.26-.02-1.83zM4.15.24L16.65 7.46l-2.79 2.79L3.18.31c.32-.13.68-.1.97.07z" />
                                </svg>
                                <div className="text-left">
                                    <p className="text-[10px] text-gray-400 leading-none uppercase tracking-wide">
                                        Get it on
                                    </p>
                                    <p className="text-sm font-semibold leading-tight">Google Play</p>
                                </div>
                            </Link>

                            {/* App Store */}
                            <Link
                                href="#"
                                className="flex w-full justify-center md:w-auto items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-gray-700 transition-colors duration-200"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                <div className="text-left">
                                    <p className="text-[10px] text-gray-400 leading-none uppercase tracking-wide">
                                        Download on the
                                    </p>
                                    <p className="text-sm font-semibold leading-tight">App Store</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Right — Real Phone Mockup Images */}
                    <div className="flex-1 flex justify-center lg:justify-end order-1 lg:order-2">
                        <div className="relative w-[320px] h-[380px] md:w-[460px] md:h-[480px] ">

                            {/* Back phone (left, rotated left) */}
                            <div className="absolute left-10 md:left-20 bottom-0 w-[160px] md:w-[220px] -rotate-20 z-10 drop-shadow-2xl">
                                <Image
                                    src="/mobile1.png"
                                    alt="MyHome App - Splash Screen"
                                    width={220}
                                    height={440}
                                    className="w-full h-auto object-contain z-20"
                                    priority
                                />
                            </div>

                            {/* Front phone (right, rotated right) */}
                            <div className="absolute right-10 md:right-0 bottom-0 w-[160px] md:w-[220px] rotate-6 drop-shadow-2xl">
                                <Image
                                    src="/mobile2.png"
                                    alt="MyHome App - Home Screen"
                                    width={220}
                                    height={440}
                                    className="w-full h-auto object-contain"
                                    priority
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}