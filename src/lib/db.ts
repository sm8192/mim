import "server-only";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env.local for local development " +
      "(see README). On Vercel it is provided by the Neon integration.",
  );
}

/**
 * Neon's serverless driver. Use as a tagged template for safe,
 * parameterized queries:
 *
 *   const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
 */
export const sql = neon(databaseUrl);

export type UserRow = {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
};
