import {
  AssetType,
  ChartPoint,
  NewsArticle,
  PriceData,
  SentimentLabel,
  SentimentSnapshot,
  TradeEntry,
  WatchlistAsset,
} from "@sentiment-watchlist/shared-types";
import crypto from "crypto";

export interface MockUser {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  baseCurrency: string;
  timezone: string;
}

export interface MockWatchlist {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
}

export interface AssetCatalogEntry {
  symbol: string;
  assetType: AssetType;
  displayName: string;
  coinGeckoId?: string;
  newsKeywords: string[];
  basePrice: number;
  baseSentiment: number;
}

export const demoUserId = "demo-user";
export const demoWatchlistId = "demo-watchlist";

export const mockUsers: MockUser[] = [
  {
    id: demoUserId,
    email: "demo@example.com",
    displayName: "Demo Trader",
    passwordHash: "mock:DemoPass123!",
    baseCurrency: "USD",
    timezone: "Africa/Nairobi",
  },
];

export const mockWatchlists: MockWatchlist[] = [
  {
    id: demoWatchlistId,
    userId: demoUserId,
    name: "My Watchlist",
    createdAt: new Date().toISOString(),
  },
];

export const assetCatalog: AssetCatalogEntry[] = [
  {
    symbol: "BTC",
    assetType: "CRYPTO",
    displayName: "Bitcoin",
    coinGeckoId: "bitcoin",
    newsKeywords: ["bitcoin", "BTC", "crypto market"],
    basePrice: 67240,
    baseSentiment: 0.38,
  },
  {
    symbol: "ETH",
    assetType: "CRYPTO",
    displayName: "Ethereum",
    coinGeckoId: "ethereum",
    newsKeywords: ["ethereum", "ETH", "ether"],
    basePrice: 3480,
    baseSentiment: 0.16,
  },
  {
    symbol: "SOL",
    assetType: "CRYPTO",
    displayName: "Solana",
    coinGeckoId: "solana",
    newsKeywords: ["solana", "SOL"],
    basePrice: 184,
    baseSentiment: -0.08,
  },
  {
    symbol: "EUR/USD",
    assetType: "FOREX",
    displayName: "Euro / US Dollar",
    newsKeywords: ["EURUSD", "euro dollar", "ECB Fed"],
    basePrice: 1.0924,
    baseSentiment: 0.11,
  },
  {
    symbol: "GBP/USD",
    assetType: "FOREX",
    displayName: "British Pound / US Dollar",
    newsKeywords: ["GBPUSD", "sterling", "Bank of England"],
    basePrice: 1.2742,
    baseSentiment: -0.18,
  },
  {
    symbol: "USD/JPY",
    assetType: "FOREX",
    displayName: "US Dollar / Japanese Yen",
    newsKeywords: ["USDJPY", "yen dollar", "Bank of Japan"],
    basePrice: 151.82,
    baseSentiment: -0.31,
  },
  {
    symbol: "XAU/USD",
    assetType: "FOREX",
    displayName: "Gold / US Dollar",
    newsKeywords: ["gold price", "XAUUSD", "precious metals"],
    basePrice: 2192.1,
    baseSentiment: 0.42,
  },
];

export const mockWatchlistAssets: Array<{
  id: string;
  watchlistId: string;
  symbol: string;
  assetType: AssetType;
  displayName: string;
  coinGeckoId?: string;
  position: number;
}> =
  assetCatalog.slice(0, 5).map((asset, index) => ({
    id: `asset-${index + 1}`,
    watchlistId: demoWatchlistId,
    symbol: asset.symbol,
    assetType: asset.assetType,
    displayName: asset.displayName,
    coinGeckoId: asset.coinGeckoId,
    position: index,
  }));

