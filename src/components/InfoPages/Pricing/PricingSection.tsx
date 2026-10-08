"use client";

import { useState, useMemo } from "react";
import { Segmented, Button } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { Plan } from "@/components/AgentDashboard/Subscription";

export default function PricingSection({ plansInfo }: { plansInfo: Plan[] }) {
    const [isAnnual, setIsAnnual] = useState(false);

    const plans = useMemo(() => {
        const filteredPlans = plansInfo
            .filter((p) => p.duration === (isAnnual ? "YEARLY" : "MONTHLY"))
            .sort((a, b) => a.sortOrder - b.sortOrder);

        return filteredPlans.map((p) => ({
            ...p,
            name: p.title,
            price: `${p.pricing.currency === "GBP" ? "£" : "$"}${p.pricing.amount}`,
            period: isAnnual ? "/year" : "/month",
            features: [
                p.limits.maxListings === -1
                    ? "Unlimited Active Listings"
                    : `Up to ${p.limits.maxListings} Active Listings`,
                p.features.leadAccess && "Full Lead Access",
                p.features.featuredListing && "Featured Listing Placements",
                p.features.verifiedBadge && "Verified Agent Badge",
                p.features.agentProfilePage && "Professional Profile Page",
                `Up to ${p.limits.loginLimit} Agent Logins`,
            ].filter(Boolean) as string[],
            recommended: p.tier === "STARTER" || p.tier === "PRO",
        }));
    }, [plansInfo, isAnnual]);

    return (
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                    Simple, Transparent Pricing
                </h2>
                <p className="text-gray-500 text-base mb-8">
                    No hidden fees. No setup costs. Cancel anytime.
                </p>

                {/* Toggle */}
                <Segmented
                    value={isAnnual ? "Annual" : "Monthly"}
                    onChange={(val) => setIsAnnual(val === "Annual")}
                    options={[
                        { label: "Monthly", value: "Monthly" },
                        {
                            label: (
                                <span className="flex items-center gap-1.5">
                                    Annual
                                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                        Save 20%
                                    </span>
                                </span>
                            ),
                            value: "Annual",
                        },
                    ]}
                    className="!bg-gray-100 !rounded-xl !p-1 [&_.ant-segmented-item-selected]:!bg-[#1a3c6e] [&_.ant-segmented-item-selected]:!text-white [&_.ant-segmented-item-selected]:!rounded-lg"
                />
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`relative rounded-2xl border bg-white p-6 transition-all duration-300 hover:shadow-lg flex flex-col ${plan.recommended ? "border-[#1a3c6e] shadow-md transform md:-translate-y-2 ring-1 ring-[#1a3c6e]/10" : "border-gray-200"}`}
                    >
                        {plan.recommended && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1a3c6e] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {plan.name}
                            </h3>
                            <div className="flex items-end gap-1">
                                <span className="text-4xl font-extrabold text-gray-900">
                                    {plan.price}
                                </span>
                                <span className="text-gray-500 font-medium mb-1">
                                    {plan.period}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8 flex-1">
                            {plan.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircleFilled
                                        className={`mt-0.5 ${plan.recommended ? "text-[#1a3c6e]" : "text-gray-400"}`}
                                    />
                                    <span className="text-gray-600 text-sm">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Button
                            type={plan.recommended ? "primary" : "default"}
                            block
                            size="large"
                            href={`/agent-dashboard/subscription`}
                            className={`!h-12 !font-bold !text-base !rounded-lg shadow-sm ${plan.recommended ? "!bg-[#1a3c6e] !border-[#1a3c6e] hover:!bg-[#0f2d5e]" : "hover:!border-[#1a3c6e] hover:!text-[#1a3c6e]"}`}
                        >
                            Get Started
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
}