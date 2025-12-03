import "dotenv/config";
import assert from "node:assert";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

assert(
  process.env.DATABASE_URL,
  "DATABASE_URL is not defined in environment variables",
);

export const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
