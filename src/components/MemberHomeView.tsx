import React from 'react';
import { Hut4DevsLogo } from './Hut4DevsLogo';
import { ThemeToggle } from './ThemeToggle';
import { AccommodationResponsibilityCard } from './AccommodationResponsibilityCard';
import { AccommodationResponsibility } from '../domain/accommodation';
import { LogOut, Home, ShieldAlert } from 'lucide-react';

interface MemberHomeViewProps {
  isDark: boolean;
  responsibility: AccommodationResponsibility;
  onToggleTheme: () => void;
  onExitToLanding: () => void;
  onViewResponsibilityDetails: (responsibilityId: string) => void;
  onSwitchToAdmin: () => void;
}

export const MemberHomeView: React.FC<MemberHomeViewProps> = ({
  isDark,
  responsibility,
  onToggleTheme,
  onExitToLanding,
  onViewResponsibilityDetails,
  onSwitchToAdmin,
}) => {
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
            <span>Fellow Workspace &bull; No authentication or authorization claimed</span>
          </div>
          <button
            type="button"
            id="dev-switch-to-admin-banner-btn"
            onClick={onSwitchToAdmin}
            className={`self-start sm:self-auto font-medium underline underline-offset-2 cursor-pointer hover:opacity-80 transition-opacity text-xs ${
              isDark ? 'text-[#C88D3A]' : 'text-[#B77620]'
            }`}
          >
            Switch to Accommodation Admin →
          </button>
        </div>
      </aside>

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

            {/* Active Navigation Shell Indicator: Home */}
            <nav className="hidden xs:flex items-center" aria-label="Main Navigation">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isDark
                    ? 'bg-[#3E200C] text-[#C88D3A] border border-[#623416]'
                    : 'bg-[#FFF9EE] text-[#5A2D0C] border border-[#EAE0D0]'
                }`}
              >
                <Home className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Home</span>
              </span>
            </nav>
          </div>

          {/* Controls: Theme & Exit & Admin Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              id="switch-to-admin-header-btn"
              onClick={onSwitchToAdmin}
              aria-label="Switch to Accommodation Admin"
              className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C88D3A] ${
                isDark
                  ? 'bg-[#3E200C] text-[#C88D3A] hover:bg-[#4B2710] border border-[#623416]'
                  : 'bg-[#FFF9EE] text-[#5A2D0C] hover:bg-[#F2E8D8] border border-[#EAE0D0]'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Accommodation Admin</span>
            </button>

            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
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
            Welcome, Fellow
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
          className="space-y-4"
        >
          <AccommodationResponsibilityCard
            responsibility={responsibility}
            isDark={isDark}
            onViewDetails={onViewResponsibilityDetails}
          />
        </section>
      </main>

      {/* Member Shell Footer */}
      <footer
        className="w-full py-5 text-center text-xs tracking-wider uppercase border-t transition-colors duration-200"
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
