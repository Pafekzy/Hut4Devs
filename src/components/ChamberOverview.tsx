import React, { useState } from 'react';
import { Chamber, Fellow, Commitment } from '../types';
import {
  Calendar,
  Home,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  MessageSquareShare,
  Zap,
} from 'lucide-react';

interface ChamberOverviewProps {
  chamber: Chamber;
  fellows: Fellow[];
  commitments: Commitment[];
  currentFellowId: string;
  onOpenPaymentModal: (commitment: Commitment) => void;
  onOpenRepairModal: (commitment: Commitment) => void;
  onOpenPeerSupportModal: () => void;
}

export const ChamberOverview: React.FC<ChamberOverviewProps> = ({
  chamber,
  fellows,
  commitments,
  currentFellowId,
  onOpenPaymentModal,
  onOpenRepairModal,
  onOpenPeerSupportModal,
}) => {
  const chamberFellows = fellows.filter((f) => chamber.members.includes(f.id));
  const chamberCommitments = commitments.filter((c) => c.chamberId === chamber.id);

  // Calculate totals
  const totalDue = chamberCommitments.reduce((sum, c) => sum + c.amount, 0);
  const totalPaid = chamberCommitments.reduce((sum, c) => sum + c.amountPaid, 0);
  const percentFulfilled = totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0;

  // Current user's commitments
  const myCommitments = chamberCommitments.filter((c) => c.fellowId === currentFellowId);

  const getStatusBadge = (status: Commitment['status'], revisedDate?: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 bg-[#EBF2DD] text-[#3D5A1E] border border-[#A8C782] dark:bg-[#34532B]/50 dark:text-[#D4E8CD] dark:border-[#58854D] text-xs px-2.5 py-1 rounded-full font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Honoured
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 bg-[#FBF0DD] text-[#9F520B] border border-[#CF9F68] dark:bg-[#A45A12]/50 dark:text-[#F8E4B8] dark:border-[#C46F18] text-xs px-2.5 py-1 rounded-full font-medium">
            <Clock className="w-3.5 h-3.5" />
            Partially Honoured {revisedDate ? `(Target: ${revisedDate})` : ''}
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 bg-[#FBE8E6] text-[#A63A2B] border border-[#D97768] dark:bg-[#782317]/50 dark:text-[#F7D8D5] dark:border-[#C44636] text-xs px-2.5 py-1 rounded-full font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            Hardship Communicated
          </span>
        );
      case 'extended':
        return (
          <span className="inline-flex items-center gap-1 bg-[#E2ECF3] text-[#245275] border border-[#7AA5C2] dark:bg-[#2B495E]/50 dark:text-[#D1E0EB] dark:border-[#437496] text-xs px-2.5 py-1 rounded-full font-medium">
            <Clock className="w-3.5 h-3.5" />
            Extended Date
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-[#F3D5AB] text-[#5A3013] border border-[#CF9F68] dark:bg-[#3E200C] dark:text-[#E5D3BA] dark:border-[#623416] text-xs px-2.5 py-1 rounded-full font-medium">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Chamber Banner */}
      <div className="bg-[#FAE5C5] dark:bg-[#3E200C] rounded-2xl border-2 border-[#CF9F68] dark:border-[#623416] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FBF0DD] text-[#9F520B] dark:bg-[#A45A12]/40 dark:text-[#F8E4B8] border border-[#CF9F68] text-xs font-semibold px-2.5 py-0.5 rounded-md">
                {chamber.code}
              </span>
              <span className="text-xs text-[#72451F] dark:text-[#E5D3BA]/75 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Cycle: {chamber.cycle}
              </span>
            </div>
            <h1 className="text-xl font-bold font-serif text-[#432006] dark:text-[#FFF9EE] mt-1.5">{chamber.name}</h1>
            <p className="text-xs text-[#72451F] dark:text-[#E5D3BA]/75 mt-0.5">{chamber.location}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-request-peer-support"
              onClick={onOpenPeerSupportModal}
              className="inline-flex items-center gap-1.5 bg-[#FFF0D6] hover:bg-[#E8BF88] text-[#432006] dark:bg-[#2F1707] dark:hover:bg-[#3E200C] dark:text-[#FFF9EE] text-xs font-medium px-3.5 py-2 rounded-xl transition-colors border border-[#CF9F68] dark:border-[#623416] cursor-pointer shadow-xs"
            >
              <HelpCircle className="w-4 h-4 text-[#C46F18]" />
              Request or Offer Peer Support
            </button>
          </div>
        </div>

        {/* Progress and Chamber Stats */}
        <div className="mt-6 pt-5 border-t border-[#DDB985] dark:border-[#623416] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#FFF0D6] dark:bg-[#2F1707] rounded-xl p-3.5 border border-[#CF9F68] dark:border-[#623416]">
            <span className="text-xs text-[#72451F] dark:text-[#E5D3BA]/75 font-medium">Total Accommodation Pool</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold font-mono text-[#432006] dark:text-[#FFF9EE]">
                {chamber.currency}
                {(chamber.totalMonthlyRent + chamber.totalUtilities).toLocaleString()}
              </span>
              <span className="text-xs text-[#72451F] dark:text-[#E5D3BA]/75">/ month</span>
            </div>
            <p className="text-[11px] text-[#72451F] dark:text-[#E5D3BA]/75 mt-0.5">
              Rent: {chamber.currency}
              {chamber.totalMonthlyRent.toLocaleString()} • Utilities: {chamber.currency}
              {chamber.totalUtilities.toLocaleString()}
            </p>
          </div>

          <div className="bg-[#FFF0D6] dark:bg-[#2F1707] rounded-xl p-3.5 border border-[#CF9F68] dark:border-[#623416]">
            <span className="text-xs text-[#72451F] dark:text-[#E5D3BA]/75 font-medium">Chamber Fulfillment</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-lg font-bold font-mono text-[#432006] dark:text-[#FFF9EE]">{percentFulfilled}%</span>
              <span className="text-xs text-[#3D5A1E] dark:text-[#78C2A4] font-medium">
                ({chamber.currency}
                {totalPaid.toLocaleString()} paid)
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-[#F3D5AB] dark:bg-[#623416] rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-[#C46F18] dark:bg-[#D5A04B] h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentFulfilled}%` }}
              />
            </div>
          </div>

          <div className="bg-[#FFF0D6] dark:bg-[#2F1707] rounded-xl p-3.5 border border-[#CF9F68] dark:border-[#623416]">
            <span className="text-xs text-[#72451F] dark:text-[#E5D3BA]/75 font-medium">Target Settlement Date</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-bold font-mono text-[#432006] dark:text-[#FFF9EE]">{chamber.dueDate}</span>
            </div>
            <p className="text-[11px] text-[#9F520B] dark:text-[#E5A955] mt-0.5 flex items-center gap-1">
              <span className="text-xs" aria-hidden="true">🛖</span> Direct peer settlement (No gatekeeper)
            </p>
          </div>
        </div>
      </div>

      {/* Current User's Direct Responsibility */}
      <div className="bg-[#FAE5C5] dark:bg-[#3E200C] rounded-2xl border-2 border-[#CF9F68] dark:border-[#623416] p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FBF0DD] dark:bg-[#A45A12]/40 text-[#9F520B] dark:text-[#F8E4B8] rounded-xl border border-[#CF9F68]/40">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-[#432006] dark:text-[#FFF9EE]">Your Active Accommodation Responsibilities</h2>
              <p className="text-xs text-[#72451F] dark:text-[#E5D3BA]/75">Individual commitments logged for this settlement window</p>
            </div>
          </div>
        </div>

        {myCommitments.length === 0 ? (
          <p className="text-xs text-[#72451F] dark:text-[#E5D3BA]/75 mt-4">No pending commitments found for this chamber cycle.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {myCommitments.map((com) => {
              const remaining = com.amount - com.amountPaid;
              return (
                <div
                  key={com.id}
                  id={`commitment-card-${com.id}`}
                  className="bg-[#FFF0D6] dark:bg-[#2F1707] rounded-xl p-4 border border-[#CF9F68] dark:border-[#623416] shadow-xs hover:border-[#C46F18] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-[#9F520B] dark:text-[#E5A955] uppercase tracking-wider">
                        {com.category}
                      </span>
                      <h3 className="text-sm font-semibold text-[#432006] dark:text-[#FFF9EE] mt-0.5">{com.title}</h3>
                    </div>
                    {getStatusBadge(com.status, com.revisedDueDate)}
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-[#72451F] dark:text-[#E5D3BA]/75">Total Share</span>
                      <p className="text-base font-bold font-mono text-[#432006] dark:text-[#FFF9EE]">
                        {com.currency}
                        {com.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#72451F] dark:text-[#E5D3BA]/75">Amount Paid</span>
                      <p className="text-base font-semibold font-mono text-[#3D5A1E] dark:text-[#78C2A4]">
                        {com.currency}
                        {com.amountPaid.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {remaining > 0 && (
                    <div className="mt-2.5 p-2 bg-[#F3D5AB] dark:bg-[#3E200C] rounded-lg text-xs flex justify-between items-center border border-[#CF9F68] dark:border-[#623416]">
                      <span className="text-[#5A3013] dark:text-[#E5D3BA]">Remaining Due:</span>
                      <span className="font-bold font-mono text-[#9F520B] dark:text-[#E5A955]">
                        {com.currency}
                        {remaining.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {com.repairNotes && (
                    <div className="mt-2.5 p-2.5 bg-[#FBF0DD] dark:bg-[#3E200C] border border-[#CF9F68]/60 dark:border-[#C46F18]/50 rounded-lg text-[11px] text-[#9F520B] dark:text-[#F8E4B8]">
                      <span className="font-semibold flex items-center gap-1">
                        <MessageSquareShare className="w-3.5 h-3.5" /> Note to Roommates:
                      </span>
                      <p className="mt-0.5">{com.repairNotes}</p>
                    </div>
                  )}

                  {com.paymentReference && (
                    <div className="mt-2 text-[11px] text-[#72451F] dark:text-[#E5D3BA]/75 flex items-center gap-1 font-mono">
                      <ShieldCheck className="w-3 h-3 text-[#3D5A1E] dark:text-[#78C2A4]" /> Ref: {com.paymentReference}
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-[#DDB985] dark:border-[#623416] flex items-center gap-2">
                    {remaining > 0 ? (
                      <>
                        <button
                          id={`btn-record-payment-${com.id}`}
                          onClick={() => onOpenPaymentModal(com)}
                          className="flex-1 bg-[#432006] hover:bg-[#341905] text-[#FFF0D6] dark:bg-[#C46F18] dark:hover:bg-[#D18125] dark:text-[#241104] text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Record Payment
                        </button>
                        <button
                          id={`btn-communicate-hardship-${com.id}`}
                          onClick={() => onOpenRepairModal(com)}
                          className="bg-[#FFF0D6] hover:bg-[#E8BF88] text-[#72451F] dark:bg-[#2F1707] dark:hover:bg-[#3E200C] dark:text-[#E5D3BA] text-xs font-medium py-2 px-3 rounded-lg transition-colors border border-[#CF9F68] dark:border-[#623416] cursor-pointer"
                          title="Communicate delay or request revised timeline"
                        >
                          Revise Timeline
                        </button>
                      </>
                    ) : (
                      <div className="w-full text-center py-1 text-xs text-[#3D5A1E] dark:text-[#C1F5E8] font-medium bg-[#EBF2DD] dark:bg-[#34532B]/50 rounded-lg border border-[#A8C782] dark:border-[#58854D] flex items-center justify-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> Obligation Honoured for Cycle
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Roommates / Chamber Fellows Status */}
      <div className="bg-[#FAE5C5] dark:bg-[#3E200C] rounded-2xl border-2 border-[#CF9F68] dark:border-[#623416] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold font-serif text-[#432006] dark:text-[#FFF9EE]">Chamber Roommates & Collective Accountability</h2>
            <p className="text-xs text-[#72451F] dark:text-[#E5D3BA]/75">
              Clear expectations without shaming. Direct peer accountability built on dignity.
            </p>
          </div>
          <span className="text-xs font-medium text-[#72451F] dark:text-[#E5D3BA]/75">{chamberFellows.length} Fellows</span>
        </div>

        <div className="divide-y divide-[#DDB985] dark:divide-[#623416]">
          {chamberFellows.map((fellow) => {
            const fellowCommitments = chamberCommitments.filter((c) => c.fellowId === fellow.id);
            const fellowDue = fellowCommitments.reduce((s, c) => s + c.amount, 0);
            const fellowPaid = fellowCommitments.reduce((s, c) => s + c.amountPaid, 0);
            const isSettled = fellowPaid >= fellowDue && fellowDue > 0;
            const isPartial = fellowPaid > 0 && fellowPaid < fellowDue;
            const isOverdue = fellow.hasOverdueObligation;

            return (
              <div key={fellow.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img
                    src={fellow.avatar}
                    alt={fellow.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#CF9F68] dark:border-[#623416]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#432006] dark:text-[#FFF9EE]">{fellow.name}</span>
                      <span className="text-xs text-[#72451F] dark:text-[#E5D3BA]/75 font-mono">{fellow.handle}</span>
                      <span className="bg-[#F3D5AB] dark:bg-[#2F1707] text-[#5A3013] dark:text-[#E5D3BA] text-[10px] px-1.5 py-0.5 rounded border border-[#CF9F68] dark:border-[#623416]">
                        {fellow.role}
                      </span>
                    </div>
                    <p className="text-xs text-[#72451F] dark:text-[#E5D3BA]/75 mt-0.5">{fellow.bio}</p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-[#72451F] dark:text-[#E5D3BA]/75">
                      <span>Schedule: {fellow.stipendSchedule}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5">
                  <div className="text-right">
                    <span className="text-xs text-[#72451F] dark:text-[#E5D3BA]/75">Contribution: </span>
                    <span className="text-xs font-bold font-mono text-[#432006] dark:text-[#FFF9EE]">
                      {chamber.currency}
                      {fellowPaid.toLocaleString()} / {chamber.currency}
                      {fellowDue.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    {isSettled && (
                      <span className="inline-flex items-center gap-1 text-[#3D5A1E] dark:text-[#C1F5E8] bg-[#EBF2DD] dark:bg-[#34532B]/50 px-2.5 py-0.5 rounded-full text-xs font-medium border border-[#A8C782] dark:border-[#58854D]">
                        <CheckCircle2 className="w-3 h-3" /> Fully Settled
                      </span>
                    )}
                    {isPartial && (
                      <span className="inline-flex items-center gap-1 text-[#9F520B] dark:text-[#F8E4B8] bg-[#FBF0DD] dark:bg-[#A45A12]/50 px-2.5 py-0.5 rounded-full text-xs font-medium border border-[#CF9F68]">
                        <Clock className="w-3 h-3" /> 50% Paid (Staged)
                      </span>
                    )}
                    {isOverdue && (
                      <span className="inline-flex items-center gap-1 text-[#A63A2B] dark:text-[#F7D8D5] bg-[#FBE8E6] dark:bg-[#782317]/50 px-2.5 py-0.5 rounded-full text-xs font-medium border border-[#D97768]">
                        <AlertCircle className="w-3 h-3" /> Repair in Progress
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
