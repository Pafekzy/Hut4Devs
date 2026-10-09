# Hut4Devs Technical Architecture

## Document status

This document describes the architecture that is present in the repository at the time of writing. Statements under **Implemented** are based on the current source, configuration, migrations, and tests. Statements under **Proposed or unresolved** are directions or decisions that still require product, security, operational, or user validation.

This is not a claim that the application is production-ready. The repository contains a working implementation surface, but the full test, deployment, security, and operational posture still needs verification in the target environment.

## Implemented architecture

Hut4Devs is a TypeScript application with a React frontend and a Node.js HTTP server. Vite serves the frontend during development and uses a local plugin to route `/api/*` requests to the server handler. The same `server.ts` module exposes a deployable HTTP server for API requests and static assets after a build.

The main implementation areas are:

- `src/components` and `src/services`: frontend components and browser-facing service clients.
- `src/domain`: domain types, repository contracts, and application rules.
- `src/server`: server-side authentication, database, payment, reconciliation, and realtime modules.
- `src/test`: Vitest and Testing Library tests, including database and payment-boundary tests.
- `server.ts`: HTTP request routing and API handlers.
- `vite.config.ts`: Vite, React, Tailwind, Vitest, and development API integration.

### Frontend and server boundaries

The browser calls the local application API rather than calling BMONI or PostgreSQL directly. Current API areas include:

- payment proposal and payment-intent creation;
- accommodation responsibility and admin overview queries;
- authentication session, development-session, and logout operations;
- BMONI webhook ingestion;
- provider-event and reconciliation inspection and reconciliation operations;
- an accommodation admin Server-Sent Events stream; and
- a health endpoint.

The route list and method checks are implemented in [`server.ts`](../server.ts). The Vite development API bridge is implemented in [`vite.config.ts`](../vite.config.ts).

Server-only credentials and database access are kept behind server modules. The BMONI adapter reads server environment variables in [`bmoniProvider.ts`](../src/server/payments/bmoniProvider.ts), while browser code uses [`paymentClient.ts`](../src/services/paymentClient.ts) to call application endpoints.

## Data authority and persistence

PostgreSQL is the authoritative source for accommodation responsibilities, payment intents, external payment proposals, provider events, reconciliation records, members, roles, sessions, and outbox events. The repository layer is initialized by [`connection.ts`](../src/server/db/connection.ts), and migrations are applied deterministically by [`migrator.ts`](../src/server/db/migrator.ts).

The current migration set establishes:

1. accommodation responsibilities, payment intents, and external payment proposals;
2. transactional outbox events;
3. members, roles, and sessions;
4. provider events; and
5. payment reconciliations.

The SQL source for the initial schema is [`001_initial_schema.sql`](../src/server/db/migrations/001_initial_schema.sql), and the reconciliation hardening is in [`005_payment_reconciliations.sql`](../src/server/db/migrations/005_payment_reconciliations.sql).

When no usable `DATABASE_URL` is supplied, the current connection code can create an isolated `pg-mem` database for local development or tests. A configured database connection that fails can also fall back unless the caller disables that behavior. This fallback is useful for development but must not be treated as evidence that a deployed environment has durable PostgreSQL persistence.

## Authentication and membership

Firebase client integration in [`firebase.ts`](../src/services/firebase.ts) provides browser authentication and Firestore access. The server maintains Hut4Devs members, roles, and sessions in PostgreSQL. Server authorization follows the sequence:

`identity -> authenticated session -> Hut4Devs member -> role/permission -> authorized operation`

The server-side session and role checks are implemented in [`authService.ts`](../src/server/auth/authService.ts). Development identities and development-session endpoints exist for local flows and tests; they are not a substitute for a production identity and session policy.

Firebase and PostgreSQL therefore have different responsibilities in the current code. Firebase is the client-facing identity and membership integration surface; PostgreSQL is authoritative for the application member/session records used by server authorization and for accommodation/payment state.

## BMONI integration and reconciliation

BMONI access is isolated to server-side payment modules. The browser does not receive BMONI API keys, partner secrets, webhook secrets, or database credentials. BMONI webhook handling verifies the raw request body and stores provider events before reconciliation.

