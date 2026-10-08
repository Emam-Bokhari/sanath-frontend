import React from "react";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="flex gap-4 group">
            <div className="flex-shrink-0 w-11 h-11 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-white group-hover:bg-[#f5a623] group-hover:border-[#f5a623] transition-all duration-300">
                {icon}
            </div>
            <div>
                <h3 className="text-white font-semibold text-base mb-1">{title}</h3>
                <p className="text-blue-200/80 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    );
}