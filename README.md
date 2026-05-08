# Doctors App

Annuaire de médecins avec recherche, filtrage par statut et pagination.

## Stack

- **Client** : Next.js 16, React 19, SCSS Modules
- **Server** : Express 5, TypeScript
- **Database** : PostgreSQL 15 (Docker)

## Lancer le projet

**1. Base de données**
```bash
docker compose up -d
```

**2. Serveur** (port 3001)
```bash
cd server && npm install && npm run dev
```

**3. Client** (port 3000)
```bash
cd client && npm install && npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Fonctionnalités

- Liste paginée des médecins (10 par page)
- Recherche par nom (first_name / last_name)
- Filtre par statut : Tous / Actifs / Retraités

## API

| Méthode | Route | Params |
|---------|-------|--------|
| GET | `/doctors` | `offset`, `search`, `status` |
| GET | `/health` | — |
