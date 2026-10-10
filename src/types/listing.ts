/** API listing type (e.g. RENT, SALE) */
export type ApiListingType = "RENT" | "SALE";

/** API listing lifecycle statuses (backend enum) */
export const LISTING_STATUS = {
  DRAFT: "DRAFT",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  PUBLISHED: "PUBLISHED",
  REJECTED: "REJECTED",
  SOLD: "SOLD",
} as const;

export type CoreListingStatus =
  (typeof LISTING_STATUS)[keyof typeof LISTING_STATUS];

/** API publish / lifecycle status (core + legacy values) */
export type ApiListingStatus =
  | CoreListingStatus
  | "CLOSED"
  | "ARCHIVED";

/** Market statuses for agent management & badges */
export const MARKET_STATUS = {
  AVAILABLE: "AVAILABLE",
  SOLD_STC: "SOLD_STC",
  SOLD: "SOLD",
  RECENTLY_RELISTED: "RECENTLY_RELISTED",
  BACK_ON_MARKET: "BACK_ON_MARKET",
} as const;

export type MarketStatus =
  | (typeof MARKET_STATUS)[keyof typeof MARKET_STATUS]
  | string;

/** Statuses that must not change when the agent updates listing details */
export const LISTING_STATUSES_PRESERVE_ON_UPDATE: readonly CoreListingStatus[] = [
  LISTING_STATUS.REJECTED,
  LISTING_STATUS.PUBLISHED,
];

export function shouldPreserveListingStatus(
  status?: ApiListingStatus
): boolean {
  return (
    !!status &&
    (LISTING_STATUSES_PRESERVE_ON_UPDATE as readonly ApiListingStatus[]).includes(
      status
    )
  );
}

export function canShowSaveDraftButton(status?: ApiListingStatus): boolean {
  return status === LISTING_STATUS.DRAFT;
}

export type ApiPropertyType =
  | "DETACHED"
  | "SEMI"
  | "TERRACED"
  | "BANGLOW"
  | "FLAT"
  | "PARK_HOME"
  | string;

export type ApiTenure = "FREEHOLD" | "LEASEHOLD" | "SHARE_OF_FREEHOLD" | string;

export type LeadStatus = "ENQUIRED" | "CONTACTED" | "CLOSED" | string;

export interface GeoPoint {
  type: "Point";
  coordinates: [number, number];
  address: string;
}

export interface EpcEnergyRating {
  label: string;
  score: number;
}

export interface ListingCheckList {
  basicInfo: boolean;
  media: boolean;
  propertyInfo: boolean;
  featureDescription: boolean;
  readyToPublish: boolean;
}

