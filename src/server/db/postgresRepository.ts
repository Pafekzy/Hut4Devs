import {
  AccommodationResponsibility,
  AccommodationPaymentIntent,
  ResponsibilityStatus,
  FulfilmentType,
  PaymentIntentStatus,
} from '../../domain/accommodation';
import { ExternalPaymentProposal } from '../../domain/payments';
import {
  IAccommodationRepository,
  IPaymentIntentRepository,
  IExternalProposalRepository,
  IOutboxRepository,
  OutboxEventRecord,
  IHut4DevsRepositories,
} from '../../domain/repositories';
import { SqlQueryable } from './migrator';
import { Pool, PoolClient } from 'pg';

export class PostgresAccommodationRepository implements IAccommodationRepository {
  constructor(private client: SqlQueryable) {}

  async findById(id: string): Promise<AccommodationResponsibility | null> {
    const res = await this.client.query(
      'SELECT * FROM accommodation_responsibilities WHERE id = $1',
      [id]
    );
    if (res.rows.length === 0) return null;
    return this.mapRowToResponsibility(res.rows[0]);
  }

  async save(responsibility: AccommodationResponsibility): Promise<void> {
    const ctx = responsibility.accommodationContext;
    await this.client.query(
      `
      INSERT INTO accommodation_responsibilities (
        id, fellow_id, title, required_amount, verified_amount,
        status, period, currency, property_id, property_name,
        property_address, floor_id, floor_name, floor_level,
        room_id, room_name, room_code, fellow_name, fellow_email,
        context_data, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        required_amount = EXCLUDED.required_amount,
        verified_amount = EXCLUDED.verified_amount,
        status = EXCLUDED.status,
        period = EXCLUDED.period,
        currency = EXCLUDED.currency,
        property_id = EXCLUDED.property_id,
        property_name = EXCLUDED.property_name,
        property_address = EXCLUDED.property_address,
        floor_id = EXCLUDED.floor_id,
        floor_name = EXCLUDED.floor_name,
        floor_level = EXCLUDED.floor_level,
        room_id = EXCLUDED.room_id,
        room_name = EXCLUDED.room_name,
        room_code = EXCLUDED.room_code,
        fellow_name = EXCLUDED.fellow_name,
        fellow_email = EXCLUDED.fellow_email,
        context_data = EXCLUDED.context_data,
        updated_at = NOW()
      `,
      [
        responsibility.id,
        responsibility.fellowId,
        responsibility.title,
        responsibility.requiredAmount,
        responsibility.verifiedAmount,
        responsibility.status,
        responsibility.period || null,
        responsibility.currency || 'NGN',
        ctx?.property?.id || null,
        ctx?.property?.name || null,
        ctx?.property?.address || null,
        ctx?.floor?.id || null,
        ctx?.floor?.name || null,
        ctx?.floor?.levelNumber || null,
        ctx?.room?.id || null,
        ctx?.room?.name || null,
        ctx?.room?.code || null,
        responsibility.fellow?.name || null,
        responsibility.fellow?.email || null,
        ctx ? JSON.stringify(ctx) : null,
      ]
    );
  }

  async listAll(): Promise<AccommodationResponsibility[]> {
    const res = await this.client.query(
      'SELECT * FROM accommodation_responsibilities ORDER BY created_at ASC'
    );
    return res.rows.map((row) => this.mapRowToResponsibility(row));
  }

  private mapRowToResponsibility(row: any): AccommodationResponsibility {
    let context = row.context_data ? JSON.parse(row.context_data) : null;
    if (!context) {
      context = {
        property: {
          id: row.property_id || 'unknown-prop',
          name: row.property_name || 'Property',
          address: row.property_address || undefined,
        },
        floor: {
          id: row.floor_id || 'unknown-floor',
          propertyId: row.property_id || 'unknown-prop',
          name: row.floor_name || 'Floor',
          levelNumber: row.floor_level || undefined,
        },
        room: {
          id: row.room_id || 'unknown-room',
          floorId: row.floor_id || 'unknown-floor',
          name: row.room_name || 'Room',
          code: row.room_code || undefined,
        },
      };
    }

    return {
      id: row.id,
      fellowId: row.fellow_id,
      fellow: {
        id: row.fellow_id,
        name: row.fellow_name || 'Fellow',
        email: row.fellow_email || undefined,
        roomId: row.room_id || undefined,
      },
      title: row.title,
      accommodationContext: context,
      requiredAmount: Number(row.required_amount),
      verifiedAmount: Number(row.verified_amount),
      status: row.status as ResponsibilityStatus,
      period: row.period || undefined,
      currency: row.currency || 'NGN',
    };
  }
}

export class PostgresPaymentIntentRepository implements IPaymentIntentRepository {
  constructor(private client: SqlQueryable) {}

