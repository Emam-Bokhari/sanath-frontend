"use client";

import { useState } from "react";
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
import {
  DeleteOutlined,
  EditOutlined,
  DownOutlined,
  LoadingOutlined,
  TagOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { Eye, CheckCircle2 } from "lucide-react";
import { Pagination, Dropdown, Modal, Button } from "antd";
import type { MenuProps } from "antd";
import { Meta } from "@/app/agent-dashboard/my-listing/page";
import PropertyBadge from "@/components/common/PropertyBadge";
import { getPrimaryBadge } from "@/lib/badge-utils";

interface ListingsTableProps {
  listings: Listing[];
  meta: Meta;
  onDelete: (id: string) => void;
  onDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
  onMarketStatusChange?: (
    id: string,
    newMarketStatus: string
  ) => Promise<void> | void;
  updatingListingId?: string | null;
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

function getEffectiveMarketStatus(
  listing: Listing
):
  | "AVAILABLE"
  | "SOLD_STC"
  | "SOLD"
  | "RECENTLY_RELISTED"
  | "BACK_ON_MARKET" {
  if (listing.marketStatus) {
    const ms = String(listing.marketStatus).toUpperCase();
    if (ms === "SOLD_STC") return "SOLD_STC";
    if (ms === "SOLD") return "SOLD";
    if (ms === "RECENTLY_RELISTED") return "RECENTLY_RELISTED";
    if (ms === "BACK_ON_MARKET") return "BACK_ON_MARKET";
    if (ms === "AVAILABLE") return "AVAILABLE";
  }
  if (listing.status === "SOLD") return "SOLD";
  return "AVAILABLE";
}

export default function ListingsTable({
  listings,
  meta,
  onDelete,
  onDetails,
  onEdit,
  onPageChange,
  onMarketStatusChange,
  updatingListingId,
}: ListingsTableProps) {
  // Confirmation modal state for significant market status actions
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    listingId: string | null;
    listingTitle: string;
    targetStatus: string;
    targetLabel: string;
  }>({
    open: false,
    listingId: null,
    listingTitle: "",
    targetStatus: "",
    targetLabel: "",
  });
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleInitiateStatusChange = (
    listing: Listing,
    targetStatus: string,
    targetLabel: string,
    requiresConfirm: boolean
  ) => {
    const id = getListingId(listing);
    if (requiresConfirm) {
      setConfirmModal({
        open: true,
        listingId: id,
        listingTitle: listing.title,
        targetStatus,
        targetLabel,
      });
    } else {
      onMarketStatusChange?.(id, targetStatus);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!confirmModal.listingId || !confirmModal.targetStatus) return;
    setConfirmLoading(true);
    try {
      await onMarketStatusChange?.(
        confirmModal.listingId,
        confirmModal.targetStatus
      );
      setConfirmModal((prev) => ({ ...prev, open: false }));
    } finally {
      setConfirmLoading(false);
    }
  };

  const getMarketStatusMenuItems = (listing: Listing): MenuProps["items"] => {
    const currentStatus = getEffectiveMarketStatus(listing);
    const items: MenuProps["items"] = [];

    if (currentStatus === "SOLD_STC") {
      items.push(
        {
          key: "mark_sold",
          label: (
            <div className="flex items-center gap-2.5 py-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <CheckCircleOutlined className="text-xs" />
              </span>
              <div>
                <div className="text-xs font-semibold text-gray-800">
                  Mark as Sold
                </div>
                <div className="text-[10px] text-gray-400">
                  Finalize sale of this property
                </div>
              </div>
            </div>
          ),
          onClick: () =>
            handleInitiateStatusChange(listing, "SOLD", "Sold", true),
        },
        {
          key: "back_to_market",
          label: (
            <div className="flex items-center gap-2.5 py-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                <UndoOutlined className="text-xs" />
              </span>
              <div>
                <div className="text-xs font-semibold text-gray-800">
                  Back to Market (Available)
                </div>
                <div className="text-[10px] text-gray-400">
                  Triggers 'Back on Market' badge
                </div>
              </div>
            </div>
          ),
          onClick: () =>
            handleInitiateStatusChange(
              listing,
              "AVAILABLE",
              "Available",
              false
            ),
        }
      );
    } else if (currentStatus === "SOLD") {
      items.push({
        key: "back_to_market",
        label: (
          <div className="flex items-center gap-2.5 py-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <UndoOutlined className="text-xs" />
            </span>
            <div>
              <div className="text-xs font-semibold text-gray-800">
                Back to Market (Available)
              </div>
              <div className="text-[10px] text-gray-400">
                Reopen listing & trigger 'Back on Market' badge
              </div>
            </div>
          </div>
        ),
        onClick: () =>
          handleInitiateStatusChange(
            listing,
            "AVAILABLE",
            "Available",
            false
          ),
      });
    } else if (currentStatus === "RECENTLY_RELISTED") {
      items.push(
        {
          key: "sold_stc",
          label: (
            <div className="flex items-center gap-2.5 py-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <ClockCircleOutlined className="text-xs" />
              </span>
              <div>
                <div className="text-xs font-semibold text-gray-800">
                  Mark as Sold STC
                </div>
                <div className="text-[10px] text-gray-400">
                  Sets badge to 'SOLD STC'
                </div>
              </div>
            </div>
          ),
          onClick: () =>
            handleInitiateStatusChange(
              listing,
              "SOLD_STC",
              "Sold STC",
              false
            ),
        },
        {
          key: "mark_sold",
          label: (
            <div className="flex items-center gap-2.5 py-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <CheckCircleOutlined className="text-xs" />
              </span>
              <div>
                <div className="text-xs font-semibold text-gray-800">
                  Mark as Sold
                </div>
                <div className="text-[10px] text-gray-400">
                  Finalize sale of this property
                </div>
              </div>
            </div>
          ),
          onClick: () =>
            handleInitiateStatusChange(listing, "SOLD", "Sold", true),
        },
        {
          key: "set_available",
          label: (
            <div className="flex items-center gap-2.5 py-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <UndoOutlined className="text-xs" />
              </span>
              <div>
                <div className="text-xs font-semibold text-gray-800">
                  Set as Available
                </div>
                <div className="text-[10px] text-gray-400">
                  Normal available status
                </div>
              </div>
            </div>
          ),
          onClick: () =>
            handleInitiateStatusChange(
              listing,
              "AVAILABLE",
              "Available",
              false
            ),
        }
      );
    } else {
      // AVAILABLE or other active status (e.g. BACK_ON_MARKET)
      items.push(
        {
          key: "sold_stc",
          label: (
            <div className="flex items-center gap-2.5 py-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <ClockCircleOutlined className="text-xs" />
              </span>
              <div>
                <div className="text-xs font-semibold text-gray-800">
                  Mark as Sold STC
                </div>
                <div className="text-[10px] text-gray-400">
                  Sets badge to 'SOLD STC'
                </div>
              </div>
            </div>
          ),
          onClick: () =>
            handleInitiateStatusChange(
              listing,
              "SOLD_STC",
              "Sold STC",
              false
            ),
        },
        {
          key: "mark_sold",
          label: (
            <div className="flex items-center gap-2.5 py-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <CheckCircleOutlined className="text-xs" />
              </span>
              <div>
                <div className="text-xs font-semibold text-gray-800">
                  Mark as Sold
                </div>
                <div className="text-[10px] text-gray-400">
                  Finalize sale of property
                </div>
              </div>
            </div>
          ),
          onClick: () =>
            handleInitiateStatusChange(listing, "SOLD", "Sold", true),
        },
        {
          key: "relist",
          label: (
            <div className="flex items-center gap-2.5 py-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <SyncOutlined className="text-xs" />
              </span>
              <div>
                <div className="text-xs font-semibold text-gray-800">
                  Relist Property
                </div>
                <div className="text-[10px] text-gray-400">
                  Sets badge to 'Recently Relisted'
                </div>
              </div>
            </div>
          ),
          onClick: () =>
            handleInitiateStatusChange(
              listing,
              "RECENTLY_RELISTED",
              "Recently Relisted",
              false
            ),
        }
      );
    }

    return items;
  };

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
      <div className="grid min-w-[1050px] grid-cols-[2.2fr_0.8fr_1.1fr_0.7fr_0.7fr_1.3fr_280px] gap-6 border-b border-gray-200 bg-gray-50/50 px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600">
        <span>Property</span>
        <span className="text-center">Type</span>
        <span className="text-right">Price</span>
        <span className="text-right">Leads</span>
        <span className="text-right">Views</span>
        <span className="text-center">Status & Badge</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="min-w-[1050px] divide-y divide-gray-100 max-h-[calc(100vh-400px)] overflow-y-auto overflow-x-auto">
        {listings.map((listing) => {
          const id = getListingId(listing);
          const thumb = getListingThumbnail(listing);
          const imageSrc = thumb ? getImage(thumb) : "/cardImg.png";
          const isUpdatingThisListing = updatingListingId === id;
          const isDraftOrRejected =
            listing.status === "DRAFT" || listing.status === "REJECTED";
          const badge = getPrimaryBadge(listing);

          return (
            <div
              key={id}
              className="group grid grid-cols-[2.2fr_0.8fr_1.1fr_0.7fr_0.7fr_1.3fr_280px] items-center gap-6 px-6 py-5 transition-colors hover:bg-gray-50"
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

              <div className="flex flex-col items-center justify-center gap-1.5">
                <StatusBadge status={listing.status} />
                {badge && <PropertyBadge badge={badge} size="xs" />}
              </div>

              <div className="flex items-center justify-end gap-1.5 text-sm opacity-90 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => onDetails(id)}
                  className="flex items-center gap-1 rounded-md px-2.5 py-1.5 font-semibold text-gray-600 transition-colors hover:bg-[#1a3c6e]/5 hover:text-[#1a3c6e]"
                  title="View Details"
                >
                  <Eye size={15} />
                  View
                </button>
                <button
                  onClick={() => onEdit(id)}
                  className="flex items-center gap-1 rounded-md px-2.5 py-1.5 font-semibold text-[#1a3c6e] transition-colors hover:bg-[#1a3c6e]/5 hover:text-[#0f2d5e]"
                  title="Edit Listing"
                >
                  <EditOutlined className="text-[14px]" />
                  Edit
                </button>

                {onMarketStatusChange && (
                  <Dropdown
                    menu={{ items: getMarketStatusMenuItems(listing) }}
                    trigger={["click"]}
                    placement="bottomRight"
                    disabled={isUpdatingThisListing || isDraftOrRejected}
                  >
                    <button
                      disabled={isUpdatingThisListing || isDraftOrRejected}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-semibold text-xs border transition-all ${
                        isUpdatingThisListing
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : isDraftOrRejected
                          ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed opacity-60"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#1a3c6e] hover:text-[#1a3c6e] hover:shadow-xs active:scale-95 cursor-pointer"
                      }`}
                      title={
                        isDraftOrRejected
                          ? "Market status can only be updated once published"
                          : "Change Market Status"
                      }
                    >
                      {isUpdatingThisListing ? (
                        <LoadingOutlined className="text-[13px] animate-spin text-[#1a3c6e]" />
                      ) : (
                        <TagOutlined className="text-[13px]" />
                      )}
                      <span>Status</span>
                      <DownOutlined className="text-[9px] opacity-60" />
                    </button>
                  </Dropdown>
                )}

                <button
                  onClick={() => onDelete(id)}
                  className="flex items-center gap-1 rounded-md px-2.5 py-1.5 font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                  title="Delete Listing"
                >
                  <DeleteOutlined className="text-[14px]" />
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
            Showing{" "}
            <span className="font-medium">
              {(meta.page - 1) * meta.limit + 1}
            </span>{" "}
            to{" "}
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

      {/* Confirmation Modal for significant Market Status changes (e.g. Mark as Sold) */}
      <Modal
        open={confirmModal.open}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
        footer={null}
        centered
        width={440}
        styles={{ body: { padding: "32px 24px" } }}
        className="premium-confirm-modal"
        closable={false}
      >
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-600 shadow-sm">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            Mark Property as Sold?
          </h3>
          <p className="mb-6 px-2 text-[14px] leading-relaxed text-gray-500">
            Are you sure you want to mark{" "}
            <span className="font-semibold text-gray-800">
              "{confirmModal.listingTitle}"
            </span>{" "}
            as <span className="font-bold text-rose-600">SOLD</span>? This will
            display the{" "}
            <span className="font-semibold text-rose-600">SOLD</span> badge on
            your property listing across the platform.
          </p>
          <div className="flex gap-3">
            <Button
              block
              size="large"
              disabled={confirmLoading}
              onClick={() =>
                setConfirmModal((prev) => ({ ...prev, open: false }))
              }
              className="!h-11 !rounded-xl !font-semibold border-gray-200 bg-gray-50/50 text-gray-600 hover:!border-gray-300 hover:!text-gray-800"
            >
              Cancel
            </Button>
            <Button
              block
              size="large"
              type="primary"
              loading={confirmLoading}
              onClick={handleConfirmStatusChange}
              className="!h-11 !rounded-xl !border-rose-600 !bg-rose-600 !font-bold shadow-lg shadow-rose-100 hover:!bg-rose-700"
            >
              Confirm & Mark Sold
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
