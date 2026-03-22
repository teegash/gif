import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import DivergenceBanner from "../components/DivergenceBanner";
import DualAxisChart from "../components/DualAxisChart";
import NewsPanel from "../components/NewsPanel";
import { api } from "../lib/api";
import { formatMoney, formatPercent } from "../lib/utils";
import { useWatchlistStore } from "../store/watchlist.store";

export default function AssetDetailPage() {
  const { symbol = "" } = useParams();
  const chartWindow = useWatchlistStore((state) => state.chartWindow);
  const setChartWindow = useWatchlistStore((state) => state.setChartWindow);
  const decodedSymbol = decodeURIComponent(symbol);

  const { data, isLoading } = useQuery({
    queryKey: ["asset-detail", decodedSymbol, chartWindow],
    queryFn: () => api.getAssetDetail(decodedSymbol, chartWindow),
  });

  const asset = data?.asset;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/" className="mb-3 inline-flex items-center gap-2 text-sm text-teal-200 hover:text-teal-100">
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
          <h1 className="text-4xl font-semibold text-white">{asset?.symbol || decodedSymbol}</h1>
          <p className="mt-2 text-sm text-slate-400">{asset?.displayName}</p>
        </div>

        <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
          {(["24h", "7d"] as const).map((window) => (
            <button
              key={window}
              type="button"
              onClick={() => setChartWindow(window)}
              className={`rounded-xl px-4 py-2 text-sm transition ${chartWindow === window ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10"}`}
            >
              {window}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className="panel p-5 text-slate-400">Loading asset detail...</div>}

      {asset && (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <div className="panel p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Price</p>
              <p className="mt-3 text-3xl font-semibold text-white">{formatMoney(asset.priceData?.price, asset.priceData?.currency)}</p>
              <p className={`mt-2 text-sm ${asset.priceData && (asset.priceData.priceChangePercent24h || 0) >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                {formatPercent(asset.priceData?.priceChangePercent24h)}
              </p>
            </div>
            <div className="panel p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Sentiment score</p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {asset.sentimentSnapshot ? `${asset.sentimentSnapshot.avgScore > 0 ? "+" : ""}${asset.sentimentSnapshot.avgScore.toFixed(2)}` : "—"}
              </p>
              <p className="mt-2 text-sm text-slate-400">{asset.sentimentSnapshot?.dominantLabel || "No sentiment snapshot"}</p>
            </div>
            <div className="panel p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Article coverage</p>
              <p className="mt-3 text-3xl font-semibold text-white">{asset.sentimentSnapshot?.articleCount || 0}</p>
              <p className="mt-2 text-sm text-slate-400">Articles used in latest sentiment aggregation</p>
            </div>
          </section>

          <DivergenceBanner alert={asset.divergenceAlert} />

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <DualAxisChart data={data.chart} symbol={asset.symbol} window={chartWindow} />
            <NewsPanel articles={asset.recentNews} />
          </section>
        </>
      )}
    </div>
  );
}

