"use client";

import { useChamber } from "@/context/ChamberContext";
import { shortDate } from "@/data/chamber";

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

export function TrailView() {
  const { chamber } = useChamber();
  const events = [...chamber.trail].reverse();

  return (
    <section className="desk overflow-hidden">
      <div className="border-b border-line px-5 py-5 sm:px-7">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-3">Trail of trust</p>
        <h1 className="serif mt-2 text-[1.7rem] leading-none tracking-tight">
          What happened, in order
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-2">
          History is not silently rewritten. Corrections would keep what changed, why,
          and who had authority. Private evidence stays purpose-bound.
        </p>
      </div>

      <ol className="relative px-5 py-6 sm:px-7">
        <span
          className="trail-rail absolute top-6 bottom-6 left-[34px] w-px sm:left-[42px]"
          aria-hidden
        />
        {events.map((event) => (
          <li key={event.id} className="relative mb-7 last:mb-0 grid grid-cols-[56px_minmax(0,1fr)] gap-3 sm:grid-cols-[72px_minmax(0,1fr)]">
            <span className="relative z-[1] grid h-8 w-8 place-items-center bg-paper text-[10px] font-medium tracking-wide text-laterite-deep ring-1 ring-line sm:h-9 sm:w-9">
              {kindMark[event.kind]}
            </span>
            <div>
              <p className="mono text-[11px] text-ink-3">{shortDate(event.at)}</p>
              <h2 className="mt-1 text-[15px] leading-snug">{event.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">{event.detail}</p>
              {event.private && (
                <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-moss">
                  Evidence held · not broadcast
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
