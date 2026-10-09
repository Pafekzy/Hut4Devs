# Hut4Devs

Hut4Devs is the canonical application repository for the Hut4Devs project. The current codebase implements an accommodation responsibility and payment workflow with role-aware server operations, Firebase client integration, BMONI provider boundaries, PostgreSQL persistence, reconciliation, and development realtime updates.

This description reflects the code currently in the repository. It does not claim that every documented product problem, user need, peer-support rule, recognition model, or blockchain direction has been validated.

## Current status

The repository contains an active TypeScript/React implementation and a growing automated test suite. The current implementation surface includes:

- a Vite React frontend;
- a Node.js HTTP API in [`server.ts`](server.ts);
- PostgreSQL-backed domain repositories and migrations;
- Firebase browser authentication and Firestore integration;
- server-side BMONI payment proposal and webhook modules;
- payment-event reconciliation before accommodation amounts are verified; and
- a transactional outbox with a development-only Server-Sent Events stream.

This repository has not been certified as production-ready. Before relying on it operationally, run the checks below in a properly configured environment and complete security, deployment, backup, monitoring, and recovery review.

## Technology stack

- TypeScript and Node.js
- React 18 and React DOM
- Vite 6 with the React and Tailwind Vite plugins
- Tailwind CSS 4
- PostgreSQL through `pg`
- `pg-mem` for isolated development/test database execution
- Firebase Authentication and Firestore
- Vitest, JSDOM, and Testing Library
- esbuild for bundling `server.ts`
- Bun lockfile: [`bun.lock`](bun.lock)

The declared versions and scripts are in [`package.json`](package.json).

## Prerequisites

Install or provide:

1. Node.js with npm available on `PATH`.
2. A package-manager installation that honors the repository's `package.json` and `bun.lock`. The project scripts are documented as `npm run ...`; Bun may also be used if available, but its availability is not assumed.
3. PostgreSQL for durable or real integration testing. The application can create an isolated `pg-mem` database when no usable database URL is provided, but that is not a replacement for deployed PostgreSQL.
4. A Firebase project/configuration for real authentication and Firestore use.
5. BMONI configuration only when exercising the external provider integration.

## Environment setup

Copy the provided example and fill only the values required by the environment:

```powershell
Copy-Item .env.example .env
```

The complete variable list is maintained in [`.env.example`](.env.example):

- `DATABASE_URL` for the server's PostgreSQL connection;
- `BMONI_ACCOUNT_ID`, `BMONI_API_KEY`, `BMONI_API_URL`, `BMONI_PARTNER_SECRET`, and `BMONI_WEBHOOK_SECRET` for provider integration;
- `PAYMENT_PROVIDER_MODE`, whose supported runtime values must be confirmed in the current provider code before use; and
- `VITE_FIREBASE_*` values for browser Firebase configuration.

Do not commit populated secrets. Values without the `VITE_` prefix are server-side configuration and must not be exposed to browser bundles. Firebase browser configuration still requires correct project access controls and Firestore rules.

## Install and run

From the repository root:

```powershell
npm install
npm run dev
```

The Vite development server is configured for `0.0.0.0:3000`. API requests beginning with `/api/` are handled through the development server integration in [`vite.config.ts`](vite.config.ts).

For a built server:

```powershell
npm run build
npm run start
```

The build writes the bundled server to `dist/server.cjs`. The server also serves built frontend assets when they are present.

## Package scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start Vite development mode on port 3000. |
| `npm run build` | Build the frontend and bundle `server.ts` with esbuild. |
| `npm run server` | Run the built server from `dist/server.cjs`. |
| `npm run start` | Run the built server from `dist/server.cjs`. |
| `npm run preview` | Preview the Vite production build on port 3000. |
| `npm run lint` | Run TypeScript with `--noEmit`. |
| `npm test` | Run the Vitest suite once. |

## Database and migrations

The application database is initialized by [`src/server/db/connection.ts`](src/server/db/connection.ts). The migrator applies the tracked migration set in order and records applied versions in `schema_migrations`.

The current schema covers:

- accommodation responsibilities;
- payment intents and external payment proposals;
- outbox events;
- members, roles, and sessions;
- provider events; and
- payment reconciliations.

Migration sources are in [`src/server/db/migrations`](src/server/db/migrations). For durable operation, configure `DATABASE_URL` to an appropriate PostgreSQL database and verify migrations, permissions, backups, and isolation for that environment. Do not treat the local `pg-mem` fallback as durable storage.

Real PostgreSQL integration tests also inspect `TEST_DATABASE_URL`, then `DATABASE_URL`, and finally known local PostgreSQL connection candidates; see [`realPostgresManager.ts`](src/test/realPostgresManager.ts).

## Tests, lint, and build

Run the normal checks with:

```powershell
npm run lint
npm test
npm run build
```

The Vitest configuration uses a JSDOM environment and [`src/test/setup.ts`](src/test/setup.ts). Some tests use `pg-mem`; real PostgreSQL tests require a reachable PostgreSQL instance. A passing local test run is not, by itself, evidence that external BMONI, Firebase, deployment, or production security behavior has been verified.

## Security warnings and known limitations

- The accommodation admin SSE endpoint is explicitly an unauthenticated development stream. Do not expose it as a production admin channel without authentication, authorization, and transport review.
- Deterministic development identities and tokens exist for local flows. They must not be used as production credentials.
- BMONI secrets, webhook secrets, and `DATABASE_URL` belong only in server-side environment configuration.
- A BMONI `COMPLETED` event is not automatically a Hut4Devs `VERIFIED` payment; reconciliation requires the stored evidence chain.
- Realtime events are convenience notifications. PostgreSQL-backed API reads remain authoritative.
- Production requirements for secret rotation, rate limiting, audit retention, backups, monitoring, incident response, consent, privacy, and data deletion are not fully established by this repository.
- The repository's future Stellar and multi-repository material is proposed direction, not a current implementation requirement.

See [`docs/08_TECHNICAL_ARCHITECTURE.md`](docs/08_TECHNICAL_ARCHITECTURE.md) for the implemented architecture, limitations, and unresolved decisions.
