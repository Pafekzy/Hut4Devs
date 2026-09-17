import React, { useState, useEffect } from 'react';
import {
  PeerSupportAgreement,
  PeerSupportType,
  PeerLoanStatus,
  TrustTrailEvent,
  PeerVouch,
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
  Footprints,
  Layers,
} from 'lucide-react';
import { PeerSupportModal } from './PeerSupportModal';
import { TrustTrailFeed } from './TrustTrailFeed';
import { VouchSection } from './VouchSection';
import { BeachFootstepsAnimation } from './BeachFootstepsAnimation';
import { BallotBoxIllustration } from './BallotBoxIllustration';

interface PeerSupportSectionProps {
  currentMember: Member;
  availableMembers: Member[];
  supports: PeerSupportAgreement[];
  trailEvents?: TrustTrailEvent[];
  vouches?: PeerVouch[];
  isDark?: boolean;
  initialSubTab?: 'agreements' | 'trust-trails' | 'vouches';
  onSubTabChange?: (subTab: 'agreements' | 'trust-trails' | 'vouches') => void;
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
  onAddVouch?: (
    targetMemberId: string,
    targetMemberName: string,
    context: string,
    confidence: 'high' | 'moderate' | 'cautious',
    scope: string,
    notes: string
  ) => void;
  onDeclineSupport?: (supportId: string, reason?: string) => void;
}

