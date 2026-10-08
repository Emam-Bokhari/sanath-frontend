import SubscriptionPage from "@/components/AgentDashboard/Subscription";
import { apiFetch } from "@/lib/api-fech";

export default async function Page() {
    const [plansRes, transactionsRes, subscriptionRes] = await Promise.all([
        apiFetch(
            `/plans`,
            {
                next: {
                    tags: ["plans"],
                    revalidate: 3600,
                },
            },
            "server"
        ),
        apiFetch(
            `/transactions/my-transactions`,
            {
                next: {
                    tags: ["transactions"],
                },
            },
            "server"
        ).catch(() => ({ data: [] })),
        apiFetch(
            `/subscriptions/my-subscription`,
            {
                next: {
                    tags: ["subscription"],
                },
            },
            "server"
        ).catch(() => ({ data: null }))
    ]);
  
  return (
    <SubscriptionPage 
        plansInfo={(plansRes as any)?.data || []} 
        transactions={(transactionsRes as any)?.data || []} 
        mySubscription={(subscriptionRes as any)?.data || null}
    />
  );
}