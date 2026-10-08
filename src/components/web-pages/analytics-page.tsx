"use client";

import { Card, Col, Row, Select, Typography, Avatar, Button } from "antd";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  DollarOutlined,
  FileTextOutlined,
  TrophyOutlined,
  RiseOutlined,
  HomeOutlined,
  MessageOutlined,
  HeartOutlined,
  RightOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

// ─── Data ────────────────────────────────────────────────────────────────────

const metricsData = [
  { title: "Total Sales", total: "20,555", daily: "29", icon: <DollarOutlined />, bg: "#e6f7ff", color: "#1890ff" },
  { title: "Total Quotes Fertiliser", total: "109,558 tn", daily: "1,392tn", icon: <FileTextOutlined />, bg: "#f0fdf4", color: "#22c55e" },
  { title: "Total Earning", total: "109,558 tn", daily: "1,392tn", icon: <TrophyOutlined />, bg: "#fff7e6", color: "#f59e0b" },
  { title: "Total Profit", total: "109,558 tn", daily: "1,392tn", icon: <RiseOutlined />, bg: "#fdf2f8", color: "#a855f7" },
];

const statCards = [
  { label: "Active Listings", value: "24", icon: <HomeOutlined />, bg: "#e6fffa", color: "#0d9488" },
  { label: "New Enquiries", value: "8", icon: <MessageOutlined />, bg: "#e6fffa", color: "#0d9488" },
  { label: "Total Saves", value: "156", icon: <HeartOutlined />, bg: "#fff1f2", color: "#f43f5e" },
];

const earningData = [
  { month: "Jan", earning: 85, profit: 65 },
  { month: "Feb", earning: 92, profit: 78 },
  { month: "Mar", earning: 78, profit: 85 },
  { month: "Apr", earning: 88, profit: 72 },
  { month: "May", earning: 95, profit: 88 },
  { month: "Jun", earning: 82, profit: 75 },
  { month: "Jul", earning: 90, profit: 82 },
  { month: "Aug", earning: 87, profit: 79 },
  { month: "Sept", earning: 93, profit: 86 },
  { month: "Oct", earning: 89, profit: 83 },
  { month: "Nov", earning: 96, profit: 91 },
  { month: "Dec", earning: 91, profit: 87 },
];

const quotesData = [
  { month: "Jan", quotes: 1200 }, { month: "Feb", quotes: 1800 },
  { month: "Mar", quotes: 1600 }, { month: "Apr", quotes: 2200 },
  { month: "May", quotes: 1900 }, { month: "Jun", quotes: 2400 },
  { month: "Jul", quotes: 1800 }, { month: "Aug", quotes: 2100 },
  { month: "Sept", quotes: 1700 }, { month: "Oct", quotes: 2300 },
  { month: "Nov", quotes: 2000 }, { month: "Dec", quotes: 1900 },
];

const fertiliserData = [
  { month: "Jan", sold: 320 }, { month: "Feb", sold: 280 },
  { month: "Mar", sold: 350 }, { month: "Apr", sold: 380 },
  { month: "May", sold: 420 }, { month: "Jun", sold: 450 },
  { month: "Jul", sold: 380 }, { month: "Aug", sold: 480 },
  { month: "Sept", sold: 520 }, { month: "Oct", sold: 490 },
  { month: "Nov", sold: 580 }, { month: "Dec", sold: 550 },
];

