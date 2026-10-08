import { ReactNode } from "react";
import { getSearchParams } from "@/lib/getSearchParams";
import DashboardLayoutClient from "@/components/layout/DashboardLayoutClient";

export default async function Layout({ children }: { children: ReactNode }) {
  const searchParams = await getSearchParams();

  return (
    <DashboardLayoutClient searchParams={searchParams}>
      {children}
    </DashboardLayoutClient>
  );
}