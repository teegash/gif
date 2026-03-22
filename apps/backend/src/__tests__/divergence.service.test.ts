import { describe, expect, it } from "vitest";
import { detectDivergence } from "../services/divergence.service";

describe("detectDivergence", () => {
  const basePriceData = {
    symbol: "BTC",
    assetType: "CRYPTO" as const,
    price: 65000,
    currency: "USD",
    volume24h: 1000000,
    marketCap: 1200000000,
    capturedAt: new Date().toISOString(),
    priceChange24h: 0,
    priceChangePercent24h: 0,
  };

  const baseSentiment = {
    symbol: "BTC",
    windowHours: 24 as const,
    articleCount: 20,
    capturedAt: new Date().toISOString(),
    positiveCount: 0,
    negativeCount: 0,
    neutralCount: 0,
    avgScore: 0,
    dominantLabel: "neutral" as const,
  };

  it("detects bullish-price bearish-sentiment divergence", () => {
    const price = { ...basePriceData, priceChangePercent24h: 4, priceChange24h: 2600 };
    const sentiment = {
      ...baseSentiment,
      avgScore: -0.35,
      dominantLabel: "negative" as const,
      positiveCount: 3,
      negativeCount: 14,
      neutralCount: 3,
    };

    const alert = detectDivergence(price, sentiment);
    expect(alert).not.toBeNull();
    expect(alert?.divergenceType).toBe("BULLISH_PRICE_BEARISH_SENTIMENT");
  });

  it("returns null when price and sentiment align", () => {
    const price = { ...basePriceData, priceChangePercent24h: 3, priceChange24h: 1950 };
    const sentiment = {
      ...baseSentiment,
      avgScore: 0.45,
      dominantLabel: "positive" as const,
      positiveCount: 15,
      negativeCount: 2,
      neutralCount: 3,
    };

    expect(detectDivergence(price, sentiment)).toBeNull();
  });
});
