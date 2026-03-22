interface Props {
  metrics: Array<{
    label: string;
    value: string;
    subtext: string;
  }>;
}

export default function KpiStrip({ metrics }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="panel p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{metric.label}</p>
          <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
          <p className="mt-2 text-sm text-slate-400">{metric.subtext}</p>
        </article>
      ))}
    </div>
  );
}

