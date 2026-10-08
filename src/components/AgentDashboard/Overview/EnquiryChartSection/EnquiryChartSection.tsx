"use client";

import { Card, Select } from "antd";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const { Option } = Select;

function ChartHeader({ 
  title, 
  year, 
  onYearChange 
}: { 
  title: string; 
  year: string; 
  onYearChange: (value: string) => void 
}) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex items-center justify-between">
      <span className="font-semibold text-gray-800">{title}</span>

      <Select
        value={year}
        onChange={onYearChange}
        size="small"
        className="w-[90px]"
      >
        {Array.from({ length: 5 }, (_, i) => {
          const yearValue = String(currentYear - i);

          return (
            <Option key={yearValue} value={yearValue}>
              {yearValue}
            </Option>
          );
        })}
      </Select>
    </div>
  );
}

const tooltipStyle = {
  contentStyle: {
    background: "#1f2937",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 12,
  },
};

export default function EnquiryChartSection({
  enquiriesData,
}: {
  enquiriesData?: unknown;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentYear = searchParams.get("year") || "2026";

  const handleYearChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const chartData = Array.isArray(enquiriesData) ? enquiriesData : [];
  const maxY = chartData.reduce(
    (m: number, d: { totalEnquiries?: number }) =>
      Math.max(m, Number(d?.totalEnquiries) || 0),
    0
  );

  return (
    <Card
      className="h-full rounded-xl border border-[#f0f0f0] shadow-sm"
      title={
        <ChartHeader 
          title="Total Enquiries Statistics" 
          year={currentYear} 
          onYearChange={handleYearChange} 
        />
      }
      styles={{
        body: { padding: "24px", height: "calc(100% - 56px)" },
      }}
    >
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              domain={[0, maxY]}
              dx={-10}
            />
            <Tooltip {...tooltipStyle} />
            <Area
              type="monotone"
              dataKey="totalEnquiries"
              stroke="#0d9488"
              fill="#0d9488"
              fillOpacity={0.15}
              strokeWidth={3}
            />
            <ReferenceLine x="Jun" stroke="#374151" strokeDasharray="3 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
