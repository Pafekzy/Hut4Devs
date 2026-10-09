"use client";

import Link from "next/link";
import { useState } from "react";
import { RoomBoard } from "@/components/chamber/RoomBoard";
import { TrailView } from "@/components/chamber/TrailView";

const panes = [
  { id: "room", label: "Room" },
  { id: "trail", label: "Trail" },
] as const;

export function ProductDesk() {
  const [pane, setPane] = useState<(typeof panes)[number]["id"]>("room");

  return (
    <div className="relative min-w-0 overflow-hidden">
      <div
        className="stamp pointer-events-none absolute -right-2 -top-4 z-10 hidden rounded-md px-3 py-2 text-[10px] sm:block"
        aria-hidden
      >
        Verified trail
      </div>
      <div className="desk overflow-hidden">
        <div className="flex min-w-0 items-center justify-between gap-3 border-b-[3px] border-line bg-paper-2/60 px-3 py-2 sm:px-4">
          <div className="flex gap-1 rounded-lg bg-paper p-1">
            {panes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPane(item.id)}
                className={`rounded-md px-3 py-1.5 text-[12px] font-bold transition ${
                  pane === item.id ? "bg-ink text-paper dark:bg-cream dark:text-ink" : "text-ink-2 hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Link href="/chamber" className="shrink-0 text-[12px] font-bold text-laterite hover:text-laterite-deep">
            Open live →
          </Link>
        </div>
        <div className="max-h-[540px] overflow-auto bg-paper p-3 sm:p-4">
          {pane === "room" ? <RoomBoard preview /> : <TrailView preview />}
        </div>
      </div>
    </div>
  );
}
