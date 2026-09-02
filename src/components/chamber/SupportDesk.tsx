"use client";

import Link from "next/link";
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
  const { chamber, youId, respondToAsk, offerSupport } = useChamber();
  const openAsk = chamber.asks.find((ask) => ask.status === "open" && ask.toId === youId);
  const [kind, setKind] = useState<SupportKind>("loan");
  const [toId, setToId] = useState("kofi");
  const [amount, setAmount] = useState("15000");
  const [purpose, setPurpose] = useState("Toward September rent. Meaning confirmed before send.");

  const others = useMemo(
    () => chamber.members.filter((m) => !m.you),
    [chamber.members],
  );

  const meaning = kinds.find((k) => k.id === kind)?.meaning;
  const amountKobo = Math.round(Number(amount || "0") * 100);

  function onOffer(event: FormEvent) {
    event.preventDefault();
    if (!amountKobo || amountKobo < 100) return;
    offerSupport({ toId, kind, amountKobo, purpose });
  }

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-2 lg:gap-6">
      <section className="desk min-w-0 p-4 sm:p-6 md:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-3">Peer to peer</p>
        <h1 className="serif mt-2 text-[1.55rem] leading-none tracking-tight sm:text-[1.7rem]">
          Support, with the meaning intact
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-2">
          Asking for help is not weakness. Helping is not ownership. Declining is not
          betrayal. Settlement can ride the BMONI NGN rail without changing the kind.
        </p>

        {openAsk ? (
          <div className="mt-6 rounded-xl border border-laterite/30 bg-paper-2/50 p-4">
            <p className="flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-laterite">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-laterite" />
              Waiting on you
            </p>
            <p className="mt-2 text-[15px] leading-relaxed">
              {chamber.members.find((m) => m.id === openAsk.fromId)?.given} asked for a{" "}
              <strong className="font-medium">{openAsk.kind}</strong> of{" "}
              {naira(openAsk.amountKobo)}.
            </p>
            <p className="mt-2 text-sm text-ink-2">{openAsk.purpose}</p>
            <div className="actions mt-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => respondToAsk(openAsk.id, "accepted")}
              >
                Accept as a loan
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => respondToAsk(openAsk.id, "declined")}
              >
                Decline safely
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-dashed border-line px-4 py-5 text-sm text-ink-3">
            No open ask is waiting on you. Offers you record still keep their kind.
          </p>
        )}
        <Link href="/chamber/pay" className="btn btn-ghost mt-6">
          Settle on BMONI →
        </Link>
      </section>

      <form className="desk min-w-0 p-4 sm:p-6 md:p-7" onSubmit={onOffer}>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-3">Offer support</p>
        <h2 className="mt-2 text-lg font-bold">Confirm the kind first</h2>

        <fieldset className="mt-5 grid gap-2">
          <legend className="sr-only">Support kind</legend>
          {kinds.map((item) => (
            <label
              key={item.id}
              className={`choice px-3 py-3 ${kind === item.id ? "choice-on" : ""}`}
            >
              <input
                type="radio"
                name="kind"
                className="sr-only"
                checked={kind === item.id}
                onChange={() => setKind(item.id)}
              />
              <span className="block text-[15px] font-bold">{item.label}</span>
              <span className="mt-1 block text-[12.5px] leading-relaxed text-ink-2">
                {item.meaning}
              </span>
            </label>
          ))}
        </fieldset>

        <label className="mt-5 block text-[12px] font-bold uppercase tracking-[0.14em] text-ink-3">
          To
          <select
            className="field mt-2 text-[14px]"
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

        <label className="mt-4 block text-[12px] font-bold uppercase tracking-[0.14em] text-ink-3">
          Amount (NGN)
          <input
            className="field num mt-2 text-[14px]"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
          />
        </label>
        <p className="mt-1 text-[12px] text-ink-3">
          {amountKobo >= 100 ? naira(amountKobo) : "Enter an amount to record."}
        </p>

        <label className="mt-4 block text-[12px] font-bold uppercase tracking-[0.14em] text-ink-3">
          Purpose
          <textarea
            className="field mt-2 min-h-24 text-[14px] leading-relaxed"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </label>

        <p className="mt-4 text-[12.5px] text-ink-2">{meaning}</p>

        <button type="submit" className="btn btn-primary mt-5" disabled={amountKobo < 100}>
          Record this {kind}
        </button>
      </form>
    </div>
  );
}
