import React from 'react';
import { AccommodationMembershipRequest } from '../domain/membership';
import { Hut4DevsLogo } from './Hut4DevsLogo';
import { ThemeToggle } from './ThemeToggle';
import { Clock, AlertCircle, RefreshCw, LogOut, CheckCircle2, ShieldAlert } from 'lucide-react';

interface PendingMembershipViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
  membershipRequest: AccommodationMembershipRequest | null;
  userEmail?: string;
  onRefreshStatus?: () => void;
  onLogout: () => void;
}

export const PendingMembershipView: React.FC<PendingMembershipViewProps> = ({
  isDark,
  onToggleTheme,
  membershipRequest,
  userEmail,
  onRefreshStatus,
  onLogout,
}) => {
  const status = membershipRequest?.status || 'SUBMITTED';

  const getStatusBadge = () => {
    switch (status) {
      case 'UNDER_REVIEW':
        return {
          label: 'Under Coordinator Review',
          color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-700',
          icon: Clock,
        };
      case 'DELEGATED':
        return {
          label: 'Delegated to Room Captain',
          color: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700',
          icon: RefreshCw,
        };
      case 'NEEDS_CLARIFICATION':
        return {
          label: 'Needs Clarification',
          color: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-700',
          icon: AlertCircle,
        };
      case 'SUBMITTED':
      default:
        return {
          label: 'Awaiting Coordinator Review',
          color: 'bg-[#F8E6CC] text-[#633718] border-[#D6B587] dark:bg-[#3E200C] dark:text-[#E5D3BA] dark:border-[#623416]',
          icon: Clock,
        };
    }
  };

  const badge = getStatusBadge();
  const BadgeIcon = badge.icon;

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
        isDark ? 'bg-[#2F1707] text-[#FFF9EE]' : 'bg-[#FFF8EE] text-[#432006]'
      }`}
    >
      {/* Header */}
      <header
        className="w-full border-b transition-colors duration-200"
        style={{
          borderColor: isDark ? '#623416' : '#CF9F68',
          backgroundColor: isDark ? 'rgba(47, 23, 7, 0.95)' : 'rgba(255, 248, 238, 0.95)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Hut4DevsLogo isDark={isDark} size="sm" showWordmark={true} />
          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            <button
              onClick={onLogout}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#CF9F68] dark:border-[#623416] hover:bg-[#FAE5C5] dark:hover:bg-[#3E200C] text-[#432006] dark:text-[#FFF9EE] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div
          id="pending-membership-gate"
          className="w-full max-w-xl rounded-2xl border-2 p-6 sm:p-8 shadow-md transition-colors duration-200 space-y-6"
          style={{
            backgroundColor: isDark ? '#3E200C' : '#FFF0D6',
            borderColor: isDark ? '#623416' : '#CF9F68',
          }}
        >
          {/* Top Status Banner */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border mb-1 bg-[#FAE5C5] border-[#C46F18] text-[#72451F] dark:bg-[#A45A12]/40 dark:text-[#F8E4B8] dark:border-[#C46F18]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>MEMBERSHIP PENDING APPROVAL</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#432006] dark:text-[#FFF9EE]">
              Residency Verification In Progress
            </h1>
            <p className="text-xs sm:text-sm text-[#5A3013] dark:text-[#E5D3BA]/80 max-w-md mx-auto">
              Your identity is authenticated, but your accommodation workspace requires authoritative approval.
            </p>
          </div>

          {/* Current Status Box */}
          <div
            className="rounded-xl border p-4 transition-colors duration-200 space-y-3"
            style={{
              backgroundColor: isDark ? '#2F1707' : '#FFF8EE',
              borderColor: isDark ? '#623416' : '#DDB985',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C46F18] dark:text-[#E5A955] font-bold">
                Application Status
              </span>
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${badge.color}`}
              >
                <BadgeIcon className="w-3 h-3" />
                <span>{badge.label}</span>
              </div>
            </div>

            <div className="text-xs space-y-1.5 pt-1 border-t border-[#DDB985] dark:border-[#623416]">
              <div className="flex justify-between">
                <span className="text-[#5A3013] dark:text-[#E5D3BA]/75">Applicant:</span>
                <span className="font-semibold text-[#432006] dark:text-[#FFF9EE]">{membershipRequest?.fullName || userEmail || 'Fellow Applicant'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A3013] dark:text-[#E5D3BA]/75">Email:</span>
                <span className="font-mono text-[11px] text-[#432006] dark:text-[#FFF9EE]">{membershipRequest?.email || userEmail}</span>
              </div>
              {membershipRequest?.propertyName && (
                <div className="flex justify-between">
                  <span className="text-[#5A3013] dark:text-[#E5D3BA]/75">Requested Property:</span>
                  <span className="font-semibold text-[#432006] dark:text-[#FFF9EE]">{membershipRequest.propertyName}</span>
                </div>
              )}
              {membershipRequest?.roomName && (
                <div className="flex justify-between">
                  <span className="text-[#5A3013] dark:text-[#E5D3BA]/75">Assigned Room:</span>
                  <span className="font-semibold text-[#432006] dark:text-[#FFF9EE]">{membershipRequest.roomName}</span>
                </div>
              )}
              {membershipRequest?.monthlyCommitment && (
                <div className="flex justify-between">
                  <span className="text-[#5A3013] dark:text-[#E5D3BA]/75">Monthly Commitment:</span>
                  <span className="font-mono font-bold text-[#C46F18] dark:text-[#E5A955]">
                    ₦{membershipRequest.monthlyCommitment.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Verification Steps Explanation */}
          <div className="space-y-2.5 text-xs">
            <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-[#C46F18] dark:text-[#E5A955]">
              Authority Protocol
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#456B3C] dark:text-[#78C2A4] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#432006] dark:text-[#FFF9EE]">1. Identity Authenticated:</span>
                  <p className="text-[11px] text-[#5A3013] dark:text-[#E5D3BA]/75">Firebase authentication established your member credentials.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C46F18] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#432006] dark:text-[#FFF9EE]">2. Coordinator Review:</span>
                  <p className="text-[11px] text-[#5A3013] dark:text-[#E5D3BA]/75">
                    The Accommodation Fellows Coordinator or delegated Room Captain verifies physical room allocation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full border border-[#C46F18]/50 dark:border-[#E5D3BA]/40 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#5A3013] dark:text-[#E5D3BA]/60">3. Workspace Activation:</span>
                  <p className="text-[11px] text-[#5A3013] dark:text-[#E5D3BA]/60">
                    Once approved, your accommodation accountability ledger and member workspace will unlock.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            {onRefreshStatus && (
              <button
                id="btn-refresh-membership-status"
                type="button"
                onClick={onRefreshStatus}
                className="w-full sm:flex-1 py-2.5 px-4 bg-[#432006] hover:bg-[#381B07] text-[#FFF0D6] dark:bg-[#C27622] dark:hover:bg-[#D5A04B] dark:text-[#2F1707] text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Check Approval Status</span>
              </button>
            )}
            <button
              type="button"
              onClick={onLogout}
              className="w-full sm:w-auto py-2.5 px-4 border border-[#CF9F68] dark:border-[#623416] hover:bg-[#FAE5C5] dark:hover:bg-[#3E200C] text-[#432006] dark:text-[#FFF9EE] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
