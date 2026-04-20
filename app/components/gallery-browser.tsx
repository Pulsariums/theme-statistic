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

type Props = {
  initialAssets: GalleryAsset[];
  isAdmin?: boolean;
};

const sortOptions = [
  { value: "views", label: "En Çok Görüntülenen" },
  { value: "downloads", label: "En Çok İndirilen" },
  { value: "name", label: "İsme Göre" },
];

const uploadCategories = ["backgrounds", "logos", "stickers", "patterns"];

export default function GalleryBrowser({ initialAssets, isAdmin }: Props) {
  const [assets, setAssets] = useState(initialAssets);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortKey, setSortKey] = useState(sortOptions[0].value);
  const [uploadCategory, setUploadCategory] = useState("");
  const [uploadLabel, setUploadLabel] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(assets.map((asset) => asset.category)));
    return ["All", ...unique];
  }, [assets]);

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...assets]
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
  }, [assets, query, selectedCategory, sortKey]);

  const handleUpload = async () => {
    setUploadError(null);
    setUploadMessage(null);
    if (!uploadCategory.trim() || !uploadFile) {
      setUploadError("Kategori ve dosya gereklidir.");
      return;
    }

    const formData = new FormData();
    formData.append("category", uploadCategory.trim());
    formData.append("label", uploadLabel.trim());
    formData.append("file", uploadFile);

    try {
      setUploadLoading(true);
      const response = await fetch("/api/admin/gallery-assets", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        setUploadError(result.error || "Galeri görseli yüklenemedi.");
      } else {
        setAssets((prev) => [result.asset, ...prev]);
        setUploadMessage("Görsel başarıyla yüklendi.");
        setUploadCategory("");
        setUploadLabel("");
        setUploadFile(null);
      }
    } catch {
      setUploadError("Galeri yüklemesi sırasında sunucu hatası oluştu.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async (asset: GalleryAsset) => {
    if (!confirm(`Görseli kaldırmak istediğinizden emin misiniz? ${asset.fileName}`)) {
      return;
    }

    setDeleteError(null);
    try {
      const response = await fetch(
        `/api/admin/gallery-assets?category=${encodeURIComponent(asset.category)}&fileName=${encodeURIComponent(
          asset.fileName
        )}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (!response.ok) {
        setDeleteError(result.error || "Görsel silinemedi.");
      } else {
        setAssets((prev) => prev.filter((item) => item.imagePath !== asset.imagePath));
      }
    } catch {
      setDeleteError("Görsel silme sırasında sunucu hatası oluştu.");
    }
  };

  return (
    <div className="space-y-6">
      {isAdmin ? (
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]/90">Admin Galeri Yükleme</p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">Yeni Görsel Yükle</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <label className="space-y-2 text-sm text-[var(--text)]">
              <span>Kategori</span>
              <select
                value={uploadCategory}
                onChange={(event) => setUploadCategory(event.target.value)}
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
              >
                <option value="">Kategori seçin</option>
                {uploadCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-[var(--text)]">
              <span>Etiket / Başlık</span>
              <input
                value={uploadLabel}
                onChange={(event) => setUploadLabel(event.target.value)}
                placeholder="Re:Zero Logo"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            <label className="space-y-2 text-sm text-[var(--text)]">
              <span>Görsel Dosyası</span>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.gif,.svg"
                onChange={(event) => setUploadFile(event.currentTarget.files?.[0] ?? null)}
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
              />
            </label>
          </div>

          {uploadError ? <div className="mt-4 rounded-3xl border border-rose-500/30 bg-rose-950/20 p-4 text-sm text-rose-200">{uploadError}</div> : null}
          {uploadMessage ? <div className="mt-4 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-sm text-emerald-200">{uploadMessage}</div> : null}

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploadLoading}
            className="mt-4 inline-flex items-center justify-center rounded-3xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
          >
            {uploadLoading ? "Yükleniyor..." : "Galeriye Yükle"}
          </button>
        </section>
      ) : null}

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

      {deleteError ? <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-4 text-sm text-rose-200">{deleteError}</div> : null}

      {filteredAssets.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-10 text-center text-[var(--muted)]">
          Aradığınız kritere uyan görsel bulunamadı.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssets.map((asset) => (
            <div key={asset.imagePath} className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] transition hover:border-[var(--accent)]">
              <Link href={`/gallery/${encodeURIComponent(asset.category)}/${encodeURIComponent(asset.fileName)}`} className="block">
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
              {isAdmin ? (
                <div className="border-t border-[var(--border)] bg-[var(--surface-strong)] p-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(asset)}
                    className="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-4 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-rose-500"
                  >
                    Gizle
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
