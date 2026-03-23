import { AssetDetailResponse, AssetType, ChartWindow, WatchlistAsset } from "@sentiment-watchlist/shared-types";
import { getForexHistoricalPrices, getForexRate } from "../adapters/alphaVantage.adapter";
import { getCryptoHistoricalPrices, getCryptoPrices } from "../adapters/coinGecko.adapter";
import { config } from "../config";
import {
  assetCatalog,
  demoWatchlistId,
  generateChartSeries,
  generateSentiment,
  mockWatchlistAssets,
  mockWatchlists,
} from "../data/mock-data";
import logger from "../lib/logger";
import { prisma } from "../lib/prisma";
import { detectDivergence } from "./divergence.service";
import { computeSentimentForSymbol, scoreNewsArticles } from "./sentiment.service";

function getUserWatchlistId(userId: string) {
  return mockWatchlists.find((watchlist) => watchlist.userId === userId)?.id || demoWatchlistId;
}

function withSentimentOverlay(symbol: string, window: ChartWindow, points: Array<{ timestamp: number; price: number }>) {
  const baseSentiment = generateSentiment(symbol, window === "24h" ? 24 : 168).avgScore;

  return points.map((point, index) => {
    const sentimentScore = Number(
      Math.max(-1, Math.min(1, baseSentiment + Math.sin(index * 0.75 + symbol.length) * 0.08)).toFixed(3)
    );

    return {
      timestamp: point.timestamp,
      price: point.price,
      sentimentScore,
      sentimentLabel:
        sentimentScore > 0.05 ? "positive" : sentimentScore < -0.05 ? "negative" : "neutral",
    };
  });
}

async function getLatestPrice(symbol: string, assetType: AssetType, coinGeckoId?: string) {
  if (assetType === "CRYPTO") {
    const lookupId = coinGeckoId || symbol.toLowerCase();
    const prices = await getCryptoPrices([lookupId]);
    return prices[lookupId] || null;
  }

  const [from, to] = symbol.split("/");
  return getForexRate(from, to);
}

async function enrichAsset(rawAsset: {
  id: string;
  symbol: string;
  assetType: AssetType;
  displayName: string;
  coinGeckoId?: string;
}): Promise<WatchlistAsset> {
  const [priceData, sentimentSnapshot, recentNews] = await Promise.all([
    getLatestPrice(rawAsset.symbol, rawAsset.assetType, rawAsset.coinGeckoId),
    computeSentimentForSymbol(rawAsset.symbol, 24),
    scoreNewsArticles(rawAsset.symbol, 24),
  ]);

  const divergenceAlert =
    priceData && sentimentSnapshot ? detectDivergence(priceData, sentimentSnapshot) : null;

  return {
    id: rawAsset.id,
    symbol: rawAsset.symbol,
    assetType: rawAsset.assetType,
    displayName: rawAsset.displayName,
    coinGeckoId: rawAsset.coinGeckoId,
    priceData,
    sentimentSnapshot,
    divergenceAlert,
    recentNews,
  };
}

export async function getWatchlistAssets(userId: string): Promise<WatchlistAsset[]> {
  if (config.mockMode || !prisma) {
    const watchlistId = getUserWatchlistId(userId);
    const assets = mockWatchlistAssets
      .filter((asset) => asset.watchlistId === watchlistId)
      .sort((left, right) => left.position - right.position);
    return Promise.all(assets.map(enrichAsset));
  }

  const watchlist = await prisma.watchlist.findFirst({
    where: { userId },
    include: { assets: true },
  });
  if (!watchlist) return [];

  return Promise.all(
    watchlist.assets
      .sort((left, right) => left.position - right.position)
      .map((asset) =>
        enrichAsset({
          id: asset.id,
          symbol: asset.symbol,
          assetType: asset.assetType,
          displayName: asset.displayName,
          coinGeckoId: asset.coinGeckoId || undefined,
        })
      )
  );
}