The central implemented invariant is:

> A BMONI `COMPLETED` status is not, by itself, a Hut4Devs `VERIFIED` payment.

The reconciliation engine requires an evidence chain from provider event to external payment proposal, payment intent, and accommodation responsibility. Only a reconciled chain can update verified accommodation amounts. The implementation is in [`reconciliationEngine.ts`](../src/server/payments/reconciliationEngine.ts), with webhook ingestion in [`bmoniWebhook.ts`](../src/server/payments/bmoniWebhook.ts).

The reconciliation migration adds a partial unique index so that one provider event cannot create more than one `VERIFIED` reconciliation record for the same provider. The test database emulator has an explicit compatibility path because `pg-mem` does not faithfully emulate that partial unique index.

## Transactional outbox and realtime delivery

Domain changes write outbox records in PostgreSQL as part of the relevant transaction. After commit, the server may publish the event to connected clients through Server-Sent Events. The outbox publisher explicitly treats SSE as a convenience delivery mechanism, not as a source of truth. Clients must re-read authoritative state from PostgreSQL-backed API endpoints when correctness matters.

The current publisher is an in-process singleton in [`outboxPublisher.ts`](../src/server/realtime/outboxPublisher.ts). Its accommodation admin stream is explicitly labelled an unauthenticated development stream. This is a known security and deployment limitation, not a production access-control design.

## Security, privacy, testing, and operational limitations

Implemented safeguards and boundaries include:

- payment-provider secrets and database credentials are server-side environment variables;
- payment proposal storage excludes provider secrets, private keys, PINs, BVN, NIN, and raw credentials;
- webhook verification uses the raw request body rather than a re-serialized JSON body;
- role checks are performed server-side for protected operations;
- reconciliation and outbox writes are designed around database transactions and post-commit delivery; and
- tests cover domain behavior, authorization, provider boundaries, webhook handling, persistence, reconciliation, and selected UI flows.

Current limitations that must be resolved or explicitly accepted before production use include:

- the SSE stream is unauthenticated and intended only for development;
- deterministic development identities and tokens are present;
- the repository does not establish a complete deployment, secret-rotation, monitoring, backup, disaster-recovery, or incident-response procedure;
- real PostgreSQL integration requires an available PostgreSQL instance and a suitable `DATABASE_URL` or test database URL;
- BMONI live behavior and production credentials cannot be verified from the repository alone;
- Firebase project configuration, Firestore rules, identity linking, and membership synchronization require environment-specific verification; and
- local validation has now completed with `npm install --no-package-lock`, `npm run lint`, `npm test`, and `npm run build`; external BMONI, Firebase, deployment, and production-security behavior remain unverified.

## Proposed or unresolved architecture

The following items are not current implementation guarantees:

- a future Stellar or other on-chain component;
- splitting the application into separate frontend, backend, and blockchain repositories;
- wallet architecture, smart-contract boundaries, on-chain event policy, and public/private data placement;
- production authentication and identity-linking policy between Firebase and Hut4Devs sessions;
- payment-provider failure, retry, dispute, retention, and reconciliation operations;
- encryption, audit retention, consent expiry, privacy controls, and data deletion policy;
- deployment topology, background outbox processing, durable event retries, observability, and recovery objectives; and
- governance, recognition, peer-support, vouching, liability, and other product rules whose user need and operating model remain to be validated.

The repository's Stellar direction document requires learning, threat modelling, security review, key-management planning, and operational readiness before any mainnet decision. It should be treated as a proposal and learning record, not as a current product requirement: [`docs/11_STELLAR_DRIPS_WAVE_EVOLUTION.md`](11_STELLAR_DRIPS_WAVE_EVOLUTION.md).

## Change guidance

Application changes should preserve the following boundaries unless an approved architecture decision changes them:

1. browsers call Hut4Devs APIs, not payment providers or PostgreSQL directly;
2. PostgreSQL remains authoritative for accommodation and payment state;
3. provider events are verified, stored, and reconciled before verified amounts change;
4. realtime delivery remains non-authoritative and post-commit; and
5. development-only authentication and streaming paths are not promoted to production without explicit security review.
