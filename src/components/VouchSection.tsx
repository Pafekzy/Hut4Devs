import React, { useState } from 'react';
import { Vouch, Fellow } from '../types';
import { Shield, Plus, CheckCircle2, AlertCircle, Info, Calendar, Sparkles } from 'lucide-react';
import { VouchModal } from './VouchModal';

interface VouchSectionProps {
  vouches: Vouch[];
  fellows: Fellow[];
  currentFellowId: string;
  onAddVouch: (targetFellowId: string, context: string, confidence: 'high' | 'moderate' | 'cautious', scope: string, notes: string) => void;
}

export const VouchSection: React.FC<VouchSectionProps> = ({
  vouches,
  fellows,
  currentFellowId,
  onAddVouch,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getFellow = (id: string) => fellows.find((f) => f.id === id) || fellows[0];

  const getConfidenceBadge = (confidence: Vouch['confidence']) => {
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
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                Distributed Trust
              </span>
              <span className="text-xs text-stone-500">Contextual • Not universal scores</span>
            </div>
            <h1 className="text-xl font-bold text-stone-900 mt-1.5">Contextual Vouching Matrix</h1>
            <p className="text-xs text-stone-600 mt-0.5 max-w-2xl leading-relaxed">
              When a fellow needs context before lending or coordinating, they consult trusted peers.
              A vouch is never a blank check: it states who vouches for whom, in what specific domain,
              at what confidence level, without automatic guarantor liability.
            </p>
          </div>

          <button
            id="btn-issue-vouch"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Issue Contextual Vouch
          </button>
        </div>

        <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200/60 flex items-start gap-2.5 text-xs text-stone-600">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Colony Definition:</strong> A vouch means "A vouches for B in context X at confidence Y
            for commitment Z at time T". It does not mean "this person is universally trustworthy".
            Declining to vouch is an exercise of honest judgment, not betrayal.
          </p>
        </div>
      </div>

      {/* Vouches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vouches.map((vouch) => {
          const voucher = getFellow(vouch.voucherId);
          const target = getFellow(vouch.targetFellowId);

          return (
            <div
              key={vouch.id}
              id={`vouch-card-${vouch.id}`}
              className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs hover:border-amber-400/80 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={target.avatar}
                      alt={target.name}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <div className="text-xs text-stone-400">Vouch For</div>
                      <h3 className="font-bold text-sm text-stone-900 leading-tight">{target.name}</h3>
                      <span className="text-[11px] text-stone-500 font-mono">{target.handle}</span>
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
                    <p className="text-stone-600 italic bg-stone-50 p-2.5 rounded border border-stone-100 mt-1 leading-relaxed">
                      "{vouch.notes}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <img
                    src={voucher.avatar}
                    alt={voucher.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>Vouched by <strong className="text-stone-800">{voucher.name}</strong></span>
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
          fellows={fellows}
          currentFellowId={currentFellowId}
          onClose={() => setIsModalOpen(false)}
          onSubmitVouch={(targetId, context, confidence, scope, notes) => {
            onAddVouch(targetId, context, confidence, scope, notes);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
