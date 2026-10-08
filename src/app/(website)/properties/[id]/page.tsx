import PropertiesDetails from '@/components/web-pages/Properties/PropertiesDetails';
import { apiFetch } from '@/lib/api-fech';

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;


  const response = await apiFetch<any>(
    `/listings/${id}`,
    {
      method: "GET",
      next: {
        tags: ["listing"],
      },
    },
    "server"
  );
  return <PropertiesDetails data={response?.data} />;
}

export default page;