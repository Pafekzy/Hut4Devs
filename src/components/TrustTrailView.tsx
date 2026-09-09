import React, { useState } from 'react';
import { TrustTrailEvent, TrustTrailEventType } from '../types';
import { ShieldCheck, Lock, FileText, Search, Filter, CheckCircle, Hash, Sparkles } from 'lucide-react';

interface TrustTrailViewProps {
  events: TrustTrailEvent[];
  onOpenStatementModal: () => void;
}

export const TrustTrailView: React.FC<TrustTrailViewProps> = ({
  events,
  onOpenStatementModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.hash.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedType === 'all') return true;
    return evt.type === selectedType;
  });

  const copyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getEventBadge = (type: TrustTrailEventType) => {
    switch (type) {
      case 'payment_recorded':
      case 'partial_payment':
        return { label: 'Payment Event', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' };
      case 'repayment_fulfilled':
        return { label: 'Repayment Fulfilled', color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 border-teal-300 dark:border-teal-800' };
      case 'support_provided':
        return { label: 'Support Provided', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800' };
      case 'vouch_issued':
        return { label: 'Vouch Recorded', color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-800' };
      case 'due_date_renegotiated':
        return { label: 'Due Date Adjusted', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800' };
      case 'repair_completed':
        return { label: 'Repair Completed', color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 border-purple-300 dark:border-purple-800' };
      default:
        return { label: 'Audit Log', color: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700' };
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Immutable Context Preservation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Trails of Trust
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            "People present narratives. The platform preserves facts." A continuous verifiable record of commitments, payments, adjustments, and repairs.
          </p>
        </div>

        <button
          id="btn-generate-statement"
          onClick={onOpenStatementModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all shadow-sm active:scale-98"
        >
          <FileText className="w-4 h-4 text-emerald-500" />
          <span>Generate Verifiable Statement</span>
        </button>
      </div>

      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            Privacy Guarantee: Raw bank records & sensitive chat histories stay strictly off-chain. Only cryptographic event anchors are preserved.
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] shrink-0">
          <span>FACT</span>
          <span>→</span>
          <span>EVIDENCE</span>
          <span>→</span>
          <span className="text-emerald-500 font-semibold">STATEMENT</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search verified trail by actor, keyword, or hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {[
            { id: 'all', label: 'All Trail' },
            { id: 'payment_recorded', label: 'Payments' },
            { id: 'repayment_fulfilled', label: 'Repayments' },
            { id: 'vouch_issued', label: 'Vouches' },
            { id: 'repair_completed', label: 'Repairs' },
            { id: 'due_date_renegotiated', label: 'Adjustments' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedType(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedType === cat.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {filteredEvents.map((evt) => {
          const badge = getEventBadge(evt.type);

          return (
            <div key={evt.id} className="relative group">
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 flex items-center justify-center text-[10px] text-emerald-600 dark:text-emerald-400 shadow-xs">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${badge.color}`}>
                      {badge.label}
                    </span>
                    {evt.isPrivate ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        <Lock className="w-3 h-3" />
                        <span>Private Details Bound</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verifiable Trail</span>
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    {evt.timestamp}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {evt.details}
                    </p>
                  </div>

                  {evt.amount && (
                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 block">Amount</span>
                      <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        ${evt.amount.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={evt.actorAvatar}
                      alt={evt.actorName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {evt.actorName}
                    </span>
                    {evt.evidenceRef && (
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        Ref: {evt.evidenceRef}
                      </span>
                    )}
                    {evt.repairRef && (
                      <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-1.5 py-0.5 rounded border border-purple-500/20">
                        Repair: {evt.repairRef}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => copyHash(evt.hash)}
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400 hover:text-emerald-500 transition-colors"
                    title="Click to copy cryptographic anchor hash"
                  >
                    <Hash className="w-3 h-3" />
                    <span>{evt.hash}</span>
                    {copiedHash === evt.hash && (
                      <span className="text-emerald-500 text-[10px]">Copied!</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
