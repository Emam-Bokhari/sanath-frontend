"use client";

import React from "react";
import { Bed, Bath, Square, Home, CheckCircle2, TrendingDown } from "lucide-react";
import { formatUKDate } from "@/lib/badge-utils";

export const PropertyContent = ({ data }: { data: any }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Compute days on market dynamically from firstPublishedAt or createdAt date
  const baseDate = data?.firstPublishedAt || data?.createdAt;
  const daysOnMarketValue = baseDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date().getTime() - new Date(baseDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 15;

  const infoTable: { key: string; feature: string; value: string }[] = [
    { key: "1", feature: "Tenure", value: data?.tenure || "Freehold" },
    {
      key: "2",
      feature: "Council Tax",
      value: data?.councilTaxBand ? `Band ${data.councilTaxBand}` : "Band G",
    },
    {
      key: "3",
      feature: "EPC Rating",
      value: data?.epcEnergyRating?.label || "C",
    },
    {
      key: "4",
      feature: "Open to Offers",
      value:
        data?.openToOffers !== undefined
          ? data.status === "SOLD" || data.marketStatus === "SOLD"
            ? "No"
            : "Yes"
          : "Yes",
    },
    {
      key: "5",
      feature: "Virtual Viewings",
      value: data?.virtualViewings || "Available",
    },
  ];

  if (data?.marketStatus) {
    const readableStatus =
      data.marketStatus === "SOLD_STC"
        ? "Sold STC (Subject to Contract)"
        : data.marketStatus === "BACK_ON_MARKET"
        ? "Back on Market"
        : data.marketStatus === "RECENTLY_RELISTED"
        ? "Recently Relisted"
        : data.marketStatus === "AVAILABLE"
        ? "Available"
        : data.marketStatus === "SOLD"
        ? "Sold"
        : data.marketStatus.replace(/_/g, " ");

    infoTable.push({
      key: "marketStatus",
      feature: "Market Status",
      value: readableStatus,
    });
  }

  infoTable.push({
    key: "6",
    feature: "Listed On",
    value: baseDate
      ? new Date(baseDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "15 January 2024",
  });

  infoTable.push({
    key: "7",
    feature: "Days on Market",
    value: String(daysOnMarketValue),
  });

  if (data?.lastPriceReducedAt) {
    infoTable.push({
      key: "reducedDate",
      feature: "Price Reduced On",
      value: new Date(data.lastPriceReducedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    });
  }

  if (data?.originalPrice && data.originalPrice > (data?.askingPrice ?? 0)) {
    const diff = data.originalPrice - data.askingPrice;
    const pct = Math.round((diff / data.originalPrice) * 100);
    infoTable.push({
      key: "originalPrice",
      feature: "Original Price",
      value: `£${data.originalPrice.toLocaleString()} (Reduced by £${diff.toLocaleString()}${pct > 0 ? ` / ${pct}%` : ""})`,
    });
  }

  if (data?.relistedAt) {
    infoTable.push({
      key: "relistedAt",
      feature: "Relisted On",
      value: new Date(data.relistedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    });
  }

  if (data?.backOnMarketAt) {
    infoTable.push({
      key: "backOnMarketAt",
      feature: "Back on Market On",
      value: new Date(data.backOnMarketAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    });
  }

  const keyFeatures =
    data?.features && data.features.length > 0
      ? data.features
      : [
          "Period Features",
          "Open Plan Kitchen",
          "High Ceilings",
          "Off-Street Parking",
          "Garden",
          "Wooden Floors",
          "Wine Cellar",
          "Recently Renovated",
        ];

  const fullDescription =
    data?.description || "No description provided for this listing.";
  const epcLabel = data?.epcEnergyRating?.label || "C";
  const epcScore = data?.epcEnergyRating?.score || 70;

  return (
    <div className="space-y-10">
      {/* Property Summary Icons */}
      <div className="flex flex-wrap items-center gap-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Bed className="text-[#1E3A8A]" size={20} />
          <span>{data?.propertyBedrooms || 0} Bedrooms</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Bath className="text-[#1E3A8A]" size={20} />
          <span>{data?.propertyBathrooms || 0} Bathrooms</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Square className="text-[#1E3A8A]" size={20} />
          <span>
            {data?.propertySquareFoot
              ? `${data.propertySquareFoot.toLocaleString()} sq ft`
              : "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Home className="text-[#1E3A8A]" size={20} />
          <span className="capitalize">
            {data?.propertyType ? data.propertyType.toLowerCase() : "Property"}
          </span>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Property Description
        </h3>
        <p
          className={`text-gray-600 leading-relaxed text-sm transition-all duration-300 ${!isExpanded ? "line-clamp-3" : ""}`}
        >
          {fullDescription}
        </p>
        {fullDescription.length > 250 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#14b8a6] font-semibold text-sm mt-3 hover:underline flex items-center gap-1"
          >
            {isExpanded ? "Show less" : "Read more description"}
          </button>
        )}
      </div>

      {/* Key Features */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
          {keyFeatures.map((feature: string, idx: number) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-gray-600 text-sm"
            >
              <CheckCircle2 className="text-teal-500" size={18} />
              <span className="capitalize">
                {feature.toLowerCase().replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Property Information Table */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Property Information
        </h3>
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 divide-y divide-gray-100 shadow-sm">
          {infoTable.map((item, index) => (
            <div
              key={item.key}
              className={`flex items-center px-5 py-3 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
            >
              <div className="w-[40%] text-gray-500 font-medium text-sm">
                {item.feature}
              </div>
              <div className="w-[60%] text-gray-900 font-medium text-sm">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Reduction History if available */}
      {Array.isArray(data?.priceHistory) && data.priceHistory.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingDown className="text-amber-600" size={20} />
            Price Reduction History
          </h3>
          <div className="bg-white rounded-xl overflow-hidden border border-gray-100 divide-y divide-gray-100 shadow-sm">
            {data.priceHistory.map((h: any, idx: number) => (
              <div key={idx} className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-amber-50/30 gap-2">
                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    £{h.newPrice?.toLocaleString()}
                  </span>
                  {h.previousPrice && (
                    <span className="text-xs text-gray-400 line-through ml-2">
                      £{h.previousPrice?.toLocaleString()}
                    </span>
                  )}
                  {h.percentageReduced !== undefined && (
                    <span className="ml-2 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                      -{h.percentageReduced}%
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {h.changedAt
                    ? new Date(h.changedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Energy Performance */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Energy Performance
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          Current EPC Energy Efficiency Rating for this property is {epcLabel}{" "}
          (Score: {epcScore}).
        </p>
        <button className="text-[#14b8a6] font-semibold text-sm mb-4 hover:underline">
          Energy Report
        </button>
        <div className="border border-gray-100 rounded-lg p-5 bg-white shadow-sm">
          <div className="space-y-2">
            {[
              { label: "A", score: "92 - 100", color: "#009254", width: "40%" },
              { label: "B", score: "81 - 90", color: "#51A348", width: "50%" },
              { label: "C", score: "70 - 80", color: "#8CB93A", width: "60%" },
              { label: "D", score: "59 - 69", color: "#EEB211", width: "70%" },
              { label: "E", score: "39 - 58", color: "#E78622", width: "80%" },
              { label: "F", score: "21 - 38", color: "#E05328", width: "90%" },
              { label: "G", score: "1 - 20", color: "#D21D28", width: "100%" },
            ].map((rating) => {
              const isCurrent = epcLabel.toUpperCase() === rating.label;
              return (
                <div key={rating.label} className="flex items-center gap-2">
                  <div
                    style={{
                      backgroundColor: rating.color,
                      width: rating.width,
                    }}
                    className="text-white text-xs font-bold px-3 py-1 rounded-sm h-6 flex justify-between items-center relative"
                  >
                    <span>{rating.score}</span>
                    <span>{rating.label}</span>
                    {isCurrent && (
                      <div className="absolute -right-20 text-xs text-gray-900 font-bold bg-white border border-gray-200 px-2 py-0.5 rounded shadow-sm">
                        Current ({epcScore})
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
