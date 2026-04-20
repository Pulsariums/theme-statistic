"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDevice } from "@/app/hooks/useDevice";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/browse", label: "Browse" },
  { href: "/theme-builder", label: "Theme Builder" },
  { href: "/admin", label: "Admin" },
];

export default function Header() {
  const device = useDevice();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"black" | "blush">("black");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("epuslarTheme") : null;
    if (saved === "black" || saved === "blush") {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.classList.remove("theme-black", "theme-blush");
    document.body.classList.add(`theme-${theme}`);
    window.localStorage.setItem("epuslarTheme", theme);
  }, [theme]);

  const themeLabel = theme === "black" ? "Jet" : "Blush";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-10">
        <Link href="/" className="font-semibold uppercase tracking-[0.2em] text-lg text-white">
          epuslar themes
        </Link>

        <div className="flex flex-1 items-center justify-end gap-3 min-[420px]:justify-between">
          {device !== "mobile" && (
            <nav className="hidden items-center gap-3 md:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => setTheme("black")}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                theme === "black"
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Jet
            </button>
            <button
              type="button"
              onClick={() => setTheme("blush")}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                theme === "blush"
                  ? "bg-fuchsia-400 text-slate-950"
                  : "border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Blush
            </button>
          </div>

          {device === "mobile" ? (
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 transition hover:border-cyan-300/50 hover:text-cyan-300"
            >
              <span className="text-2xl">☰</span>
            </button>
          ) : null}
        </div>
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
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setTheme("black")}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  theme === "black"
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                Jet
              </button>
              <button
                type="button"
                onClick={() => setTheme("blush")}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  theme === "blush"
                    ? "bg-fuchsia-400 text-slate-950"
                    : "border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                Blush
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
