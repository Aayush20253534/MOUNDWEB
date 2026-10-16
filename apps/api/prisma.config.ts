import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
// Client generation must also work in CI, where a real database is not available.
// The migration command has a preflight guard and cannot use this placeholder.
const generationOnlyFallback = "postgresql://unconfigured:unconfigured@127.0.0.1:5432/moundweb";
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: databaseUrl || generationOnlyFallback },
});
