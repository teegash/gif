import axios from "axios";
import { ChartWindow, HistoricalPricePoint, PriceData } from "@sentiment-watchlist/shared-types";
import { config } from "../config";
import { generateChartSeries, generatePrice } from "../data/mock-data";
import { getFxHistoricalPricesFromFrankfurter, getFxQuoteFromFrankfurter } from "./frankfurter.adapter";
import { redisClient } from "../lib/redis";
import logger from "../lib/logger";

const CACHE_TTL = 300;
const HISTORY_CACHE_TTL = 900;

type AlphaVantageSeriesPoint = {
  "4. close"?: string;
};

function extractAlphaVantageError(payload: Record<string, unknown>) {
  const note = typeof payload.Note === "string" ? payload.Note : null;
  const information = typeof payload.Information === "string" ? payload.Information : null;
  const errorMessage = typeof payload["Error Message"] === "string" ? payload["Error Message"] : null;
  return note || information || errorMessage;
}

function parseSeries(
  series: Record<string, AlphaVantageSeriesPoint> | undefined,
  limit: number
): HistoricalPricePoint[] {
  if (!series) {
    return [];
  }

  return Object.entries(series)
    .map(([timestamp, values]) => ({
      timestamp: new Date(timestamp).getTime(),
      price: Number.parseFloat(values["4. close"] || "NaN"),
    }))
    .filter((point) => Number.isFinite(point.price))
    .sort((left, right) => left.timestamp - right.timestamp)
    .slice(-limit);
}

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
    const fallback =
      config.mockMode ? generatePrice(symbol, "FOREX") : await getFxQuoteFromFrankfurter(fromCurrency, toCurrency);
    if (fallback) {
      await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(fallback));
    }
    return fallback;
  }

  const remaining = await getRemainingQuota();
  if (remaining <= 0) {
    logger.warn(`[AlphaVantage] Quota exhausted for ${symbol}`);
    return getFxQuoteFromFrankfurter(fromCurrency, toCurrency);
  }

  try {
    const response = await axios.get(config.alphaVantageBaseUrl, {
      params: {
        function: "CURRENCY_EXCHANGE_RATE",
        from_currency: fromCurrency,
        to_currency: toCurrency,
        apikey: config.alphaVantageKey,
      },
      timeout: 10000,
    });

    const alphaVantageError = extractAlphaVantageError(response.data);
    if (alphaVantageError) {
      throw new Error(alphaVantageError);
    }

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
    return getFxQuoteFromFrankfurter(fromCurrency, toCurrency);
  }
}

export async function getForexHistoricalPrices(
  fromCurrency: string,
  toCurrency: string,
  window: ChartWindow
): Promise<HistoricalPricePoint[]> {
  const symbol = `${fromCurrency}/${toCurrency}`;
  const cacheKey = `history:${symbol}:${window}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached) as HistoricalPricePoint[];
  }

  if (config.mockMode) {
    const mockHistory = generateChartSeries(symbol, "FOREX", window).map((point) => ({
      timestamp: point.timestamp,
      price: point.price,
    }));
    await redisClient.setex(cacheKey, HISTORY_CACHE_TTL, JSON.stringify(mockHistory));
    return mockHistory;
  }

  if (!config.alphaVantageKey) {
    return getFxHistoricalPricesFromFrankfurter(fromCurrency, toCurrency, window);
  }

  const remaining = await getRemainingQuota();
  if (remaining <= 0) {
    logger.warn(`[AlphaVantage] Quota exhausted for historical ${symbol}`);
    return getFxHistoricalPricesFromFrankfurter(fromCurrency, toCurrency, window);
  }

  try {
    const response = await axios.get(config.alphaVantageBaseUrl, {
      params: {
        function: window === "24h" ? "FX_INTRADAY" : "FX_DAILY",
        from_symbol: fromCurrency,
        to_symbol: toCurrency,
        interval: window === "24h" ? "60min" : undefined,
        outputsize: "compact",
        apikey: config.alphaVantageKey,
      },
      timeout: 15000,
    });

    const alphaVantageError = extractAlphaVantageError(response.data);
    if (alphaVantageError) {
      throw new Error(alphaVantageError);
    }

    const series = response.data[
      window === "24h" ? "Time Series FX (60min)" : "Time Series FX (Daily)"
    ] as Record<string, AlphaVantageSeriesPoint> | undefined;
    const history = parseSeries(series, window === "24h" ? 24 : 7);
    if (!history.length) {
      throw new Error(`Invalid Alpha Vantage historical response for ${symbol}`);
    }

    await redisClient.setex(cacheKey, HISTORY_CACHE_TTL, JSON.stringify(history));
    await incrementQuota();
    return history;
  } catch (error) {
    logger.warn(`[AlphaVantage] Historical fetch failed for ${symbol}: ${(error as Error).message}`);
    return getFxHistoricalPricesFromFrankfurter(fromCurrency, toCurrency, window);
  }
}
