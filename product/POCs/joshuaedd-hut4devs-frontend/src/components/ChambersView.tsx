import React from 'react';
import { Chamber, Member } from '../types';
import { Calendar, Users, Zap, CheckCircle, Clock, ArrowUpRight, DollarSign, ShieldAlert, RefreshCw } from 'lucide-react';

interface ChambersViewProps {
  chamber: Chamber;
  currentUser: Member;
  onOpenRecordPayment: (category: string, amount: number, title: string) => void;
  onOpenPeerSupport: (category: 'rent' | 'utilities') => void;
  onOpenRepairModal: () => void;
}

export const ChambersView: React.FC<ChambersViewProps> = ({
  chamber,
  currentUser,
  onOpenRecordPayment,
  onOpenPeerSupport,
  onOpenRepairModal,
}) => {
  const perFellowRent = chamber.totalMonthlyRent / chamber.members.length;

  const fellowPaymentStatuses: Record<string, { paid: boolean; paidDate?: string; method?: string; note?: string }> = {
    'usr-1': { paid: true, paidDate: 'Sept 15, 2026', method: 'Direct ACH', note: 'Bridged with peer loan earlier' },
    'usr-2': { paid: true, paidDate: 'Sept 12, 2026', method: 'Bank Transfer' },
    'usr-3': { paid: false, note: 'Stipend arriving Sept 28th' },
    'usr-4': { paid: true, paidDate: 'Sept 14, 2026', method: 'Mobile Money' },
  };

  const totalCollected = Object.values(fellowPaymentStatuses).filter((s) => s.paid).length * perFellowRent;
  const collectionPercent = Math.round((totalCollected / chamber.totalMonthlyRent) * 100);

  return (
    <div className="space-y-6">
      
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-700/50 shadow-xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Accommodation: The First Proving Ground</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {chamber.name}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Shared rent, utilities, timing synchronization, and peer accountability for tech fellows.
              <span className="block text-xs text-slate-400 mt-1">
                📍 {chamber.address} • {chamber.unit}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-pay-rent-share"
              onClick={() => onOpenRecordPayment('rent', perFellowRent, 'October Shared Chamber Rent')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md active:scale-98"
            >
              <DollarSign className="w-4 h-4" />
              <span>Settle My Rent Share (${perFellowRent})</span>
            </button>
            <button
              id="btn-request-stipend-bridge"
              onClick={() => onOpenPeerSupport('rent')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
              <span>Request Peer Bridge</span>
            </button>
            <button
              id="btn-open-repair-flow"
              onClick={onOpenRepairModal}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
              title="Report schedule delay early to protect trust"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Report Delay / Repair</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-xs text-slate-400">Total Monthly Rent</span>
            <p className="text-xl font-bold font-mono text-white">
              ${chamber.totalMonthlyRent.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Current Collection</span>
            <p className="text-xl font-bold font-mono text-emerald-400">
              ${totalCollected.toLocaleString()} ({collectionPercent}%)
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Next Master Due Date</span>
            <p className="text-base font-semibold text-white flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              {chamber.nextDueDate}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Chamber Status</span>
            <p className="text-sm font-semibold text-emerald-300 flex items-center gap-1.5 mt-0.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Active Cycle Verified</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Fellows & Stipend Timing Synchronization</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transparent stipend dates prevent false assumptions and enable proactive peer bridges
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {chamber.members.length} Fellows Assigned
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {chamber.members.map((member) => {
              const status = fellowPaymentStatuses[member.id] || { paid: false };
              const isCurrentUser = member.id === currentUser.id;

              return (
                <div
                  key={member.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrentUser
                      ? 'bg-slate-50 dark:bg-slate-900/90 border-emerald-500/50 shadow-xs ring-1 ring-emerald-500/20'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                        />
                        {isCurrentUser && (
                          <span className="absolute -top-1 -right-1 px-1 py-0.2 text-[9px] font-bold uppercase rounded bg-emerald-500 text-slate-950">
                            You
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {member.name}
                          <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                            {member.roomNumber}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {status.paid ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle className="w-3 h-3" />
                        <span>Settled</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        <Clock className="w-3 h-3" />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">Stipend Schedule:</span>
                      <span className="font-mono font-medium">{member.stipendSchedule || member.stipendFrequency || 'Monthly'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">Rent Contribution:</span>
                      <span className="font-mono font-semibold">${perFellowRent}/mo</span>
                    </div>
                    {status.note && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded">
                        💡 {status.note}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-950/30 flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-semibold text-blue-900 dark:text-blue-300">
                Why Timing Friction Matters in Accommodation
              </span>
              <p className="text-blue-800/80 dark:text-blue-400/90 leading-relaxed">
                Rent is universally due on the 1st or 25th, but stipend payouts hit on the 28th or alternate Fridays. In traditional systems, this causes embarrassing debt notices or panicked screenshot transfers. In Hut4Devs, peers bridge each other transparently with verifiable trust trails.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span>Chamber Utilities Pool</span>
            </h2>
            <button
              onClick={() => onOpenPeerSupport('utilities')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Propose Pool
            </button>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-4">
            {chamber.utilities.map((util, i) => (
              <div key={i} className="space-y-2 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {util.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    ${util.amount}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>${util.splitPerPerson} per fellow</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    util.status === 'collected'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                  }`}>
                    {util.status === 'collected' ? 'All Collected' : 'Collection in Progress'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">Due: {util.dueDate}</span>
                  {util.status !== 'collected' && (
                    <button
                      onClick={() => onOpenRecordPayment('utilities', util.splitPerPerson, util.name)}
                      className="text-xs font-medium px-2 py-1 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90"
                    >
                      Pay My ${util.splitPerPerson}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-400">
                Receipts automatically anchored to the Chamber Trail of Trust
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Hut4Devs Repair Philosophy</span>
            </div>
            <p className="text-xs text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
              "A missed commitment should not permanently define someone." If your stipend is late, use the Repair Protocol to communicate before the due date, agree on a new timestamp, and preserve your trust trail.
            </p>
            <button
              onClick={onOpenRepairModal}
              className="w-full mt-1 py-1.5 px-3 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
            >
              Start Repair / Adjustment Workflow
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
