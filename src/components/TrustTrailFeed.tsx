import React, { useState } from 'react';
import { TrustTrailEvent, Fellow } from '../types';
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
  Sparkles,
  Layers,
} from 'lucide-react';

interface TrustTrailFeedProps {
  trailEvents: TrustTrailEvent[];
  fellows: Fellow[];
}

export const TrustTrailFeed: React.FC<TrustTrailFeedProps> = ({ trailEvents, fellows }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getFellow = (id: string) => fellows.find((f) => f.id === id);

  const getEventIcon = (type: TrustTrailEvent['type']) => {
    switch (type) {
      case 'payment_recorded':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'part_payment':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'peer_loan':
        return <HandCoins className="w-4 h-4 text-blue-600" />;
      case 'peer_gift':
      case 'debt_to_gift':
        return <Gift className="w-4 h-4 text-purple-600" />;
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
        return 'Settlement Honoured';
      case 'part_payment':
        return 'Partial Payment';
      case 'peer_loan':
        return 'Peer Loan';
      case 'peer_gift':
        return 'Voluntary Gift';
      case 'debt_to_gift':
        return 'Debt Forgiven (Gift)';
      case 'repayment_recorded':
        return 'Loan Repaid';
      case 'vouch_issued':
        return 'Contextual Vouch';
      case 'repair_logged':
        return 'Hardship Communicated';
      default:
        return 'Colony Event';
    }
  };

  const filteredEvents = trailEvents.filter((event) => {
    // Type filter
    if (filterType !== 'all') {
      if (filterType === 'payments' && !['payment_recorded', 'part_payment'].includes(event.type)) {
        return false;
      }
      if (
        filterType === 'support' &&
        !['peer_loan', 'peer_gift', 'debt_to_gift', 'repayment_recorded'].includes(event.type)
      ) {
        return false;
      }
      if (filterType === 'vouches' && event.type !== 'vouch_issued') {
        return false;
      }
      if (filterType === 'repairs' && event.type !== 'repair_logged') {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const actor = getFellow(event.actorId);
      const recipient = event.recipientId ? getFellow(event.recipientId) : null;
      return (
        event.title.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        event.evidenceRef.toLowerCase().includes(q) ||
        (actor && actor.name.toLowerCase().includes(q)) ||
        (recipient && recipient.name.toLowerCase().includes(q))
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                Verifiable Ledger
              </span>
              <span className="text-xs text-stone-500">Immutable chronological activity</span>
            </div>
            <h1 className="text-xl font-bold text-stone-900 mt-1.5">Trails of Trust</h1>
            <p className="text-xs text-stone-600 mt-0.5 max-w-2xl leading-relaxed">
              "A payment is an event. A commitment gives that event meaning. A trust trail connects
              the two." Every accommodation payment, partial fulfillment, peer support, debt-to-gift
              forgiveness, and honest repair creates verifiable evidence over time.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-lg text-xs">
            <Layers className="w-4 h-4 text-amber-600" />
            <div>
              <span className="font-bold text-stone-900">{trailEvents.length}</span>
              <span className="text-stone-500 ml-1">Total Trail Events</span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Trails' },
              { id: 'payments', label: 'Accommodation Payments' },
              { id: 'support', label: 'Peer Support & Loans' },
              { id: 'vouches', label: 'Vouches' },
              { id: 'repairs', label: 'Repairs & Communications' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterType === f.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trail or proof ref..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs">
        <h2 className="text-base font-bold text-stone-900 mb-4">Trail Chronology</h2>

        <div className="relative pl-6 border-l-2 border-stone-200 space-y-6">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-10 text-xs text-stone-400">
              No trust trail events found matching the criteria.
            </div>
          ) : (
            filteredEvents.map((event) => {
              const actor = getFellow(event.actorId);
              const recipient = event.recipientId ? getFellow(event.recipientId) : null;

              return (
                <div
                  key={event.id}
                  id={`trail-event-${event.id}`}
                  className="relative group"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1 w-5 h-5 rounded-full bg-white border-2 border-stone-300 group-hover:border-amber-500 flex items-center justify-center transition-colors shadow-2xs">
                    <div className="w-2 h-2 rounded-full bg-stone-400 group-hover:bg-amber-500" />
                  </div>

                  <div className="bg-stone-50/70 hover:bg-stone-50 border border-stone-200/80 rounded-xl p-4 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        {getEventIcon(event.type)}
                        <span className="text-xs font-semibold text-stone-900">{event.title}</span>
                        <span className="bg-stone-200/70 text-stone-700 text-[10px] font-mono px-2 py-0.5 rounded">
                          {getEventTypeLabel(event.type)}
                        </span>
                      </div>

                      <div className="text-[11px] text-stone-400 font-mono">
                        {new Date(event.timestamp).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 mt-2 leading-relaxed">{event.description}</p>

                    {/* Parties and Verification Footer */}
                    <div className="mt-3 pt-2.5 border-t border-stone-200/50 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-2 text-stone-600">
                        {actor && (
                          <span className="flex items-center gap-1 font-medium text-stone-900">
                            <img
                              src={actor.avatar}
                              alt={actor.name}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            {actor.name}
                          </span>
                        )}
                        {recipient && (
                          <>
                            <span className="text-stone-400">→</span>
                            <span className="flex items-center gap-1 font-medium text-stone-900">
                              <img
                                src={recipient.avatar}
                                alt={recipient.name}
                                className="w-4 h-4 rounded-full object-cover"
                              />
                              {recipient.name}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-stone-500 font-mono bg-white px-2 py-0.5 rounded border border-stone-200 text-[10px] flex items-center gap-1">
                          Ref: {event.evidenceRef}
                        </span>

                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3" />
                          {event.verificationStatus === 'verified' ? 'Verified Proof' : 'Acknowledged'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
