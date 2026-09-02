"use client";

import { useEffect } from "react";

export function Notice({
  message,
  onClear,
}: {
  message: string | null;
  onClear: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onClear, 4600);
    return () => window.clearTimeout(timer);
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="toast-in pointer-events-auto fixed inset-x-4 bottom-[5.5rem] z-50 mx-auto max-w-md rounded-xl border border-moss/20 bg-moss px-4 py-3 text-sm leading-relaxed text-cream shadow-desk md:bottom-6"
    >
      <div className="flex items-start gap-3">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass-2" aria-hidden />
        <p>{message}</p>
        <button
          type="button"
          className="ml-auto shrink-0 text-[11px] font-bold uppercase tracking-[0.14em] text-brass-2 hover:text-cream"
          onClick={onClear}
        >
          Close
        </button>
      </div>
    </div>
  );
}