export async function addWatchlistAsset(
  userId: string,
  payload: { symbol: string; assetType: AssetType; displayName: string; coinGeckoId?: string }
) {
  if (config.mockMode || !prisma) {
    const watchlistId = getUserWatchlistId(userId);
    const exists = mockWatchlistAssets.find(
      (asset) => asset.watchlistId === watchlistId && asset.symbol === payload.symbol
    );
    if (exists) {
      return exists;
    }

    const next = {
      id: `asset-${mockWatchlistAssets.length + 1}`,
      watchlistId,
      symbol: payload.symbol,
      assetType: payload.assetType,
      displayName: payload.displayName,
      coinGeckoId: payload.coinGeckoId,
      position: mockWatchlistAssets.length,
    };
    mockWatchlistAssets.push(next);
    return next;
  }

  const watchlist = await prisma.watchlist.findFirst({ where: { userId } });
  if (!watchlist) {
    throw new Error("Watchlist not found");
  }

  return prisma.watchlistAsset.create({
    data: {
      watchlistId: watchlist.id,
      symbol: payload.symbol,
      assetType: payload.assetType,
      displayName: payload.displayName,
      coinGeckoId: payload.coinGeckoId,
      position: Date.now(),
    },
  });
}

export async function removeWatchlistAsset(userId: string, assetId: string) {
  if (config.mockMode || !prisma) {
    const watchlistId = getUserWatchlistId(userId);
    const index = mockWatchlistAssets.findIndex(
      (asset) => asset.watchlistId === watchlistId && asset.id === assetId
    );
    if (index === -1) return false;
    mockWatchlistAssets.splice(index, 1);
    return true;
  }

  const watchlist = await prisma.watchlist.findFirst({ where: { userId } });
  if (!watchlist) return false;
  await prisma.watchlistAsset.delete({ where: { id: assetId } });
  return true;
}

export async function getAssetDetail(symbol: string, window: ChartWindow): Promise<AssetDetailResponse | null> {
  const catalog = assetCatalog.find((asset) => asset.symbol === symbol);
  if (!catalog) return null;

  const asset = await enrichAsset({
    id: catalog.symbol,
    symbol: catalog.symbol,
    assetType: catalog.assetType,
    displayName: catalog.displayName,
    coinGeckoId: catalog.coinGeckoId,
  });

  const historicalPoints =
    catalog.assetType === "CRYPTO"
      ? await getCryptoHistoricalPrices(catalog.coinGeckoId || symbol.toLowerCase(), window === "24h" ? 1 : 7)
      : await getForexHistoricalPrices(symbol.split("/")[0], symbol.split("/")[1], window);

  const chart =
    historicalPoints.length > 0
      ? withSentimentOverlay(symbol, window, historicalPoints)
      : generateChartSeries(symbol, catalog.assetType, window);

  const sentimentHistory = chart.map((point) => ({
    timestamp: point.timestamp,
    sentimentScore: point.sentimentScore,
    sentimentLabel:
      point.sentimentScore !== null
        ? point.sentimentScore > 0.05
          ? "positive"
          : point.sentimentScore < -0.05
            ? "negative"
            : "neutral"
        : undefined,
  }));

  return {
    asset,
    chart,
    historicalPrices: chart.map((point) => ({ timestamp: point.timestamp, price: point.price })),
    sentimentHistory,
  };
}

export async function searchAssets(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return assetCatalog.slice(0, 12);

  return assetCatalog.filter((asset) => {
    const haystack = `${asset.symbol} ${asset.displayName} ${asset.newsKeywords.join(" ")}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

export async function warmAssetCaches() {
  const assets = config.mockMode || !prisma ? mockWatchlistAssets : await prisma.watchlistAsset.findMany();
  for (const asset of assets) {
    try {
      await enrichAsset(asset);
    } catch (error) {
      logger.warn(`[Warmup] Failed for ${asset.symbol}: ${(error as Error).message}`);
    }
  }
}
