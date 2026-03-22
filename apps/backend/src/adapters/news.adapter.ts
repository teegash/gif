import axios from "axios";
import { NewsArticle } from "@sentiment-watchlist/shared-types";
import { config } from "../config";
import { assetCatalog, generateNews } from "../data/mock-data";
import { redisClient } from "../lib/redis";
import logger from "../lib/logger";

const CACHE_TTL = 900;

async function getQuotaRemaining(source: "newsapi" | "gnews") {
  const used = await redisClient.get(`quota:${source}:daily`);
  const limit = source === "newsapi" ? config.newsApiDailyLimit : config.gnewsDailyLimit;
  return limit - Number(used || "0");
}

async function incrementQuota(source: "newsapi" | "gnews") {
  const key = `quota:${source}:daily`;
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const ttl = Math.floor((midnight.getTime() - now.getTime()) / 1000);
  const exists = await redisClient.exists(key);
  if (!exists) {
    await redisClient.setex(key, ttl, "1");
  } else {
    await redisClient.incr(key);
  }
}

async function fetchFromNewsApi(keywords: string[], hoursBack: number) {
  const from = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
  const response = await axios.get("https://newsapi.org/v2/everything", {
    params: {
      q: keywords.join(" OR "),
      language: "en",
      sortBy: "publishedAt",
      from,
      pageSize: 20,
      apiKey: config.newsApiKey,
    },
    timeout: 10000,
  });

  return response.data.articles.map(
    (article: any, index: number): NewsArticle => ({
      id: `newsapi-${index}`,
      headline: article.title,
      description: article.description,
      url: article.url,
      sourceName: article.source?.name || "Unknown",
      publishedAt: article.publishedAt,
      sentimentScore: null,
      sentimentLabel: null,
    })
  );
}

async function fetchFromGNews(keywords: string[]) {
  const response = await axios.get("https://gnews.io/api/v4/search", {
    params: {
      q: keywords.join(" OR "),
      lang: "en",
      max: 10,
      token: config.gnewsKey,
    },
    timeout: 10000,
  });

  return response.data.articles.map(
    (article: any, index: number): NewsArticle => ({
      id: `gnews-${index}`,
      headline: article.title,
      description: article.description,
      url: article.url,
      sourceName: article.source?.name || "GNews",
      publishedAt: article.publishedAt,
      sentimentScore: null,
      sentimentLabel: null,
    })
  );
}

export async function fetchNewsForSymbol(
  symbol: string,
  keywords?: string[],
  windowHours: 24 | 168 = 24
): Promise<NewsArticle[]> {
  const cacheKey = `news:${symbol}:${windowHours}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached) as NewsArticle[];
  }

  const catalog = assetCatalog.find((entry) => entry.symbol === symbol);
  const resolvedKeywords = keywords || catalog?.newsKeywords || [symbol];

  if (config.mockMode || (!config.newsApiKey && !config.gnewsKey)) {
    const articles = generateNews(symbol, windowHours === 24 ? 6 : 10);
    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(articles));
    return articles;
  }

  let articles: NewsArticle[] = [];

  if (config.newsApiKey && (await getQuotaRemaining("newsapi")) > 0) {
    try {
      articles = await fetchFromNewsApi(resolvedKeywords, windowHours);
      await incrementQuota("newsapi");
    } catch (error) {
      logger.warn(`[News] NewsAPI failed for ${symbol}: ${(error as Error).message}`);
    }
  }

  if (articles.length === 0 && config.gnewsKey && (await getQuotaRemaining("gnews")) > 0) {
    try {
      articles = await fetchFromGNews(resolvedKeywords);
      await incrementQuota("gnews");
    } catch (error) {
      logger.error(`[News] GNews failed for ${symbol}: ${(error as Error).message}`);
    }
  }

  await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(articles));
  return articles;
}
