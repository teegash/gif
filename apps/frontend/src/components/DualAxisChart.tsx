import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { ChartPoint } from "@sentiment-watchlist/shared-types";

interface Props {
  data: ChartPoint[];
  symbol: string;
  window: "24h" | "7d";
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const priceEntry = payload.find((item: any) => item.dataKey === "price");
  const sentimentEntry = payload.find((item: any) => item.dataKey === "sentimentScore");

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/95 p-3 text-xs shadow-2xl">
      <div className="mb-2 text-slate-400">{format(new Date(label), "MMM d, HH:mm")}</div>
      {priceEntry && <div className="text-white">Price: <span className="text-emerald-300">${priceEntry.value?.toLocaleString()}</span></div>}
      {sentimentEntry && <div className="text-white">Sentiment: <span className={sentimentEntry.value >= 0 ? "text-emerald-300" : "text-red-300"}>{sentimentEntry.value > 0 ? "+" : ""}{sentimentEntry.value?.toFixed(3)}</span></div>}
    </div>
  );
};

export default function DualAxisChart({ data, symbol, window }: Props) {
  return (
    <div className="panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{symbol} Price vs Sentiment</h3>
          <p className="text-sm text-slate-400">Dual-axis view across the selected analysis window.</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">{window}</span>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => format(new Date(value), window === "24h" ? "HH:mm" : "MMM d")}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#334155" }}
            />
            <YAxis
              yAxisId="price"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#334155" }}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis
              yAxisId="sentiment"
              orientation="right"
              domain={[-1, 1]}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#334155" }}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px", color: "#cbd5e1" }} />
            <ReferenceLine yAxisId="sentiment" y={0} stroke="#475569" strokeDasharray="4 4" />
            <Line yAxisId="price" type="monotone" dataKey="price" stroke="#2dd4bf" strokeWidth={2.5} dot={false} name="Price" />
            <Bar yAxisId="sentiment" dataKey="sentimentScore" fill="#8b5cf6" opacity={0.65} radius={[4, 4, 0, 0]} name="Sentiment" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

