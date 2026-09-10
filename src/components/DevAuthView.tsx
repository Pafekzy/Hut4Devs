import React, { useState } from 'react';
import { MemberRole } from '../domain/auth';
import { Hut4DevsLogo } from './Hut4DevsLogo';
import { ThemeToggle } from './ThemeToggle';
import { User, ShieldCheck, ArrowRight, Home, Users, Sparkles } from 'lucide-react';

interface DevAuthViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onAuthenticate: (role: MemberRole) => Promise<void>;
  onCancel?: () => void;
  onOpenRegistrationModal?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const DevAuthView: React.FC<DevAuthViewProps> = ({
  isDark,
  onToggleTheme,
  onAuthenticate,
  onCancel,
  onOpenRegistrationModal,
  isLoading = false,
  errorMessage = null,
}) => {
  const [selectedRole, setSelectedRole] = useState<MemberRole>(MemberRole.FELLOW);
  const [authenticating, setAuthenticating] = useState(false);

  const handleSelectAndAuth = async (role: MemberRole) => {
    setSelectedRole(role);
    setAuthenticating(true);
    try {
      await onAuthenticate(role);
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
        isDark ? 'bg-[#2F1707] text-[#FFF9EE]' : 'bg-[#F7F1E7] text-[#5A2D0C]'
      }`}
    >
      {/* Top Header */}
      <header
        className="w-full border-b transition-colors duration-200"
        style={{
          borderColor: isDark ? '#3E200C' : '#EAE0D0',
          backgroundColor: isDark ? 'rgba(47, 23, 7, 0.85)' : 'rgba(247, 241, 231, 0.85)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Hut4DevsLogo isDark={isDark} size="sm" showWordmark={true} />
          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div
          className="w-full max-w-3xl rounded-2xl border p-6 sm:p-8 shadow-md transition-colors duration-200"
          style={{
            backgroundColor: isDark ? '#3A1E0B' : '#FFFFFF',
            borderColor: isDark ? '#4B2710' : '#E7D6C1',
          }}
        >
          {/* Explicit Development Auth Notice */}
          <div
            className="mb-6 rounded-xl border p-4 text-xs font-mono transition-colors duration-200"
            style={{
              backgroundColor: isDark ? '#4B2710' : '#FBF7EE',
              borderColor: isDark ? '#5C3115' : '#E0D2BE',
              color: isDark ? '#E2AB5D' : '#7C4A1E',
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]"
                style={{
                  backgroundColor: isDark ? '#5C3115' : '#EAE0D0',
                  color: isDark ? '#C88D3A' : '#5A2D0C',
                }}
              >
                DEVELOPMENT AUTH
              </span>
              <span className="font-semibold text-[11px]">Role-Aware Scoped Identity Simulation</span>
            </div>
            <p className="leading-relaxed">
              Core Principle: <strong>Registration is NOT role selection.</strong> Registration establishes identity;
              approval establishes membership; delegation establishes authority. Select an authoritative test identity below
              to test mode switching, room-scoped duties, and coordinator reviews.
            </p>
          </div>

          <div className="text-center mb-6">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Authenticate Test Identity
            </h1>
            <p className="text-sm opacity-80 max-w-md mx-auto">
              Select an identity to experience role-aware accommodation workflows.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-3 rounded-lg text-xs font-mono bg-red-900/20 border border-red-700/50 text-red-300 text-center"
            >
              {errorMessage}
            </div>
          )}

          {/* Identity Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* 1. Fellow Option */}
            <div
              onClick={() => setSelectedRole(MemberRole.FELLOW)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                selectedRole === MemberRole.FELLOW
                  ? isDark
                    ? 'border-[#C88D3A] bg-[#43230C]'
                    : 'border-[#5A2D0C] bg-[#F7F1E7]'
                  : isDark
                  ? 'border-[#4B2710] hover:border-[#5C3115] bg-[#331A09]'
                  : 'border-[#E7D6C1] hover:border-[#D0BD9F] bg-[#FCF9F3]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#C88D3A]" />
                    <span className="font-bold text-sm">Normal Fellow</span>
                  </div>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded font-medium"
                    style={{ backgroundColor: isDark ? '#2F1707' : '#EFE4D2' }}
                  >
                    FELLOW
                  </span>
                </div>
                <p className="text-xs opacity-75 mb-2">
                  Infinite Grace Apartments &bull; Floor 3 &bull; Room 3B
                </p>
                <div className="text-[11px] font-mono opacity-60 mb-2">
                  fellow@infinitegrace.local
                </div>
                <div className="text-[11px] text-[#5A2D0C]/70 bg-stone-100/80 p-2 rounded">
                  View personal accommodation responsibility, payment intent, and history.
                </div>
              </div>

              <button
                type="button"
                id="dev-auth-fellow-btn"
                disabled={isLoading || authenticating}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAndAuth(MemberRole.FELLOW);
                }}
                className="mt-4 w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors bg-[#5A2D0C] text-[#FFF9EE] hover:bg-[#432108] cursor-pointer"
              >
                <span>Enter as Fellow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Room Captain Option */}
            <div
              onClick={() => setSelectedRole(MemberRole.ROOM_CAPTAIN)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                selectedRole === MemberRole.ROOM_CAPTAIN
                  ? isDark
                    ? 'border-[#C88D3A] bg-[#43230C]'
                    : 'border-[#5A2D0C] bg-[#F7F1E7]'
                  : isDark
                  ? 'border-[#4B2710] hover:border-[#5C3115] bg-[#331A09]'
                  : 'border-[#E7D6C1] hover:border-[#D0BD9F] bg-[#FCF9F3]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-[#C88D3A]" />
                    <span className="font-bold text-sm">Chinedu Okeke</span>
                  </div>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded font-medium bg-amber-100 text-amber-900"
                  >
                    ROOM CAPTAIN
                  </span>
                </div>
                <p className="text-xs opacity-75 mb-2">
                  Assigned Scope: Infinite Grace &bull; Room 304
                </p>
                <div className="text-[11px] font-mono opacity-60 mb-2">
                  captain@infinitegrace.local
                </div>
                <div className="text-[11px] text-[#5A2D0C]/70 bg-stone-100/80 p-2 rounded">
                  Dual capacity: Normal Fellow + Room 304 Captain verification mode.
                </div>
              </div>

              <button
                type="button"
                id="dev-auth-captain-btn"
                disabled={isLoading || authenticating}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAndAuth(MemberRole.ROOM_CAPTAIN);
                }}
                className="mt-4 w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors bg-[#5A2D0C] text-[#FFF9EE] hover:bg-[#432108] cursor-pointer"
              >
                <span>Enter as Room Captain</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3. Fellows Coordinator Option */}
            <div
              onClick={() => setSelectedRole(MemberRole.ACCOMMODATION_FELLOWS_COORDINATOR)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                selectedRole === MemberRole.ACCOMMODATION_FELLOWS_COORDINATOR
                  ? isDark
                    ? 'border-[#C88D3A] bg-[#43230C]'
                    : 'border-[#5A2D0C] bg-[#F7F1E7]'
                  : isDark
                  ? 'border-[#4B2710] hover:border-[#5C3115] bg-[#331A09]'
                  : 'border-[#E7D6C1] hover:border-[#D0BD9F] bg-[#FCF9F3]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#C88D3A]" />
                    <span className="font-bold text-sm">Emmanuel Ukom</span>
                  </div>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded font-medium bg-purple-100 text-purple-900"
                  >
                    COORDINATOR
                  </span>
                </div>
                <p className="text-xs opacity-75 mb-2">
                  L2E Dev Cohort Accommodation Coordinator
                </p>
                <div className="text-[11px] font-mono opacity-60 mb-2">
                  coordinator@infinitegrace.local
                </div>
                <div className="text-[11px] text-[#5A2D0C]/70 bg-stone-100/80 p-2 rounded">
                  Full coordination: Membership review, captain delegation, and coverage modes.
                </div>
              </div>

              <button
                type="button"
                id="dev-auth-coordinator-btn"
                disabled={isLoading || authenticating}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAndAuth(MemberRole.ACCOMMODATION_FELLOWS_COORDINATOR);
                }}
                className="mt-4 w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors bg-[#5A2D0C] text-[#FFF9EE] hover:bg-[#432108] cursor-pointer"
              >
                <span>Enter as Coordinator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4. Financial Admin Option */}
            <div
              onClick={() => setSelectedRole(MemberRole.ACCOMMODATION_ADMIN)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                selectedRole === MemberRole.ACCOMMODATION_ADMIN
                  ? isDark
                    ? 'border-[#C88D3A] bg-[#43230C]'
                    : 'border-[#5A2D0C] bg-[#F7F1E7]'
                  : isDark
                  ? 'border-[#4B2710] hover:border-[#5C3115] bg-[#331A09]'
                  : 'border-[#E7D6C1] hover:border-[#D0BD9F] bg-[#FCF9F3]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#C88D3A]" />
                    <span className="font-bold text-sm">Financial Admin</span>
                  </div>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded font-medium bg-emerald-100 text-emerald-900"
                  >
                    ADMIN
                  </span>
                </div>
                <p className="text-xs opacity-75 mb-2">
                  Attention-First Command Center &bull; Audit &bull; Notes
                </p>
                <div className="text-[11px] font-mono opacity-60 mb-2">
                  admin@infinitegrace.local
                </div>
                <div className="text-[11px] text-[#5A2D0C]/70 bg-stone-100/80 p-2 rounded">
                  Financial accountability, provider reconciliations, and attention filtering.
                </div>
              </div>

              <button
                type="button"
                id="dev-auth-admin-btn"
                disabled={isLoading || authenticating}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAndAuth(MemberRole.ACCOMMODATION_ADMIN);
                }}
                className="mt-4 w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors bg-[#5A2D0C] text-[#FFF9EE] hover:bg-[#432108] cursor-pointer"
              >
                <span>Enter as Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* New Membership Registration Trigger */}
          <div className="p-4 bg-[#F7F1E7] border border-[#C88D3A]/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#5A2D0C]">
                <Sparkles className="w-4 h-4 text-[#C88D3A]" />
                New Fellow or Residency Transfer?
              </div>
              <p className="text-[11px] text-[#5A2D0C]/70 mt-0.5">
                Submit an Accommodation Membership Request without choosing administrative roles.
              </p>
            </div>
            {onOpenRegistrationModal && (
              <button
                id="btn-open-registration-from-auth"
                type="button"
                onClick={onOpenRegistrationModal}
                className="whitespace-nowrap px-3.5 py-1.5 bg-[#C88D3A] hover:bg-[#B77620] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Submit Membership Request
              </button>
            )}
          </div>

          {onCancel && (
            <div className="text-center">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs underline opacity-70 hover:opacity-100 cursor-pointer"
              >
                Back to Public Landing
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
