"use client";

import Link from "next/link";
import { useState } from "react";
import { LiveCycleBar } from "@/components/landing/LiveCycleBar";
import { ProductDesk } from "@/components/landing/ProductDesk";

const problems = [
  ["Repeated forms", "The same facts asked again, as if memory were the system."],
  ["Screenshot proof", "Easy to reuse, easy to dispute, easy to lose."],
  ["Manual chasing", "Coordinators become the database."],
  ["Late stipends", "The due date does not wait for the payroll date."],
  ["Scattered records", "Chat, sheet, receipt, rumour."],
  ["Lost meaning", "A transfer arrives. The agreement does not."],
];

const steps = [
  ["Coordinate", "See the responsibility, the timing, and who is in it."],
  ["Support", "Lend, gift, contribute, mentor, or vouch — with the kind named."],
  ["Account", "Keep evidence that can be checked without publishing a life."],
  ["Grow", "Notice patterns. Do not score a person."],
];

const notThis = [
  "A universal social-credit system",
  "A public debt registry",
  "Popularity or wealth leaderboards",
  "Interest-based lending marketplace",
  "Automatic guarantor liability",
  "Surveillance dressed as transparency",
];

const trust = [
  ["Demo walkthrough", "You are Adaeze. Actions save in this browser."],
  ["Meaning intact", "Loan, gift, and contribution cannot silently swap."],
  ["Evidence held", "Receipts stay purpose-bound. Not broadcast."],
  ["No scores", "Recognition is a sentence, never a rank."],
];