  async findById(id: string): Promise<AccommodationPaymentIntent | null> {
    const res = await this.client.query(
      'SELECT * FROM payment_intents WHERE id = $1',
      [id]
    );
    if (res.rows.length === 0) return null;
    return this.mapRowToIntent(res.rows[0]);
  }

  async findByResponsibilityId(responsibilityId: string): Promise<AccommodationPaymentIntent[]> {
    const res = await this.client.query(
      'SELECT * FROM payment_intents WHERE responsibility_id = $1 ORDER BY created_at ASC',
      [responsibilityId]
    );
    return res.rows.map((row) => this.mapRowToIntent(row));
  }

  async save(intent: AccommodationPaymentIntent): Promise<void> {
    // Foreign key validation: responsibility must exist
    const respCheck = await this.client.query(
      'SELECT id FROM accommodation_responsibilities WHERE id = $1',
      [intent.responsibilityId]
    );
    if (respCheck.rows.length === 0) {
      throw new Error(
        `Foreign key violation: accommodation responsibility "${intent.responsibilityId}" does not exist.`
      );
    }

    await this.client.query(
      `
      INSERT INTO payment_intents (
        id, responsibility_id, amount, fulfilment_type, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        amount = EXCLUDED.amount,
        fulfilment_type = EXCLUDED.fulfilment_type,
        status = EXCLUDED.status
      `,
      [
        intent.id,
        intent.responsibilityId,
        intent.amount,
        intent.fulfilmentType,
        intent.status || PaymentIntentStatus.PREPARED,
        intent.createdAt || new Date().toISOString(),
      ]
    );
  }

  async listAll(): Promise<AccommodationPaymentIntent[]> {
    const res = await this.client.query('SELECT * FROM payment_intents ORDER BY created_at ASC');
    return res.rows.map((row) => this.mapRowToIntent(row));
  }

  private mapRowToIntent(row: any): AccommodationPaymentIntent {
    return {
      id: row.id,
      responsibilityId: row.responsibility_id,
      amount: Number(row.amount),
      fulfilmentType: row.fulfilment_type as FulfilmentType,
      status: row.status as PaymentIntentStatus,
      createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    };
  }
}

export class PostgresExternalProposalRepository implements IExternalProposalRepository {
  constructor(private client: SqlQueryable) {}

  async findById(id: string): Promise<ExternalPaymentProposal | null> {
    const res = await this.client.query(
      `
      SELECT p.*, i.responsibility_id, i.amount, r.currency
      FROM external_payment_proposals p
      JOIN payment_intents i ON p.payment_intent_id = i.id
      JOIN accommodation_responsibilities r ON i.responsibility_id = r.id
      WHERE p.id = $1
      `,
      [id]
    );
    if (res.rows.length === 0) return null;
    return this.mapRowToProposal(res.rows[0]);
  }

  async findByIntentId(intentId: string): Promise<ExternalPaymentProposal | null> {
    const res = await this.client.query(
      `
      SELECT p.*, i.responsibility_id, i.amount, r.currency
      FROM external_payment_proposals p
      JOIN payment_intents i ON p.payment_intent_id = i.id
      JOIN accommodation_responsibilities r ON i.responsibility_id = r.id
      WHERE p.payment_intent_id = $1
      ORDER BY p.created_at DESC
      LIMIT 1
      `,
      [intentId]
    );
    if (res.rows.length === 0) return null;
    return this.mapRowToProposal(res.rows[0]);
  }

  async save(proposal: ExternalPaymentProposal): Promise<void> {
    // Foreign key validation: payment intent must exist
    const intentCheck = await this.client.query(
      'SELECT id FROM payment_intents WHERE id = $1',
      [proposal.paymentIntentId]
    );
    if (intentCheck.rows.length === 0) {
      throw new Error(
        `Foreign key violation: payment intent "${proposal.paymentIntentId}" does not exist.`
      );
    }

    await this.client.query(
      `
      INSERT INTO external_payment_proposals (
        id, payment_intent_id, provider, provider_proposal_id,
        provider_status, is_simulated, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        provider = EXCLUDED.provider,
        provider_proposal_id = EXCLUDED.provider_proposal_id,
        provider_status = EXCLUDED.provider_status,
        is_simulated = EXCLUDED.is_simulated
      `,
      [
        proposal.id,
        proposal.paymentIntentId,
        proposal.provider,
        proposal.providerProposalId,
        proposal.providerStatus,
        Boolean(proposal.isSimulated),
        proposal.createdAt || new Date().toISOString(),
      ]
    );
  }

