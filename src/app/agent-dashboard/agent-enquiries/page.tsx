import EnquiriesPage from '@/components/AgentDashboard/EnquiriesPage'
import { apiFetch } from '@/lib/api-fech';
import { Enquiry } from '@/types/enquiry';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    searchTerm?: string;
    status?: "ENQUIRED" | "CONTACTED" | "all";
  }>;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

    interface  Stats {
        "total": number;
        "enquired": number;
        "contacted": number;
    }

const page = async ({ searchParams }: PageProps) => {
    
    const resolvedParams = await searchParams;
  
    const queryParams = new URLSearchParams({
      page: resolvedParams.page || "1",
      limit: resolvedParams.limit || "10",
      searchTerm: resolvedParams.searchTerm || "",
    });
  
    if (resolvedParams.status && resolvedParams.status !== "all") {
      queryParams.set("status", resolvedParams.status);
    }
    console.log("apiEndpoint", queryParams.toString());
  
    const res = await apiFetch(
      `/enquiries?${queryParams.toString()}`,
      {
        next: {
          tags: ["agent-enquiries"],
          revalidate: 3600,
        },
      },
      "server"
    );
  

    console.log("res", res);

    return (
      <div>
        <EnquiriesPage 
          meta={(res as { count?: { total: number; contacted: number } } & { meta?: Meta })?.meta || { page: 1, limit: 10, total: 0, totalPage: 0 }}
          data={(res as { data?: Enquiry[] })?.data || []}
          stats={(res as { stats?: Stats })?.stats || { total: 0, enquired: 0, contacted: 0 }}
        />
      </div>
    );
};

export default page