import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Force refresh - version 1.5 - synchronized with Gallery order schema change
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

// Force refresh cache to pick up new schema models
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
