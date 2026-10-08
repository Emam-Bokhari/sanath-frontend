"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authKey } from "@/constants/storageKey";

export async function removeAccessTokenToCookie(options?: { redirect?: string }) {
  const cookieStore = await cookies(); // ✅ await here

  // Delete the cookie
  cookieStore.delete(authKey);

  // Optional redirect
  if (options?.redirect) {
    redirect(options.redirect);
  }
}