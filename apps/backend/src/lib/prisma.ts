import { PrismaClient } from "@prisma/client";
import { config } from "../config";

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

export const prisma = config.mockMode
  ? null
  : global.__prismaClient ||
    new PrismaClient({
      log: config.nodeEnv === "development" ? ["warn", "error"] : ["error"],
    });

if (!config.mockMode) {
  global.__prismaClient = prisma as PrismaClient;
}

