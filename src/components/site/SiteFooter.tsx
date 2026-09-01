import Link from "next/link";
import { HutMark } from "@/components/mark/HutMark";

export function SiteFooter() {
  return (
    <footer className="bg-moss text-paper">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 text-paper">
            <HutMark className="h-6 w-6" />
            <span className="text-sm font-semibold tracking-tight">Hut4Devs</span>
          </div>
          <p className="serif mt-5 max-w-sm text-[17px] leading-relaxed text-brass-2">
            Turning everyday collaboration into trails of trust built by us and for
            us-all.
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-brass">
            Build. Pay. Support. Thrive.
          </p>
        </div>

        <div className="text-sm text-brass-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-brass">Move</p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/chamber" className="hover:text-paper">
                Chamber 4
              </Link>
            </li>
            <li>
              <Link href="/principles" className="hover:text-paper">
                Principles
              </Link>
            </li>
            <li>
              <Link href="/#product" className="hover:text-paper">
                How a trail works
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm text-brass-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-brass">Hold</p>
          <ul className="mt-4 space-y-2">
            <li>Apache License 2.0</li>
            <li>Architecture first. Stack later.</li>
            <li>No universal scores.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-[11px] tracking-wide text-brass sm:px-8">
          Accommodation is where we begin — not where the vision ends.
        </p>
      </div>
    </footer>
  );
}
