"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HutMark } from "@/components/mark/HutMark";

const slides = [
  {
    kicker: "Hut4Devs · Chamber 4",
    title: "People present narratives.",
    italic: "The platform preserves facts.",
    body: "Community infrastructure for shared responsibilities, peer support, and repayments. Accommodation is where we begin.",
  },
  {
    kicker: "The problem",
    title: "The room already cooperates. The record does not.",
    body: "Commitments live in chat. Proof lives in screenshots. Meaning disappears when the transfer arrives.",
    points: [
      ["Screenshot proof", "Easy to reuse, easy to dispute, easy to lose."],
      ["Manual chasing", "Coordinators become the database."],
      ["Lost meaning", "A loan, a gift, and a contribution look the same in a bank app."],
    ],
  },
  {
    kicker: "The product",
    title: "Coordinate. Support. Account. Grow.",
    body: "Hut4Devs gives everyday collaboration a trail: what was expected, what happened, what it meant, and what stayed private.",
    points: [
      ["Room", "One cycle. Who has settled. What is still open."],
      ["Support", "Loan, gift, or contribution — named before send."],
      ["Trail", "Evidence you can check without publishing a life."],
    ],
  },
  {
    kicker: "The proving ground",
    title: "Chamber 4 · Yaba House",
    body: "September 2026 rent. Four people. ₦185,000. You walk in as Adaeze.",
    points: [
      ["Kofi", "Asked for a loan of ₦26,250 — not a gift. Stipend lands 4 Sep."],
      ["Tunde", "Asked for a vouch in this cycle only. Not a score."],
      ["You", "Accept, decline, pay, or wait. Nothing becomes a rank."],
    ],
  },
  {
    kicker: "Settlement",
    title: "Meaning stays on Hut4Devs. Settlement rides BMONI.",
    body: "A named transfer, a Nigerian virtual account, and a trail. The rail moves naira. The chamber keeps the agreement.",
    points: [
      ["Loan", "Repayment expected."],
      ["Gift", "No repayment expected."],
      ["Contribution", "Toward the cycle. Does not automatically create debt."],
    ],
  },
  {
    kicker: "What this is not",
    title: "Trust without a leaderboard.",
    body: "Recognition may say: we noticed what you demonstrated here. It must never say: we have calculated who you are.",
    points: [
      ["No universal scores", "No public debt registry."],
      ["No guarantor trap", "A vouch is a sentence, not liability."],
      ["No is complete", "Declining is not betrayal."],
    ],
  },
  {
    kicker: "Tonight",
    title: "Walk the room.",
    italic: "I don’t have to stand alone when I am part of a colony.",
    body: "Enter Chamber 4. The demo is live. Adaeze’s choices save in this browser.",
    cta: true,
  },
];

export function PitchDeck() {
  const [i, setI] = useState(0);
  const last = slides.length - 1;

  const go = useCallback(
    (next: number) => setI(Math.min(last, Math.max(0, next))),
    [last],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === " " && !(event.target instanceof HTMLButtonElement) && !(event.target instanceof HTMLAnchorElement)) {
        event.preventDefault();
        go(i + 1);
      }
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        go(i + 1);
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        go(i - 1);
      }
      if (event.key === "Home") go(0);
      if (event.key === "End") go(last);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, i, last]);

  const slide = slides[i];

  return (
    <div className="relative flex min-h-dvh flex-col bg-paper text-ink">
      <header className="flex items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-2.5 text-ink">
          <HutMark />
          <span className="text-[14px] font-bold tracking-tight">Hut4Devs</span>
        </div>
        <p className="mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink-3">
          {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </p>
      </header>

      <main
        className="mx-auto flex w-full min-w-0 max-w-5xl flex-1 flex-col justify-center px-5 pb-8 pt-4 sm:px-8"
        onClick={() => go(i + 1)}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-laterite">{slide.kicker}</p>
        <h1 className="serif mt-4 max-w-[18ch] text-[2.1rem] leading-[1.02] tracking-tight sm:text-5xl">
          {slide.title}
          {slide.italic && <span className="mt-2 block italic text-ink-2">{slide.italic}</span>}
        </h1>
        <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-2 sm:text-[17px]">{slide.body}</p>

        {slide.points && (
          <ul className="mt-8 grid gap-3 sm:grid-cols-3" onClick={(e) => e.stopPropagation()}>
            {slide.points.map(([title, body]) => (
              <li key={title} className="desk p-4">
                <p className="text-[13px] font-bold">{title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{body}</p>
              </li>
            ))}
          </ul>
        )}

        {slide.cta && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row" onClick={(e) => e.stopPropagation()}>
            <Link href="/chamber" className="btn btn-primary">
              Enter Chamber 4
            </Link>
            <Link href="/" className="btn btn-ghost">
              Back to the site
            </Link>
          </div>
        )}
      </main>

      <nav className="flex items-center justify-between gap-3 px-5 py-4 sm:px-8" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="btn btn-ghost min-h-10 px-4" onClick={() => go(i - 1)} disabled={i === 0}>
          Prev
        </button>
        <div className="flex flex-wrap justify-center gap-1.5">
          {slides.map((item, idx) => (
            <button
              key={item.kicker}
              type="button"
              aria-label={`Go to ${item.kicker}`}
              className={`h-2.5 rounded-full transition ${idx === i ? "w-7 bg-laterite" : "w-2.5 bg-line"}`}
              onClick={() => go(idx)}
            />
          ))}
        </div>
        <button type="button" className="btn btn-ghost min-h-10 px-4" onClick={() => go(i + 1)} disabled={i === last}>
          Next
        </button>
      </nav>
    </div>
  );
}
