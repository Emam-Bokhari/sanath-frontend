import MyListing from "@/components/AgentDashboard/MyListing";
import { apiFetch } from "@/lib/api-fech";
import { Listing } from "@/types/listing";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchTerm?: string;
    status?: string;
  }>;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

const Page = async ({ searchParams }: PageProps) => {
  const resolvedParams = await searchParams;

  const queryParams = new URLSearchParams({
    page: resolvedParams.page || "1",
    limit: resolvedParams.limit || "10",
    searchTerm: resolvedParams.searchTerm || "",
  });

  if (resolvedParams.status && resolvedParams.status !== "all") {
    queryParams.set("status", resolvedParams.status);
  }

  const res = await apiFetch(
    `/listings/my?${queryParams.toString()}`,
    {
      next: {
        tags: ["agent-listings"],
        revalidate: 3600,
      },
    },
    "server"
  );

  return (
    <MyListing
      listings={
        ((res as { data?: Listing[] })?.data || []) as Listing[]
      }
      meta={
        ((res as { meta?: Meta })?.meta || {}) as Meta
      }
    />
  );
};

export default Page;