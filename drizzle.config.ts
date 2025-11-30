// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import path from "path";

const dotenvPath = process.env.DOTENV_PATH ?? path.resolve(process.cwd(), ".env");
dotenv.config({ path: dotenvPath });

// Helpful runtime check
if (!process.env.DATABASE_URL) {
  throw new Error(
    `Missing DATABASE_URL environment variable. Make sure a .env file exists at ${dotenvPath} ` +
    `or set DATABASE_URL in your environment. Example: DATABASE_URL=postgres://user:pw@localhost:5432/dbname`
  );
}

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
