# The Founder Index

Real backtest data showing that founder-led companies with strong network effects outperform the S&P 500.

## Architecture

- **Backend:** Go HTTP API (port 8457) — fetches real price data from Yahoo Finance, caches to disk
- **Frontend:** Next.js + Recharts (port 3458) — interactive chart with sliders for network effects + founder-led filters

## Running

```bash
# Backend
cd backend && go run .

# Frontend
cd frontend && bun install && bun run dev
```

## API Endpoints

- `GET /api/status` — Health check
- `GET /api/scores` — All stock scores
- `GET /api/quotes?min_network=5&founder_only=true` — Filtered stock quotes with returns
- `GET /api/backtest?min_network=5&founder_only=true&years=10` — Backtest with real data

## Data Source

Yahoo Finance adjusted close prices, 10-year monthly data for ~180 stocks.
