import { apiFetch } from "@/lib/api-fech";
import EnquiryChartSection from "./EnquiryChartSection";

export default async function EnquiryChartSectionLoader({}) {
  const currentYear = new Date().getFullYear();
  const res = await apiFetch(
    `/analytics/agent-enquiry-monthly-stats?year=${currentYear}`,
    {
      next: {
        tags: ["save-searches"],
        revalidate: 3600, // 1 hour
      },
      cache: "force-cache"
    },
    "server"
  );
  console.log('url',`/analytics/agent-enquiry-monthly-stats?year=${currentYear}`)

  return (
    <EnquiryChartSection
      enquiriesData={(res as { data?: unknown })?.data}
    />
  );
}
