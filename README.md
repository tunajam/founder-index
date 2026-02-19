# Founder Index

**Network Effects × Founder-Led Stock Screener**

Filter S&P 500 stocks by two axes that research shows drive outperformance:
1. **Network Effects** (1-10) — platform dynamics, switching costs, data moats
2. **Founder-Led** (1-10) — active founder as CEO/Chair, skin in the game

Backtested: ~29% returns vs 8.4% S&P 500.

## Architecture (Fred Stack)

```
┌─────────────────┐     connectRPC      ┌──────────────────┐
│  Next.js 15     │ ◄──────────────────► │  Go Backend      │
│  + shadcn/ui    │     (protobuf)       │  + connectRPC    │
│  + Tailwind     │                      │  + sqlc (Postgres)│
│  → Vercel       │                      │  → Azure CA      │
└─────────────────┘                      └──────────────────┘
        │                                         │
        ├── Clerk (auth)                         ├── Azure PostgreSQL
        ├── Stripe (payments)                    ├── OpenRouter (AI scoring)
        └── PostHog (analytics)                  └── Yahoo Finance (prices)
```

## Structure

```
proto/                   # Protobuf definitions (buf managed)
backend/                 # Go service
  cmd/server/            # Entry point
  internal/handler/      # connectRPC handlers
  internal/db/           # sqlc queries
  gen/                   # Generated protobuf code
frontend/                # Next.js app
  src/gen/               # Generated TypeScript client
  src/data/              # Static fallback data
  src/components/        # UI components
```

## Development

```bash
# Generate protobuf code
cd proto && buf generate

# Run Go backend
cd backend && go run ./cmd/server/

# Run frontend
cd frontend && bun dev

# Open http://localhost:3000
```

## License

MIT
