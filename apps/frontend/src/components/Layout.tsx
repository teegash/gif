import { BarChart3, BookOpenText, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { cn } from "../lib/utils";

const links = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/journal", label: "Trade Journal", icon: BookOpenText },
];

export default function Layout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <aside className="panel sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 flex-col overflow-hidden p-5 lg:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400/30 via-cyan-300/20 to-violet-400/30 text-teal-200 shadow-glow">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-teal-200/70">Enterprise Build</p>
            <h1 className="text-lg font-semibold text-white">Sentiment Watchlist</h1>
          </div>
        </div>

        <div className="subtle-panel mb-6 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Signed in as</p>
          <p className="mt-2 text-lg font-semibold text-white">{user?.displayName || "Trader"}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                    isActive
                      ? "bg-white/10 text-white shadow-glow"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )
                }
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="subtle-panel p-4 text-sm text-slate-300">
            <div className="mb-2 flex items-center gap-2 text-teal-200">
              <ShieldCheck size={16} />
              <span className="font-medium">Spec Coverage</span>
            </div>
            <p className="text-slate-400">
              Watchlist, charts, sentiment, divergence, journal, auth, Docker, CI, and a Python sentiment service are all scaffolded in this repo.
            </p>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="panel mb-4 flex flex-wrap items-center justify-between gap-4 p-4 lg:hidden">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Sentiment Watchlist</p>
            <p className="text-sm font-medium text-white">{user?.displayName || "Trader"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-3 py-2 text-xs transition",
                    isActive ? "bg-white text-slate-950" : "bg-white/5 text-slate-300"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
