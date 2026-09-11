import React, { useState } from 'react';
import {
  AccommodationResponsibility,
  AccommodationPaymentIntent,
  calculateRemainingAmount,
  deriveAccommodationOperationalSummary,
  formatNaira,
  getStatusLabel,
} from '../domain/accommodation';
import { ExternalPaymentProposal } from '../domain/payments';
import { Member } from '../domain/auth';
import { ActiveMode, ScopedRoleAssignment, formatActionAttribution, ACCOMMODATION_PROPERTIES } from '../domain/membership';
import { ModeSwitcher } from './ModeSwitcher';
import { FinancialNotesThread } from './FinancialNotesThread';
import { Hut4DevsLogo } from './Hut4DevsLogo';
import { ThemeToggle } from './ThemeToggle';
import {
  ShieldAlert,
  ArrowRight,
  LogOut,
  Building2,
  Layers,
  DoorClosed,
  User,
  FileText,
  UserCheck,
  Activity,
  Radio,
  Filter,
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export interface AdminProviderEventDisplay {
  id?: string;
  provider: string;
  providerEventId: string;
  eventType: string;
  providerStatus: string;
  providerProposalId?: string | null;
  statusLabel?: string;
  notice?: string;
  receivedAt?: string;
}

interface AccommodationAdminViewProps {
  isDark: boolean;
  responsibilities: AccommodationResponsibility[];
  onToggleTheme: () => void;
  onSwitchToFellow: () => void;
  onExitToLanding: () => void;
  paymentProposals?: ExternalPaymentProposal[];
  preparedIntents?: AccommodationPaymentIntent[];
  providerEvents?: AdminProviderEventDisplay[];
  reconciliations?: any[];
  streamStatus?: 'connecting' | 'connected' | 'error' | 'disconnected';
  onReconcileEvent?: (providerEventId: string) => void;
  currentMember?: Member;
  currentMode?: ActiveMode;
  scopedRoles?: ScopedRoleAssignment[];
  onModeChange?: (mode: ActiveMode) => void;
}

type AttentionFilterType =
  | 'ALL'
  | 'OUTSTANDING'
  | 'PARTIALLY_FULFILLED'
  | 'AWAITING_RECONCILIATION'
  | 'MISMATCH'
  | 'FULFILLED';

export const AccommodationAdminView: React.FC<AccommodationAdminViewProps> = ({
  isDark,
  responsibilities,
  onToggleTheme,
  onSwitchToFellow,
  onExitToLanding,
  paymentProposals = [],
  preparedIntents = [],
  providerEvents = [],
  reconciliations = [],
  streamStatus = 'disconnected',
  onReconcileEvent,
  currentMember,
  currentMode = 'FINANCIAL_ADMIN',
  scopedRoles = [],
  onModeChange,
}) => {
  const summary = deriveAccommodationOperationalSummary(responsibilities);
  const [attentionFilter, setAttentionFilter] = useState<AttentionFilterType>('ALL');
  const [expandedNotesId, setExpandedNotesId] = useState<string | null>(null);

  const attribution = currentMember
    ? formatActionAttribution(currentMember, currentMode)
    : { actingCapacity: 'Accommodation Financial Admin', displayLabel: 'Chief Financial Admin' };

  // Calculate counts for attention filters
  const hasAwaitingReconciliation = (respId: string) =>
    providerEvents.some(
      (evt) =>
        evt.providerStatus === 'COMPLETED' &&
        !reconciliations.some((r) => r.providerEventId === evt.providerEventId)
    );

  const hasMismatch = (respId: string) =>
    reconciliations.some(
      (r) => r.reconciliationStatus === 'MISMATCH'
    );

  const filteredResponsibilities = responsibilities.filter((resp) => {
    if (attentionFilter === 'ALL') return true;
    if (attentionFilter === 'OUTSTANDING') return resp.status === 'OUTSTANDING';
    if (attentionFilter === 'PARTIALLY_FULFILLED') return resp.status === 'PARTIALLY_FULFILLED';
    if (attentionFilter === 'FULFILLED') return resp.status === 'FULFILLED';
    if (attentionFilter === 'AWAITING_RECONCILIATION') return hasAwaitingReconciliation(resp.id);
    if (attentionFilter === 'MISMATCH') return hasMismatch(resp.id);
    return true;
  });

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-[#2F1707] text-[#FFF9EE]' : 'bg-[#F7F1E7] text-[#5A2D0C]'
      }`}
    >
      {/* Dev Preview Banner */}
      <aside
        aria-label="Development Preview Notice"
        className="w-full border-b px-4 py-2.5 text-xs transition-colors duration-200"
        style={{
          backgroundColor: isDark ? '#3A1E0B' : '#F2E8D8',
          borderColor: isDark ? '#4B2710' : '#E7D6C1',
          color: isDark ? '#E2AB5D' : '#8A5D3B',
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs">
            <span
              className="px-2 py-0.5 rounded font-semibold uppercase tracking-wider text-[10px]"
              style={{
                backgroundColor: isDark ? '#4B2710' : '#EAE0D0',
                color: isDark ? '#C88D3A' : '#5A2D0C',
              }}
            >
              Development Preview
            </span>
            <span>
              Development Preview &bull; No authentication or authorization is claimed. Acting Capacity: <strong>{attribution.actingCapacity}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span
                id="realtime-sse-indicator"
                className={`w-2 h-2 rounded-full ${
                  streamStatus === 'connected'
                    ? 'bg-emerald-500 animate-pulse'
                    : streamStatus === 'connecting'
                    ? 'bg-amber-500'
                    : 'bg-stone-400'
                }`}
              />
              <span className="capitalize">Live Stream: {streamStatus}</span>
            </div>
            <button
              type="button"
              id="admin-switch-to-fellow-banner-btn"
              onClick={onSwitchToFellow}
              className={`self-start sm:self-auto font-medium underline underline-offset-2 cursor-pointer hover:opacity-80 transition-opacity text-xs ${
                isDark ? 'text-[#C88D3A]' : 'text-[#B77620]'
              }`}
            >
              Switch to Fellow View →
            </button>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header
        className="sticky top-0 z-30 w-full border-b transition-colors duration-200"
        style={{
          borderColor: isDark ? '#3E200C' : '#EAE0D0',
          backgroundColor: isDark ? 'rgba(47, 23, 7, 0.92)' : 'rgba(247, 241, 231, 0.92)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onExitToLanding}
              className="inline-flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C88D3A] rounded-lg cursor-pointer"
              title="Return to Public Landing"
            >
              <Hut4DevsLogo isDark={isDark} size="sm" showWordmark={true} />
            </button>

            {currentMember && onModeChange && (
              <ModeSwitcher
                member={currentMember}
                scopedRoles={scopedRoles}
                currentMode={currentMode}
                onModeChange={onModeChange}
              />
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            <button
              type="button"
              onClick={onExitToLanding}
              className="p-2 text-[#5A2D0C]/70 hover:text-[#5A2D0C] rounded-lg transition-colors cursor-pointer"
              title="Exit to Landing"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-2">
          <span
            className="text-xs sm:text-sm font-semibold uppercase tracking-wider block"
            style={{ color: isDark ? '#C88D3A' : '#B77620' }}
          >
            Command Center &bull; Attention-First Financial Accountability
          </span>
        </div>

        <h1
          id="accommodation-admin-title"
          className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-6"
          style={{ color: isDark ? '#FFF9EE' : '#5A2D0C' }}
        >
          Accommodation Admin
        </h1>

        {/* Multi-Property Contextual Rates */}
        <section
          aria-labelledby="properties-rates-heading"
          className="mb-6 bg-white/40 border border-[#C88D3A]/25 rounded-2xl p-4 sm:p-5 shadow-xs"
        >
          <div className="flex items-center justify-between mb-3 border-b border-[#5A2D0C]/10 pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#C88D3A]" />
              <h2
                id="properties-rates-heading"
                className="text-xs font-bold uppercase tracking-wider text-[#5A2D0C]"
              >
                Accredited Property Commitments (Multi-Property Architecture)
              </h2>
            </div>
            <span className="text-[10px] text-[#5A2D0C]/60 font-mono">
              Rates Vary By Property Scope
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {ACCOMMODATION_PROPERTIES.map((prop) => (
              <div
                key={prop.id}
                className="p-3 bg-[#FFF9EE] border border-[#C88D3A]/20 rounded-xl flex flex-col justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#5A2D0C]">{prop.name}</div>
                  <div className="text-[10px] text-[#5A2D0C]/60 mt-0.5">{prop.location}</div>
                </div>
                <div className="mt-2 pt-2 border-t border-[#5A2D0C]/10 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-[#5A2D0C]/60">Required</span>
                  <span className="font-extrabold text-[#B77620]">
                    ₦{prop.monthlyCommitment.toLocaleString()}/mo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Operational Summary Grid (Required Test Selectors) */}
        <section
          aria-labelledby="operational-summary-heading"
          className="rounded-2xl p-5 sm:p-7 border mb-6 transition-colors duration-200"
          style={{
            backgroundColor: isDark ? '#3E200C' : '#FFF9EE',
            borderColor: isDark ? '#623416' : '#EAE0D0',
          }}
        >
          <div
            className="flex items-center justify-between border-b pb-4 mb-5"
            style={{ borderColor: isDark ? '#4B2710' : '#EAE0D0' }}
          >
            <h2
              id="operational-summary-heading"
              className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
              style={{ color: isDark ? '#A67B54' : '#8A5D3B' }}
            >
              Operational Summary
            </h2>
            <span
              className="text-[11px] font-mono uppercase px-2 py-0.5 rounded"
              style={{
                backgroundColor: isDark ? '#2F1707' : '#F7F1E7',
                color: isDark ? '#C88D3A' : '#B77620',
              }}
            >
              Derived
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div
              id="summary-properties-count"
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: isDark ? '#2F1707' : '#F7F1E7',
                borderColor: isDark ? '#4B2710' : '#E7D6C1',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Building2 className="w-4 h-4 shrink-0 text-[#C88D3A]" aria-hidden="true" />
                <span className="text-xs font-medium text-stone-600">Properties</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-[#5A2D0C]">
                Properties: {summary.propertiesCount}
              </p>
            </div>

            <div
              id="summary-rooms-count"
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: isDark ? '#2F1707' : '#F7F1E7',
                borderColor: isDark ? '#4B2710' : '#E7D6C1',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <DoorClosed className="w-4 h-4 shrink-0 text-[#C88D3A]" aria-hidden="true" />
                <span className="text-xs font-medium text-stone-600">Rooms represented</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-[#5A2D0C]">
                Rooms represented: {summary.roomsRepresentedCount}
              </p>
            </div>

            <div
              id="summary-fellows-count"
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: isDark ? '#2F1707' : '#F7F1E7',
                borderColor: isDark ? '#4B2710' : '#E7D6C1',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <User className="w-4 h-4 shrink-0 text-[#C88D3A]" aria-hidden="true" />
                <span className="text-xs font-medium text-stone-600">Fellows represented</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-[#5A2D0C]">
                Fellows represented: {summary.fellowsRepresentedCount}
              </p>
            </div>

            <div
              id="summary-outstanding-count"
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: isDark ? '#2F1707' : '#F7F1E7',
                borderColor: isDark ? '#4B2710' : '#E7D6C1',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <FileText className="w-4 h-4 shrink-0 text-[#C88D3A]" aria-hidden="true" />
                <span className="text-xs font-medium text-stone-600">Outstanding responsibilities</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-[#B77620]">
                Outstanding responsibilities: {summary.outstandingResponsibilitiesCount}
              </p>
            </div>
          </div>
        </section>

        {/* Attention-First Filter Bar */}
        <section className="mb-6 bg-white border border-[#5A2D0C]/15 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#5A2D0C]/10 pb-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#C88D3A]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A2D0C]">
                Attention Queue Filter
              </h3>
            </div>
            <span className="text-[11px] text-[#5A2D0C]/70">
              Showing {filteredResponsibilities.length} of {responsibilities.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              id="filter-attention-all"
              type="button"
              onClick={() => setAttentionFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                attentionFilter === 'ALL'
                  ? 'bg-[#5A2D0C] text-[#FFF9EE] border-[#5A2D0C]'
                  : 'bg-[#F7F1E7] text-[#5A2D0C] border-[#5A2D0C]/15 hover:border-[#C88D3A]'
              }`}
            >
              All Records ({responsibilities.length})
            </button>

            <button
              id="filter-attention-outstanding"
              type="button"
              onClick={() => setAttentionFilter('OUTSTANDING')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                attentionFilter === 'OUTSTANDING'
                  ? 'bg-[#B77620] text-white border-[#B77620]'
                  : 'bg-[#FFF9EE] text-[#B77620] border-[#B77620]/30 hover:border-[#B77620]'
              }`}
            >
              Outstanding ({responsibilities.filter((r) => r.status === 'OUTSTANDING').length})
            </button>

            <button
              id="filter-attention-partially-fulfilled"
              type="button"
              onClick={() => setAttentionFilter('PARTIALLY_FULFILLED')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                attentionFilter === 'PARTIALLY_FULFILLED'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:border-amber-500'
              }`}
            >
              Partially Fulfilled ({responsibilities.filter((r) => r.status === 'PARTIALLY_FULFILLED').length})
            </button>

            <button
              id="filter-attention-awaiting-reconciliation"
              type="button"
              onClick={() => setAttentionFilter('AWAITING_RECONCILIATION')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                attentionFilter === 'AWAITING_RECONCILIATION'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-blue-50 text-blue-800 border-blue-300 hover:border-blue-500'
              }`}
            >
              Awaiting Reconciliation (
              {providerEvents.filter((e) => e.providerStatus === 'COMPLETED').length} events)
            </button>

            <button
              id="filter-attention-mismatch"
              type="button"
              onClick={() => setAttentionFilter('MISMATCH')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                attentionFilter === 'MISMATCH'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-red-50 text-red-800 border-red-300 hover:border-red-500'
              }`}
            >
              Mismatch / Requires Review (
              {reconciliations.filter((r) => r.reconciliationStatus === 'MISMATCH').length})
            </button>

            <button
              id="filter-attention-fulfilled"
              type="button"
              onClick={() => setAttentionFilter('FULFILLED')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                attentionFilter === 'FULFILLED'
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:border-emerald-500'
              }`}
            >
              Fulfilled ({responsibilities.filter((r) => r.status === 'FULFILLED').length})
            </button>
          </div>
        </section>

        {/* Accommodation Allocations List */}
        <section aria-labelledby="allocations-heading" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2
              id="allocations-heading"
              className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
              style={{ color: isDark ? '#A67B54' : '#8A5D3B' }}
            >
              Accommodation Allocation &amp; Operational Records
            </h2>
            <span className="text-xs text-stone-500 font-mono">
              {filteredResponsibilities.length} Record{filteredResponsibilities.length === 1 ? '' : 's'}
            </span>
          </div>

          {filteredResponsibilities.map((resp) => {
            const remaining = calculateRemainingAmount(resp);
            const statusLabel = getStatusLabel(resp.status);
            const isNotesExpanded = expandedNotesId === resp.id;

            return (
              <article
                key={resp.id}
                id={`admin-record-${resp.id}`}
                className="rounded-2xl p-6 sm:p-8 border transition-colors duration-200"
                style={{
                  backgroundColor: isDark ? '#3E200C' : '#FFF9EE',
                  borderColor: isDark ? '#623416' : '#EAE0D0',
                }}
              >
                {/* Structural Hierarchy: Property → Floor → Room → Fellow → Responsibility */}
                <div className="mb-6">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider block mb-3"
                    style={{ color: isDark ? '#C88D3A' : '#B77620' }}
                  >
                    Allocation Hierarchy
                  </span>

                  <div
                    className="rounded-xl p-4 sm:p-5 border font-mono text-sm leading-relaxed"
                    style={{
                      backgroundColor: isDark ? '#2F1707' : '#F7F1E7',
                      borderColor: isDark ? '#4B2710' : '#E7D6C1',
                    }}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <Building2 className="w-4 h-4 shrink-0 text-[#C88D3A]" aria-hidden="true" />
                      <span style={{ color: isDark ? '#FFF9EE' : '#5A2D0C' }}>
                        {resp.accommodationContext.property.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pl-4 pt-1">
                      <span style={{ color: isDark ? '#C88D3A' : '#B77620' }}>→</span>
                      <Layers className="w-3.5 h-3.5 shrink-0 opacity-70" aria-hidden="true" />
                      <span style={{ color: isDark ? '#D9C4AC' : '#704728' }}>
                        {resp.accommodationContext.floor.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pl-8 pt-1">
                      <span style={{ color: isDark ? '#C88D3A' : '#B77620' }}>→</span>
                      <DoorClosed className="w-3.5 h-3.5 shrink-0 opacity-70" aria-hidden="true" />
                      <span style={{ color: isDark ? '#D9C4AC' : '#704728' }}>
                        {resp.accommodationContext.room.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pl-12 pt-1 font-medium">
                      <span style={{ color: isDark ? '#C88D3A' : '#B77620' }}>→</span>
                      <User className="w-3.5 h-3.5 shrink-0 opacity-70" aria-hidden="true" />
                      <span style={{ color: isDark ? '#FFF9EE' : '#5A2D0C' }}>
                        {resp.fellow.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pl-16 pt-1 font-bold">
                      <span style={{ color: isDark ? '#C88D3A' : '#B77620' }}>→</span>
                      <FileText className="w-3.5 h-3.5 shrink-0 text-[#C88D3A]" aria-hidden="true" />
                      <span style={{ color: isDark ? '#E2AB5D' : '#B77620' }}>
                        {resp.title}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial State Breakdown */}
                <div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border mb-6"
                  style={{
                    backgroundColor: isDark ? '#2F1707' : '#F7F1E7',
                    borderColor: isDark ? '#4B2710' : '#E7D6C1',
                  }}
                >
                  <div>
                    <span className="text-xs block mb-1 text-stone-600">Required:</span>
                    <p className="text-base sm:text-lg font-semibold text-[#5A2D0C]">
                      {formatNaira(resp.requiredAmount)}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs block mb-1 text-stone-600">Verified:</span>
                    <p className="text-base sm:text-lg font-medium text-[#704728]">
                      {formatNaira(resp.verifiedAmount)}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs block mb-1 font-medium text-[#B77620]">Remaining:</span>
                    <p className="text-base sm:text-lg font-bold text-[#B77620]">
                      {formatNaira(remaining)}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs block mb-1 text-stone-600">Status:</span>
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-[#F7F1E7] text-[#B77620] border border-[#E7D6C1]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-[#B77620]" />
                      {statusLabel}
                    </span>
                  </div>
                </div>

                {/* Real-Time Operational Payment Preparation Activity */}
                {preparedIntents.some((i) => i.responsibilityId === resp.id) && (
                  <div
                    id={`admin-payment-preparations-${resp.id}`}
                    className="mb-4 p-4 rounded-xl border bg-[#F9F5EE] border-[#E7D6C1]"
                  >
                    <div className="flex items-center justify-between border-b pb-2.5 mb-3 border-[#EAE0D0]">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#C88D3A]" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A5D3B]">
                          Operational Activity: Payment Preparation
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase bg-amber-500/10 text-amber-700 border border-amber-500/20">
                        Live Broadcast
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {preparedIntents
                        .filter((i) => i.responsibilityId === resp.id)
                        .map((intent) => (
                          <div
                            key={intent.id}
                            id={`admin-prep-intent-${intent.id}`}
                            className="p-3 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs bg-[#FFF9EE] border-[#E7D6C1]"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm text-[#5A2D0C]">
                                  Payment Preparation
                                </span>
                                <span className="text-stone-400">&bull;</span>
                                <span className="font-medium text-[#5A2D0C]">
                                  {resp.fellow?.name || 'Current Fellow'}
                                </span>
                              </div>
                              <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span>{resp.title || 'September Accommodation'}</span>
                                <span>&bull;</span>
                                <span>
                                  Amount: <strong className="font-bold text-[#5A2D0C]">{formatNaira(intent.amount)}</strong>
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col sm:items-end gap-1">
                              <span
                                id="admin-intent-status-badge"
                                className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-xs bg-[#FEF3C7] border-[#FCD34D] text-[#B45309]"
                              >
                                Status: Prepared — Not Verified
                              </span>
                              <span className="text-[10px] italic text-stone-500">
                                * Unverified intent. Verified amount remains {formatNaira(resp.verifiedAmount)}.
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Proposal status if present */}
                {paymentProposals.some((p) => p.responsibilityId === resp.id) && (() => {
                  const proposal = paymentProposals.find((p) => p.responsibilityId === resp.id);
                  const isSim = proposal?.isSimulated || proposal?.provider === 'SIMULATED';
                  return (
                    <div
                      id={`admin-payment-prep-${resp.id}`}
                      className="mb-4 p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs bg-[#F9F5EE] border-[#E7D6C1]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold uppercase tracking-wider text-[11px] text-[#B77620]">
                          {isSim ? 'SIMULATED PROVIDER:' : 'BMONI Proposal:'}
                        </span>
                        <span className="px-2 py-0.5 rounded font-mono font-semibold text-[11px] border bg-[#FEF3C7] border-[#FCD34D] text-[#B45309]">
                          {isSim ? 'Proposal: Simulated' : (proposal?.providerStatus || 'Pending Approval')}
                        </span>
                      </div>
                      <span className="text-stone-500 italic text-[11px]">
                        {isSim ? 'No request was sent to BMONI. * Unverified.' : `* Unverified. Verified remains ${formatNaira(resp.verifiedAmount)}.`}
                      </span>
                    </div>
                  );
                })()}

                {/* Contextual Financial Notes Toggle & Section */}
                <div className="mt-4 pt-4 border-t border-[#5A2D0C]/10 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      id={`btn-toggle-notes-${resp.id}`}
                      onClick={() => setExpandedNotesId(isNotesExpanded ? null : resp.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A2D0C] hover:text-[#B77620] transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#C88D3A]" />
                      <span>{isNotesExpanded ? 'Close Financial Notes' : 'Contextual Financial Notes & Inquiries'}</span>
                    </button>
                    <span className="text-[11px] text-stone-500 font-mono">
                      Period: {resp.period || 'Current'}
                    </span>
                  </div>

                  {isNotesExpanded && currentMember && (
                    <div className="mt-2">
                      <FinancialNotesThread
                        responsibilityId={resp.id}
                        currentMember={currentMember}
                        activeMode={currentMode}
                        isDark={isDark}
                      />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        {/* Provider Event Store Operational Audit (H4D-FUNC-012) */}
        {providerEvents && providerEvents.length > 0 && (
          <div
            id="admin-provider-events-section"
            className="mt-6 p-4 rounded-xl border flex flex-col gap-3 text-xs bg-[#F9F5EE] border-[#E7D6C1]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold uppercase tracking-wider text-[11px] text-[#B77620]">
                  Provider Ingestion Audit &bull; Provider Events Received
                </span>
              </div>
              <span className="font-mono text-[10px] text-stone-500">
                Total Ingested: {providerEvents.length} (Authoritative PostgreSQL Store)
              </span>
            </div>
            <div className="space-y-2 mt-1">
              {providerEvents.map((evt, idx) => (
                <div
                  key={evt.id || evt.providerEventId || idx}
                  id={`admin-provider-event-${evt.providerEventId || idx}`}
                  className="p-3 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#FFFDF9] border-[#EAE0D0]"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                      <span className="font-semibold text-[#5A2D0C]">
                        Provider: {evt.provider}
                      </span>
                      <span className="text-stone-400">&bull;</span>
                      <span className="text-stone-500">Event: {evt.eventType}</span>
                      <span className="text-stone-400">&bull;</span>
                      <span className="text-stone-400 text-[10px]">ID: {evt.providerEventId}</span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Provider Status: <strong className="font-semibold">{evt.providerStatus}</strong>
                      {evt.providerProposalId && (
                        <span> &bull; Proposal: {evt.providerProposalId}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1">
                    {(() => {
                      const rec = reconciliations.find((r) => r.providerEventId === evt.providerEventId);
                      if (rec && rec.reconciliationStatus === 'VERIFIED') {
                        return (
                          <span className="px-2 py-0.5 rounded font-mono font-semibold text-[10px] border uppercase bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]">
                            Status: Verified &bull; Reconciled ({formatNaira(rec.amount)})
                          </span>
                        );
                      }
                      if (rec && rec.reconciliationStatus === 'MISMATCH') {
                        return (
                          <span className="px-2 py-0.5 rounded font-mono font-semibold text-[10px] border uppercase bg-[#FEF2F2] border-[#FCA5A5] text-[#B91C1C]">
                            Status: Requires Review &bull; {rec.reasonCode}
                          </span>
                        );
                      }
                      return (
                        <>
                          <span
                            id="admin-provider-event-status-badge"
                            className="px-2 py-0.5 rounded font-mono font-semibold text-[10px] border uppercase bg-[#FEF3C7] border-[#FCD34D] text-[#B45309]"
                          >
                            Status: Received — Awaiting Reconciliation
                          </span>
                          {onReconcileEvent && (
                            <button
                              type="button"
                              onClick={() => onReconcileEvent(evt.providerEventId)}
                              className="mt-1 px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors bg-[#F2E8D8] border-[#B77620] text-[#5A2D0C]"
                            >
                              Trigger Reconcile
                            </button>
                          )}
                        </>
                      );
                    })()}
                    <span className="text-[10px] italic text-stone-500">
                      * Provider event received. Not verified. Awaiting reconciliation.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Authoritative Payment Reconciliations Audit (H4D-FUNC-013) */}
        {reconciliations && reconciliations.length > 0 && (
          <div
            id="admin-reconciliations-section"
            className="mt-6 p-4 rounded-xl border flex flex-col gap-3 text-xs bg-[#F9F5EE] border-[#E7D6C1]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-semibold uppercase tracking-wider text-[11px] text-[#B77620]">
                  Authoritative Payment Reconciliations &bull; Evidence Chain Audit
                </span>
              </div>
              <span className="font-mono text-[10px] text-stone-500">
                Total Reconciled Records: {reconciliations.length}
              </span>
            </div>
            <div className="space-y-2 mt-1">
              {reconciliations.map((rec, idx) => (
                <div
                  key={rec.id || idx}
                  id={`admin-reconciliation-${rec.id || idx}`}
                  className="p-3 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#FFFDF9] border-[#EAE0D0]"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                      <span className="font-semibold text-[#5A2D0C]">
                        Amount: {formatNaira(rec.amount)}
                      </span>
                      <span className="text-stone-400">&bull;</span>
                      <span className="text-stone-500">Provider: {rec.provider}</span>
                      <span className="text-stone-400">&bull;</span>
                      <span className="text-stone-400 text-[10px]">Event ID: {rec.providerEventId}</span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Reason: <strong className="font-semibold">{rec.reasonCode}</strong>
                      {rec.reconciledAt && <span> &bull; Verified At: {new Date(rec.reconciledAt).toLocaleString()}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-semibold text-[10px] border uppercase ${
                        rec.reconciliationStatus === 'VERIFIED'
                          ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]'
                          : 'bg-[#FEF2F2] border-[#FCA5A5] text-[#B91C1C]'
                      }`}
                    >
                      Status: {rec.reconciliationStatus === 'VERIFIED' ? 'VERIFIED' : 'Requires Review'}
                    </span>
                    <span className="text-[10px] italic text-stone-500">
                      {rec.reconciliationStatus === 'VERIFIED'
                        ? 'Evidence Chain Matched & Reconciled Atomically.'
                        : 'Financial State: Unchanged. Requires Administrative Review.'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className="w-full py-5 text-center text-xs tracking-wider uppercase border-t transition-colors duration-200 mt-auto"
        style={{
          borderColor: isDark ? '#3E200C' : '#EAE0D0',
          color: isDark ? '#A67B54' : '#8A5D3B',
        }}
      >
        <p>Hut4Devs Accommodation Admin &bull; Operational Command Center</p>
      </footer>
    </div>
  );
};
