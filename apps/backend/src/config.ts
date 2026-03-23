import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3001),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  mockMode: process.env.MOCK_MODE !== "false",
  jwtSecret: process.env.JWT_SECRET || "replace-me",
  jwtExpiry: process.env.JWT_EXPIRY || "24h",
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12),
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  sentimentEngineUrl: process.env.SENTIMENT_ENGINE_URL || "http://localhost:8000",
  alphaVantageKey: process.env.ALPHA_VANTAGE_KEY || "",
  alphaVantageBaseUrl: process.env.ALPHA_VANTAGE_BASE_URL || "https://www.alphavantage.co/query",
  coinGeckoApiKey: process.env.COINGECKO_API_KEY || "",
  coinGeckoApiKeyHeader: process.env.COINGECKO_API_KEY_HEADER || "x-cg-demo-api-key",
  coinGeckoBaseUrl: process.env.COINGECKO_BASE_URL || "https://api.coingecko.com/api/v3",
  newsApiKey: process.env.NEWSAPI_KEY || "",
  newsApiBaseUrl: process.env.NEWSAPI_BASE_URL || "https://newsapi.org/v2",
  gnewsKey: process.env.GNEWS_KEY || "",
  gnewsBaseUrl: process.env.GNEWS_BASE_URL || "https://gnews.io/api/v4",
  frankfurterBaseUrl: process.env.FRANKFURTER_BASE_URL || "https://api.frankfurter.app",
  alphaVantageDailyLimit: Number(process.env.ALPHA_VANTAGE_DAILY_LIMIT || 25),
  newsApiDailyLimit: Number(process.env.NEWSAPI_DAILY_LIMIT || 100),
  gnewsDailyLimit: Number(process.env.GNEWS_DAILY_LIMIT || 100),
};
