import { Card, Col, Row, Typography } from "antd";
import {
  HomeOutlined,
  MessageOutlined,
  HeartOutlined,
} from "@ant-design/icons";


export default function StatusSection({ agentStats }: { agentStats?: any }) {
  const statCards = [
    {
      label: "Total Properties",
      value: agentStats?.totalListings ?? "0",
      icon: <HomeOutlined />,
      bg: "#e6fffa",
      color: "#0d9488",
    },
    {
      label: "Active Properties",
      value: agentStats?.activeListings ?? "0",
      icon: <MessageOutlined />,
      bg: "#e6fffa",
      color: "#0d9488",
    },
    {
      label: "Total Saves",
      value: agentStats?.totalSaved ?? "0",
      icon: <HeartOutlined />,
      bg: "#fff1f2",
      color: "#f43f5e",
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {statCards.map((card, i) => (
        <Col xs={24} sm={8} key={i}>
          <Card
            className="rounded-xl border border-[#f0f0f0] shadow-sm transition-shadow hover:shadow-md"
            styles={{ body: { padding: "24px 28px" } }}
          >
            <div className="flex items-center gap-5">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                style={{ background: card.bg, color: card.color }}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-[#6b7280]">
                  {card.label}
                </p>
                <div className="mt-1 text-3xl font-extrabold leading-tight text-[#1a1a1a]">
                  {card.value ?? "—"}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
