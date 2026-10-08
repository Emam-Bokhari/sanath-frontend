"use client";

import { useState, useMemo, useEffect, use } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Listing } from "@/types/listing";
import ListingsFilters from "./ListingsFilters";
import ListingsTable from "./ListingsTable";
import ListingModal from "./add-listing/AddListingModal";
import ListingDetailModal from "./ListDetails/ListingDetailModal";
import { Meta } from "@/app/agent-dashboard/my-listing/page";
import { apiFetch } from "@/lib/api-fech";
import { notification } from "antd";
import { revalidateTags } from "@/helpers/revalidateTags";
import { isUserLoggedIn } from "@/services/auth.service";
import Link from "next/link";

let profilePromiseCache: Promise<any> | null = null;

export const invalidateProfileCache = () => {
  profilePromiseCache = null;
};

const getMyProfile = () => {
  if (!profilePromiseCache) {
    profilePromiseCache = apiFetch(
      "/users/profile",
      {
        method: "GET",
      },
      "client",
    );
  }
  return profilePromiseCache;
};

export default function MyListingsPage({
  listings,
  meta,
}: {
  listings: Listing[];
  meta: Meta;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("searchTerm") || "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all",
  );
  const [notificationApi, contextHolder] = notification.useNotification();

  // Add / Edit modal
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Detail modal
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const isLoggedIn = isUserLoggedIn();

  let profile: any = null;
  if (isLoggedIn) {
    profile = use(getMyProfile());
  }
  // Handle URL updates for filters and search
  const updateQueryParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    // Reset to page 1 on filter/search change
    if (!updates.page) {
      params.set("page", "1");
    }
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    updateQueryParams({
      page: page.toString(),
      limit: pageSize.toString(),
    });
  };

  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (searchParams.get("searchTerm") || "")) {
        updateQueryParams({ searchTerm: search });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Status filter update
  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    updateQueryParams({ status });
  };

  const handleDeleteRequest = (id: string) => {
    setListingToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await apiFetch(
        `/listings/my/${id}`,
        {
          method: "DELETE",
        },
        "client",
      );

      await revalidateTags(["agent-listings"]);
      router.refresh();

      notificationApi.success({
        message: "Listing deleted successfully",
        description: "The property listing has been removed from the platform.",
        placement: "topRight",
      });

      handleSuccess();
    } catch (error) {
      console.error("Delete error:", error);
      notificationApi.error({
        message: "Failed to delete listing",
        description: "Please try again later.",
        placement: "topRight",
      });
    }

    setDeleteModalOpen(false);
    setListingToDelete(null);
  };

  const handleDetails = (id: string) => {
    setDetailId(id);
    setDetailOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditId(id);
    setListingModalOpen(true);
  };

  const handleAddNew = () => {
    setEditId(null);
    setListingModalOpen(true);
  };

  const handleModalClose = () => {
    setListingModalOpen(false);
    setEditId(null);
  };

  const handleSuccess = () => {
    revalidateTags(["agent-listings"]);
    router.refresh();
    handleModalClose();
  };

  const isPremium = profile?.data?.plan?.features?.listings;

  if (!isPremium) {
    return (
      <div className="bg-white py-20 text-center text-gray-400">
        <p className="text-lg font-semibold pb-2">
          Upgrade to Premium to view property listings
        </p>
        <div className="mt-6">
          <Link
            href="/agent-dashboard/subscription"
            className="inline-flex items-center justify-center cursor-pointer !bg-[#1a3c6e] !border-[#1a3c6e] !rounded-xl !h-12 shadow-lg shadow-[#1a3c6e]/25 hover:!scale-[1.02] active:!scale-95 transition-all duration-300 font-bold text-white py-3 px-8 text-base hover:!bg-[#234e8c] hover:shadow-[#1a3c6e]/35"
          >
            Upgrade to Premium
          </Link>
        </div>
      </div>
    );
  }
  return (
    <>
      <div>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1a3c6e]">
              My Properties
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and track all your property listings
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleAddNew}
            className="!bg-[#1a3c6e] !border-[#1a3c6e] !rounded-xl !h-11 shadow-lg shadow-[#1a3c6e]/20 hover:!scale-[1.02] active:!scale-95 transition-all font-bold"
          >
            Add Property
          </Button>
        </div>
        {contextHolder}

        {/* Listings Table Card */}
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <ListingsFilters
            search={search}
            status={statusFilter}
            onSearchChange={setSearch}
            onStatusChange={handleStatusChange}
          />
          <ListingsTable
            listings={listings}
            onDelete={handleDeleteRequest}
            onDetails={handleDetails}
            onEdit={handleEdit}
            meta={meta}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Add / Edit Listing Modal */}
      <ListingModal
        open={listingModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        editId={editId}
      />

      {/* View Detail Modal */}
      <ListingDetailModal
        listingId={detailId}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setDetailId(null);
        }}
      />

      {/* Premium Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        footer={null}
        centered
        width={420}
        styles={{ body: { padding: "32px 24px" } }}
        className="premium-confirm-modal"
        closable={false}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-red-100">
            <Trash2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Delete Listing?
          </h3>
          <p className="text-gray-500 mb-8 px-2 text-[15px] leading-relaxed">
            Are you sure you want to delete this listing? This action{" "}
            <span className="text-red-600 font-semibold">cannot be undone</span>{" "}
            and the property will be permanently removed.
          </p>
          <div className="flex gap-3">
            <Button
              block
              size="large"
              onClick={() => setDeleteModalOpen(false)}
              className="!h-12 !rounded-xl !font-semibold border-gray-200 text-gray-600 hover:!border-gray-300 hover:!text-gray-800 bg-gray-50/50"
            >
              Cancel
            </Button>
            <Button
              block
              size="large"
              type="primary"
              danger
              onClick={() =>
                listingToDelete && handleConfirmDelete(listingToDelete)
              }
              className="!h-12 !rounded-xl !font-bold !bg-red-500 !border-red-500 hover:!bg-red-600 shadow-lg shadow-red-100"
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
