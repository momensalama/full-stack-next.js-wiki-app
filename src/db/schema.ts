import { relations } from "drizzle-orm";
import { usersSync } from "drizzle-orm/neon";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  published: boolean("published").default(false).notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => usersSync.id),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
  summary: text("summary"),
});

export const articlesRelations = relations(articles, ({ one }) => ({
  author: one(usersSync, {
    fields: [articles.authorId],
    references: [usersSync.id],
  }),
}));

export { usersSync };

const schema = { articles, articlesRelations, usersSync };
export default schema;

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
