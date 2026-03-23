# Forex & Crypto Sentiment-Weighted Watchlist

This repository implements the markdown blueprint as a monorepo with:

- `apps/frontend`: React + Vite + TypeScript dashboard
- `apps/backend`: Express + TypeScript API with auth, watchlists, journal, sentiment orchestration, and divergence logic
- `apps/sentiment-engine`: Python FastAPI service using VADER with finance-specific lexicon tuning
- `packages/shared-types`: shared domain contracts across the stack
- `infra/docker`: Docker Compose and service Dockerfiles
- `.github/workflows/ci.yml`: CI for backend, frontend, and sentiment service

## What Is Implemented

- Auth routes: register, login, logout, current user
- Watchlist routes: list, search, add, remove
- Asset detail routes: chart, sentiment, and news drill-down
- FX utility routes for latest rates, conversions, and historical time series
- Divergence detection engine for price vs sentiment conflicts
- Trade journal create, close, list, and analytics flow
- Health endpoint with dependency and quota reporting
- Background refresh job scaffolding
- React pages for dashboard, asset detail, journal, login, and register
- Recharts dual-axis visualization
- Python sentiment scoring service with tests
- Prisma schema, Docker files, and CI workflow

## Mock Mode

The backend and frontend both support a mock-first path so the project remains usable before external services are connected:

- Set `MOCK_MODE=true` in `.env`
- The backend serves in-memory users, watchlists, trades, prices, and sentiment
- The mock asset universe now includes a broader crypto and forex watchlist, including majors like `EUR/USD`, `USD/JPY`, `AUD/USD`, `USD/CAD`, and `USD/KES`
- The frontend also falls back to a local demo API when the backend is unavailable
- Demo login: `demo@example.com` / `DemoPass123!`

## Quick Start

1. Copy `.env.example` to `.env`
2. Install Node.js 20+, npm, and Python 3.11+
3. Install dependencies from the repo root:

```bash
npm install
pip install -r apps/sentiment-engine/requirements.txt
```

4. Start the services:

```bash
npm --workspace apps/backend run dev
npm --workspace apps/frontend run dev
uvicorn main:app --app-dir apps/sentiment-engine --reload --port 8000
```

5. Optional: run infrastructure locally with Docker:

```bash
docker compose -f infra/docker/docker-compose.yml up --build
```

## Netlify Deployment

This repo is a monorepo, so Netlify must build the frontend app and publish its `dist` folder rather than the repo root.

The repository now includes:

- [netlify.toml](c:/Users/noble/gif/netlify.toml) with:
  - build command: `npm run build:frontend`
  - publish directory: `apps/frontend/dist`
  - SPA fallback redirect for React Router
- [apps/frontend/public/_redirects](c:/Users/noble/gif/apps/frontend/public/_redirects) with `/* /index.html 200`

If the Netlify site is already connected, trigger a redeploy after pulling these changes.

Required frontend environment variable on Netlify:

```bash
VITE_API_URL=https://your-backend-domain/api
```

Useful backend environment variables for live mode:

```bash
ALPHA_VANTAGE_KEY=...
COINGECKO_API_KEY=...
NEWSAPI_KEY=...
GNEWS_KEY=...
FRANKFURTER_BASE_URL=https://api.frankfurter.app
```

## Environment Notes

This Codex session did not have `node`, `npm`, or a working Python runtime available locally, so the repository was implemented thoroughly but not executed end-to-end inside this environment. The codebase is set up to run once those runtimes are installed.

## Suggested Next Steps

1. Install Node.js and Python on the machine.
2. Run `npm install` from the repo root.
3. Start the backend and frontend in `MOCK_MODE=true` first.
4. Add real API keys, PostgreSQL, and Redis next.
5. Run Prisma migrations and switch `MOCK_MODE=false`.
