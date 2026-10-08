import { Suspense } from "react";
import StatsSection from "@/components/AgentDashboard/Overview/StatusSection";
import EnquiryChartSection from "@/components/AgentDashboard/Overview/EnquiryChartSection";
import RecentEnquiriesSection from "@/components/AgentDashboard/Overview/RecentEnquiriesSection";
import {
  StatsSectionSkeleton,
  ChartSectionSkeleton,
  RecentSectionSkeleton,
} from "./overview-skeletons";

export default function AgentOverviewPage() {
  const userRole = "Agent";

  return (
    <div className="space-y-6 p-6">
      <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1a3c6e]">
            Agent Dashboard
          </h1>
          <p className="mt-1 text-gray-500">
            Welcome back, {userRole}. Here&apos;s what&apos;s happening today.
          </p>
        </div>
      </div>

      <Suspense fallback={<StatsSectionSkeleton />}>
        <StatsSection />
      </Suspense>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-7 xl:col-span-8">
          <Suspense fallback={<ChartSectionSkeleton />}>
            <EnquiryChartSection />
          </Suspense>
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <Suspense fallback={<RecentSectionSkeleton />}>
            <RecentEnquiriesSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
