import {
  AssetDetailResponse,
  AuthResponse,
  ChartPoint,
  JournalAnalytics,
  SentimentSnapshot,
  TradeEntry,
  WatchlistAsset,
} from "@sentiment-watchlist/shared-types";

const token = "demo-token";

let demoUser = {
  id: "demo-user",
  email: "demo@example.com",
  displayName: "Demo Trader",
};

let watchlistAssets: WatchlistAsset[] = [
  {
    id: "btc",
    symbol: "BTC",
    assetType: "CRYPTO",
    displayName: "Bitcoin",
    coinGeckoId: "bitcoin",
    priceData: {
      symbol: "BTC",
      assetType: "CRYPTO",
      price: 67240,
      priceChange24h: 2150,
      priceChangePercent24h: 3.31,
      volume24h: 51234000000,
      marketCap: 1320000000000,
      currency: "USD",
      capturedAt: new Date().toISOString(),
    },
    sentimentSnapshot: {
      symbol: "BTC",
      windowHours: 24,
      avgScore: 0.38,
      dominantLabel: "positive",
      positiveCount: 10,
      negativeCount: 3,
      neutralCount: 3,
      articleCount: 16,
      capturedAt: new Date().toISOString(),
    },
    divergenceAlert: null,
    recentNews: [],
  },
  {
    id: "eth",
    symbol: "ETH",
    assetType: "CRYPTO",
    displayName: "Ethereum",
    coinGeckoId: "ethereum",
    priceData: {
      symbol: "ETH",
      assetType: "CRYPTO",
      price: 3480,
      priceChange24h: 46,
      priceChangePercent24h: 1.34,
      volume24h: 21450000000,
      marketCap: 418000000000,
      currency: "USD",
      capturedAt: new Date().toISOString(),
    },
    sentimentSnapshot: {
      symbol: "ETH",
      windowHours: 24,
      avgScore: 0.12,
      dominantLabel: "positive",
      positiveCount: 7,
      negativeCount: 4,
      neutralCount: 4,
      articleCount: 15,
      capturedAt: new Date().toISOString(),
    },
    divergenceAlert: null,
    recentNews: [],
  },
  {
    id: "gbpusd",
    symbol: "GBP/USD",
    assetType: "FOREX",
    displayName: "British Pound / US Dollar",
    priceData: {
      symbol: "GBP/USD",
      assetType: "FOREX",
      price: 1.2742,
      priceChange24h: -0.014,
      priceChangePercent24h: -1.12,
      volume24h: null,
      marketCap: null,
      currency: "USD",
      capturedAt: new Date().toISOString(),
    },
    sentimentSnapshot: {
      symbol: "GBP/USD",
      windowHours: 24,
      avgScore: -0.22,
      dominantLabel: "negative",
      positiveCount: 2,
      negativeCount: 8,
      neutralCount: 3,
      articleCount: 13,
      capturedAt: new Date().toISOString(),
    },
    divergenceAlert: null,
    recentNews: [],
  },
  {
    id: "sol",
    symbol: "SOL",
    assetType: "CRYPTO",
    displayName: "Solana",
    coinGeckoId: "solana",
    priceData: {
      symbol: "SOL",
      assetType: "CRYPTO",
      price: 184.13,
      priceChange24h: -4.2,
      priceChangePercent24h: -2.23,
      volume24h: 3200000000,
      marketCap: 89000000000,
      currency: "USD",
      capturedAt: new Date().toISOString(),
    },
    sentimentSnapshot: {
      symbol: "SOL",
      windowHours: 24,
      avgScore: 0.27,
      dominantLabel: "positive",
      positiveCount: 8,
      negativeCount: 3,
      neutralCount: 3,
      articleCount: 14,
      capturedAt: new Date().toISOString(),
    },
    divergenceAlert: {
      symbol: "SOL",
      priceChangePercent: -2.23,
      sentimentScore: 0.27,
      divergenceType: "BEARISH_PRICE_BULLISH_SENTIMENT",
      severity: "MEDIUM",
      message: "SOL is falling while sentiment stays constructive, suggesting hidden strength.",
      detectedAt: new Date().toISOString(),
    },
    recentNews: [],
  },
];

const searchCatalog = [
  { symbol: "BTC", assetType: "CRYPTO" as const, displayName: "Bitcoin", coinGeckoId: "bitcoin" },
  { symbol: "ETH", assetType: "CRYPTO" as const, displayName: "Ethereum", coinGeckoId: "ethereum" },
  { symbol: "SOL", assetType: "CRYPTO" as const, displayName: "Solana", coinGeckoId: "solana" },
  { symbol: "EUR/USD", assetType: "FOREX" as const, displayName: "Euro / US Dollar" },
  { symbol: "GBP/USD", assetType: "FOREX" as const, displayName: "British Pound / US Dollar" },
  { symbol: "USD/JPY", assetType: "FOREX" as const, displayName: "US Dollar / Japanese Yen" },
  { symbol: "XAU/USD", assetType: "FOREX" as const, displayName: "Gold / US Dollar" },
];

