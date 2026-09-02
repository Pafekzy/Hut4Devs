export function HutMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4 26h24l-4-8H8l-4 8z" fill="currentColor" className="text-laterite" />
      <path d="M9 18h14L16 6 9 18z" fill="currentColor" className="text-moss" />
      <path
        d="M16 7v19"
        stroke="currentColor"
        className="text-cream"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2.5">
      <HutMark />
      <span className={`leading-none ${compact ? "max-[380px]:hidden" : ""}`}>
        <span className="block text-[15px] font-bold tracking-[-0.03em]">Hut4Devs</span>
        {!compact && (
          <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-ink-3">
            Built by us
          </span>
        )}
      </span>
    </span>
  );
}
