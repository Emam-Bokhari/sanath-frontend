export type BadgeCode =
  | "SOLD_STC"
  | "SOLD"
  | "REDUCED_TODAY"
  | "BACK_ON_MARKET"
  | "RECENTLY_RELISTED"
  | "PRICE_REDUCED"
  | "ADDED_TODAY"
  | "ADDED_YESTERDAY"
  | "ADDED_LAST_7_DAYS"
  | "NEW"
  | "FEATURED"
  | string;

export interface PropertyBadgeItem {
  code: BadgeCode;
  label: string;
}

export interface BadgeStyleConfig {
  code: string;
  label: string;
  priority: number;
  bgClass: string;
  textClass: string;
  borderClass: string;
  combinedClass: string;
  description: string;
}

export const BADGE_DEFINITIONS: Record<string, BadgeStyleConfig> = {
  SOLD_STC: {
    code: "SOLD_STC",
    label: "SOLD STC",
    priority: 1,
    bgClass: "bg-[#a5b4fc]",
    textClass: "text-[#0f172a]",
    borderClass: "border-[#818cf8]/40",
    combinedClass: "bg-[#a5b4fc] text-[#0f172a] border border-[#818cf8]/40",
    description: "Sold Subject to Contract",
  },
  SOLD: {
    code: "SOLD",
    label: "SOLD",
    priority: 1,
    bgClass: "bg-rose-600",
    textClass: "text-white",
    borderClass: "border-rose-700",
    combinedClass: "bg-rose-600 text-white border border-rose-700",
    description: "Property Sold",
  },
  REDUCED_TODAY: {
    code: "REDUCED_TODAY",
    label: "Reduced Today",
    priority: 2,
    bgClass: "bg-amber-500",
    textClass: "text-white",
    borderClass: "border-amber-600",
    combinedClass: "bg-amber-500 text-white border border-amber-600",
    description: "Asking price reduced today",
  },
  BACK_ON_MARKET: {
    code: "BACK_ON_MARKET",
    label: "Back on Market",
    priority: 3,
    bgClass: "bg-sky-600",
    textClass: "text-white",
    borderClass: "border-sky-700",
    combinedClass: "bg-sky-600 text-white border border-sky-700",
    description: "Returned to the market",
  },
  RECENTLY_RELISTED: {
    code: "RECENTLY_RELISTED",
    label: "Recently Relisted",
    priority: 3,
    bgClass: "bg-purple-600",
    textClass: "text-white",
    borderClass: "border-purple-700",
    combinedClass: "bg-purple-600 text-white border border-purple-700",
    description: "Relisted as fresh listing",
  },
  PRICE_REDUCED: {
    code: "PRICE_REDUCED",
    label: "Price Reduced",
    priority: 4,
    bgClass: "bg-orange-600",
    textClass: "text-white",
    borderClass: "border-orange-700",
    combinedClass: "bg-orange-600 text-white border border-orange-700",
    description: "Price recently reduced",
  },
  ADDED_TODAY: {
    code: "ADDED_TODAY",
    label: "Added Today",
    priority: 5,
    bgClass: "bg-emerald-600",
    textClass: "text-white",
    borderClass: "border-emerald-700",
    combinedClass: "bg-emerald-600 text-white border border-emerald-700",
    description: "Published on today's calendar date",
  },
  ADDED_YESTERDAY: {
    code: "ADDED_YESTERDAY",
    label: "Added Yesterday",
    priority: 5,
    bgClass: "bg-emerald-500",
    textClass: "text-white",
    borderClass: "border-emerald-600",
    combinedClass: "bg-emerald-500 text-white border border-emerald-600",
    description: "Published yesterday",
  },
  ADDED_LAST_7_DAYS: {
    code: "ADDED_LAST_7_DAYS",
    label: "Added in Last 7 Days",
    priority: 5,
    bgClass: "bg-teal-600",
    textClass: "text-white",
    borderClass: "border-teal-700",
    combinedClass: "bg-teal-600 text-white border border-teal-700",
    description: "Published in the last 2-7 days",
  },
  NEW: {
    code: "NEW",
    label: "NEW",
    priority: 6,
    bgClass: "bg-emerald-600",
    textClass: "text-white",
    borderClass: "border-emerald-700",
    combinedClass: "bg-emerald-600 text-white border border-emerald-700",
    description: "New property within 7 days",
  },
  FEATURED: {
    code: "FEATURED",
    label: "Featured",
    priority: 7,
    bgClass: "bg-[#1a3c6e]",
    textClass: "text-white",
    borderClass: "border-[#0f2d5e]",
    combinedClass: "bg-[#1a3c6e] text-white border border-[#0f2d5e]",
    description: "Featured property",
  },
};

