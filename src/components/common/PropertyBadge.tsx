"use client";

import React from "react";
import { getBadgeConfig, PropertyBadgeItem } from "@/lib/badge-utils";

interface PropertyBadgeProps {
  badge: PropertyBadgeItem | { code: string; label?: string };
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function PropertyBadge({
  badge,
  size = "sm",
  className = "",
}: PropertyBadgeProps) {
  if (!badge || !badge.code) return null;

  const config = getBadgeConfig(badge.code, badge.label);

  const sizeClasses = {
    xs: "text-[9px] px-2 py-0.5 rounded",
    sm: "text-[10px] px-2.5 py-1 rounded-md",
    md: "text-xs px-3 py-1.5 rounded-lg",
    lg: "text-sm px-4 py-2 rounded-xl",
  };

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider shadow-sm transition-all select-none ${config.combinedClass} ${sizeClasses[size]} ${className}`}
      title={config.description || config.label}
    >
      {config.label}
    </span>
  );
}

export default PropertyBadge;
