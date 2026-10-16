import { PrismaClient } from "@prisma/client";

const globalDatabase = globalThis as typeof globalThis & { moundwebPrisma?: PrismaClient };
export function getDatabase(): PrismaClient {
  if (!globalDatabase.moundwebPrisma) globalDatabase.moundwebPrisma = new PrismaClient();
  return globalDatabase.moundwebPrisma;
}
export async function checkDatabase(): Promise<boolean> {
  try {
    await getDatabase().$queryRaw\`SELECT 1\`;
    return true;
  } catch {
    return false;
  }
}
export async function disconnectDatabase(): Promise<void> {
  if (globalDatabase.moundwebPrisma) await globalDatabase.moundwebPrisma.$disconnect();
}
