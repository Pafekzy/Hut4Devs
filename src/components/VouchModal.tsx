import React, { useState } from 'react';
import { Member } from '../domain/auth';
import { X, Shield, CheckCircle2, ShieldCheck } from 'lucide-react';

interface VouchModalProps {
  availableMembers: Member[];
  currentMember: Member;
  onClose: () => void;
  onSubmitVouch: (
    targetMemberId: string,
    targetMemberName: string,
    context: string,
    confidence: 'high' | 'moderate' | 'cautious',
    scope: string,
    notes: string
  ) => void;
}

export const VouchModal: React.FC<VouchModalProps> = ({
  availableMembers,
  currentMember,
  onClose,
  onSubmitVouch,
}) => {
  const eligibleTargets = availableMembers.filter((m) => m.id !== currentMember.id);

  const [targetId, setTargetId] = useState<string>(
    eligibleTargets.length > 0 ? eligibleTargets[0].id : ''
  );
  const [context, setContext] = useState<string>('Accommodation Rent Reliability');
  const [confidence, setConfidence] = useState<'high' | 'moderate' | 'cautious'>('high');
  const [scope, setScope] = useState<string>('Up to ₦60,000 accommodation share');
  const [notes, setNotes] = useState<string>(
    'Consistently follows up and honors shared roommate timelines. Always communicates transparently.'
  );

  const targetMember = availableMembers.find((m) => m.id === targetId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId || !targetMember) return;
    onSubmitVouch(targetId, targetMember.displayName, context, confidence, scope, notes);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#FFF9EE] text-[#5A2D0C] rounded-xl border border-[#E7D6C1]">
              <Shield className="w-4 h-4 text-[#C88D3A]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Issue Contextual Vouch</h3>
              <p className="text-[11px] text-stone-500">Provide bounded trust evidence for a peer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Target Fellow</label>
            <select
              id="select-vouch-target"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white font-medium"
            >
              {eligibleTargets.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.displayName} ({f.h4dMemberId || f.roles?.join(', ') || 'FELLOW'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Domain Context</label>
            <select
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white font-medium"
            >
              <option value="Accommodation Rent Reliability">Accommodation Rent Reliability</option>
              <option value="Chamber Utilities & Upkeep">Chamber Utilities & Upkeep</option>
              <option value="Short-term Hardware / Laptop Support">Short-term Hardware / Laptop Support</option>
              <option value="Technical Project Delivery">Technical Project Delivery</option>
              <option value="Communication During Stoppages">Communication During Stoppages</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Confidence Rating</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setConfidence('high')}
                className={`p-2 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                  confidence === 'high'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                High Confidence
              </button>
              <button
                type="button"
                onClick={() => setConfidence('moderate')}
                className={`p-2 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                  confidence === 'moderate'
                    ? 'border-blue-500 bg-blue-50 text-blue-900 font-semibold'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                Moderate
              </button>
              <button
                type="button"
                onClick={() => setConfidence('cautious')}
                className={`p-2 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                  confidence === 'cautious'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-semibold'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                Cautious / Bounded
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Commitment Scope Limit</label>
            <input
              type="text"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="e.g. Up to ₦50,000 accommodation share"
              required
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Observation &amp; Reasoning</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            />
          </div>

          {/* Explicit No Guarantor Liability Reassurance */}
          <div className="p-3 bg-[#FFF9EE] border border-[#E7D6C1] rounded-xl text-[11px] text-[#5A2D0C] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C88D3A] shrink-0 mt-0.5" />
            <p className="leading-tight">
              <strong>Guarantor Liability Notice:</strong> This vouch serves strictly as evidence of past demonstrated reliability. In Hut4Devs, issuing a vouch creates NO automatic financial liability or debt responsibility for the voucher.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-vouch-modal"
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-[#5A2D0C] hover:bg-[#2F1707] text-[#FFF9EE] rounded-xl shadow-xs cursor-pointer"
            >
              Publish Bounded Vouch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
