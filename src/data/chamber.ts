export type SupportKind = "loan" | "gift" | "contribution";

export type Member = {
  id: string;
  name: string;
  given: string;
  initials: string;
  role: "fellow" | "intern";
  you?: boolean;
  note?: string;
};

export type Commitment = {
  memberId: string;
  dueKobo: number;
  paidKobo: number;
  status: "settled" | "partial" | "open" | "repair";
};

export type TrailKind =
  | "cycle"
  | "commitment"
  | "payment"
  | "partial"
  | "support"
  | "vouch"
  | "consent"
  | "correction"
  | "note"
  | "statement";

export type TrailEvent = {
  id: string;
  at: string;
  kind: TrailKind;
  title: string;
  detail: string;
  actorId?: string;
  private?: boolean;
};

export type SupportAsk = {
  id: string;
  fromId: string;
  toId: string;
  kind: SupportKind;
  amountKobo: number;
  purpose: string;
  status: "open" | "accepted" | "declined";
  terms?: string;
};

export type Vouch = {
  id: string;
  fromId: string;
  forId: string;
  context: string;
  confidence: "low" | "measured" | "high";
  commitment: string;
  note: string;
  declined?: boolean;
};

export type ChamberState = {
  id: string;
  name: string;
  house: string;
  cycle: string;
  dueOn: string;
  rentKobo: number;
  members: Member[];
  commitments: Commitment[];
  trail: TrailEvent[];
  asks: SupportAsk[];
  vouches: Vouch[];
};

export const naira = (kobo: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Math.round(kobo / 100));

export const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export const dayLabel = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

let seq = 80;

export const nid = (prefix: string) => {
  seq += 1;
  return `${prefix}-${seq}`;
};

export const initialChamber = (): ChamberState => ({
  id: "chamber-4",
  name: "Chamber 4",
  house: "Yaba House",
  cycle: "September 2026 rent",
  dueOn: "2026-09-03",
  rentKobo: 18_500_000,
  members: [
    {
      id: "ada",
      name: "Adaeze Okonkwo",
      given: "Adaeze",
      initials: "AO",
      role: "fellow",
      you: true,
    },
    {
      id: "zainab",
      name: "Zainab Bello",
      given: "Zainab",
      initials: "ZB",
      role: "fellow",
    },
    {
      id: "kofi",
      name: "Kofi Mensah",
      given: "Kofi",
      initials: "KM",
      role: "intern",
      note: "Stipend lands 4 Sep. Asked for a loan, not a gift.",
    },
    {
      id: "tunde",
      name: "Tunde Adebayo",
      given: "Tunde",
      initials: "TA",
      role: "fellow",
      note: "Has not written yet. Ada has been asked to vouch in context of rent.",
    },
  ],
  commitments: [
    { memberId: "ada", dueKobo: 4_625_000, paidKobo: 4_625_000, status: "settled" },
    { memberId: "zainab", dueKobo: 4_625_000, paidKobo: 4_625_000, status: "settled" },
    { memberId: "kofi", dueKobo: 4_625_000, paidKobo: 2_000_000, status: "partial" },
    { memberId: "tunde", dueKobo: 4_625_000, paidKobo: 0, status: "open" },
  ],
  asks: [
    {
      id: "ask-kofi",
      fromId: "kofi",
      toId: "ada",
      kind: "loan",
      amountKobo: 2_625_000,
      purpose: "Close September rent. Repay when stipend lands on 4 Sep.",
      status: "open",
      terms: "Repayment expected. Not a gift.",
    },
  ],
  vouches: [],
  trail: [
    {
      id: "t1",
      at: "2026-08-22T09:12:00+01:00",
      kind: "cycle",
      title: "September cycle opened",
      detail: "Chamber 4 rent set at ₦185,000. Split four ways. Due 3 Sep.",
    },
    {
      id: "t2",
      at: "2026-08-22T09:14:00+01:00",
      kind: "commitment",
      title: "Four commitments created",
      detail: "Each member: ₦46,250. Meaning recorded before any payment moved.",
    },
    {
      id: "t3",
      at: "2026-08-26T18:41:00+01:00",
      kind: "payment",
      title: "Zainab settled in full",
      detail: "Bank receipt retained. Hash kept. Raw statement not shown to the room.",
      actorId: "zainab",
      private: true,
    },
    {
      id: "t4",
      at: "2026-08-28T11:05:00+01:00",
      kind: "payment",
      title: "Adaeze settled in full",
      detail: "Verified against the chamber account. Evidence is purpose-bound.",
      actorId: "ada",
      private: true,
    },
    {
      id: "t5",
      at: "2026-08-29T16:22:00+01:00",
      kind: "partial",
      title: "Kofi recorded a partial payment",
      detail: "₦20,000 of ₦46,250. Stipend expected 4 Sep. Context kept with the fact.",
      actorId: "kofi",
    },
    {
      id: "t6",
      at: "2026-08-29T16:40:00+01:00",
      kind: "note",
      title: "Kofi wrote to the room",
      detail:
        "“I am not disappearing. Stipend is late. I would rather borrow than leave a hole.”",
      actorId: "kofi",
    },
    {
      id: "t7",
      at: "2026-08-30T08:17:00+01:00",
      kind: "support",
      title: "Kofi asked Adaeze for a loan",
      detail: "₦26,250. Repayment expected. Gift was not requested. Meaning is explicit.",
      actorId: "kofi",
    },
    {
      id: "t8",
      at: "2026-08-31T10:02:00+01:00",
      kind: "consent",
      title: "Tunde requested a contextual vouch",
      detail: "Asked Adaeze to vouch for September rent only. Not a character score.",
      actorId: "tunde",
    },
  ],
});
