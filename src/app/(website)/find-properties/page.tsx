import FindProperties from "@/components/web-pages/FindProperties";
import { apiFetch } from "@/lib/api-fech";

type SearchParams = {
    propertyType?: string;
    searchTerm?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    bathrooms?: string;
    features?: string;
    tenure?: string;
    sort?: string;
    timeFilter?: string;
    lat?: string;
    lng?: string;
    radiusInMiles?: string;
    listingType?: string;
};

const Page = async ({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) => {
    const params = await searchParams;

    // build query dynamically
    const queryObject: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            queryObject[key] = value;
        }
    });

    if (params.lat && params.lng && !params.radiusInMiles) {
        queryObject.radiusInMiles = "50";
    }

    const queryString = new URLSearchParams(queryObject).toString();

    const response = await apiFetch<any>(
        `/listings/search?${queryString}`,
        {
            method: "GET",
            next: {
                tags: ["locations-popular"],
            },
        },
        "server"
    );

    return <FindProperties data={response?.data} />;
};

export default Page;