/** Format date as DD/MM/YYYY */
export function formatUKDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/** Check if given date is today in local time */
export function isDateToday(dateInput?: string | Date | null): boolean {
  if (!dateInput) return false;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/** Check if given date is yesterday */
export function isDateYesterday(dateInput?: string | Date | null): boolean {
  if (!dateInput) return false;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
}

/** Retrieve styling config for a badge code */
export function getBadgeConfig(code?: string, fallbackLabel?: string): BadgeStyleConfig {
  if (!code) {
    return {
      code: "UNKNOWN",
      label: fallbackLabel || "",
      priority: 99,
      bgClass: "bg-gray-700",
      textClass: "text-white",
      borderClass: "border-gray-800",
      combinedClass: "bg-gray-700 text-white border border-gray-800",
      description: "",
    };
  }

  const normalized = code.toUpperCase();
  if (BADGE_DEFINITIONS[normalized]) {
    return {
      ...BADGE_DEFINITIONS[normalized],
      label: fallbackLabel || BADGE_DEFINITIONS[normalized].label,
    };
  }

  // Format unknown code into Title Case label
  const label =
    fallbackLabel ||
    code
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    code: normalized,
    label,
    priority: 10,
    bgClass: "bg-[#1a3c6e]",
    textClass: "text-white",
    borderClass: "border-[#0f2d5e]",
    combinedClass: "bg-[#1a3c6e] text-white border border-[#0f2d5e]",
    description: label,
  };
}

export const TEXT_ONLY_BADGE_CODES = new Set([
  "ADDED_TODAY",
  "ADDED_YESTERDAY",
  "ADDED_LAST_7_DAYS",
]);

export function isTextOnlyBadge(code?: string): boolean {
  if (!code) return false;
  return TEXT_ONLY_BADGE_CODES.has(code.toUpperCase());
}

/**
 * Returns primary visual badge with fallback resolution:
 * Checks property.primaryBadge -> property.badges -> marketStatus / isFeatured fallbacks.
 * Ignores text-only badges (ADDED_TODAY, ADDED_YESTERDAY, ADDED_LAST_7_DAYS).
 */
export function getPrimaryBadge(property: any): PropertyBadgeItem | null {
  if (!property) return null;

  // 1. Check if property.primaryBadge is an eligible visual badge
  if (
    property.primaryBadge &&
    property.primaryBadge.code &&
    !isTextOnlyBadge(property.primaryBadge.code)
  ) {
    return {
      code: property.primaryBadge.code,
      label:
        property.primaryBadge.label ||
        BADGE_DEFINITIONS[property.primaryBadge.code]?.label ||
        property.primaryBadge.code,
    };
  }

  // 2. Search property.badges for any eligible visual badge (e.g. NEW, PRICE_REDUCED, FEATURED)
  if (Array.isArray(property.badges) && property.badges.length > 0) {
    const visualBadges = property.badges
      .filter((b: any) => b?.code && !isTextOnlyBadge(b.code))
      .map((b: any) => ({
        code: b.code,
        label: b.label || BADGE_DEFINITIONS[b.code]?.label || b.code,
        priority: BADGE_DEFINITIONS[b.code]?.priority ?? 10,
      }))
      .sort((a: any, b: any) => a.priority - b.priority);

    if (visualBadges.length > 0) {
      return {
        code: visualBadges[0].code,
        label: visualBadges[0].label,
      };
    }
  }

  // 3. Fallback to marketStatus if present
  if (property.marketStatus === "SOLD_STC") {
    return { code: "SOLD_STC", label: "SOLD STC" };
  }
  if (property.marketStatus === "SOLD") {
    return { code: "SOLD", label: "SOLD" };
  }
  if (property.marketStatus === "BACK_ON_MARKET") {
    return { code: "BACK_ON_MARKET", label: "Back on Market" };
  }
  if (property.marketStatus === "RECENTLY_RELISTED") {
    return { code: "RECENTLY_RELISTED", label: "Recently Relisted" };
  }

  // 4. Fallback to featured
  if (property.isFeatured || property.featured) {
    return { code: "FEATURED", label: "Featured" };
  }

  return null;
}

/**
 * Returns all distinct visual badges for this property (e.g. for listing detail header)
 * Filters out text-only badges (ADDED_TODAY, ADDED_YESTERDAY, ADDED_LAST_7_DAYS).
 */
