"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/mark/HutMark";
import { useChamber } from "@/context/ChamberContext";
import { naira } from "@/data/chamber";

const tabs = [
  { href: "/chamber", label: "Room" },
  { href: "/chamber/trail", label: "Trail" },
  { href: "/chamber/support", label: "Support" },
  { href: "/chamber/vouch", label: "Vouch" },
];

export function ChamberShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { chamber, collectedKobo } = useChamber();
  const pct = Math.round((collectedKobo / chamber.rentKobo) * 100);

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/" className="shrink-0 text-ink">
              <Wordmark compact />
            </Link>
            <span className="hidden h-8 w-px bg-line sm:block" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium">
                {chamber.name}
                <span className="text-ink-3"> · {chamber.house}</span>
              </p>
              <p className="mono text-[11px] text-ink-3">
                {chamber.cycle} · {naira(collectedKobo)} of {naira(chamber.rentKobo)}
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="h-1.5 w-28 overflow-hidden bg-paper-3">
              <div className="h-full bg-moss" style={{ width: `${pct}%` }} />
            </div>
            <span className="mono text-[11px] text-ink-3">{pct}%</span>
          </div>
        </div>
        <nav className="mx-auto hidden max-w-6xl gap-1 px-6 pb-2 md:flex">
          {tabs.map((tab) => {
            const active =
              tab.href === "/chamber"
                ? pathname === "/chamber"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`border-b-2 px-3 py-2 text-[13px] tracking-wide ${
                  active
                    ? "border-ink text-ink"
                    : "border-transparent text-ink-3 hover:text-ink"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 md:pb-16 md:pt-8">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-4">
          {tabs.map((tab) => {
            const active =
              tab.href === "/chamber"
                ? pathname === "/chamber"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`py-3 text-center text-[12px] ${
                  active ? "text-laterite" : "text-ink-3"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
