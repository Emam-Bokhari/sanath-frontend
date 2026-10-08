"use client";
import { ConfigProvider, Tabs } from "antd";
import { Heart, Search } from "lucide-react";
import SaveProperties from "@/components/UserDashboard/saveProperties";
import SavedSearchList from "@/components/UserDashboard/savedSearches/SavedSearchList";



export default function SavedPage({ favoriteProperties, saveSearches }: { favoriteProperties: any[], saveSearches: any[] }) {
    const items = [
        {
            key: "properties",
            label: (
                <span className="flex items-center gap-2 px-2">
                    <Heart size={16} />
                    Saved Properties
                </span>
            ),
            children: (
                <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <SaveProperties favoriteProperties={favoriteProperties} />
                </div>
            ),
        },
        {
            key: "searches",
            label: (
                <span className="flex items-center gap-2 px-2">
                    <Search size={16} />
                    Saved Searches
                </span>
            ),
            children: (
                <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <SavedSearchList saveSearches={saveSearches} />
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-7xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1a3c6e] mb-1">Saved</h1>
                <p className="text-gray-500 text-sm">Manage your saved properties and search alerts.</p>
            </div>

            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#1a3c6e',
                    }
                }}
            >
                <Tabs
                    defaultActiveKey="properties"
                    items={items}
                    className="custom-tabs"
                    size="large"
                />
            </ConfigProvider>

            <style jsx global>{`
        .custom-tabs .ant-tabs-nav::before {
          border-bottom: 1px solid #f0f0f0;
        }
        .custom-tabs .ant-tabs-tab {
          padding: 12px 0 !important;
          margin-right: 32px !important;
        }
        .custom-tabs .ant-tabs-tab-btn {
          font-weight: 600 !important;
          font-size: 15px !important;
          color: #6b7280 !important;
          transition: all 0.3s !important;
        }
        .custom-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #1a3c6e !important;
        }
        .custom-tabs .ant-tabs-ink-bar {
          background: #1a3c6e !important;
          height: 3px !important;
          border-radius: 3px 3px 0 0;
        }
      `}</style>
        </div>
    );
}