export const PeerSupportSection: React.FC<PeerSupportSectionProps> = ({
  currentMember,
  availableMembers,
  supports,
  trailEvents = [],
  vouches = [],
  isDark = false,
  initialSubTab = 'agreements',
  onSubTabChange,
  onCreateSupport,
  onRecordRepayment,
  onConvertToGift,
  onContributeToCampaign,
  onAddVouch,
  onDeclineSupport,
}) => {
  const [hubSubTab, setHubSubTab] = useState<'agreements' | 'trust-trails' | 'vouches'>(initialSubTab);
  const [filterType, setFilterType] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedInitialType, setSelectedInitialType] = useState<PeerSupportType>('gift');

  useEffect(() => {
    if (initialSubTab) {
      setHubSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSubTabSwitch = (tab: 'agreements' | 'trust-trails' | 'vouches') => {
    setHubSubTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

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
      {/* 3 Streamlined Peer Support & Trust Hub Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CARD 1: CHOOSE SUPPORT PATH (Unified Gift, Lend, Contribute) */}
        <article
          id="card-action-choose-path"
          className="h4d-card-static rounded-2xl p-5 sm:p-6 border-2 border-b-4 shadow-md flex flex-col justify-between"
          style={{
            backgroundColor: isDark ? 'rgba(23, 21, 19, 0.55)' : '#FAE5C5',
            borderColor: isDark ? 'rgba(200, 141, 58, 0.35)' : '#CF9F68',
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className="text-xs font-bold uppercase tracking-wider block"
                style={{ color: isDark ? '#E5A955' : '#9F520B' }}
              >
                Voluntary Support
              </span>
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border shadow-xs"
                style={{
                  backgroundColor: isDark ? 'rgba(42, 34, 28, 0.6)' : '#F3D5AB',
                  color: isDark ? '#D8B4E2' : '#6B21A8',
                  borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mr-1.5 shadow-xs"
                  style={{ backgroundColor: '#9333EA' }}
                  aria-hidden="true"
                />
                Solidarity
              </span>
            </div>

            <h3
              className="font-serif text-xl sm:text-2xl font-bold tracking-tight mb-2"
              style={{ color: isDark ? '#FFF9EE' : '#432006' }}
            >
              Choose Support Path
            </h3>

            <div className="space-y-2 mb-4">
              <div
                className="p-2.5 rounded-xl border flex items-start gap-2 text-xs"
                style={{
                  backgroundColor: isDark ? 'rgba(42, 34, 28, 0.4)' : '#FFF0D6',
                  borderColor: isDark ? 'rgba(200, 141, 58, 0.2)' : '#CF9F68',
                }}
              >
                <Gift className="w-3.5 h-3.5 mt-0.5 text-purple-600 shrink-0" />
                <div>
                  <strong className="block text-[11px]" style={{ color: isDark ? '#FFF9EE' : '#432006' }}>
                    1. Gift
                  </strong>
                  <span style={{ color: isDark ? '#D9C4AC' : '#72451F' }}>Zero repayment obligation</span>
                </div>
              </div>

              <div
                className="p-2.5 rounded-xl border flex items-start gap-2 text-xs"
                style={{
                  backgroundColor: isDark ? 'rgba(42, 34, 28, 0.4)' : '#FFF0D6',
                  borderColor: isDark ? 'rgba(200, 141, 58, 0.2)' : '#CF9F68',
                }}
              >
                <HandCoins className="w-3.5 h-3.5 mt-0.5 text-amber-600 shrink-0" />
                <div>
                  <strong className="block text-[11px]" style={{ color: isDark ? '#FFF9EE' : '#432006' }}>
                    2. Lend
                  </strong>
                  <span style={{ color: isDark ? '#D9C4AC' : '#72451F' }}>Clear repayment timeline &amp; forgiveness</span>
                </div>
              </div>

              <div
                className="p-2.5 rounded-xl border flex items-start gap-2 text-xs"
                style={{
                  backgroundColor: isDark ? 'rgba(42, 34, 28, 0.4)' : '#FFF0D6',
                  borderColor: isDark ? 'rgba(200, 141, 58, 0.2)' : '#CF9F68',
                }}
              >
                <HeartHandshake className="w-3.5 h-3.5 mt-0.5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="block text-[11px]" style={{ color: isDark ? '#FFF9EE' : '#432006' }}>
                    3. Contribute
                  </strong>
                  <span style={{ color: isDark ? '#D9C4AC' : '#72451F' }}>Shared community need &amp; chamber fund</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              id="btn-initiate-peer-support"
              onClick={() => handleOpenCreate('gift')}
              className={`h4d-btn-soft inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] w-full rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer border-b-3 active:border-b active:translate-y-[1px] shadow-sm ${
                isDark
                  ? 'bg-[#C46F18] text-[#241104] hover:bg-[#D18125] border-[#915B15]'
                  : 'bg-[#432006] text-[#FFF0D6] hover:bg-[#341905] border-[#241104]'
              }`}
            >
              <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Initiate Support</span>
            </button>

            {/* Quick-select path triggers maintaining test & flow compatibility */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="btn-open-gift-modal"
                onClick={() => handleOpenCreate('gift')}
                className="flex-1 py-1 px-2 rounded-lg text-[10px] font-bold border text-center transition-colors cursor-pointer"
                style={{
                  backgroundColor: isDark ? 'rgba(42, 34, 28, 0.6)' : '#FFF0D6',
                  borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                  color: isDark ? '#FCD34D' : '#432006',
                }}
              >
                + Gift
              </button>
              <button
                type="button"
                id="btn-open-loan-modal"
                onClick={() => handleOpenCreate('loan')}
                className="flex-1 py-1 px-2 rounded-lg text-[10px] font-bold border text-center transition-colors cursor-pointer"
                style={{
                  backgroundColor: isDark ? 'rgba(42, 34, 28, 0.6)' : '#FFF0D6',
                  borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                  color: isDark ? '#FCD34D' : '#432006',
                }}
              >
                + Lend
              </button>
              <button
                type="button"
                id="btn-open-contrib-modal"
                onClick={() => handleOpenCreate('contribution')}
                className="flex-1 py-1 px-2 rounded-lg text-[10px] font-bold border text-center transition-colors cursor-pointer"
                style={{
                  backgroundColor: isDark ? 'rgba(42, 34, 28, 0.6)' : '#FFF0D6',
                  borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                  color: isDark ? '#FCD34D' : '#432006',
                }}
              >
                + Campaign
              </button>
            </div>
          </div>
        </article>

        {/* CARD 2: TRAILS OF TRUST (Nested Trust Ledger) */}
        <article
          id="card-action-trust-trails"
          className="h4d-card-static rounded-2xl p-5 sm:p-6 border-2 border-b-4 shadow-md flex flex-col justify-between"
          style={{
            backgroundColor: isDark ? 'rgba(23, 21, 19, 0.55)' : '#FAE5C5',
            borderColor: isDark ? 'rgba(200, 141, 58, 0.35)' : '#CF9F68',
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className="text-xs font-bold uppercase tracking-wider block"
                style={{ color: isDark ? '#E5A955' : '#9F520B' }}
              >
                Immutable Ledger
              </span>
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border shadow-xs"
                style={{
                  backgroundColor: isDark ? 'rgba(42, 34, 28, 0.6)' : '#F3D5AB',
                  color: isDark ? '#F5C678' : '#9F520B',
                  borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                }}
              >
                <Footprints className="w-3 h-3 mr-1 text-[#9F520B] dark:text-[#C46F18]" />
                Integrity
              </span>
            </div>

            <h3
              className="font-serif text-xl sm:text-2xl font-bold tracking-tight mb-2"
              style={{ color: isDark ? '#FFF9EE' : '#432006' }}
            >
              Trails of Trust
            </h3>

            <p
              className="text-xs leading-relaxed mb-4"
              style={{ color: isDark ? '#EAD6C0' : '#5A3013' }}
            >
              Append-only chronological audit trail capturing every gift, repayment, and pooled chamber contribution with transparent receipts.
            </p>

            <div
              className="p-3 rounded-xl border mb-3 flex items-center justify-between"
              style={{
                backgroundColor: isDark ? 'rgba(42, 34, 28, 0.4)' : '#FFF0D6',
                borderColor: isDark ? 'rgba(200, 141, 58, 0.2)' : '#CF9F68',
              }}
            >
              <span className="text-xs font-medium" style={{ color: isDark ? '#D9C4AC' : '#72451F' }}>
                Recorded Events
              </span>
              <span className="font-mono font-bold text-xs" style={{ color: isDark ? '#FCD34D' : '#432006' }}>
                {trailEvents.length} Verifiable Events
              </span>
            </div>

            {/* Walking Footprints Trail on Beach Sand Animation */}
            <div className="mb-4">
              <BeachFootstepsAnimation isDark={isDark} />
            </div>
          </div>

          <button
            type="button"
            id="btn-view-trust-trails"
            onClick={() => handleSubTabSwitch('trust-trails')}
            className={`h4d-btn-soft inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] w-full rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer border-b-3 active:border-b active:translate-y-[1px] shadow-sm ${
              hubSubTab === 'trust-trails'
                ? isDark
                  ? 'bg-[#C46F18] text-[#241104] border-[#915B15]'
                  : 'bg-[#432006] text-[#FFF0D6] border-[#241104]'
                : isDark
                ? 'bg-[#2E1809] text-[#FFF9EE] hover:bg-[#3E200C] border-[#4A240A]'
                : 'bg-[#F3D5AB] text-[#432006] hover:bg-[#E8BF88] border-[#CF9F68]'
            }`}
          >
            <Footprints className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{hubSubTab === 'trust-trails' ? 'Viewing Trust Ledger' : 'Explore Trust Ledger'}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </article>

        {/* CARD 3: CONTEXTUAL VOUCHES (Nested Vouch Section) */}
        <article
          id="card-action-vouches"
          className="h4d-card-static rounded-2xl p-5 sm:p-6 border-2 border-b-4 shadow-md flex flex-col justify-between"
          style={{
            backgroundColor: isDark ? 'rgba(23, 21, 19, 0.55)' : '#FAE5C5',
            borderColor: isDark ? 'rgba(200, 141, 58, 0.35)' : '#CF9F68',
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className="text-xs font-bold uppercase tracking-wider block"
                style={{ color: isDark ? '#E5A955' : '#9F520B' }}
              >
                Peer Attestation
              </span>
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border shadow-xs"
                style={{
                  backgroundColor: isDark ? 'rgba(42, 34, 28, 0.6)' : '#F3D5AB',
                  color: isDark ? '#86EFAC' : '#166534',
                  borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                }}
              >
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                No Guarantor
              </span>
            </div>

            <h3
              className="font-serif text-xl sm:text-2xl font-bold tracking-tight mb-2"
              style={{ color: isDark ? '#FFF9EE' : '#432006' }}
            >
              Contextual Vouches
            </h3>

            <p
              className="text-xs leading-relaxed mb-4"
              style={{ color: isDark ? '#EAD6C0' : '#5A3013' }}
            >
              Vouch for fellows across specific character and skill domains (craft, living harmony, reliability) without financial liability or debt risk.
            </p>

            <div
              className="p-3 rounded-xl border mb-3 flex items-center justify-between"
              style={{
                backgroundColor: isDark ? 'rgba(42, 34, 28, 0.4)' : '#FFF0D6',
                borderColor: isDark ? 'rgba(200, 141, 58, 0.2)' : '#CF9F68',
              }}
            >
              <span className="text-xs font-medium" style={{ color: isDark ? '#D9C4AC' : '#72451F' }}>
                Active Peer Vouches
              </span>
              <span className="font-mono font-bold text-xs" style={{ color: isDark ? '#FCD34D' : '#432006' }}>
                {vouches.length} Attestations
              </span>
            </div>

            {/* Static Ballot Box Attestation Illustration */}
            <div className="mb-4">
              <BallotBoxIllustration isDark={isDark} />
            </div>
          </div>

          <button
            type="button"
            id="btn-view-vouches"
            onClick={() => handleSubTabSwitch('vouches')}
            className={`h4d-btn-soft inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] w-full rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer border-b-3 active:border-b active:translate-y-[1px] shadow-sm ${
              hubSubTab === 'vouches'
                ? isDark
                  ? 'bg-[#C46F18] text-[#241104] border-[#915B15]'
                  : 'bg-[#432006] text-[#FFF0D6] border-[#241104]'
                : isDark
                ? 'bg-[#2E1809] text-[#FFF9EE] hover:bg-[#3E200C] border-[#4A240A]'
                : 'bg-[#F3D5AB] text-[#432006] hover:bg-[#E8BF88] border-[#CF9F68]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{hubSubTab === 'vouches' ? 'Viewing Peer Vouches' : 'View & Give Vouches'}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </article>
      </div>

      {/* Nested Hub Sub-Tab Navigator */}
      <div
        className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b-2"
        style={{ borderColor: isDark ? '#3E200C' : '#DDB985' }}
      >
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <button
            type="button"
            id="hub-tab-agreements"
            onClick={() => handleSubTabSwitch('agreements')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-b-3 active:border-b active:translate-y-[1px] shadow-xs ${
              hubSubTab === 'agreements'
                ? isDark
                  ? 'bg-[#C46F18] text-[#241104] border-[#915B15]'
                  : 'bg-[#432006] text-[#FFF0D6] border-[#241104]'
                : isDark
                ? 'text-[#D9C4AC] hover:text-[#FFF9EE] hover:bg-[#3E200C] border-transparent'
                : 'text-[#72451F] hover:text-[#432006] hover:bg-[#E8BF88] border-transparent'
            }`}
          >
            <HandCoins className="w-3.5 h-3.5" />
            <span>Agreements &amp; Campaigns ({supports.length})</span>
          </button>

          <button
            type="button"
            id="hub-tab-trust-trails"
            onClick={() => handleSubTabSwitch('trust-trails')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-b-3 active:border-b active:translate-y-[1px] shadow-xs ${
              hubSubTab === 'trust-trails'
                ? isDark
                  ? 'bg-[#C46F18] text-[#241104] border-[#915B15]'
                  : 'bg-[#432006] text-[#FFF0D6] border-[#241104]'
                : isDark
                ? 'text-[#D9C4AC] hover:text-[#FFF9EE] hover:bg-[#3E200C] border-transparent'
                : 'text-[#72451F] hover:text-[#432006] hover:bg-[#E8BF88] border-transparent'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>Trails of Trust ({trailEvents.length})</span>
          </button>

          <button
            type="button"
            id="hub-tab-vouches"
            onClick={() => handleSubTabSwitch('vouches')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-b-3 active:border-b active:translate-y-[1px] shadow-xs ${
              hubSubTab === 'vouches'
                ? isDark
                  ? 'bg-[#C46F18] text-[#241104] border-[#915B15]'
                  : 'bg-[#432006] text-[#FFF0D6] border-[#241104]'
                : isDark
                ? 'text-[#D9C4AC] hover:text-[#FFF9EE] hover:bg-[#3E200C] border-transparent'
                : 'text-[#72451F] hover:text-[#432006] hover:bg-[#E8BF88] border-transparent'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Contextual Vouches ({vouches.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ACTIVE AGREEMENTS & CAMPAIGNS */}
      {hubSubTab === 'agreements' && (
        <section
          className="rounded-2xl p-5 sm:p-7 border-2 border-b-4 transition-all duration-200 shadow-md"
          style={{
            backgroundColor: isDark ? 'rgba(23, 21, 19, 0.55)' : '#FAE5C5',
            borderColor: isDark ? 'rgba(200, 141, 58, 0.35)' : '#CF9F68',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b-2"
            style={{ borderColor: isDark ? '#421E06' : '#DDB985' }}
          >
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wider block mb-1"
                style={{ color: isDark ? '#E5A955' : '#9F520B' }}
              >
                Peer Support Agreements
              </span>
              <h2
                className="font-serif text-xl sm:text-2xl font-bold tracking-tight"
                style={{ color: isDark ? '#FFF9EE' : '#432006' }}
              >
                Active Agreements &amp; Campaigns
              </h2>
            </div>

            {/* Filter Chips */}
            <div
              className="flex items-center gap-1 p-1 rounded-xl border"
              style={{
                backgroundColor: isDark ? 'rgba(30, 27, 24, 0.45)' : '#F3D5AB',
                borderColor: isDark ? 'rgba(200, 141, 58, 0.2)' : '#CF9F68',
              }}
            >
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterType === tab.id
                      ? isDark
                        ? 'bg-[#C46F18] text-[#241104] shadow-xs'
                        : 'bg-[#432006] text-[#FFF0D6] shadow-xs'
                      : isDark
                      ? 'text-[#D9C4AC] hover:text-[#FFF9EE]'
                      : 'text-[#72451F] hover:text-[#432006]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Agreements Stream */}
          <div className="space-y-5">
            {filteredSupports.length === 0 ? (
              <div
                className="text-center py-12 text-xs rounded-xl border border-dashed"
                style={{
                  backgroundColor: isDark ? 'rgba(30, 27, 24, 0.45)' : '#F3D5AB',
                  borderColor: isDark ? 'rgba(200, 141, 58, 0.25)' : '#CF9F68',
                  color: isDark ? '#D9C4AC' : '#72451F',
                }}
              >
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
                    className="rounded-2xl p-5 sm:p-6 border-2 border-b-4 transition-all duration-200 shadow-md space-y-4"
                    style={{
                      backgroundColor: isDark ? 'rgba(23, 21, 19, 0.55)' : '#FFF0D6',
                      borderColor: isDark ? 'rgba(200, 141, 58, 0.35)' : '#CF9F68',
                    }}
                  >
                    {/* Top Bar: Badges + Timestamp */}
                    <div
                      className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b"
                      style={{ borderColor: isDark ? '#421E06' : '#DDB985' }}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {support.type === 'loan' && (
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase border shadow-xs"
                            style={{
                              backgroundColor: isDark ? 'rgba(42, 34, 28, 0.6)' : '#F3D5AB',
                              color: isDark ? '#F5C678' : '#9F520B',
                              borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full mr-1.5 shadow-xs"
                              style={{ backgroundColor: isDark ? '#C46F18' : '#9F520B' }}
                              aria-hidden="true"
                            />
                            Peer Loan
                          </span>
                        )}
                        {support.type === 'gift' && (
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase border shadow-xs"
                            style={{
                              backgroundColor: isDark ? 'rgba(42, 34, 28, 0.6)' : '#F3D5AB',
                              color: isDark ? '#D8B4E2' : '#6B21A8',
                              borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full mr-1.5 shadow-xs"
                              style={{ backgroundColor: '#9333EA' }}
                              aria-hidden="true"
                            />
                            Voluntary Gift
                          </span>
                        )}
                        {support.type === 'contribution' && (
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase border shadow-xs"
                            style={{
                              backgroundColor: isDark ? 'rgba(42, 34, 28, 0.6)' : '#F3D5AB',
                              color: isDark ? '#86EFAC' : '#166534',
                              borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full mr-1.5 shadow-xs"
                              style={{ backgroundColor: '#16A34A' }}
                              aria-hidden="true"
                            />
                            Shared Campaign
                          </span>
                        )}

                        {/* Status Badges */}
                        {isForgiven && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                            <Gift className="w-3 h-3 mr-1" />
                            Forgiven into Gift
                          </span>
                        )}
                        {isRepaid && !isForgiven && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Fully Repaid
                          </span>
                        )}
                        {isOverdue && !isRepaid && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Overdue
                          </span>
                        )}
                      </div>

                      <span
                        className="text-xs font-mono font-medium"
                        style={{ color: isDark ? '#D9C4AC' : '#72451F' }}
                      >
                        {new Date(support.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Parties & Purpose */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="font-bold text-base"
                            style={{ color: isDark ? '#FFF9EE' : '#432006' }}
                          >
                            {support.fromMemberName}
                          </span>
                          <span
                            className="text-xs font-medium"
                            style={{ color: isDark ? '#D9C4AC' : '#72451F' }}
                          >
                            →
                          </span>
                          <span
                            className="font-bold text-base"
                            style={{ color: isDark ? '#FFF9EE' : '#432006' }}
                          >
                            {support.type === 'contribution'
                              ? support.title || 'Chamber Campaign'
                              : support.toMemberName}
                          </span>
                        </div>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: isDark ? '#D9C4AC' : '#5A3013' }}
                        >
                          {support.purpose}
                        </p>
                      </div>

                      {/* Amounts */}
                      <div className="text-left md:text-right shrink-0">
                        <div
                          className="font-mono font-bold text-xl sm:text-2xl"
                          style={{ color: isDark ? '#FFF9EE' : '#432006' }}
                        >
                          ₦{support.amount.toLocaleString()}
                        </div>
                        {support.type === 'loan' && (
                          <div
                            className="text-xs font-mono"
                            style={{ color: isDark ? '#E5A955' : '#9F520B' }}
                          >
                            Repaid: ₦{support.amountRepaid.toLocaleString()} / Remaining: ₦{remaining.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar for Loans & Campaigns */}
                    {support.type === 'loan' && (
                      <div className="space-y-1">
                        <div
                          className="w-full h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: isDark ? '#3E200C' : '#F3D5AB' }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, Math.round((support.amountRepaid / support.amount) * 100))}%`,
                              backgroundColor: isForgiven ? '#9333EA' : isRepaid ? '#16A34A' : '#C46F18',
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] font-mono">
                          <span style={{ color: isDark ? '#D9C4AC' : '#72451F' }}>
                            {Math.round((support.amountRepaid / support.amount) * 100)}% Repaid
                          </span>
                          {support.repaymentDate && (
                            <span style={{ color: isDark ? '#D9C4AC' : '#72451F' }}>
                              Due: {new Date(support.repaymentDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons for Agreements */}
                    <div
                      className="pt-3 border-t flex flex-wrap items-center justify-end gap-2.5"
                      style={{ borderColor: isDark ? '#421E06' : '#DDB985' }}
                    >
                      {support.type === 'loan' && !isRepaid && !isForgiven && (
                        <>
                          <button
                            type="button"
                            id={`btn-repay-${support.id}`}
                            onClick={() => handleOpenRepay(support)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            Record Repayment
                          </button>

                          {isCurrentUserLender && (
                            <button
                              type="button"
                              id={`btn-forgive-${support.id}`}
                              onClick={() => handleOpenForgive(support)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer bg-purple-600 text-white hover:bg-purple-700"
                            >
                              Forgive Debt into Gift
                            </button>
                          )}
                        </>
                      )}

                      {support.type === 'contribution' && (
                        <button
                          type="button"
                          id={`btn-contrib-${support.id}`}
                          onClick={() => handleOpenCampaignContrib(support)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer bg-amber-600 text-white hover:bg-amber-700"
                        >
                          + Contribute to Fund
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* VIEW 2: TRAILS OF TRUST FEED */}
      {hubSubTab === 'trust-trails' && (
        <div className="animate-in fade-in duration-150">
          <TrustTrailFeed trailEvents={trailEvents} availableMembers={availableMembers} isDark={isDark} />
        </div>
      )}

      {/* VIEW 3: CONTEXTUAL VOUCHES */}
      {hubSubTab === 'vouches' && (
        <div className="animate-in fade-in duration-150">
          <VouchSection
            vouches={vouches}
            availableMembers={availableMembers}
            currentMember={currentMember}
            isDark={isDark}
            onAddVouch={onAddVouch || (() => {})}
          />
        </div>
      )}

      {/* MODAL: CREATE PEER SUPPORT */}
      {isCreateModalOpen && (
        <PeerSupportModal
          onClose={() => setIsCreateModalOpen(false)}
          availableMembers={availableMembers}
          currentMember={currentMember}
          initialType={selectedInitialType}
          onSubmitSupport={onCreateSupport}
          isDark={isDark}
        />
      )}

      {/* MODAL: RECORD REPAYMENT */}
      {repayModalSupport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-md rounded-2xl p-6 border-2 border-b-4 shadow-xl space-y-4"
            style={{
              backgroundColor: isDark ? '#231206' : '#FAE5C5',
              borderColor: isDark ? 'rgba(200, 141, 58, 0.4)' : '#CF9F68',
            }}
          >
            <h3
              className="font-serif text-lg font-bold"
              style={{ color: isDark ? '#FFF9EE' : '#432006' }}
            >
              Record Loan Repayment
            </h3>
            <p className="text-xs" style={{ color: isDark ? '#D9C4AC' : '#5A3013' }}>
              Confirm repayment amount received from {repayModalSupport.toMemberName}.
            </p>
            <form onSubmit={handleConfirmRepay} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: isDark ? '#FFF9EE' : '#432006' }}>
                  Amount (₦)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-sm border font-mono"
                  style={{
                    backgroundColor: isDark ? 'rgba(42, 34, 28, 0.7)' : '#FFF0D6',
                    borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                    color: isDark ? '#FFF9EE' : '#432006',
                  }}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRepayModalSupport(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer"
                  style={{
                    backgroundColor: isDark ? 'rgba(42, 34, 28, 0.6)' : '#F3D5AB',
                    borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                    color: isDark ? '#FFF9EE' : '#432006',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Confirm Repayment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FORGIVE DEBT INTO GIFT */}
      {forgiveModalSupport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-md rounded-2xl p-6 border-2 border-b-4 shadow-xl space-y-4"
            style={{
              backgroundColor: isDark ? '#231206' : '#FAE5C5',
              borderColor: isDark ? 'rgba(200, 141, 58, 0.4)' : '#CF9F68',
            }}
          >
            <h3
              className="font-serif text-lg font-bold"
              style={{ color: isDark ? '#FFF9EE' : '#432006' }}
            >
              Permanently Forgive Debt into Gift
            </h3>
            <p className="text-xs" style={{ color: isDark ? '#D9C4AC' : '#5A3013' }}>
              Converting this loan of ₦{forgiveModalSupport.amount.toLocaleString()} into a gift permanently extinguishes repayment liability.
            </p>
            <form onSubmit={handleConfirmForgive} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: isDark ? '#FFF9EE' : '#432006' }}>
                  Solidarity Note
                </label>
                <textarea
                  value={forgiveReason}
                  onChange={(e) => setForgiveReason(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl text-sm border"
                  style={{
                    backgroundColor: isDark ? 'rgba(42, 34, 28, 0.7)' : '#FFF0D6',
                    borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                    color: isDark ? '#FFF9EE' : '#432006',
                  }}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgiveModalSupport(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer"
                  style={{
                    backgroundColor: isDark ? 'rgba(42, 34, 28, 0.6)' : '#F3D5AB',
                    borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                    color: isDark ? '#FFF9EE' : '#432006',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
                >
                  Confirm Forgiveness
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CAMPAIGN CONTRIBUTION */}
      {campaignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-md rounded-2xl p-6 border-2 border-b-4 shadow-xl space-y-4"
            style={{
              backgroundColor: isDark ? '#231206' : '#FAE5C5',
              borderColor: isDark ? 'rgba(200, 141, 58, 0.4)' : '#CF9F68',
            }}
          >
            <h3
              className="font-serif text-lg font-bold"
              style={{ color: isDark ? '#FFF9EE' : '#432006' }}
            >
              Contribute to {campaignModal.title || 'Chamber Fund'}
            </h3>
            <form onSubmit={handleConfirmCampaignContrib} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: isDark ? '#FFF9EE' : '#432006' }}>
                  Contribution Amount (₦)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={campaignContribAmount}
                  onChange={(e) => setCampaignContribAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-sm border font-mono"
                  style={{
                    backgroundColor: isDark ? 'rgba(42, 34, 28, 0.7)' : '#FFF0D6',
                    borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                    color: isDark ? '#FFF9EE' : '#432006',
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: isDark ? '#FFF9EE' : '#432006' }}>
                  Note
                </label>
                <input
                  type="text"
                  value={campaignContribNote}
                  onChange={(e) => setCampaignContribNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm border"
                  style={{
                    backgroundColor: isDark ? 'rgba(42, 34, 28, 0.7)' : '#FFF0D6',
                    borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                    color: isDark ? '#FFF9EE' : '#432006',
                  }}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCampaignModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer"
                  style={{
                    backgroundColor: isDark ? 'rgba(42, 34, 28, 0.6)' : '#F3D5AB',
                    borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
                    color: isDark ? '#FFF9EE' : '#432006',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
                >
                  Contribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
