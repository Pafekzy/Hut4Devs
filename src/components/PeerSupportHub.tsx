import React, { useState } from 'react';
import { PeerSupportItem, SupportType, Member } from '../types';
import { Heart, DollarSign, HandHeart, BookOpen, ShieldCheck, CheckCircle, XCircle, Plus, AlertCircle, Sparkles, Filter } from 'lucide-react';

interface PeerSupportHubProps {
  items: PeerSupportItem[];
  currentUser: Member;
  onOpenCreateSupport: () => void;
  onFulfillSupport: (item: PeerSupportItem) => void;
  onDeclineSupport: (item: PeerSupportItem) => void;
}

export const PeerSupportHub: React.FC<PeerSupportHubProps> = ({
  items,
  currentUser,
  onOpenCreateSupport,
  onFulfillSupport,
  onDeclineSupport,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [declineNotice, setDeclineNotice] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const handleDecline = (item: PeerSupportItem) => {
    onDeclineSupport(item);
    setDeclineNotice(`You safely declined "${item.title}". Remember: Declining is legitimate and never generates negative recognition in Hut4Devs.`);
    setTimeout(() => setDeclineNotice(null), 6000);
  };

  const getTypeBadge = (type: SupportType) => {
    switch (type) {
      case 'loan':
        return {
          icon: DollarSign,
          label: 'LOAN • Repayment Expected',
          bg: 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        };
      case 'gift':
        return {
          icon: Heart,
          label: 'GIFT • No Repayment Expected',
          bg: 'bg-pink-100 text-pink-900 dark:bg-pink-950/60 dark:text-pink-300 border-pink-300 dark:border-pink-800',
        };
      case 'contribution':
        return {
          icon: HandHeart,
          label: 'CONTRIBUTION • Shared Purpose (No Debt)',
          bg: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        };
      case 'mentorship':
        return {
          icon: BookOpen,
          label: 'MENTORSHIP • Knowledge Sharing',
          bg: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
        };
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Peer-to-Peer Architecture</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Peer Support & Mutual Aid
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Transparent support without predatory interest or universal scoring. Distinct labels prevent loans from masquerading as gifts.
          </p>
        </div>

        <button
          id="btn-request-support"
          onClick={onOpenCreateSupport}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-sm active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Request or Offer Support</span>
        </button>
      </div>

      <div className="p-4 rounded-xl border border-indigo-200/80 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 text-indigo-950 dark:text-indigo-200">
          <span className="font-bold">
            Guaranteed Protocol: "Saying NO Must Be Safe"
          </span>
          <p className="text-indigo-800 dark:text-indigo-300 leading-relaxed">
            Asking for help is not weakness. Helping is not ownership. Declining is not betrayal.
            A fellow may decline to lend, gift, contribute, or vouch at any time with zero penalty or recorded demerits.
          </p>
        </div>
      </div>

      {declineNotice && (
        <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <span>{declineNotice}</span>
          <button
            onClick={() => setDeclineNotice(null)}
            className="text-xs underline font-semibold ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        {[
          { id: 'all', label: 'All Support Items' },
          { id: 'loan', label: 'Loans (Repayable)' },
          { id: 'gift', label: 'Gifts (No Debt)' },
          { id: 'contribution', label: 'Contributions (Pools)' },
          { id: 'mentorship', label: 'Mentorship' },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`filter-support-${tab.id}`}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterType === tab.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const badge = getTypeBadge(item.type);
          const BadgeIcon = badge.icon;
          const isOwn = item.toMemberId === currentUser.id;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                item.status === 'fulfilled'
                  ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-90'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${badge.bg}`}>
                    <BadgeIcon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </span>

                  {item.status === 'fulfilled' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-3 h-3" />
                      <span>Fulfilled</span>
                    </span>
                  )}
                  {item.status === 'declined' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      <XCircle className="w-3 h-3" />
                      <span>Closed</span>
                    </span>
                  )}
                  {item.status === 'open' && (
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      ● Active Request
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                  {item.amount && (
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-400">Target Amount:</span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        ${item.amount} {item.currency}
                      </span>
                    </div>
                  )}

                  {item.repaymentExpected && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Agreed Repayment Window:</span>
                      <span className="font-semibold text-amber-700 dark:text-amber-300">
                        {item.repaymentDueDate || 'Stipend arrival cycle'}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Contextual Vouches:
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {item.vouchCount} Verified Fellow Vouches
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <img
                    src={item.toMemberAvatar}
                    alt={item.toMemberName}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      {item.toMemberName} {isOwn && <span className="text-[10px] text-emerald-500 font-normal">(You)</span>}
                    </p>
                    <p className="text-[10px] text-slate-400">{item.createdAt}</p>
                  </div>
                </div>

                {item.status === 'open' && !isOwn && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecline(item)}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
                      title="Safely decline without penalty"
                    >
                      Safe Decline
                    </button>
                    <button
                      onClick={() => onFulfillSupport(item)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-xs"
                    >
                      Support {item.type === 'loan' ? 'Loan' : 'Goal'}
                    </button>
                  </div>
                )}
                {item.status === 'open' && isOwn && (
                  <span className="text-[11px] font-mono text-slate-400 italic">
                    Your open request
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
