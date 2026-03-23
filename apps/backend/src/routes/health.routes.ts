import { Router } from "express";
import axios from "axios";
import { config } from "../config";
import { prisma } from "../lib/prisma";
import { redisClient } from "../lib/redis";

const router = Router();

router.get("/", async (_req, res) => {
  const checks = {
    status: "ok" as "ok" | "degraded",
    timestamp: new Date().toISOString(),
    services: {
      database: config.mockMode ? "mock" : "unknown",
      redis: config.mockMode ? "mock" : "unknown",
      sentimentEngine: config.mockMarketData ? "mock" : "unknown",
    },
    quotas: {
      alphavantage: 0,
      newsapi: 0,
      gnews: 0,
    },
  };

  try {
    if (prisma) {
      await prisma.$queryRaw`SELECT 1`;
      checks.services.database = "healthy";
    }
  } catch {
    checks.services.database = "unhealthy";
    checks.status = "degraded";
  }

  try {
    await redisClient.ping();
    if (!config.mockMode) {
      checks.services.redis = "healthy";
    }
  } catch {
    checks.services.redis = "unhealthy";
    checks.status = "degraded";
  }

  try {
    if (!config.mockMarketData) {
      await axios.get(`${config.sentimentEngineUrl}/health`, { timeout: 3000 });
      checks.services.sentimentEngine = "healthy";
    }
  } catch {
    checks.services.sentimentEngine = "unhealthy";
    checks.status = "degraded";
  }

  const avUsed = await redisClient.get("quota:alphavantage:daily");
  const naUsed = await redisClient.get("quota:newsapi:daily");
  const gnUsed = await redisClient.get("quota:gnews:daily");
  checks.quotas.alphavantage = config.alphaVantageDailyLimit - Number(avUsed || "0");
  checks.quotas.newsapi = config.newsApiDailyLimit - Number(naUsed || "0");
  checks.quotas.gnews = config.gnewsDailyLimit - Number(gnUsed || "0");

  res.status(checks.status === "ok" ? 200 : 503).json(checks);
});

export default router;
