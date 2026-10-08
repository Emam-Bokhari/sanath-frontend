
import EnquiryList from "@/components/UserDashboard/Enquiries";
import { apiFetch } from "@/lib/api-fech";

const MOCK_ENQUIRIES: any[] = [
    {
        id: "1",
        propertyTitle: "Stunning Victorian Townhouse",
        price: "£1.3m",
        address: "42 Kensington Park Road",
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80",
        sentTo: "Knight Frank",
        message: "I would like to arrange a viewing for this weekend if possible. Thanks!",
        timeAgo: "2 days ago",
        sentOn: "3/17/2026",
        agent: {
            name: "Sarah Mitchell",
            company: "Knight Frank",
            phone: "+44 20 7861 1111",
            email: "sarah@knightfrank.co.uk",
            avatar: "S",
        },
    },
];

export default async function MyEnquiriesPage() {


    const response = await apiFetch<any>("/enquiries/my-enqueries", {
        method: "GET",
        next: {
            tags: ["profile"],
        },
    }, "server");

    return (
        <div className="max-w-7xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1a3c6e] mb-1">My Enquiries</h1>
                <p className="text-gray-500 text-sm">Track and manage your property enquiries.</p>
            </div>
            <EnquiryList enquiries={response?.data || []} />
        </div>
    );
}