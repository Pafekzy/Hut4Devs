import React, { useState } from 'react';
import { Fellow, SupportType } from '../types';
import { X, HandCoins, Gift, HeartHandshake, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

interface PeerSupportModalProps {
  fellows: Fellow[];
  currentFellowId: string;
  onClose: () => void;
  onSubmitSupport: (
    toFellowId: string,
    type: SupportType,
    amount: number,
    purpose: string,
    repaymentDate?: string,
    notes?: string
  ) => void;
}

export const PeerSupportModal: React.FC<PeerSupportModalProps> = ({
  fellows,
  currentFellowId,
  onClose,
  onSubmitSupport,
}) => {
  const currentFellow = fellows.find((f) => f.id === currentFellowId) || fellows[0];
  const eligibleRecipients = fellows.filter((f) => f.id !== currentFellowId);

  const [toFellowId, setToFellowId] = useState<string>(
    eligibleRecipients.length > 0 ? eligibleRecipients[0].id : ''
  );
  const [supportType, setSupportType] = useState<SupportType>('loan');
  const [amount, setAmount] = useState<number>(20000);
  const [purpose, setPurpose] = useState<string>('Bridge accommodation balance until stipend release');
  const [repaymentDate, setRepaymentDate] = useState<string>('2026-09-30');
  const [notes, setNotes] = useState<string>('Direct arrangement between peers with mutual clarity.');

  const recipientFellow = fellows.find((f) => f.id === toFellowId);
  const isRecipientOverdue = recipientFellow?.hasOverdueObligation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !toFellowId) return;

    onSubmitSupport(
      toFellowId,
      supportType,
      amount,
      purpose,
      supportType === 'loan' ? repaymentDate : undefined,
      notes
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 text-amber-900 rounded-md">
              <HandCoins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Initiate Peer Support</h3>
              <p className="text-[11px] text-stone-500">Direct peer-to-peer agreement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Culture Tenet Callout */}
        <div className="mt-3 p-3 bg-stone-50 border border-stone-200/80 rounded-lg text-[11px] text-stone-700 space-y-1">
          <div className="font-semibold text-stone-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Colony Mutualism Rule
          </div>
          <p>
            "Asking for help is not weakness. Helping is not ownership. Declining to lend or support
            is always safe and does not create negative recognition."
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Support Type Tabs */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Support Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSupportType('loan')}
                className={`p-2.5 rounded-lg border text-left transition-all text-xs flex flex-col gap-1 ${
                  supportType === 'loan'
                    ? 'border-blue-500 bg-blue-50/60 text-blue-950 font-medium'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1 font-semibold text-blue-900">
                  <HandCoins className="w-3.5 h-3.5" /> Peer Loan
                </div>
                <span className="text-[10px] text-stone-500 leading-tight">Repayment expected</span>
              </button>

              <button
                type="button"
                onClick={() => setSupportType('gift')}
                className={`p-2.5 rounded-lg border text-left transition-all text-xs flex flex-col gap-1 ${
                  supportType === 'gift'
                    ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-medium'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1 font-semibold text-emerald-900">
                  <Gift className="w-3.5 h-3.5" /> Peer Gift
                </div>
                <span className="text-[10px] text-stone-500 leading-tight">Zero repayment</span>
              </button>

              <button
                type="button"
                onClick={() => setSupportType('contribution')}
                className={`p-2.5 rounded-lg border text-left transition-all text-xs flex flex-col gap-1 ${
                  supportType === 'contribution'
                    ? 'border-purple-500 bg-purple-50/60 text-purple-950 font-medium'
                    : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1 font-semibold text-purple-900">
                  <HeartHandshake className="w-3.5 h-3.5" /> Contribution
                </div>
                <span className="text-[10px] text-stone-500 leading-tight">Shared purpose</span>
              </button>
            </div>
          </div>

          {/* Recipient selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Peer Recipient</label>
            <select
              id="select-support-recipient"
              value={toFellowId}
              onChange={(e) => setToFellowId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white"
            >
              {eligibleRecipients.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.role}) {f.hasOverdueObligation ? '• [Hardship Active]' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* ⚠️ Not Advisable Dignified Warning */}
          {isRecipientOverdue && supportType === 'loan' && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                ⚠️ Signal: Not Advisable
              </div>
              <p className="text-[11px] leading-relaxed">
                {recipientFellow?.name} currently has an unresolved accommodation delay.
                In Hut4Devs, this signal serves to inform human judgment — it does not forbid you
                from helping if you have personal context or choose to provide a gift or structured loan.
              </p>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Amount (₦ / Colony Currency)
            </label>
            <input
              id="input-support-amount"
              type="number"
              min={1000}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            />
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Purpose / Need</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              placeholder="e.g. Accommodation share bridge, solar inverter battery"
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            />
          </div>

          {/* Repayment Date if Loan */}
          {supportType === 'loan' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Agreed Repayment Date
              </label>
              <input
                type="date"
                value={repaymentDate}
                onChange={(e) => setRepaymentDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Notes / Terms</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Staged into two installments upon stipend receipt"
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
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
              id="btn-confirm-peer-support"
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Confirm Agreement & Append to Trail
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
