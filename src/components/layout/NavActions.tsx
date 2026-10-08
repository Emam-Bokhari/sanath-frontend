"use client";

import { Button, Avatar, Popover, Badge } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Bell, User, LogOut, LayoutDashboard, Settings, Clock } from "lucide-react";
import { getUserInfo, isUserLoggedIn, logout } from "@/services/auth.service";
import { removeAccessTokenToCookie } from "@/services/removeTokeknFromCookie";
import { apiFetch, getImage } from "@/lib/api-fech";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// Cache the promise globally to prevent infinite promise creation on each render
let profilePromiseCache: Promise<any> | null = null;
let notificationPromiseCache: Promise<any> | null = null;

export const invalidateProfileCache = () => {
    profilePromiseCache = null;
    notificationPromiseCache = null;
};

const getMyProfile = () => {
    if (!profilePromiseCache) {
        profilePromiseCache = apiFetch("/users/profile", {
            method: "GET",
        }, "client");
    }
    return profilePromiseCache;
};

const getNotifications = () => {
    if (!notificationPromiseCache) {
        notificationPromiseCache = apiFetch("/notifications?page=1&limit=5", {
            method: "GET",
        }, "client");
    }
    return notificationPromiseCache;
};

export default function NavActions() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [markingAll, setMarkingAll] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        logout();
        invalidateProfileCache(); // Clear the global cache on logout
        router.refresh();
        removeAccessTokenToCookie({
            redirect: "/auth/login"
        });
    };

    const handleMarkAllRead = async () => {
        setMarkingAll(true);
        try {
            await apiFetch("/notifications", {
                method: "PATCH",
            }, "client");
            invalidateProfileCache(); // Reset notification cache to fetch fresh data
            router.refresh();
        } catch (err) {
            console.error("Mark all read error:", err);
        } finally {
            setMarkingAll(false);
        }
    };

    if (!mounted) {
        return <div className="w-10 h-10 animate-pulse bg-gray-50 rounded-full" />;
    }

    const isLoggedIn = isUserLoggedIn();
    const user = getUserInfo() as any;
    const isAgent = user?.role === "AGENT";

    // Use React's "use" hook as requested
    let profile: any = null;
    let notificationsRes: any = null;
    if (isLoggedIn) {
        profile = use(getMyProfile());
        notificationsRes = use(getNotifications());
    }

    const userInfo = profile?.data || null;
    const notifications = notificationsRes?.data || [];
    const meta = notificationsRes?.meta;
    const unreadCount = meta?.unreadCount || 0;

    if (isLoggedIn && userInfo) {
        return (
            <div className="flex items-center gap-4 sm:gap-6 animate-in fade-in duration-300">
                <Popover
                    content={
                        <div className="w-80 -m-3">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
                                <h4 className="font-bold text-[#1a3c6e] m-0">Notifications</h4>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        disabled={markingAll}
                                        className="text-[10px] font-bold bg-[#14b8a6] hover:bg-[#14b8a6]/90 text-white px-2 py-0.5 rounded-full uppercase tracking-wide cursor-pointer disabled:opacity-50 transition-colors"
                                    >
                                        {markingAll ? "..." : `${unreadCount} New - Mark Read`}
                                    </button>
                                )}
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((item: any) => (
                                        <div 
                                            key={item._id}
                                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!item.read ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <p className={`text-sm m-0 leading-tight ${!item.read ? 'text-gray-900 font-bold' : 'text-gray-600 font-semibold'}`}>
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-gray-500 m-0 mt-1.5 flex items-center gap-1">
                                                <Clock size={10} />
                                                {dayjs(item.createdAt).fromNow()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-400">
                                        <p className="text-sm m-0">No notifications yet</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 border-t border-gray-100 text-center bg-gray-50 rounded-b-lg">
                                <Link href={` ${isAgent ? "/agent-dashboard/agent-notifications" : "/user-dashboard/user-notifications"}`} className="text-[#14b8a6] text-sm font-bold hover:underline block">
                                    View All
                                </Link>
                            </div>
                        </div>
                    }
                    trigger="hover"
                    placement="bottomRight"
                >
                    <Badge count={unreadCount} size="small" offset={[-2, 2]} color="#14b8a6">
                        <div className="p-2 hover:bg-gray-50 rounded-full transition-all group cursor-pointer">
                            <Bell className="text-gray-400 group-hover:text-[#1a3c6e]" size={20} />
                        </div>
                    </Badge>
                </Popover>

                <Popover
                    content={
                        <div className="w-56 py-1.5 flex flex-col">
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account</span>
                                    {userInfo?.role && (
                                        <span className="text-[9px] font-black bg-[#1a3c6e]/10 text-[#1a3c6e] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            {userInfo.role}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-extrabold text-[#1a3c6e] mt-1 m-0 truncate">{userInfo?.name}</p>
                            </div>
                            <Link
                                href={isAgent ? "/agent-dashboard/overview" : "/user-dashboard/saved"}
                                className="flex items-center gap-3 px-4 py-2.5 text-[#1a3c6e]! hover:bg-gray-50! hover:text-[#1a3c6e]! font-bold! text-[14px]! transition-all!"
                            >
                                <LayoutDashboard size={16} />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                href={isAgent ? "/agent-dashboard/agency-profile" : "/user-dashboard/profile"}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50! text-[#1a3c6e]! hover:text-[#1a3c6e]! font-bold! text-[14px]! transition-all!"
                            >
                                {isAgent ? <Settings size={16} /> : <User size={16} />}
                                <span>{isAgent ? "Agency Profile" : "My Profile"}</span>
                            </Link>
                            <div className="h-px bg-gray-100 my-1.5" />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full text-left px-4 py-2.5 hover:bg-red-50! text-red-500! font-bold! text-[14px]! transition-all!"
                            >
                                <LogOut size={16} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    }
                    trigger="hover"
                    placement="bottomRight"
                >
                    <div className="flex items-center cursor-pointer group">
                        <Avatar
                            size={42}
                            src={userInfo?.profileImage ? getImage(userInfo?.profileImage) : undefined}
                            icon={<User className="text-[#1a3c6e] w-5 h-5" />}
                            className="bg-[#1a3c6e]/10 border-2 ring-2 transition-all shadow-sm flex items-center justify-center object-cover"
                        />
                    </div>
                </Popover>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 sm:gap-4 animate-in fade-in duration-300">
            <Link href="/auth/login">
                <Button
                    size="large"
                    className="!border-[#1a3c6e] !text-[#1a3c6e] !font-bold !text-[14px] !rounded-xl min-w-[100px] sm:min-w-[110px] !h-10 sm:!h-11 hover:!bg-gray-50 transition-all"
                >
                    Sign In
                </Button>
            </Link>
            <Link href="/auth/signup">
                <Button
                    type="primary"
                    size="large"
                    className="hidden sm:inline-flex !bg-[#1a3c6e] !border-[#1a3c6e] !font-bold !text-[14px] !rounded-xl min-w-[100px] sm:min-w-[110px] !h-10 sm:!h-11 shadow-md shadow-[#1a3c6e]/20 hover:!scale-[1.02] active:!scale-95 transition-all"
                >
                    Register
                </Button>
            </Link>
        </div>
    );
}
