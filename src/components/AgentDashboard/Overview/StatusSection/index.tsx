import { apiFetch } from "@/lib/api-fech";
import StatusSection from "./StatusSection";

export default async function StatsSection() {
  const agentStats = await apiFetch(
    "/analytics/agent-stats",
    {
      next: {
        tags: ["agent-stats"],
        revalidate: 3600, // 1 hour
      },
      cache: "force-cache"
    },
    "server"
  );

  return <StatusSection agentStats={(agentStats as { data?: unknown })?.data} />;
}