  async listAll(): Promise<ExternalPaymentProposal[]> {
    const res = await this.client.query(
      `
      SELECT p.*, i.responsibility_id, i.amount, r.currency
      FROM external_payment_proposals p
      JOIN payment_intents i ON p.payment_intent_id = i.id
      JOIN accommodation_responsibilities r ON i.responsibility_id = r.id
      ORDER BY p.created_at ASC
      `
    );
    return res.rows.map((row) => this.mapRowToProposal(row));
  }

  private mapRowToProposal(row: any): ExternalPaymentProposal {
    return {
      id: row.id,
      paymentIntentId: row.payment_intent_id,
      responsibilityId: row.responsibility_id || '',
      amount: Number(row.amount || 0),
      currency: row.currency || 'NGN',
      provider: row.provider,
      providerProposalId: row.provider_proposal_id,
      providerStatus: row.provider_status,
      createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      isSimulated: Boolean(row.is_simulated),
    };
  }
}

/**
 * PostgreSQL Outbox Repository Implementation (H4D-FUNC-010)
 */
export class PostgresOutboxRepository implements IOutboxRepository {
  constructor(private client: SqlQueryable) {}

  async insert(event: OutboxEventRecord): Promise<void> {
    const payloadJson = typeof event.payload === 'string' ? event.payload : JSON.stringify(event.payload);
    await this.client.query(
      `
      INSERT INTO outbox_events (
        id, event_type, aggregate_type, aggregate_id, payload, created_at, published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO NOTHING
      `,
      [
        event.id,
        event.eventType,
        event.aggregateType,
        event.aggregateId,
        payloadJson,
        event.createdAt || new Date().toISOString(),
        event.publishedAt || null,
      ]
    );
  }

  async markPublished(id: string, publishedAt?: string): Promise<void> {
    const pubDate = publishedAt || new Date().toISOString();
    await this.client.query(
      'UPDATE outbox_events SET published_at = $1 WHERE id = $2',
      [pubDate, id]
    );
  }

  async findPending(): Promise<OutboxEventRecord[]> {
    const res = await this.client.query(
      'SELECT * FROM outbox_events WHERE published_at IS NULL ORDER BY created_at ASC'
    );
    return res.rows.map(this.mapRowToEvent);
  }

  async findById(id: string): Promise<OutboxEventRecord | null> {
    const res = await this.client.query(
      'SELECT * FROM outbox_events WHERE id = $1',
      [id]
    );
    if (res.rows.length === 0) return null;
    return this.mapRowToEvent(res.rows[0]);
  }

  async listAll(): Promise<OutboxEventRecord[]> {
    const res = await this.client.query(
      'SELECT * FROM outbox_events ORDER BY created_at DESC'
    );
    return res.rows.map(this.mapRowToEvent);
  }

  private mapRowToEvent(row: any): OutboxEventRecord {
    let payload = row.payload;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        // Keep raw if invalid JSON
      }
    }
    return {
      id: row.id,
      eventType: row.event_type,
      aggregateType: row.aggregate_type,
      aggregateId: row.aggregate_id,
      payload,
      createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      publishedAt: row.published_at ? (row.published_at instanceof Date ? row.published_at.toISOString() : String(row.published_at)) : null,
    };
  }
}

/**
 * Top-level PostgreSQL Repositories Coordinator
 */
export class PostgresRepositories implements IHut4DevsRepositories {
  accommodation: IAccommodationRepository;
  intents: IPaymentIntentRepository;
  proposals: IExternalProposalRepository;
  outbox: IOutboxRepository;

  constructor(private poolOrClient: Pool | PoolClient | SqlQueryable) {
    this.accommodation = new PostgresAccommodationRepository(this.poolOrClient);
    this.intents = new PostgresPaymentIntentRepository(this.poolOrClient);
    this.proposals = new PostgresExternalProposalRepository(this.poolOrClient);
    this.outbox = new PostgresOutboxRepository(this.poolOrClient);
  }

  async runInTransaction<T>(fn: (repos: IHut4DevsRepositories) => Promise<T>): Promise<T> {
    // If poolOrClient has connect (i.e. is a Pool), acquire a client
    if ('connect' in this.poolOrClient && typeof (this.poolOrClient as Pool).connect === 'function') {
      const client = await (this.poolOrClient as Pool).connect();
      try {
        await client.query('BEGIN');
        const txRepos = new PostgresRepositories(client);
        const result = await fn(txRepos);
        await client.query('COMMIT');
        return result;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } else {
      // Direct client (e.g. single connection or pg-mem adapter)
      const directClient = this.poolOrClient as SqlQueryable;
      await directClient.query('BEGIN');
      try {
        const txRepos = new PostgresRepositories(directClient);
        const result = await fn(txRepos);
        await directClient.query('COMMIT');
        return result;
      } catch (err) {
        await directClient.query('ROLLBACK');
        throw err;
      }
    }
  }
}
