import { ExternalLink } from "lucide-react";
import { NewsArticle } from "@sentiment-watchlist/shared-types";

export default function NewsPanel({ articles }: { articles: NewsArticle[] }) {
  return (
    <section className="panel p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Recent news</h3>
        <p className="text-sm text-slate-400">Articles used in the latest sentiment snapshot.</p>
      </div>

      <div className="space-y-3">
        {articles.length === 0 && <p className="text-sm text-slate-500">No recent articles available.</p>}
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
          >
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="text-xs uppercase tracking-[0.22em] text-slate-500">{article.sourceName}</span>
              <span
                className={`rounded-full px-2 py-1 text-[11px] ${
                  article.sentimentLabel === "positive"
                    ? "bg-emerald-950/60 text-emerald-300"
                    : article.sentimentLabel === "negative"
                      ? "bg-red-950/60 text-red-300"
                      : "bg-amber-950/60 text-amber-300"
                }`}
              >
                {article.sentimentLabel || "unscored"}
              </span>
            </div>
            <h4 className="text-sm font-medium text-white">{article.headline}</h4>
            {article.description && <p className="mt-2 text-sm text-slate-400">{article.description}</p>}
            <div className="mt-3 inline-flex items-center gap-2 text-xs text-teal-200">
              <ExternalLink size={12} />
              Open article
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

