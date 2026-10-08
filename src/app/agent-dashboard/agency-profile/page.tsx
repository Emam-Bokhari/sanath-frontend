import AgencyProfilePage from "@/components/AgentDashboard/AgentProfile";
import { apiFetch } from "@/lib/api-fech";

const Page = async () => {
  const [res, feeds] = await Promise.all([
    apiFetch("/users/profile", { method: "GET" }, "server"),
    apiFetch("/agent-feeds", { method: "GET" }, "server"),
  ]);

  const profile = (res as any)?.data || null;

  return <AgencyProfilePage profile={profile} feeds={(feeds as any)?.data || []} />;
};

export default Page;
