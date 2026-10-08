"use client";

import Image from "next/image";
import {
  Listing,
  ApiListingStatus,
  API_STATUS_BADGE_CLASSES,
  getListingId,
  getListingAddress,
  getListingThumbnail,
  formatListingPrice,
  formatListingTypeLabel,
} from "@/types/listing";
import { getImage } from "@/lib/api-fech";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Eye } from "lucide-react";
import { Pagination } from "antd";
import { Meta } from "@/app/agent-dashboard/my-listing/page";

interface ListingsTableProps {
  listings: Listing[];
  meta: Meta;
  onDelete: (id: string) => void;
  onDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
}

export function StatusBadge({ status }: { status: ApiListingStatus }) {
  const config =
    API_STATUS_BADGE_CLASSES[status] ?? API_STATUS_BADGE_CLASSES.DRAFT;
  return (
    <span
      className={`rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${config.classes}`}
    >
      {config.label}
    </span>
  );
}

export default function ListingsTable({
  listings,
  meta,
  onDelete,
  onDetails,
  onEdit,
  onPageChange,
}: ListingsTableProps) {
  if (listings.length === 0) {
    return (
      <div className="bg-white py-20 text-center text-gray-400">
        <p className="text-lg font-semibold">No listings found</p>
        <p className="mt-1 text-sm">Add your first listing to get started</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white">
      <div className="grid min-w-[950px] grid-cols-[2fr_0.8fr_1.2fr_0.8fr_0.8fr_1fr_220px] gap-6 border-b border-gray-200 bg-gray-50/50 px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">
        <span>Property</span>
        <span className="text-center">Type</span>
        <span className="text-right">Price</span>
        <span className="text-right">Leads</span>
        <span className="text-right">Views</span>
        <span className="text-center">Status</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="min-w-[950px] divide-y divide-gray-100   max-h-[calc(100vh-400px)] overflow-y-auto overflow-x-auto">
        {listings.map((listing) => {
          const id = getListingId(listing);
          const thumb = getListingThumbnail(listing);
          const imageSrc = thumb ? getImage(thumb) : "/cardImg.png";

          return (
            <div
              key={id}
              className="group grid grid-cols-[2fr_0.8fr_1.2fr_0.8fr_0.8fr_1fr_220px] items-center gap-6 px-6 py-5 transition-colors hover:bg-gray-50"
            >
              <div className="flex min-w-0 items-center gap-4 pr-4">
                <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 shadow-sm">
                  <Image
                    src={imageSrc}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <p className="mb-0.5 truncate text-[15px] font-bold text-gray-900">
                    {listing.title}
                  </p>
                  <p className="truncate text-[13px] text-gray-500">
                    {getListingAddress(listing)}
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-tight ${
                    listing.listingType === "RENT"
                      ? "border border-indigo-100 bg-indigo-50 text-indigo-700"
                      : "border border-amber-100 bg-amber-50 text-amber-700"
                  }`}
                >
                  {formatListingTypeLabel(listing.listingType)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[15px] font-bold text-[#1a3c6e]">
                  {formatListingPrice(listing)}
                </span>
              </div>

              <div className="text-right text-[14px] font-semibold text-gray-600 ">
                {listing.leadsCount?.toLocaleString() ?? 0}
              </div>

              <div className="text-right text-[14px] font-semibold text-gray-600">
                {listing.views.toLocaleString()}
              </div>

              <div className="flex justify-center">
                <StatusBadge status={listing.status} />
              </div>

              <div className="flex items-center justify-end gap-2 text-sm opacity-90 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => onDetails(id)}
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 font-semibold text-gray-600 transition-colors hover:bg-[#1a3c6e]/5 hover:text-[#1a3c6e]"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => onEdit(id)}
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 font-semibold text-[#1a3c6e] transition-colors hover:bg-[#1a3c6e]/5 hover:text-[#0f2d5e]"
                >
                  <EditOutlined className="text-[15px]" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(id)}
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <DeleteOutlined className="text-[15px]" />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {meta && meta.total > 0 && (
        <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{(meta.page - 1) * meta.limit + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            of <span className="font-medium">{meta.total}</span> results
          </div>
          <Pagination
            current={meta.page}
            size="small"
            pageSize={meta.limit}
            total={meta.total}
            onChange={onPageChange}
            showSizeChanger={false}
            className="premium-pagination"
          />
        </div>
      )}
    </div>
  );
}
