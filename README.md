# ServiceFlow

ServiceFlow is a modern service & job management platform for operations teams.

## Stack
- **Frontend:** React + TypeScript + Vite (`frontend/`)
- **Backend:** Node.js + Express + TypeScript (`backend/`)
- **Database:** Prisma ORM + SQLite in dev (can switch to PostgreSQL)
- **Auth:** JWT-based auth starter endpoint
- **Notifications:** Email/SMS integration placeholders + delivery log models
- **PDF:** Designed for server-side PDF generation integration (service report + invoice workflow)

## Implemented Product Structure
- Sidebar SaaS shell with sections: Dashboard, Accounts, Jobs, Service Reports, Invoices, Notifications, Settings.
- Top bar with search, profile/avatar area, and dark-mode toggle.
- Card KPI dashboard and activity feed.
- Reusable CRUD list experience with filtering, modal create flows, and soft-delete behavior.
- Backend REST endpoints and relational schema for accounts, jobs, reports, invoices, templates, delivery logs, and audit logs.
- Seed script scaffold for demo data generation.

## Project Layout

```text
.
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   └── CrudPage.tsx
│   │   └── styles.css
│   └── package.json
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/routes/
│   │   ├── auth.ts
│   │   ├── crud.ts
│   │   └── dashboard.ts
│   └── package.json
├── package.json
└── .env.example
```

## Local Run
1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client + migrate:
   ```bash
   npm --workspace backend run prisma:generate
   npm --workspace backend run prisma:migrate
   ```
4. Seed demo data:
   ```bash
   npm --workspace backend run prisma:seed
   ```
5. Run frontend + backend:
   ```bash
   npm run dev
   ```

## Deploy
### Vercel
- Deploy `frontend/` as a Vite static app.
- Deploy `backend/` as a Node server (or migrate endpoints to serverless functions).
- Set env vars from `.env.example`.

### GitHub Pages (frontend)
- Build frontend:
  ```bash
  npm --workspace frontend run build
  ```
- Publish `frontend/dist` to `gh-pages` branch.
- Host backend separately (Render/Railway/Fly.io) and set `VITE_API_URL`.

## Security + Scalability Notes
- Soft-deletes + audit log model included.
- Role model (`ADMIN`, `STAFF`) in schema.
- JWT auth starter endpoint in place.
- Notification templates + delivery history modeled for production integrations.

## Next Build Steps
- Wire real backend CRUD from React pages (replace demo in-memory rows).
- Add pagination/sorting API parameters and server-side validation.
- Implement branded PDF generation service.
- Integrate Twilio/SendGrid and retry/error handling.
- Add protected routes + RBAC middleware.

## Legacy Prototype Update
- `service-reports.html` now uses a structured 14-point Service Report layout with customer details, date/time, job number, and clear section labels.
- Service Report creation now captures `Work Carried Out`, `Notes / Observations`, `Recommendations`, and `Finalized By`.
- Service Report preview/export now shows a dedicated `Property Photo` plus customer contact details and support closing message.
