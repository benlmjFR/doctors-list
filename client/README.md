# Doctors App — Fullstack Directory

A fullstack medical directory built as a portfolio project to demonstrate end-to-end TypeScript development skills.

> Built after failing a live coding test — this project shows what I can deliver when given proper time to think and architect.

---

## Stack

| Layer    | Tech                                            |
| -------- | ----------------------------------------------- |
| Frontend | Next.js 14 · TypeScript · SCSS Modules          |
| Backend  | Express · TypeScript · Node.js                  |
| Database | PostgreSQL 15 (Docker local / Supabase prod)    |
| Infra    | Docker · Docker Compose                         |
| Deploy   | Vercel (front) · Railway (back) · Supabase (DB) |

---

## Features

- List 1000 doctors with pagination (10 per page, LIMIT/OFFSET)
- Filter by status (active / inactive)
- Search by first or last name (PostgreSQL ILIKE)
- Doctor detail page (dynamic routing)
- Error handling + loading states
- Environment variables for all sensitive config

---

## Architecture

```
doctors-app/
├── client/          # Next.js frontend
│   ├── app/         # App Router pages
│   ├── components/  # DoctorCard, DoctorList
│   └── types/       # Shared TypeScript types
├── server/          # Express backend
│   └── src/
│       ├── index.ts # Routes + server
│       └── db.ts    # PostgreSQL pool
├── database/
│   ├── init.sql     # CREATE TABLE
│   └── seed.sql     # 1000 doctors INSERT
└── docker-compose.yml
```

---

## Local Setup

### Prerequisites

- Docker Desktop
- Node.js 18+

### 1. Clone the repo

```bash
git clone https://github.com/benlmjFR/doctors-list.git
cd doctors-list
```

### 2. Start the database

```bash
docker compose up -d
```

### 3. Seed the database (first time only)

```bash
docker exec -i doctors_db psql -U admin -d doctors_db < database/seed.sql
```

### 4. Configure environment variables

**server/.env**

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=password
DB_NAME=doctors_db
```

**client/.env.local**

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Start the app

```bash
# Install dependencies
npm install
npm --prefix server install
npm --prefix client install

# Start everything
npm run dev
```

App runs on:

- Frontend → http://localhost:3000
- Backend → http://localhost:3001

---

## API Routes

| Method | Route          | Description                            |
| ------ | -------------- | -------------------------------------- |
| GET    | `/doctors`     | List doctors with pagination + filters |
| GET    | `/doctors/:id` | Get doctor by UUID                     |
| GET    | `/health`      | Health check                           |

### Query params for `/doctors`

| Param    | Type   | Description                      |
| -------- | ------ | -------------------------------- |
| `offset` | number | Pagination offset (default: 0)   |
| `status` | string | Filter by `active` or `inactive` |
| `search` | string | Search by first or last name     |

---

## Technical Choices

**UUID over SERIAL** — Non-guessable IDs, no conflicts when merging datasets.

**LIMIT/OFFSET pagination** — Simple and sufficient for 1000 rows. Would switch to cursor-based pagination at scale.

**ILIKE for search** — Works well at this scale. Would add `pg_trgm` index for 100k+ rows.

**CSS Modules** — Scoped styles without a framework dependency. Explicit and maintainable.

**Pool over Client** — Reuses connections across requests instead of opening/closing on each query.

---

## Deployment

- **Frontend** → [Vercel](https://vercel.com) — connect GitHub repo, set `NEXT_PUBLIC_API_URL`
- **Backend** → [Railway](https://railway.app) — connect GitHub repo, set DB env vars
- **Database** → [Supabase](https://supabase.com) — run `init.sql` then import `seed.sql`
