import React, { useState } from 'react';
import {
  PeerSupportAgreement,
  PeerSupportType,
  PeerLoanStatus,
} from '../domain/peerSupport';
import { Member } from '../domain/auth';
import {
  HandCoins,
  Gift,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus,
  Filter,
  Sparkles,
  Users,
  Info,
  DollarSign,
} from 'lucide-react';
import { PeerSupportModal } from './PeerSupportModal';

interface PeerSupportSectionProps {
  currentMember: Member;
  availableMembers: Member[];
  supports: PeerSupportAgreement[];
  isDark?: boolean;
  onCreateSupport: (data: {
    type: PeerSupportType;
    toMemberId?: string;
    toMemberName?: string;
    amount: number;
    purpose: string;
    repaymentPeriod?: string;
    repaymentDate?: string;
    title?: string;
    targetAmount?: number;
    notes?: string;
    acknowledgedWarning?: boolean;
  }) => void;
  onRecordRepayment: (supportId: string, amount: number) => void;
  onConvertToGift: (supportId: string, reason: string) => void;
  onContributeToCampaign: (campaignId: string, amount: number, note?: string) => void;
  onDeclineSupport?: (supportId: string, reason?: string) => void;
}

export const PeerSupportSection: React.FC<PeerSupportSectionProps> = ({
  currentMember,
  availableMembers,
  supports,
  isDark = false,
  onCreateSupport,
  onRecordRepayment,
  onConvertToGift,
  onContributeToCampaign,
  onDeclineSupport,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedInitialType, setSelectedInitialType] = useState<PeerSupportType>('gift');

  // Modals for Actions
  const [repayModalSupport, setRepayModalSupport] = useState<PeerSupportAgreement | null>(null);
  const [repayAmount, setRepayAmount] = useState<number>(0);

  const [forgiveModalSupport, setForgiveModalSupport] = useState<PeerSupportAgreement | null>(null);
  const [forgiveReason, setForgiveReason] = useState<string>(
    'Solidarity and mutual support celebration. Debt permanently forgiven.'
  );

  const [campaignModal, setCampaignModal] = useState<PeerSupportAgreement | null>(null);
  const [campaignContribAmount, setCampaignContribAmount] = useState<number>(10000);
  const [campaignContribNote, setCampaignContribNote] = useState<string>('Chamber solidarity');

  // Filtered Agreements
  const filteredSupports = supports.filter((s) => {
    if (filterType === 'all') return true;
    return s.type === filterType;
  });

  const handleOpenCreate = (type: PeerSupportType) => {
    setSelectedInitialType(type);
    setIsCreateModalOpen(true);
  };

  const handleOpenRepay = (support: PeerSupportAgreement) => {
    const remaining = support.amount - support.amountRepaid;
    setRepayModalSupport(support);
    setRepayAmount(remaining > 0 ? remaining : support.amount);
  };

  const handleConfirmRepay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repayModalSupport || repayAmount <= 0) return;
    onRecordRepayment(repayModalSupport.id, repayAmount);
    setRepayModalSupport(null);
  };

  const handleOpenForgive = (support: PeerSupportAgreement) => {
    setForgiveModalSupport(support);
  };

  const handleConfirmForgive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgiveModalSupport) return;
    onConvertToGift(forgiveModalSupport.id, forgiveReason);
    setForgiveModalSupport(null);
  };

  const handleOpenCampaignContrib = (campaign: PeerSupportAgreement) => {
    setCampaignModal(campaign);
  };

  const handleConfirmCampaignContrib = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignModal || campaignContribAmount <= 0) return;
    onContributeToCampaign(campaignModal.id, campaignContribAmount, campaignContribNote);
    setCampaignModal(null);
  };

  return (
    <div className="space-y-6">
      {/* 3 Core Peer Support Channels (Top Surface) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. GIFT Card */}
        <div
          id="card-action-gift"
          className="bg-[#FFF9EE] border-2 border-[#5A2D0C]/15 dark:bg-[#241004] dark:border-[#C88D3A]/40 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-emerald-100 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-700/50 rounded-xl shadow-xs">
                <Gift className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100/80 border border-emerald-200/80 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-700/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Voluntary &bull; No Debt
              </span>
            </div>
            <h3 className="font-serif font-bold text-[#5A2D0C] dark:text-[#FFF9EE] text-base">1. Give a Gift</h3>
            <p className="text-stone-600 dark:text-[#D9C4AC] text-xs mt-1.5 leading-relaxed">
              Support a fellow with zero expectation of repayment. Gifts cannot be weaponized or converted into debt later.
            </p>
          </div>
          <button
            id="btn-open-gift-modal"
            onClick={() => handleOpenCreate('gift')}
            className="mt-4 w-full py-2.5 px-3 bg-[#5A2D0C] hover:bg-[#432108] text-[#FFF9EE] dark:bg-[#C88D3A] dark:hover:bg-[#DDA250] dark:text-[#241104] border-b-4 border-[#381B07] dark:border-[#915B15] active:border-b active:translate-y-[2px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all duration-150 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C88D3A] dark:text-[#241104]" />
            Initiate Gift
          </button>
        </div>

        {/* 2. LEND / BORROW Card */}
        <div
          id="card-action-loan"
          className="bg-[#FFF9EE] border-2 border-[#5A2D0C]/15 dark:bg-[#241004] dark:border-[#C88D3A]/40 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 text-blue-950 dark:bg-blue-950/80 dark:text-blue-200 border border-blue-200/80 dark:border-blue-700/50 rounded-xl shadow-xs">
                <HandCoins className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              </div>
              <span className="text-[10px] font-bold text-blue-900 bg-blue-100/80 border border-blue-200/80 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-700/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Clear Timelines
              </span>
            </div>
            <h3 className="font-serif font-bold text-[#5A2D0C] dark:text-[#FFF9EE] text-base">2. Lend or Borrow</h3>
            <p className="text-stone-600 dark:text-[#D9C4AC] text-xs mt-1.5 leading-relaxed">
              Coordinate direct peer loans with clear timelines. Lenders can later permanently forgive debt into a gift.
            </p>
          </div>
          <button
            id="btn-open-loan-modal"
            onClick={() => handleOpenCreate('loan')}
            className="mt-4 w-full py-2.5 px-3 bg-[#5A2D0C] hover:bg-[#432108] text-[#FFF9EE] dark:bg-[#C88D3A] dark:hover:bg-[#DDA250] dark:text-[#241104] border-b-4 border-[#381B07] dark:border-[#915B15] active:border-b active:translate-y-[2px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all duration-150 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C88D3A] dark:text-[#241104]" />
            Initiate Peer Loan
          </button>
        </div>

        {/* 3. CONTRIBUTE Card */}
        <div
          id="card-action-contrib"
          className="bg-[#FFF9EE] border-2 border-[#5A2D0C]/15 dark:bg-[#241004] dark:border-[#C88D3A]/40 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-100 text-purple-950 dark:bg-purple-950/80 dark:text-purple-200 border border-purple-200/80 dark:border-purple-700/50 rounded-xl shadow-xs">
                <HeartHandshake className="w-5 h-5 text-purple-700 dark:text-purple-400" />
              </div>
              <span className="text-[10px] font-bold text-purple-900 bg-purple-100/80 border border-purple-200/80 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-700/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Shared Essentials
              </span>
            </div>
            <h3 className="font-serif font-bold text-[#5A2D0C] dark:text-[#FFF9EE] text-base">3. Chamber Contribution</h3>
            <p className="text-stone-600 dark:text-[#D9C4AC] text-xs mt-1.5 leading-relaxed">
              Pool mutual resources for shared chamber necessities (solar inverters, mesh Wi-Fi) without social debt.
            </p>
          </div>
          <button
            id="btn-open-contrib-modal"
            onClick={() => handleOpenCreate('contribution')}
            className="mt-4 w-full py-2.5 px-3 bg-[#5A2D0C] hover:bg-[#432108] text-[#FFF9EE] dark:bg-[#C88D3A] dark:hover:bg-[#DDA250] dark:text-[#241104] border-b-4 border-[#381B07] dark:border-[#915B15] active:border-b active:translate-y-[2px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all duration-150 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C88D3A] dark:text-[#241104]" />
            Create Shared Campaign
          </button>
        </div>
      </div>

      {/* Main List Section with Filters */}
      <div className="bg-[#FFFDF9] dark:bg-[#241004] rounded-2xl border-2 border-[#5A2D0C]/15 dark:border-[#C88D3A]/30 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#5A2D0C]/10 dark:border-[#C88D3A]/20">
          <div>
            <h2 className="font-serif font-bold text-[#5A2D0C] dark:text-[#FFF9EE] text-lg">Active Agreements &amp; Campaigns</h2>
            <p className="text-xs text-stone-600 dark:text-[#D9C4AC] mt-0.5">
              Living trails of community mutual support and shared accountability
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1 bg-[#F7F1E7] dark:bg-[#1A0A02] p-1 rounded-xl border border-[#EAE0D0] dark:border-[#C88D3A]/30 text-xs">
            {[
              { id: 'all', label: 'All Agreements' },
              { id: 'loan', label: 'Peer Loans' },
              { id: 'gift', label: 'Gifts' },
              { id: 'contribution', label: 'Campaigns' },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`filter-tab-${tab.id}`}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-[#5A2D0C] text-[#FFF9EE] dark:bg-[#C88D3A] dark:text-[#241104] font-bold shadow-xs'
                    : 'text-[#5A2D0C]/70 dark:text-[#D9C4AC] hover:text-[#5A2D0C] dark:hover:text-[#FFF9EE]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Agreements Stream */}
        <div className="space-y-4">
          {filteredSupports.length === 0 ? (
            <div className="text-center py-12 text-xs text-stone-500 dark:text-[#D9C4AC]/70 bg-stone-50 dark:bg-[#1A0A02] rounded-xl border border-dashed border-stone-200 dark:border-[#C88D3A]/20">
              No peer support agreements matching this filter.
            </div>
          ) : (
            filteredSupports.map((support) => {
              const isCurrentUserLender = support.fromMemberId === currentMember.id;
              const remaining = support.amount - support.amountRepaid;
              const isRepaid = support.amountRepaid >= support.amount;
              const isForgiven = support.status === 'CONVERTED_TO_GIFT';
              const isOverdue = support.status === 'OVERDUE';

              return (
                <div
                  key={support.id}
                  id={`peer-support-${support.id}`}
                  className="bg-white dark:bg-[#1E0C03] rounded-2xl p-5 border-2 border-stone-200/90 dark:border-[#C88D3A]/25 hover:border-[#C88D3A]/50 dark:hover:border-[#C88D3A]/60 shadow-xs transition-all space-y-4"
                >
                  {/* Top Bar: Badges + Timestamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-[#C88D3A]/15 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {support.type === 'loan' && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 dark:border dark:border-blue-700/50 text-xs font-semibold px-2.5 py-1 rounded-lg">
                          <HandCoins className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" /> Peer Loan
                        </span>
                      )}
                      {support.type === 'gift' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 dark:border dark:border-emerald-700/50 text-xs font-semibold px-2.5 py-1 rounded-lg">
                          <Gift className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> Voluntary Gift (No Repayment)
                        </span>
                      )}
                      {support.type === 'contribution' && (
                        <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 dark:border dark:border-purple-700/50 text-xs font-semibold px-2.5 py-1 rounded-lg">
                          <HeartHandshake className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" /> Chamber Campaign
                        </span>
                      )}

                      {isForgiven && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-600/50">
                          <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" /> Converted to Gift (Forgiven)
                        </span>
                      )}

                      {isOverdue && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-600/60">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" /> ⚠️ Not Advisable (Delayed)
                        </span>
                      )}

                      {isRepaid && !isForgiven && support.type === 'loan' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-medium px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-700/50">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Fully Repaid
                        </span>
                      )}

                      {support.type === 'loan' && support.status === 'PARTIALLY_REPAID' && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-700/50">
                          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Partially Repaid
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-stone-500 dark:text-[#A67B54] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(support.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Middle Area: Participants & Financial Figures */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Participants & Description */}
                    <div>
                      {support.type === 'contribution' ? (
                        <div>
                          <h4 className="font-serif font-bold text-stone-900 dark:text-[#FFF9EE] text-base">
                            {support.title}
                          </h4>
                          <p className="text-stone-600 dark:text-[#D9C4AC] text-xs mt-1">{support.purpose}</p>
                          <div className="mt-2 text-[11px] text-stone-500 dark:text-[#A67B54] flex items-center gap-2">
                            <span>Organized by: <strong className="text-stone-800 dark:text-[#FFF9EE]">{support.fromMemberName}</strong></span>
                            <span>•</span>
                            <span>{support.contributors?.length || 0} Peer Contributors</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs font-semibold text-stone-900 dark:text-[#FFF9EE] flex items-center gap-1.5">
                            <span className="font-bold text-stone-950 dark:text-[#FFF9EE]">{support.fromMemberName}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-stone-400 dark:text-[#A67B54]" />
                            <span className="font-bold text-stone-950 dark:text-[#FFF9EE]">{support.toMemberName}</span>
                          </div>
                          <p className="text-stone-600 dark:text-[#D9C4AC] text-xs mt-1">{support.purpose}</p>
                          {support.repaymentPeriod && (
                            <p className="text-[11px] text-stone-500 dark:text-[#A67B54] mt-1">
                              Repayment Plan: <strong className="text-stone-800 dark:text-[#FFF9EE]">{support.repaymentPeriod}</strong> ({support.repaymentDate})
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Financial Figures */}
                    <div className="flex items-baseline gap-4 md:text-right shrink-0">
                      <div>
                        <span className="text-[11px] text-stone-500 dark:text-[#A67B54] block">
                          {support.type === 'contribution' ? 'Raised so far' : 'Agreement Amount'}
                        </span>
                        <span className="text-base font-bold text-stone-900 dark:text-[#FFF9EE]">
                          {support.currency}{support.amount.toLocaleString()}
                        </span>
                      </div>

                      {support.type === 'loan' && (
                        <div className="border-l border-stone-200 dark:border-[#C88D3A]/30 pl-4">
                          <span className="text-[11px] text-stone-500 dark:text-[#A67B54] block">Repaid</span>
                          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                            {support.currency}{support.amountRepaid.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {support.type === 'contribution' && support.targetAmount && (
                        <div className="border-l border-stone-200 dark:border-[#C88D3A]/30 pl-4">
                          <span className="text-[11px] text-stone-500 dark:text-[#A67B54] block">Target</span>
                          <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                            {support.currency}{support.targetAmount.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Campaign Progress Bar */}
                  {support.type === 'contribution' && support.targetAmount && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px] text-stone-600 dark:text-[#D9C4AC]">
                        <span>Progress ({Math.round((support.amount / support.targetAmount) * 100)}%)</span>
                        <span>
                          {support.currency}{support.amount.toLocaleString()} of {support.currency}{support.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 dark:bg-[#140601] rounded-full h-2.5 overflow-hidden border border-stone-200 dark:border-[#C88D3A]/30">
                        <div
                          className="bg-purple-600 h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, Math.round((support.amount / support.targetAmount) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Forgiven Reason Callout */}
                  {isForgiven && (
                    <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-600/40 rounded-xl text-xs text-amber-950 dark:text-amber-200 space-y-1">
                      <div className="font-semibold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                        <Gift className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                        <span>Debt Permanently Converted to Gift</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-stone-700 dark:text-[#D9C4AC]">
                        {support.forgivenReason || 'Mutual solidarity celebration. Full balance forgiven.'}
                      </p>
                    </div>
                  )}

                  {/* Bottom Actions Bar */}
                  <div className="pt-3 border-t border-stone-100 dark:border-[#C88D3A]/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-[11px] text-stone-500 dark:text-[#A67B54]">
                      {support.notes && <span><strong>Context:</strong> {support.notes}</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Campaign Contribution Action */}
                      {support.type === 'contribution' && support.status !== 'REPAID' && (
                        <button
                          id={`btn-contribute-campaign-${support.id}`}
                          onClick={() => handleOpenCampaignContrib(support)}
                          className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white border-b-3 border-purple-900 active:border-b active:translate-y-[1px] rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Contribute to Campaign
                        </button>
                      )}

                      {/* Lender Action: Convert Debt to Gift */}
                      {support.type === 'loan' && isCurrentUserLender && remaining > 0 && !isForgiven && (
                        <button
                          id={`btn-forgive-loan-${support.id}`}
                          onClick={() => handleOpenForgive(support)}
                          className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-600/60 border-b-3 border-b-amber-500 active:border-b active:translate-y-[1px] rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          title="Lender prerogative: permanently forgive outstanding balance into a voluntary gift"
                        >
                          <Gift className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                          Convert to Gift (Forgive Debt)
                        </button>
                      )}

                      {/* Repayment Action */}
                      {support.type === 'loan' && remaining > 0 && !isForgiven && (
                        <button
                          id={`btn-record-repay-${support.id}`}
                          onClick={() => handleOpenRepay(support)}
                          className="px-3.5 py-1.5 bg-[#5A2D0C] hover:bg-[#432108] text-[#FFF9EE] dark:bg-[#C88D3A] dark:hover:bg-[#DDA250] dark:text-[#241104] border-b-3 border-[#381B07] dark:border-[#915B15] active:border-b active:translate-y-[1px] rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#C88D3A] dark:text-[#241104]" />
                          Record Repayment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL 1: Create Peer Support (Gift / Loan / Contribution) */}
      {isCreateModalOpen && (
        <PeerSupportModal
          currentMember={currentMember}
          availableMembers={availableMembers}
          initialType={selectedInitialType}
          isDark={isDark}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmitSupport={(data) => {
            onCreateSupport(data);
            setIsCreateModalOpen(false);
          }}
        />
      )}

      {/* MODAL 2: Record Repayment */}
      {repayModalSupport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFDF9] dark:bg-[#241004] text-[#5A2D0C] dark:text-[#FFF9EE] rounded-2xl max-w-sm w-full p-6 shadow-2xl border-2 border-[#5A2D0C]/20 dark:border-[#C88D3A]/40 animate-in fade-in zoom-in-95">
            <h3 className="font-serif font-bold text-[#5A2D0C] dark:text-[#FFF9EE] text-base">Record Loan Repayment</h3>
            <p className="text-xs text-stone-600 dark:text-[#D9C4AC] mt-1">
              Fulfilling agreement between {repayModalSupport.fromMemberName} and {repayModalSupport.toMemberName}.
            </p>

            <form onSubmit={handleConfirmRepay} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-[#D9C4AC] mb-1">
                  Repayment Amount ({repayModalSupport.currency})
                </label>
                <input
                  type="number"
                  min={100}
                  max={repayModalSupport.amount - repayModalSupport.amountRepaid}
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#180A02] text-[#5A2D0C] dark:text-[#FFF9EE] border border-stone-300 dark:border-[#C88D3A]/40 rounded-xl outline-none focus:border-[#C88D3A] font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#5A2D0C]/10 dark:border-[#C88D3A]/20">
                <button
                  type="button"
                  onClick={() => setRepayModalSupport(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-600 dark:text-[#D9C4AC] hover:bg-stone-100 dark:hover:bg-[#1D0C03] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-repay-modal"
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#5A2D0C] hover:bg-[#432108] text-[#FFF9EE] dark:bg-[#C88D3A] dark:hover:bg-[#DDA250] dark:text-[#241104] border-b-3 border-[#381B07] dark:border-[#915B15] active:border-b active:translate-y-[1px] rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Confirm Repayment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Convert Debt to Gift (Forgive Debt) */}
      {forgiveModalSupport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFDF9] dark:bg-[#241004] text-[#5A2D0C] dark:text-[#FFF9EE] rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-[#5A2D0C]/20 dark:border-[#C88D3A]/40 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 rounded-xl">
                <Gift className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="font-serif font-bold text-[#5A2D0C] dark:text-[#FFF9EE] text-base">Convert Debt to Gift (Forgive)</h3>
            </div>
            <p className="text-xs text-stone-600 dark:text-[#D9C4AC] leading-relaxed">
              As the original lender, you are choosing to permanently forgive the remaining{' '}
              <strong className="text-[#5A2D0C] dark:text-[#FFF9EE]">
                {forgiveModalSupport.currency}
                {(forgiveModalSupport.amount - forgiveModalSupport.amountRepaid).toLocaleString()}
              </strong>{' '}
              owed by {forgiveModalSupport.toMemberName}.
            </p>

            <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-700/60 rounded-xl text-[11px] text-emerald-950 dark:text-emerald-200">
              <strong>Hut4Devs Invariant:</strong> Once converted, this agreement is permanently recorded
              as a voluntary gift. It can NEVER be converted back to debt.
            </div>

            <form onSubmit={handleConfirmForgive} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-[#D9C4AC] mb-1">Reason / Note for Forgiveness</label>
                <textarea
                  value={forgiveReason}
                  onChange={(e) => setForgiveReason(e.target.value)}
                  rows={3}
                  required
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#180A02] text-[#5A2D0C] dark:text-[#FFF9EE] border border-stone-300 dark:border-[#C88D3A]/40 rounded-xl outline-none focus:border-[#C88D3A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#5A2D0C]/10 dark:border-[#C88D3A]/20">
                <button
                  type="button"
                  onClick={() => setForgiveModalSupport(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-600 dark:text-[#D9C4AC] hover:bg-stone-100 dark:hover:bg-[#1D0C03] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-forgive-modal"
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white border-b-3 border-emerald-900 active:border-b active:translate-y-[1px] rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Permanently Convert to Gift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Contribute to Campaign */}
      {campaignModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFDF9] dark:bg-[#241004] text-[#5A2D0C] dark:text-[#FFF9EE] rounded-2xl max-w-sm w-full p-6 shadow-2xl border-2 border-[#5A2D0C]/20 dark:border-[#C88D3A]/40 animate-in fade-in zoom-in-95">
            <h3 className="font-serif font-bold text-[#5A2D0C] dark:text-[#FFF9EE] text-base">Contribute to Campaign</h3>
            <p className="text-xs text-stone-600 dark:text-[#D9C4AC] mt-1">
              Adding your solidarity support to "{campaignModal.title}".
            </p>

            <form onSubmit={handleConfirmCampaignContrib} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-[#D9C4AC] mb-1">
                  Contribution Amount ({campaignModal.currency})
                </label>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={campaignContribAmount}
                  onChange={(e) => setCampaignContribAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#180A02] text-[#5A2D0C] dark:text-[#FFF9EE] border border-stone-300 dark:border-[#C88D3A]/40 rounded-xl outline-none focus:border-[#C88D3A] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-[#D9C4AC] mb-1">Optional Note</label>
                <input
                  type="text"
                  value={campaignContribNote}
                  onChange={(e) => setCampaignContribNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#180A02] text-[#5A2D0C] dark:text-[#FFF9EE] border border-stone-300 dark:border-[#C88D3A]/40 rounded-xl outline-none focus:border-[#C88D3A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#5A2D0C]/10 dark:border-[#C88D3A]/20">
                <button
                  type="button"
                  onClick={() => setCampaignModal(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-600 dark:text-[#D9C4AC] hover:bg-stone-100 dark:hover:bg-[#1D0C03] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-campaign-contrib"
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white border-b-3 border-purple-900 active:border-b active:translate-y-[1px] rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Confirm Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
