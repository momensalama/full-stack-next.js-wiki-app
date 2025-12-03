"use server";

import redis from "@/cache";

const keyFor = (pageId: number) => `pageviews:article:${pageId}`;

export async function logPageView(pageId: number) {
  const articleKey = keyFor(pageId);
  const newVal = await redis.incr(articleKey);

  return newVal;
}
