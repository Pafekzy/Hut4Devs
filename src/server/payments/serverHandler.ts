import {
  CreateProposalRequest,
  CreateProposalResult,
  PaymentProvider,
} from '../../domain/payments';
import { BmoniPaymentProvider } from './bmoniProvider';
import { FakePaymentProvider } from './fakeProvider';

export interface ServerHandlerResponse {
  status: number;
  body: CreateProposalResult;
}

export type ServerProviderMode = 'BMONI' | 'SIMULATED';

/**
 * Reads server-side provider mode from environment.
 * Default is strictly BMONI.
 */
export function getServerProviderMode(): ServerProviderMode {
  const envMode =
    typeof process !== 'undefined' && process.env && process.env.PAYMENT_PROVIDER_MODE
      ? process.env.PAYMENT_PROVIDER_MODE.trim().toUpperCase()
      : 'BMONI';

  return envMode === 'SIMULATED' ? 'SIMULATED' : 'BMONI';
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
 * Invariant: When in BMONI mode, NEVER silently fall back to FakePaymentProvider.
 */
export async function handleCreateProposal(
  body: any,
  customProvider?: PaymentProvider,
  overrideMode?: ServerProviderMode
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

  const { intentId, responsibilityId, amount, currency } = body;

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

  // 2. Evaluate Server-Side Provider Mode
  const activeMode = overrideMode ?? getServerProviderMode();

  // Mode: SIMULATED — explicit simulation only
  if (activeMode === 'SIMULATED') {
    const fakeProvider = new FakePaymentProvider();
    const result = await fakeProvider.createProposal(request);
    return {
      status: 200,
      body: result,
    };
  }

  // Mode: BMONI — strictly real BMONI provider. Never fall back to simulation!
  const bmoniProvider = new BmoniPaymentProvider();

  if (!bmoniProvider.hasCredentials()) {
    // Missing credentials produce NOT CONFIGURED
    return {
      status: 200,
      body: {
        success: false,
        error: 'BMONI Sandbox Not Configured',
        notConfigured: true,
        requiresCredentials: true,
      },
    };
  }

  // Real BMONI sandbox request
  const result = await bmoniProvider.createProposal(request);
  const status = result.success ? 200 : result.isAmbiguousError ? 504 : 400;

  return {
    status,
    body: result,
  };
}
