import {
  PaymentProvider,
  CreateProposalRequest,
  CreateProposalResult,
  ExternalPaymentProposal,
} from '../../domain/payments';

/**
 * Fake/Mock Payment Provider for automated testing and fallback preview.
 * Simulates a successful BMONI proposal creation without network calls.
 */
export class FakePaymentProvider implements PaymentProvider {
  public readonly name = 'BMONI';
  public shouldFail: boolean = false;
  public lastRequest?: CreateProposalRequest;

  constructor(shouldFail = false) {
    this.shouldFail = shouldFail;
  }

  public async createProposal(request: CreateProposalRequest): Promise<CreateProposalResult> {
    this.lastRequest = request;

    if (this.shouldFail) {
      return {
        success: false,
        error: "We couldn't prepare this payment with BMONI yet. Your accommodation balance has not changed.",
      };
    }

    const proposal: ExternalPaymentProposal = {
      id: `ext-prop-${Date.now()}`,
      paymentIntentId: request.intentId,
      responsibilityId: request.responsibilityId,
      amount: request.amount,
      currency: request.currency || 'NGN',
      provider: 'BMONI',
      providerProposalId: `bmoni-prop-${Math.floor(100000 + Math.random() * 900000)}`,
      providerStatus: 'Pending Approval',
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      proposal,
    };
  }
}
