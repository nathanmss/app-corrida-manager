# Treinão Encontro das Águas — 2ª Edição

Sistema de inscrição para o Treinão Encontro das Águas — 2ª Edição.

## Run & Operate

- `PORT=8080 pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/corrida-retorno-praia run dev` — run the frontend on port 5173 by default
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (provisioned automatically by Replit)
- Required env for current admin auth: `REPL_ID` — Replit/OIDC client id

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (Tailwind CSS, shadcn/ui, wouter, TanStack Query, framer-motion)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Auth: Replit Auth (OIDC, admin-only)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all API contracts)
- `lib/db/src/schema/` — Drizzle DB schema (events.ts, routes.ts, registrations.ts, auth.ts)
- `artifacts/api-server/src/routes/` — Express route handlers (events, registrations, admin, auth)
- `artifacts/corrida-retorno-praia/src/` — React frontend (pages, components)
- `lib/api-client-react/src/generated/` — Generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — Generated Zod schemas (do not edit)
- `lib/replit-auth-web/` — useAuth() hook for browser auth state

## Architecture decisions

- Participants never create accounts — registration is public and anonymous
- Only admins log in, via Replit Auth (OIDC/PKCE); session stored in PostgreSQL
- Duplicate registration prevention currently uses WhatsApp per event or same name+birthdate. CPF uniqueness is planned in Milestone 3.
- Registration code is a random 8-char hex used for the success/confirmation page
- CSV export uses UTF-8 BOM so Excel opens it correctly with Portuguese characters
- OpenAPI-first: all endpoints defined in openapi.yaml before codegen

## Product

- **Public landing page** — event info, route cards (3/5/10 km), registration CTA
- **Public registration form** — no login, all fields in pt-BR, with term acceptance
- **Success page** — confirmation with registration code and event summary
- **Admin dashboard** — stats by route/sex/shirt/status, recent registrations
- **Admin list** — searchable, filterable, paginated registration table
- **Admin edit** — full edit form with status change and internal notes
- **CSV export** — full participant data with UTF-8 BOM for Excel

## Seed data

No explicit seed script was found during the initial local audit. Milestone 7 must add predictable seed logic for the event, routes and initial admin user. Terms version: `2026-05-18-v1`.

## User preferences

- Application language: Brazilian Portuguese (pt-BR) for all user-facing text
- No Django — uses Node.js/TypeScript stack instead (same capabilities, simpler in this monorepo)

## Gotchas

- After any OpenAPI spec change, always run codegen: `pnpm --filter @workspace/api-spec run codegen`
- Admin routes require `req.isAuthenticated()` — only Replit users can access them
- The SESSION_SECRET env var must be set for auth to work
- Do NOT restart the frontend workflow while the design subagent is still running
- `corrida-retorno-praia` remains only as a legacy technical package/folder name and is not user-facing.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `replit-auth` skill for auth setup details
