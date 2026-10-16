import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "./generated/prisma/client.js";

const globalDatabase = globalThis as typeof globalThis & { moundwebPrisma?: PrismaClient };
function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required for database access.");
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}
export function getDatabase(): PrismaClient {
  if (!globalDatabase.moundwebPrisma) globalDatabase.moundwebPrisma = createClient();
  return globalDatabase.moundwebPrisma;
}
export async function checkDatabase(): Promise<boolean> {
  try {
    await getDatabase().$queryRawUnsafe("SELECT 1");
    return true;
  } catch {
    return false;
  }
}
export async function disconnectDatabase(): Promise<void> {
  if (globalDatabase.moundwebPrisma) {
    await globalDatabase.moundwebPrisma.$disconnect();
    delete globalDatabase.moundwebPrisma;
  }
}
