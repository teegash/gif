import axios from "axios";
import {
  AssetDetailResponse,
  AssetSearchResult,
  AuthResponse,
  JournalAnalytics,
  TradeEntry,
  UserProfile,
  WatchlistAsset,
} from "@sentiment-watchlist/shared-types";
import { demoApi } from "./demoApi";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
});

function setAuthHeader(token: string | null) {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
}

async function fallback<T>(request: () => Promise<T>, demo: () => Promise<T>) {
  try {
    return await request();
  } catch {
    return demo();
  }
}

export const api = {
  setAuthHeader,

  async login(email: string, password: string): Promise<AuthResponse> {
    return fallback(
      async () => (await client.post("/auth/login", { email, password })).data,
      () => demoApi.login(email, password)
    );
  },

  async register(email: string, password: string, displayName?: string): Promise<AuthResponse> {
    return fallback(
      async () => (await client.post("/auth/register", { email, password, displayName })).data,
      () => demoApi.register(email, password, displayName)
    );
  },

  async me(): Promise<{ user: UserProfile | null }> {
    return fallback(
      async () => (await client.get("/auth/me")).data,
      () => demoApi.me()
    );
  },

  async logout() {
    return fallback(
      async () => (await client.post("/auth/logout")).data,
      () => demoApi.logout()
    );
  },

  async getWatchlist(): Promise<{ assets: WatchlistAsset[] }> {
    return fallback(
      async () => (await client.get("/watchlist")).data,
      () => demoApi.getWatchlist()
    );
  },

  async searchAssets(query: string): Promise<{ results: AssetSearchResult[] }> {
    return fallback(
      async () => (await client.get("/watchlist/search", { params: { q: query } })).data,
      () => demoApi.searchAssets(query)
    );
  },

  async addWatchlistAsset(payload: AssetSearchResult): Promise<{ asset: AssetSearchResult | WatchlistAsset }> {
    return fallback(
      async () => (await client.post("/watchlist/assets", payload)).data,
      () => demoApi.addWatchlistAsset(payload)
    );
  },

  async removeWatchlistAsset(id: string): Promise<{ success: boolean }> {
    return fallback(
      async () => (await client.delete(`/watchlist/assets/${id}`)).data,
      () => demoApi.removeWatchlistAsset(id)
    );
  },

  async getAssetDetail(symbol: string, window: "24h" | "7d"): Promise<AssetDetailResponse> {
    return fallback(
      async () => (await client.get(`/assets/${encodeURIComponent(symbol)}`, { params: { window } })).data,
      () => demoApi.getAssetDetail(symbol)
    );
  },

  async getTrades(): Promise<{ trades: TradeEntry[] }> {
    return fallback(
      async () => (await client.get("/journal/trades")).data,
      () => demoApi.getTrades()
    );
  },

  async createTrade(payload: Partial<TradeEntry>): Promise<TradeEntry> {
    return fallback(
      async () => (await client.post("/journal/trade", payload)).data,
      () => demoApi.createTrade(payload)
    );
  },

  async closeTrade(id: string, exitPrice: number, exitAt: string): Promise<TradeEntry> {
    return fallback(
      async () => (await client.patch(`/journal/trade/${id}/close`, { exitPrice, exitAt })).data,
      () => demoApi.closeTrade(id, exitPrice, exitAt)
    );
  },

  async getAnalytics(): Promise<JournalAnalytics> {
    return fallback(
      async () => (await client.get("/journal/analytics")).data,
      () => demoApi.getAnalytics()
    );
  },
};
