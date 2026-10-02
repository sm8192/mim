// One-off migration runner: applies db/schema.sql to the database in
// DATABASE_URL. Run with: node --env-file=.env.local scripts/migrate.mjs
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url || url.includes("host.neon.tech/dbname")) {
  console.error("DATABASE_URL is missing or still the placeholder value.");
  process.exit(1);
}

const sql = neon(url);
const schema = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");

// Strip comment-only lines, then split into individual statements.
const cleaned = schema
  .split(/\r?\n/)
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n");

const statements = cleaned
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

for (const statement of statements) {
  const label = statement.replace(/\s+/g, " ").slice(0, 60);
  try {
    await sql.query(statement);
    console.log(`OK: ${label}...`);
  } catch (err) {
    console.error(`FAILED: ${label}...`);
    console.error(`  -> ${err.message}`);
    process.exit(1);
  }
}

const cols = await sql`
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'users'
  ORDER BY ordinal_position
`;

if (cols.length === 0) {
  console.error("Migration ran but public.users table was not found.");
  process.exit(1);
}

console.log("\npublic.users table ready. Columns:");
for (const c of cols) {
  console.log(`  - ${c.column_name} (${c.data_type})`);
}
