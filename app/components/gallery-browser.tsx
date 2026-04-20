"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type GalleryAsset = {
  category: string;
  fileName: string;
  url: string;
  label: string;
  imagePath: string;
  views: number;
  downloads: number;
};

const sortOptions = [
  { value: "views", label: "En Çok Görüntülenen" },
  { value: "downloads", label: "En Çok İndirilen" },
  { value: "name", label: "İsme Göre" },
];

export default function GalleryBrowser({ initialAssets }: { initialAssets: GalleryAsset[] }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortKey, setSortKey] = useState(sortOptions[0].value);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(initialAssets.map((asset) => asset.category)));
    return ["All", ...unique];
  }, [initialAssets]);

  const assets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...initialAssets]
      .filter((asset) => selectedCategory === "All" || asset.category === selectedCategory)
      .filter((asset) => {
        const text = `${asset.label} ${asset.category}`.toLowerCase();
        return text.includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sortKey === "downloads") {
          return b.downloads - a.downloads;
        }
        if (sortKey === "name") {
          return a.label.localeCompare(b.label);
        }
        return b.views - a.views;
      });
  }, [initialAssets, query, selectedCategory, sortKey]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Görsel ara: zero, logo, sticker..."
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
        />
        <select
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value)}
          className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedCategory === category
                ? "bg-[var(--accent)] text-[var(--text)]"
                : "bg-[var(--surface-strong)] text-[var(--muted)] hover:bg-[var(--surface)]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {assets.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-10 text-center text-[var(--muted)]">
          Aradığınız kritere uyan görsel bulunamadı.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <Link
              key={asset.imagePath}
              href={`/gallery/${encodeURIComponent(asset.category)}/${encodeURIComponent(asset.fileName)}`}
              className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] transition hover:border-[var(--accent)]"
            >
              <div className="relative h-56 overflow-hidden bg-[var(--surface-strong)]">
                <img src={asset.url} alt={asset.label} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[var(--text)]">{asset.label}</h3>
                  <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1 text-xs text-[var(--muted)]">{asset.category}</span>
                </div>
                <p className="text-sm text-[var(--muted)]">{asset.fileName}</p>
                <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                  <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1">{asset.views} görüntüleme</span>
                  <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1">{asset.downloads} indirme</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
