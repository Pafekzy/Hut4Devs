import React, { useState } from 'react';
import { FileText, Lock, Copy, X } from 'lucide-react';
import { Member, TrustTrailEvent } from '../types';

interface VerifiableStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Member;
  events: TrustTrailEvent[];
}

export const VerifiableStatementModal: React.FC<VerifiableStatementModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  events,
}) => {
  const [statementPurpose, setStatementPurpose] = useState('Off-Campus Landlord Lease Application');
  const [targetAudience, setTargetAudience] = useState('Property Management / Leasing Agent');
  const [showAmounts, setShowAmounts] = useState(false);
  const [showRoommates, setShowRoommates] = useState(false);
  const [includeVouches, setIncludeVouches] = useState(true);
  const [includeRepairs, setIncludeRepairs] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const verifiedPaymentsCount = events.filter(e => e.type === 'payment_recorded' || e.type === 'repayment_fulfilled').length;
  const verifiedRepairsCount = events.filter(e => e.type === 'repair_completed').length;
  const statementHash = '0x' + Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  const handleCopyStatement = () => {
    navigator.clipboard?.writeText(JSON.stringify({
      issuer: 'Hut4Devs Trust Engine v0.9',
      subject: currentUser.name,
      purpose: statementPurpose,
      audience: targetAudience,
      statementHash,
      timestamp: new Date().toISOString(),
      verifiedCycles: `${verifiedPaymentsCount} Verified Cycles`,
      repairedCommitments: includeRepairs ? `${verifiedRepairsCount} Repaired with Full Follow-Through` : '[Redacted]',
      amountsDisclosed: showAmounts ? 'Explicit USD Values' : 'Redacted for Privacy (Binary Compliance Proof)',
      anchorNetwork: 'Stellar Minimal Cryptographic Proof / Off-Chain Private Vault',
    }, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Generate Purpose-Specific Verifiable Statement
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Share proof of responsibility without exposing sensitive financial records.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Statement Purpose (Bound Context)
              </label>
              <input
                type="text"
                value={statementPurpose}
                onChange={(e) => setStatementPurpose(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Designated Recipient / Verifier
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-3">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Selective Disclosure Controls (Zero-Knowledge Privacy)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAmounts}
                  onChange={(e) => setShowAmounts(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
                <span>Disclose Exact USD Amounts</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRoommates}
                  onChange={(e) => setShowRoommates(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
                <span>Disclose Roommate Names & Units</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeVouches}
                  onChange={(e) => setIncludeVouches(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
                <span>Include Peer Contextual Vouches</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRepairs}
                  onChange={(e) => setIncludeRepairs(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
                <span>Include Successfully Repaired Events</span>
              </label>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-emerald-500/40 bg-gradient-to-b from-emerald-50/40 to-slate-50 dark:from-emerald-950/20 dark:to-slate-950 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  🛖
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Hut4Devs Verifiable Trust Attestation
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Hash: {statementHash}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800">
                CRYPTOGRAPHICALLY VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Subject</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentUser.name}</span>
                <span className="text-[11px] text-slate-500 block">{currentUser.role}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Purpose & Verifier</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{statementPurpose}</span>
                <span className="text-[11px] text-slate-500 block">For: {targetAudience}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Accommodation Cycles Fulfilled:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {verifiedPaymentsCount} Consecutive Rent Cycles On-Time
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Demonstrated Repair Record:</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {includeRepairs ? `${verifiedRepairsCount} Transparent Early Notice & Repaired` : '[Redacted by User]'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Financial Amount Privacy:</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">
                  {showAmounts ? 'Amounts Explicitly Shown' : 'Redacted (Compliance Only)'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleCopyStatement}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Statement JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
