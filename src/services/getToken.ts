// server/getToken.ts
"use server";
import { authKey } from "@/constants/storageKey";
import { cookies } from "next/headers";


export const getCokkiesToken = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get(authKey)?.value;
    return token
}