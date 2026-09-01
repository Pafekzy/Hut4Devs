"use client";

import { FormEvent, useMemo, useState } from "react";
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
  const [flash, setFlash] = useState<string | null>(null);

  const peer = others.find((m) => m.id === forId);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    fileVouch({ forId, context, confidence, commitment, note });
    setFlash(
      `Vouch filed for ${peer?.given}. Contextual. Time-bound. Not a universal trust score.`,
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <form className="desk p-5 sm:p-7" onSubmit={onSubmit}>
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-3">
          Distributed trust
        </p>
        <h1 className="serif mt-2 text-[1.7rem] leading-none tracking-tight">
          A vouch is a sentence, not a rank
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-2">
          You vouch for someone in a context, at a confidence, for a commitment, at a
          time. You do not become their guarantor.
        </p>

        <label className="mt-6 block text-[12px] uppercase tracking-[0.14em] text-ink-3">
          For
          <select
            className="mt-2 block w-full border border-line bg-paper px-3 py-2 text-[14px]"
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
            className="mt-2 block w-full border border-line bg-paper px-3 py-2 text-[14px]"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </label>

        <fieldset className="mt-4">
          <legend className="text-[12px] uppercase tracking-[0.14em] text-ink-3">
            Confidence
          </legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["low", "measured", "high"] as const).map((level) => (
              <label
                key={level}
                className={`cursor-pointer border px-2 py-2 text-center text-[13px] capitalize ${
                  confidence === level ? "border-ink bg-paper-2" : "border-line"
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
            className="mt-2 block w-full border border-line bg-paper px-3 py-2 text-[14px]"
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
          />
        </label>

        <label className="mt-4 block text-[12px] uppercase tracking-[0.14em] text-ink-3">
          Note
          <textarea
            className="mt-2 block min-h-24 w-full border border-line bg-paper px-3 py-2 text-[14px] leading-relaxed"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="submit"
            className="bg-ink px-4 py-2.5 text-[13px] text-paper hover:bg-laterite"
          >
            File this vouch
          </button>
          <button
            type="button"
            className="border border-line px-4 py-2.5 text-[13px] hover:bg-paper-2"
            onClick={() => {
              declineVouch(forId, context);
              setFlash(
                `You declined to vouch for ${peer?.given}. That can be excellent judgment.`,
              );
            }}
          >
            Decline to vouch
          </button>
        </div>

        {flash && (
          <p className="mt-5 border-l-2 border-moss pl-3 text-sm leading-relaxed text-moss">
            {flash}
          </p>
        )}
      </form>

      <aside className="desk p-5 sm:p-7">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-3">Preview</p>
        <pre className="serif mt-4 overflow-x-auto whitespace-pre-wrap text-[16px] leading-relaxed text-ink-2">
{`Adaeze
vouches for ${peer?.given ?? "—"}
in ${context}
at ${confidence} confidence
for ${commitment}
at ${new Date().toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
        </pre>
        <p className="mt-5 text-sm leading-relaxed text-ink-2">{note}</p>
        <p className="mt-6 text-[12.5px] leading-relaxed text-ink-3">
          It should not mean: this person is universally trustworthy.
        </p>

        {chamber.vouches.length > 0 && (
          <ul className="mt-6 space-y-3 border-t border-line pt-5">
            {chamber.vouches.map((vouch) => (
              <li key={vouch.id} className="text-sm">
                <p className="font-medium">
                  {vouch.declined ? "Declined" : "Filed"} ·{" "}
                  {chamber.members.find((m) => m.id === vouch.forId)?.given}
                </p>
                <p className="text-ink-3">{vouch.context}</p>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
