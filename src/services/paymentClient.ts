import {
  AccommodationResponsibility,
  AccommodationPaymentIntent,
} from '../domain/accommodation';
import {
  CreateProposalResult,
  ExternalPaymentProposal,
} from '../domain/payments';

export interface AccommodationServerState {
  success: boolean;
  responsibility?: AccommodationResponsibility;
  preparedIntents?: AccommodationPaymentIntent[];
  paymentProposals?: ExternalPaymentProposal[];
  error?: string;
}

export interface SaveIntentResult {
  success: boolean;
  intent?: AccommodationPaymentIntent;
  error?: string;
}

/**
 * Fetches authoritative accommodation responsibility state from PostgreSQL backend.
 * (H4D-FUNC-008)
 */
export async function fetchAccommodationState(): Promise<AccommodationServerState> {
  try {
    const response = await fetch('/api/accommodation/responsibility');
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to fetch accommodation responsibility state.',
      };
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: 'Database unavailable: Could not connect to authoritative persistence layer.',
    };
  }
}

/**
 * Persists a prepared payment intent to the PostgreSQL repository.
 * (H4D-FUNC-008)
 *
 * Invariant: Failure does NOT fall back to localStorage for authoritative state.
 */
export async function savePaymentIntent(
  intent: AccommodationPaymentIntent
): Promise<SaveIntentResult> {
  try {
    const response = await fetch('/api/payments/intents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ intent }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to persist payment intent to PostgreSQL.',
      };
    }

    return data;
  } catch (err: any) {
    return {
      success: false,
      error: 'Database unavailable: Connection failed while saving payment intent.',
    };
  }
}

/**
 * Client-Side Payment Provider Boundary (H4D-FUNC-005 & H4D-FUNC-008)
 *
 * This client function talks ONLY to the local server endpoint /api/payments/proposal.
 * It does NOT hold or transmit any BMONI API keys, partner secrets, or private keys.
 */
export async function requestBmoniProposal(
  intent: AccommodationPaymentIntent
): Promise<CreateProposalResult> {
  try {
    const response = await fetch('/api/payments/proposal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intentId: intent.id,
        responsibilityId: intent.responsibilityId,
        amount: intent.amount,
        currency: 'NGN',
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error:
          data.error ||
          "We couldn't prepare this payment with BMONI. No payment has been executed. Your accommodation balance has not changed.",
        isAmbiguousError: data.isAmbiguousError || response.status === 504,
        notConfigured: data.notConfigured,
        requiresCredentials: data.requiresCredentials,
        definitiveFailure: data.definitiveFailure,
      };
    }

    return data;
  } catch (err: any) {
    // Ambiguous client network failure / timeout: do NOT blindly retry.
    return {
      success: false,
      error:
        "Unresolved proposal attempt: Network connection failure or timeout. It is unknown whether BMONI accepted the proposal. Investigation or reconciliation is required before retrying. Do not retry automatically to prevent duplicate proposals. Your accommodation balance has not changed.",
      isAmbiguousError: true,
    };
  }
}
