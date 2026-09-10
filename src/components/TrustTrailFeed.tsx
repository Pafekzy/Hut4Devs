import React, { useState } from 'react';
import { TrustTrailEvent } from '../domain/peerSupport';
import { Member } from '../domain/auth';
import {
  Footprints,
  CheckCircle2,
  Clock,
  Gift,
  HandCoins,
  Shield,
  MessageSquareShare,
  Search,
  Filter,
  ExternalLink,
  Layers,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';

interface TrustTrailFeedProps {
  trailEvents: TrustTrailEvent[];
  availableMembers: Member[];
}

export const TrustTrailFeed: React.FC<TrustTrailFeedProps> = ({ trailEvents, availableMembers }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getMember = (id: string, fallbackName: string) => {
    return availableMembers.find((m) => m.id === id) || {
      id,
      displayName: fallbackName,
      email: '',
      role: 'FELLOW',
      h4dMemberId: 'H4D-MEMBER',
      createdAt: '',
    };
  };

  const getEventIcon = (type: TrustTrailEvent['type']) => {
    switch (type) {
      case 'payment_recorded':
      case 'repayment_recorded':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'part_payment':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'peer_loan':
      case 'loan_requested':
      case 'loan_accepted':
        return <HandCoins className="w-4 h-4 text-blue-600" />;
      case 'gift_created':
      case 'debt_to_gift':
        return <Gift className="w-4 h-4 text-purple-600" />;
      case 'contribution_created':
      case 'contribution_received':
      case 'contribution_completed':
        return <HeartHandshake className="w-4 h-4 text-purple-700" />;
      case 'vouch_issued':
        return <Shield className="w-4 h-4 text-indigo-600" />;
      case 'repair_logged':
        return <MessageSquareShare className="w-4 h-4 text-amber-700" />;
      default:
        return <Footprints className="w-4 h-4 text-stone-600" />;
    }
  };

  const getEventTypeLabel = (type: TrustTrailEvent['type']) => {
    switch (type) {
      case 'payment_recorded':
        return 'Accommodation Verified';
      case 'part_payment':
        return 'Partial Repayment';
      case 'peer_loan':
        return 'Peer Loan';
      case 'gift_created':
        return 'Voluntary Gift';
      case 'debt_to_gift':
        return 'Debt-to-Gift Forgiveness';
      case 'repayment_recorded':
        return 'Loan Repaid in Full';
      case 'contribution_created':
        return 'Campaign Initiated';
      case 'contribution_received':
        return 'Contribution Added';
      case 'contribution_completed':
        return 'Campaign Target Met';
      case 'vouch_issued':
        return 'Contextual Vouch';
      case 'repair_logged':
        return 'Delay Communicated';
      case 'support_declined':
        return 'Request Declined (Valid No)';
      default:
        return 'Community Event';
    }
  };

  const filteredEvents = trailEvents.filter((event) => {
    // Type filter
    if (filterType !== 'all') {
      if (filterType === 'payments' && !['payment_recorded', 'part_payment', 'repayment_recorded'].includes(event.type)) {
        return false;
      }
      if (
        filterType === 'support' &&
        !['peer_loan', 'gift_created', 'debt_to_gift', 'contribution_created', 'contribution_received', 'contribution_completed'].includes(event.type)
      ) {
        return false;
      }
      if (filterType === 'vouches' && event.type !== 'vouch_issued') {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        event.evidenceRef.toLowerCase().includes(q) ||
        event.actorName.toLowerCase().includes(q) ||
        (event.recipientName && event.recipientName.toLowerCase().includes(q))
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FFF9EE] text-[#5A2D0C] border border-[#E7D6C1] text-xs font-semibold px-2.5 py-0.5 rounded-md">
                Append-Only Proof of Trust
              </span>
              <span className="text-xs text-stone-500">Immutable record • Human accountability</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-stone-900 mt-1.5">Trails of Trust Ledger</h1>
            <p className="text-xs text-stone-600 mt-0.5 max-w-2xl leading-relaxed">
              "People present narratives. The platform preserves facts." Every verified accommodation settlement,
              peer loan, voluntary gift, forgiven balance, and shared contribution creates an immutable trail of dignity and reliability.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#FFF9EE] border border-[#E7D6C1] p-3 rounded-xl text-xs text-[#5A2D0C]">
            <Layers className="w-5 h-5 text-[#C88D3A] shrink-0" />
            <div>
              <span className="font-bold block text-sm">{trailEvents.length} Verified Records</span>
              <span className="text-[11px] opacity-80">Append-only audit trail</span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by fellow name, evidence hash, or event details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/80 text-xs">
            {[
              { id: 'all', label: 'All Records' },
              { id: 'payments', label: 'Settlements' },
              { id: 'support', label: 'Peer Support' },
              { id: 'vouches', label: 'Vouches' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Timeline Feed */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-xs text-stone-400 bg-white rounded-2xl border border-stone-200">
            No trust trail events matching your search filter.
          </div>
        ) : (
          filteredEvents.map((event) => {
            return (
              <div
                key={event.id}
                id={`trail-event-${event.id}`}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 hover:border-stone-300 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl shrink-0 mt-0.5">
                    {getEventIcon(event.type)}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                        {getEventTypeLabel(event.type)}
                      </span>
                      <h3 className="font-bold text-sm text-stone-900">{event.title}</h3>
                    </div>

                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{event.description}</p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-stone-400">
                      <span>
                        Actor: <strong className="text-stone-700">{event.actorName}</strong>
                      </span>
                      {event.recipientName && (
                        <>
                          <span>•</span>
                          <span>
                            Recipient: <strong className="text-stone-700">{event.recipientName}</strong>
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span className="font-mono text-stone-500">Ref: {event.evidenceRef}</span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100 flex sm:flex-col justify-between items-center sm:items-end">
                  {event.amount ? (
                    <span className="text-sm font-bold text-stone-900">
                      {event.currency || '₦'}
                      {event.amount.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-stone-500">Documented</span>
                  )}
                  <span className="text-[11px] text-stone-400 mt-0.5">
                    {new Date(event.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
