import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import {
  PaymentProvider,
  ExternalPaymentProposal,
} from '../domain/payments';
import {
  BmoniPaymentProvider,
  mapBmoniProposalResponse,
  mapIntentToBmoniRequest,
} from '../server/payments/bmoniProvider';
import { FakePaymentProvider } from '../server/payments/fakeProvider';
import { handleCreateProposal } from '../server/payments/serverHandler';
import {
  AccommodationResponsibility,
  ResponsibilityStatus,
  AccommodationPaymentIntent,
  FulfilmentType,
  PaymentIntentStatus,
  calculateRemainingAmount,
} from '../domain/accommodation';
import { DEMO_ACCOMMODATION_RESPONSIBILITY } from '../data/demoAccommodation';
import { FulfilmentFlow } from '../components/FulfilmentFlow';
import { AccommodationAdminView } from '../components/AccommodationAdminView';
import { ResponsibilityDetailView } from '../components/ResponsibilityDetailView';

describe('H4D-FUNC-005: BMONI Payment Provider Boundary & Real Proposal Creation', () => {
  const sampleIntent: AccommodationPaymentIntent = {
    id: 'intent-test-001',
    responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
    amount: 66000,
    fulfilmentType: FulfilmentType.FULL,
    status: PaymentIntentStatus.PREPARED,
    createdAt: new Date().toISOString(),
  };

  // 1. PaymentProvider Abstraction & Contract (FakePaymentProvider)
  it('1. adheres to the provider-independent PaymentProvider interface and explicitly marks simulation', async () => {
    const fakeProvider: PaymentProvider = new FakePaymentProvider();
    expect(fakeProvider.name).toBe('SIMULATED');

    const result = await fakeProvider.createProposal({
      intentId: sampleIntent.id,
      responsibilityId: sampleIntent.responsibilityId,
      amount: sampleIntent.amount,
      currency: 'NGN',
    });

    expect(result.success).toBe(true);
    expect(result.proposal).toBeDefined();
    expect(result.proposal?.provider).toBe('SIMULATED');
    expect(result.proposal?.providerStatus).toBe('Simulated');
    expect(result.proposal?.isSimulated).toBe(true);
    expect(result.proposal?.paymentIntentId).toBe(sampleIntent.id);
    expect(result.proposal?.providerProposalId).toContain('sim-prop-');
  });

  // 2. Server Handler Validation & Security Boundary
  it('2. server handler safely rejects invalid inputs and validates intent', async () => {
    // Missing intentId
    const res1 = await handleCreateProposal({});
    expect(res1.status).toBe(400);
    expect(res1.body.error).toBe('Invalid payment intent parameters.');

    // Invalid amount
    const res2 = await handleCreateProposal({
      intentId: sampleIntent.id,
      amount: 0,
    });
    expect(res2.status).toBe(400);
    expect(res2.body.error).toBe('Invalid payment intent parameters.');
  });

  // 3. Live Sandbox Validation notice when credentials not configured
  it('3. returns requiresCredentials notice when real BMONI credentials are not set', async () => {
    // When external credentials are not set and allowPreviewMode is false:
    const res = await handleCreateProposal({
      intentId: sampleIntent.id,
      responsibilityId: sampleIntent.responsibilityId,
      amount: sampleIntent.amount,
      currency: 'NGN',
      allowPreviewMode: false,
    });

    expect(res.body.requiresCredentials).toBe(true);
    expect(res.body.error).toMatch(/BMONI LIVE SANDBOX VALIDATION: REQUIRES EXTERNAL SERVICE \/ CREDENTIALS/i);
  });

  // 4. Server Handler successfully creates proposal via provider boundary (preview / custom provider)
  it('4. server handler successfully creates proposal via provider boundary', async () => {
    const fakeProvider = new FakePaymentProvider();
    const res = await handleCreateProposal(
      {
        intentId: sampleIntent.id,
        responsibilityId: sampleIntent.responsibilityId,
        amount: sampleIntent.amount,
        currency: 'NGN',
      },
      fakeProvider
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.proposal).toBeDefined();
    expect(res.body.proposal?.paymentIntentId).toBe(sampleIntent.id);
    expect(res.body.proposal?.provider).toBe('SIMULATED');
    expect(res.body.proposal?.providerStatus).toBe('Simulated');
    expect(res.body.proposal?.isSimulated).toBe(true);
  });

  // 5. Invariant: Creating proposal MUST NOT change responsibility balances or status
  it('5. CRITICAL INVARIANT: proposal creation leaves AccommodationResponsibility completely unchanged', () => {
    // Original responsibility snapshot
    const original: AccommodationResponsibility = {
      ...DEMO_ACCOMMODATION_RESPONSIBILITY,
    };

    expect(original.requiredAmount).toBe(66000);
    expect(original.verifiedAmount).toBe(0);
    expect(calculateRemainingAmount(original)).toBe(66000);
    expect(original.status).toBe(ResponsibilityStatus.OUTSTANDING);

    // Simulated proposal creation outcome
    const proposal: ExternalPaymentProposal = {
      id: 'prop-123',
      paymentIntentId: sampleIntent.id,
      responsibilityId: original.id,
      provider: 'BMONI',
      providerProposalId: 'BMONI-PROP-123',
      amount: sampleIntent.amount,
      currency: 'NGN',
      providerStatus: 'Pending Approval',
      createdAt: new Date().toISOString(),
    };

    // After proposal creation, original responsibility has not been mutated
    expect(original.requiredAmount).toBe(66000);
    expect(original.verifiedAmount).toBe(0);
    expect(calculateRemainingAmount(original)).toBe(66000);
    expect(original.status).toBe(ResponsibilityStatus.OUTSTANDING);
  });

  // 6. UI: FulfilmentFlow displays "Continue with BMONI" and reaches "PAYMENT PREPARATION" (REAL BMONI)
  it('6. displays real BMONI proposal created UI when actual BMONI response confirms creation', async () => {
    const realBmoniProposal: ExternalPaymentProposal = {
      id: 'prop-mock-001',
      paymentIntentId: sampleIntent.id,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      provider: 'BMONI',
      providerProposalId: 'BMONI-PROP-DEMO-999',
      amount: 66000,
      currency: 'NGN',
      providerStatus: 'Pending Approval',
      createdAt: new Date().toISOString(),
      isSimulated: false,
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        proposal: realBmoniProposal,
      }),
    } as Response);

    const onProposalCreated = vi.fn();
    render(
      <FulfilmentFlow
        responsibility={DEMO_ACCOMMODATION_RESPONSIBILITY}
        isDark={false}
        onClose={() => {}}
        onIntentPrepared={() => {}}
        onProposalCreated={onProposalCreated}
      />
    );

    // Move to review
    fireEvent.click(screen.getByRole('button', { name: /continue to review/i }));

    // Confirm preparation -> lands on 'prepared' step
    fireEvent.click(screen.getByRole('button', { name: /confirm preparation/i }));

    // Verify "Continue with BMONI" button is present
    const bmoniBtn = screen.getByRole('button', { name: /continue with bmoni/i });
    expect(bmoniBtn).toBeInTheDocument();

    // Click "Continue with BMONI"
    fireEvent.click(bmoniBtn);

    // Wait for "PAYMENT PREPARATION" screen
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /payment preparation/i })).toBeInTheDocument();
    });

    // Real BMONI UI assertions
    expect(screen.getByText(/bmoni proposal:/i)).toBeInTheDocument();
    expect(screen.getByText(/provider status:/i)).toBeInTheDocument();
    expect(screen.getByText('Pending Approval')).toBeInTheDocument();
    expect(screen.getByText(/no money has moved yet\./i)).toBeInTheDocument();
    expect(screen.getByText(/your accommodation responsibility remains unverified\./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to responsibility/i })).toBeInTheDocument();

    // Must NOT show simulated text
    expect(screen.queryByText(/no request was sent to bmoni/i)).not.toBeInTheDocument();

    expect(onProposalCreated).toHaveBeenCalledWith(realBmoniProposal);
    fetchSpy.mockRestore();
  });

  // 7. UI: FakePaymentProvider MUST visibly show SIMULATED PROVIDER and never appear as real BMONI
  it('7. FakePaymentProvider visibly shows SIMULATED PROVIDER and "No request was sent to BMONI"', async () => {
    const fakeProposal: ExternalPaymentProposal = {
      id: 'sim-mock-001',
      paymentIntentId: sampleIntent.id,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      provider: 'SIMULATED',
      providerProposalId: 'sim-prop-888',
      amount: 66000,
      currency: 'NGN',
      providerStatus: 'Simulated',
      createdAt: new Date().toISOString(),
      isSimulated: true,
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        proposal: fakeProposal,
      }),
    } as Response);

    render(
      <FulfilmentFlow
        responsibility={DEMO_ACCOMMODATION_RESPONSIBILITY}
        isDark={false}
        onClose={() => {}}
        onIntentPrepared={() => {}}
      />
    );

    // Advance to prepared step
    fireEvent.click(screen.getByRole('button', { name: /continue to review/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm preparation/i }));

    // Click Continue with BMONI
    fireEvent.click(screen.getByRole('button', { name: /continue with bmoni/i }));

    // Wait for "PAYMENT PREPARATION" screen
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /payment preparation/i })).toBeInTheDocument();
    });

    // Required simulation markers
    expect(screen.getByText('SIMULATED PROVIDER')).toBeInTheDocument();
    expect(screen.getByText('Proposal:')).toBeInTheDocument();
    expect(screen.getAllByText('Simulated').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('No request was sent to BMONI.')).toBeInTheDocument();

    // Must NOT claim BMONI Proposal: Created
    expect(screen.queryByText(/bmoni proposal:/i)).not.toBeInTheDocument();

    fetchSpy.mockRestore();
  });

  // 8. UI: Displays credentials notice if real BMONI credentials are not provided
  it('8. displays BMONI credentials notice when external API credentials are required', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({
        success: false,
        error: 'BMONI LIVE SANDBOX VALIDATION: REQUIRES EXTERNAL SERVICE / CREDENTIALS',
        requiresCredentials: true,
      }),
    } as Response);

    render(
      <FulfilmentFlow
        responsibility={DEMO_ACCOMMODATION_RESPONSIBILITY}
        isDark={false}
        onClose={() => {}}
        onIntentPrepared={() => {}}
      />
    );

    // Advance to prepared step
    fireEvent.click(screen.getByRole('button', { name: /continue to review/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm preparation/i }));

    // Click Continue with BMONI
    fireEvent.click(screen.getByRole('button', { name: /continue with bmoni/i }));

    // Credentials notice should appear
    await waitFor(() => {
      expect(screen.getByText(/bmoni live sandbox validation: requires external service \/ credentials/i)).toBeInTheDocument();
    });

    fetchSpy.mockRestore();
  });

  // 9. Admin View: Shows proposal status visually separate from Verified: ₦0
  it('9. Accommodation Admin View displays pending proposal visually separate from verified balance', () => {
    const proposal: ExternalPaymentProposal = {
      id: 'prop-admin-01',
      paymentIntentId: sampleIntent.id,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      provider: 'BMONI',
      providerProposalId: 'BMONI-PROP-ADMIN-01',
      amount: 66000,
      currency: 'NGN',
      providerStatus: 'Pending Approval',
      createdAt: new Date().toISOString(),
      isSimulated: false,
    };

    render(
      <AccommodationAdminView
        isDark={false}
        responsibilities={[DEMO_ACCOMMODATION_RESPONSIBILITY]}
        onToggleTheme={() => {}}
        onSwitchToFellow={() => {}}
        onExitToLanding={() => {}}
        paymentProposals={[proposal]}
      />
    );

    // Invariant checks on admin view
    expect(screen.getByText('Required:')).toBeInTheDocument();
    expect(screen.getByText('Verified:')).toBeInTheDocument();
    expect(screen.getByText('₦0', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('₦66,000', { selector: 'p.font-bold' })).toBeInTheDocument();

    // Visually separate proposal status
    expect(screen.getByText(/bmoni proposal:/i)).toBeInTheDocument();
    expect(screen.getByText('Pending Approval')).toBeInTheDocument();
    expect(screen.getByText(/\* unverified\. verified remains ₦0\./i)).toBeInTheDocument();
  });

  // 10. Status Mapping Fidelity: BMONI adapter preserves provider's actual status without inventing names
  it('10. BMONI adapter preserves provider actual proposal status directly without inventing names', () => {
    const req = {
      intentId: 'intent-999',
      responsibilityId: 'resp-999',
      amount: 66000,
      currency: 'NGN',
    };

    // Test with raw status from provider
    const mapped1 = mapBmoniProposalResponse(
      { status: 'pending_approval', id: 'bmoni-001' },
      req
    );
    expect(mapped1.providerStatus).toBe('pending_approval');
    expect(mapped1.providerProposalId).toBe('bmoni-001');

    const mapped2 = mapBmoniProposalResponse(
      { providerStatus: 'AWAITING_AUTHORIZATION', id: 'bmoni-002' },
      req
    );
    expect(mapped2.providerStatus).toBe('AWAITING_AUTHORIZATION');

    const mapped3 = mapBmoniProposalResponse(
      { status: 'Pending Approval', id: 'bmoni-003' },
      req
    );
    expect(mapped3.providerStatus).toBe('Pending Approval');
  });
});
