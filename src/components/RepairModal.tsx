import React, { useState } from 'react';
import { Commitment, Fellow } from '../types';
import { X, MessageSquareShare, Calendar } from 'lucide-react';

interface RepairModalProps {
  commitment: Commitment;
  currentFellow: Fellow;
  onClose: () => void;
  onSubmitRepair: (commitmentId: string, revisedDate: string, notes: string) => void;
}

export const RepairModal: React.FC<RepairModalProps> = ({
  commitment,
  currentFellow,
  onClose,
  onSubmitRepair,
}) => {
  const [revisedDate, setRevisedDate] = useState<string>('2026-09-28');
  const [notes, setNotes] = useState<string>(
    'Stipend disbursement rescheduled by sponsor. Requesting 1-week timeline revision.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRepair(commitment.id, revisedDate, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#180A02]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#FAE5C5] dark:bg-[#3E200C] text-[#432006] dark:text-[#FFF9EE] rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-[#CF9F68] dark:border-[#623416] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#DDB985] dark:border-[#623416] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#FBF0DD] text-[#9F520B] rounded-md border border-[#CF9F68]">
              <MessageSquareShare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#432006] dark:text-[#FFF9EE] text-sm">Communicate Hardship & Revise Timeline</h3>
              <p className="text-[11px] text-[#72451F] dark:text-[#E5D3BA]/75">Practice transparent repair before due dates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#72451F] hover:text-[#432006] dark:text-[#E5D3BA] dark:hover:text-[#FFF9EE] p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 p-3 bg-[#FBF0DD] border border-[#CF9F68] rounded-lg text-xs text-[#9F520B] leading-relaxed">
          <div className="font-semibold flex items-center gap-1 text-[#432006] mb-1">
            <span className="text-xs" aria-hidden="true">🛖</span> Colony Principle
          </div>
          <p>
            "A missed commitment or unexpected difficulty does not permanently define a fellow.
            Communicating proactively creates verifiable evidence of honesty and judgment."
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5A3013] dark:text-[#E5D3BA] mb-1">
              Commitment Under Revision
            </label>
            <div className="text-xs text-[#432006] dark:text-[#FFF9EE] bg-[#F3D5AB] dark:bg-[#241104] p-2.5 rounded-lg border border-[#CF9F68] dark:border-[#623416]">
              <span className="font-semibold">{commitment.title}</span> • Currently Due: {commitment.dueDate}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A3013] dark:text-[#E5D3BA] mb-1">
              Proposed Revised Settlement Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={revisedDate}
                onChange={(e) => setRevisedDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-[#CF9F68] dark:border-[#623416] rounded-lg focus:ring-2 focus:ring-[#C46F18]/20 focus:border-[#C46F18] outline-none bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A3013] dark:text-[#E5D3BA] mb-1">
              Context & Communication to Roommates
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs border border-[#CF9F68] dark:border-[#623416] rounded-lg focus:ring-2 focus:ring-[#C46F18]/20 focus:border-[#C46F18] outline-none resize-none bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE]"
              placeholder="Explain the timing delay honestly (e.g. stipend payout delayed, emergency laptop repair)..."
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#DDB985] dark:border-[#623416]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#72451F] dark:text-[#E5D3BA] hover:bg-[#E8BF88] dark:hover:bg-[#2F1707] rounded-lg transition-colors border border-[#CF9F68] dark:border-[#623416] cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-submit-repair"
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-[#C46F18] hover:bg-[#9F520B] text-white rounded-lg transition-colors flex items-center gap-1.5 border-b-2 border-[#7A3F08] cursor-pointer shadow-sm"
            >
              Log Communication & Update Trail
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