const articleSets: Record<string, WatchlistAsset["recentNews"]> = {
  BTC: [
    {
      id: "btc-1",
      headline: "Bitcoin bullish breakout gains traction on institutional flows",
      description: "ETF-linked optimism and stronger inflows are supporting upside conviction.",
      url: "https://example.com/btc-1",
      sourceName: "Reuters",
      publishedAt: new Date().toISOString(),
      sentimentScore: 0.52,
      sentimentLabel: "positive",
    },
    {
      id: "btc-2",
      headline: "Traders monitor volatility as Bitcoin reclaims key technical zone",
      description: "Analysts say macro calm is helping risk appetite remain constructive.",
      url: "https://example.com/btc-2",
      sourceName: "Bloomberg",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sentimentScore: 0.21,
      sentimentLabel: "positive",
    },
  ],
  ETH: [
    {
      id: "eth-1",
      headline: "Ethereum sentiment improves as network activity rebounds",
      description: "Developers and traders point to renewed strength in on-chain flows.",
      url: "https://example.com/eth-1",
      sourceName: "CoinDesk",
      publishedAt: new Date().toISOString(),
      sentimentScore: 0.18,
      sentimentLabel: "positive",
    },
  ],
  SOL: [
    {
      id: "sol-1",
      headline: "Solana buyers return even as price trades below last week highs",
      description: "News flow remains constructive despite short-term downside pressure.",
      url: "https://example.com/sol-1",
      sourceName: "Reuters",
      publishedAt: new Date().toISOString(),
      sentimentScore: 0.29,
      sentimentLabel: "positive",
    },
  ],
  "GBP/USD": [
    {
      id: "gbp-1",
      headline: "Sterling under pressure as traders reassess BoE growth outlook",
      description: "Macro headlines remain cautious and sentiment has softened.",
      url: "https://example.com/gbp-1",
      sourceName: "Financial Times",
      publishedAt: new Date().toISOString(),
      sentimentScore: -0.24,
      sentimentLabel: "negative",
    },
  ],
};

watchlistAssets = watchlistAssets.map((asset) => ({
  ...asset,
  recentNews: articleSets[asset.symbol] || [],
}));

