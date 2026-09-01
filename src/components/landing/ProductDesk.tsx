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
    <div className="relative">
      <div
        className="stamp pointer-events-none absolute -right-2 -top-4 z-10 hidden px-3 py-2 text-[10px] sm:block"
        aria-hidden
      >
        Verified trail
      </div>
      <div className="desk overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-paper-2/60 px-3 py-2 sm:px-4">
          <div className="flex gap-1">
            {panes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPane(item.id)}
                className={`px-3 py-1.5 text-[12px] ${
                  pane === item.id ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Link href="/chamber" className="text-[12px] text-laterite hover:text-laterite-deep">
            Open live →
          </Link>
        </div>
        <div className="max-h-[540px] overflow-auto bg-paper p-3 sm:p-4">
          {pane === "room" ? <RoomBoard preview /> : <TrailView />}
        </div>
      </div>
    </div>
  );
}
