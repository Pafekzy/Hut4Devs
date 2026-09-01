"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
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
  respondToAsk: (askId: string, action: "accepted" | "declined") => void;
  offerSupport: (input: {
    toId: string;
    kind: SupportKind;
    amountKobo: number;
    purpose: string;
  }) => void;
  fileVouch: (input: Omit<Vouch, "id" | "fromId" | "declined">) => void;
  declineVouch: (forId: string, context: string) => void;
};

const ChamberContext = createContext<ChamberContextValue | null>(null);

export function ChamberProvider({ children }: { children: ReactNode }) {
  const [chamber, setChamber] = useState<ChamberState>(initialChamber);

  const collectedKobo = useMemo(
    () => chamber.commitments.reduce((sum, row) => sum + row.paidKobo, 0),
    [chamber.commitments],
  );

  const shareKobo = useMemo(
    () => Math.round(chamber.rentKobo / chamber.members.length),
    [chamber.rentKobo, chamber.members.length],
  );

  const respondToAsk = useCallback((askId: string, action: "accepted" | "declined") => {
    setChamber((prev) => {
      const ask = prev.asks.find((item) => item.id === askId);
      if (!ask || ask.status !== "open") return prev;

      const now = new Date().toISOString();
      const from = prev.members.find((m) => m.id === ask.fromId);
      const to = prev.members.find((m) => m.id === ask.toId);

      if (action === "declined") {
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
  }, []);

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
    [],
  );

  const fileVouch = useCallback((input: Omit<Vouch, "id" | "fromId" | "declined">) => {
    setChamber((prev) => {
      const you = prev.members.find((m) => m.you);
      const peer = prev.members.find((m) => m.id === input.forId);
      if (!you) return prev;
      const now = new Date().toISOString();
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
  }, []);

  const declineVouch = useCallback((forId: string, context: string) => {
    setChamber((prev) => {
      const you = prev.members.find((m) => m.you);
      const peer = prev.members.find((m) => m.id === forId);
      if (!you) return prev;
      const now = new Date().toISOString();
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
  }, []);

  const value = useMemo(
    () => ({
      chamber,
      youId: "ada",
      collectedKobo,
      shareKobo,
      respondToAsk,
      offerSupport,
      fileVouch,
      declineVouch,
    }),
    [chamber, collectedKobo, shareKobo, respondToAsk, offerSupport, fileVouch, declineVouch],
  );

  return <ChamberContext.Provider value={value}>{children}</ChamberContext.Provider>;
}

export function useChamber() {
  const ctx = useContext(ChamberContext);
  if (!ctx) throw new Error("useChamber must be used inside ChamberProvider");
  return ctx;
}
