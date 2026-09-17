import React, { useState } from 'react';
import { Member } from '../domain/auth';
import { X, Shield, CheckCircle2, ShieldCheck } from 'lucide-react';

interface VouchModalProps {
  availableMembers: Member[];
  currentMember: Member;
  isDark?: boolean;
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
  isDark = false,
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
    <div className="fixed inset-0 bg-[#180A02]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#FAE5C5] dark:bg-[#3E200C] text-[#432006] dark:text-[#FFF9EE] rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-[#CF9F68] dark:border-[#623416] animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#DDB985] dark:border-[#623416] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#C46F18] rounded-xl border border-[#CF9F68] dark:border-[#623416] shadow-xs">
              <Shield className="w-4 h-4 text-[#C46F18]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#432006] dark:text-[#FFF9EE] text-base">Issue Contextual Vouch</h3>
              <p className="text-[11px] text-[#72451F] dark:text-[#E5D3BA]/75">Provide bounded trust evidence for a peer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#72451F] hover:text-[#432006] dark:text-[#E5D3BA] dark:hover:text-[#FFF9EE] p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5A3013] dark:text-[#E5D3BA] mb-1">Target Fellow</label>
            <select
              id="select-vouch-target"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#CF9F68] dark:border-[#623416] rounded-xl focus:ring-2 focus:ring-[#C46F18]/20 focus:border-[#C46F18] outline-none bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE] font-medium"
            >
              {eligibleTargets.map((f) => (
                <option key={f.id} value={f.id} className="bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE]">
                  {f.displayName} ({f.h4dMemberId || f.roles?.join(', ') || 'FELLOW'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A3013] dark:text-[#E5D3BA] mb-1">Domain Context</label>
            <select
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#CF9F68] dark:border-[#623416] rounded-xl focus:ring-2 focus:ring-[#C46F18]/20 focus:border-[#C46F18] outline-none bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE] font-medium"
            >
              <option value="Accommodation Rent Reliability" className="bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE]">Accommodation Rent Reliability</option>
              <option value="Chamber Utilities & Upkeep" className="bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE]">Chamber Utilities & Upkeep</option>
              <option value="Short-term Hardware / Laptop Support" className="bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE]">Short-term Hardware / Laptop Support</option>
              <option value="Technical Project Delivery" className="bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE]">Technical Project Delivery</option>
              <option value="Communication During Stoppages" className="bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE]">Communication During Stoppages</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A3013] dark:text-[#E5D3BA] mb-1">Confidence Rating</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setConfidence('high')}
                className={`p-2.5 rounded-xl border-2 text-xs font-bold text-center transition-all cursor-pointer ${
                  confidence === 'high'
                    ? 'border-[#5C7032] bg-[#EBF2DD] text-[#3D5A1E] dark:bg-[#34532B]/50 dark:text-[#D4E8CD] dark:border-[#58854D]'
                    : 'border-[#CF9F68] dark:border-[#623416] bg-[#FFF0D6] dark:bg-[#2F1707] text-[#5A3013] dark:text-[#E5D3BA] hover:bg-[#E8BF88] dark:hover:bg-[#3E200C]'
                }`}
              >
                High Confidence
              </button>
              <button
                type="button"
                onClick={() => setConfidence('moderate')}
                className={`p-2.5 rounded-xl border-2 text-xs font-bold text-center transition-all cursor-pointer ${
                  confidence === 'moderate'
                    ? 'border-[#3E657D] bg-[#DCE8EE] text-[#1D3E52] dark:bg-[#2B495E]/50 dark:text-[#D1E0EB] dark:border-[#437496]'
                    : 'border-[#CF9F68] dark:border-[#623416] bg-[#FFF0D6] dark:bg-[#2F1707] text-[#5A3013] dark:text-[#E5D3BA] hover:bg-[#E8BF88] dark:hover:bg-[#3E200C]'
                }`}
              >
                Moderate
              </button>
              <button
                type="button"
                onClick={() => setConfidence('cautious')}
                className={`p-2.5 rounded-xl border-2 text-xs font-bold text-center transition-all cursor-pointer ${
                  confidence === 'cautious'
                    ? 'border-[#C46F18] bg-[#FDF0DC] text-[#9F520B] dark:bg-[#A45A12]/50 dark:text-[#F8E4B8] dark:border-[#C27622]'
                    : 'border-[#CF9F68] dark:border-[#623416] bg-[#FFF0D6] dark:bg-[#2F1707] text-[#5A3013] dark:text-[#E5D3BA] hover:bg-[#E8BF88] dark:hover:bg-[#3E200C]'
                }`}
              >
                Cautious / Bounded
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A3013] dark:text-[#E5D3BA] mb-1">Commitment Scope Limit</label>
            <input
              type="text"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="e.g. Up to ₦50,000 accommodation share"
              required
              className="w-full px-3 py-2 text-xs border border-[#CF9F68] dark:border-[#623416] rounded-xl focus:ring-2 focus:ring-[#C46F18]/20 focus:border-[#C46F18] outline-none bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A3013] dark:text-[#E5D3BA] mb-1">Observation &amp; Reasoning</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-[#CF9F68] dark:border-[#623416] rounded-xl focus:ring-2 focus:ring-[#C46F18]/20 focus:border-[#C46F18] outline-none bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE]"
            />
          </div>

          {/* Explicit No Guarantor Liability Reassurance */}
          <div className="p-3 bg-[#FFF0D6] dark:bg-[#2F1707] border border-[#CF9F68] dark:border-[#623416] rounded-xl text-[11px] text-[#432006] dark:text-[#FFF9EE] flex items-start gap-2 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#C46F18] shrink-0 mt-0.5" />
            <p className="leading-tight">
              <strong>Guarantor Liability Notice:</strong> This vouch serves strictly as evidence of past demonstrated reliability. In Hut4Devs, issuing a vouch creates NO automatic financial liability or debt responsibility for the voucher.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDB985] dark:border-[#623416]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#72451F] dark:text-[#E5D3BA] hover:bg-[#E8BF88] dark:hover:bg-[#2F1707] rounded-xl cursor-pointer border border-[#CF9F68] dark:border-[#623416]"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-vouch-modal"
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-[#432006] hover:bg-[#341905] dark:bg-[#C46F18] dark:hover:bg-[#D18125] text-[#FFF0D6] dark:text-[#241104] rounded-xl border-b-4 border-[#241104] dark:border-[#7A4B0A] active:border-b active:translate-y-[2px] transition-all shadow-sm cursor-pointer"
            >
              Publish Bounded Vouch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
