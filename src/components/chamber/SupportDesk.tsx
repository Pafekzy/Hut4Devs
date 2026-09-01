"use client";

import { FormEvent, useMemo, useState } from "react";
import { useChamber } from "@/context/ChamberContext";
import { naira, type SupportKind } from "@/data/chamber";

const kinds: { id: SupportKind; label: string; meaning: string }[] = [
  { id: "loan", label: "Loan", meaning: "Support with an agreed expectation of repayment." },
  { id: "gift", label: "Gift", meaning: "Support without repayment expectation." },
  {
    id: "contribution",
    label: "Contribution",
    meaning: "Support toward a purpose. Does not automatically create debt.",
  },
];

export function SupportDesk() {
  const { chamber, respondToAsk, offerSupport } = useChamber();
  const openAsk = chamber.asks.find((ask) => ask.status === "open" && ask.toId === "ada");
  const [flash, setFlash] = useState<string | null>(null);
  const [kind, setKind] = useState<SupportKind>("loan");
  const [toId, setToId] = useState("kofi");
  const [amount, setAmount] = useState("15000");
  const [purpose, setPurpose] = useState("Toward September rent. Meaning confirmed before send.");

  const others = useMemo(
    () => chamber.members.filter((m) => !m.you),
    [chamber.members],
  );

  const meaning = kinds.find((k) => k.id === kind)?.meaning;

  function onOffer(event: FormEvent) {
    event.preventDefault();
    const kobo = Math.round(Number(amount) * 100);
    if (!kobo || kobo < 100) return;
    offerSupport({ toId, kind, amountKobo: kobo, purpose });
    setFlash(
      kind === "loan"
        ? "Loan recorded as a loan. It was not converted into a gift."
        : kind === "gift"
          ? "Gift recorded. No repayment trail was created."
          : "Contribution recorded toward a purpose. No automatic debt.",
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="desk p-5 sm:p-7">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-3">Peer to peer</p>
        <h1 className="serif mt-2 text-[1.7rem] leading-none tracking-tight">
          Support, with the meaning intact
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-2">
          Asking for help is not weakness. Helping is not ownership. Declining is not
          betrayal.
        </p>

        {openAsk ? (
          <div className="mt-6 border border-line bg-paper-2/50 p-4">
            <p className="text-[12px] uppercase tracking-[0.16em] text-laterite">
              Waiting on you
            </p>
            <p className="mt-2 text-[15px] leading-relaxed">
              {chamber.members.find((m) => m.id === openAsk.fromId)?.given} asked for a{" "}
              <strong className="font-medium">{openAsk.kind}</strong> of{" "}
              {naira(openAsk.amountKobo)}.
            </p>
            <p className="mt-2 text-sm text-ink-2">{openAsk.purpose}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="bg-ink px-3 py-2 text-[13px] text-paper hover:bg-laterite"
                onClick={() => {
                  respondToAsk(openAsk.id, "accepted");
                  setFlash("Loan accepted. Repayment remains expected.");
                }}
              >
                Accept as a loan
              </button>
              <button
                type="button"
                className="border border-line px-3 py-2 text-[13px] hover:bg-paper"
                onClick={() => {
                  respondToAsk(openAsk.id, "declined");
                  setFlash("You declined. That choice is legitimate. No score moved.");
                }}
              >
                Decline safely
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-sm text-ink-3">No open ask is waiting on you.</p>
        )}

        {flash && (
          <p className="mt-5 border-l-2 border-moss pl-3 text-sm leading-relaxed text-moss">
            {flash}
          </p>
        )}
      </section>

      <form className="desk p-5 sm:p-7" onSubmit={onOffer}>
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-3">Offer support</p>
        <h2 className="mt-2 text-lg">Confirm the kind first</h2>

        <fieldset className="mt-5 grid gap-2">
          <legend className="sr-only">Support kind</legend>
          {kinds.map((item) => (
            <label
              key={item.id}
              className={`cursor-pointer border px-3 py-3 ${
                kind === item.id ? "border-ink bg-paper-2" : "border-line"
              }`}
            >
              <input
                type="radio"
                name="kind"
                className="sr-only"
                checked={kind === item.id}
                onChange={() => setKind(item.id)}
              />
              <span className="block text-[14px] font-medium">{item.label}</span>
              <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-2">
                {item.meaning}
              </span>
            </label>
          ))}
        </fieldset>

        <label className="mt-5 block text-[12px] uppercase tracking-[0.14em] text-ink-3">
          To
          <select
            className="mt-2 block w-full border border-line bg-paper px-3 py-2 text-[14px] text-ink"
            value={toId}
            onChange={(e) => setToId(e.target.value)}
          >
            {others.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block text-[12px] uppercase tracking-[0.14em] text-ink-3">
          Amount (NGN)
          <input
            className="num mt-2 block w-full border border-line bg-paper px-3 py-2 text-[14px]"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
          />
        </label>

        <label className="mt-4 block text-[12px] uppercase tracking-[0.14em] text-ink-3">
          Purpose
          <textarea
            className="mt-2 block min-h-24 w-full border border-line bg-paper px-3 py-2 text-[14px] leading-relaxed"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </label>

        <p className="mt-4 text-[12.5px] text-ink-2">{meaning}</p>

        <button
          type="submit"
          className="mt-5 bg-ink px-4 py-2.5 text-[13px] text-paper hover:bg-laterite"
        >
          Record this {kind}
        </button>
      </form>
    </div>
  );
}
