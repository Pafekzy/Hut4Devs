import React from 'react';
import { Hut4DevsLogo } from './Hut4DevsLogo';
import { ThemeToggle } from './ThemeToggle';
import { ArrowRight, Shield } from 'lucide-react';

interface LandingViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onEnter: () => void;
  onOpenRegistration?: () => void;
  onOpenDevAuth?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  isDark,
  onToggleTheme,
  onEnter,
  onOpenRegistration,
  onOpenDevAuth,
}) => {
  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
        isDark ? 'bg-[#2F1707] text-[#FFF9EE]' : 'bg-[#F7F1E7] text-[#5A2D0C]'
      }`}
    >
      {/* Top Navigation Bar */}
      <header
        className="w-full border-b transition-colors duration-200"
        style={{
          borderColor: isDark ? '#3E200C' : '#EAE0D0',
          backgroundColor: isDark ? 'rgba(47, 23, 7, 0.85)' : 'rgba(247, 241, 231, 0.85)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Hut4DevsLogo isDark={isDark} size="sm" showWordmark={true} />
          <div className="flex items-center gap-3">
            {onOpenDevAuth && (
              <button
                type="button"
                id="landing-open-dev-auth-btn"
                onClick={onOpenDevAuth}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#C88D3A]/40 text-[#5A2D0C] bg-[#FFF9EE] hover:bg-[#F7F1E7] transition-colors"
              >
                Switch Identity
              </button>
            )}
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          </div>
        </div>
      </header>

      {/* Main Public Hero / Brand Moment */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center">
          {/* Selected Hut4Devs Logo & Wordmark */}
          <div className="mb-8 sm:mb-10 flex flex-col items-center">
            <Hut4DevsLogo
              isDark={isDark}
              size="lg"
              showWordmark={true}
              wordmarkOrientation="vertical"
            />
          </div>

          {/* Canonical Tagline */}
          <p
            className="text-lg sm:text-xl md:text-2xl font-normal leading-relaxed max-w-xl mx-auto mb-10 sm:mb-12 transition-colors duration-200"
            style={{
              color: isDark ? '#F5E6D3' : '#4A2710',
            }}
          >
            Turning everyday collaboration into trails of trust
            built by us and for us-all.
          </p>

          {/* Enter Action */}
          <div className="flex flex-col items-center w-full max-w-sm gap-3">
            <button
              type="button"
              id="enter-hut4devs-btn"
              onClick={onEnter}
              className={`group w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-xl text-base font-medium shadow-sm transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isDark
                  ? 'bg-[#C88D3A] text-[#2F1707] hover:bg-[#DDA250] active:bg-[#B77620] focus-visible:ring-[#C88D3A] focus-visible:ring-offset-[#2F1707]'
                  : 'bg-[#5A2D0C] text-[#FFF9EE] hover:bg-[#432108] active:bg-[#341905] focus-visible:ring-[#5A2D0C] focus-visible:ring-offset-[#F7F1E7]'
              }`}
            >
              <span>Enter Hut4Devs</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>

            {onOpenRegistration && (
              <button
                type="button"
                id="landing-open-registration-btn"
                onClick={onOpenRegistration}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/70 border border-[#C88D3A]/30 text-[#5A2D0C] hover:bg-[#FFF9EE] transition-colors cursor-pointer"
              >
                <span className="text-sm" aria-hidden="true">🛖</span>
                <span>Submit Accommodation Membership Request</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Public Landing Footer */}
      <footer
        className="w-full py-6 text-center text-xs tracking-wider uppercase border-t transition-colors duration-200"
        style={{
          borderColor: isDark ? '#3E200C' : '#EAE0D0',
          color: isDark ? '#A67B54' : '#8A5D3B',
        }}
      >
        <p>Hut4Devs &bull; Canonical Application Foundation</p>
      </footer>
    </div>
  );
};
