import { db } from "@/db";

export async function getArticles() {
  const response = await db.query.articles.findMany({
    columns: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
    with: {
      author: {
        columns: {
          name: true,
        },
      },
    },
  });

  return response.map((article) => ({
    ...article,
    author: article.author?.name ?? null,
  }));
}

export async function getArticleById(id: number) {
  const response = await db.query.articles.findFirst({
    columns: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      imageUrl: true,
    },
    with: {
      author: {
        columns: {
          name: true,
        },
      },
    },
    where: (articles, { eq }) => eq(articles.id, id),
  });

  return response
    ? {
        ...response,
        author: response.author?.name ?? null,
      }
    : null;
}
