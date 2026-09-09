import {
  PaymentProvider,
  CreateProposalRequest,
  CreateProposalResult,
  ExternalPaymentProposal,
} from '../../domain/payments';

/**
 * Pure mapping function from Hut4Devs intent request to BMONI API payload.
 * Anti-corruption layer ensuring Hut4Devs domain never depends on raw BMONI structure.
 */
export function mapIntentToBmoniRequest(request: CreateProposalRequest): {
  amount: number;
  currency: string;
  category: string;
  metadata: {
    intentId: string;
    responsibilityId: string;
    app: string;
  };
} {
  return {
    amount: request.amount,
    currency: request.currency || 'NGN',
    category: 'ACCOMMODATION_FULFILMENT',
    metadata: {
      intentId: request.intentId,
      responsibilityId: request.responsibilityId,
      app: 'Hut4Devs',
    },
  };
}

/**
 * Pure mapping function from raw BMONI provider response to Hut4Devs ExternalPaymentProposal.
 */
export function mapBmoniProposalResponse(
  rawResponse: Record<string, any>,
  request: CreateProposalRequest
): ExternalPaymentProposal {
  // Provider status normalization
  const rawStatus = rawResponse.status || rawResponse.providerStatus || 'PENDING_APPROVAL';
  let normalizedStatus = 'Pending Approval';
  if (typeof rawStatus === 'string') {
    const upper = rawStatus.toUpperCase();
    if (upper.includes('PENDING') || upper.includes('APPROVAL')) {
      normalizedStatus = 'Pending Approval';
    } else {
      normalizedStatus = rawStatus;
    }
  }

  const providerProposalId =
    rawResponse.id || rawResponse.proposalId || rawResponse.proposal_id || `bmoni-prop-${Date.now()}`;

  return {
    id: `ext-prop-${Date.now()}`,
    paymentIntentId: request.intentId,
    responsibilityId: request.responsibilityId,
    amount: request.amount,
    currency: request.currency || 'NGN',
    provider: 'BMONI',
    providerProposalId: String(providerProposalId),
    providerStatus: normalizedStatus,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Server-Side BMONI Payment Provider
 *
 * Reads secrets STRICTLY from server-side environment variables.
 * Never exposes API key, partner secret, or signing keys to the browser.
 */
export class BmoniPaymentProvider implements PaymentProvider {
  public readonly name = 'BMONI';

  private get apiUrl(): string {
    return (
      (typeof process !== 'undefined' && process.env && process.env.BMONI_API_URL) ||
      'https://api.sandbox.bmoni.com'
    );
  }

  private get apiKey(): string | undefined {
    return typeof process !== 'undefined' && process.env ? process.env.BMONI_API_KEY : undefined;
  }

  private get partnerSecret(): string | undefined {
    return typeof process !== 'undefined' && process.env ? process.env.BMONI_PARTNER_SECRET : undefined;
  }

  public hasCredentials(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  public async createProposal(request: CreateProposalRequest): Promise<CreateProposalResult> {
    if (!this.hasCredentials()) {
      return {
        success: false,
        error: 'BMONI LIVE SANDBOX VALIDATION: REQUIRES EXTERNAL SERVICE / CREDENTIALS',
        requiresCredentials: true,
      };
    }

    const payload = mapIntentToBmoniRequest(request);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${this.apiUrl}/proposals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey!,
          ...(this.partnerSecret ? { 'x-partner-secret': this.partnerSecret } : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.warn(`[BMONI] Proposal creation error (${response.status}): ${errorText}`, {
          intentId: request.intentId,
        });
        return {
          success: false,
          error: "We couldn't prepare this payment with BMONI yet. Your accommodation balance has not changed.",
        };
      }

      const data = await response.json();
      const proposal = mapBmoniProposalResponse(data, request);

      return {
        success: true,
        proposal,
      };
    } catch (err: any) {
      console.warn('[BMONI] Proposal network failure or timeout:', {
        intentId: request.intentId,
        error: err?.message,
      });
      return {
        success: false,
        error: "We couldn't prepare this payment with BMONI yet. Your accommodation balance has not changed.",
      };
    }
  }
}
