"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/mark/HutMark";
import { ThemeToggle } from "@/components/site/ThemeToggle";

const links = [
  { href: "/#product", label: "The chamber" },
  { href: "/#how", label: "The model" },
  { href: "/principles", label: "Principles" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inApp = pathname.startsWith("/chamber") || pathname.startsWith("/pitch");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (inApp) return null;

  return (
    <header
      className={`sticky top-0 z-40 border-b-[3px] transition-all ${
        scrolled
          ? "border-line bg-paper/92 shadow-[0_8px_24px_-18px_rgb(20_17_14/0.45)] backdrop-blur-md"
          : "border-transparent bg-paper/50"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper dark:focus:bg-cream dark:focus:text-ink"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-[4.25rem] w-full min-w-0 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
        <Link href="/" aria-label="Hut4Devs home" className="min-w-0 shrink-0">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-8 text-[13.5px] font-bold text-ink-2 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-ink">
              {link.label}
            </Link>
          ))}
          <ThemeToggle compact />
          <Link href="/chamber" className="btn btn-primary min-h-10 w-auto px-4">
            Enter Chamber 4
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle compact />
          <button
            type="button"
            className="relative h-11 w-11 shrink-0 rounded-lg border-[3px] border-line"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`absolute left-3 right-3 h-0.5 bg-ink transition ${open ? "top-5 rotate-45" : "top-3.5"}`}
            />
            <span
              className={`absolute left-3 right-3 top-5 h-0.5 bg-ink transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-3 right-3 h-0.5 bg-ink transition ${open ? "top-5 -rotate-45" : "top-[1.65rem]"}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t-[3px] border-line bg-paper px-5 py-6 md:hidden">
          <div className="flex flex-col gap-1 text-[16px] font-bold">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-2 py-3 hover:bg-paper-2"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/chamber" className="btn btn-primary mt-3 w-full">
              Enter Chamber 4
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
