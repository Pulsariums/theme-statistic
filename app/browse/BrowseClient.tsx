"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import TagPill from "@/app/components/tag-pill";
import ThemeCard from "@/app/components/theme-card";

type ThemeItem = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  author: string | null;
  tags: string[] | null;
  use_count: number;
  release_date: string | null;
  status: string;
};

type ThemeTag = "Mobile" | "PC" | "Anime" | "Dark" | "Light" | "Minimal" | "Neon";

const availableTags: ThemeTag[] = ["Mobile", "PC", "Anime", "Dark", "Light", "Minimal", "Neon"];

type Props = {
  initialThemes: ThemeItem[];
};

export default function BrowseClient({ initialThemes }: Props) {
  const [themes] = useState(initialThemes);
  const [selectedTag, setSelectedTag] = useState<ThemeTag | "All">("All");
  const [query, setQuery] = useState("");

  const visibleThemes = useMemo(() => {
    return themes
      .filter((theme) => selectedTag === "All" || (theme.tags || []).includes(selectedTag))
      .filter((theme) => {
        const text = `${theme.name} ${theme.description || ""} ${(theme.tags || []).join(" ")}`.toLowerCase();
        return text.includes(query.trim().toLowerCase());
      });
  }, [query, selectedTag, themes]);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_32px_80px_rgba(15,23,42,0.16)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]/90">Tema kataloğu</p>
              <h1 className="mt-4 text-3xl font-semibold text-[var(--text)]">Browse</h1>
              <p className="mt-2 max-w-3xl text-[var(--muted)]">Aşağıdan doğrudan tema adı, açıklaması veya etiketi ile arayabilirsiniz.</p>
            </div>
            <Link href="/" className="inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)]">
              Ana Sayfaya Dön
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_2fr]">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tema ara: mobile, dark, anime..."
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
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
          {visibleThemes.length > 0 ? (
            visibleThemes.map((theme) => <ThemeCard key={theme.id} theme={theme} />)
          ) : (
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-[var(--muted)]">
              Kayıtlı tema bulunmuyor ya da aramaya uygun tema mevcut değil.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
