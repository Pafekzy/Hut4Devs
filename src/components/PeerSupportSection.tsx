import React, { useState } from 'react';
import { PeerSupport, Fellow, SupportType } from '../types';
import {
  ArrowLeftRight,
  Gift,
  HandCoins,
  HeartHandshake,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plus,
  Ban,
  ShieldCheck,
} from 'lucide-react';

interface PeerSupportSectionProps {
  peerSupports: PeerSupport[];
  fellows: Fellow[];
  currentFellowId: string;
  onOpenCreateSupportModal: () => void;
  onConvertToGift: (supportId: string) => void;
  onRecordRepayment: (supportId: string, amount: number) => void;
}

export const PeerSupportSection: React.FC<PeerSupportSectionProps> = ({
  peerSupports,
  fellows,
  currentFellowId,
  onOpenCreateSupportModal,
  onConvertToGift,
  onRecordRepayment,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [repayModalSupport, setRepayModalSupport] = useState<PeerSupport | null>(null);
  const [repayAmount, setRepayAmount] = useState<number>(0);

  const getFellow = (id: string) => fellows.find((f) => f.id === id) || fellows[0];

  const filteredSupports = peerSupports.filter((ps) => {
    if (filterType === 'all') return true;
    return ps.type === filterType;
  });

  const handleOpenRepay = (support: PeerSupport) => {
    setRepayModalSupport(support);
    setRepayAmount(support.amount - support.amountRepaid);
  };

  const handleConfirmRepay = () => {
    if (!repayModalSupport) return;
    onRecordRepayment(repayModalSupport.id, repayAmount);
    setRepayModalSupport(null);
  };

  return (
    <div className="space-y-6">
      {/* Doctrine Banner */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                Direct Peer-to-Peer
              </span>
              <span className="text-xs text-stone-500">Coordinators are optional • No gatekeepers</span>
            </div>
            <h1 className="text-xl font-bold text-stone-900 mt-1.5">Colony Peer Support Hub</h1>
            <p className="text-xs text-stone-600 mt-0.5 max-w-2xl leading-relaxed">
              Transparent lending, gifting, and contributions between fellows.
              Supports are strictly contextual: <strong className="text-stone-800">Debt → Gift is encouraged</strong>,
              while <strong className="text-stone-800">Gift → Debt is strictly forbidden</strong>.
            </p>
          </div>

          <button
            id="btn-offer-peer-support"
            onClick={onOpenCreateSupportModal}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Offer or Request Support
          </button>
        </div>

        {/* The 3 Tenets of Peer Support */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-stone-100 text-xs">
          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
            <div className="font-semibold text-blue-900 flex items-center gap-1.5">
              <HandCoins className="w-4 h-4 text-blue-700" />
              1. Peer Loans
            </div>
            <p className="text-blue-800/80 mt-1 text-[11px] leading-relaxed">
              Assistance with an agreed repayment date. Honest communication and staged repayments build trust trails.
            </p>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
            <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-emerald-700" />
              2. Voluntary Gifts
            </div>
            <p className="text-emerald-800/80 mt-1 text-[11px] leading-relaxed">
              Assistance with zero expectation of repayment. Cannot be weaponized or converted back into debt later.
            </p>
          </div>

          <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-3">
            <div className="font-semibold text-purple-900 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-purple-700" />
              3. Shared Contributions
            </div>
            <p className="text-purple-800/80 mt-1 text-[11px] leading-relaxed">
              Communal pooling for chamber necessities (solar batteries, fiber internet). Generosity without social debt.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and List */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-bold text-stone-900">Active Peer Support Agreements</h2>
            <p className="text-xs text-stone-500">Tracked agreements and trails within your colony</p>
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
            {['all', 'loan', 'gift', 'contribution'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-md capitalize font-medium transition-all ${
                  filterType === type
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredSupports.length === 0 ? (
            <div className="text-center py-10 text-xs text-stone-400">
              No peer support agreements matching this filter.
            </div>
          ) : (
            filteredSupports.map((support) => {
              const fromFellow = getFellow(support.fromFellowId);
              const toFellow = getFellow(support.toFellowId);
              const isCurrentUserLender = support.fromFellowId === currentFellowId;
              const isCurrentUserBorrower = support.toFellowId === currentFellowId;
              const remaining = support.amount - support.amountRepaid;
              const isRepaid = support.amountRepaid >= support.amount;
              const isForgiven = support.status === 'converted_to_gift';

              return (
                <div
                  key={support.id}
                  id={`peer-support-${support.id}`}
                  className="bg-stone-50/60 rounded-xl p-4 sm:p-5 border border-stone-200/80 hover:border-stone-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      {support.type === 'loan' && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          <HandCoins className="w-3.5 h-3.5" /> Peer Loan
                        </span>
                      )}
                      {support.type === 'gift' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          <Gift className="w-3.5 h-3.5" /> Gift (Zero Repayment)
                        </span>
                      )}
                      {support.type === 'contribution' && (
                        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          <HeartHandshake className="w-3.5 h-3.5" /> Chamber Contribution
                        </span>
                      )}

                      {isForgiven && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs font-semibold px-2 py-0.5 rounded">
                          <Sparkles className="w-3 h-3 text-amber-600" /> Converted to Gift (Debt Forgiven)
                        </span>
                      )}

                      {isRepaid && !isForgiven && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Fully Repaid
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Initiated: {support.createdAt.split('T')[0]}
                    </div>
                  </div>

                  {/* Parties & Details */}
                  <div className="mt-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center -space-x-2">
                        <img
                          src={fromFellow.avatar}
                          alt={fromFellow.name}
                          title={`Supporter: ${fromFellow.name}`}
                          className="w-9 h-9 rounded-full border-2 border-white object-cover"
                        />
                        <img
                          src={toFellow.avatar}
                          alt={toFellow.name}
                          title={`Recipient: ${toFellow.name}`}
                          className="w-9 h-9 rounded-full border-2 border-white object-cover"
                        />
                      </div>

                      <div className="text-xs">
                        <div className="font-semibold text-stone-900">
                          {fromFellow.name}{' '}
                          <span className="text-stone-400 font-normal">supported</span> {toFellow.name}
                        </div>
                        <p className="text-stone-600 text-[11px] mt-0.5">{support.purpose}</p>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-3 text-right">
                      <div>
                        <span className="text-[11px] text-stone-400 block">Total Agreement</span>
                        <span className="text-base font-bold text-stone-900">
                          {support.currency}
                          {support.amount.toLocaleString()}
                        </span>
                      </div>

                      {support.type === 'loan' && (
                        <div className="border-l border-stone-200 pl-3">
                          <span className="text-[11px] text-stone-400 block">Repaid Amount</span>
                          <span className="text-sm font-semibold text-emerald-600">
                            {support.currency}
                            {support.amountRepaid.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Loan Repayment details */}
                  {support.type === 'loan' && !isForgiven && (
                    <div className="mt-3 pt-3 border-t border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="text-stone-600">
                        <span>Expected Settlement Date: </span>
                        <strong className="text-stone-900">{support.repaymentDate || 'Not specified'}</strong>
                        {remaining > 0 && (
                          <span className="text-amber-800 ml-2 font-medium">
                            ({support.currency}
                            {remaining.toLocaleString()} remaining)
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {isCurrentUserLender && remaining > 0 && (
                          <button
                            id={`btn-forgive-loan-${support.id}`}
                            onClick={() => onConvertToGift(support.id)}
                            className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                            title="Lender prerogative: permanently forgive loan into a gift"
                          >
                            <Gift className="w-3.5 h-3.5 text-amber-700" />
                            Convert to Gift (Forgive Debt)
                          </button>
                        )}

                        {remaining > 0 && (
                          <button
                            id={`btn-record-repay-${support.id}`}
                            onClick={() => handleOpenRepay(support)}
                            className="inline-flex items-center gap-1 bg-stone-900 hover:bg-stone-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Record Repayment
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {support.notes && (
                    <div className="mt-2 text-[11px] text-stone-500 bg-white/70 p-2 rounded border border-stone-200/50">
                      <strong>Context:</strong> {support.notes}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Repay Modal */}
      {repayModalSupport && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-stone-900 text-sm">Record Loan Repayment</h3>
            <p className="text-xs text-stone-500 mt-1">
              Fulfilling obligation between {getFellow(repayModalSupport.fromFellowId).name} and{' '}
              {getFellow(repayModalSupport.toFellowId).name}.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Repayment Amount ({repayModalSupport.currency})
                </label>
                <input
                  type="number"
                  min={1}
                  max={repayModalSupport.amount - repayModalSupport.amountRepaid}
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRepayModalSupport(null)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-repay-modal"
                  type="button"
                  onClick={handleConfirmRepay}
                  className="px-4 py-1.5 text-xs bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  Confirm Repayment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
