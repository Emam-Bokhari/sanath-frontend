
import AgentDashboardLayoutClient from "@/components/layout/AgentDashboardLayoutClient";
import { getSearchParams } from "@/lib/getSearchParams";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
    const searchParams = await getSearchParams();

    return (
        <AgentDashboardLayoutClient searchParams={searchParams}>
            {children}
        </AgentDashboardLayoutClient>
    );
}