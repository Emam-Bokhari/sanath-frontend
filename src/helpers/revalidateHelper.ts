"use server";

import { cacheTag } from "next/cache";


export async function revalidateCacheTag(tag: string) {
  await cacheTag(tag)
}