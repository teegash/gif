import axios from "axios";
import {
  ChartWindow,
  FxConversionResponse,
  FxRatesResponse,
  FxTimeSeriesResponse,
  HistoricalPricePoint,
  PriceData,
} from "@sentiment-watchlist/shared-types";
import { config } from "../config";
import { generateChartSeries, generatePrice } from "../data/mock-data";
import { redisClient } from "../lib/redis";
import logger from "../lib/logger";

const CACHE_TTL = 300;
const HISTORY_CACHE_TTL = 1800;

type FrankfurterLatestResponse = {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
};

type FrankfurterRangeResponse = {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
};

function normalizeCurrency(currency: string) {
  return currency.trim().toUpperCase();
}

function buildSymbol(base: string, target: string) {
  return `${normalizeCurrency(base)}/${normalizeCurrency(target)}`;
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dailyRange(window: ChartWindow) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setUTCDate(endDate.getUTCDate() - (window === "24h" ? 2 : 8));
  return {
    startDate: toIsoDate(startDate),
    endDate: toIsoDate(endDate),
  };
}

function parseRangePoints(response: FrankfurterRangeResponse, target: string) {
  return Object.entries(response.rates)
    .map(([date, rates]) => ({
      date,
      rate: rates[target],
    }))
    .filter((point) => Number.isFinite(point.rate))
    .sort((left, right) => left.date.localeCompare(right.date));
}

async function fetchLatest(base: string, target: string) {
  return axios.get<FrankfurterLatestResponse>(`${config.frankfurterBaseUrl}/latest`, {
    params: {
      base,
      symbols: target,
    },
    timeout: 10000,
  });
}

async function fetchRange(base: string, target: string, startDate: string, endDate: string) {
  return axios.get<FrankfurterRangeResponse>(`${config.frankfurterBaseUrl}/${startDate}..${endDate}`, {
    params: {
      base,
      symbols: target,
    },
    timeout: 15000,
  });
}

export async function getFxQuoteFromFrankfurter(
  fromCurrency: string,
  toCurrency: string
): Promise<PriceData | null> {
  const base = normalizeCurrency(fromCurrency);
  const target = normalizeCurrency(toCurrency);
  const symbol = buildSymbol(base, target);
  const cacheKey = `prices:${symbol}:frankfurter`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached) as PriceData;
  }

  if (config.mockMode) {
    const mockPrice = generatePrice(symbol, "FOREX");
    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(mockPrice));
    return mockPrice;
  }

  try {
    const latestResponse = await fetchLatest(base, target);
    const latestRate = latestResponse.data.rates[target];
    if (!Number.isFinite(latestRate)) {
      throw new Error(`Frankfurter did not return a rate for ${symbol}`);
    }

    const { startDate, endDate } = dailyRange("24h");
    const rangeResponse = await fetchRange(base, target, startDate, endDate);
    const points = parseRangePoints(rangeResponse.data, target);
    const previousRate = points.length >= 2 ? points[points.length - 2].rate : null;
    const priceChange24h = previousRate !== null ? Number((latestRate - previousRate).toFixed(6)) : null;
    const priceChangePercent24h =
      previousRate && previousRate !== 0
        ? Number((((latestRate - previousRate) / previousRate) * 100).toFixed(4))
        : null;

    const priceData: PriceData = {
      symbol,
      assetType: "FOREX",
      price: latestRate,
      priceChange24h,
      priceChangePercent24h,
      volume24h: null,
      marketCap: null,
      currency: target,
      capturedAt: new Date().toISOString(),
    };

    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(priceData));
    return priceData;
  } catch (error) {
    logger.error(`[Frankfurter] Quote fetch failed for ${symbol}: ${(error as Error).message}`);
    return null;
  }
}

export async function getFxHistoricalPricesFromFrankfurter(
  fromCurrency: string,
  toCurrency: string,
  window: ChartWindow
): Promise<HistoricalPricePoint[]> {
  const base = normalizeCurrency(fromCurrency);
  const target = normalizeCurrency(toCurrency);
  const symbol = buildSymbol(base, target);
  const cacheKey = `history:${symbol}:${window}:frankfurter`;
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

  try {
    const { startDate, endDate } = dailyRange(window);
    const response = await fetchRange(base, target, startDate, endDate);
    const points = parseRangePoints(response.data, target);
    if (!points.length) {
      throw new Error(`Frankfurter returned no historical data for ${symbol}`);
    }

    let history: HistoricalPricePoint[];
    if (window === "7d") {
      history = points.slice(-7).map((point) => ({
        timestamp: new Date(`${point.date}T12:00:00.000Z`).getTime(),
        price: point.rate,
      }));
    } else {
      const latest = points[points.length - 1];
      const previous = points.length >= 2 ? points[points.length - 2] : latest;
      const latestTimestamp = new Date(`${latest.date}T23:00:00.000Z`).getTime();
      history = Array.from({ length: 24 }, (_, index) => {
        const ratio = (index + 1) / 24;
        const interpolatedRate = previous.rate + (latest.rate - previous.rate) * ratio;
        return {
          timestamp: latestTimestamp - (23 - index) * 60 * 60 * 1000,
          price: Number(interpolatedRate.toFixed(6)),
        };
      });
    }

    await redisClient.setex(cacheKey, HISTORY_CACHE_TTL, JSON.stringify(history));
    return history;
  } catch (error) {
    logger.error(`[Frankfurter] Historical fetch failed for ${symbol}: ${(error as Error).message}`);
    return [];
  }
}

