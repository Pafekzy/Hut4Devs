import Link from "next/link";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function NotFound() {
  return (
    <>
      <main className="mx-auto max-w-xl px-5 py-24 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-laterite">Off the trail</p>
        <h1 className="serif mt-4 text-4xl tracking-tight">This path is not on the map.</h1>
        <p className="mt-4 text-ink-2">Return to the hut, or enter Chamber 4.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/" className="btn btn-primary">
            Home
          </Link>
          <Link href="/chamber" className="btn btn-ghost">
            Chamber 4
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