export const mockTrades: TradeEntry[] = [
  {
    id: "trade-1",
    userId: demoUserId,
    symbol: "BTC",
    assetType: "CRYPTO",
    direction: "LONG",
    entryPrice: 64100,
    exitPrice: 66450,
    quantity: 0.15,
    currency: "USD",
    entryAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    exitAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: "CLOSED",
    notes: "Momentum continuation after ETF chatter.",
    tags: ["breakout", "crypto"],
    pnl: 352.5,
    pnlPercent: 3.67,
    riskRewardRatio: 2.1,
    stopLoss: 62800,
    takeProfit: 67000,
    sentimentAtEntry: 0.42,
    sentimentLabelEntry: "positive",
    articleCountEntry: 16,
    sentimentAtExit: 0.31,
    sentimentLabelExit: "positive",
    divergenceFlagEntry: false,
    divergenceNoteEntry: null,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "trade-2",
    userId: demoUserId,
    symbol: "GBP/USD",
    assetType: "FOREX",
    direction: "SHORT",
    entryPrice: 1.283,
    exitPrice: 1.2718,
    quantity: 10000,
    currency: "USD",
    entryAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    exitAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "CLOSED",
    notes: "BoE tone softened while sentiment stayed weak.",
    tags: ["forex", "macro"],
    pnl: 112,
    pnlPercent: 0.87,
    riskRewardRatio: 1.8,
    stopLoss: 1.2865,
    takeProfit: 1.2702,
    sentimentAtEntry: -0.28,
    sentimentLabelEntry: "negative",
    articleCountEntry: 9,
    sentimentAtExit: -0.14,
    sentimentLabelExit: "negative",
    divergenceFlagEntry: false,
    divergenceNoteEntry: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "trade-3",
    userId: demoUserId,
    symbol: "SOL",
    assetType: "CRYPTO",
    direction: "LONG",
    entryPrice: 191,
    exitPrice: null,
    quantity: 6,
    currency: "USD",
    entryAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    exitAt: null,
    status: "OPEN",
    notes: "Counter-trend long after sentiment improved before price.",
    tags: ["divergence", "swing"],
    pnl: null,
    pnlPercent: null,
    riskRewardRatio: 2.4,
    stopLoss: 179,
    takeProfit: 208,
    sentimentAtEntry: 0.26,
    sentimentLabelEntry: "positive",
    articleCountEntry: 11,
    sentimentAtExit: null,
    sentimentLabelExit: null,
    divergenceFlagEntry: true,
    divergenceNoteEntry: "Sentiment turned positive while price remained under pressure.",
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
];

export const sentimentHistoryStore = new Map<string, SentimentSnapshot[]>();
export const priceHistoryStore = new Map<string, PriceData[]>();

export function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function seedFromSymbol(symbol: string) {
  return symbol.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function findCatalogEntry(symbol: string) {
  return assetCatalog.find((asset) => asset.symbol === symbol);
}

export function generatePrice(symbol: string, assetType: AssetType, offset = 0): PriceData {
  const catalog = findCatalogEntry(symbol);
  const base = catalog?.basePrice ?? 100;
  const seed = seedFromSymbol(symbol);
  const wave = Math.sin((Date.now() / 3_600_000 + seed + offset) * 0.8) * 0.015;
  const drift = Math.cos((Date.now() / 7_200_000 + seed + offset) * 1.1) * 0.008;
  const price = Number((base * (1 + wave + drift)).toFixed(assetType === "FOREX" ? 4 : 2));
  const priceChangePercent24h = Number((((wave + drift) * 100) * 3.2).toFixed(2));
  const priceChange24h = Number((price * (priceChangePercent24h / 100)).toFixed(2));

  return {
    symbol,
    assetType,
    price,
    priceChange24h,
    priceChangePercent24h,
    volume24h: assetType === "CRYPTO" ? Math.round(base * 200000) : null,
    marketCap: assetType === "CRYPTO" ? Math.round(base * 10000000) : null,
    currency: symbol.includes("/") ? symbol.split("/")[1] : "USD",
    capturedAt: new Date(Date.now() - offset * 3600_000).toISOString(),
  };
}

export function generateSentiment(symbol: string, windowHours: 24 | 168): SentimentSnapshot {
  const catalog = findCatalogEntry(symbol);
  const base = catalog?.baseSentiment ?? 0;
  const seed = seedFromSymbol(symbol);
  const modulation = Math.sin((Date.now() / 4_500_000 + seed + windowHours) * 0.6) * 0.14;
  const avgScore = Number(Math.max(-1, Math.min(1, base + modulation)).toFixed(3));
  const articleCount = windowHours === 24 ? 12 : 28;
  const positiveCount = Math.max(0, Math.round(((avgScore + 1) / 2) * articleCount * 0.8));
  const negativeCount = Math.max(0, Math.round(((1 - avgScore) / 2) * articleCount * 0.55));
  const neutralCount = Math.max(0, articleCount - positiveCount - negativeCount);
  const dominantLabel: SentimentLabel =
    avgScore > 0.05 ? "positive" : avgScore < -0.05 ? "negative" : "neutral";

  return {
    symbol,
    windowHours,
    avgScore,
    dominantLabel,
    positiveCount,
    negativeCount,
    neutralCount,
    articleCount,
    capturedAt: new Date().toISOString(),
  };
}

export function generateNews(symbol: string, count = 6): NewsArticle[] {
  const catalog = findCatalogEntry(symbol);
  const baseSentiment = catalog?.baseSentiment ?? 0;
  const positivePhrases = [
    "bullish breakout gains traction",
    "institutional flows support upside momentum",
    "adoption narrative strengthens near-term outlook",
    "buyers defend key level after upbeat macro tone",
  ];
  const negativePhrases = [
    "volatility rises on regulatory uncertainty",
    "traders brace for pullback after sharp rally",
    "macro pressure clouds near-term conviction",
    "risk appetite fades as market digests weaker flows",
  ];

  const articles: NewsArticle[] = [];
  for (let index = 0; index < count; index += 1) {
    const bullish = (index + seedFromSymbol(symbol)) % 3 !== 0 ? baseSentiment >= 0 : baseSentiment > 0.2;
    const phrase = bullish
      ? positivePhrases[index % positivePhrases.length]
      : negativePhrases[index % negativePhrases.length];
    const score = bullish ? Math.min(0.85, baseSentiment + 0.15) : Math.max(-0.85, baseSentiment - 0.22);
    const label: SentimentLabel = score > 0.05 ? "positive" : score < -0.05 ? "negative" : "neutral";
    articles.push({
      id: `${symbol.toLowerCase().replace(/\W/g, "-")}-article-${index + 1}`,
      headline: `${symbol} ${phrase}`,
      description: `${catalog?.displayName ?? symbol} is under active watch as traders compare price action, headline flow, and sentiment drift.`,
      url: `https://example.com/${symbol.toLowerCase().replace(/\W/g, "-")}/${index + 1}`,
      sourceName: index % 2 === 0 ? "Reuters" : "Bloomberg",
      publishedAt: new Date(Date.now() - index * 3 * 60 * 60 * 1000).toISOString(),
      sentimentScore: Number(score.toFixed(3)),
      sentimentLabel: label,
    });
  }

  return articles;
}

export function generateChartSeries(symbol: string, assetType: AssetType, window: "24h" | "7d"): ChartPoint[] {
  const points = window === "24h" ? 24 : 7;
  const priceBase = findCatalogEntry(symbol)?.basePrice ?? 100;
  const sentimentBase = findCatalogEntry(symbol)?.baseSentiment ?? 0;

  return Array.from({ length: points }).map((_, index) => {
    const timeOffset = points - index;
    const timestamp =
      Date.now() -
      (window === "24h" ? timeOffset * 60 * 60 * 1000 : timeOffset * 24 * 60 * 60 * 1000);
    const swing = Math.sin((index + seedFromSymbol(symbol) / 10) * 0.8) * 0.018;
    const drift = Math.cos((index + seedFromSymbol(symbol) / 18) * 0.45) * 0.012;
    const price = Number((priceBase * (1 + swing + drift)).toFixed(assetType === "FOREX" ? 4 : 2));
    const sentimentScore = Number(
      Math.max(-1, Math.min(1, sentimentBase + Math.sin(index * 0.7 + seedFromSymbol(symbol)) * 0.18)).toFixed(3)
    );

    return {
      timestamp,
      price,
      sentimentScore,
      sentimentLabel: sentimentScore > 0.05 ? "positive" : sentimentScore < -0.05 ? "negative" : "neutral",
    };
  });
}
