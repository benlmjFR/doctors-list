# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

Three-layer app: Next.js 16 client → Express 5 server → PostgreSQL 15 (Docker).

```
doctors-app/
  client/   # Next.js 16 + React 19 (port 3000)
  server/   # Express 5 + pg (port 3001)
  database/ # init.sql + seed.sql, mounted into Docker
```

The client is a pure SPA-style client component (`"use client"`) that fetches from the Express API. No server-side data fetching (no RSC data loading, no route handlers). CORS is restricted to `http://localhost:3000`.

## Dev commands

**Database** (must be running first):
```bash
docker compose up -d
```

**Server** (from `server/`):
```bash
npm run dev   # nodemon + ts-node, port 3001
```

**Client** (from `client/`):
```bash
npm run dev   # Next.js dev server, port 3000
npm run lint  # eslint
```

## Key constraints

### Next.js 16 / React 19
This version has breaking changes vs training data. Read `client/node_modules/next/dist/docs/` before writing Next.js code. Heed deprecation notices.

### API contract
The `/doctors` endpoint returns `{ data: Doctor[], offset, limit, next }`. The client always reads `data.data`. Do not rename this key.

### pg returns DECIMAL as string
`rating` is `DECIMAL(2,1)` in Postgres — `node-pg` returns it as a string. Always cast with `Number(doctor.rating)` before calling number methods.

### Status enum
`doctors_status` is `'active' | 'retired'` (not `inactive`). The server validates the `status` query param against this exact list.

### Database connection
Hardcoded in `server/src/db.ts`: host `localhost`, port `5433` (Docker maps 5433→5432), db `doctors_db`, user `admin`, password `password`.

## Database

Schema lives in `database/init.sql`, seed data in `database/seed.sql`. Both are auto-applied when the Docker container first starts. To reset: `docker compose down -v && docker compose up -d`.
