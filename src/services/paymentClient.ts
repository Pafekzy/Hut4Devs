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
  intent: AccommodationPaymentIntent,
  options?: { allowPreviewMode?: boolean }
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
        allowPreviewMode: options?.allowPreviewMode ?? false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.error ||
          "We couldn't prepare this payment with BMONI yet. Your accommodation balance has not changed.",
      };
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    // Graceful error on network failure / offline without crashing
    return {
      success: false,
      error: "We couldn't prepare this payment with BMONI yet. Your accommodation balance has not changed.",
    };
  }
}