export function getAllBadges(property: any): PropertyBadgeItem[] {
  if (!property) return [];

  const list: PropertyBadgeItem[] = [];
  const seen = new Set<string>();

  if (Array.isArray(property.badges)) {
    property.badges.forEach((b: any) => {
      if (b?.code && !isTextOnlyBadge(b.code) && !seen.has(b.code)) {
        seen.add(b.code);
        list.push({
          code: b.code,
          label: b.label || BADGE_DEFINITIONS[b.code]?.label || b.code,
        });
      }
    });
  }

  // Ensure primaryBadge is included if not in list
  const primary = getPrimaryBadge(property);
  if (primary && !isTextOnlyBadge(primary.code) && !seen.has(primary.code)) {
    seen.add(primary.code);
    list.unshift(primary);
  }

  // Ensure isFeatured is included if true
  if ((property.isFeatured || property.featured) && !seen.has("FEATURED")) {
    seen.add("FEATURED");
    list.push({ code: "FEATURED", label: "Featured" });
  }

  // Sort by priority (1 is highest)
  return list.sort((a, b) => {
    const pA = BADGE_DEFINITIONS[a.code]?.priority ?? 10;
    const pB = BADGE_DEFINITIONS[b.code]?.priority ?? 10;
    return pA - pB;
  });
}

export interface ActivityDateInfo {
  text: string;
  type: "reduced" | "added" | "relisted" | "back_on_market" | "standard";
  rawDate?: string;
}

/**
 * Formats the market activity date string:
 * e.g. "Reduced 24/07/2026", "Added today", "Relisted 30/09/2026", "Added 26/09/2026"
 */
export function formatActivityDate(property: any): ActivityDateInfo {
  if (!property) return { text: "", type: "standard" };

  const badges = property.badges || [];
  const badgeCodes = new Set<string>(badges.map((b: any) => b.code));
  if (property.primaryBadge?.code) badgeCodes.add(property.primaryBadge.code);

  // 1. Reduced Today
  if (badgeCodes.has("REDUCED_TODAY") || (property.lastPriceReducedAt && isDateToday(property.lastPriceReducedAt))) {
    return {
      text: "Reduced today",
      type: "reduced",
      rawDate: property.lastPriceReducedAt,
    };
  }

  // 2. Price Reduced with specific date
  if (property.lastPriceReducedAt || badgeCodes.has("PRICE_REDUCED")) {
    const formatted = formatUKDate(property.lastPriceReducedAt);
    return {
      text: formatted ? `Reduced ${formatted}` : "Price Reduced",
      type: "reduced",
      rawDate: property.lastPriceReducedAt,
    };
  }

  // 3. Back on market
  if (badgeCodes.has("BACK_ON_MARKET") || property.marketStatus === "BACK_ON_MARKET") {
    if (property.backOnMarketAt && isDateToday(property.backOnMarketAt)) {
      return {
        text: "Back on market today",
        type: "back_on_market",
        rawDate: property.backOnMarketAt,
      };
    }
    const formatted = formatUKDate(property.backOnMarketAt);
    return {
      text: formatted ? `Back on market ${formatted}` : "Back on market",
      type: "back_on_market",
      rawDate: property.backOnMarketAt,
    };
  }

  // 4. Recently relisted
  if (badgeCodes.has("RECENTLY_RELISTED") || property.marketStatus === "RECENTLY_RELISTED") {
    if (property.relistedAt && isDateToday(property.relistedAt)) {
      return {
        text: "Relisted today",
        type: "relisted",
        rawDate: property.relistedAt,
      };
    }
    const formatted = formatUKDate(property.relistedAt);
    return {
      text: formatted ? `Relisted ${formatted}` : "Recently relisted",
      type: "relisted",
      rawDate: property.relistedAt,
    };
  }

  // 5. Added Today
  if (badgeCodes.has("ADDED_TODAY") || (property.firstPublishedAt && isDateToday(property.firstPublishedAt))) {
    return {
      text: "Added today",
      type: "added",
      rawDate: property.firstPublishedAt || property.createdAt,
    };
  }

  // 6. Added Yesterday
  if (badgeCodes.has("ADDED_YESTERDAY") || (property.firstPublishedAt && isDateYesterday(property.firstPublishedAt))) {
    return {
      text: "Added yesterday",
      type: "added",
      rawDate: property.firstPublishedAt || property.createdAt,
    };
  }

  // 7. Added in Last 7 Days
  if (badgeCodes.has("ADDED_LAST_7_DAYS")) {
    const formatted = formatUKDate(property.firstPublishedAt || property.createdAt);
    return {
      text: formatted ? `Added ${formatted}` : "Added in last 7 days",
      type: "added",
      rawDate: property.firstPublishedAt || property.createdAt,
    };
  }

  // 8. Default to firstPublishedAt or createdAt
  const baseDate = property.firstPublishedAt || property.createdAt;
  if (baseDate) {
    if (isDateToday(baseDate)) {
      return { text: "Added today", type: "added", rawDate: baseDate };
    }
    if (isDateYesterday(baseDate)) {
      return { text: "Added yesterday", type: "added", rawDate: baseDate };
    }
    const formatted = formatUKDate(baseDate);
    return {
      text: formatted ? `Added ${formatted}` : "",
      type: "standard",
      rawDate: baseDate,
    };
  }

  return { text: "", type: "standard" };
}