let trades: TradeEntry[] = [
  {
    id: "trade-1",
    userId: "demo-user",
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
    userId: "demo-user",
    symbol: "SOL",
    assetType: "CRYPTO",
    direction: "LONG",
    entryPrice: 191,
    exitPrice: null,
    quantity: 6,
    currency: "USD",
    entryAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    exitAt: null,
    status: "OPEN",
    notes: "Sentiment improved before price followed.",
    tags: ["divergence"],
    pnl: null,
    pnlPercent: null,
    riskRewardRatio: 2.4,
    stopLoss: 179,
    takeProfit: 208,
    sentimentAtEntry: 0.27,
    sentimentLabelEntry: "positive",
    articleCountEntry: 14,
    sentimentAtExit: null,
    sentimentLabelExit: null,
    divergenceFlagEntry: true,
    divergenceNoteEntry: "Bullish sentiment while price was still weak.",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

function makeChart(symbol: string, basePrice: number, baseSentiment: number): ChartPoint[] {
  return Array.from({ length: 24 }).map((_, index) => {
    const timestamp = Date.now() - (24 - index) * 60 * 60 * 1000;
    const swing = Math.sin(index * 0.9 + symbol.length) * 0.018;
    return {
      timestamp,
      price: Number((basePrice * (1 + swing)).toFixed(basePrice > 100 ? 2 : 4)),
      sentimentScore: Number((baseSentiment + Math.cos(index * 0.5) * 0.16).toFixed(3)),
      sentimentLabel: baseSentiment > 0 ? "positive" : "negative",
    };
  });
}

function getAsset(symbol: string) {
  return watchlistAssets.find((asset) => asset.symbol === symbol);
}

function buildAnalytics(): JournalAnalytics {
  const closedTrades = trades.filter((trade) => trade.status === "CLOSED");
  const pnlBySentimentBucket = {
    positive: [] as number[],
    negative: [] as number[],
    neutral: [] as number[],
  };

  closedTrades.forEach((trade) => {
    const bucket = trade.sentimentLabelEntry || "neutral";
    pnlBySentimentBucket[bucket].push(trade.pnlPercent || 0);
  });

  return {
    totalTrades: trades.length,
    winRate: closedTrades.length ? (closedTrades.filter((trade) => (trade.pnl || 0) > 0).length / closedTrades.length) * 100 : 0,
    avgPnl: closedTrades.length ? closedTrades.reduce((sum, trade) => sum + (trade.pnlPercent || 0), 0) / closedTrades.length : 0,
    sentimentAlignmentRate: 72,
    bestSentimentScore: 0.42,
    worstSentimentScore: -0.22,
    pnlBySentimentBucket,
    avgPnlBySentimentBucket: {
      positive: pnlBySentimentBucket.positive.length ? pnlBySentimentBucket.positive.reduce((sum, value) => sum + value, 0) / pnlBySentimentBucket.positive.length : 0,
      negative: pnlBySentimentBucket.negative.length ? pnlBySentimentBucket.negative.reduce((sum, value) => sum + value, 0) / pnlBySentimentBucket.negative.length : 0,
      neutral: pnlBySentimentBucket.neutral.length ? pnlBySentimentBucket.neutral.reduce((sum, value) => sum + value, 0) / pnlBySentimentBucket.neutral.length : 0,
    },
  };
}

export const demoApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    if (email !== "demo@example.com" || password !== "DemoPass123!") {
      throw new Error("Use the demo credentials: demo@example.com / DemoPass123!");
    }
    return { user: demoUser, token };
  },

  async register(email: string, _password: string, displayName?: string): Promise<AuthResponse> {
    demoUser = {
      id: "demo-user",
      email,
      displayName: displayName || "New Trader",
    };
    return { user: demoUser, token };
  },

  async me() {
    return { user: demoUser };
  },

  async getWatchlist() {
    return { assets: watchlistAssets };
  },

  async searchAssets(query: string) {
    const normalized = query.toLowerCase();
    return {
      results: searchCatalog.filter((asset) =>
        `${asset.symbol} ${asset.displayName}`.toLowerCase().includes(normalized)
      ),
    };
  },

  async addWatchlistAsset(payload: {
    symbol: string;
    assetType: "CRYPTO" | "FOREX";
    displayName: string;
    coinGeckoId?: string;
  }) {
    const existing = watchlistAssets.find((asset) => asset.symbol === payload.symbol);
    if (existing) {
      return { asset: existing };
    }

    const asset: WatchlistAsset = {
      id: payload.symbol.toLowerCase().replace(/\W/g, "-"),
      symbol: payload.symbol,
      assetType: payload.assetType,
      displayName: payload.displayName,
      coinGeckoId: payload.coinGeckoId,
      priceData: null,
      sentimentSnapshot: null,
      divergenceAlert: null,
      recentNews: [],
    };
    watchlistAssets = [...watchlistAssets, asset];
    return { asset };
  },

  async removeWatchlistAsset(id: string) {
    watchlistAssets = watchlistAssets.filter((asset) => asset.id !== id);
    return { success: true };
  },

  async getAssetDetail(symbol: string): Promise<AssetDetailResponse> {
    const asset = getAsset(symbol);
    if (!asset) throw new Error("Asset not found");
    const baseSentiment = asset.sentimentSnapshot?.avgScore || 0;
    const basePrice = asset.priceData?.price || 100;
    const chart = makeChart(symbol, basePrice, baseSentiment);
    return {
      asset,
      chart,
      historicalPrices: chart.map((point) => ({ timestamp: point.timestamp, price: point.price })),
      sentimentHistory: chart.map((point) => ({
        timestamp: point.timestamp,
        sentimentScore: point.sentimentScore,
        sentimentLabel: point.sentimentScore && point.sentimentScore > 0 ? "positive" : "negative",
      })),
    };
  },

  async getTrades() {
    return { trades };
  },

  async createTrade(input: Partial<TradeEntry>) {
    const trade: TradeEntry = {
      id: `trade-${trades.length + 1}`,
      userId: demoUser.id,
      symbol: input.symbol || "BTC",
      assetType: input.assetType || "CRYPTO",
      direction: input.direction || "LONG",
      entryPrice: input.entryPrice || 0,
      exitPrice: null,
      quantity: input.quantity || 0,
      currency: input.currency || "USD",
      entryAt: input.entryAt || new Date().toISOString(),
      exitAt: null,
      status: "OPEN",
      notes: input.notes || null,
      tags: input.tags || [],
      pnl: null,
      pnlPercent: null,
      riskRewardRatio: null,
      stopLoss: input.stopLoss || null,
      takeProfit: input.takeProfit || null,
      sentimentAtEntry: getAsset(input.symbol || "BTC")?.sentimentSnapshot?.avgScore || 0,
      sentimentLabelEntry: getAsset(input.symbol || "BTC")?.sentimentSnapshot?.dominantLabel || "neutral",
      articleCountEntry: getAsset(input.symbol || "BTC")?.sentimentSnapshot?.articleCount || 0,
      sentimentAtExit: null,
      sentimentLabelExit: null,
      divergenceFlagEntry: false,
      divergenceNoteEntry: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    trades = [trade, ...trades];
    return trade;
  },

  async closeTrade(id: string, exitPrice: number, exitAt: string) {
    const trade = trades.find((entry) => entry.id === id);
    if (!trade) throw new Error("Trade not found");
    trade.exitPrice = exitPrice;
    trade.exitAt = exitAt;
    trade.status = "CLOSED";
    trade.pnl = trade.direction === "LONG" ? (exitPrice - trade.entryPrice) * trade.quantity : (trade.entryPrice - exitPrice) * trade.quantity;
    trade.pnlPercent = (((exitPrice - trade.entryPrice) / trade.entryPrice) * 100) * (trade.direction === "SHORT" ? -1 : 1);
    trade.updatedAt = new Date().toISOString();
    return trade;
  },

  async getAnalytics() {
    return buildAnalytics();
  },

  async logout() {
    return { message: "Logged out" };
  },

  demoCredentials: {
    email: "demo@example.com",
    password: "DemoPass123!",
  },
};
