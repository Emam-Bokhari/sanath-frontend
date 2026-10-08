"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { CameraOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Bed, Bath, Home, Heart, Building2 } from "lucide-react";
import { notification } from "antd";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { apiFetch, getImage } from "@/lib/api-fech";
import { isUserLoggedIn } from "@/services/auth.service";
import {
  getPrimaryBadge,
  formatActivityDate,
  formatUKDate,
  PropertyBadgeItem,
} from "@/lib/badge-utils";
import PropertyBadge from "@/components/common/PropertyBadge";

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  DETACHED: "Detached",
  SEMI: "Semi-Detached",
  TERRACED: "Terraced",
  BANGLOW: "Bungalow",
  FLAT: "Flat",
  PARK_HOME: "Park Home",
};

const PLACEHOLDER_IMAGE = "/cardImg.png";

export interface Property {
  id: string;
  _id: string;
  images: string[];
  price: number;
  featured: boolean;
  address: string;
  agentLogo?: string;
  addedOn: string;
  isFeatured: boolean;
  isFavorite?: boolean;
  leadsCount: number;
  leads: string[];
  title: string;
  listingType: string;
  askingPrice: number;
  originalPrice?: number;
  previousPrice?: number;
  priceHistory?: any[];
  country: string;
  city: string;
  postalCode: string;
  marketStatus?: string;
  badges?: PropertyBadgeItem[];
  primaryBadge?: PropertyBadgeItem | null;
  firstPublishedAt?: string;
  lastPriceReducedAt?: string;
  relistedAt?: string;
  backOnMarketAt?: string;
  location: {
    type: "Point";
    coordinates: [number, number];
    address: string;
  };
  agentId: {
    location: {
      type: "Point";
      address: string;
    };
    isDeleted: boolean;
    id: string;
    name: string;
    role: string;
    email: string;
    dateOfBirth: string;
    verified: boolean;
    status: string;
    profileImage: string;
    createdAt: string;
    updatedAt: string;
    lastLoginAt: string;
    phone: string;
    country: string;
    countryCode: string;
    postalCode: string;
    city: string;
    agencyLogo: string;
    agencyName: string;
  };
  photos: string[];
  photosInfos: string[];
  videos: string[];
  floorPlans: string[];
  brochure: string;
  threeSixtyTour: string;
  propertyType: string;
  propertyBedrooms: number;
  propertyBathrooms: number;
  propertySquareFoot: number;
  tenure: string;
  councilTaxBand: string;
  features: string[];
  description: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  viewedBy: string[];
  views: number;
}

interface Props {
  property: Property;
}