export interface ListingLeadUser {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface ListingLead {
  _id: string;
  userId: ListingLeadUser;
  listingId: string;
  status: LeadStatus;
  name: string;
  email: string;
  phone: string;
  postalCode: string;
  country: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyBadge {
  code: string;
  label: string;
}

export interface PriceHistoryEntry {
  previousPrice: number;
  newPrice: number;
  difference?: number;
  percentageReduced?: number;
  changedAt: string;
  changedBy?: string;
}

/** Listing document from the API */
export interface Listing {
  _id: string;
  title: string;
  listingType: ApiListingType;
  askingPrice: number;
  originalPrice?: number;
  previousPrice?: number;
  priceHistory?: PriceHistoryEntry[];
  country: string;
  city: string;
  postalCode: string;
  location: GeoPoint;
  agentId: string;
  photos: string[];
  videos?: string[];
  views: number;
  viewedBy?: string[];
  floorPlans?: string[];
  brochure?: string;
  threeSixtyTour?: string;
  propertyType: ApiPropertyType;
  propertyBedrooms: number;
  propertyBathrooms: number;
  propertySquareFoot: number;
  tenure: ApiTenure;
  councilTaxBand: string;
  epcEnergyRating: EpcEnergyRating;
  features: string[];
  description: string;
  isFeatured: boolean;
  leadsCount: number;
  leads?: ListingLead[];
  status: ApiListingStatus;
  marketStatus?: MarketStatus;
  badges?: PropertyBadge[];
  primaryBadge?: PropertyBadge | null;
  firstPublishedAt?: string;
  lastPriceReducedAt?: string;
  relistedAt?: string;
  backOnMarketAt?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  listingCheckList: ListingCheckList;
  isFavorite?: boolean;
}

/** Full listing for detail / edit views (same shape as API) */
export type ListingDetail = Listing;

/** UI filter values (ListingsFilters) */
export type ListingStatusFilter = "all" | "active" | "draft" | "closed";

/** Form wizard — UI-oriented values, not raw API enums */
export interface ListingFormData {
  listingType: "for-sale" | "to-rent";
  title: string;
  price: string;
  postcode: string;
  country: string;
  city: string;
  streetAddress: string;
  coordinates: [number, number];
  photos: File[];
  videos: File[];
  floorPlan: File[];
  brochures: File[];
  threeSixtyTour: File[];
  existingPhotos: string[];
  existingVideos: string[];
  existingFloorPlan: string[];
  existingBrochures: string[];
  existingThreeSixtyTour: string[];
  propertyType: string;
  beds: string;
  baths: string;
  sqFt: string;
  tenure: string;
  councilTaxBand: string;
  epc: string;
  features: string[];
  description: string;
  publishStatus: string;
  /** Original API status when editing; omitted for new listings */
  apiStatus?: ApiListingStatus;
}

export function getListingId(listing: Pick<Listing, "_id">): string {
  return listing._id;
}

export function getListingAddress(listing: Listing): string {
  return (
    listing.location?.address ??
    [listing.city, listing.postalCode].filter(Boolean).join(", ")
  );
}

export function getListingThumbnail(listing: Listing): string | undefined {
  return listing.photos?.[0];
}

export function formatListingPrice(
  listing: Pick<Listing, "askingPrice" | "listingType">
): string {
  const formatted = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(listing.askingPrice);

  return listing.listingType === "RENT" ? `${formatted} pcm` : formatted;
}

export function formatListingTypeLabel(type: ApiListingType): string {
  return type === "RENT" ? "Rent" : "Sale";
}

export function formatApiStatusLabel(status: ApiListingStatus): string {
  const labels: Record<string, string> = {
    PUBLISHED: "Published",
    DRAFT: "Draft",
    REJECTED: "Rejected",
    CLOSED: "Closed",
    SOLD: "Sold",
    ARCHIVED: "Archived",
    PENDING_APPROVAL: "Pending Approval",
  };
  return labels[status] ?? status;
}

/** Map API status → filter key used in ListingsFilters */
export function apiStatusToFilterKey(
  status: ApiListingStatus
): "active" | "draft" | "closed" | "sold" | "other" {
  switch (status) {
    case "PUBLISHED":
      return "active";
    case "DRAFT":
      return "draft";
    case "CLOSED":
    case "ARCHIVED":
      return "closed";
    case "SOLD":
      return "sold";
    default:
      return "other";
  }
}

export function apiListingTypeToForm(
  type: ApiListingType
): ListingFormData["listingType"] {
  return type === "RENT" ? "to-rent" : "for-sale";
}

/** Maps API listing → add/edit form state */
export function listingToFormData(detail: ListingDetail): ListingFormData {
  const address = getListingAddress(detail);

  return {
    listingType: apiListingTypeToForm(detail.listingType),
    title: detail.title,
    price: String(detail.askingPrice ?? ""),
    postcode: detail.postalCode ?? "",
    country: detail.country ?? "",
    city: detail.city ?? "",
    streetAddress: detail.location?.address ?? address,
    coordinates: detail.location?.coordinates ?? [0, 0],
    photos: [],
    videos: [],
    floorPlan: [],
    brochures: [],
    threeSixtyTour: [],
    existingPhotos: detail.photos ?? [],
    existingVideos: detail.videos ?? [],
    existingFloorPlan: detail.floorPlans ?? [],
    existingBrochures: detail.brochure ? [detail.brochure] : [],
    existingThreeSixtyTour: detail.threeSixtyTour ? [detail.threeSixtyTour] : [],
    propertyType: detail.propertyType ?? "",
    beds: String(detail.propertyBedrooms ?? ""),
    baths: String(detail.propertyBathrooms ?? ""),
    sqFt: String(detail.propertySquareFoot ?? ""),
    tenure: detail.tenure ?? "",
    councilTaxBand: detail.councilTaxBand ?? "",
    epc: detail.epcEnergyRating?.label ?? "",
    features: detail.features ?? [],
    description: detail.description ?? "",
    publishStatus:
      detail.status === LISTING_STATUS.DRAFT ? "Draft" : "Active",
    apiStatus: detail.status,
  };
}

export const API_STATUS_BADGE_CLASSES: Record<
  ApiListingStatus,
  { label: string; classes: string }
> = {
  PUBLISHED: {
    label: "Published",
    classes: "bg-green-50 text-green-700 border border-green-200",
  },
  DRAFT: {
    label: "Draft",
    classes: "bg-gray-100 text-gray-600 border border-gray-300",
  },
  REJECTED: {
    label: "Rejected",
    classes: "bg-red-50 text-red-700 border border-red-200",
  },
  CLOSED: {
    label: "Closed",
    classes: "bg-red-50 text-red-600 border border-red-200",
  },
  SOLD: {
    label: "Sold",
    classes: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  ARCHIVED: {
    label: "Archived",
    classes: "bg-gray-100 text-gray-500 border border-gray-200",
  },
  PENDING_APPROVAL: {
    label: "Pending",
    classes: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  },
};