const enquiries = [
  { initials: "TW", name: "Tom Walker", subject: "Stunning Victorian Townhouse", time: "2 hours ago", bg: "#e6fffa", color: "#0d9488" },
  { initials: "AJ", name: "Alice Johnson", subject: "Stunning Victorian Townhouse", time: "2 hours ago", bg: "#e6fffa", color: "#0d9488" },
  { initials: "MK", name: "Mark King", subject: "Stunning Victorian Townhouse", time: "2 hours ago", bg: "#e6fffa", color: "#0d9488" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChartHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-semibold text-gray-800">{title}</span>
      <Select defaultValue="Year" size="small" className="w-[80px]">
        <Option value="Year">Year</Option>
        <Option value="Month">Month</Option>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const userRole = "Admin";

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Title level={2} className="text-[#0d9488] mb-1 text-[28px]">
            Agent Dashboard
          </Title>
          <Text className="text-[#6b7280] text-sm">
            Welcome back, {userRole}. Here&apos;s what&apos;s happening today.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-[#0d9488] border-[#0d9488] h-10 rounded-lg font-semibold shrink-0"
        >
          Add Listing
        </Button>
      </div>

      {/* Quick Stat Cards (like reference image top row) */}
      <Row gutter={[16, 16]}>
        {statCards.map((card, i) => (
          <Col xs={24} sm={8} key={i}>
            <Card
              className="rounded-xl border border-[#f0f0f0]"
              styles={{ body: { padding: "20px 24px" } }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: card.bg, color: card.color }}
                >
                  {card.icon}
                </div>
                <div>
                  <Text className="text-[#6b7280] text-[13px]">{card.label}</Text>
                  <div className="text-[28px] font-bold text-[#1a1a1a] leading-tight">
                    {card.value}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Metrics Cards */}
      <Row gutter={[16, 16]}>
        {metricsData.map((m, i) => (
          <Col xs={24} sm={12} xl={6} key={i}>
            <Card className="rounded-xl border border-[#f0f0f0]" styles={{ body: { padding: "20px 24px" } }}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ background: m.bg, color: m.color }}
                >
                  {m.icon}
                </div>
                <Text strong className="text-sm text-[#374151]">{m.title}</Text>
              </div>
              <Text className="text-[11px] text-[#9ca3af] block mb-1.5">
                13 NOV, 2024
              </Text>
              <div className="flex justify-between">
                <div>
                  <Text className="text-[#9ca3af] text-xs">Total: </Text>
                  <Text strong className="text-sm text-[#1a1a1a]">{m.total}</Text>
                </div>
                <div>
                  <Text className="text-[#9ca3af] text-xs">Daily: </Text>
                  <Text strong className="text-sm text-[#1890ff]">{m.daily}</Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Enquiries */}
      <Card
        className="rounded-xl border border-[#f0f0f0] my-5"
        styles={{ body: { padding: 0 } }}
        title={
          <div className="flex items-center justify-between py-1">
            <span className="font-semibold text-gray-800">Recent Enquiries</span>
            <Button type="link" className="text-[#0d9488] font-semibold p-0">
              View All
            </Button>
          </div>
        }
      >
        {enquiries.map((e, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${i === 0 ? "border-t border-[#f0f0f0]" : ""} border-b border-[#f5f5f5]`}
          >
            <div className="flex items-center gap-4">
              <Avatar
                size={42}
                className="font-bold text-[13px] shrink-0"
                style={{ background: e.bg, color: e.color }}
              >
                {e.initials}
              </Avatar>
              <div>
                <Text strong className="text-[15px] text-[#1a1a1a] block">{e.name}</Text>
                <Text className="text-[13px] text-[#6b7280]">Regarding: {e.subject}</Text>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Text className="text-xs text-[#9ca3af] whitespace-nowrap">{e.time}</Text>
              <RightOutlined className="text-[11px] text-[#9ca3af]" />
            </div>
          </div>
        ))}
      </Card>

      {/* Earning Statistics */}
      <Card
        className="rounded-xl border border-[#f0f0f0]"
        title={
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800">Earning Statistics</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#6DBD44]" />
                <Text className="text-xs">Earning</Text>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#1890ff]" />
                <Text className="text-xs">Profit</Text>
              </div>
              <Select defaultValue="Year" size="small" className="w-[80px]">
                <Option value="Year">Year</Option>
                <Option value="Month">Month</Option>
              </Select>
            </div>
          </div>
        }
      >
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={earningData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis hide />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="earning" stroke="#6DBD44" fill="#6DBD44" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="profit" stroke="#1890ff" fill="#1890ff" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            className="rounded-xl border border-[#f0f0f0]"
            title={<ChartHeader title="Total Quotes Statistics" />}
          >
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={quotesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                  <YAxis hide />
                  <Tooltip {...tooltipStyle} />
                  <Area type="monotone" dataKey="quotes" stroke="#6DBD44" fill="#6DBD44" fillOpacity={0.2} strokeWidth={2} />
                  <ReferenceLine x="Jun" stroke="#374151" strokeDasharray="3 3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            className="rounded-xl border border-[#f0f0f0]"
            title={<ChartHeader title="Sold Fertiliser Statistics" />}
          >
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fertiliserData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                  <YAxis hide />
                  <Tooltip {...tooltipStyle} formatter={(v) => [`${v}tn`, "Sold"]} />
                  <Line
                    type="monotone" dataKey="sold" stroke="#6DBD44" strokeWidth={2.5}
                    dot={{ fill: "#6DBD44", r: 3 }} activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}