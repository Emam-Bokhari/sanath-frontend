import { apiFetch } from "@/lib/api-fech";
import RecentEnquiriesSection from "./RecentEnquiriesSection";

export default async function RecentEnquiriesSectionLoader() {
  const res = await apiFetch(
    "/enquiries?limit=5",
    {
      next: {
        tags: ["enquiries"],
        revalidate: 3600, // 1 hour
      },
      cache: "force-cache"
    },
    "server"
  );

  return (
    <RecentEnquiriesSection
      recentEnquiriesData={(res as { data?: unknown })?.data}
    />
  );
}
