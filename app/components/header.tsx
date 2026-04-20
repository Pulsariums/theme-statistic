"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDevice } from "@/app/hooks/useDevice";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/browse", label: "Gözat" },
  { href: "/theme-builder", label: "Tema Oluştur" },
  { href: "/login", label: "Giriş" },
];

export default function Header() {
  const device = useDevice();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"black" | "blush">("black");

  useEffect(() => {
    const saved = typeof window !== "undefined"
      ? window.localStorage.getItem("pulsarTheme") ?? window.localStorage.getItem("puslarTheme") ?? window.localStorage.getItem("epulsarTheme") ?? window.localStorage.getItem("epuslarTheme")
      : null;
    if (saved === "black" || saved === "blush") {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.classList.remove("theme-black", "theme-blush");
    document.body.classList.add(`theme-${theme}`);
    window.localStorage.setItem("pulsarTheme", theme);
  }, [theme]);

  const themeLabel = theme === "black" ? "Jet" : "Blush";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-10">
        <Link href="/" className="font-marker text-lg text-white uppercase tracking-[0.22em] text-shadow leading-none brand-effect">
          Pulsar Themes
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
              onClick={() => setTheme(theme === "black" ? "blush" : "black")}
              className="rounded-full px-4 py-2 text-sm font-medium bg-slate-900 text-slate-100 transition hover:bg-slate-800"
            >
              {theme === "black" ? "Açık Tema" : "Koyu Tema"}
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
            <button
              type="button"
              onClick={() => setTheme(theme === "black" ? "blush" : "black")}
              className="w-full rounded-2xl px-4 py-3 text-sm font-medium bg-slate-900 text-slate-100 transition hover:bg-slate-800"
            >
              {theme === "black" ? "Açık Tema" : "Koyu Tema"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
