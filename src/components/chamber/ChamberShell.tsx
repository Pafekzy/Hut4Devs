"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/mark/HutMark";
import { Notice } from "@/components/ui/Notice";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { useChamber } from "@/context/ChamberContext";
import { naira } from "@/data/chamber";
import { useDueLabel } from "@/hooks/useDueLabel";

const tabs = [
  {
    href: "/chamber",
    label: "Room",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path d="M4 11.5 12 5l8 6.5V20H4v-8.5Z" stroke="currentColor" strokeWidth="2.2" />
        <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    href: "/chamber/trail",
    label: "Trail",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path d="M12 4v16" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="12" cy="7" r="2.2" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="12" cy="17" r="2.2" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    href: "/chamber/pay",
    label: "Pay",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <rect x="3.5" y="6" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="2.2" />
        <path d="M3.5 10h17" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    href: "/chamber/support",
    label: "Support",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M7 11c-2 0-3.5 1.6-3.5 3.5S5 18 7 18h10c2 0 3.5-1.5 3.5-3.5S19 11 17 11"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path d="M8 11V8.5A4 4 0 0 1 16 8.5V11" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    href: "/chamber/vouch",
    label: "Vouch",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path d="M7 8h10v11l-5-2.2L7 19V8Z" stroke="currentColor" strokeWidth="2.2" />
        <path d="M9 8V6.5A3 3 0 0 1 15 6.5V8" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
  },
];

export function ChamberShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { chamber, collectedKobo, notice, clearNotice, resetDemo } = useChamber();
  const pct = Math.round((collectedKobo / chamber.rentKobo) * 100);
  const dueLabel = useDueLabel(chamber.dueOn);

  return (
    <div className="min-h-dvh w-full max-w-full overflow-x-hidden bg-paper">
      <header className="sticky top-0 z-40 border-b-[3px] border-line bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex w-full min-w-0 max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Link href="/" className="shrink-0 text-ink">
              <Wordmark compact />
            </Link>
            <span className="hidden h-8 w-px bg-line sm:block" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold">
                {chamber.name}
                <span className="text-ink-3"> · {chamber.house}</span>
              </p>
              <p className="mono truncate text-[11px] font-semibold text-ink-3" suppressHydrationWarning>
                {dueLabel} · {naira(collectedKobo)}
                <span className="hidden sm:inline"> of {naira(chamber.rentKobo)}</span>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              <div className="meter h-2 w-20 rounded-full md:w-28">
                <span className="rounded-full bg-moss" style={{ width: `${pct}%` }} />
              </div>
              <span className="num mono text-[11px] text-ink-3">{pct}%</span>
            </div>
            <ThemeToggle compact />
            <button
              type="button"
              className="hidden text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3 hover:text-ink md:inline"
              onClick={resetDemo}
            >
              Reset demo
            </button>
          </div>
        </div>
        <div className="mx-auto flex w-full min-w-0 max-w-6xl items-center justify-between gap-3 px-4 pb-2 sm:px-6 md:hidden">
          <p className="flex min-w-0 items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3">
            <span className="live-dot h-1.5 w-1.5 shrink-0 rounded-full bg-laterite" />
            <span className="truncate">You are Adaeze · demo saved here</span>
          </p>
          <button
            type="button"
            className="shrink-0 text-[11px] font-bold uppercase tracking-[0.14em] text-laterite"
            onClick={resetDemo}
          >
            Reset
          </button>
        </div>
        <nav className="mx-auto hidden w-full max-w-6xl gap-1 px-6 pb-1 md:flex">
          {tabs.map((tab) => {
            const active =
              tab.href === "/chamber"
                ? pathname === "/chamber"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 border-b-[3px] px-3 py-2.5 text-[13px] font-bold tracking-wide transition ${
                  active
                    ? "border-ink text-ink"
                    : "border-transparent text-ink-3 hover:text-ink"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
          <p className="ml-auto flex items-center gap-2 self-center pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-3">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-laterite" />
            You are Adaeze
          </p>
        </nav>
      </header>

      <main className="mx-auto w-full min-w-0 max-w-6xl overflow-x-hidden px-4 pb-28 pt-6 sm:px-6 md:pb-16 md:pt-8">
        {children}
      </main>

      <Notice message={notice} onClear={clearNotice} />

      <nav className="fixed bottom-0 left-0 right-0 z-40 w-full border-t-[3px] border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <div className="grid w-full grid-cols-5">
          {tabs.map((tab) => {
            const active =
              tab.href === "/chamber"
                ? pathname === "/chamber"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex min-w-0 flex-col items-center gap-1 px-0.5 py-2.5 text-[10px] font-bold ${
                  active ? "text-laterite" : "text-ink-3"
                }`}
              >
                {tab.icon}
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
