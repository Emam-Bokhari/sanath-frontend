"use client";

import { useState, useEffect, use } from "react";
import { Modal, Pagination } from "antd";
import { Enquiry } from "@/types/enquiry";
import EnquiryCard from "./Enquirycard";
import { useSearchParams, useRouter } from "next/navigation";
import { Meta } from "@/app/agent-dashboard/agent-enquiries/page";
import { apiFetch } from "@/lib/api-fech";
import { revalidateTags } from "@/helpers/revalidateTags";
import { notification } from "antd";
import Link from "next/link";
import { isUserLoggedIn } from "@/services/auth.service";
interface EnquiriesPageProps {
  data: Enquiry[];
  meta: Meta;
  stats: {
    total: number;
    enquired: number;
    contacted: number;
  };
}
let profilePromiseCache: Promise<any> | null = null;
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

export default function EnquiriesPage({
  data,
  meta,
  stats,
}: EnquiriesPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyIdFilter = searchParams.get("propertyId");
  const isLoggedIn = isUserLoggedIn();

  let profile: any = null;
  if (isLoggedIn) {
    profile = use(getMyProfile());
  }
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("searchTerm") || "",
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [activeTab, setActiveTab] = useState<"all" | "ENQUIRED" | "CONTACTED">(
    (searchParams.get("status") as any) || "all",
  );

  // Sync URL with search and status
  const updateQueryParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    if (!updates.page) {
      params.set("page", "1");
    }
    router.push(`?${params.toString()}`);
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== (searchParams.get("searchTerm") || "")) {
        updateQueryParams({ searchTerm: searchQuery });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleTabChange = (tab: "all" | "ENQUIRED" | "CONTACTED") => {
    setActiveTab(tab);
    updateQueryParams({ status: tab });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    updateQueryParams({ page: String(page), limit: String(pageSize) });
  };

  const handleMarkComplete = async (id: string) => {
    try {
      await apiFetch(
        `/enquiries/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: "CONTACTED" }),
        },
        "client",
      );
      revalidateTags(["agent-enquiries"]);
      router.refresh();
    } catch (error) {
      notificationApi.error({
        message:
          (error as { message?: string })?.message ||
          "Failed to update enquiry status",
        description: "Please try again.",
      });
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete Enquiry?",
      content:
        "Are you sure you want to permanently delete this lead? This action cannot be undone.",
      okText: "Yes, Delete",
      okButtonProps: { className: "!bg-red-600 !border-red-600" },
      okType: "danger",
      async onOk() {
        try {
          await apiFetch(
            `/enquiries/${id}`,
            {
              method: "DELETE",
            },
            "client",
          );

          revalidateTags(["agent-enquiries"]);
          router.refresh();
        } catch (error: any) {
          notificationApi.error({
            message: (error as any)?.message || "Failed to delete enquiry",

            description: "Please try again.",
            placement: "topRight",
          });
        }
      },
    });
  };

  const isPremium = profile?.data?.plan?.features?.leadAccess;
  if (!isPremium) {
    return (
      <div className="bg-white py-20 text-center text-gray-400">
        <p className="text-lg font-semibold pb-2">
          Upgrade to Premium to view Enquiries
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
      {contextHolder}
      <div className="max-w-7xl mx-auto">
        {/* Header (Aesthetic-Usability Effect) */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1a3c6e]">
              Enquiries Inbox
            </h1>
            <p className="text-gray-500 mt-1">
              Review and manage your property leads
            </p>
          </div>
          <div className="rounded-lg border border-[#1a3c6e]/10 bg-white px-4 py-2 shadow-sm shrink-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {propertyIdFilter ? "Filtered Leads" : "Total Active Leads"}
            </p>
            <p className="text-lg font-extrabold text-[#1a3c6e]">
              {propertyIdFilter ? meta.total : stats.total}
            </p>
          </div>
        </div>

        {propertyIdFilter && (
          <div className="mb-6 bg-[#1a3c6e]/5 border border-[#1a3c6e]/10 rounded-xl px-5 py-4 flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔍</span>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Showing leads for specific property
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  You are viewing enquiries for:{" "}
                  <span className="font-bold text-[#1a3c6e]">
                    {data[0]?.listingId?.title || "Selected Property"}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("propertyId");
                router.push(`?${params.toString()}`);
              }}
              className="bg-white hover:bg-gray-50 text-[#1a3c6e] border border-[#1a3c6e]/20 font-semibold px-4 py-2 rounded-lg text-xs transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              Show All Leads
            </button>
          </div>
        )}

        {/* Search & Filter Controls (Hick's Law & Jakob's Law) */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm">
          {/* Tabs (Zeigarnik Effect / Hick's Law) */}
          <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
            {(["all", "ENQUIRED", "CONTACTED"] as const).map((tab) => {
              const count =
                tab === "all"
                  ? stats.total
                  : tab === "ENQUIRED"
                    ? stats.enquired
                    : stats.contacted;
              const label =
                tab === "all"
                  ? "all"
                  : tab === "ENQUIRED"
                    ? "new"
                    : "completed";

              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-2 rounded-md text-xs cursor-pointer font-bold transition-all ${
                    activeTab === tab
                      ? "bg-[#1a3c6e] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-955"
                  }`}
                >
                  <span className="capitalize">{label} Leads</span>
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                      activeTab === tab
                        ? "bg-white/20 text-white"
                        : "bg-[#1a3c6e]/10 text-[#1a3c6e]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input (Jakob's Law) */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by name, email, or property..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a3c6e]/20 focus:border-[#1a3c6e] transition-all text-gray-700 font-medium"
            />
            <span className="absolute left-3 top-2 text-gray-400 text-sm">
              🔍
            </span>
          </div>
        </div>

        {/* Leads List */}
        {data.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 text-xl">
              {searchQuery ? "🔍" : activeTab === "CONTACTED" ? "📁" : "🎉"}
            </div>
            <p className="text-lg font-bold text-gray-900">
              {searchQuery
                ? "No matching enquiries found"
                : activeTab === "CONTACTED"
                  ? "No completed enquiries yet"
                  : "Inbox Zero! You are all caught up"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? "Try modifying your keywords or clearing the search box."
                : activeTab === "CONTACTED"
                  ? "Enquiries that you mark as complete will be archived here."
                  : "Outstanding property leads will appear here."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg text-xs transition-all"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((enquiry) => (
              <EnquiryCard
                key={enquiry._id}
                enquiry={enquiry}
                onMarkComplete={handleMarkComplete}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.total > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {(meta.page - 1) * meta.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-gray-900">
                {Math.min(meta.page * meta.limit, meta.total)}
              </span>{" "}
              of <span className="font-bold text-gray-900">{meta.total}</span>{" "}
              leads
            </div>
            {meta.total > meta.limit && (
              <Pagination
                current={meta.page}
                pageSize={meta.limit}
                total={meta.total}
                onChange={handlePageChange}
                showSizeChanger={false}
                className="premium-pagination"
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
