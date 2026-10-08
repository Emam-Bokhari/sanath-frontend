"use client";

import {
    LeftOutlined,
    RightOutlined
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import {
    LayoutDashboard,
    House,
    Mail,
    CreditCard,
    LogOut,
    Bell,
    Settings,
    UserCog,
    User,
    FileText
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const { Sider } = Layout;

interface AgentDashboardSidebarProps {
    collapsed?: boolean;
    onCollapse?: (collapsed: boolean) => void;
}

export default function AgentDashboardSidebar({
    collapsed = false,
    onCollapse,
}: AgentDashboardSidebarProps) {
    const [selectedKey, setSelectedKey] = useState("overview");
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const key = pathname.startsWith("/") ? pathname.substring(1) : pathname;
        setSelectedKey(key || "agent-dashboard/overview");
    }, [pathname]);

    const menuItems = [
        { key: "agent-dashboard/overview", icon: <LayoutDashboard size={18} />, label: "Agent Overview" },
        { key: "agent-dashboard/my-listing", icon: <House size={18} />, label: "My Properties" },
        { key: "agent-dashboard/agent-enquiries", icon: <Mail size={18} />, label: "Enquiries Inbox" },
        { key: "agent-dashboard/subscription", icon: <CreditCard size={18} />, label: "Subscription" },
        { key: "agent-dashboard/agent-notifications", icon: <Settings size={18} />, label: "Notification Settings" },
        { key: "agent-dashboard/agency-profile", icon: <UserCog size={18} />, label: "Profile" },
        { 
            key: "documentation", 
            icon: <FileText size={18} />, 
            label: <a href={process.env.NEXT_PUBLIC_FEED_DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">Documentation</a>
        },
    ];

    // const bottomMenuItems = [
    //     { key: "logout", icon: <LogOut size={18} />, label: "Log out", danger: true },
    // ];

    // const handleLogOut = () => {
    //     // dispatch(logout());
    //     router.push("/auth/login");
    // };

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
                            if (key !== "documentation") {
                                router.push(`/${key}`);
                            }
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
