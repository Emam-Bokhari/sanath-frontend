import { FaqPage, type Faq } from "@/components/web-pages/Faq";
import { apiFetch } from "@/lib/api-fech";

export default async function FAQ() {
  const res = (await apiFetch(
    `/faqs`,
    {
      next: {
        tags: ["faqs"],
        revalidate: 3600,
      },
    },
    "server",
  )) as { data: { faqs: Faq[] } };

  return <FaqPage faqs={res.data} />;
}
