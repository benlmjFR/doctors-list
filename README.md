# Doctors App

Annuaire de médecins avec recherche, filtrage par statut, pagination et page de détail.

---

## Stack

| Couche | Technologie |
|--------|-------------|
| Client | Next.js 16, React 19, SCSS Modules |
| Server | Express 5, TypeScript, node-pg |
| Base de données | PostgreSQL 15 (Docker) |

---

## Architecture

```
doctors-app/
├── client/                         # Next.js 16 — port 3000
│   ├── app/
│   │   ├── page.tsx                # Liste des médecins
│   │   └── doctors/[id]/page.tsx   # Page de détail
│   ├── components/
│   │   ├── DoctorList/             # Recherche, filtres, pagination
│   │   └── DoctorCard/             # Carte cliquable → page détail
│   └── types/doctors.ts            # Type Doctor partagé
├── server/                         # Express 5 — port 3001
│   └── src/
│       ├── index.ts                # Routes API
│       └── db.ts                   # Pool PostgreSQL (dotenv)
└── database/
    ├── init.sql                    # Schéma
    └── seed.sql                    # Données de test
```

Le client est un SPA `"use client"` pur — pas de RSC ni de route handlers. Les données sont toujours lues via fetch vers l'API Express. CORS restreint à `http://localhost:3000`.

---

## Lancer le projet

### Première installation

```bash
npm install               # dépendances racine (concurrently)
npm --prefix server install
npm --prefix client install
```

Copier les fichiers d'environnement :

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

### Démarrage (tout en une commande)

```bash
npm run dev
```

Lance en parallèle :
- **db** — `docker compose up`
- **server** — nodemon + ts-node sur le port 3001
- **client** — Next.js dev server sur le port 3000

Ouvrir [http://localhost:3000](http://localhost:3000).

---

## Variables d'environnement

### `server/.env`

```env
DB_HOST=localhost
DB_PORT=5433
DB_USER=admin
DB_PASSWORD=password
DB_NAME=doctors_db
```

### `client/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Les variables préfixées `NEXT_PUBLIC_` sont inlinées dans le bundle JS par Next.js à la compilation. Les autres restent côté serveur.

---

## API

| Méthode | Route | Params | Réponse |
|---------|-------|--------|---------|
| `GET` | `/doctors` | `offset`, `search`, `status` | `{ data: Doctor[], offset, limit, next }` |
| `GET` | `/doctors/:id` | — | `Doctor` ou `404` |
| `GET` | `/health` | — | `{ status: "ok" }` ou `503` |

---

## Typage

### `types/doctors.ts`

```ts
export type Doctor = {
  id: string;                        // UUID
  first_name: string;
  last_name: string;
  email: string;
  city: string;
  specialty: string;
  years_experience: number;
  status: "active" | "retired";      // enum PostgreSQL doctors_status
  rating: number;                    // DECIMAL(2,1) — castez avec Number()
  created_at: string;
  updated_at: string;
};
```

> `rating` est retourné en `string` par node-pg. Toujours caster avec `Number(doctor.rating)` avant d'appeler `.toFixed()`.

---

## Routing (Next.js App Router)

| URL | Fichier | Description |
|-----|---------|-------------|
| `/` | `app/page.tsx` | Liste paginée |
| `/doctors/[id]` | `app/doctors/[id]/page.tsx` | Détail d'un médecin |

### Page dynamique

```tsx
// app/doctors/[id]/page.tsx
"use client";
import { use } from "react";

type Props = { params: Promise<{ id: string }> };

export default function DoctorPage({ params }: Props) {
  const { id } = use(params); // Next.js 16 — params est une Promise
  // ...
}
```

> En Next.js 15+, `params` dans les pages client est une `Promise`. Utiliser `React.use(params)` pour le résoudre de façon synchrone.

---

## Base de données

Schéma dans `database/init.sql`, seed dans `database/seed.sql`. Appliqués automatiquement au premier démarrage du container.

Pour réinitialiser :

```bash
docker compose down -v && docker compose up -d
```
