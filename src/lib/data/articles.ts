import redis from "@/cache";
import { db } from "@/db";

export async function getArticles() {
  const cached = await redis.get<string>("articles:list");

  if (cached) {
    console.log("Cache hit for articles:list");
    return cached;
  }

  console.log("Cache miss for articles:list");

  const response = await db.query.articles.findMany({
    columns: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      summary: true,
    },
    with: {
      author: {
        columns: {
          name: true,
        },
      },
    },
  });

  const articles = response.map((article) => ({
    ...article,
    author: article.author?.name ?? null,
  }));

  await redis.set("articles:list", articles, { ex: 60 * 2 });

  return articles;
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
