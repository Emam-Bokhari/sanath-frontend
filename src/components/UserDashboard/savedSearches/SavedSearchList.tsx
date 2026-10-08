"use client";

import { Empty } from "antd";
import SavedSearchItem from "./SavedSearchItem";

import { toast } from "sonner";
import { apiFetch } from "@/lib/api-fech";
import { notification } from 'antd';
import { revalidateCacheTag } from "@/helpers/revalidateHelper";
import { revalidateTags } from "@/helpers/revalidateTags";


export default function SavedSearchList({ saveSearches }: any) {
  const [api, contextHolder] = notification.useNotification();
  const handleRemove = async (id: string) => {
    console.log("id: ", id);
    try {
      const response = await apiFetch(`/saved-searches/${id}`, { method: "DELETE" }, "client")

      if (response) {
        revalidateTags(['save-searches'])
        api.success({
          message: "Search deleted successfully",
          placement: "topRight",
          duration: 1,
        })
      }

    } catch (err) {
      console.error("SavedSearchList remove error:", err);
      api.error({
        message: "Failed to remove search",
        placement: "topRight",
      })
    }
  };

  if (saveSearches.length === 0) {
    return <Empty description="No saved searches yet" className="py-10" />;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-6">
      {contextHolder}
      {saveSearches.map((item: any) => (
        <SavedSearchItem
          item={item}
          onRemove={handleRemove}
          key={item._id}
        />
      ))}
    </div>
  );
}

