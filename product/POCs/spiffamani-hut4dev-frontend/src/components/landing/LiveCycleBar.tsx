"use client";

import { useChamber } from "@/context/ChamberContext";
import { naira } from "@/data/chamber";
import { useDueLabel } from "@/hooks/useDueLabel";

export function LiveCycleBar() {
  const { chamber, collectedKobo } = useChamber();
  const remaining = chamber.rentKobo - collectedKobo;
  const pct = Math.round((collectedKobo / chamber.rentKobo) * 100);
  const dueLabel = useDueLabel(chamber.dueOn);
  const openAsks = chamber.asks.filter((ask) => ask.status === "open").length;

  return (
    <div className="rise rise-d3 mt-8 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">
      <div className="desk p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-3">This cycle</p>
        <p className="num mt-2 text-xl font-medium tracking-tight">{naira(collectedKobo)}</p>
        <p className="mt-1 text-[12px] text-ink-3">of {naira(chamber.rentKobo)} collected</p>
        <div className="meter mt-3 h-1.5 rounded-full">
          <span className="rounded-full bg-moss" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="desk p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-3">Still open</p>
        <p className="num mt-2 text-xl font-medium tracking-tight">{naira(remaining)}</p>
        <p className="mt-1 text-[12px] text-ink-3">{dueLabel} · {chamber.house}</p>
      </div>
      <div className="desk p-4">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-3">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-laterite" />
          Waiting on you
        </p>
        <p className="mt-2 text-xl font-medium tracking-tight">
          {openAsks} open {openAsks === 1 ? "ask" : "asks"}
        </p>
        <p className="mt-1 text-[12px] text-ink-3">Loan and vouch stay named. Nothing is scored.</p>
      </div>
    </div>
  );
}
