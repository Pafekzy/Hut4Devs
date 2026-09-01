"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/mark/HutMark";

const links = [
  { href: "/#product", label: "The chamber" },
  { href: "/principles", label: "Principles" },
  { href: "/chamber", label: "Enter" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inApp = pathname.startsWith("/chamber");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (inApp) return null;

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        scrolled
          ? "border-line bg-paper/90 backdrop-blur-md"
          : "border-transparent bg-paper/40"
      }`}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Hut4Devs home">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-8 text-[13.5px] text-ink-2 md:flex">
          {links.slice(0, 2).map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
          <Link
            href="/chamber"
            className="bg-ink px-4 py-2 text-[13px] text-paper transition hover:bg-laterite"
          >
            Enter Chamber 4
          </Link>
        </nav>

        <button
          type="button"
          className="relative h-10 w-10 md:hidden"
          aria-expanded={open}
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`absolute left-2 right-2 h-px bg-ink transition ${open ? "top-5 rotate-45" : "top-3.5"}`}
          />
          <span
            className={`absolute left-2 right-2 top-5 h-px bg-ink transition ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`absolute left-2 right-2 h-px bg-ink transition ${open ? "top-5 -rotate-45" : "top-[1.6rem]"}`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-paper px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4 text-[15px]">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
