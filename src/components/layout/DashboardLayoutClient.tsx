"use client";

import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "./dashboard-sidebar";
import DashboardBackButton from "./DashboardBackButton";

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 80;

export default function DashboardLayoutClient({
    children,
    searchParams,
}: {
    children: ReactNode;
    searchParams: Record<string, string | string[]>;
}) {
    const router = useRouter();
    // TODO: Get user from context
    const user = null;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const displayName = mounted ? ("My Account") : "My Account";

    const [collapsed, setCollapsed] = useState(
        searchParams?.collapsed === "true"
    );
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (searchParams?.collapsed !== undefined) {
            setCollapsed(searchParams.collapsed === "true");
        }
    }, [searchParams]);

    const handleSetQuery = (value: boolean) => {
        const params = new URLSearchParams(window.location.search);
        params.set("collapsed", String(value));
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex bg-[#F9FAFB] min-h-[calc(100vh-72px)]">
            {/* Desktop Sidebar */}
            <div
                className="hidden lg:block flex-shrink-0 transition-all duration-300"
                style={{
                    width: collapsed
                        ? SIDEBAR_COLLAPSED_WIDTH
                        : SIDEBAR_WIDTH,
                }}
            >
                <div className="sticky top-[72px] h-[calc(100vh-72px)]">
                    <DashboardSidebar
                        collapsed={collapsed}
                        onCollapse={(val) => {
                            setCollapsed(val);
                            handleSetQuery(val);
                        }}
                    />
                </div>
            </div>

            {/* Mobile Drawer */}
            <Drawer
                placement="left"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                width={280}
                styles={{ body: { padding: 0 }, header: { display: "none" } }}
                className="lg:hidden"
            >
                <DashboardSidebar
                    collapsed={false}
                    onCollapse={() => setMobileOpen(false)}
                />
            </Drawer>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Top Bar */}
                <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 sticky top-[72px] z-40">
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ fontSize: 18 }} />}
                        onClick={() => setMobileOpen(true)}
                    />
                    <span className="font-semibold text-gray-800 text-sm">
                        {displayName}
                    </span>
                </div>

                <main className="flex-1 px-4 py-8 md:px-12 md:py-10">
                    <div className="max-w-7xl mx-auto">
                        {/* <DashboardBackButton fallbackHref="/user-dashboard/saved" /> */}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
