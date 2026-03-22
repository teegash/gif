export type AssetType = "CRYPTO" | "FOREX";
export type TradeDirection = "LONG" | "SHORT";
export type TradeStatus = "OPEN" | "CLOSED" | "CANCELLED";
export type ChartWindow = "24h" | "7d";
export type SentimentLabel = "positive" | "negative" | "neutral";
export type DivergenceType =
  | "BULLISH_PRICE_BEARISH_SENTIMENT"
  | "BEARISH_PRICE_BULLISH_SENTIMENT";
export type DivergenceSeverity = "LOW" | "MEDIUM" | "HIGH";

export interface PriceData {
  symbol: string;
  assetType: AssetType;
  price: number;
  priceChange24h: number | null;
  priceChangePercent24h: number | null;
  volume24h: number | null;
  marketCap: number | null;
  currency: string;
  capturedAt: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  description: string | null;
  url: string;
  sourceName: string;
  publishedAt: string;
  sentimentScore: number | null;
  sentimentLabel: SentimentLabel | null;
}

export interface SentimentSnapshot {
  symbol: string;
  windowHours: 24 | 168;
  avgScore: number;
  dominantLabel: SentimentLabel;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  articleCount: number;
  capturedAt: string;
}

export interface DivergenceAlert {
  symbol: string;
  priceChangePercent: number;
  sentimentScore: number;
  divergenceType: DivergenceType;
  severity: DivergenceSeverity;
  message: string;
  detectedAt: string;
}

export interface HistoricalPricePoint {
  timestamp: number;
  price: number;
}

export interface HistoricalSentimentPoint {
  timestamp: number;
  sentimentScore: number | null;
  sentimentLabel?: SentimentLabel;
}

export interface ChartPoint {
  timestamp: number;
  price: number;
  sentimentScore: number | null;
  sentimentLabel?: SentimentLabel;
}

export interface WatchlistAsset {
  id: string;
  symbol: string;
  assetType: AssetType;
  displayName: string;
  coinGeckoId?: string;
  priceData: PriceData | null;
  sentimentSnapshot: SentimentSnapshot | null;
  divergenceAlert: DivergenceAlert | null;
  recentNews: NewsArticle[];
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string | null;
  baseCurrency?: string;
  timezone?: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export interface TradeEntry {
  id: string;
  userId: string;
  symbol: string;
  assetType: AssetType;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice: number | null;
  quantity: number;
  currency: string;
  entryAt: string;
  exitAt: string | null;
  status: TradeStatus;
  notes: string | null;
  tags: string[];
  pnl: number | null;
  pnlPercent: number | null;
  riskRewardRatio: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  sentimentAtEntry: number | null;
  sentimentLabelEntry: SentimentLabel | null;
  articleCountEntry: number | null;
  sentimentAtExit: number | null;
  sentimentLabelExit: SentimentLabel | null;
  divergenceFlagEntry: boolean;
  divergenceNoteEntry: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JournalAnalytics {
  totalTrades: number;
  winRate: number;
  avgPnl: number;
  sentimentAlignmentRate: number;
  bestSentimentScore: number;
  worstSentimentScore: number;
  pnlBySentimentBucket: Record<SentimentLabel, number[]>;
  avgPnlBySentimentBucket: Record<SentimentLabel, number>;
}

export interface AssetDetailResponse {
  asset: WatchlistAsset;
  chart: ChartPoint[];
  historicalPrices: HistoricalPricePoint[];
  sentimentHistory: HistoricalSentimentPoint[];
}

export interface HealthResponse {
  status: "ok" | "degraded";
  timestamp: string;
  services: {
    database: string;
    redis: string;
    sentimentEngine: string;
  };
  quotas: {
    alphavantage: number;
    newsapi: number;
    gnews: number;
  };
}
