import React from 'react';
import {
  AccommodationResponsibility,
  calculateRemainingAmount,
  deriveAccommodationOperationalSummary,
  formatNaira,
  getStatusLabel,
} from '../domain/accommodation';
import { ExternalPaymentProposal } from '../domain/payments';
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
} from 'lucide-react';

interface AccommodationAdminViewProps {
  isDark: boolean;
  responsibilities: AccommodationResponsibility[];
  onToggleTheme: () => void;
  onSwitchToFellow: () => void;
  onExitToLanding: () => void;
  paymentProposals?: ExternalPaymentProposal[];
}

export const AccommodationAdminView: React.FC<AccommodationAdminViewProps> = ({
  isDark,
  responsibilities,
  onToggleTheme,
  onSwitchToFellow,
  onExitToLanding,
  paymentProposals = [],
}) => {
  const summary = deriveAccommodationOperationalSummary(responsibilities);

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
            <span>Read-Only Admin Workspace &bull; No authentication or authorization is claimed or enforced</span>
          </div>
          <button
            type="button"
            id="admin-switch-to-fellow-banner-btn"
            onClick={onSwitchToFellow}
            className={`self-start sm:self-auto font-medium underline underline-offset-2 cursor-pointer hover:opacity-80 transition-opacity text-xs ${
              isDark ? 'text-[#C88D3A]' : 'text-[#B77620]'
            }`}
          >
            ← Switch to Fellow View
          </button>
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
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={onExitToLanding}
              className="inline-flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C88D3A] rounded-lg cursor-pointer"
              title="Return to Public Landing"
            >
              <Hut4DevsLogo isDark={isDark} size="sm" showWordmark={true} />
            </button>

            {/* View Mode Tag */}
            <span
              className="hidden xs:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide border"
              style={{
                backgroundColor: isDark ? '#3E200C' : '#FFF9EE',
                borderColor: isDark ? '#623416' : '#EAE0D0',
                color: isDark ? '#C88D3A' : '#B77620',
              }}
            >
              <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Admin Workspace</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

            <button
              type="button"
              id="admin-switch-to-fellow-btn"
              onClick={onSwitchToFellow}
              aria-label="Switch to Fellow View"
              className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C88D3A] ${
                isDark
                  ? 'bg-[#3E200C] text-[#C88D3A] hover:bg-[#4B2710] border border-[#623416]'
                  : 'bg-[#FFF9EE] text-[#5A2D0C] hover:bg-[#F2E8D8] border border-[#EAE0D0]'
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Fellow View</span>
            </button>

            <button
              type="button"
              id="admin-exit-landing-btn"
              onClick={onExitToLanding}
              aria-label="Exit to public landing"
              className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C88D3A] ${
                isDark
                  ? 'text-[#E5D3BA] hover:text-[#FFF9EE] hover:bg-[#3E200C]'
                  : 'text-[#6D4223] hover:text-[#5A2D0C] hover:bg-[#EFE5D5]'
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Landing</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb / Title */}
        <div className="mb-2">
          <span
            className="text-xs sm:text-sm font-semibold uppercase tracking-wider block"
            style={{ color: isDark ? '#C88D3A' : '#B77620' }}
          >
            Command Center &bull; Operational Read View
          </span>
        </div>

        <h1
          id="accommodation-admin-title"
          className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-8"
          style={{ color: isDark ? '#FFF9EE' : '#5A2D0C' }}
        >
          Accommodation Admin
        </h1>

        {/* Operational Summary Grid */}
        <section
          aria-labelledby="operational-summary-heading"
          className="rounded-2xl p-5 sm:p-7 border mb-8 transition-colors duration-200"
          style={{
            backgroundColor: isDark ? '#3E200C' : '#FFF9EE',
            borderColor: isDark ? '#623416' : '#EAE0D0',
          }}
        >
          <div className="flex items-center justify-between border-b pb-4 mb-5"
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
            {/* Properties: 1 */}
            <div
              id="summary-properties-count"
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: isDark ? '#2F1707' : '#F7F1E7',
                borderColor: isDark ? '#4B2710' : '#E7D6C1',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Building2
                  className="w-4 h-4 shrink-0"
                  style={{ color: isDark ? '#C88D3A' : '#B77620' }}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium" style={{ color: isDark ? '#A67B54' : '#8A5D3B' }}>
                  Properties
                </span>
              </div>
              <p
                className="text-lg sm:text-2xl font-bold"
                style={{ color: isDark ? '#FFF9EE' : '#5A2D0C' }}
              >
                Properties: {summary.propertiesCount}
              </p>
            </div>

            {/* Rooms represented: 1 */}
            <div
              id="summary-rooms-count"
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: isDark ? '#2F1707' : '#F7F1E7',
                borderColor: isDark ? '#4B2710' : '#E7D6C1',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <DoorClosed
                  className="w-4 h-4 shrink-0"
                  style={{ color: isDark ? '#C88D3A' : '#B77620' }}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium" style={{ color: isDark ? '#A67B54' : '#8A5D3B' }}>
                  Rooms represented
                </span>
              </div>
              <p
                className="text-lg sm:text-2xl font-bold"
                style={{ color: isDark ? '#FFF9EE' : '#5A2D0C' }}
              >
                Rooms represented: {summary.roomsRepresentedCount}
              </p>
            </div>

            {/* Fellows represented: 1 */}
            <div
              id="summary-fellows-count"
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: isDark ? '#2F1707' : '#F7F1E7',
                borderColor: isDark ? '#4B2710' : '#E7D6C1',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <User
                  className="w-4 h-4 shrink-0"
                  style={{ color: isDark ? '#C88D3A' : '#B77620' }}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium" style={{ color: isDark ? '#A67B54' : '#8A5D3B' }}>
                  Fellows represented
                </span>
              </div>
              <p
                className="text-lg sm:text-2xl font-bold"
                style={{ color: isDark ? '#FFF9EE' : '#5A2D0C' }}
              >
                Fellows represented: {summary.fellowsRepresentedCount}
              </p>
            </div>

            {/* Outstanding responsibilities: 1 */}
            <div
              id="summary-outstanding-count"
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: isDark ? '#2F1707' : '#F7F1E7',
                borderColor: isDark ? '#4B2710' : '#E7D6C1',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <FileText
                  className="w-4 h-4 shrink-0"
                  style={{ color: isDark ? '#C88D3A' : '#B77620' }}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium" style={{ color: isDark ? '#A67B54' : '#8A5D3B' }}>
                  Outstanding responsibilities
                </span>
              </div>
              <p
                className="text-lg sm:text-2xl font-bold"
                style={{ color: isDark ? '#E2AB5D' : '#B77620' }}
              >
                Outstanding responsibilities: {summary.outstandingResponsibilitiesCount}
              </p>
            </div>
          </div>
        </section>

        {/* Accommodation Allocations List */}
        <section
          aria-labelledby="allocations-heading"
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2
              id="allocations-heading"
              className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
              style={{ color: isDark ? '#A67B54' : '#8A5D3B' }}
            >
              Accommodation Allocation &amp; Operational Records
            </h2>
            <span className="text-xs text-stone-500 font-mono">
              {responsibilities.length} Record{responsibilities.length === 1 ? '' : 's'}
            </span>
          </div>

          {responsibilities.map((resp) => {
            const remaining = calculateRemainingAmount(resp);
            const statusLabel = getStatusLabel(resp.status);

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

                  {/* Visual Stepped Hierarchy Chain */}
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
                  {/* Required: ₦66,000 */}
                  <div>
                    <span className="text-xs block mb-1" style={{ color: isDark ? '#A67B54' : '#8A5D3B' }}>
                      Required:
                    </span>
                    <p
                      className="text-base sm:text-lg font-semibold"
                      style={{ color: isDark ? '#FFF9EE' : '#5A2D0C' }}
                    >
                      {formatNaira(resp.requiredAmount)}
                    </p>
                  </div>

                  {/* Verified: ₦0 */}
                  <div>
                    <span className="text-xs block mb-1" style={{ color: isDark ? '#A67B54' : '#8A5D3B' }}>
                      Verified:
                    </span>
                    <p
                      className="text-base sm:text-lg font-medium"
                      style={{ color: isDark ? '#D9C4AC' : '#704728' }}
                    >
                      {formatNaira(resp.verifiedAmount)}
                    </p>
                  </div>

                  {/* Remaining: ₦66,000 */}
                  <div>
                    <span className="text-xs block mb-1 font-medium" style={{ color: isDark ? '#C88D3A' : '#B77620' }}>
                      Remaining:
                    </span>
                    <p
                      className="text-base sm:text-lg font-bold"
                      style={{ color: isDark ? '#E2AB5D' : '#B77620' }}
                    >
                      {formatNaira(remaining)}
                    </p>
                  </div>

                  {/* Status: Outstanding */}
                  <div>
                    <span className="text-xs block mb-1" style={{ color: isDark ? '#A67B54' : '#8A5D3B' }}>
                      Status:
                    </span>
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
                      style={{
                        backgroundColor: isDark ? '#4B2710' : '#F7F1E7',
                        color: isDark ? '#E2AB5D' : '#B77620',
                        border: `1px solid ${isDark ? '#623416' : '#E7D6C1'}`,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mr-1.5"
                        style={{ backgroundColor: isDark ? '#C88D3A' : '#B77620' }}
                        aria-hidden="true"
                      />
                      {statusLabel}
                    </span>
                  </div>
                </div>

                {/* Visually Separate Payment Preparation Status (if proposal exists) */}
                {paymentProposals.some((p) => p.responsibilityId === resp.id) && (
                  <div
                    id={`admin-payment-prep-${resp.id}`}
                    className="mb-4 p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                    style={{
                      backgroundColor: isDark ? '#2A170A' : '#F9F5EE',
                      borderColor: isDark ? '#4B2710' : '#E7D6C1',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold uppercase tracking-wider text-[11px]" style={{ color: isDark ? '#C88D3A' : '#B77620' }}>
                        Payment preparation:
                      </span>
                      <span
                        className="px-2 py-0.5 rounded font-mono font-semibold text-[11px] border"
                        style={{
                          backgroundColor: isDark ? '#3A2810' : '#FEF3C7',
                          borderColor: isDark ? '#6B4C1B' : '#FCD34D',
                          color: isDark ? '#F59E0B' : '#B45309',
                        }}
                      >
                        Pending Approval
                      </span>
                    </div>
                    <span className="text-stone-500 italic text-[11px]">
                      * Unverified. Verified remains {formatNaira(resp.verifiedAmount)}.
                    </span>
                  </div>
                )}

                {/* Explicit Read-Only Notice */}
                <div
                  className="flex items-center justify-between text-xs px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: isDark ? '#2F1707' : '#F7F1E7',
                    color: isDark ? '#A67B54' : '#8A5D3B',
                  }}
                >
                  <span>Operational Status: Read-Only Record</span>
                  <span className="font-mono text-[11px]">Period: {resp.period || 'Current'}</span>
                </div>
              </article>
            );
          })}
        </section>

        {/* Privacy & Scope Notice */}
        <div
          className="mt-8 p-4 rounded-xl border text-xs leading-relaxed"
          style={{
            backgroundColor: isDark ? '#3A1E0B' : '#F2E8D8',
            borderColor: isDark ? '#4B2710' : '#E7D6C1',
            color: isDark ? '#D9C4AC' : '#704728',
          }}
        >
          <p className="font-semibold mb-1" style={{ color: isDark ? '#E2AB5D' : '#5A2D0C' }}>
            Operational Scope &amp; Privacy Boundary:
          </p>
          <p>
            This workspace strictly presents accommodation-operational allocation and responsibility state.
            Unrelated financial activities, personal member records, and non-operational information are excluded. All operational records are read-only.
          </p>
        </div>
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
