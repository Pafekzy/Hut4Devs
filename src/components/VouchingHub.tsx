import React, { useState } from 'react';
import { ContextualVouch, Member } from '../types';
import { ShieldCheck, Plus, CheckCircle2, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface VouchingHubProps {
  vouches: ContextualVouch[];
  currentUser: Member;
  allMembers: Member[];
  onAddVouch: (vouch: Omit<ContextualVouch, 'id' | 'timestamp'>) => void;
}

export const VouchingHub: React.FC<VouchingHubProps> = ({
  vouches,
  currentUser,
  allMembers,
  onAddVouch,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [targetMemberId, setTargetMemberId] = useState(allMembers.find(m => m.id !== currentUser.id)?.id || '');
  const [context, setContext] = useState('Chamber Rent & Utility Accountability');
  const [confidenceLevel, setConfidenceLevel] = useState<'high' | 'solid' | 'cautious'>('high');
  const [commitmentRef, setCommitmentRef] = useState('Chamber 4B monthly shared responsibilities');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMember = allMembers.find(m => m.id === targetMemberId);
    if (!targetMember) return;

    onAddVouch({
      voucherId: currentUser.id,
      voucherName: currentUser.name,
      voucherAvatar: currentUser.avatar,
      targetMemberId: targetMember.id,
      targetMemberName: targetMember.name,
      context,
      confidenceLevel,
      commitmentReference: commitmentRef,
      note: note || 'Demonstrated reliable follow-through during shared chamber tasks.',
    });

    setModalOpen(false);
    setNote('');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Distributed Trust Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Contextual Vouching Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Trust is never universal. A fellow vouches for another fellow in a specific context (e.g., rent, project sprint) at a specific confidence level, without guarantor liability.
          </p>
        </div>

        <button
          id="btn-submit-vouch"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-sm active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Vouch for a Fellow</span>
        </button>
      </div>

      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            The Contextual Vouch Standard
          </h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono text-center">
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Actor</span>
            <span className="font-bold text-slate-900 dark:text-white">A (Voucher)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Subject</span>
            <span className="font-bold text-slate-900 dark:text-white">B (Fellow)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Context</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Context X</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Confidence</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Level Y</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[10px] uppercase">Commitment</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">Ref Z</span>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
          "A vouch informs decisions — it does not replace human judgment. Vouching does NOT make you a financial guarantor. Refusing to vouch is also respected as prudent judgment."
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Active Contextual Vouches</span>
          <span className="text-xs font-mono font-normal text-slate-400">({vouches.length} Verified)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vouches.map((vouch) => {
            const isConfidenceHigh = vouch.confidenceLevel === 'high';
            const isConfidenceSolid = vouch.confidenceLevel === 'solid';

            return (
              <div
                key={vouch.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <img
                        src={vouch.voucherAvatar}
                        alt={vouch.voucherName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {vouch.voucherName}
                        </span>
                        <span className="text-[10px] text-slate-400 block">Voucher</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 mx-1" />
                      <div className="text-right">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {vouch.targetMemberName}
                        </span>
                        <span className="text-[10px] text-slate-400 block">Vouchee</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      isConfidenceHigh
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                        : isConfidenceSolid
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                        : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                    }`}>
                      {vouch.confidenceLevel.toUpperCase()} CONFIDENCE
                    </span>
                  </div>

                  <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Validated Context:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {vouch.context}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Commitment Ref:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        {vouch.commitmentReference}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    "{vouch.note}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {vouch.timestamp}
                  </span>
                  <span className="text-emerald-500 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified On-Trail
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Submit a Contextual Vouch
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Remember: You are vouching for a specific behavior in a specific context, not certifying universal character.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Fellow to Vouch For
                </label>
                <select
                  value={targetMemberId}
                  onChange={(e) => setTargetMemberId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  {allMembers.filter(m => m.id !== currentUser.id).map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role}) — {m.roomNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Context of Interaction
                </label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. Chamber Rent Accountability, Open-Source Sprint, Hardware Care"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Confidence Level
                  </label>
                  <select
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  >
                    <option value="high">High Confidence (Extensive experience)</option>
                    <option value="solid">Solid (Observed direct consistency)</option>
                    <option value="cautious">Cautious (Early or limited context)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Commitment Reference
                  </label>
                  <input
                    type="text"
                    value={commitmentRef}
                    onChange={(e) => setCommitmentRef(e.target.value)}
                    placeholder="e.g. Chamber Rent Aug-Sept"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contextual Note (Why do you vouch in this context?)
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Describe the demonstrated responsibility without exaggeration..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                >
                  Anchor Vouch to Trail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
