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

## Data Modes

The project supports separate switches for storage/auth mocking and market-data mocking:

- `MOCK_MODE=false` keeps auth, sessions, journal, and watchlists on the real backend by default
- `MOCK_MARKET_DATA=false` keeps watchlist prices, FX rates, charts, news, and sentiment on live providers by default
- `VITE_ENABLE_DEMO_FALLBACK=false` prevents the frontend from silently swapping to demo data when the backend is unreachable
- If you want easier setup but still want real watchlist data, use `MOCK_MODE=true` together with `MOCK_MARKET_DATA=false`
- If you explicitly enable demo mode, the mock asset universe includes a broader crypto and forex watchlist, including majors like `EUR/USD`, `USD/JPY`, `AUD/USD`, `USD/CAD`, and `USD/KES`
- Demo login is only relevant when demo fallback is enabled: `demo@example.com` / `DemoPass123!`

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

Recommended frontend production settings:

```bash
VITE_API_URL=https://your-backend-domain/api
VITE_ENABLE_DEMO_FALLBACK=false
```

## Production Wiring

Use this setup if you want the deployed watchlist to show real market data instead of demo data.

Backend service:

```bash
npm install
npx prisma generate --schema apps/backend/prisma/schema.prisma
npm run build:backend
npm --workspace apps/backend run start
```

Sentiment engine service:

```bash
pip install -r apps/sentiment-engine/requirements.txt
uvicorn main:app --app-dir apps/sentiment-engine --host 0.0.0.0 --port 8000
```

Backend production environment variables:

```bash
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-netlify-site.netlify.app
MOCK_MODE=false
MOCK_MARKET_DATA=false
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRY=24h
BCRYPT_ROUNDS=12
SENTIMENT_ENGINE_URL=https://your-sentiment-engine-domain
ALPHA_VANTAGE_KEY=...
COINGECKO_API_KEY=...
NEWSAPI_KEY=...
GNEWS_KEY=...
```

Verification checks after deploy:

```bash
GET https://your-backend-domain/api/health
GET https://your-sentiment-engine-domain/health
```

The backend health response should show `database`, `redis`, and `sentimentEngine` as `healthy` or `unknown` during startup, not `mock`, when you are running with live market data.

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
3. Keep `MOCK_MODE=false`, `MOCK_MARKET_DATA=false`, and `VITE_ENABLE_DEMO_FALLBACK=false` if you want only real watchlist data.
4. Add real API keys, PostgreSQL, and Redis.
5. Run Prisma migrations, then start the backend, frontend, and sentiment engine.
