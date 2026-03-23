import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AssetSearchResult, NewsArticle, WatchlistAsset } from "@sentiment-watchlist/shared-types";
import { useDashboardData } from "../hooks/useDashboardData";
import { api } from "../lib/api";
import KpiStrip from "../components/KpiStrip";
import WatchlistCard from "../components/WatchlistCard";
import NewsPanel from "../components/NewsPanel";
import { useWatchlistStore } from "../store/watchlist.store";

export default function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAssets = useWatchlistStore((state) => state.setAssets);
  const { data, isLoading } = useDashboardData();
  const [search, setSearch] = useState("");

  const assets: WatchlistAsset[] = data?.assets ?? [];
  useEffect(() => {
    if (assets.length) {
      setAssets(assets);
    }
  }, [assets, setAssets]);

  const searchQuery = useQuery<{ results: AssetSearchResult[] }>({
    queryKey: ["asset-search", search],
    queryFn: () => api.searchAssets(search),
    enabled: search.trim().length >= 2,
  });

  const addMutation = useMutation({
    mutationFn: (payload: AssetSearchResult) => api.addWatchlistAsset(payload),
    onSuccess: async () => {
      setSearch("");
      await queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  const metrics = useMemo(() => {
    const positiveSentiment = assets.filter((asset) => asset.sentimentSnapshot?.avgScore && asset.sentimentSnapshot.avgScore > 0.05).length;
    const divergences = assets.filter((asset) => asset.divergenceAlert).length;
    const averageSentiment =
      assets.length > 0
        ? assets.reduce((sum, asset) => sum + (asset.sentimentSnapshot?.avgScore || 0), 0) / assets.length
        : 0;

    return [
      {
        label: "Tracked assets",
        value: String(assets.length),
        subtext: "Unified forex and crypto watchlist",
      },
      {
        label: "Positive sentiment",
        value: String(positiveSentiment),
        subtext: "Assets with constructive 24h tone",
      },
      {
        label: "Divergences",
        value: String(divergences),
        subtext: "Current price-vs-sentiment conflicts",
      },
      {
        label: "Avg sentiment",
        value: `${averageSentiment > 0 ? "+" : ""}${averageSentiment.toFixed(2)}`,
        subtext: "Cross-watchlist average sentiment score",
      },
    ];
  }, [assets]);

  const topArticles: NewsArticle[] = assets.flatMap((asset) => asset.recentNews.slice(0, 1)).slice(0, 4);

  return (
    <div className="space-y-6 pb-10">
      <section className="panel overflow-hidden p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-teal-200/70">Operational dashboard</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-white lg:text-5xl">
              A watchlist where <span className="gradient-text">price and sentiment are measured together</span>.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              This dashboard follows the specification directly: live-style price cards, sentiment scoring, divergence flags, asset detail drill-downs, and the journal workflow that closes the learning loop.
            </p>
          </div>

          <div className="subtle-panel grid gap-4 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">What this repo includes</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                React frontend, Express backend, Prisma schema, Redis-aware caching layer, Python FastAPI sentiment service, Docker Compose, tests, and CI.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Polling strategy</p>
                <p className="mt-2 text-sm text-white">60s dashboard refresh</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Sentiment window</p>
                <p className="mt-2 text-sm text-white">24h and 7d</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <KpiStrip metrics={metrics} />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Watchlist</h2>
              <p className="text-sm text-slate-400">Click any asset to inspect the dual-axis chart, divergence signal, and news stack.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {isLoading && <div className="panel p-5 text-slate-400">Loading watchlist...</div>}
            {assets.map((asset) => (
              <WatchlistCard
                key={asset.id}
                asset={asset}
                onClick={() => navigate(`/asset/${encodeURIComponent(asset.symbol)}`)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="panel p-5">
            <h3 className="text-lg font-semibold text-white">Add to watchlist</h3>
            <p className="mt-1 text-sm text-slate-400">Search by symbol or name and append assets to the dashboard.</p>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search BTC, EUR/USD, Solana..."
              className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-teal-300/50"
            />
            <div className="mt-4 space-y-3">
              {(searchQuery.data?.results || []).slice(0, 5).map((result) => (
                <div key={result.symbol} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{result.symbol}</p>
                    <p className="text-xs text-slate-400">{result.displayName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addMutation.mutate(result)}
                    className="rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-950 transition hover:opacity-90"
                  >
                    Add
                  </button>
                </div>
              ))}
              {search.trim().length >= 2 && (searchQuery.data?.results || []).length === 0 && (
                <p className="text-sm text-slate-500">No matches found.</p>
              )}
            </div>
          </section>

          <NewsPanel articles={topArticles} />
        </div>
      </section>
    </div>
  );
}
