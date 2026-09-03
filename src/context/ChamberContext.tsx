"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  STORAGE_KEY,
  initialChamber,
  nid,
  naira,
  type ChamberState,
  type SupportKind,
  type Vouch,
} from "@/data/chamber";

type ChamberContextValue = {
  chamber: ChamberState;
  youId: string;
  collectedKobo: number;
  shareKobo: number;
  notice: string | null;
  ready: boolean;
  clearNotice: () => void;
  resetDemo: () => void;
  respondToAsk: (askId: string, action: "accepted" | "declined") => void;
  offerSupport: (input: {
    toId: string;
    kind: SupportKind;
    amountKobo: number;
    purpose: string;
  }) => void;
  fileVouch: (input: Omit<Vouch, "id" | "fromId" | "declined">) => void;
  declineVouch: (forId: string, context: string) => void;
  applyRailPayment: (input: {
    toId?: string;
    amountKobo: number;
    kind: SupportKind | "share";
    purpose: string;
    reference: string;
  }) => void;
};

const ChamberContext = createContext<ChamberContextValue | null>(null);

function isChamberState(value: unknown): value is ChamberState {
  if (!value || typeof value !== "object") return false;
  const row = value as ChamberState;
  return (
    row.id === "chamber-4" &&
    Array.isArray(row.members) &&
    Array.isArray(row.commitments) &&
    Array.isArray(row.trail) &&
    Array.isArray(row.asks) &&
    Array.isArray(row.vouches)
  );
}

