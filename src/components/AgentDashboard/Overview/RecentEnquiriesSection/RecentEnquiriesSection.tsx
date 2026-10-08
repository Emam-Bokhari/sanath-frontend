"use client";

import { Avatar, Button, Card, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

const { Text } = Typography;

function initialsFromName(name: unknown): string {
  const n = typeof name === "string" ? name.trim() : "";
  if (!n) return "?";
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const first = parts[0]?.[0] ?? "";
    const last = parts[parts.length - 1]?.[0] ?? "";
    return `${first}${last}`.toUpperCase();
  }
  return n.slice(0, 2).toUpperCase();
}

function formatCreatedAt(value: unknown): string {
  if (value == null) return "";
  const d = value instanceof Date ? value : new Date(value as string);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function RecentEnquiriesSection({
  recentEnquiriesData,
}: {
  recentEnquiriesData?: unknown;
}) {
  const router = useRouter();
  const list = Array.isArray(recentEnquiriesData) ? recentEnquiriesData : [];

  return (
    <Card
      className="h-full cursor-pointer rounded-xl border border-[#f0f0f0] shadow-sm transition-all duration-300 hover:shadow-md"
      styles={{ body: { padding: 0 } }}
      onClick={() => router.push("/agent-dashboard/agent-enquiries")}
      title={
        <div className="flex items-center justify-between py-1">
          <span className="font-semibold text-gray-800">Recent Enquiries</span>
          <Button
            type="link"
            className="p-0 font-semibold text-[#1a3c6e] hover:opacity-80"
            onClick={(e) => {
              e.stopPropagation();
              router.push("/agent-dashboard/agent-enquiries");
            }}
          >
            View All
          </Button>
        </div>
      }
    >
      <div className="flex h-[320px] flex-col overflow-y-auto">
        {list.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6 py-8 text-sm text-[#9ca3af]">
            No recent enquiries
          </div>
        ) : (
          list.map((e: any, i: number) => (
            <Link
              href="/agent-dashboard/enquiries"
              key={e?.id ?? i}
              className={`flex items-center justify-between px-6 py-5 transition-colors hover:bg-gray-50 ${i !== 0 ? "border-t border-[#f5f5f5]" : ""}`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <Avatar
                  size={46}
                  className="shrink-0 text-sm font-bold"
                  style={{ background: "#e6fffa", color: "#0d9488" }}
                >
                  {initialsFromName(e?.initials ?? e?.name)}
                </Avatar>
                <div className="min-w-0 flex-1">
                  <Text
                    strong
                    className="mb-0.5 block text-[15px] text-[#1a1a1a]"
                  >
                    {e?.name ?? "—"}
                  </Text>
                  <Text className="line-clamp-1 text-xs text-[#6b7280]">
                    {e?.message ?? ""}
                  </Text>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 pl-2">
                <Text className="whitespace-nowrap text-[11px] text-[#9ca3af]">
                  {formatCreatedAt(e?.createdAt)}
                </Text>
              </div>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
}
