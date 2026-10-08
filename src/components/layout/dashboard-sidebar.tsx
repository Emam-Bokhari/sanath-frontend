"use client";

import {
  LeftOutlined,
  RightOutlined
} from "@ant-design/icons";
import { Heart, Send, User, Lock, Settings, LogOut, Bell } from "lucide-react";
import { Layout, Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const { Sider } = Layout;

interface DashboardSidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export default function DashboardSidebar({
  collapsed = false,
  onCollapse,
}: DashboardSidebarProps) {
  const [selectedKey, setSelectedKey] = useState("saved");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const key = pathname.startsWith("/") ? pathname.substring(1) : pathname;
    setSelectedKey(key || "user-dashboard/saved");
  }, [pathname]);

  const menuItems = [
    { key: "user-dashboard/saved", icon: <Heart size={18} />, label: "Saved" },
    { key: "user-dashboard/enquiries", icon: <Send size={18} />, label: "My Enquiries" },
    { key: "user-dashboard/profile", icon: <User size={18} />, label: "Profile" },
    { key: "user-dashboard/notification-settings", icon: <Settings size={18} />, label: "Notification Settings" },
    { key: "user-dashboard/password-security", icon: <Lock size={18} />, label: "Password & Security" },
  ];

  // const bottomMenuItems = [
  //   { key: "user-dashboard/logout", icon: <LogOut size={18} />, label: "Log out", danger: true },
  // ];

  const handleLogOut = () => {
    // dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <>
      <style jsx global>{`
        .ant-layout-sider-children {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
      `}</style>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        width={280}
        collapsedWidth={80}
        trigger={null}
        theme="light"
        className="!bg-white border-r border-slate-100 h-full flex flex-col shadow-[1px_0_10px_rgba(0,0,0,0.02)]"
      >
        <div className="flex-1 h-full py-4 flex flex-col justify-between overflow-hidden">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            inlineIndent={20}
            className="!border-none text-[14px] font-medium flex-1 overflow-y-auto overflow-x-hidden"
            onClick={({ key }) => {
              router.push(`/${key}`);
            }}
          />
          {/* <div className="border-t border-gray-100 pt-2 pb-2">
            <Menu
              mode="inline"
              selectable={false}
              items={bottomMenuItems}
              inlineIndent={20}
              className="!border-none text-[14px] font-medium"
              onClick={({ key }) => {
                if (key === "logout") {
                  handleLogOut();
                }
              }}
            />
          </div> */}
        </div>

        <button
          onClick={() => onCollapse?.(!collapsed)}
          className="absolute -right-3 top-20 bg-white border border-slate-100 rounded-full w-6 h-6 flex items-center justify-center shadow-md text-slate-400 hover:text-[#1a3c6e] transition-colors z-30"
        >
          {collapsed ? <RightOutlined style={{ fontSize: 10 }} /> : <LeftOutlined style={{ fontSize: 10 }} />}
        </button>
      </Sider>
    </>
  );
}