"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDevice } from "@/app/hooks/useDevice";

const baseLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/browse", label: "Gözat" },
  { href: "/gallery", label: "Galeri" },
  { href: "/theme-builder", label: "Tema Oluştur" },
  { href: "/theme-upload", label: "Tema Yükle" },
];

export default function Header() {
  const device = useDevice();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"black" | "blush">("black");
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

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

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth", { cache: "no-store", credentials: "include" });
        if (!response.ok) {
          setUser(null);
          return;
        }
        const payload = await response.json();
        setUser(payload.user ?? null);
      } catch {
        setUser(null);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const themeLabel = theme === "black" ? "Jet" : "Blush";
  const authLinks = user
    ? [
        { href: "/my-themes", label: "Temalarım" },
        { href: "/favorites", label: "Favoriler" },
      ]
    : [];

  const navLinks = user
    ? [
        ...baseLinks,
        ...authLinks,
        ...(user.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
      ]
    : [...baseLinks, { href: "/login", label: "Giriş" }];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)]/90 bg-[var(--surface)]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-10">
        <Link href="/" className="font-marker text-lg text-[var(--text)] uppercase tracking-[0.22em] text-shadow leading-none brand-effect">
          Pulsar Themes
        </Link>

        <div className="flex flex-1 items-center justify-end gap-3 min-[420px]:justify-between">
          {device !== "mobile" && (
            <nav className="hidden items-center gap-3 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-strong)] hover:text-[var(--text)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-sm text-[var(--text)]">
                {user.username}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => setTheme(theme === "black" ? "blush" : "black")}
              className="rounded-full px-4 py-2 text-sm font-medium bg-[var(--surface-strong)] text-[var(--text)] transition hover:bg-[var(--surface)]"
            >
              {themeLabel}
            </button>
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full px-4 py-2 text-sm font-medium bg-[var(--accent)] text-[var(--text)] transition hover:bg-[var(--accent-strong)]"
              >
                Çıkış
              </button>
            ) : null}
          </div>

          {device === "mobile" ? (
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)] transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
            >
              <span className="text-2xl">☰</span>
            </button>
          ) : null}
        </div>
      </div>

      {menuOpen && device === "mobile" && (
        <div className="border-t border-[var(--border)]/90 bg-[var(--surface)]/95 px-6 pb-6 sm:px-10">
          <nav className="flex flex-col gap-2 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm font-medium text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setTheme(theme === "black" ? "blush" : "black")}
              className="w-full rounded-2xl px-4 py-3 text-sm font-medium bg-[var(--surface-strong)] text-[var(--text)] transition hover:bg-[var(--surface)]"
            >
              {themeLabel}
            </button>
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-2xl px-4 py-3 text-sm font-medium bg-[var(--accent)] text-[var(--text)] transition hover:bg-[var(--accent-strong)]"
              >
                Çıkış
              </button>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
}
