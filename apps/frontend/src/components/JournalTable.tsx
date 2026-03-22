import { TradeEntry } from "@sentiment-watchlist/shared-types";
import { format } from "date-fns";
import { formatMoney } from "../lib/utils";

interface Props {
  trades: TradeEntry[];
  onCloseTrade: (trade: TradeEntry) => void;
}

export default function JournalTable({ trades, onCloseTrade }: Props) {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-lg font-semibold text-white">Trade journal</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-5 py-3">Asset</th>
              <th className="px-5 py-3">Direction</th>
              <th className="px-5 py-3">Entry</th>
              <th className="px-5 py-3">Sentiment</th>
              <th className="px-5 py-3">P&L</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {trades.map((trade) => (
              <tr key={trade.id} className="text-slate-300">
                <td className="px-5 py-4">
                  <div className="font-medium text-white">{trade.symbol}</div>
                  <div className="text-xs text-slate-500">{format(new Date(trade.entryAt), "MMM d, yyyy HH:mm")}</div>
                </td>
                <td className="px-5 py-4">{trade.direction}</td>
                <td className="px-5 py-4">{formatMoney(trade.entryPrice, trade.currency)}</td>
                <td className="px-5 py-4">
                  <span className={trade.sentimentAtEntry && trade.sentimentAtEntry >= 0 ? "text-emerald-300" : "text-red-300"}>
                    {trade.sentimentAtEntry !== null ? `${trade.sentimentAtEntry > 0 ? "+" : ""}${trade.sentimentAtEntry?.toFixed(2)}` : "—"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {trade.pnlPercent !== null ? (
                    <span className={trade.pnlPercent >= 0 ? "text-emerald-300" : "text-red-300"}>
                      {trade.pnlPercent >= 0 ? "+" : ""}{trade.pnlPercent.toFixed(2)}%
                    </span>
                  ) : (
                    <span className="text-slate-500">Open</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs ${trade.status === "OPEN" ? "bg-amber-950/60 text-amber-300" : "bg-emerald-950/60 text-emerald-300"}`}>
                    {trade.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {trade.status === "OPEN" && (
                    <button
                      type="button"
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-white transition hover:bg-white/10"
                      onClick={() => onCloseTrade(trade)}
                    >
                      Close trade
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