export async function getFxLatestRates(
  baseCurrency: string,
  targets: string[]
): Promise<FxRatesResponse | null> {
  const base = normalizeCurrency(baseCurrency);
  const uniqueTargets = Array.from(
    new Set(targets.map((target) => normalizeCurrency(target)).filter((target) => target !== base))
  );
  const cacheKey = `fx:latest:${base}:${uniqueTargets.join(",")}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached) as FxRatesResponse;
  }

  if (uniqueTargets.length === 0) {
    return {
      base,
      date: toIsoDate(new Date()),
      rates: {},
      provider: config.mockMode ? "mock" : "frankfurter",
    };
  }

  if (config.mockMode) {
    const rates = Object.fromEntries(
      uniqueTargets.map((target) => [target, generatePrice(buildSymbol(base, target), "FOREX").price])
    );
    const mockResponse: FxRatesResponse = {
      base,
      date: toIsoDate(new Date()),
      rates,
      provider: "mock",
    };
    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(mockResponse));
    return mockResponse;
  }

  try {
    const response = await fetchLatest(base, uniqueTargets.join(","));
    const payload: FxRatesResponse = {
      base,
      date: response.data.date,
      rates: response.data.rates,
      provider: "frankfurter",
    };
    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(payload));
    return payload;
  } catch (error) {
    logger.error(`[Frankfurter] Latest rates failed for ${base}: ${(error as Error).message}`);
    return null;
  }
}

export async function convertFxAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<FxConversionResponse | null> {
  const base = normalizeCurrency(fromCurrency);
  const target = normalizeCurrency(toCurrency);
  const cacheKey = `fx:convert:${amount}:${base}:${target}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached) as FxConversionResponse;
  }

  if (config.mockMode) {
    const rate = generatePrice(buildSymbol(base, target), "FOREX").price;
    const mockResponse: FxConversionResponse = {
      amount,
      base,
      target,
      rate,
      convertedAmount: Number((amount * rate).toFixed(6)),
      provider: "mock",
      asOf: new Date().toISOString(),
    };
    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(mockResponse));
    return mockResponse;
  }

  try {
    const response = await fetchLatest(base, target);
    const rate = response.data.rates[target];
    const convertedAmount = Number((amount * rate).toFixed(6));
    if (!Number.isFinite(convertedAmount)) {
      throw new Error(`Frankfurter did not return a conversion for ${base}/${target}`);
    }

    const payload: FxConversionResponse = {
      amount,
      base,
      target,
      rate: Number(rate.toFixed(6)),
      convertedAmount,
      provider: "frankfurter",
      asOf: new Date(`${response.data.date}T00:00:00.000Z`).toISOString(),
    };

    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(payload));
    return payload;
  } catch (error) {
    logger.error(`[Frankfurter] Conversion failed for ${base}/${target}: ${(error as Error).message}`);
    return null;
  }
}

export async function getFxTimeSeries(
  fromCurrency: string,
  toCurrency: string,
  startDate: string,
  endDate: string
): Promise<FxTimeSeriesResponse | null> {
  const base = normalizeCurrency(fromCurrency);
  const target = normalizeCurrency(toCurrency);
  const cacheKey = `fx:range:${base}:${target}:${startDate}:${endDate}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached) as FxTimeSeriesResponse;
  }

  if (config.mockMode) {
    const points = generateChartSeries(buildSymbol(base, target), "FOREX", "7d")
      .map((point) => ({
        date: toIsoDate(new Date(point.timestamp)),
        rate: point.price,
      }))
      .slice(-7);

    const mockResponse: FxTimeSeriesResponse = {
      base,
      target,
      startDate,
      endDate,
      points,
      provider: "mock",
    };
    await redisClient.setex(cacheKey, HISTORY_CACHE_TTL, JSON.stringify(mockResponse));
    return mockResponse;
  }

  try {
    const response = await fetchRange(base, target, startDate, endDate);
    const payload: FxTimeSeriesResponse = {
      base,
      target,
      startDate: response.data.start_date,
      endDate: response.data.end_date,
      points: parseRangePoints(response.data, target),
      provider: "frankfurter",
    };
    await redisClient.setex(cacheKey, HISTORY_CACHE_TTL, JSON.stringify(payload));
    return payload;
  } catch (error) {
    logger.error(
      `[Frankfurter] Time series failed for ${base}/${target}: ${(error as Error).message}`
    );
    return null;
  }
}
