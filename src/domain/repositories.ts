import {
  AccommodationResponsibility,
  AccommodationPaymentIntent,
} from './accommodation';
import { ExternalPaymentProposal } from './payments';
import { IMemberRepository, ISessionRepository } from './auth';

/**
 * Accommodation Responsibility Repository Interface (H4D-FUNC-008)
 */
export interface IAccommodationRepository {
  findById(id: string): Promise<AccommodationResponsibility | null>;
  save(responsibility: AccommodationResponsibility): Promise<void>;
  listAll(): Promise<AccommodationResponsibility[]>;
}

/**
 * Payment Intent Repository Interface (H4D-FUNC-008)
 */
export interface IPaymentIntentRepository {
  findById(id: string): Promise<AccommodationPaymentIntent | null>;
  findByResponsibilityId(responsibilityId: string): Promise<AccommodationPaymentIntent[]>;
  save(intent: AccommodationPaymentIntent): Promise<void>;
  listAll(): Promise<AccommodationPaymentIntent[]>;
}

/**
 * External Payment Proposal Repository Interface (H4D-FUNC-008)
 */
export interface IExternalProposalRepository {
  findById(id: string): Promise<ExternalPaymentProposal | null>;
  findByIntentId(intentId: string): Promise<ExternalPaymentProposal | null>;
  save(proposal: ExternalPaymentProposal): Promise<void>;
  listAll(): Promise<ExternalPaymentProposal[]>;
}

/**
 * Outbox Event Record (H4D-FUNC-010)
 *
 * Invariant: Provider-independent, minimal operational payload.
 * No secrets, private keys, wallet history, vouches, or unrelated data.
 */
export interface OutboxEventRecord {
  id: string;
  eventType: string; // e.g. 'accommodation.payment_intent.prepared'
  aggregateType: string; // e.g. 'accommodation_responsibility'
  aggregateId: string; // e.g. 'resp-infinite-grace-3b-sep2026'
  payload: Record<string, any>;
  createdAt: string;
  publishedAt?: string | null;
}

/**
 * Transactional Outbox Repository Interface (H4D-FUNC-010)
 */
export interface IOutboxRepository {
  insert(event: OutboxEventRecord): Promise<void>;
  markPublished(id: string, publishedAt?: string): Promise<void>;
  findPending(): Promise<OutboxEventRecord[]>;
  findById(id: string): Promise<OutboxEventRecord | null>;
  listAll(): Promise<OutboxEventRecord[]>;
}

/**
 * Coherent Unit of Work & Transaction Boundary
 */
export interface IHut4DevsRepositories {
  accommodation: IAccommodationRepository;
  intents: IPaymentIntentRepository;
  proposals: IExternalProposalRepository;
  outbox: IOutboxRepository;
  members: IMemberRepository;
  sessions: ISessionRepository;
  runInTransaction<T>(fn: (repos: IHut4DevsRepositories) => Promise<T>): Promise<T>;
}
