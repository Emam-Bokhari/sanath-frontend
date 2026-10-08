import Image from "next/image";
import Link from "next/link";
import { Button } from "antd";
import {
  HomeOutlined,
  CompassOutlined,
  BankOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

const features = [
  { icon: <HomeOutlined style={{ fontSize: "20px", color: "#1a3c6e" }} />, label: "Smart Home Design" },
  { icon: <CompassOutlined style={{ fontSize: "20px", color: "#1a3c6e" }} />, label: "Beautiful Scene Around" },
  { icon: <BankOutlined style={{ fontSize: "20px", color: "#1a3c6e" }} />, label: "Exceptional Lifestyle" },
  { icon: <SafetyOutlined style={{ fontSize: "20px", color: "#1a3c6e" }} />, label: "Complete 24/7 Security" },
];

export default function MarketplaceSection() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Image collage ── */}
          <div className="relative flex justify-center items-center">
            {/* Dot grid decoration */}
            <div
              className="absolute top-0 left-0 w-36 h-36 opacity-40"
              style={{
                backgroundImage: "radial-gradient(circle, #56BDE7 4.2px, transparent 4.2px)",
                backgroundSize: "12px 12px",
              }}
            />

            {/* Small square decoration */}
            <div className="absolute bottom-6 right-4 w-3 h-3 bg-[#1a3c6e] rounded-sm" />

            {/* Main large image */}
            <div className="relative w-64 sm:w-80 h-80 sm:h-80 rounded-2xl overflow-hidden shadow-xl z-10 ml-10 mt-6">
              <Image
                src="/platImg-1.jpg"
                alt="Luxury property"
                fill
                className="object-cover"
              />
            </div>

            {/* Small overlay image bottom-left */}
            <div className="absolute bottom-0 left-0 w-36 sm:w-44 h-32 sm:h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20">
              <Image
                src="/platImg-2.jpg"
                alt="Property exterior"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* ── Right: Content ── */}
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              The Leading Real Estate{" "}
              <span className="text-gray-900">About Marketplace</span>
            </h2>

            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              MyHome is a modern property marketplace built to make property
              discovery simple and transparent. Our platform connects property
              seekers with trusted real estate agents and verified listings in
              one place.
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-2">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    {f.icon}
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{f.label}</span>
                </div>
              ))}
            </div>

            <Button
              type="primary"
              size="large"
              href="/about"
              className="!bg-[#1a3c6e] !border-[#1a3c6e] !rounded-lg !font-semibold !px-8 self-start mt-2"
            >
              Read More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}