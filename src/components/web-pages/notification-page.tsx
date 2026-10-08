"use client";

import { useState } from "react";
import { Typography, Button, Badge, Avatar, Card } from "antd";
import { BellOutlined, ShopOutlined, UserAddOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface Notification {
  id: string;
  type: "order" | "client_update" | "general";
  title: string;
  subtitle: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "order",
      title: "New order Come from Asadujjaman",
      subtitle: "Asad ux ui salon , 76/A Corona, Michigan, Paris",
      timestamp: "8:00am, today",
      isRead: false,
    },
    {
      id: "2",
      type: "order",
      title: "New order Come from Mr. Nadir",
      subtitle: "Asad ux ui salon , 76/A Corona, Michigan, Paris",
      timestamp: "8:00am, today",
      isRead: true,
    },
    {
      id: "3",
      type: "client_update",
      title: "New Clients Update Come from Asadujjaman",
      subtitle: "Asad ux ui salon , 76/A Corona, Michigan, Paris",
      timestamp: "8:00am, today",
      isRead: false,
    },
    {
      id: "4",
      type: "client_update",
      title: "New Clients Update Come from Asadujjaman",
      subtitle: "Asad ux ui salon , 76/A Corona, Michigan, Paris",
      timestamp: "8:00am, today",
      isRead: true,
    },
    {
      id: "5",
      type: "order",
      title: "New order Come from Mr. Nadir",
      subtitle: "Asad ux ui salon , 76/A Corona, Michigan, Paris",
      timestamp: "8:00am, today",
      isRead: true,
    },
    {
      id: "6",
      type: "order",
      title: "New order Come from Asadujjaman",
      subtitle: "Asad ux ui salon , 76/A Corona, Michigan, Paris",
      timestamp: "8:00am, today",
      isRead: true,
    },
    {
      id: "7",
      type: "order",
      title: "New order Come from Mr. Nadir",
      subtitle: "Asad ux ui salon , 76/A Corona, Michigan, Paris",
      timestamp: "8:00am, today",
      isRead: true,
    },
    {
      id: "8",
      type: "order",
      title: "New order Come from Asadujjaman",
      subtitle: "Asad ux ui salon , 76/A Corona, Michigan, Paris",
      timestamp: "8:00am, today",
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleReadAll = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShopOutlined style={{ color: "#52c41a" }} />;
      case "client_update":
        return <UserAddOutlined style={{ color: "#1890ff" }} />;
      default:
        return <BellOutlined style={{ color: "#faad14" }} />;
    }
  };

  const renderNotificationItem = (item: Notification) => (
    <div
      key={item.id}
      onClick={() => handleNotificationClick(item.id)}
      style={{
        padding: "16px 20px",
        backgroundColor: item.isRead ? "#ffffff" : "#f6ffed",
        borderBottom: "1px solid #f0f0f0",
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = item.isRead
          ? "#fafafa"
          : "#f0f9e8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = item.isRead
          ? "#ffffff"
          : "#f6ffed";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", flex: 1 }}>
          <div style={{ marginRight: 12, marginTop: 2 }}>
            <Avatar
              size={32}
              icon={getNotificationIcon(item.type)}
              style={{ backgroundColor: "#f0f0f0" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: 4 }}
            >
              <Text
                strong
                style={{
                  color: "#333",
                  fontSize: 14,
                  marginRight: 8,
                }}
              >
                {item.title}
              </Text>
              {!item.isRead && (
                <Badge
                  dot
                  style={{
                    backgroundColor: "#52c41a",
                  }}
                />
              )}
            </div>
            <Text
              style={{
                color: "#888",
                fontSize: 12,
                lineHeight: 1.4,
              }}
            >
              {item.subtitle}
            </Text>
          </div>
        </div>
        <Text
          style={{
            color: "#bbb",
            fontSize: 12,
            whiteSpace: "nowrap",
            marginLeft: 16,
          }}
        >
          {item.timestamp}
        </Text>
      </div>
    </div>
  );

  return (
    <div
      style={{
        padding: "0 24px",
        borderRadius: "24px",
      }}
    >
      <Card
        style={{
          //   margin: "0 auto",
          borderRadius: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        styles={{ body: { padding: 0 } }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px",
            borderBottom: "1px solid #f0f0f0",
            backgroundColor: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Title level={3} style={{ margin: 0, color: "#333" }}>
              Notifications
            </Title>
            {unreadCount > 0 && (
              <Badge
                count={unreadCount}
                style={{
                  backgroundColor: "#52c41a",
                  marginLeft: 12,
                }}
              />
            )}
          </div>
          <Button
            type="primary"
            onClick={handleReadAll}
            disabled={unreadCount === 0}
            style={{
              borderRadius: 6,
              height: 36,
              paddingLeft: 16,
              paddingRight: 16,
              backgroundColor: "transparent",
              color: unreadCount !== 0 ? "blue" : "gray",
              border: unreadCount !== 0 ? "1px solid blue" : "1px solid gray",
            }}
          >
            Mark all as read
          </Button>
        </div>

        {/* Notifications List */}
        <div style={{ backgroundColor: "#fff" }}>
          {notifications.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#999",
              }}
            >
              <BellOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <div>No notifications yet</div>
            </div>
          ) : (
            <div>{notifications.map(renderNotificationItem)}</div>
          )}
        </div>

        {/* Footer Stats */}
        {notifications.length > 0 && (
          <div
            style={{
              padding: "16px 24px",
              backgroundColor: "#fafafa",
              borderTop: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#666", fontSize: 12 }}>
              Total: {notifications.length} notifications
            </Text>
            <Text style={{ color: "#666", fontSize: 12 }}>
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "All notifications read"}
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
}
