import React, { useState } from 'react';
import { PeerVouch } from '../domain/peerSupport';
import { Member } from '../domain/auth';
import { Shield, Plus, CheckCircle2, AlertCircle, Info, Calendar, ShieldCheck } from 'lucide-react';
import { VouchModal } from './VouchModal';

interface VouchSectionProps {
  vouches: PeerVouch[];
  availableMembers: Member[];
  currentMember: Member;
  onAddVouch: (
    targetMemberId: string,
    targetMemberName: string,
    context: string,
    confidence: 'high' | 'moderate' | 'cautious',
    scope: string,
    notes: string
  ) => void;
}

export const VouchSection: React.FC<VouchSectionProps> = ({
  vouches,
  availableMembers,
  currentMember,
  onAddVouch,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getMember = (id: string, nameFallback: string) => {
    return availableMembers.find((m) => m.id === id) || {
      id,
      displayName: nameFallback,
      email: '',
      role: 'FELLOW',
      h4dMemberId: 'H4D-MEMBER',
      createdAt: '',
    };
  };

  const getConfidenceBadge = (confidence: PeerVouch['confidence']) => {
    switch (confidence) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
            <CheckCircle2 className="w-3 h-3" /> High Confidence
          </span>
        );
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
            <Info className="w-3 h-3" /> Moderate Confidence
          </span>
        );
      case 'cautious':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
            <AlertCircle className="w-3 h-3" /> Cautious / Bounded
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Vouching Philosophy Banner */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FFF9EE] text-[#5A2D0C] border border-[#E7D6C1] text-xs font-semibold px-2.5 py-0.5 rounded-md">
                Distributed Peer Confidence
              </span>
              <span className="text-xs text-stone-500">Contextual • No universal scores</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-stone-900 mt-1.5">Contextual Vouching Matrix</h1>
            <p className="text-xs text-stone-600 mt-0.5 max-w-2xl leading-relaxed">
              When a fellow needs context before lending or coordinating, they consult trusted peers.
              A vouch is never a blank check: it states who vouches for whom, in what specific domain,
              at what confidence level, with zero automatic guarantor liability.
            </p>
          </div>

          <button
            id="btn-issue-vouch"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#5A2D0C] hover:bg-[#2F1707] text-[#FFF9EE] text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C88D3A]" />
            Issue Contextual Vouch
          </button>
        </div>

        <div className="mt-4 p-3.5 bg-[#FFF9EE] rounded-xl border border-[#E7D6C1] flex items-start gap-2.5 text-xs text-[#5A2D0C]">
          <span className="text-sm shrink-0 mt-0.5" aria-hidden="true">🛖</span>
          <p className="leading-relaxed">
            <strong>Hut4Devs Vouching Invariant:</strong> A vouch means "Fellow A vouches for Fellow B in domain X with confidence Y for scope Z". It does NOT create financial guarantor liability or universal reputation points. Declining to vouch ("No") is always legitimate and non-punitive.
          </p>
        </div>
      </div>

      {/* Vouches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vouches.map((vouch) => {
          const voucher = getMember(vouch.voucherMemberId, vouch.voucherMemberName);
          const target = getMember(vouch.targetMemberId, vouch.targetMemberName);

          return (
            <div
              key={vouch.id}
              id={`vouch-card-${vouch.id}`}
              className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs hover:border-amber-400/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#5A2D0C] text-[#FFF9EE] font-bold text-sm flex items-center justify-center border border-amber-300">
                      {target.displayName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">Vouch For</div>
                      <h3 className="font-bold text-sm text-stone-900 leading-tight">{target.displayName}</h3>
                      <span className="text-[11px] text-stone-500 font-mono">{target.h4dMemberId || 'H4D-MEMBER'}</span>
                    </div>
                  </div>
                  {getConfidenceBadge(vouch.confidence)}
                </div>

                <div className="mt-3.5 space-y-2 text-xs">
                  <div>
                    <span className="text-stone-400 font-medium">Domain Context:</span>
                    <p className="font-semibold text-stone-800 mt-0.5">{vouch.context}</p>
                  </div>

                  <div>
                    <span className="text-stone-400 font-medium">Commitment Scope:</span>
                    <p className="text-stone-700 font-mono text-[11px] mt-0.5">{vouch.commitmentScope}</p>
                  </div>

                  <div>
                    <span className="text-stone-400 font-medium">Voucher Statement:</span>
                    <p className="text-stone-600 italic bg-stone-50 p-2.5 rounded-xl border border-stone-100 mt-1 leading-relaxed">
                      "{vouch.notes}"
                    </p>
                  </div>

                  {vouch.disclaimer && (
                    <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{vouch.disclaimer}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-stone-300 text-stone-700 text-[9px] font-bold flex items-center justify-center">
                    {voucher.displayName.charAt(0)}
                  </div>
                  <span>Vouched by <strong className="text-stone-800">{voucher.displayName}</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {vouch.createdAt.split('T')[0]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <VouchModal
          availableMembers={availableMembers}
          currentMember={currentMember}
          onClose={() => setIsModalOpen(false)}
          onSubmitVouch={(targetId, targetName, context, confidence, scope, notes) => {
            onAddVouch(targetId, targetName, context, confidence, scope, notes);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
