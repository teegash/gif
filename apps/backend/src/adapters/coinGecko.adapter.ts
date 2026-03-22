import axios from "axios";
import { HistoricalPricePoint, PriceData } from "@sentiment-watchlist/shared-types";
import { config } from "../config";
import { assetCatalog, generateChartSeries, generatePrice } from "../data/mock-data";
import { redisClient } from "../lib/redis";
import logger from "../lib/logger";

const BASE_URL = "https://api.coingecko.com/api/v3";
const CACHE_TTL = 55;

export async function getCryptoPrices(coinIds: string[]): Promise<Record<string, PriceData>> {
  const results: Record<string, PriceData> = {};
  const uncached: string[] = [];

  for (const id of coinIds) {
    const cached = await redisClient.get(`prices:${id}`);
    if (cached) {
      results[id] = JSON.parse(cached) as PriceData;
    } else {
      uncached.push(id);
    }
  }

  if (uncached.length === 0) {
    return results;
  }

  if (config.mockMode) {
    for (const id of uncached) {
      const asset = assetCatalog.find((entry) => entry.coinGeckoId === id || entry.symbol.toLowerCase() === id);
      if (!asset) continue;
      const priceData = generatePrice(asset.symbol, "CRYPTO");
      await redisClient.setex(`prices:${id}`, CACHE_TTL, JSON.stringify(priceData));
      results[id] = priceData;
    }
    return results;
  }

  try {
    const response = await axios.get(`${BASE_URL}/simple/price`, {
      params: {
        ids: uncached.join(","),
        vs_currencies: "usd",
        include_24hr_change: true,
        include_24hr_vol: true,
        include_market_cap: true,
      },
      timeout: 10000,
    });

    for (const id of uncached) {
      const coinData = response.data[id];
      const asset = assetCatalog.find((entry) => entry.coinGeckoId === id || entry.symbol.toLowerCase() === id);
      if (!coinData || !asset) continue;

      const priceData: PriceData = {
        symbol: asset.symbol,
        assetType: "CRYPTO",
        price: coinData.usd,
        priceChange24h: coinData.usd_24h_change ?? null,
        priceChangePercent24h: coinData.usd_24h_change ?? null,
        volume24h: coinData.usd_24h_vol ?? null,
        marketCap: coinData.usd_market_cap ?? null,
        currency: "USD",
        capturedAt: new Date().toISOString(),
      };

      await redisClient.setex(`prices:${id}`, CACHE_TTL, JSON.stringify(priceData));
      results[id] = priceData;
    }
  } catch (error) {
    logger.error(`[CoinGecko] Price fetch failed: ${(error as Error).message}`);
  }

  return results;
}

export async function getCryptoHistoricalPrices(coinId: string, days: 1 | 7): Promise<HistoricalPricePoint[]> {
  const cacheKey = `history:${coinId}:${days}d`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached) as HistoricalPricePoint[];
  }

  const asset = assetCatalog.find((entry) => entry.coinGeckoId === coinId || entry.symbol.toLowerCase() === coinId);
  if (!asset) return [];

  if (config.mockMode) {
    const history = generateChartSeries(asset.symbol, "CRYPTO", days === 1 ? "24h" : "7d").map((point) => ({
      timestamp: point.timestamp,
      price: point.price,
    }));
    await redisClient.setex(cacheKey, days === 1 ? 300 : 3600, JSON.stringify(history));
    return history;
  }

  try {
    const response = await axios.get(`${BASE_URL}/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: "usd",
        days,
        interval: days === 1 ? "hourly" : "daily",
      },
      timeout: 15000,
    });

    const history = response.data.prices.map(([timestamp, price]: [number, number]) => ({
      timestamp,
      price,
    }));
    await redisClient.setex(cacheKey, days === 1 ? 300 : 3600, JSON.stringify(history));
    return history;
  } catch (error) {
    logger.error(`[CoinGecko] Historical fetch failed for ${coinId}: ${(error as Error).message}`);
    return [];
  }
}

