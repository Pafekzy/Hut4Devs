import {
  AccommodationResponsibility,
  AccommodationPaymentIntent,
} from './accommodation';
import { ExternalPaymentProposal } from './payments';

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
 * Coherent Unit of Work & Transaction Boundary
 */
export interface IHut4DevsRepositories {
  accommodation: IAccommodationRepository;
  intents: IPaymentIntentRepository;
  proposals: IExternalProposalRepository;
  runInTransaction<T>(fn: (repos: IHut4DevsRepositories) => Promise<T>): Promise<T>;
}
