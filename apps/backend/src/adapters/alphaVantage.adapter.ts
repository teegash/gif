import axios from "axios";
import { PriceData } from "@sentiment-watchlist/shared-types";
import { config } from "../config";
import { generatePrice } from "../data/mock-data";
import { redisClient } from "../lib/redis";
import logger from "../lib/logger";

const BASE_URL = "https://www.alphavantage.co/query";
const CACHE_TTL = 300;

async function getRemainingQuota() {
  const used = await redisClient.get("quota:alphavantage:daily");
  return config.alphaVantageDailyLimit - Number(used || "0");
}

async function incrementQuota() {
  const key = "quota:alphavantage:daily";
  const exists = await redisClient.exists(key);
  if (!exists) {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const ttl = Math.floor((midnight.getTime() - now.getTime()) / 1000);
    await redisClient.setex(key, ttl, "1");
  } else {
    await redisClient.incr(key);
  }
}

export async function getForexRate(fromCurrency: string, toCurrency: string): Promise<PriceData | null> {
  const symbol = `${fromCurrency}/${toCurrency}`;
  const cacheKey = `prices:${symbol}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached) as PriceData;
  }

  if (config.mockMode || !config.alphaVantageKey) {
    const data = generatePrice(symbol, "FOREX");
    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
    return data;
  }

  const remaining = await getRemainingQuota();
  if (remaining <= 0) {
    logger.warn(`[AlphaVantage] Quota exhausted for ${symbol}`);
    return null;
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: "CURRENCY_EXCHANGE_RATE",
        from_symbol: fromCurrency,
        to_symbol: toCurrency,
        apikey: config.alphaVantageKey,
      },
      timeout: 10000,
    });

    const data = response.data["Realtime Currency Exchange Rate"];
    if (!data) {
      throw new Error(`Invalid Alpha Vantage response for ${symbol}`);
    }

    const priceData: PriceData = {
      symbol,
      assetType: "FOREX",
      price: Number.parseFloat(data["5. Exchange Rate"]),
      priceChange24h: null,
      priceChangePercent24h: null,
      volume24h: null,
      marketCap: null,
      currency: toCurrency,
      capturedAt: new Date().toISOString(),
    };

    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(priceData));
    await incrementQuota();
    return priceData;
  } catch (error) {
    logger.error(`[AlphaVantage] Failed for ${symbol}: ${(error as Error).message}`);
    return null;
  }
}
