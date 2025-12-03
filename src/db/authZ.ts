import { db } from "@/db";

export const authorizedToEditArticle = async (
  userId: string,
  articleAuthorId: number,
) => {
  const response = await db.query.articles.findFirst({
    where: (articles, { eq }) =>
      eq(articles.authorId, userId) && eq(articles.id, articleAuthorId),
  });

  return response !== null;
};