export function ChamberProvider({ children }: { children: ReactNode }) {
  const [chamber, setChamber] = useState<ChamberState>(initialChamber);
  const [notice, setNotice] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isChamberState(parsed)) setChamber(parsed);
      }
    } catch {
      /* keep the seeded walkthrough */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chamber));
    } catch {
      /* private mode or quota — demo still works in memory */
    }
  }, [ready, chamber]);

  const collectedKobo = useMemo(
    () => chamber.commitments.reduce((sum, row) => sum + row.paidKobo, 0),
    [chamber.commitments],
  );

  const shareKobo = useMemo(
    () => Math.round(chamber.rentKobo / chamber.members.length),
    [chamber.rentKobo, chamber.members.length],
  );

  const youId = useMemo(
    () => chamber.members.find((m) => m.you)?.id ?? "ada",
    [chamber.members],
  );

  const flash = useCallback((message: string) => setNotice(message), []);
  const clearNotice = useCallback(() => setNotice(null), []);

  const resetDemo = useCallback(() => {
    setChamber(initialChamber());
    flash("Demo restored to the September starting point. Saved in this browser.");
  }, [flash]);

  const respondToAsk = useCallback(
    (askId: string, action: "accepted" | "declined") => {
      setChamber((prev) => {
        const ask = prev.asks.find((item) => item.id === askId);
        if (!ask || ask.status !== "open") return prev;

        const now = new Date().toISOString();
        const from = prev.members.find((m) => m.id === ask.fromId);
        const to = prev.members.find((m) => m.id === ask.toId);

        if (action === "declined") {
          flash("You declined. That choice is legitimate. No score moved.");
          return {
            ...prev,
            asks: prev.asks.map((item) =>
              item.id === askId ? { ...item, status: "declined" } : item,
            ),
            trail: [
              ...prev.trail,
              {
                id: nid("t"),
                at: now,
                kind: "support",
                title: `${to?.given ?? "A member"} declined a ${ask.kind}`,
                detail:
                  "Declining is a legitimate answer. No negative recognition was attached.",
                actorId: ask.toId,
              },
            ],
          };
        }

        flash("Loan accepted. Repayment remains expected. The trail kept the meaning.");

        const nextCommitments = prev.commitments.map((row) => {
          if (row.memberId !== ask.fromId) return row;
          const paidKobo = Math.min(row.dueKobo, row.paidKobo + ask.amountKobo);
          return {
            ...row,
            paidKobo,
            status: paidKobo >= row.dueKobo ? ("repair" as const) : ("partial" as const),
          };
        });

        return {
          ...prev,
          asks: prev.asks.map((item) =>
            item.id === askId ? { ...item, status: "accepted" } : item,
          ),
          commitments: nextCommitments,
          trail: [
            ...prev.trail,
            {
              id: nid("t"),
              at: now,
              kind: "support",
              title: `${to?.given ?? "A member"} accepted a ${ask.kind} for ${from?.given ?? "a peer"}`,
              detail: `${naira(ask.amountKobo)}. ${ask.terms ?? ask.purpose} The kind was not silently changed.`,
              actorId: ask.toId,
            },
          ],
        };
      });
    },
    [flash],
  );

  const offerSupport = useCallback(
    (input: { toId: string; kind: SupportKind; amountKobo: number; purpose: string }) => {
      setChamber((prev) => {
        const you = prev.members.find((m) => m.you);
        const peer = prev.members.find((m) => m.id === input.toId);
        if (!you || !peer) return prev;
        const now = new Date().toISOString();
        const askId = nid("ask");

        const nextCommitments = prev.commitments.map((row) => {
          if (row.memberId !== input.toId) return row;
          const paidKobo = Math.min(row.dueKobo, row.paidKobo + input.amountKobo);
          return {
            ...row,
            paidKobo,
            status: paidKobo >= row.dueKobo ? ("repair" as const) : ("partial" as const),
          };
        });

        const terms =
          input.kind === "loan"
            ? "Repayment expected."
            : input.kind === "gift"
              ? "No repayment expected."
              : "Support toward a purpose. Does not automatically create debt.";

        flash(
          input.kind === "loan"
            ? "Loan recorded as a loan. It was not converted into a gift."
            : input.kind === "gift"
              ? "Gift recorded. No repayment trail was created."
              : "Contribution recorded toward a purpose. No automatic debt.",
        );

        return {
          ...prev,
          commitments: nextCommitments,
          asks: [
            ...prev.asks,
            {
              id: askId,
              fromId: input.toId,
              toId: you.id,
              kind: input.kind,
              amountKobo: input.amountKobo,
              purpose: input.purpose,
              status: "accepted",
              terms,
            },
          ],
          trail: [
            ...prev.trail,
            {
              id: nid("t"),
              at: now,
              kind: "support",
              title: `${you.given} offered a ${input.kind} to ${peer.given}`,
              detail: `${naira(input.amountKobo)}. ${terms} ${input.purpose}`,
              actorId: you.id,
            },
          ],
        };
      });
    },
    [flash],
  );

  const fileVouch = useCallback(
    (input: Omit<Vouch, "id" | "fromId" | "declined">) => {
      setChamber((prev) => {
        const you = prev.members.find((m) => m.you);
        const peer = prev.members.find((m) => m.id === input.forId);
        if (!you) return prev;
        const now = new Date().toISOString();
        flash(
          `Vouch filed for ${peer?.given ?? "a peer"}. Contextual. Time-bound. Not a universal trust score.`,
        );
        return {
          ...prev,
          vouches: [
            ...prev.vouches,
            { ...input, id: nid("v"), fromId: you.id, declined: false },
          ],
          trail: [
            ...prev.trail,
            {
              id: nid("t"),
              at: now,
              kind: "vouch",
              title: `${you.given} vouched for ${peer?.given ?? "a peer"}`,
              detail: `In ${input.context}, at ${input.confidence} confidence, for ${input.commitment}. This is not a universal trust score.`,
              actorId: you.id,
            },
          ],
        };
      });
    },
    [flash],
  );

  const declineVouch = useCallback(
    (forId: string, context: string) => {
      setChamber((prev) => {
        const you = prev.members.find((m) => m.you);
        const peer = prev.members.find((m) => m.id === forId);
        if (!you) return prev;
        const now = new Date().toISOString();
        flash(
          `You declined to vouch for ${peer?.given ?? "a peer"}. That can be excellent judgment.`,
        );
        return {
          ...prev,
          vouches: [
            ...prev.vouches,
            {
              id: nid("v"),
              fromId: you.id,
              forId,
              context,
              confidence: "measured",
              commitment: "September rent",
              note: "Declined. Judgment, not a penalty.",
              declined: true,
            },
          ],
          trail: [
            ...prev.trail,
            {
              id: nid("t"),
              at: now,
              kind: "vouch",
              title: `${you.given} declined to vouch for ${peer?.given ?? "a peer"}`,
              detail:
                "A declined vouch can be excellent judgment. No guarantor liability. No negative label.",
              actorId: you.id,
            },
          ],
        };
      });
    },
    [flash],
  );

  const applyRailPayment = useCallback(
    (input: {
      toId?: string;
      amountKobo: number;
      kind: SupportKind | "share";
      purpose: string;
      reference: string;
    }) => {
      setChamber((prev) => {
        const you = prev.members.find((m) => m.you);
        const targetId = input.toId ?? you?.id;
        const peer = prev.members.find((m) => m.id === targetId);
        if (!you || !targetId) return prev;
        const now = new Date().toISOString();
        const nextCommitments = prev.commitments.map((row) => {
          if (row.memberId !== targetId) return row;
          const paidKobo = Math.min(row.dueKobo, row.paidKobo + input.amountKobo);
          return {
            ...row,
            paidKobo,
            status:
              paidKobo >= row.dueKobo
                ? row.status === "open" || row.status === "partial"
                  ? ("repair" as const)
                  : ("settled" as const)
                : ("partial" as const),
          };
        });
        flash(
          input.kind === "share"
            ? "Share recorded on the BMONI rail. The trail kept the evidence."
            : `${input.kind} sent on BMONI. Meaning stayed intact.`,
        );
        return {
          ...prev,
          commitments: nextCommitments,
          trail: [
            ...prev.trail,
            {
              id: nid("t"),
              at: now,
              kind: input.kind === "share" ? "payment" : "support",
              title:
                input.kind === "share"
                  ? `${peer?.given ?? "A member"} paid a share on BMONI`
                  : `${you.given} sent a ${input.kind} to ${peer?.given ?? "a peer"} on BMONI`,
              detail: `${naira(input.amountKobo)}. ${input.purpose} Rail ref ${input.reference}. Evidence purpose-bound.`,
              actorId: you.id,
              private: true,
            },
          ],
        };
      });
    },
    [flash],
  );

  const value = useMemo(
    () => ({
      chamber,
      youId,
      collectedKobo,
      shareKobo,
      notice,
      ready,
      clearNotice,
      resetDemo,
      respondToAsk,
      offerSupport,
      fileVouch,
      declineVouch,
      applyRailPayment,
    }),
    [
      chamber,
      youId,
      collectedKobo,
      shareKobo,
      notice,
      ready,
      clearNotice,
      resetDemo,
      respondToAsk,
      offerSupport,
      fileVouch,
      declineVouch,
      applyRailPayment,
    ],
  );

  return <ChamberContext.Provider value={value}>{children}</ChamberContext.Provider>;
}

export function useChamber() {
  const ctx = useContext(ChamberContext);
  if (!ctx) throw new Error("useChamber must be used inside ChamberProvider");
  return ctx;
}
