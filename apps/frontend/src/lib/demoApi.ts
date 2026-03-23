import {
  AssetSearchResult,
  AssetDetailResponse,
  AuthResponse,
  ChartPoint,
  DivergenceAlert,
  JournalAnalytics,
  PriceData,
  SentimentLabel,
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

type DemoCatalogEntry = AssetSearchResult & {
  basePrice: number;
  priceChangePercent24h: number;
  baseSentiment: number;
  volume24h: number | null;
  marketCap: number | null;
  keywords: string[];
};

const demoCatalog: DemoCatalogEntry[] = [
  {
    symbol: "BTC",
    assetType: "CRYPTO",
    displayName: "Bitcoin",
    coinGeckoId: "bitcoin",
    basePrice: 67240,
    priceChangePercent24h: 3.31,
    baseSentiment: 0.38,
    volume24h: 51234000000,
    marketCap: 1320000000000,
    keywords: ["bitcoin", "institutional flows", "ETF demand"],
  },
  {
    symbol: "ETH",
    assetType: "CRYPTO",
    displayName: "Ethereum",
    coinGeckoId: "ethereum",
    basePrice: 3480,
    priceChangePercent24h: 1.34,
    baseSentiment: 0.12,
    volume24h: 21450000000,
    marketCap: 418000000000,
    keywords: ["ethereum", "staking", "network activity"],
  },
  {
    symbol: "SOL",
    assetType: "CRYPTO",
    displayName: "Solana",
    coinGeckoId: "solana",
    basePrice: 184.13,
    priceChangePercent24h: -2.23,
    baseSentiment: 0.27,
    volume24h: 3200000000,
    marketCap: 89000000000,
    keywords: ["solana", "developer activity", "throughput"],
  },
  {
    symbol: "ADA",
    assetType: "CRYPTO",
    displayName: "Cardano",
    coinGeckoId: "cardano",
    basePrice: 0.74,
    priceChangePercent24h: 1.16,
    baseSentiment: 0.09,
    volume24h: 680000000,
    marketCap: 26200000000,
    keywords: ["cardano", "ecosystem updates", "layer one"],
  },
  {
    symbol: "XRP",
    assetType: "CRYPTO",
    displayName: "XRP",
    coinGeckoId: "ripple",
    basePrice: 0.62,
    priceChangePercent24h: 0.84,
    baseSentiment: 0.04,
    volume24h: 1700000000,
    marketCap: 34000000000,
    keywords: ["xrp", "payments", "regulatory outlook"],
  },
  {
    symbol: "BNB",
    assetType: "CRYPTO",
    displayName: "BNB",
    coinGeckoId: "binancecoin",
    basePrice: 588,
    priceChangePercent24h: 1.92,
    baseSentiment: 0.13,
    volume24h: 1400000000,
    marketCap: 86000000000,
    keywords: ["bnb", "exchange flows", "token utility"],
  },
  {
    symbol: "DOGE",
    assetType: "CRYPTO",
    displayName: "Dogecoin",
    coinGeckoId: "dogecoin",
    basePrice: 0.18,
    priceChangePercent24h: -1.47,
    baseSentiment: -0.05,
    volume24h: 990000000,
    marketCap: 26000000000,
    keywords: ["dogecoin", "meme coin", "retail traders"],
  },
  {
    symbol: "AVAX",
    assetType: "CRYPTO",
    displayName: "Avalanche",
    coinGeckoId: "avalanche-2",
    basePrice: 42.6,
    priceChangePercent24h: 2.11,
    baseSentiment: 0.07,
    volume24h: 750000000,
    marketCap: 17000000000,
    keywords: ["avalanche", "subnets", "defi liquidity"],
  },
  {
    symbol: "EUR/USD",
    assetType: "FOREX",
    displayName: "Euro / US Dollar",
    basePrice: 1.0924,
    priceChangePercent24h: 0.36,
    baseSentiment: 0.11,
    volume24h: null,
    marketCap: null,
    keywords: ["ecb", "fed", "euro dollar"],
  },
  {
    symbol: "GBP/USD",
    assetType: "FOREX",
    displayName: "British Pound / US Dollar",
    basePrice: 1.2742,
    priceChangePercent24h: -1.12,
    baseSentiment: -0.22,
    volume24h: null,
    marketCap: null,
    keywords: ["sterling", "boe", "growth outlook"],
  },
  {
    symbol: "USD/JPY",
    assetType: "FOREX",
    displayName: "US Dollar / Japanese Yen",
    basePrice: 151.82,
    priceChangePercent24h: 0.58,
    baseSentiment: -0.31,
    volume24h: null,
    marketCap: null,
    keywords: ["yen", "boj", "intervention risk"],
  },
  {
    symbol: "XAU/USD",
    assetType: "FOREX",
    displayName: "Gold / US Dollar",
    basePrice: 2192.1,
    priceChangePercent24h: 0.91,
    baseSentiment: 0.42,
    volume24h: null,
    marketCap: null,
    keywords: ["gold", "safe haven", "real yields"],
  },
  {
    symbol: "USD/CAD",
    assetType: "FOREX",
    displayName: "US Dollar / Canadian Dollar",
    basePrice: 1.3526,
    priceChangePercent24h: -0.28,
    baseSentiment: -0.06,
    volume24h: null,
    marketCap: null,
    keywords: ["loonie", "oil correlation", "bank of canada"],
  },
  {
    symbol: "AUD/USD",
    assetType: "FOREX",
    displayName: "Australian Dollar / US Dollar",
    basePrice: 0.6584,
    priceChangePercent24h: 0.41,
    baseSentiment: 0.08,
    volume24h: null,
    marketCap: null,
    keywords: ["aussie", "rba", "china demand"],
  },
  {
    symbol: "USD/CHF",
    assetType: "FOREX",
    displayName: "US Dollar / Swiss Franc",
    basePrice: 0.8823,
    priceChangePercent24h: -0.18,
    baseSentiment: -0.04,
    volume24h: null,
    marketCap: null,
    keywords: ["swiss franc", "snb", "safe haven"],
  },
  {
    symbol: "NZD/USD",
    assetType: "FOREX",
    displayName: "New Zealand Dollar / US Dollar",
    basePrice: 0.6112,
    priceChangePercent24h: 0.22,
    baseSentiment: 0.03,
    volume24h: null,
    marketCap: null,
    keywords: ["kiwi dollar", "rbnz", "risk appetite"],
  },
  {
    symbol: "EUR/GBP",
    assetType: "FOREX",
    displayName: "Euro / British Pound",
    basePrice: 0.8564,
    priceChangePercent24h: 0.19,
    baseSentiment: 0.02,
    volume24h: null,
    marketCap: null,
    keywords: ["euro sterling", "ecb", "boe"],
  },
  {
    symbol: "EUR/JPY",
    assetType: "FOREX",
    displayName: "Euro / Japanese Yen",
    basePrice: 165.74,
    priceChangePercent24h: 0.72,
    baseSentiment: 0.12,
    volume24h: null,
    marketCap: null,
    keywords: ["euro yen", "carry trade", "boj"],
  },
  {
    symbol: "EUR/CHF",
    assetType: "FOREX",
    displayName: "Euro / Swiss Franc",
    basePrice: 0.9581,
    priceChangePercent24h: 0.08,
    baseSentiment: 0.01,
    volume24h: null,
    marketCap: null,
    keywords: ["euro swiss franc", "ecb", "snb"],
  },
  {
    symbol: "USD/KES",
    assetType: "FOREX",
    displayName: "US Dollar / Kenyan Shilling",
    basePrice: 129.36,
    priceChangePercent24h: -0.54,
    baseSentiment: -0.09,
    volume24h: null,
    marketCap: null,
    keywords: ["kenyan shilling", "cbk", "import demand"],
  },
];

const defaultSymbols = ["BTC", "ETH", "SOL", "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD"];

function classifySentiment(score: number): SentimentLabel {
  if (score >= 0.05) return "positive";
  if (score <= -0.05) return "negative";
  return "neutral";
}

function toAssetId(symbol: string) {
  return symbol.toLowerCase().replace(/\W/g, "-");
}

function getCatalogEntry(symbol: string) {
  return demoCatalog.find((asset) => asset.symbol === symbol);
}

function roundPrice(symbol: string, assetType: "CRYPTO" | "FOREX", price: number) {
  if (assetType === "FOREX" && /JPY|KES|XAU/.test(symbol)) {
    return Number(price.toFixed(2));
  }

  if (assetType === "CRYPTO" && price < 1) {
    return Number(price.toFixed(4));
  }

  return Number(price.toFixed(assetType === "FOREX" ? 4 : 2));
}

function buildPriceData(entry: DemoCatalogEntry): PriceData {
  const price = roundPrice(entry.symbol, entry.assetType, entry.basePrice);
  const priceChange24h = Number((price - price / (1 + entry.priceChangePercent24h / 100)).toFixed(4));

  return {
    symbol: entry.symbol,
    assetType: entry.assetType,
    price,
    priceChange24h,
    priceChangePercent24h: entry.priceChangePercent24h,
    volume24h: entry.volume24h,
    marketCap: entry.marketCap,
    currency: entry.symbol.includes("/") ? entry.symbol.split("/")[1] : "USD",
    capturedAt: new Date().toISOString(),
  };
}

function buildSentimentSnapshot(entry: DemoCatalogEntry): SentimentSnapshot {
  const articleCount = entry.assetType === "CRYPTO" ? 16 : 13;
  const positiveCount = Math.max(1, Math.round(((entry.baseSentiment + 1) / 2) * articleCount * 0.72));
  const negativeCount = Math.max(1, Math.round(((1 - entry.baseSentiment) / 2) * articleCount * 0.45));
  const neutralCount = Math.max(0, articleCount - positiveCount - negativeCount);

  return {
    symbol: entry.symbol,
    windowHours: 24,
    avgScore: Number(entry.baseSentiment.toFixed(3)),
    dominantLabel: classifySentiment(entry.baseSentiment),
    positiveCount,
    negativeCount,
    neutralCount,
    articleCount,
    capturedAt: new Date().toISOString(),
  };
}

function buildRecentNews(entry: DemoCatalogEntry): WatchlistAsset["recentNews"] {
  const upbeat = entry.baseSentiment >= 0;
  const headlines = upbeat
    ? [
        `${entry.displayName} buyers stay engaged as ${entry.keywords[1]} improves`,
        `${entry.displayName} sentiment holds firm while traders watch ${entry.keywords[2]}`,
      ]
    : [
        `${entry.displayName} traders turn cautious as ${entry.keywords[1]} softens`,
        `${entry.displayName} momentum cools while desks monitor ${entry.keywords[2]}`,
      ];

  return headlines.map((headline, index) => {
    const score = Number((entry.baseSentiment + (index === 0 ? 0.08 : -0.03)).toFixed(3));
    return {
      id: `${toAssetId(entry.symbol)}-article-${index + 1}`,
      headline,
      description: `${entry.displayName} remains active on trader watchlists as markets compare price action with news flow.`,
      url: `https://example.com/${toAssetId(entry.symbol)}/${index + 1}`,
      sourceName: index % 2 === 0 ? "Reuters" : "Bloomberg",
      publishedAt: new Date(Date.now() - index * 2 * 60 * 60 * 1000).toISOString(),
      sentimentScore: score,
      sentimentLabel: classifySentiment(score),
    };
  });
}

function buildDivergenceAlert(
  entry: DemoCatalogEntry,
  priceData: PriceData,
  sentimentSnapshot: SentimentSnapshot
): DivergenceAlert | null {
  if (priceData.priceChangePercent24h === null) {
    return null;
  }

  if (priceData.priceChangePercent24h < -1 && sentimentSnapshot.avgScore > 0.15) {
    return {
      symbol: entry.symbol,
      priceChangePercent: priceData.priceChangePercent24h,
      sentimentScore: sentimentSnapshot.avgScore,
      divergenceType: "BEARISH_PRICE_BULLISH_SENTIMENT",
      severity: Math.abs(priceData.priceChangePercent24h) > 2 ? "HIGH" : "MEDIUM",
      message: `${entry.symbol} is dipping while sentiment stays constructive, suggesting hidden strength.`,
      detectedAt: new Date().toISOString(),
    };
  }

  if (priceData.priceChangePercent24h > 1 && sentimentSnapshot.avgScore < -0.15) {
    return {
      symbol: entry.symbol,
      priceChangePercent: priceData.priceChangePercent24h,
      sentimentScore: sentimentSnapshot.avgScore,
      divergenceType: "BULLISH_PRICE_BEARISH_SENTIMENT",
      severity: Math.abs(priceData.priceChangePercent24h) > 2 ? "HIGH" : "MEDIUM",
      message: `${entry.symbol} is rising even while sentiment remains weak, raising a reversal risk.`,
      detectedAt: new Date().toISOString(),
    };
  }

  return null;
}

function buildWatchlistAsset(entry: DemoCatalogEntry): WatchlistAsset {
  const priceData = buildPriceData(entry);
  const sentimentSnapshot = buildSentimentSnapshot(entry);

  return {
    id: toAssetId(entry.symbol),
    symbol: entry.symbol,
    assetType: entry.assetType,
    displayName: entry.displayName,
    coinGeckoId: entry.coinGeckoId,
    priceData,
    sentimentSnapshot,
    divergenceAlert: buildDivergenceAlert(entry, priceData, sentimentSnapshot),
    recentNews: buildRecentNews(entry),
  };
}

let watchlistAssets: WatchlistAsset[] = defaultSymbols
  .map((symbol) => getCatalogEntry(symbol))
  .filter((entry): entry is DemoCatalogEntry => Boolean(entry))
  .map(buildWatchlistAsset);

const searchCatalog: AssetSearchResult[] = demoCatalog.map((entry) => ({
  symbol: entry.symbol,
  assetType: entry.assetType,
  displayName: entry.displayName,
  coinGeckoId: entry.coinGeckoId,
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
    const sentimentScore = Number((baseSentiment + Math.cos(index * 0.5) * 0.16).toFixed(3));
    return {
      timestamp,
      price: Number((basePrice * (1 + swing)).toFixed(basePrice > 100 ? 2 : 4)),
      sentimentScore,
      sentimentLabel: classifySentiment(sentimentScore),
    };
  });
}

function getAsset(symbol: string) {
  const catalogEntry = getCatalogEntry(symbol);
  return watchlistAssets.find((asset) => asset.symbol === symbol) || (catalogEntry ? buildWatchlistAsset(catalogEntry) : undefined);
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
      ...(getCatalogEntry(payload.symbol)
        ? buildWatchlistAsset(getCatalogEntry(payload.symbol)!)
        : {
            id: payload.symbol.toLowerCase().replace(/\W/g, "-"),
            symbol: payload.symbol,
            assetType: payload.assetType,
            displayName: payload.displayName,
            coinGeckoId: payload.coinGeckoId,
            priceData: null,
            sentimentSnapshot: null,
            divergenceAlert: null,
            recentNews: [],
          }),
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
        sentimentLabel:
          point.sentimentScore !== null ? classifySentiment(point.sentimentScore) : undefined,
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
