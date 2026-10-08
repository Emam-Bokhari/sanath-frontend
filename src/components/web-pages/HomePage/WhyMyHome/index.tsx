import {
    SearchOutlined,
    BellOutlined,
    SafetyCertificateOutlined,
    BarChartOutlined,
    MessageOutlined,
    MobileOutlined,
} from "@ant-design/icons";
import FeatureCard from "./FeatureCard";

const features = [
    {
        icon: <SearchOutlined />,
        title: "Powerful Search",
        description:
            "Advanced filters including price range, bedrooms, property type, radius and more. Switch between list and map views instantly.",
    },
    {
        icon: <BellOutlined />,
        title: "Instant Alerts",
        description:
            "Get notified the moment a new property matching your criteria is listed. Never miss out on your perfect home again.",
    },
    {
        icon: <SafetyCertificateOutlined />,
        title: "Trusted Agents",
        description:
            "All agents on MyHome are verified estate agents regulated by RICS, NAEA and The Property Ombudsman.",
    },
    {
        icon: <BarChartOutlined />,
        title: "Market Insights",
        description:
            "Access detailed area guides, price trends, sold prices and local data to make informed decisions.",
    },
    {
        icon: <MessageOutlined />,
        title: "Direct Contact",
        description:
            "Message agents directly from any listing. Request viewings, ask questions and get fast responses.",
    },
    {
        icon: <MobileOutlined />,
        title: "Mobile First",
        description:
            "Our app is designed for browsing on the go. Save properties, set alerts and contact agents from anywhere.",
    },
];

export default function WhyMyHome() {
    return (
        <section className="bg-[#0f2a4a] py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-[#f5a623] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                        Why MyHome
                    </p>
                    <h2 className="text-white text-3xl md:text-4xl font-bold">
                        The Smarter Way to Find Property
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}