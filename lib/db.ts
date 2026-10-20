import "server-only";
import { PrismaClient } from "@prisma/client";

// Singleton para não esgotar conexões no hot reload / serverless
const g = globalThis as unknown as { prisma?: PrismaClient };
export const db = g.prisma ?? new PrismaClient({ log: process.env.NODE_ENV === "production" ? ["error"] : ["warn", "error"] });
if (process.env.NODE_ENV !== "production") g.prisma = db;
