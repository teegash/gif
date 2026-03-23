import { JournalAnalytics, TradeEntry } from "@sentiment-watchlist/shared-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import KpiStrip from "../components/KpiStrip";
import JournalTable from "../components/JournalTable";
import TradeEntryForm from "../components/TradeEntryForm";
import { api } from "../lib/api";

export default function JournalPage() {
  const queryClient = useQueryClient();
  const tradesQuery = useQuery<{ trades: TradeEntry[] }>({
    queryKey: ["journal-trades"],
    queryFn: () => api.getTrades(),
  });
  const analyticsQuery = useQuery<JournalAnalytics>({
    queryKey: ["journal-analytics"],
    queryFn: () => api.getAnalytics(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Partial<TradeEntry>) => api.createTrade(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["journal-trades"] }),
        queryClient.invalidateQueries({ queryKey: ["journal-analytics"] }),
      ]);
    },
  });

  const closeMutation = useMutation({
    mutationFn: ({ id, exitPrice, exitAt }: { id: string; exitPrice: number; exitAt: string }) =>
      api.closeTrade(id, exitPrice, exitAt),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["journal-trades"] }),
        queryClient.invalidateQueries({ queryKey: ["journal-analytics"] }),
      ]);
    },
  });

  const analytics = analyticsQuery.data;
  const metrics = analytics
    ? [
        {
          label: "Total trades",
          value: String(analytics.totalTrades),
          subtext: "All journal entries logged so far",
        },
        {
          label: "Win rate",
          value: `${analytics.winRate.toFixed(1)}%`,
          subtext: "Closed trades ending positive",
        },
        {
          label: "Avg P&L",
          value: `${analytics.avgPnl >= 0 ? "+" : ""}${analytics.avgPnl.toFixed(2)}%`,
          subtext: "Average closed-trade return",
        },
        {
          label: "Sentiment alignment",
          value: `${analytics.sentimentAlignmentRate.toFixed(1)}%`,
          subtext: "Trades aligned with entry sentiment",
        },
      ]
    : [];

  return (
    <div className="space-y-6 pb-10">
      <section className="panel p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-teal-200/70">Journal feedback loop</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Retrospective sentiment analysis for every trade</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-slate-300">
          This module implements the part of the spec that helps traders learn from their decisions by comparing entries and exits against the prevailing news tone.
        </p>
      </section>

      {analytics && <KpiStrip metrics={metrics} />}

      <TradeEntryForm
        onSubmit={async (payload) => {
          await createMutation.mutateAsync(payload);
        }}
      />

      <JournalTable
        trades={tradesQuery.data?.trades || []}
        onCloseTrade={(trade) => {
          const exitPrice = typeof window !== "undefined" ? window.prompt(`Enter exit price for ${trade.symbol}`) : null;
          if (!exitPrice) return;
          closeMutation.mutate({
            id: trade.id,
            exitPrice: Number(exitPrice),
            exitAt: new Date().toISOString(),
          });
        }}
      />
    </div>
  );
}
