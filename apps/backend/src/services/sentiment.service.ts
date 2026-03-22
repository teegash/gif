import axios from "axios";
import { NewsArticle, SentimentLabel, SentimentSnapshot } from "@sentiment-watchlist/shared-types";
import { config } from "../config";
import { assetCatalog, generateSentiment, sentimentHistoryStore } from "../data/mock-data";
import { fetchNewsForSymbol } from "../adapters/news.adapter";
import { prisma } from "../lib/prisma";
import { redisClient } from "../lib/redis";
import logger from "../lib/logger";

export const ASSET_KEYWORDS: Record<string, string[]> = Object.fromEntries(
  assetCatalog.map((asset) => [asset.symbol, asset.newsKeywords])
);

const POSITIVE_TERMS = ["bullish", "rally", "breakout", "surge", "adoption", "upside", "strength", "beat"];
const NEGATIVE_TERMS = ["bearish", "crash", "plunge", "collapse", "ban", "uncertainty", "pullback", "pressure"];

function classifyLabel(score: number): SentimentLabel {
  if (score >= 0.05) return "positive";
  if (score <= -0.05) return "negative";
  return "neutral";
}

function heuristicScore(text: string) {
  const normalized = text.toLowerCase();
  let score = 0;
  for (const term of POSITIVE_TERMS) {
    if (normalized.includes(term)) score += 0.14;
  }
  for (const term of NEGATIVE_TERMS) {
    if (normalized.includes(term)) score -= 0.14;
  }
  return Math.max(-1, Math.min(1, Number(score.toFixed(3))));
}

async function scoreArticlesLocally(articles: NewsArticle[]) {
  const results = articles.map((article) => {
    const score = heuristicScore(`${article.headline}. ${article.description || ""}`);
    return {
      id: article.id,
      score,
      label: classifyLabel(score),
      compound: score,
      positive: Math.max(0, score),
      negative: Math.max(0, Math.abs(Math.min(0, score))),
      neutral: 1 - Math.min(1, Math.abs(score)),
    };
  });

  const avgScore = results.reduce((sum, item) => sum + item.score, 0) / results.length;
  return {
    results,
    avgScore: Number(avgScore.toFixed(4)),
    dominantLabel: classifyLabel(avgScore),
    positiveCount: results.filter((item) => item.label === "positive").length,
    negativeCount: results.filter((item) => item.label === "negative").length,
    neutralCount: results.filter((item) => item.label === "neutral").length,
  };
}

export async function computeSentimentForSymbol(
  symbol: string,
  windowHours: 24 | 168
): Promise<SentimentSnapshot | null> {
  const cacheKey = `sentiment:${symbol}:${windowHours}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached) as SentimentSnapshot;
  }

  if (config.mockMode) {
    const snapshot = generateSentiment(symbol, windowHours);
    const history = sentimentHistoryStore.get(symbol) || [];
    history.push(snapshot);
    sentimentHistoryStore.set(symbol, history.slice(-30));
    await redisClient.setex(cacheKey, 1800, JSON.stringify(snapshot));
    return snapshot;
  }

  const keywords = ASSET_KEYWORDS[symbol] || [symbol];
  const articles = await fetchNewsForSymbol(symbol, keywords, windowHours);
  if (!articles.length) return null;

  let scored: any;
  try {
    const response = await axios.post(
      `${config.sentimentEngineUrl}/score`,
      {
        articles: articles.map((article) => ({
          id: article.id,
          text: `${article.headline}. ${article.description || ""}`,
        })),
      },
      { timeout: 15000 }
    );
    scored = response.data;
  } catch (error) {
    logger.warn(`[Sentiment] Engine unavailable for ${symbol}, using local heuristic`);
    scored = await scoreArticlesLocally(articles);
  }

  const snapshot: SentimentSnapshot = {
    symbol,
    windowHours,
    avgScore: scored.avgScore,
    dominantLabel: scored.dominantLabel,
    positiveCount: scored.positiveCount,
    negativeCount: scored.negativeCount,
    neutralCount: scored.neutralCount,
    articleCount: articles.length,
    capturedAt: new Date().toISOString(),
  };

  if (prisma) {
    try {
      await prisma.sentimentSnapshot.create({
        data: {
          symbol,
          windowHours,
          avgScore: snapshot.avgScore,
          positiveCount: snapshot.positiveCount,
          negativeCount: snapshot.negativeCount,
          neutralCount: snapshot.neutralCount,
          articleCount: snapshot.articleCount,
          dominantLabel: snapshot.dominantLabel,
        },
      });
    } catch (error) {
      logger.warn(`[Sentiment] Could not persist snapshot for ${symbol}: ${(error as Error).message}`);
    }
  }

  await redisClient.setex(cacheKey, 1800, JSON.stringify(snapshot));
  return snapshot;
}

export async function scoreNewsArticles(symbol: string, windowHours: 24 | 168): Promise<NewsArticle[]> {
  const articles = await fetchNewsForSymbol(symbol, ASSET_KEYWORDS[symbol] || [symbol], windowHours);
  const scored = await scoreArticlesLocally(articles);
  const results = new Map(scored.results.map((result) => [result.id, result]));
  return articles.map((article) => {
    const result = results.get(article.id);
    return {
      ...article,
      sentimentScore: result?.score ?? article.sentimentScore,
      sentimentLabel: result?.label ?? article.sentimentLabel,
    };
  });
}
