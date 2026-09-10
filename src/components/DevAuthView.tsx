import React, { useState } from 'react';
import { MemberRole } from '../domain/auth';
import { Hut4DevsLogo } from './Hut4DevsLogo';
import { ThemeToggle } from './ThemeToggle';
import { ShieldAlert, User, ShieldCheck, ArrowRight } from 'lucide-react';

interface DevAuthViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onAuthenticate: (role: MemberRole) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const DevAuthView: React.FC<DevAuthViewProps> = ({
  isDark,
  onToggleTheme,
  onAuthenticate,
  onCancel,
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
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
        <div
          className="w-full max-w-xl rounded-2xl border p-6 sm:p-8 shadow-md transition-colors duration-200"
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
              <span className="font-semibold text-[11px]">Server Session Boundary (H4D-FUNC-011)</span>
            </div>
            <p className="leading-relaxed">
              Notice: This mode is strictly for development verification and local milestone testing.
              It establishes an authenticated server session via PostgreSQL without requiring external
              OAuth/social login providers. Sessions and role authorization are enforced server-side.
            </p>
          </div>

          <div className="text-center mb-6">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Authenticate Identity
            </h1>
            <p className="text-sm opacity-80 max-w-md mx-auto">
              Select a deterministic development identity to establish an authenticated session.
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

          {/* Identity Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Fellow Option */}
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
                    <span className="font-bold text-sm">Current Fellow</span>
                  </div>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded font-medium"
                    style={{
                      backgroundColor: isDark ? '#2F1707' : '#EFE4D2',
                    }}
                  >
                    FELLOW
                  </span>
                </div>
                <p className="text-xs opacity-75 mb-3">
                  Infinite Grace Apartments &bull; Floor 3 &bull; Room 3B
                </p>
                <div className="text-[11px] font-mono opacity-60">
                  fellow@infinitegrace.local
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
                className={`mt-4 w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  selectedRole === MemberRole.FELLOW
                    ? isDark
                      ? 'bg-[#C88D3A] text-[#2F1707] hover:bg-[#DDA250]'
                      : 'bg-[#5A2D0C] text-[#FFF9EE] hover:bg-[#432108]'
                    : isDark
                    ? 'bg-[#4B2710] text-[#E2AB5D] hover:bg-[#5C3115]'
                    : 'bg-[#EAE0D0] text-[#5A2D0C] hover:bg-[#DDD0BC]'
                }`}
              >
                <span>Enter as Fellow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Accommodation Admin Option */}
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
                    <span className="font-bold text-sm">Accommodation Admin</span>
                  </div>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded font-medium"
                    style={{
                      backgroundColor: isDark ? '#2F1707' : '#EFE4D2',
                    }}
                  >
                    ADMIN
                  </span>
                </div>
                <p className="text-xs opacity-75 mb-3">
                  Supervisory operations &bull; Outbox audit &bull; SSE stream
                </p>
                <div className="text-[11px] font-mono opacity-60">
                  admin@infinitegrace.local
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
                className={`mt-4 w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  selectedRole === MemberRole.ACCOMMODATION_ADMIN
                    ? isDark
                      ? 'bg-[#C88D3A] text-[#2F1707] hover:bg-[#DDA250]'
                      : 'bg-[#5A2D0C] text-[#FFF9EE] hover:bg-[#432108]'
                    : isDark
                    ? 'bg-[#4B2710] text-[#E2AB5D] hover:bg-[#5C3115]'
                    : 'bg-[#EAE0D0] text-[#5A2D0C] hover:bg-[#DDD0BC]'
                }`}
              >
                <span>Enter as Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
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
