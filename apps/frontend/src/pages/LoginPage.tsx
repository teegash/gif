import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { api } from "../lib/api";
import { demoApi } from "../lib/demoApi";
import { useAuthStore } from "../store/auth.store";

export default function LoginPage() {
  const [email, setEmail] = useState(demoApi.demoCredentials.email);
  const [password, setPassword] = useState(demoApi.demoCredentials.password);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.login(email, password);
      setSession(response.token, response.user);
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="panel grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1.15fr_0.85fr]">
        <div className="hidden bg-dashboard-grid bg-dashboard-grid p-10 lg:block">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs uppercase tracking-[0.26em] text-teal-200">
              <ShieldCheck size={14} />
              Sentiment-weighted trading intelligence
            </div>
            <h1 className="text-5xl font-semibold leading-tight text-white">
              Price alone is noisy. <span className="gradient-text">Sentiment adds context.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-slate-300">
              Track crypto and forex assets, compare price against headline sentiment, detect divergences, and journal trades with sentiment snapshots.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Sign in</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">
            Demo credentials are prefilled so you can explore the full flow immediately.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-teal-300/50"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-teal-300/50"
              />
            </label>

            {error && <div className="rounded-2xl border border-red-400/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-teal-300 to-cyan-300 px-4 py-3 font-medium text-slate-950 transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Need an account?{" "}
            <Link to="/register" className="text-teal-200 hover:text-teal-100">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

