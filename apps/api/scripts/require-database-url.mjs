if (!process.env.DIRECT_URL?.trim() && !process.env.DATABASE_URL?.trim()) {
  console.error("DIRECT_URL or DATABASE_URL is required. No database migration was run.");
  process.exit(1);
}
