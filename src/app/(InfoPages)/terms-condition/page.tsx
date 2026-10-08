import PrivacyPolicy from "@/components/InfoPages/PrivacyPolicy";
import TermsCondition from "@/components/InfoPages/TermsCondition";
import PageHeader from "@/components/shared/PageHeader";
import { apiFetch } from "@/lib/api-fech";

const page = async () => {
  const res = await apiFetch(
    `/rules/terms`,
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
      <PageHeader title="Terms & Conditions" />
      <TermsCondition terms={res?.data || ""} />
    </div>
  );
};

export default page;
