export type ThemeMode = 'dark' | 'light';

export type UserRole = 'fellow' | 'roommate' | 'steward';

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
  handle?: string;
  cohort?: string;
  roomNumber: string;
  stipendSchedule?: string;
  joinedDate?: string;
  stipendFrequency?: string;
  nextStipendDate?: string;
  standing?: string;
  trustSignalsCount?: number;
}

export type SupportType = 'loan' | 'gift' | 'contribution' | 'mentorship';

export interface PeerSupportItem {
  id: string;
  fromMemberId?: string;
  toMemberId: string;
  toMemberName: string;
  toMemberAvatar: string;
  type: SupportType;
  title: string;
  description: string;
  amount?: number;
  currency?: string;
  repaymentExpected: boolean;
  repaymentDueDate?: string;
  status: 'open' | 'fulfilled' | 'declined' | 'repaid' | 'renegotiated';
  createdAt: string;
  category: 'rent' | 'laptop_repair' | 'utilities' | 'food' | 'certification';
  vouchCount: number;
}

export interface ContextualVouch {
  id: string;
  voucherId: string;
  voucherName: string;
  voucherAvatar: string;
  targetMemberId: string;
  targetMemberName: string;
  context: string;
  confidenceLevel: 'high' | 'solid' | 'cautious';
  commitmentReference: string;
  timestamp: string;
  note: string;
}

export type TrustTrailEventType =
  | 'commitment_created'
  | 'payment_recorded'
  | 'partial_payment'
  | 'support_provided'
  | 'repayment_fulfilled'
  | 'vouch_issued'
  | 'due_date_renegotiated'
  | 'repair_completed'
  | 'statement_issued';

export interface TrustTrailEvent {
  id: string;
  timestamp: string;
  type: TrustTrailEventType;
  actorName: string;
  actorAvatar: string;
  title: string;
  details: string;
  amount?: number;
  hash: string;
  isPrivate: boolean;
  verified: boolean;
  evidenceRef?: string;
  repairRef?: string;
}

export interface Chamber {
  id: string;
  name: string;
  unit: string;
  address: string;
  totalMonthlyRent: number;
  currency: string;
  nextDueDate: string;
  cycleProgressPercent: number;
  members: Member[];
  utilities: {
    name: string;
    amount: number;
    splitPerPerson: number;
    status: 'collected' | 'pending' | 'due_soon';
    dueDate: string;
  }[];
}

export interface RecognitionBadge {
  id: string;
  title: string;
  description: string;
  category: 'commitments' | 'communication' | 'repair' | 'vouching' | 'stewardship';
  earnedDate: string;
  verifiedTrailCount: number;
}
