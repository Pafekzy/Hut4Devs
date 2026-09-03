"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill } from "@/components/ui/StatusPill";
import { useChamber } from "@/context/ChamberContext";
import { naira } from "@/data/chamber";
import { useDueLabel } from "@/hooks/useDueLabel";

const statusCopy = {
  settled: "Settled",
  partial: "Partial",
  open: "Open",
  repair: "Repair visible",
} as const;

export function RoomBoard({ preview = false }: { preview?: boolean }) {
  const { chamber, collectedKobo, shareKobo, youId } = useChamber();
  const remaining = chamber.rentKobo - collectedKobo;
  const pct = Math.round((collectedKobo / chamber.rentKobo) * 100);
  const dueLabel = useDueLabel(chamber.dueOn);
  const openAsk = chamber.asks.find((ask) => ask.status === "open" && ask.toId === youId);
  const Title = preview ? "h2" : "h1";
  const [openId, setOpenId] = useState<string | null>(openAsk?.fromId ?? "kofi");

  return (
    <div className={preview ? "min-w-0" : "grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]"}>
      <section className="desk min-w-0 overflow-hidden">
        <div className="flex min-w-0 flex-wrap items-end justify-between gap-4 border-b-[3px] border-line px-4 py-5 sm:px-7">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-3">
              Shared responsibility
            </p>
            <Title className="serif mt-2 text-[1.55rem] leading-none tracking-tight sm:text-[2rem]">
              {chamber.cycle}
            </Title>
            <p className="mt-2 text-sm text-ink-2">
              {dueLabel} · four people · one chamber
            </p>
          </div>
          <div className="text-right">
            <p className="mono text-[11px] uppercase tracking-[0.16em] text-ink-3">Still open</p>
            <p className="num mt-1 text-2xl font-medium tracking-tight">{naira(remaining)}</p>
            <div className="meter ml-auto mt-2 h-2.5 w-28 rounded-full">
              <span className="rounded-full bg-moss" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        <ul>
          {chamber.commitments.map((row) => {
            const member = chamber.members.find((m) => m.id === row.memberId);
            if (!member) return null;
            const ratio = Math.min(100, Math.round((row.paidKobo / row.dueKobo) * 100));
            const expanded = openId === member.id;
            return (
              <li key={row.memberId} className="border-b-2 border-line last:border-0">
                <button
                  type="button"
                  className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 py-4 text-left transition hover:bg-paper-2/60 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,140px)_auto] sm:gap-3 sm:px-7"
                  onClick={() => setOpenId(expanded ? null : member.id)}
                  aria-expanded={expanded}
                >
                  <Avatar id={member.id} initials={member.initials} />
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-bold">
                      {member.name}
                      {member.you && (
                        <span className="ml-2 text-[11px] uppercase tracking-[0.14em] text-laterite">
                          You
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] capitalize text-ink-3">
                      {member.role}
                      {member.note ? ` · ${member.note}` : ""}
                    </span>
                    <span className="meter mt-2 block h-1 rounded-full sm:hidden">
                      <span
                        className={`block h-full rounded-full ${row.status === "settled" || row.status === "repair" ? "bg-moss" : "bg-laterite"}`}
                        style={{ width: `${ratio}%` }}
                      />
                    </span>
                  </span>
                  <span className="hidden min-w-0 sm:block">
                    <span className="meter block h-1 rounded-full">
                      <span
                        className={`block h-full rounded-full ${row.status === "settled" || row.status === "repair" ? "bg-moss" : "bg-laterite"}`}
                        style={{ width: `${ratio}%` }}
                      />
                    </span>
                    <span className="mono mt-1 block text-[11px] text-ink-3">
                      {naira(row.paidKobo)} / {naira(row.dueKobo)}
                    </span>
                  </span>
                  <StatusPill
                    tone={
                      row.status === "settled"
                        ? "settled"
                        : row.status === "repair"
                          ? "repair"
                          : row.status === "partial"
                            ? "partial"
                            : "open"
                    }
                  >
                    {statusCopy[row.status]}
                  </StatusPill>
                </button>
                {expanded && (
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-paper-2/50 px-5 py-3 sm:px-7">
                    <p className="min-w-0 text-[13px] text-ink-2">
                      {naira(row.paidKobo)} of {naira(row.dueKobo)} recorded.
                      {member.note ? ` ${member.note}` : " No extra note on this share."}
                    </p>
                    {!preview && !member.you && (
                      <div className="flex gap-2">
                        <Link href="/chamber/support" className="btn btn-ghost min-h-9 px-3 text-[12px]">
                          Support
                        </Link>
                        <Link href="/chamber/vouch" className="btn btn-ghost min-h-9 px-3 text-[12px]">
                          Vouch
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {!preview && (
        <aside className="flex min-w-0 flex-col gap-4">
          <section className="desk p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-3">This cycle</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-3">Share</dt>
                <dd className="num">{naira(shareKobo)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-3">Collected</dt>
                <dd className="num">{naira(collectedKobo)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-3">Due</dt>
                <dd>{dueLabel}</dd>
              </div>
            </dl>
            <p className="serif mt-5 text-[15px] leading-relaxed text-ink-2">
              Coordinators are optional. Ordinary support stays peer to peer.
            </p>
          </section>

          <section className="desk p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-3">BMONI rail</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">
              Shares, loans, and contributions can settle on BMONI without turning a
              loan into a gift.
            </p>
            <Link href="/chamber/pay" className="btn btn-primary mt-4">
              Pay on BMONI
            </Link>
          </section>

          {openAsk && (
            <section className="desk border-laterite/40 p-5">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-laterite">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-laterite" />
                Open ask · loan
              </p>
              <p className="mt-3 text-[15px] leading-relaxed">
                Kofi asked you for {naira(openAsk.amountKobo)}. Meaning is already
                clear: repayment expected.
              </p>
              <Link href="/chamber/support" className="btn btn-primary mt-4">
                Answer without converting it
              </Link>
            </section>
          )}

          <section className="desk p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ink-3">
              Statement, not a score
            </p>
            <p className="serif mt-3 text-[16px] leading-relaxed">
              “Adaeze fulfilled Chamber 4 September rent on time. Evidence retained.
              Details private.”
            </p>
            <p className="mt-3 text-[12px] text-ink-3">
              Recognition says what was demonstrated here. It does not calculate who
              you are.
            </p>
          </section>
        </aside>
      )}
    </div>
  );
}
