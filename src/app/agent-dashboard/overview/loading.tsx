import {
  StatsSectionSkeleton,
  ChartSectionSkeleton,
  RecentSectionSkeleton,
} from "./overview-skeletons";

export default function OverviewLoading() {
  const userRole = "Agent";

  return (
    <div className="space-y-6 p-6">
      <div className="mb-2">
        <h1 className="text-3xl font-extrabold text-[#1a3c6e]">
          Agent Dashboard
        </h1>
        <p className="mt-1 text-gray-500">
          Welcome back, {userRole}. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      <StatsSectionSkeleton />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-7 xl:col-span-8">
          <ChartSectionSkeleton />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <RecentSectionSkeleton />
        </div>
      </div>
    </div>
  );
}
