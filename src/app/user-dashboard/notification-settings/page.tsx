import UserNotifications, { type Notification, type NotificationMeta } from '@/components/UserDashboard/UserNotifications'
import { apiFetch } from '@/lib/api-fech'

interface PageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
    }>;
}

const page = async ({ searchParams }: PageProps) => {
    const resolvedParams = await searchParams;

    const queryParams = new URLSearchParams({
        page: resolvedParams.page || "1",
        limit: resolvedParams.limit || "10",
    });

 

    const [res, notificationPreferencesRes] = await Promise.all([
        apiFetch<any>(`/notifications?${queryParams.toString()}`, {
            method: "GET",
            next: {
                tags: ["notifications"],
            },
        }, "server"),
        apiFetch<any>("/notification-preferences", {
            method: "GET",
        }, "server").catch(() => null)
    ]);

    const notifications = res?.data || [];
    const meta = res?.meta;
    const notificationPreferences = notificationPreferencesRes?.data || null;

    return (
        <div>
            <UserNotifications 
                notifications={notifications} 
                meta={meta} 
                notificationPreferences={notificationPreferences}
            />
        </div>
    )
}

export default page
