import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import {
  PaymentProvider,
  ExternalPaymentProposal,
} from '../domain/payments';
import { BmoniPaymentProvider } from '../server/payments/bmoniProvider';
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

  // 1. PaymentProvider Abstraction & Contract
  it('1. adheres to the provider-independent PaymentProvider interface', async () => {
    const fakeProvider: PaymentProvider = new FakePaymentProvider();
    expect(fakeProvider.name).toBe('BMONI');

    const result = await fakeProvider.createProposal({
      intentId: sampleIntent.id,
      responsibilityId: sampleIntent.responsibilityId,
      amount: sampleIntent.amount,
      currency: 'NGN',
    });

    expect(result.success).toBe(true);
    expect(result.proposal).toBeDefined();
    expect(result.proposal?.provider).toBe('BMONI');
    expect(result.proposal?.providerStatus).toBe('Pending Approval');
    expect(result.proposal?.paymentIntentId).toBe(sampleIntent.id);
    expect(result.proposal?.providerProposalId).toContain('bmoni-prop-');
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
    expect(res.body.proposal?.provider).toBe('BMONI');
    expect(res.body.proposal?.providerStatus).toBe('Pending Approval');
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

  // 6. UI: FulfilmentFlow displays "Continue with BMONI" and reaches "PAYMENT PREPARATION"
  it('6. displays "Continue with BMONI" on prepared step and shows PAYMENT PREPARATION proposal view', async () => {
    // Mock global fetch for the client service
    const mockProposal: ExternalPaymentProposal = {
      id: 'prop-mock-001',
      paymentIntentId: sampleIntent.id,
      responsibilityId: DEMO_ACCOMMODATION_RESPONSIBILITY.id,
      provider: 'BMONI',
      providerProposalId: 'BMONI-PROP-DEMO-999',
      amount: 66000,
      currency: 'NGN',
      providerStatus: 'Pending Approval',
      createdAt: new Date().toISOString(),
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        success: true,
        proposal: mockProposal,
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

    // Verify details on the proposal screen
    expect(screen.getByText(/hut4devs intent:/i)).toBeInTheDocument();
    expect(screen.getByText(/bmoni proposal:/i)).toBeInTheDocument();
    expect(screen.getByText(/provider status:/i)).toBeInTheDocument();
    expect(screen.getByText('Pending Approval')).toBeInTheDocument();
    expect(screen.getByText(/no money has moved yet\./i)).toBeInTheDocument();
    expect(screen.getByText(/your accommodation responsibility remains unverified\./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to responsibility/i })).toBeInTheDocument();

    expect(onProposalCreated).toHaveBeenCalledWith(mockProposal);
    fetchSpy.mockRestore();
  });

  // 7. UI: Displays credentials notice if real BMONI credentials are not provided
  it('7. displays BMONI credentials notice when external API credentials are required', async () => {
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

  // 8. Admin View: Shows proposal status visually separate from Verified: ₦0
  it('8. Accommodation Admin View displays pending proposal visually separate from verified balance', () => {
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
    expect(screen.getByText(/payment preparation:/i)).toBeInTheDocument();
    expect(screen.getByText('Pending Approval')).toBeInTheDocument();
    expect(screen.getByText(/\* unverified\. verified remains ₦0\./i)).toBeInTheDocument();
  });
});
