"use client";

import Link from "next/link";
import { useState } from "react";
import { useDevice } from "@/app/hooks/useDevice";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/browse", label: "Browse" },
  { href: "/search", label: "Search" },
  { href: "/theme-builder", label: "Theme Builder" },
  { href: "/admin", label: "Admin" },
];

export default function Header() {
  const device = useDevice();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
        <Link href="/" className="font-semibold text-white tracking-[0.18em] text-lg uppercase text-cyan-300">
          Pulsar Themes
        </Link>

        {device === "mobile" ? (
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 transition hover:border-cyan-300/50 hover:text-cyan-300"
          >
            <span className="text-2xl">☰</span>
          </button>
        ) : (
          <nav className="flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {menuOpen && device === "mobile" && (
        <div className="border-t border-slate-800/90 bg-slate-950/95 px-6 pb-6 sm:px-10">
          <nav className="flex flex-col gap-2 pt-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
