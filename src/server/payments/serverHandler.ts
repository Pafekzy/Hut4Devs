import {
  CreateProposalRequest,
  CreateProposalResult,
  PaymentProvider,
} from '../../domain/payments';
import { BmoniPaymentProvider } from './bmoniProvider';
import { FakePaymentProvider } from './fakeProvider';

export interface ServerHandlerResponse {
  status: number;
  body: CreateProposalResult & { previewMode?: boolean };
}

/**
 * Isolated Server-Side Boundary Handler for /api/payments/proposal
 *
 * RUNTIME EXECUTION NOTE:
 * Current external execution capability is DEVELOPMENT ONLY (mounted via Vite dev server plugin).
 * Production build (`vite build`) produces static client bundles without a standalone Node backend.
 * This handler is decoupled from any specific web framework (Express, Fastify, AWS Lambda, Cloud Run)
 * so it can be mounted into a production backend runtime when provisioned.
 *
 * Invariant: Never alters accommodation balances or status. Browser client never sees BMONI credentials.
 */
export async function handleCreateProposal(
  body: any,
  customProvider?: PaymentProvider
): Promise<ServerHandlerResponse> {
  if (!body || typeof body !== 'object') {
    return {
      status: 400,
      body: {
        success: false,
        error: 'Invalid request body.',
      },
    };
  }

  const { intentId, responsibilityId, amount, currency, allowPreviewMode } = body;

  if (!intentId || typeof amount !== 'number' || amount <= 0) {
    return {
      status: 400,
      body: {
        success: false,
        error: 'Invalid payment intent parameters.',
      },
    };
  }

  const request: CreateProposalRequest = {
    intentId,
    responsibilityId: responsibilityId || 'unknown-responsibility',
    amount,
    currency: currency || 'NGN',
  };

  // 1. If a custom provider is explicitly injected (e.g. for testing)
  if (customProvider) {
    const result = await customProvider.createProposal(request);
    return {
      status: result.success ? 200 : 400,
      body: result,
    };
  }

  // 2. Default to real BMONI provider
  const bmoniProvider = new BmoniPaymentProvider();

  if (bmoniProvider.hasCredentials()) {
    const result = await bmoniProvider.createProposal(request);
    return {
      status: result.success ? 200 : 502,
      body: result,
    };
  }

  // 3. When external credentials are not set:
  // If preview mode is requested by client for development inspection:
  if (allowPreviewMode) {
    const fakeProvider = new FakePaymentProvider();
    const result = await fakeProvider.createProposal(request);
    return {
      status: 200,
      body: {
        ...result,
        previewMode: true,
      },
    };
  }

  // Truthful response: external credentials required
  return {
    status: 200,
    body: {
      success: false,
      error: 'BMONI LIVE SANDBOX VALIDATION: REQUIRES EXTERNAL SERVICE / CREDENTIALS',
      requiresCredentials: true,
    },
  };
}
