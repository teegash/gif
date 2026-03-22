import { AlertTriangle, ShieldAlert } from "lucide-react";
import { DivergenceAlert } from "@sentiment-watchlist/shared-types";

export default function DivergenceBanner({ alert }: { alert: DivergenceAlert | null }) {
  if (!alert) {
    return (
      <div className="panel p-4 text-sm text-slate-400">
        No active divergence signal for this asset in the current 24h window.
      </div>
    );
  }

  const severe = alert.severity === "HIGH";
  return (
    <div className={`panel p-5 ${severe ? "border-red-400/30" : "border-teal-300/20"}`}>
      <div className="mb-3 flex items-center gap-2 text-white">
        {severe ? <ShieldAlert className="text-red-300" size={18} /> : <AlertTriangle className="text-amber-300" size={18} />}
        <h3 className="text-lg font-semibold">Divergence signal</h3>
      </div>
      <p className="text-sm text-slate-300">{alert.message}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">Severity: {alert.severity}</span>
        <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">Sentiment: {alert.sentimentScore.toFixed(2)}</span>
        <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">Price change: {alert.priceChangePercent.toFixed(2)}%</span>
      </div>
    </div>
  );
}