export function LandingView() {
  const [openProblem, setOpenProblem] = useState(problems[0][0]);

  return (
    <>
      <section className="relative overflow-x-hidden">
        <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-laterite/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-40 h-56 w-56 rounded-full bg-moss/10 blur-3xl" />
        <div className="mx-auto grid w-full min-w-0 max-w-6xl items-end gap-10 px-4 pb-16 pt-10 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:pt-16">
          <div className="min-w-0">
            <p className="rise inline-flex max-w-full items-center gap-2 rounded-full border-2 border-line bg-paper/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-laterite">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-laterite" />
              Live demo · accommodation first
            </p>
            <h1 className="serif rise rise-d1 mt-5 max-w-[14ch] text-[2.2rem] leading-[0.95] tracking-[-0.03em] sm:text-[4.1rem]">
              People present narratives.
              <span className="mt-2 block italic text-ink-2">The platform preserves facts.</span>
            </h1>
            <p className="rise rise-d2 mt-6 max-w-md text-[16px] leading-relaxed text-ink-2 sm:text-[17px]">
              Hut4Devs is community-built infrastructure for shared
              responsibilities, peer support, and repayments. It begins with
              fellows and interns keeping a room honest — without screenshots,
              without scores.
            </p>
            <div className="rise rise-d3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/chamber" className="btn btn-primary">
                Enter Chamber 4
              </Link>
              <Link href="/principles" className="btn btn-ghost">
                Read the principles
              </Link>
            </div>
            <p className="mt-8 text-[12px] uppercase tracking-[0.18em] text-ink-3">
              Build · Pay · Support · Thrive
            </p>
            <LiveCycleBar />
          </div>

          <div className="rise rise-d2 min-w-0 overflow-hidden lg:-mb-6 lg:rotate-[-1.2deg]">
            <ProductDesk />
          </div>
        </div>
      </section>

      <section className="border-y-[3px] border-line bg-paper-2/50">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 py-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {trust.map(([title, body]) => (
            <div key={title} className="rounded-xl px-1 py-3 sm:px-2">
              <p className="text-[12px] font-bold">{title}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-3">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b-[3px] border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink-3">The problem</p>
            <h2 className="serif mt-3 max-w-[16ch] text-3xl leading-tight tracking-tight">
              The room already cooperates. The record does not.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-2">
              Tap a line. The friction is ordinary. The cost is trust.
            </p>
          </div>
          <ul className="divide-y-2 divide-line overflow-hidden rounded-2xl border-[3px] border-line bg-paper">
            {problems.map(([title, body]) => {
              const open = openProblem === title;
              return (
                <li key={title}>
                  <button
                    type="button"
                    className={`grid w-full min-w-0 gap-1 px-4 py-4 text-left transition sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)] sm:gap-8 sm:px-5 ${
                      open ? "bg-paper-2/80" : "hover:bg-paper-2/50"
                    }`}
                    onClick={() => setOpenProblem(title)}
                    aria-expanded={open}
                  >
                    <span className="text-[13px] font-bold">{title}</span>
                    <span className={`text-sm text-ink-2 ${open ? "" : "hidden sm:block"}`}>
                      {body}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section id="how" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-3">The model</p>
        <h2 className="serif mt-3 text-3xl tracking-tight">Meaning, not merely movement.</h2>
        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, body], i) => (
            <li key={title} className="desk desk-interactive p-5 sm:p-6">
              <p className="mono text-[11px] text-laterite">0{i + 1}</p>
              <h3 className="mt-4 text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{body}</p>
            </li>
          ))}
        </ol>
        <p className="serif mt-8 text-xl text-ink-2">
          Responsibility → commitment → action → evidence → trail → judgment.
        </p>
      </section>

      <section id="product" className="scroll-mt-24 bg-moss text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-brass">
              First proving ground
            </p>
            <h2 className="serif mt-4 text-4xl leading-[1.05] tracking-tight">
              Chamber 4 is a room with a trail.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-brass-2">
              Rent is due. Two people have settled. Kofi is short because a stipend is
              late. He asked for a loan — not a gift. Tunde asked for a vouch in this
              cycle only. You can accept, decline, or wait. Nothing here becomes a
              score.
            </p>
            <Link href="/chamber" className="btn btn-paper mt-8">
              Work the cycle
            </Link>
          </div>
          <figure className="min-w-0 overflow-hidden lg:rotate-[1deg]">
            <blockquote className="rounded-2xl border-[3px] border-white/20 bg-moss-2/40 p-6 transition hover:-translate-y-1 hover:border-brass/40 sm:p-8">
              <p className="serif text-2xl leading-snug">
                “I am not disappearing. Stipend is late. I would rather borrow than
                leave a hole.”
              </p>
              <figcaption className="mt-6 text-[12px] uppercase tracking-[0.16em] text-brass">
                Kofi Mensah · 29 Aug · on the trail
              </figcaption>
            </blockquote>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <div className="grid min-w-0 gap-8 lg:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink-3">Peer support</p>
            <h2 className="serif mt-3 text-3xl tracking-tight">No is a complete sentence.</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-2">
              A healthy support culture makes declining safe. The platform must not
              silently turn a loan into a gift, or a contribution into debt.
            </p>
          </div>
          <dl className="space-y-3">
            {[
              ["Loan", "Repayment expected."],
              ["Gift", "No repayment expected."],
              ["Contribution", "Toward a purpose. Does not automatically create debt."],
            ].map(([title, body]) => (
              <div
                key={title}
                className="desk desk-interactive px-5 py-4"
              >
                <dt className="text-sm font-bold">{title}</dt>
                <dd className="mt-1 text-sm text-ink-2">{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-y-[3px] border-line bg-paper-2/30">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-8 lg:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink-3">
              What Hut4Devs is not
            </p>
            <h2 className="serif mt-3 text-3xl tracking-tight">Trust without a leaderboard.</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-2">
              Recognition may say: we noticed what you repeatedly demonstrated here.
              It must never say: we have calculated who you are.
            </p>
          </div>
          <ul className="space-y-3">
            {notThis.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-transparent px-3 py-2 text-sm text-ink-2 transition hover:border-line hover:bg-paper"
              >
                <span className="mt-2 h-px w-6 shrink-0 bg-laterite" aria-hidden />
                <span className="line-through decoration-line">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-laterite">The colony</p>
        <h2 className="serif mt-4 max-w-[18ch] text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          I don&apos;t have to stand alone when I am part of a colony.
        </h2>
        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-2">
          Interdependence is not entitlement. No one owns another person&apos;s money,
          time, privacy, or willingness to help. Support should build trust, not
          control.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/chamber" className="btn btn-accent">
            Start in the room
          </Link>
          <Link href="/principles" className="btn btn-ghost">
            How we hold power →
          </Link>
        </div>
      </section>
    </>
  );
}
