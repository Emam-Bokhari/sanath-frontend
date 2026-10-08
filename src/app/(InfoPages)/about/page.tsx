import AboutPage from "@/components/InfoPages/About";
import PageHeader from "@/components/shared/PageHeader";
import { apiFetch } from "@/lib/api-fech";

const page = async () => {
  const res = await apiFetch(
    `/rules/about`,
    {
      next: {
        tags: ["agent-listings"],
        revalidate: 3600,
      },
    },
    "server",
  ) as any;
  return (
    <div className="">
      <PageHeader title="About" />
      <AboutPage about={res?.data || ""} />
    </div>
  );
};

export default page;
