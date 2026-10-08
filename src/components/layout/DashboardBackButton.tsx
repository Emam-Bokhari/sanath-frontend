"use client";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { usePathname, useRouter } from "next/navigation";

type DashboardBackButtonProps = {
  fallbackHref: string;
};

export default function DashboardBackButton({ fallbackHref }: DashboardBackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  };

  // Only show the back button if we are deeper than a top-level page
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) {
    return null;
  }

  return (
    <Button
      type="text"
      icon={<ArrowLeftOutlined />}
      onClick={handleBack}
      className="!inline-flex !items-center !gap-2 !h-8 !px-0 !mb-3 !text-[#1a3c6e] !font-semibold hover:!text-[#0f2d5e] hover:!bg-transparent"
    >
      Back
    </Button>
  );
}
