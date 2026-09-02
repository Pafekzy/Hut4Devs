"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useChamber } from "@/context/ChamberContext";
import { naira, type SupportKind } from "@/data/chamber";

type RailStatus = {
  ready: boolean;
  provisioned: boolean;
  rail: string;
  userId?: string;
  smartWalletId?: string;
  walletAddress?: string;
  ownerAddress?: string;
  treasuryAddress?: string;
  balance?: string | null;
  deposit?: {
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    bankCode?: string;
  } | null;
  onboarding?: string;
  phoneNumber?: string;
  warning?: string;
  message?: string;
};

type Intent = "share" | SupportKind;

export function PayDesk() {
  const { chamber, youId, shareKobo, applyRailPayment } = useChamber();
  const you = chamber.members.find((m) => m.id === youId);
  const yourRow = chamber.commitments.find((row) => row.memberId === youId);
  const remaining = Math.max(0, (yourRow?.dueKobo ?? shareKobo) - (yourRow?.paidKobo ?? 0));
  const others = useMemo(() => chamber.members.filter((m) => !m.you), [chamber.members]);

  const [rail, setRail] = useState<RailStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"provision" | "pay" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [intent, setIntent] = useState<Intent>(remaining > 0 ? "share" : "contribution");
  const [toId, setToId] = useState(others[0]?.id ?? "kofi");
  const [amount, setAmount] = useState(remaining > 0 ? String(Math.round(remaining / 100)) : "25");
  const [purpose, setPurpose] = useState("Chamber 4 September rent. Paid on the BMONI NGN rail.");

  const amountKobo = Math.round(Number(amount || "0") * 100);

  async function refresh() {
    const response = await fetch("/api/bmoni", { cache: "no-store" });
    const body = await response.json();
    if (!response.ok || !body.ok) throw new Error(body.error ?? "Could not read the BMONI rail.");
    setRail(body.rail as RailStatus);
  }

  useEffect(() => {
    refresh()
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not reach BMONI."))
      .finally(() => setLoading(false));
  }, []);

  async function onProvision() {
    setBusy("provision");
    setError(null);
    try {
      const response = await fetch("/api/bmoni", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "provision" }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error ?? "Provisioning failed.");
      setRail(body.rail as RailStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Provisioning failed.");
    } finally {
      setBusy(null);
    }
  }

  async function onPay(event: FormEvent) {
    event.preventDefault();
    if (amountKobo < 100) return;
    setBusy("pay");
    setError(null);
    try {
      const response = await fetch("/api/bmoni", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "pay",
          amount: (amountKobo / 100).toFixed(2),
          purpose,
        }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error ?? "Payment did not land on BMONI.");
      applyRailPayment({
        toId: intent === "share" ? youId : toId,
        amountKobo,
        kind: intent,
        purpose,
        reference: body.receipt?.proposalId ?? "bmoni",
      });
      await refresh().catch(() => undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed.");
    } finally {
      setBusy(null);
    }
  }

  function recordPending() {
    if (amountKobo < 100) return;
    applyRailPayment({
      toId: intent === "share" ? youId : toId,
      amountKobo,
      kind: intent,
      purpose: `${purpose} (intent recorded while the sandbox rail completes)`,
      reference: "bmoni-pending",
    });
  }

  const shortAddress = rail?.walletAddress
    ? `${rail.walletAddress.slice(0, 6)}…${rail.walletAddress.slice(-4)}`
    : "—";

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-2 lg:gap-6">
      <section className="desk min-w-0 p-4 sm:p-6 md:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-laterite">BMONI Embedded</p>
        <h1 className="serif mt-2 text-[1.55rem] leading-none tracking-tight sm:text-[1.7rem]">Pay on the NGN rail</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-2">
          Chamber money moves through BMONI: a named transfer, a trail, and a Nigerian virtual
          account when the rail is active. Meaning stays on Hut4Devs. Settlement rides BMONI.
        </p>

        {loading ? (
          <p className="mt-6 text-sm text-ink-3">Reading the sandbox rail…</p>
        ) : (
          <div className="mt-6 space-y-3">
            <div className="rounded-xl border-2 border-line bg-paper-2/50 p-4">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-3">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-laterite" />
                {rail?.rail ?? "BMONI"}
              </p>
              <p className="mono mt-3 break-all text-sm font-bold">{shortAddress}</p>
              <p className="mt-2 text-sm font-semibold text-ink-2">
                {rail?.balance != null ? `Available ${rail.balance} CNGN` : "Balance not yet reported."}
              </p>
              {rail?.onboarding && (
                <p className="mt-1 text-[12px] text-ink-3">Onboarding · {rail.onboarding}</p>
              )}
              {you && (
                <p className="mt-2 text-[12px] text-ink-3">
                  You are {you.given}. Sandbox identity follows Bunch Dillon, the persona BMONI
                  verification matches.
                </p>
              )}
            </div>

            {rail?.deposit?.accountNumber && (
              <div className="rounded-xl border-2 border-line p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-ink-3">NGN virtual account</p>
                <p className="mt-2 text-lg font-medium tracking-tight">{rail.deposit.accountNumber}</p>
                <p className="mt-1 text-sm text-ink-2">
                  {rail.deposit.accountName ?? "Chamber 4"} · {rail.deposit.bankName ?? "BMONI NGN"}
                </p>
              </div>
            )}

            {!rail?.ready && (
              <button type="button" className="btn btn-primary" onClick={onProvision} disabled={busy !== null}>
                {busy === "provision" ? "Opening wallet…" : "Open BMONI wallet"}
              </button>
            )}
            {rail?.warning && <p className="text-sm text-warn">{rail.warning}</p>}
            {rail?.message && !rail.ready && <p className="text-sm text-ink-3">{rail.message}</p>}
            {rail?.ready && (
              <p className="text-[12.5px] leading-relaxed text-ink-3">
                Sandbox wallets start empty. If a send is refused for balance, request test tokens
                {rail.phoneNumber ? ` for ${rail.phoneNumber}` : ""} at the BMONI docs, then try ₦25.
              </p>
            )}
          </div>
        )}
      </section>

      <form className="desk min-w-0 p-4 sm:p-6 md:p-7" onSubmit={onPay}>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-3">Send</p>
        <h2 className="mt-2 text-lg font-bold">Name the payment first</h2>

        <fieldset className="mt-5 grid gap-2">
          {(
            [
              ["share", "My share", "Toward your Chamber 4 commitment."],
              ["loan", "Loan", "Support with repayment expected."],
              ["gift", "Gift", "No repayment expected."],
              ["contribution", "Contribution", "Toward the cycle. Does not automatically create debt."],
            ] as const
          ).map(([id, label, meaning]) => (
            <label key={id} className={`choice px-3 py-3 ${intent === id ? "choice-on" : ""}`}>
              <input
                type="radio"
                name="intent"
                className="sr-only"
                checked={intent === id}
                onChange={() => setIntent(id)}
              />
              <span className="block text-[15px] font-bold">{label}</span>
              <span className="mt-1 block text-[12.5px] text-ink-2">{meaning}</span>
            </label>
          ))}
        </fieldset>

        {intent !== "share" && (
          <label className="mt-5 block text-[12px] font-bold uppercase tracking-[0.14em] text-ink-3">
            For
            <select className="field mt-2 text-[14px]" value={toId} onChange={(e) => setToId(e.target.value)}>
              {others.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
        )}

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
          {amountKobo >= 100 ? naira(amountKobo) : "Enter an amount."}
          {intent === "share" && remaining === 0 ? " Your share is already settled." : ""}
        </p>

        <label className="mt-4 block text-[12px] font-bold uppercase tracking-[0.14em] text-ink-3">
          Purpose
          <textarea
            className="field mt-2 min-h-24 text-[14px] leading-relaxed"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </label>

        {error && (
          <p className="mt-4 border-l-2 border-open pl-3 text-sm leading-relaxed text-open">{error}</p>
        )}

        <div className="actions mt-5">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={busy !== null || amountKobo < 100 || !rail?.ready}
          >
            {busy === "pay" ? "Signing on BMONI…" : "Pay on BMONI"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={recordPending} disabled={amountKobo < 100}>
            Record intent on the trail
          </button>
        </div>
        {!rail?.ready && !loading && (
          <p className="mt-3 text-[12px] text-ink-3">
            Open the wallet first to sign on BMONI. You can still name the payment on the trail.
          </p>
        )}
      </form>
    </div>
  );
}
