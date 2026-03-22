import { DivergenceAlert, WatchlistAsset } from "@sentiment-watchlist/shared-types";
import { AlertTriangle, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { formatMoney } from "../lib/utils";

interface Props {
  asset: WatchlistAsset;
  onClick: () => void;
}

function SentimentBar({ score }: { score: number }) {
  const pct = ((score + 1) / 2) * 100;
  const color = score > 0.05 ? "bg-emerald-500" : score < -0.05 ? "bg-red-500" : "bg-amber-400";
  return (
    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function DivergenceBadge({ alert }: { alert: DivergenceAlert }) {
  const isBullTrap = alert.divergenceType === "BULLISH_PRICE_BEARISH_SENTIMENT";
  return (
    <div
      className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${
        isBullTrap ? "bg-red-950/60 text-red-300" : "bg-emerald-950/60 text-emerald-300"
      }`}
    >
      <AlertTriangle size={12} />
      {isBullTrap ? "Potential Trap" : "Hidden Strength"}
    </div>
  );
}

export default function WatchlistCard({ asset, onClick }: Props) {
  const price = asset.priceData;
  const sentiment = asset.sentimentSnapshot;
  const change = price?.priceChangePercent24h ?? 0;
  const TrendIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;

  return (
    <button
      type="button"
      onClick={onClick}
      className="panel w-full p-4 text-left transition-transform hover:-translate-y-0.5 hover:border-white/20"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{asset.symbol}</span>
            <span className="text-xs text-slate-400">{asset.displayName}</span>
          </div>
          {asset.divergenceAlert ? (
            <DivergenceBadge alert={asset.divergenceAlert} />
          ) : (
            <p className="mt-2 text-xs text-slate-500">No active divergence signal</p>
          )}
        </div>

        <div className="text-right">
          <div className="text-sm font-semibold text-white">
            {formatMoney(price?.price, price?.currency || "USD")}
          </div>
          <div className={`mt-1 inline-flex items-center gap-1 text-xs ${change >= 0 ? "text-emerald-300" : "text-red-300"}`}>
            <TrendIcon size={12} />
            <span>{change >= 0 ? "+" : ""}{change.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {sentiment && (
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
            <span>Sentiment ({sentiment.windowHours === 24 ? "24h" : "7d"})</span>
            <span
              className={
                sentiment.dominantLabel === "positive"
                  ? "text-emerald-300"
                  : sentiment.dominantLabel === "negative"
                    ? "text-red-300"
                    : "text-amber-300"
              }
            >
              {sentiment.dominantLabel} ({sentiment.avgScore > 0 ? "+" : ""}{sentiment.avgScore.toFixed(2)})
            </span>
          </div>
          <SentimentBar score={sentiment.avgScore} />
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
            <span className="text-emerald-300">↑ {sentiment.positiveCount}</span>
            <span className="text-red-300">↓ {sentiment.negativeCount}</span>
            <span>— {sentiment.neutralCount}</span>
            <span className="ml-auto">{sentiment.articleCount} articles</span>
          </div>
        </div>
      )}
    </button>
  );
}

