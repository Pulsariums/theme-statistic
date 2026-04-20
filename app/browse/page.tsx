"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import TagPill from "@/app/components/tag-pill";
import ThemeCard from "@/app/components/theme-card";
import { themes, type ThemeItem, type ThemeTag } from "@/lib/themes";

const availableTags: ThemeTag[] = ["Mobile", "PC", "Anime", "Dark", "Light", "Minimal", "Neon"];

export default function BrowsePage() {
  const [selectedTag, setSelectedTag] = useState<ThemeTag | "All">("All");

  const visibleThemes = useMemo(() => {
    return selectedTag === "All"
      ? themes
      : themes.filter((theme) => theme.tags.includes(selectedTag));
  }, [selectedTag]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-10 shadow-[0_32px_80px_rgba(15,23,42,0.65)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/90">Tema kataloğu</p>
              <h1 className="mt-4 text-4xl font-semibold text-white">Browse</h1>
              <p className="mt-3 max-w-3xl text-slate-400">Temalar etiketlerle sınıflandı. Aşağıdan bir kategori seçip sadece o tip temalara bakabilirsiniz.</p>
            </div>
            <Link href="/" className="inline-flex rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
              Ana Sayfaya Dön
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <TagPill tag="All" active={selectedTag === "All"} onClick={() => setSelectedTag("All" as ThemeTag)} />
            {availableTags.map((tag) => (
              <TagPill key={tag} tag={tag} active={selectedTag === tag} onClick={() => setSelectedTag(tag)} />
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          {visibleThemes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
          {visibleThemes.length === 0 && (
            <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 text-slate-400">
              Seçilen etiket için tema bulunamadı.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
