import { QueryResult } from 'pg';

export interface SqlQueryable {
  query(queryText: string, values?: any[]): Promise<QueryResult<any>>;
}

export const INITIAL_SCHEMA_SQL = `
-- 1. Accommodation Responsibilities
CREATE TABLE accommodation_responsibilities (
  id VARCHAR(255) PRIMARY KEY,
  fellow_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  required_amount NUMERIC(14, 2) NOT NULL,
  verified_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(50) NOT NULL DEFAULT 'OUTSTANDING',
  period VARCHAR(100),
  currency VARCHAR(10) NOT NULL DEFAULT 'NGN',
  property_id VARCHAR(255),
  property_name VARCHAR(255),
  property_address TEXT,
  floor_id VARCHAR(255),
  floor_name VARCHAR(255),
  floor_level INT,
  room_id VARCHAR(255),
  room_name VARCHAR(255),
  room_code VARCHAR(50),
  fellow_name VARCHAR(255),
  fellow_email VARCHAR(255),
  context_data TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Payment Intents (Status strictly remains PREPARED)
CREATE TABLE payment_intents (
  id VARCHAR(255) PRIMARY KEY,
  responsibility_id VARCHAR(255) NOT NULL REFERENCES accommodation_responsibilities(id) ON DELETE RESTRICT,
  amount NUMERIC(14, 2) NOT NULL,
  fulfilment_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PREPARED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. External Payment Proposals (No secrets, private keys, PINs, BVN, NIN, raw credentials)
CREATE TABLE external_payment_proposals (
  id VARCHAR(255) PRIMARY KEY,
  payment_intent_id VARCHAR(255) NOT NULL REFERENCES payment_intents(id) ON DELETE RESTRICT,
  provider VARCHAR(50) NOT NULL,
  provider_proposal_id VARCHAR(255) NOT NULL,
  provider_status VARCHAR(100) NOT NULL,
  is_simulated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_intents_resp_id ON payment_intents(responsibility_id);
CREATE INDEX idx_payment_proposals_intent_id ON external_payment_proposals(payment_intent_id);
`;

export const OUTBOX_EVENTS_SQL = `
-- 4. Transactional Outbox Events (H4D-FUNC-010)
CREATE TABLE outbox_events (
  id VARCHAR(255) PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  aggregate_type VARCHAR(100) NOT NULL,
  aggregate_id VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_outbox_events_published_at ON outbox_events(published_at);
CREATE INDEX idx_outbox_events_aggregate ON outbox_events(aggregate_type, aggregate_id);
`;

export const MIGRATIONS = [
  {
    version: '001_initial_schema',
    sql: INITIAL_SCHEMA_SQL,
  },
  {
    version: '002_outbox_events',
    sql: OUTBOX_EVENTS_SQL,
  },
];

export const REQUIRED_TABLES = [
  'schema_migrations',
  'accommodation_responsibilities',
  'payment_intents',
  'external_payment_proposals',
  'outbox_events',
];

/**
 * Ensures the schema_migrations tracking table exists.
 */
export async function ensureMigrationTable(client: SqlQueryable): Promise<void> {
  const check = await client.query(`
    SELECT 1 FROM information_schema.tables WHERE table_name = 'schema_migrations'
  `);
  if (check.rows.length === 0) {
    await client.query(`
      CREATE TABLE schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }
}

/**
 * Applies pending schema migrations deterministically.
 */
export async function runMigrations(client: SqlQueryable): Promise<string[]> {
  await ensureMigrationTable(client);

  const appliedResult = await client.query(`SELECT version FROM schema_migrations;`);
  const appliedVersions = new Set<string>(appliedResult.rows.map((r: any) => r.version));

  const newlyApplied: string[] = [];

  for (const migration of MIGRATIONS) {
    if (!appliedVersions.has(migration.version)) {
      if ('connect' in client && typeof (client as any).connect === 'function') {
        const poolClient = await (client as any).connect();
        try {
          await poolClient.query('BEGIN');
          await poolClient.query(migration.sql);
          await poolClient.query(
            `INSERT INTO schema_migrations (version, applied_at) VALUES ($1, NOW());`,
            [migration.version]
          );
          await poolClient.query('COMMIT');
          newlyApplied.push(migration.version);
        } catch (err) {
          await poolClient.query('ROLLBACK');
          throw new Error(`Migration ${migration.version} failed: ${err}`);
        } finally {
          poolClient.release();
        }
      } else {
        await client.query('BEGIN');
        try {
          await client.query(migration.sql);
          await client.query(
            `INSERT INTO schema_migrations (version, applied_at) VALUES ($1, NOW());`,
            [migration.version]
          );
          await client.query('COMMIT');
          newlyApplied.push(migration.version);
        } catch (err) {
          await client.query('ROLLBACK');
          throw new Error(`Migration ${migration.version} failed: ${err}`);
        }
      }
    }
  }

  return newlyApplied;
}
