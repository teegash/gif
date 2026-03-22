import { useState } from "react";
import { AssetType, TradeDirection } from "@sentiment-watchlist/shared-types";

interface Props {
  onSubmit: (payload: {
    symbol: string;
    assetType: AssetType;
    direction: TradeDirection;
    entryPrice: number;
    quantity: number;
    currency: string;
    entryAt: string;
    notes?: string;
    tags: string[];
    stopLoss?: number;
    takeProfit?: number;
  }) => Promise<void>;
}

export default function TradeEntryForm({ onSubmit }: Props) {
  const [form, setForm] = useState({
    symbol: "BTC",
    assetType: "CRYPTO" as AssetType,
    direction: "LONG" as TradeDirection,
    entryPrice: 0,
    quantity: 0,
    currency: "USD",
    entryAt: new Date().toISOString().slice(0, 16),
    notes: "",
    tags: "",
    stopLoss: "",
    takeProfit: "",
  });

  return (
    <form
      className="panel grid gap-4 p-5 lg:grid-cols-2"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit({
          symbol: form.symbol,
          assetType: form.assetType,
          direction: form.direction,
          entryPrice: Number(form.entryPrice),
          quantity: Number(form.quantity),
          currency: form.currency,
          entryAt: new Date(form.entryAt).toISOString(),
          notes: form.notes || undefined,
          tags: form.tags
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          stopLoss: form.stopLoss ? Number(form.stopLoss) : undefined,
          takeProfit: form.takeProfit ? Number(form.takeProfit) : undefined,
        });
      }}
    >
      <div className="lg:col-span-2">
        <h3 className="text-lg font-semibold text-white">Log a trade</h3>
        <p className="mt-1 text-sm text-slate-400">Every entry snapshots current sentiment so later analysis can compare trade quality against the prevailing news tone.</p>
      </div>

      {[
        { key: "symbol", label: "Symbol", type: "text" },
        { key: "entryPrice", label: "Entry price", type: "number" },
        { key: "quantity", label: "Quantity", type: "number" },
        { key: "currency", label: "Currency", type: "text" },
        { key: "entryAt", label: "Entry time", type: "datetime-local" },
        { key: "stopLoss", label: "Stop loss", type: "number" },
        { key: "takeProfit", label: "Take profit", type: "number" },
      ].map((field) => (
        <label key={field.key} className="block">
          <span className="mb-2 block text-sm text-slate-300">{field.label}</span>
          <input
            type={field.type}
            value={(form as any)[field.key]}
            onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-teal-300/50"
          />
        </label>
      ))}

      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Asset type</span>
        <select
          value={form.assetType}
          onChange={(event) => setForm((current) => ({ ...current, assetType: event.target.value as AssetType }))}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-teal-300/50"
        >
          <option value="CRYPTO">Crypto</option>
          <option value="FOREX">Forex</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Direction</span>
        <select
          value={form.direction}
          onChange={(event) => setForm((current) => ({ ...current, direction: event.target.value as TradeDirection }))}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-teal-300/50"
        >
          <option value="LONG">Long</option>
          <option value="SHORT">Short</option>
        </select>
      </label>

      <label className="block lg:col-span-2">
        <span className="mb-2 block text-sm text-slate-300">Tags</span>
        <input
          type="text"
          value={form.tags}
          placeholder="breakout, macro, swing"
          onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-teal-300/50"
        />
      </label>

      <label className="block lg:col-span-2">
        <span className="mb-2 block text-sm text-slate-300">Notes</span>
        <textarea
          rows={4}
          value={form.notes}
          onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-teal-300/50"
        />
      </label>

      <div className="lg:col-span-2 flex justify-end">
        <button type="submit" className="rounded-2xl bg-gradient-to-r from-teal-300 to-cyan-300 px-5 py-3 font-medium text-slate-950 transition hover:opacity-90">
          Save trade
        </button>
      </div>
    </form>
  );
}
