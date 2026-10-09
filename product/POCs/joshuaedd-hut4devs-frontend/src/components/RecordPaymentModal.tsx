import React, { useState } from 'react';
import { DollarSign, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { Member } from '../types';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Member;
  initialAmount: number;
  initialCategory: string;
  initialTitle: string;
  onConfirmPayment: (amount: number, category: string, title: string, note: string) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialAmount,
  initialCategory,
  initialTitle,
  onConfirmPayment,
}) => {
  const [amount, setAmount] = useState(initialAmount || 600);
  const [title, setTitle] = useState(initialTitle || 'Chamber Rent Share Settlement');
  const [paymentRail, setPaymentRail] = useState('Bank Transfer (Direct Clearing)');
  const [note, setNote] = useState('Automated verification matching roommate stipend schedule.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmPayment(amount, initialCategory, title, `${paymentRail} - ${note}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Settle Responsibility
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Item
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Amount (USD)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Channel / Rail
            </label>
            <select
              value={paymentRail}
              onChange={(e) => setPaymentRail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            >
              <option value="Direct ACH / Bank Transfer">Direct ACH / Bank Transfer</option>
              <option value="Mobile Money (M-Pesa / MTN)">Mobile Money (M-Pesa / MTN)</option>
              <option value="Debit / Credit Card (Gateway)">Debit / Credit Card (Gateway)</option>
              <option value="Stellar / Soroban Settlement">Stellar / Soroban Settlement</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Verification Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Reference TX-8812, month of October"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>Anchors immediately to Chamber 4B's Trust Trail with cryptographic proof.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
            >
              Confirm Settlement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
