export function StatsSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-[#f0f0f0] bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 shrink-0 animate-pulse rounded-2xl bg-gray-200" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSectionSkeleton() {
  return (
    <div className="rounded-xl border border-[#f0f0f0] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#f5f5f5] px-6 py-4">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-[90px] animate-pulse rounded-md bg-gray-200" />
      </div>
      <div className="p-6">
        <div className="h-[320px] w-full animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

export function RecentSectionSkeleton() {
  return (
    <div className="rounded-xl border border-[#f0f0f0] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#f5f5f5] px-6 py-4">
        <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="flex flex-col divide-y divide-[#f5f5f5]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 px-6 py-5"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-gray-200" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-40 max-w-full animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-full max-w-[12rem] animate-pulse rounded bg-gray-200" />
              </div>
            </div>
            <div className="h-3 w-20 shrink-0 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
