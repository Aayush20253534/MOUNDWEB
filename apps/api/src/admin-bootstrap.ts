import "dotenv/config";
import argon2 from "argon2";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "./generated/prisma/client.js";

const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
delete process.env.ADMIN_BOOTSTRAP_PASSWORD;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL must be set in the secured environment.");
  process.exit(1);
}
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Set ADMIN_BOOTSTRAP_EMAIL to a valid admin mailbox.");
  process.exit(1);
}
if (!password || password.length < 14 || password.length > 256) {
  console.error("ADMIN_BOOTSTRAP_PASSWORD must contain 14–256 characters.");
  process.exit(1);
}
const db = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});
try {
  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1,
  });
  const user = await db.adminUser.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN", active: true },
    create: { email, passwordHash, role: "ADMIN", active: true },
    select: { id: true, email: true },
  });
  console.info("Admin account provisioned:", user.email);
  console.info("Password was not logged. Remove ADMIN_BOOTSTRAP_PASSWORD from the execution environment.");
} catch {
  console.error("Could not provision the admin account. Verify the schema migration and database permissions.");
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
