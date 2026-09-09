import {
  AccommodationPaymentIntent,
} from '../domain/accommodation';
import {
  CreateProposalResult,
} from '../domain/payments';

/**
 * Client-Side Payment Provider Boundary (H4D-FUNC-005)
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
