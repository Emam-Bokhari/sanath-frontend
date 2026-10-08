"use client";

import Image from "next/image";
import Link from "next/link";
import { HomeOutlined, RightOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";

interface PageHeroProps {
    title: string;
    backgroundImage?: string;
}

function formatLabel(segment: string): string {
    return segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function PageHeader({
    title,
    backgroundImage = "/headerBg.jpg",
}: PageHeroProps) {
    const pathname = usePathname();

    // Build breadcrumb segments from path
    // e.g. /for-agents/pricing → ["for-agents", "pricing"]
    const segments = pathname.split("/").filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => ({
        label: formatLabel(segment),
        href: "/" + segments.slice(0, index + 1).join("/"),
        isLast: index === segments.length - 1,
    }));

    return (
        <section className="relative w-full h-48 sm:h-56 md:h-64 flex items-center justify-center overflow-hidden">
            {/* Background */}
            <Image
                src={backgroundImage}
                alt={title}
                fill
                className="object-cover object-center"
                priority
            />
            <div className="absolute inset-0 bg-[#0a1628]/60" />

            {/* Content */}
            <div className="relative z-10 text-center px-4">
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
                    {title}
                </h1>

                {/* Breadcrumb */}
                <nav className="flex items-center justify-center flex-wrap gap-1.5 text-sm text-white/70">
                    {/* Home root */}
                    <Link
                        href="/"
                        className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                        <HomeOutlined className="text-xs" />
                        Home
                    </Link>

                    {breadcrumbs.map((crumb) => (
                        <span key={crumb.href} className="flex items-center gap-1.5">
                            <RightOutlined className="text-[10px] text-white/40" />
                            {crumb.isLast ? (
                                <span className="text-white/90">{crumb.label}</span>
                            ) : (
                                <Link
                                    href={crumb.href}
                                    className="hover:text-white transition-colors"
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </span>
                    ))}
                </nav>
            </div>
        </section>
    );
}