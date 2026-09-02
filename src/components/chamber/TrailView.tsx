"use client";

import { useMemo, useState } from "react";
import { useChamber } from "@/context/ChamberContext";
import { shortDate, type TrailKind } from "@/data/chamber";

const kindMark: Record<string, string> = {
  cycle: "CY",
  commitment: "CM",
  payment: "PY",
  partial: "PT",
  support: "SP",
  vouch: "VH",
  consent: "CN",
  correction: "CR",
  note: "NT",
  statement: "ST",
};

const filters: { id: "all" | TrailKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "payment", label: "Payments" },
  { id: "support", label: "Support" },
  { id: "vouch", label: "Vouches" },
  { id: "note", label: "Notes" },
];

export function TrailView({ preview = false }: { preview?: boolean }) {
  const { chamber } = useChamber();
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const events = useMemo(() => {
    const rows = [...chamber.trail].sort(
      (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
    );
    if (filter === "all") return rows;
    if (filter === "payment") {
      return rows.filter((event) => event.kind === "payment" || event.kind === "partial");
    }
    return rows.filter((event) => event.kind === filter);
  }, [chamber.trail, filter]);

  return (
    <section className="desk overflow-hidden">
      {!preview && (
        <div className="border-b-2 border-line px-4 py-5 sm:px-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-3">Trail of trust</p>
          <h1 className="serif mt-2 text-[1.7rem] leading-none tracking-tight">
            What happened, in order
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-2">
            History is not silently rewritten. Corrections would keep what changed, why,
            and who had authority. Private evidence stays purpose-bound.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`choice px-3 py-1.5 text-[12px] ${filter === item.id ? "choice-on" : ""}`}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <ol className="relative px-5 py-6 sm:px-7">
        <span
          className="trail-rail absolute top-6 bottom-6 left-[34px] w-px sm:left-[42px]"
          aria-hidden
        />
        {events.map((event) => (
          <li
            key={event.id}
            className="relative mb-7 grid grid-cols-[56px_minmax(0,1fr)] gap-3 last:mb-0 sm:grid-cols-[72px_minmax(0,1fr)]"
          >
            <span className="relative z-[1] grid h-8 w-8 place-items-center rounded-lg bg-paper text-[10px] font-medium tracking-wide text-laterite-deep ring-1 ring-line sm:h-9 sm:w-9">
              {kindMark[event.kind]}
            </span>
            <div className="rounded-xl px-1 py-0.5 transition hover:bg-paper-2/70">
              <p className="mono text-[11px] text-ink-3">{shortDate(event.at)}</p>
          <h2 className="mt-1 text-[15px] font-bold leading-snug">{event.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">{event.detail}</p>
              {event.private && (
                <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-moss">
                  Evidence held · not broadcast
                </p>
              )}
            </div>
          </li>
        ))}
        {events.length === 0 && (
          <li className="pl-16 text-sm text-ink-3">Nothing in this filter yet.</li>
        )}
      </ol>
    </section>
  );
}
