"use client";

import Link from "next/link";
import { useChamber } from "@/context/ChamberContext";
import { dayLabel, naira } from "@/data/chamber";

const statusCopy = {
  settled: "Settled",
  partial: "Partial",
  open: "Open",
  repair: "Repair visible",
} as const;

export function RoomBoard({ preview = false }: { preview?: boolean }) {
  const { chamber, collectedKobo, shareKobo } = useChamber();
  const remaining = chamber.rentKobo - collectedKobo;
  const openAsk = chamber.asks.find((ask) => ask.status === "open" && ask.toId === "ada");
  const Title = preview ? "h2" : "h1";

  return (
    <div className={preview ? "" : "grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]"}>
      <section className="desk overflow-hidden">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line px-5 py-5 sm:px-7">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink-3">
              Shared responsibility
            </p>
            <Title className="serif mt-2 text-[1.7rem] leading-none tracking-tight sm:text-[2rem]">
              {chamber.cycle}
            </Title>
            <p className="mt-2 text-sm text-ink-2">
              Due {dayLabel(chamber.dueOn)} · four people · one chamber
            </p>
          </div>
          <div className="text-right">
            <p className="mono text-[11px] uppercase tracking-[0.16em] text-ink-3">Still open</p>
            <p className="num mt-1 text-2xl font-medium tracking-tight">{naira(remaining)}</p>
          </div>
        </div>

        <ul>
          {chamber.commitments.map((row) => {
            const member = chamber.members.find((m) => m.id === row.memberId);
            if (!member) return null;
            const ratio = Math.min(100, Math.round((row.paidKobo / row.dueKobo) * 100));
            return (
              <li
                key={row.memberId}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-line px-5 py-4 last:border-0 sm:grid-cols-[auto_minmax(0,1fr)_140px_auto] sm:px-7"
              >
                <span
                  className="grid h-10 w-10 place-items-center bg-paper-2 text-[12px] font-medium"
                  aria-hidden
                >
                  {member.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[15px]">
                    {member.name}
                    {member.you && (
                      <span className="ml-2 text-[11px] uppercase tracking-[0.14em] text-laterite">
                        You
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[12px] text-ink-3">
                    {member.role}
                    {member.note ? ` · ${member.note}` : ""}
                  </p>
                  <div className="mt-2 h-1 bg-paper-3 sm:hidden">
                    <div
                      className={`h-full ${row.status === "settled" || row.status === "repair" ? "bg-moss" : "bg-laterite"}`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="h-1 bg-paper-3">
                    <div
                      className={`h-full ${row.status === "settled" || row.status === "repair" ? "bg-moss" : "bg-laterite"}`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                  <p className="mono mt-1 text-[11px] text-ink-3">
                    {naira(row.paidKobo)} / {naira(row.dueKobo)}
                  </p>
                </div>
                <span
                  className={`justify-self-end text-[11px] uppercase tracking-[0.12em] ${
                    row.status === "settled"
                      ? "text-ok"
                      : row.status === "repair"
                        ? "text-moss-2"
                        : row.status === "partial"
                          ? "text-warn"
                          : "text-open"
                  }`}
                >
                  {statusCopy[row.status]}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {!preview && (
        <aside className="flex flex-col gap-4">
          <section className="desk p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ink-3">This cycle</p>
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
                <dd>{dayLabel(chamber.dueOn)}</dd>
              </div>
            </dl>
            <p className="serif mt-5 text-[15px] leading-relaxed text-ink-2">
              Coordinators are optional. Ordinary support stays peer to peer.
            </p>
          </section>

          {openAsk && (
            <section className="desk border-laterite/40 p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-laterite">
                Open ask · loan
              </p>
              <p className="mt-3 text-[15px] leading-relaxed">
                Kofi asked you for {naira(openAsk.amountKobo)}. Meaning is already
                clear: repayment expected.
              </p>
              <Link
                href="/chamber/support"
                className="mt-4 inline-flex bg-ink px-3 py-2 text-[13px] text-paper hover:bg-laterite"
              >
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
