import { headers } from "next/headers";

export async function getSearchParams<T = Record<string, string | string[]>>() {
    const headerList = await headers();
    const search = headerList.get("x-search") || "";

    const params = new URLSearchParams(search);

    const query: Record<string, string | string[]> = {};

    params.forEach((value, key) => {
        if (query[key]) {
            query[key] = Array.isArray(query[key])
                ? [...query[key], value]
                : [query[key] as string, value];
        } else {
            query[key] = value;
        }
    });

    return query as T;
}