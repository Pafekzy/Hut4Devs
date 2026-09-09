import React, { useState } from 'react';
import { Fellow } from '../types';
import { X, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface VouchModalProps {
  fellows: Fellow[];
  currentFellowId: string;
  onClose: () => void;
  onSubmitVouch: (
    targetFellowId: string,
    context: string,
    confidence: 'high' | 'moderate' | 'cautious',
    scope: string,
    notes: string
  ) => void;
}

export const VouchModal: React.FC<VouchModalProps> = ({
  fellows,
  currentFellowId,
  onClose,
  onSubmitVouch,
}) => {
  const eligibleTargets = fellows.filter((f) => f.id !== currentFellowId);

  const [targetId, setTargetId] = useState<string>(
    eligibleTargets.length > 0 ? eligibleTargets[0].id : ''
  );
  const [context, setContext] = useState<string>('Accommodation Rent Reliability');
  const [confidence, setConfidence] = useState<'high' | 'moderate' | 'cautious'>('high');
  const [scope, setScope] = useState<string>('Up to ₦60,000 accommodation share');
  const [notes, setNotes] = useState<string>(
    'Consistently follows up and honors shared roommate timelines. Always communicates transparently.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) return;
    onSubmitVouch(targetId, context, confidence, scope, notes);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 text-amber-900 rounded-md">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Issue Contextual Vouch</h3>
              <p className="text-[11px] text-stone-500">Provide bounded trust evidence for a peer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Target Fellow</label>
            <select
              id="select-vouch-target"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white"
            >
              {eligibleTargets.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Domain Context</label>
            <select
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white"
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
                className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                  confidence === 'high'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                High
              </button>
              <button
                type="button"
                onClick={() => setConfidence('moderate')}
                className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                  confidence === 'moderate'
                    ? 'bg-blue-50 border-blue-500 text-blue-800'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                Moderate
              </button>
              <button
                type="button"
                onClick={() => setConfidence('cautious')}
                className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                  confidence === 'cautious'
                    ? 'bg-amber-50 border-amber-500 text-amber-800'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                Cautious
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Commitment Scope & Limits
            </label>
            <input
              type="text"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              required
              placeholder="e.g. Up to ₦50,000 or monthly chamber dues"
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Rationale & Statement
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none"
              placeholder="Provide concrete evidence or observations..."
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-vouch-modal"
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sign & Register Vouch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
