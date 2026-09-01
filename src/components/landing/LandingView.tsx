import Link from "next/link";
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

export function LandingView() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-laterite/10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-end gap-12 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:pt-16">
          <div>
            <p className="rise text-[11px] uppercase tracking-[0.26em] text-laterite">
              Accommodation first · vision wider
            </p>
            <h1 className="serif rise rise-d1 mt-5 max-w-[14ch] text-[2.6rem] leading-[0.95] tracking-[-0.03em] sm:text-[4.1rem]">
              People present narratives.
              <span className="mt-2 block italic text-ink-2">The platform preserves facts.</span>
            </h1>
            <p className="rise rise-d2 mt-6 max-w-md text-[16px] leading-relaxed text-ink-2 sm:text-[17px]">
              Hut4Devs is community-built infrastructure for shared
              responsibilities, peer support, and repayments. It begins with
              fellows and interns keeping a room honest — without screenshots,
              without scores.
            </p>
            <div className="rise rise-d3 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/chamber"
                className="bg-ink px-5 py-3 text-[13px] text-paper transition hover:bg-laterite"
              >
                Enter Chamber 4
              </Link>
              <Link
                href="/principles"
                className="border border-line px-5 py-3 text-[13px] hover:bg-paper-2"
              >
                Read the principles
              </Link>
            </div>
            <p className="mt-8 text-[12px] uppercase tracking-[0.18em] text-ink-3">
              Build · Pay · Support · Thrive
            </p>
          </div>

          <div className="rise rise-d2 lg:-mb-6 lg:rotate-[-1.2deg]">
            <ProductDesk />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-2/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink-3">The problem</p>
            <h2 className="serif mt-3 max-w-[16ch] text-3xl leading-tight tracking-tight">
              The room already cooperates. The record does not.
            </h2>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {problems.map(([title, body]) => (
              <li key={title} className="grid gap-2 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-8">
                <p className="text-[13px] font-medium">{title}</p>
                <p className="text-sm text-ink-2">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-3">The model</p>
        <h2 className="serif mt-3 text-3xl tracking-tight">Meaning, not merely movement.</h2>
        <ol className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, body], i) => (
            <li key={title} className="bg-paper p-5 sm:p-6">
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

      <section id="product" className="scroll-mt-24 bg-moss text-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
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
            <Link
              href="/chamber"
              className="mt-8 inline-flex bg-paper px-5 py-3 text-[13px] text-ink hover:bg-brass-2"
            >
              Work the cycle
            </Link>
          </div>
          <figure className="lg:rotate-[1deg]">
            <blockquote className="border border-white/15 bg-moss-2/40 p-6 sm:p-8">
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

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink-3">Peer support</p>
            <h2 className="serif mt-3 text-3xl tracking-tight">No is a complete sentence.</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-2">
              A healthy support culture makes declining safe. The platform must not
              silently turn a loan into a gift, or a contribution into debt.
            </p>
          </div>
          <dl className="space-y-5">
            <div className="border-t border-line pt-4">
              <dt className="text-sm font-medium">Loan</dt>
              <dd className="text-sm text-ink-2">Repayment expected.</dd>
            </div>
            <div className="border-t border-line pt-4">
              <dt className="text-sm font-medium">Gift</dt>
              <dd className="text-sm text-ink-2">No repayment expected.</dd>
            </div>
            <div className="border-t border-line pt-4">
              <dt className="text-sm font-medium">Contribution</dt>
              <dd className="text-sm text-ink-2">
                Toward a purpose. Does not automatically create debt.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2">
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
              <li key={item} className="flex gap-3 text-sm text-ink-2">
                <span className="mt-2 h-px w-6 shrink-0 bg-laterite" aria-hidden />
                <span className="line-through decoration-line">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-laterite">The colony</p>
        <h2 className="serif mt-4 max-w-[18ch] text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          I don&apos;t have to stand alone when I am part of a colony.
        </h2>
        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-2">
          Interdependence is not entitlement. No one owns another person&apos;s money,
          time, privacy, or willingness to help. Support should build trust, not
          control.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/chamber"
            className="bg-laterite px-5 py-3 text-[13px] text-paper hover:bg-laterite-deep"
          >
            Start in the room
          </Link>
          <Link href="/principles" className="px-5 py-3 text-[13px] text-ink-2 hover:text-ink">
            How we hold power →
          </Link>
        </div>
      </section>
    </>
  );
}