function formatPropertyType(type?: string): string {
  if (!type) return "Property";
  return (
    PROPERTY_TYPE_LABELS[type] ??
    type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function formatPrice(property: Property): string {
  const formatted = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(property.askingPrice ?? 0);

  return property.listingType === "RENT" ? `${formatted} pcm` : formatted;
}

export default function PropertyCard({ property }: Props) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isFavorite, setIsFavorite] = useState(property.isFavorite ?? false);
  const swiperRef = useRef<SwiperType | null>(null);
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();

  const primaryBadge = getPrimaryBadge(property);
  const activityInfo = formatActivityDate(property);

  useEffect(() => {
    setIsFavorite(property.isFavorite ?? false);
  }, [property.isFavorite]);

  const images =
    property.photos?.length > 0
      ? property.photos.map((photo) => getImage(photo) || PLACEHOLDER_IMAGE)
      : [PLACEHOLDER_IMAGE];

  const agentLogo = property.agentId?.agencyLogo
    ? getImage(property.agentId.agencyLogo)
    : property.agentLogo
      ? getImage(property.agentLogo)
      : null;

  const visibleFeatures = property.features?.slice(0, 3) ?? [];
  const extraFeatureCount = Math.max(0, (property.features?.length ?? 0) - 3);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    swiperRef.current?.slidePrev();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    swiperRef.current?.slideNext();
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlide(swiper.realIndex + 1);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isUserLoggedIn()) {
      notificationApi.error({
        message: "Please login to save properties",
        description: (
          <>
            Please{" "}
            <Link className="text-[#0f2d5e] font-semibold" href="/auth/login">
              login
            </Link>{" "}
            or{" "}
            <Link className="text-[#0f2d5e] font-semibold" href="/auth/signup">
              register
            </Link>{" "}
            to save properties
          </>
        ),
        placement: "topRight",
      });
      return;
    }

    if (!property._id) return;

    const nextState = !isFavorite;
    setIsFavorite(nextState);

    try {
      await apiFetch(
        "/favorite-properties/toggle",
        {
          body: JSON.stringify({ listingId: property._id }),
          method: "POST",
        },
        "client",
      );
    } catch {
      setIsFavorite(!nextState);
    }
  };

  return (
    <>
      {notificationContextHolder}
      <Link href={`/properties/${property._id}`} className="block group">
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white h-full flex flex-col">
          {/* Image Slider */}
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              loop={false}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={handleSlideChange}
              className="property-swiper h-52 sm:h-56 md:h-60"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="relative w-full h-full">
                    <img
                      src={img}
                      alt={`${property.title} - image ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Favourite */}
            <button
              type="button"
              onClick={handleToggleSave}
              aria-label={isFavorite ? "Remove from saved" : "Save property"}
              className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 shadow-md cursor-pointer ${
                isFavorite
                  ? "bg-rose-50/95 text-rose-600 hover:bg-rose-100"
                  : "bg-white/90 text-gray-500 hover:text-rose-500 hover:bg-white"
              }`}
            >
              <Heart
                size={18}
                className={`transition-all duration-200 ${isFavorite ? "fill-rose-600 stroke-rose-600" : ""}`}
              />
            </button>

            {/* Top Left: Badge & Photo counter */}
            <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5 max-w-[calc(100%-60px)]">
              {/* High Priority Badge (e.g. SOLD STC, SOLD, REDUCED TODAY, BACK ON MARKET, PRICE REDUCED, NEW) */}
              {primaryBadge && primaryBadge.code !== "FEATURED" && (
                <PropertyBadge badge={primaryBadge} size="sm" />
              )}

              {/* Photo counter */}
              <div className="flex items-center gap-1.5 bg-[#1a3c6e]/85 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                <CameraOutlined className="text-xs" />
                {currentSlide}/{images.length}
              </div>
            </div>

            {/* Featured badge (bottom-left) */}
            {(property.isFeatured || primaryBadge?.code === "FEATURED") && (
              <div className="absolute bottom-3 left-3 z-10 bg-[#1a3c6e] px-3 py-1 rounded-lg border border-[#0f2d5e]">
                <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                  Featured
                </span>
              </div>
            )}

            {/* Listing type badge */}
            <div className="absolute bottom-3 right-3 z-10 bg-[#14b8a6] px-3 py-1 rounded-lg">
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                {property.listingType === "RENT" ? "To Rent" : "For Sale"}
              </span>
            </div>

            {/* Slider arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isBeginning}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
                    isBeginning
                      ? "bg-white/30 text-white/40 cursor-not-allowed"
                      : "bg-white/80 text-[#1a3c6e] hover:bg-white hover:scale-105 shadow-md cursor-pointer"
                  }`}
                >
                  <LeftOutlined className="text-xs" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isEnd}
                  className={`absolute right-12 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
                    isEnd
                      ? "bg-white/30 text-white/40 cursor-not-allowed"
                      : "bg-white/80 text-[#1a3c6e] hover:bg-white hover:scale-105 shadow-md cursor-pointer"
                  }`}
                >
                  <RightOutlined className="text-xs" />
                </button>
              </>
            )}
          </div>

          {/* Card Body */}
          <div className="px-4 pt-4 pb-5 flex flex-col flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <p className="text-[#14b8a6] font-extrabold text-xl tracking-tight">
                {formatPrice(property)}
              </p>
              {property.originalPrice && property.originalPrice > (property.askingPrice ?? 0) && (
                <span className="text-xs text-gray-400 line-through font-medium">
                  £{property.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <h3 className="font-bold text-gray-900 text-base mt-1 truncate group-hover:text-[#1a3c6e] transition-colors">
              {property.title}
            </h3>
            <p className="text-[#1a3c6e] text-sm mt-0.5 truncate">
              {property.location?.address}
            </p>

            {/* Property stats */}
            <div className="mt-4 h-12 flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4" />
                <span>
                  {property.propertyBedrooms ?? 0}{" "}
                  {(property.propertyBedrooms ?? 0) === 1
                    ? "Bedroom"
                    : "Bedrooms"}
                </span>
              </div>

              <div className="h-4 w-px bg-gray-300" />

              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4" />
                <span>
                  {property.propertyBathrooms ?? 0}{" "}
                  {(property.propertyBathrooms ?? 0) === 1
                    ? "Bathroom"
                    : "Bathrooms"}
                </span>
              </div>

              <div className="h-4 w-px bg-gray-300" />

              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>{formatPropertyType(property.propertyType)}</span>
              </div>
            </div>

            {/* Features */}
            {visibleFeatures.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {visibleFeatures.map((feature) => (
                  <span
                    key={feature}
                    className="text-[11px] font-medium text-[#1a3c6e] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md"
                  >
                    {feature}
                  </span>
                ))}
                {extraFeatureCount > 0 && (
                  <span className="text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                    +{extraFeatureCount} more
                  </span>
                )}
              </div>
            )}

            {/* Footer: agent + date */}
            <div className="flex items-center justify-between gap-3 mt-auto pt-4 border-t border-gray-50">
              {agentLogo ? (
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-10 h-8 rounded-md overflow-hidden border border-gray-100 shrink-0 bg-white">
                    <img
                      src={getImage(agentLogo)}
                      alt={property.agentId?.agencyName || "Agent"}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {property.agentId?.agencyName && (
                    <span className="text-xs text-gray-500 truncate">
                      {property.agentId.agencyName}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-gray-400">Listed by agent</span>
              )}

              <p className="text-gray-400 text-xs shrink-0 font-medium">
                {activityInfo.text ||
                  (property.createdAt &&
                    `Added ${formatUKDate(property.createdAt)}`)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
