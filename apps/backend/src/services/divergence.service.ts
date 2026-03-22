import { DivergenceAlert, PriceData, SentimentSnapshot } from "@sentiment-watchlist/shared-types";

interface DivergenceConfig {
  priceChangeThreshold: number;
  sentimentThreshold: number;
}

const DEFAULT_CONFIG: DivergenceConfig = {
  priceChangeThreshold: 0.015,
  sentimentThreshold: 0.2,
};

export function detectDivergence(
  price: PriceData,
  sentiment: SentimentSnapshot,
  config: DivergenceConfig = DEFAULT_CONFIG
): DivergenceAlert | null {
  const priceChangePct = (price.priceChangePercent24h ?? 0) / 100;
  const sentimentScore = sentiment.avgScore;
  const priceSignificantlyUp = priceChangePct > config.priceChangeThreshold;
  const priceSignificantlyDown = priceChangePct < -config.priceChangeThreshold;
  const sentimentBearish = sentimentScore < -config.sentimentThreshold;
  const sentimentBullish = sentimentScore > config.sentimentThreshold;

  if (priceSignificantlyUp && sentimentBearish) {
    const severity =
      Math.abs(priceChangePct) > 0.05 || Math.abs(sentimentScore) > 0.5
        ? "HIGH"
        : Math.abs(priceChangePct) > 0.025
          ? "MEDIUM"
          : "LOW";

    return {
      symbol: price.symbol,
      priceChangePercent: priceChangePct * 100,
      sentimentScore,
      divergenceType: "BULLISH_PRICE_BEARISH_SENTIMENT",
      severity,
      message: `${price.symbol} is up ${(priceChangePct * 100).toFixed(2)}% while sentiment is ${sentiment.dominantLabel} (${sentimentScore.toFixed(2)}). The move may be running ahead of headline support.`,
      detectedAt: new Date().toISOString(),
    };
  }

  if (priceSignificantlyDown && sentimentBullish) {
    const severity =
      Math.abs(priceChangePct) > 0.05 || Math.abs(sentimentScore) > 0.5
        ? "HIGH"
        : Math.abs(priceChangePct) > 0.025
          ? "MEDIUM"
          : "LOW";

    return {
      symbol: price.symbol,
      priceChangePercent: priceChangePct * 100,
      sentimentScore,
      divergenceType: "BEARISH_PRICE_BULLISH_SENTIMENT",
      severity,
      message: `${price.symbol} is down ${Math.abs(priceChangePct * 100).toFixed(2)}% while sentiment remains ${sentiment.dominantLabel} (${sentimentScore.toFixed(2)}). This can indicate hidden strength or early accumulation.`,
      detectedAt: new Date().toISOString(),
    };
  }

  return null;
}

