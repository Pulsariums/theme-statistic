"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import TagPill from "@/app/components/tag-pill";
import ThemeCard from "@/app/components/theme-card";
import { themes, type ThemeTag } from "@/lib/themes";

const availableTags: ThemeTag[] = ["Mobile", "PC", "Anime", "Dark", "Light", "Minimal", "Neon"];

export default function BrowsePage() {
  const [selectedTag, setSelectedTag] = useState<ThemeTag | "All">("All");
  const [query, setQuery] = useState("");

  const visibleThemes = useMemo(() => {
    return themes
      .filter((theme) => selectedTag === "All" || theme.tags.includes(selectedTag))
      .filter(
        (theme) =>
          theme.name.toLowerCase().includes(query.toLowerCase()) ||
          theme.description.toLowerCase().includes(query.toLowerCase()) ||
          theme.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      );
  }, [query, selectedTag]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-[0_32px_80px_rgba(15,23,42,0.65)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-fuchsia-300/90">Tema kataloğu</p>
              <h1 className="mt-4 text-3xl font-semibold text-white">Browse</h1>
              <p className="mt-2 max-w-3xl text-slate-400">Arama butonuna gerek yok. Aşağıdan doğrudan tema adını veya etiketi yaz.</p>
            </div>
            <Link href="/" className="inline-flex rounded-full bg-fuchsia-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-fuchsia-300">
              Ana Sayfaya Dön
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_2fr]">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tema ara: mobile, dark, anime..."
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-fuchsia-300"
            />
            <div className="flex flex-wrap gap-2">
              <TagPill tag="All" active={selectedTag === "All"} onClick={() => setSelectedTag("All" as ThemeTag)} />
              {availableTags.map((tag) => (
                <TagPill key={tag} tag={tag} active={selectedTag === tag} onClick={() => setSelectedTag(tag)} />
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {visibleThemes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
          {visibleThemes.length === 0 && (
            <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 text-slate-400">
              Arama kriterlerinize uygun tema bulunamadı.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
