"use server";

import { eq } from "drizzle-orm";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { authorizedToEditArticle } from "@/db/authZ";
import { articles } from "@/db/schema";
import { stackServerApp } from "@/stack/server";

export type CreateArticleInput = {
  title: string;
  content: string;
  authorId: string;
  imageUrl?: string;
};

export type UpdateArticleInput = {
  title?: string;
  content?: string;
  imageUrl?: string;
};

export async function createArticle(data: CreateArticleInput) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("❌ Unauthorized");
  }

  console.log("✨ createArticle called:", data);

  await db.insert(articles).values({
    title: data.title,
    content: data.content,
    authorId: user.id,
    imageUrl: data.imageUrl ?? undefined,
    published: true,
    slug: data.title.toLowerCase().replace(/\s+/g, "-"),
  });
  return { success: true, message: "Article create logged (stub)" };
}

export async function updateArticle(id: string, data: UpdateArticleInput) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("❌ Unauthorized");
  }

  const authorized = await authorizedToEditArticle(user.id, Number(id));

  if (!authorized) {
    throw new Error("❌ Forbidden");
  }

  console.log("📝 updateArticle called:", { id, ...data });

  await db
    .update(articles)
    .set({
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl ?? undefined,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(articles.id, Number(id)));

  return { success: true, message: `Article ${id} update logged (stub)` };
}

export async function deleteArticle(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) {
    throw new Error("❌ Unauthorized");
  }

  const authorized = await authorizedToEditArticle(user.id, Number(id));

  if (!authorized) {
    throw new Error("❌ Forbidden");
  }

  console.log("🗑️ deleteArticle called:", id);

  await db.delete(articles).where(eq(articles.id, Number(id)));

  return { success: true, message: `Article ${id} delete logged (stub)` };
}

// Form-friendly server action: accepts FormData from a client form and calls deleteArticle
export async function deleteArticleForm(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (!id) {
    throw new Error("Missing article id");
  }

  await deleteArticle(String(id));
  // After deleting, redirect the user back to the homepage.
  redirect("/");
}
