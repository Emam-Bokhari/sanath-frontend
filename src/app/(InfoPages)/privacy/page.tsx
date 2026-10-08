import PrivacyPolicy from "@/components/InfoPages/PrivacyPolicy";
import PageHeader from "@/components/shared/PageHeader";
import { apiFetch } from "@/lib/api-fech";

const page = async () => {
  const res = await apiFetch(
    `/rules/privacy`,
    {
      next: {
        tags: ["agent-listings"],
        revalidate: 3600,
      },
    },
    "server",
  ) as any;
  return (
    <div>
      <PageHeader title="Privacy Policy" />
      <PrivacyPolicy terms={res?.data || ""} />
    </div>
  );
};

export default page;
