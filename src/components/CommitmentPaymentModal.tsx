import React, { useState } from 'react';
import { Commitment, Fellow } from '../types';
import { X, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

interface CommitmentPaymentModalProps {
  commitment: Commitment;
  currentFellow: Fellow;
  onClose: () => void;
  onSubmitPayment: (commitmentId: string, amount: number, reference: string, notes: string) => void;
}

export const CommitmentPaymentModal: React.FC<CommitmentPaymentModalProps> = ({
  commitment,
  currentFellow,
  onClose,
  onSubmitPayment,
}) => {
  const remaining = commitment.amount - commitment.amountPaid;
  const [payAmount, setPayAmount] = useState<number>(remaining);
  const [channel, setChannel] = useState<string>('Bank Transfer');
  const [reference, setReference] = useState<string>(
    `PAY-${Date.now().toString().slice(-6)}`
  );
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;
    const combinedNotes = `${channel}: ${notes || 'Standard fulfillment'}`;
    onSubmitPayment(commitment.id, payAmount, reference, combinedNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#180A02]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#FAE5C5] dark:bg-[#3E200C] text-[#432006] dark:text-[#FFF9EE] rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-[#CF9F68] dark:border-[#623416] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#DDB985] dark:border-[#623416] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#EBF2DD] text-[#3D5A1E] rounded-md border border-[#A8C782]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#432006] dark:text-[#FFF9EE] text-sm">Record Accommodation Payment</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#72451F] hover:text-[#432006] dark:text-[#E5D3BA] dark:hover:text-[#FFF9EE] p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="bg-[#F3D5AB] dark:bg-[#241104] p-3 rounded-lg border border-[#CF9F68] dark:border-[#623416] text-xs">
            <div className="flex justify-between text-[#72451F] dark:text-[#E5D3BA]/75">
              <span>Commitment:</span>
              <span className="font-medium text-[#432006] dark:text-[#FFF9EE]">{commitment.title}</span>
            </div>
            <div className="flex justify-between text-[#72451F] dark:text-[#E5D3BA]/75 mt-1">
              <span>Total Amount:</span>
              <span className="font-medium text-[#432006] dark:text-[#FFF9EE]">
                {commitment.currency}
                {commitment.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[#72451F] dark:text-[#E5D3BA]/75 mt-1">
              <span>Already Paid:</span>
              <span className="font-medium text-[#3D5A1E] dark:text-[#94B888]">
                {commitment.currency}
                {commitment.amountPaid.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-[#432006] dark:text-[#FFF9EE] font-semibold border-t border-[#DDB985] dark:border-[#623416] mt-2 pt-2">
              <span>Remaining Balance:</span>
              <span className="text-[#9F520B] dark:text-[#E5A857]">
                {commitment.currency}
                {remaining.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A3013] dark:text-[#E5D3BA] mb-1">
              Amount to Settle ({commitment.currency})
            </label>
            <div className="relative">
              <input
                id="input-payment-amount"
                type="number"
                max={remaining}
                min={1}
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                required
                className="w-full px-3 py-2 text-sm border border-[#CF9F68] dark:border-[#623416] rounded-lg focus:ring-2 focus:ring-[#C46F18]/20 focus:border-[#C46F18] outline-none bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE]"
              />
            </div>
            <div className="flex gap-2 mt-1.5">
              <button
                type="button"
                onClick={() => setPayAmount(remaining)}
                className="text-[11px] bg-[#F3D5AB] hover:bg-[#E8BF88] text-[#432006] dark:bg-[#2F1707] dark:hover:bg-[#3E200C] dark:text-[#FFF9EE] px-2 py-0.5 rounded transition-colors border border-[#CF9F68] dark:border-[#623416] cursor-pointer"
              >
                Pay Full Balance ({commitment.currency}{remaining.toLocaleString()})
              </button>
              {remaining > 20000 && (
                <button
                  type="button"
                  onClick={() => setPayAmount(Math.floor(remaining / 2))}
                  className="text-[11px] bg-[#F3D5AB] hover:bg-[#E8BF88] text-[#432006] dark:bg-[#2F1707] dark:hover:bg-[#3E200C] dark:text-[#FFF9EE] px-2 py-0.5 rounded transition-colors border border-[#CF9F68] dark:border-[#623416] cursor-pointer"
                >
                  Pay 50% ({commitment.currency}{Math.floor(remaining / 2).toLocaleString()})
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A3013] dark:text-[#E5D3BA] mb-1">Payment Channel</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#CF9F68] dark:border-[#623416] rounded-lg focus:ring-2 focus:ring-[#C46F18]/20 focus:border-[#C46F18] outline-none bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE]"
            >
              <option value="Direct Bank Wire / NIP">Direct Bank Wire / NIP Transfer</option>
              <option value="Mobile Money / Fintech">Fintech / Mobile Money App</option>
              <option value="USDC / Web3 Settlement">USDC / External Settlement Anchor</option>
              <option value="Cash / Communal Safe">Cash / Physical Colony Deposit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A3013] dark:text-[#E5D3BA] mb-1">
              Verifiable Evidence / Reference ID
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs font-mono border border-[#CF9F68] dark:border-[#623416] rounded-lg focus:ring-2 focus:ring-[#C46F18]/20 focus:border-[#C46F18] outline-none bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE]"
              placeholder="e.g. TXN-10928374 or receipt #"
            />
            <p className="text-[11px] text-[#72451F] dark:text-[#E5D3BA]/70 mt-1">
              Recorded into the Colony Trust Trail as immutable evidence.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5A3013] dark:text-[#E5D3BA] mb-1">Notes / Clarification (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Sent via OPay to landlord account"
              className="w-full px-3 py-2 text-xs border border-[#CF9F68] dark:border-[#623416] rounded-lg focus:ring-2 focus:ring-[#C46F18]/20 focus:border-[#C46F18] outline-none bg-[#FFF0D6] dark:bg-[#2F1707] text-[#432006] dark:text-[#FFF9EE]"
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
              id="btn-confirm-payment"
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-[#432006] hover:bg-[#341905] text-[#FFF0D6] dark:bg-[#C46F18] dark:hover:bg-[#D18125] dark:text-[#241104] rounded-lg transition-colors flex items-center gap-1.5 border-b-2 border-[#241104] dark:border-[#7A4B0A] cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Confirm & Append to Trail
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
