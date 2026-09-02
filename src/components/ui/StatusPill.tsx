import type { ReactNode } from "react";

const tones = {
  settled: "bg-ok/10 text-ok",
  repair: "bg-moss/10 text-moss-2",
  partial: "bg-warn/10 text-warn",
  open: "bg-open/10 text-open",
  live: "bg-laterite/10 text-laterite-deep",
  hold: "bg-moss/10 text-moss",
} as const;

export function StatusPill({
  tone,
  children,
}: {
  tone: keyof typeof tones;
  children: ReactNode;
}) {
  return <span className={`pill max-w-full shrink-0 ${tones[tone]}`}>{children}</span>;
}
