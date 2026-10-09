"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useChamber } from "@/context/ChamberContext";

export function VouchDesk() {
  const { chamber, fileVouch, declineVouch } = useChamber();
  const others = useMemo(() => chamber.members.filter((m) => !m.you), [chamber.members]);
  const [forId, setForId] = useState("tunde");
  const [context, setContext] = useState("Chamber 4 · September rent");
  const [confidence, setConfidence] = useState<"low" | "measured" | "high">("measured");
  const [commitment, setCommitment] = useState("Closing his share by 3 Sep, or writing before it slips");
  const [note, setNote] = useState(
    "I can speak to how he handled July. I am not guaranteeing his money.",
  );
  const [stamped, setStamped] = useState("today");

  useEffect(() => {
    setStamped(
      new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    );
  }, []);

  const peer = others.find((m) => m.id === forId);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    fileVouch({ forId, context, confidence, commitment, note });
  }

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <form className="desk min-w-0 p-4 sm:p-6 md:p-7" onSubmit={onSubmit}>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-3">
          Distributed trust
        </p>
        <h1 className="serif mt-2 text-[1.55rem] leading-none tracking-tight sm:text-[1.7rem]">
          A vouch is a sentence, not a rank
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-2">
          You vouch for someone in a context, at a confidence, for a commitment, at a
          time. You do not become their guarantor.
        </p>

        <label className="mt-6 block text-[12px] uppercase tracking-[0.14em] text-ink-3">
          For
          <select
            className="field mt-2 text-[14px]"
            value={forId}
            onChange={(e) => setForId(e.target.value)}
          >
            {others.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block text-[12px] uppercase tracking-[0.14em] text-ink-3">
          Context
          <input
            className="field mt-2 text-[14px]"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </label>

        <fieldset className="mt-4">
          <legend className="text-[12px] uppercase tracking-[0.14em] text-ink-3">
            Confidence
          </legend>
          <div className="mt-2 grid min-w-0 grid-cols-3 gap-2">
            {(["low", "measured", "high"] as const).map((level) => (
              <label
                key={level}
                className={`choice min-w-0 px-1 py-2 text-center text-[12px] font-bold capitalize sm:px-2 sm:text-[13px] ${
                  confidence === level ? "choice-on" : ""
                }`}
              >
                <input
                  type="radio"
                  name="confidence"
                  className="sr-only"
                  checked={confidence === level}
                  onChange={() => setConfidence(level)}
                />
                {level}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="mt-4 block text-[12px] uppercase tracking-[0.14em] text-ink-3">
          Commitment
          <input
            className="field mt-2 text-[14px]"
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
          />
        </label>

        <label className="mt-4 block text-[12px] uppercase tracking-[0.14em] text-ink-3">
          Note
          <textarea
            className="field mt-2 min-h-24 text-[14px] leading-relaxed"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        <div className="actions mt-5">
          <button type="submit" className="btn btn-primary">
            File this vouch
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => declineVouch(forId, context)}
          >
            Decline to vouch
          </button>
        </div>
      </form>

      <aside className="desk min-w-0 p-4 sm:p-6 md:p-7">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-3">Live preview</p>
        <div className="mt-4 rounded-xl border border-line bg-paper-2/40 p-4">
          <pre className="serif overflow-x-auto whitespace-pre-wrap text-[16px] leading-relaxed text-ink-2">
{`Adaeze
vouches for ${peer?.given ?? "—"}
in ${context}
at ${confidence} confidence
for ${commitment}
at ${stamped}`}
          </pre>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-ink-2">{note}</p>
        <p className="mt-6 text-[12.5px] leading-relaxed text-ink-3">
          It should not mean: this person is universally trustworthy.
        </p>

        {chamber.vouches.length > 0 && (
          <ul className="mt-6 space-y-3 border-t border-line pt-5">
            {chamber.vouches.map((vouch) => (
              <li key={vouch.id} className="rounded-lg border border-line px-3 py-3 text-sm">
                <p className="font-medium">
                  {vouch.declined ? "Declined" : "Filed"} ·{" "}
                  {chamber.members.find((m) => m.id === vouch.forId)?.given}
                </p>
                <p className="mt-1 text-ink-3">{vouch.context}</p>
                <p className="mt-1 text-[12px] capitalize text-ink-3">{vouch.confidence} confidence</p>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
