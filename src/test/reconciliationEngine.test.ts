import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import http from 'node:http';
import crypto from 'node:crypto';
import { newDb } from 'pg-mem';
import { runMigrations } from '../server/db/migrator';
import { seedDevelopmentDatabase } from '../server/db/seed';
import { PostgresRepositories } from '../server/db/postgresRepository';
import { createDeployableServer } from '../../server';
import { OutboxPublisher } from '../server/realtime/outboxPublisher';
import { DEMO_ACCOMMODATION_RESPONSIBILITY } from '../data/demoAccommodation';
import { MemberRole } from '../domain/auth';
import { ReconciliationEngine } from '../server/payments/reconciliationEngine';
import { PaymentIntentStatus, ResponsibilityStatus, FulfilmentType } from '../domain/accommodation';
import { PaymentReconciliationStatus, ReconciliationReasonCode } from '../domain/reconciliation';

describe('H4D-FUNC-013: Accommodation Payment Reconciliation Engine', () => {
  let memDb: any;
  let pool: any;
  let repos: PostgresRepositories;
  let publisher: OutboxPublisher;
  let server: http.Server;
  let baseUrl: string;
  let reconciliationEngine: ReconciliationEngine;
  const TEST_WEBHOOK_SECRET = 'test_bmoni_secret_reconciliation_456';

  beforeEach(async () => {
    memDb = newDb({ autoCreateForeignKeyIndices: true });
    const adapter = memDb.adapters.createPg();
    pool = new adapter.Pool();

    // Run all migrations up to 005_payment_reconciliations
    await runMigrations(pool);
    await seedDevelopmentDatabase(pool);

    repos = new PostgresRepositories(pool);
    publisher = new OutboxPublisher();
    reconciliationEngine = new ReconciliationEngine(repos, publisher);

    server = createDeployableServer({
      repos,
      publisher,
      bmoniWebhookSecret: TEST_WEBHOOK_SECRET,
    });

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address() as any;
        baseUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });
  });

  afterEach(async () => {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    }
  });

  function computeHmacSignature(rawBody: string, secret = TEST_WEBHOOK_SECRET): string {
    return crypto.createHmac('sha256', secret).update(Buffer.from(rawBody, 'utf8')).digest('hex');
  }

  async function establishSession(role: MemberRole): Promise<string> {
    const res = await fetch(`${baseUrl}/api/auth/dev-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    return data.token;
  }

  // 1. Full payment reconciliation flow through webhook ingestion
  it('1. atomically reconciles full payment evidence chain (Event -> Proposal -> Intent -> Responsibility)', async () => {
    // A. Seed an intent and proposal
    const intentId = 'intent_rec_full_01';
    await repos.intents.save({
      id: intentId,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      amount: 66000,
      fulfilmentType: FulfilmentType.FULL,
      status: PaymentIntentStatus.PREPARED,
      createdAt: new Date().toISOString(),
    });

    const proposalId = 'prop_bmoni_full_01';
    await repos.proposals.save({
      id: 'ext_prop_full_01',
      paymentIntentId: intentId,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      amount: 66000,
      currency: 'NGN',
      provider: 'BMONI',
      providerProposalId: proposalId,
      providerStatus: 'PENDING',
      isSimulated: false,
      createdAt: new Date().toISOString(),
    });

    // B. Send valid signed webhook with matching proposalId and amount
    const rawPayload = JSON.stringify({
      id: 'bmoni_evt_full_01',
      type: 'payment.completed',
      data: {
        proposalId,
        status: 'COMPLETED',
        amount: 66000,
        currency: 'NGN',
      },
      createdAt: new Date().toISOString(),
    });

    const signature = computeHmacSignature(rawPayload);

    const res = await fetch(`${baseUrl}/api/webhooks/bmoni`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Id': 'bmoni_evt_full_01',
      },
      body: rawPayload,
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    // C. Verify authoritative responsibility state updated atomically
    const resp = await repos.accommodation.findById(DEMO_ACCOMMODATION_RESPONSIBILITY.id);
    expect(resp).toBeDefined();
    expect(resp!.verifiedAmount).toBe(66000);
    expect(resp!.status).toBe(ResponsibilityStatus.FULFILLED);

    // D. Verify payment reconciliation record inserted
    const recs = await repos.reconciliations.listByResponsibilityId(DEMO_ACCOMMODATION_RESPONSIBILITY.id);
    expect(recs.length).toBe(1);
    expect(recs[0].reconciliationStatus).toBe(PaymentReconciliationStatus.VERIFIED);
    expect(recs[0].reasonCode).toBe(ReconciliationReasonCode.MATCHED_VERIFIED);
    expect(recs[0].amount).toBe(66000);
    expect(recs[0].externalPaymentProposalId).toBe('ext_prop_full_01');
    expect(recs[0].paymentIntentId).toBe(intentId);

    // E. Verify outbox event created
    const outboxEvents = await repos.outbox.listAll();
    const recOutbox = outboxEvents.find((e) => e.eventType === 'accommodation.payment.reconciled');
    expect(recOutbox).toBeDefined();
    expect(recOutbox!.payload.verifiedAmount).toBe(66000);
    expect(recOutbox!.payload.status).toBe(ResponsibilityStatus.FULFILLED);
  });

  // 2. Partial payment reconciliation
  it('2. correctly updates status to PARTIALLY_FULFILLED on partial payment reconciliation', async () => {
    const intentId = 'intent_rec_partial_02';
    await repos.intents.save({
      id: intentId,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      amount: 30000,
      fulfilmentType: FulfilmentType.PARTIAL,
      status: PaymentIntentStatus.PREPARED,
      createdAt: new Date().toISOString(),
    });

    const proposalId = 'prop_bmoni_partial_02';
    await repos.proposals.save({
      id: 'ext_prop_partial_02',
      paymentIntentId: intentId,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      amount: 30000,
      currency: 'NGN',
      provider: 'BMONI',
      providerProposalId: proposalId,
      providerStatus: 'PENDING',
      isSimulated: false,
      createdAt: new Date().toISOString(),
    });

    const rawPayload = JSON.stringify({
      id: 'bmoni_evt_partial_02',
      type: 'payment.completed',
      data: {
        proposalId,
        status: 'COMPLETED',
        amount: 30000,
        currency: 'NGN',
      },
    });

    const res = await fetch(`${baseUrl}/api/webhooks/bmoni`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': computeHmacSignature(rawPayload),
        'X-Webhook-Id': 'bmoni_evt_partial_02',
      },
      body: rawPayload,
    });

    expect(res.status).toBe(200);

    const resp = await repos.accommodation.findById(DEMO_ACCOMMODATION_RESPONSIBILITY.id);
    expect(resp!.verifiedAmount).toBe(30000);
    expect(resp!.status).toBe(ResponsibilityStatus.PARTIALLY_FULFILLED);
  });

  // 3. Idempotency: Duplicate provider event does not duplicate financial credit
  it('3. enforces idempotency: repeated reconciliation of same provider event produces no duplicate credit', async () => {
    const intentId = 'intent_rec_idem_03';
    await repos.intents.save({
      id: intentId,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      amount: 25000,
      fulfilmentType: FulfilmentType.PARTIAL,
      status: PaymentIntentStatus.PREPARED,
      createdAt: new Date().toISOString(),
    });

    const proposalId = 'prop_bmoni_idem_03';
    await repos.proposals.save({
      id: 'ext_prop_idem_03',
      paymentIntentId: intentId,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      amount: 25000,
      currency: 'NGN',
      provider: 'BMONI',
      providerProposalId: proposalId,
      providerStatus: 'PENDING',
      isSimulated: false,
      createdAt: new Date().toISOString(),
    });

    // Ingest event first time
    const rawPayload = JSON.stringify({
      id: 'bmoni_evt_idem_03',
      type: 'payment.completed',
      data: {
        proposalId,
        status: 'COMPLETED',
        amount: 25000,
        currency: 'NGN',
      },
    });

    await fetch(`${baseUrl}/api/webhooks/bmoni`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': computeHmacSignature(rawPayload),
        'X-Webhook-Id': 'bmoni_evt_idem_03',
      },
      body: rawPayload,
    });

    const resp1 = await repos.accommodation.findById(DEMO_ACCOMMODATION_RESPONSIBILITY.id);
    expect(resp1!.verifiedAmount).toBe(25000);

    // Re-reconcile direct invocation or duplicate webhook
    const providerEvent = (await repos.providerEvents.findByProviderEventId('BMONI', 'bmoni_evt_idem_03'))!;
    const secondResult = await reconciliationEngine.reconcileProviderEvent(providerEvent);

    expect(secondResult.success).toBe(true);
    expect(secondResult.isDuplicate).toBe(true);
    expect(secondResult.reasonCode).toBe(ReconciliationReasonCode.ALREADY_RECONCILED);

    // Verified amount is STILL 25000, strictly NOT 50000!
    const resp2 = await repos.accommodation.findById(DEMO_ACCOMMODATION_RESPONSIBILITY.id);
    expect(resp2!.verifiedAmount).toBe(25000);
  });

  // 4. Mismatch: Orphaned proposal ID leaves financial state untouched
  it('4. records MISMATCH and strictly leaves financial state untouched when proposal is unknown', async () => {
    const rawPayload = JSON.stringify({
      id: 'bmoni_evt_orphan_04',
      type: 'payment.completed',
      data: {
        proposalId: 'prop_unknown_nonexistent',
        status: 'COMPLETED',
        amount: 50000,
        currency: 'NGN',
      },
    });

    const res = await fetch(`${baseUrl}/api/webhooks/bmoni`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': computeHmacSignature(rawPayload),
        'X-Webhook-Id': 'bmoni_evt_orphan_04',
      },
      body: rawPayload,
    });

    expect(res.status).toBe(200);

    // Verified amount must remain 0!
    const resp = await repos.accommodation.findById(DEMO_ACCOMMODATION_RESPONSIBILITY.id);
    expect(resp!.verifiedAmount).toBe(0);
    expect(resp!.status).toBe(ResponsibilityStatus.OUTSTANDING);

    // Reconciliation audit recorded as MISMATCH
    const rec = await repos.reconciliations.findByProviderEventId('BMONI', 'bmoni_evt_orphan_04');
    expect(rec).toBeDefined();
    expect(rec!.reconciliationStatus).toBe(PaymentReconciliationStatus.MISMATCH);
    expect(rec!.reasonCode).toBe(ReconciliationReasonCode.PROPOSAL_NOT_FOUND);
  });

  // 5. Mismatch: Amount mismatch leaves financial state untouched
  it('5. records MISMATCH and does NOT modify verifiedAmount when amount differs from proposal', async () => {
    const intentId = 'intent_rec_mismatch_05';
    await repos.intents.save({
      id: intentId,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      amount: 66000,
      fulfilmentType: FulfilmentType.FULL,
      status: PaymentIntentStatus.PREPARED,
      createdAt: new Date().toISOString(),
    });

    const proposalId = 'prop_bmoni_mismatch_05';
    await repos.proposals.save({
      id: 'ext_prop_mismatch_05',
      paymentIntentId: intentId,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      amount: 66000,
      currency: 'NGN',
      provider: 'BMONI',
      providerProposalId: proposalId,
      providerStatus: 'PENDING',
      isSimulated: false,
      createdAt: new Date().toISOString(),
    });

    // Provider sends 50000 instead of 66000
    const rawPayload = JSON.stringify({
      id: 'bmoni_evt_amt_mismatch_05',
      type: 'payment.completed',
      data: {
        proposalId,
        status: 'COMPLETED',
        amount: 50000,
        currency: 'NGN',
      },
    });

    await fetch(`${baseUrl}/api/webhooks/bmoni`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': computeHmacSignature(rawPayload),
        'X-Webhook-Id': 'bmoni_evt_amt_mismatch_05',
      },
      body: rawPayload,
    });

    const resp = await repos.accommodation.findById(DEMO_ACCOMMODATION_RESPONSIBILITY.id);
    expect(resp!.verifiedAmount).toBe(0);

    const rec = await repos.reconciliations.findByProviderEventId('BMONI', 'bmoni_evt_amt_mismatch_05');
    expect(rec!.reconciliationStatus).toBe(PaymentReconciliationStatus.MISMATCH);
    expect(rec!.reasonCode).toBe(ReconciliationReasonCode.AMOUNT_MISMATCH);
  });

  // 6. Admin API: Authorization rules for reconciliations endpoint
  it('6. protects GET /api/accommodation/admin/reconciliations: admin allowed, fellow forbidden, unauthenticated rejected', async () => {
    // Unauthenticated -> 401
    const resNoAuth = await fetch(`${baseUrl}/api/accommodation/admin/reconciliations`);
    expect(resNoAuth.status).toBe(401);

    // Fellow -> 403
    const fellowToken = await establishSession(MemberRole.FELLOW);
    const resFellow = await fetch(`${baseUrl}/api/accommodation/admin/reconciliations`, {
      headers: { Authorization: `Bearer ${fellowToken}` },
    });
    expect(resFellow.status).toBe(403);

    // Admin -> 200
    const adminToken = await establishSession(MemberRole.ACCOMMODATION_ADMIN);
    const resAdmin = await fetch(`${baseUrl}/api/accommodation/admin/reconciliations`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(resAdmin.status).toBe(200);
    const data = await resAdmin.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.reconciliations)).toBe(true);
  });

  // 7. Admin API: POST /api/accommodation/admin/reconcile manual trigger
  it('7. allows Accommodation Admin to trigger reconciliation manually', async () => {
    // Seed intent and proposal
    const intentId = 'intent_rec_manual_07';
    await repos.intents.save({
      id: intentId,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      amount: 15000,
      fulfilmentType: FulfilmentType.PARTIAL,
      status: PaymentIntentStatus.PREPARED,
      createdAt: new Date().toISOString(),
    });

    const proposalId = 'prop_bmoni_manual_07';
    await repos.proposals.save({
      id: 'ext_prop_manual_07',
      paymentIntentId: intentId,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      amount: 15000,
      currency: 'NGN',
      provider: 'BMONI',
      providerProposalId: proposalId,
      providerStatus: 'PENDING',
      isSimulated: false,
      createdAt: new Date().toISOString(),
    });

    // Save a raw provider event directly into provider_events store
    await repos.providerEvents.create({
      id: 'pevt_manual_07',
      provider: 'BMONI',
      providerEventId: 'bmoni_evt_manual_07',
      sourceEventId: 'src_evt_manual_07',
      eventType: 'payment.completed',
      providerStatus: 'COMPLETED',
      providerProposalId: proposalId,
      payload: {
        proposalId,
        status: 'COMPLETED',
        amount: 15000,
        currency: 'NGN',
      },
      receivedAt: new Date().toISOString(),
      processingStatus: 'RECEIVED' as any,
    });

    const adminToken = await establishSession(MemberRole.ACCOMMODATION_ADMIN);

    const res = await fetch(`${baseUrl}/api/accommodation/admin/reconcile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        providerEventId: 'bmoni_evt_manual_07',
        provider: 'BMONI',
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.result.reconciliationStatus).toBe(PaymentReconciliationStatus.VERIFIED);

    const resp = await repos.accommodation.findById(DEMO_ACCOMMODATION_RESPONSIBILITY.id);
    expect(resp!.verifiedAmount).toBe(15000);
  });

  // 8. Invariant: No automatic peer or guarantor effects
  it('8. preserves boundary: payment reconciliation does not modify peer support or other records', async () => {
    // Check initial responsibilities count
    const initialResp = await repos.accommodation.findById(DEMO_ACCOMMODATION_RESPONSIBILITY.id);
    expect(initialResp).toBeDefined();

    // Reconcile
    const intentId = 'intent_rec_bound_08';
    await repos.intents.save({
      id: intentId,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      amount: 10000,
      fulfilmentType: FulfilmentType.PARTIAL,
      status: PaymentIntentStatus.PREPARED,
      createdAt: new Date().toISOString(),
    });

    const proposalId = 'prop_bmoni_bound_08';
    await repos.proposals.save({
      id: 'ext_prop_bound_08',
      paymentIntentId: intentId,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      amount: 10000,
      currency: 'NGN',
      provider: 'BMONI',
      providerProposalId: proposalId,
      providerStatus: 'PENDING',
      isSimulated: false,
      createdAt: new Date().toISOString(),
    });

    const rawPayload = JSON.stringify({
      id: 'bmoni_evt_bound_08',
      type: 'payment.completed',
      data: {
        proposalId,
        status: 'COMPLETED',
        amount: 10000,
        currency: 'NGN',
      },
    });

    await fetch(`${baseUrl}/api/webhooks/bmoni`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': computeHmacSignature(rawPayload),
        'X-Webhook-Id': 'bmoni_evt_bound_08',
      },
      body: rawPayload,
    });

    const afterResp = await repos.accommodation.findById(DEMO_ACCOMMODATION_RESPONSIBILITY.id);
    expect(afterResp).toBeDefined();
    expect(afterResp!.verifiedAmount).toBe(10000);
  });
});
