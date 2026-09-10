import React, { useState } from 'react';
import { Hut4DevsLogo } from './Hut4DevsLogo';
import { ThemeToggle } from './ThemeToggle';
import { AccommodationResponsibilityCard } from './AccommodationResponsibilityCard';
import { AccommodationResponsibility } from '../domain/accommodation';
import { Member } from '../domain/auth';
import { ActiveMode, ScopedRoleAssignment, formatActionAttribution } from '../domain/membership';
import { ModeSwitcher } from './ModeSwitcher';
import { FinancialNotesThread } from './FinancialNotesThread';
import { LogOut, Home, User, Shield, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface MemberHomeViewProps {
  isDark: boolean;
  responsibility: AccommodationResponsibility;
  member?: Member;
  scopedRoles?: ScopedRoleAssignment[];
  currentMode?: ActiveMode;
  onModeChange?: (mode: ActiveMode) => void;
  onToggleTheme: () => void;
  onExitToLanding: () => void;
  onViewResponsibilityDetails: (responsibilityId?: string) => void;
  onLogout?: () => void;
  onSwitchToAdmin?: () => void;
  onSwitchToCaptain?: () => void;
  onSwitchToCoordinator?: () => void;
}

export const MemberHomeView: React.FC<MemberHomeViewProps> = ({
  isDark,
  responsibility,
  member,
  scopedRoles = [],
  currentMode = 'FELLOW',
  onModeChange,
  onToggleTheme,
  onExitToLanding,
  onViewResponsibilityDetails,
  onLogout,
  onSwitchToAdmin,
  onSwitchToCaptain,
  onSwitchToCoordinator,
}) => {
  const [showNotes, setShowNotes] = useState(false);

  // Check if current fellow has an active room captain or coordinator responsibility
  const captainAssignment = scopedRoles.find((r) => r.role === ('ROOM_CAPTAIN' as any));
  const coordinatorAssignment = scopedRoles.find((r) => r.role === ('ACCOMMODATION_FELLOWS_COORDINATOR' as any));

  const attribution = member ? formatActionAttribution(member, currentMode) : null;

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-[#2F1707] text-[#FFF9EE]' : 'bg-[#F7F1E7] text-[#5A2D0C]'
      }`}
    >
      {/* Dev Auth Session Banner */}
      <aside
        aria-label="Development Authentication Notice"
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
              DEVELOPMENT AUTH
            </span>
            <span>
              Authenticated as <strong>{member?.displayName || 'Current Fellow'}</strong> (
              {member?.h4dMemberId || 'H4D-FELLOW'}) &bull; Acting as: <strong>{attribution?.actingCapacity || 'Fellow'}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {onSwitchToAdmin && (
              <button
                type="button"
                id="fellow-switch-to-admin-banner-btn"
                onClick={onSwitchToAdmin}
                className={`self-start sm:self-auto font-medium underline underline-offset-2 cursor-pointer hover:opacity-80 transition-opacity text-xs ${
                  isDark ? 'text-[#C88D3A]' : 'text-[#B77620]'
                }`}
              >
                Switch to Accommodation Admin →
              </button>
            )}
            {onLogout && (
              <button
                type="button"
                id="dev-auth-logout-banner-btn"
                onClick={onLogout}
                className={`self-start sm:self-auto font-medium underline underline-offset-2 cursor-pointer hover:opacity-80 transition-opacity text-xs ${
                  isDark ? 'text-[#C88D3A]' : 'text-[#B77620]'
                }`}
              >
                Log Out Session
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Active Delegated Responsibility Callout Banner for Captains / Coordinators */}
      {captainAssignment && currentMode === 'FELLOW' && onSwitchToCaptain && (
        <div
          id="captain-responsibility-alert-banner"
          className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 text-xs text-[#5A2D0C]"
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium">
              <Shield className="w-4 h-4 text-[#B77620]" />
              <span>
                You have an active delegated responsibility: <strong>Room Captain — {captainAssignment.scope.roomName}</strong> ({captainAssignment.scope.propertyName}).
              </span>
            </div>
            <button
              type="button"
              id="btn-switch-to-captain-banner"
              onClick={onSwitchToCaptain}
              className="px-3 py-1 bg-[#5A2D0C] text-[#FFF9EE] hover:bg-[#2F1707] font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Switch to Room Captain Mode →
            </button>
          </div>
        </div>
      )}

      {coordinatorAssignment && currentMode === 'FELLOW' && onSwitchToCoordinator && (
        <div
          id="coordinator-responsibility-alert-banner"
          className="bg-purple-500/10 border-b border-purple-500/30 px-4 py-2.5 text-xs text-[#5A2D0C]"
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium">
              <Shield className="w-4 h-4 text-purple-700" />
              <span>
                You have an active administrative role: <strong>L2E Accommodation Fellows Coordinator</strong>.
              </span>
            </div>
            <button
              type="button"
              id="btn-switch-to-coordinator-banner"
              onClick={onSwitchToCoordinator}
              className="px-3 py-1 bg-[#5A2D0C] text-[#FFF9EE] hover:bg-[#2F1707] font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Switch to Coordinator Mode →
            </button>
          </div>
        </div>
      )}

      {/* Application Shell Header */}
      <header
        className="sticky top-0 z-30 w-full border-b transition-colors duration-200"
        style={{
          borderColor: isDark ? '#3E200C' : '#EAE0D0',
          backgroundColor: isDark ? 'rgba(47, 23, 7, 0.92)' : 'rgba(247, 241, 231, 0.92)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          {/* Brand Mark */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onExitToLanding}
              className="inline-flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C88D3A] rounded-lg cursor-pointer"
              title="Return to Public Landing"
            >
              <Hut4DevsLogo isDark={isDark} size="sm" showWordmark={true} />
            </button>

            {/* Mode Switcher inside header when multi-role */}
            {member && onModeChange && (
              <ModeSwitcher
                member={member}
                scopedRoles={scopedRoles}
                currentMode={currentMode}
                onModeChange={onModeChange}
              />
            )}
          </div>

          {/* Controls: Member Badge, Theme & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono ${
                isDark
                  ? 'bg-[#3E200C] text-[#E2AB5D] border border-[#4B2710]'
                  : 'bg-[#FFF9EE] text-[#5A2D0C] border border-[#EAE0D0]'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#C88D3A]" />
              <span className="font-semibold">{member?.displayName || 'Current Fellow'}</span>
              <span className="opacity-60 text-[10px]">{currentMode}</span>
            </div>

            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

            {onLogout ? (
              <button
                type="button"
                id="header-logout-btn"
                onClick={onLogout}
                aria-label="Log Out"
                title="Log Out Session"
                className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C88D3A] ${
                  isDark
                    ? 'text-[#E5D3BA] hover:text-[#FFF9EE] hover:bg-[#3E200C]'
                    : 'text-[#6D4223] hover:text-[#5A2D0C] hover:bg-[#EFE5D5]'
                }`}
              >
                <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            ) : (
              <button
                type="button"
                id="exit-landing-btn"
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
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14">
        {/* Greeting */}
        <div className="mb-2">
          <p
            className="text-xs sm:text-sm font-medium tracking-wide uppercase transition-colors duration-200"
            style={{ color: isDark ? '#C88D3A' : '#B77620' }}
          >
            Welcome, {member?.displayName || 'Fellow'}
          </p>
        </div>

        {/* Heading */}
        <h1
          className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-8 transition-colors duration-200"
          style={{ color: isDark ? '#FFF9EE' : '#5A2D0C' }}
        >
          What needs your attention?
        </h1>

        {/* Accommodation Responsibility Card */}
        <section
          aria-label="Active Accommodation Responsibilities"
          className="space-y-6"
        >
          <AccommodationResponsibilityCard
            responsibility={responsibility}
            isDark={isDark}
            onViewDetails={onViewResponsibilityDetails}
          />

          {/* Contextual Financial Notes Toggle & Section */}
          <div className="bg-white/40 border border-[#C88D3A]/25 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#C88D3A]" />
                <span className="font-serif font-bold text-sm text-[#5A2D0C]">
                  Accommodation Notes &amp; Clarifications
                </span>
              </div>
              <button
                type="button"
                id="toggle-fellow-notes-thread-btn"
                onClick={() => setShowNotes(!showNotes)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#5A2D0C] hover:text-[#B77620] px-3 py-1.5 rounded-lg bg-[#F7F1E7] border border-[#5A2D0C]/10 cursor-pointer"
              >
                <span>{showNotes ? 'Hide Thread' : 'View Notes Thread'}</span>
                {showNotes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showNotes && member && (
              <div className="mt-4">
                <FinancialNotesThread
                  responsibilityId={responsibility.id}
                  currentMember={member}
                  activeMode={currentMode}
                  isDark={isDark}
                />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Member Shell Footer */}
      <footer
        className="w-full py-5 text-center text-xs tracking-wider uppercase border-t transition-colors duration-200 mt-auto"
        style={{
          borderColor: isDark ? '#3E200C' : '#EAE0D0',
          color: isDark ? '#A67B54' : '#8A5D3B',
        }}
      >
        <p>Hut4Devs Member Space &bull; Canonical Foundation</p>
      </footer>
    </div>
  );
};
