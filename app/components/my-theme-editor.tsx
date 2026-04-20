"use client";

import { useState } from "react";

type ThemeVersion = {
  id: number;
  version_name: string;
  css_code: string;
  created_at: string;
};

type ThemeDetails = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  author: string | null;
  tags: string[] | null;
  thumbnail_url: string | null;
  image_urls: string[] | null;
  css_code: string | null;
  moderation_reason: string | null;
  delete_requested_at: string | null;
  status: string;
};

type Props = {
  theme: ThemeDetails;
  versions: ThemeVersion[];
};

export default function MyThemeEditor({ theme, versions }: Props) {
  const [name, setName] = useState(theme.name);
  const [description, setDescription] = useState(theme.description || "");
  const [author, setAuthor] = useState(theme.author || "");
  const [tags, setTags] = useState((theme.tags || []).join(", "));
  const [thumbnailUrl, setThumbnailUrl] = useState(theme.thumbnail_url || "");
  const [status, setStatus] = useState(theme.status);
  const [cssCode, setCssCode] = useState(theme.css_code || "");
  const [newCssCode, setNewCssCode] = useState("");
  const [versionName, setVersionName] = useState("v" + (versions.length + 1));
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(!!theme.delete_requested_at);
  const [deletionLoading, setDeletionLoading] = useState(false);

  const requestDelete = async () => {
    if (deleteRequested) {
      setMessage("Silme isteği zaten gönderildi.");
      return;
    }

    setDeletionLoading(true);
    setMessage(null);

    const response = await fetch(`/api/my-themes/${theme.id}/delete`, {
      method: "POST",
      credentials: "include",
    });
    const result = await response.json();
    setDeletionLoading(false);

    if (!response.ok) {
      setMessage(result.error || "Silme isteği gönderilemedi.");
      return;
    }

    setDeleteRequested(true);
    setMessage("Silme isteği gönderildi. Tema bir hafta sonra kalıcı olarak silinecek.");
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const response = await fetch(`/api/my-themes/${theme.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        author,
        tags,
        thumbnailUrl,
        status,
        cssCode,
      }),
    });

    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(result.error || "Güncelleme başarısız oldu.");
      return;
    }

    setMessage("Tema başarıyla güncellendi.");
  };

  const handleNewVersion = async () => {
    if (!newCssCode.trim()) {
      setMessage("Yeni sürüm için CSS kodu gereklidir.");
      return;
    }

    setSaving(true);
    setMessage(null);

    const response = await fetch(`/api/my-themes/${theme.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newCssCode,
        versionName: versionName || `v${versions.length + 1}`,
      }),
    });

    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(result.error || "Yeni sürüm eklenemedi.");
      return;
    }

    setMessage("Yeni sürüm başarıyla eklendi.");
    setCssCode(newCssCode);
    setNewCssCode("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
        <h2 className="text-2xl font-semibold text-[var(--text)]">Tema Düzenle</h2>
        {theme.moderation_reason ? (
          <div className="mt-4 rounded-3xl border border-yellow-500/20 bg-yellow-950/10 p-4 text-sm text-yellow-200">
            <p className="font-semibold">İnceleme Notu</p>
            <p>{theme.moderation_reason}</p>
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <label className="space-y-2 text-sm text-[var(--text)]">
            <span>Ad</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
            />
          </label>
          <label className="space-y-2 text-sm text-[var(--text)]">
            <span>Yazar</span>
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
            />
          </label>
        </div>
        <label className="space-y-2 text-sm text-[var(--text)]">
          <span>Açıklama</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="w-full rounded-3xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-[var(--text)]">
            <span>Etiketler</span>
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="dark, anime, neon"
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
            />
          </label>
          <label className="space-y-2 text-sm text-[var(--text)]">
            <span>Görsel URL</span>
            <input
              value={thumbnailUrl}
              onChange={(event) => setThumbnailUrl(event.target.value)}
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
            />
          </label>
        </div>
        <label className="space-y-2 text-sm text-[var(--text)]">
          <span>Durum</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
          >
            <option value="draft">Taslak</option>
            <option value="pending">Kontrol için bekle</option>
            <option value="published">Yayınlandı</option>
            <option value="archived">Arşivlendi</option>
          </select>
        </label>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-3xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
          >
            {saving ? "Kaydediliyor..." : "Tema Bilgilerini Güncelle"}
          </button>
          {!deleteRequested ? (
            <button
              type="button"
              onClick={requestDelete}
              disabled={deletionLoading}
              className="inline-flex items-center justify-center rounded-3xl bg-rose-600 px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-rose-500 disabled:opacity-60"
            >
              {deletionLoading ? "Silme isteği gönderiliyor..." : "Silme İsteği Gönder"}
            </button>
          ) : (
            <div className="rounded-3xl border border-yellow-500/20 bg-yellow-950/10 px-4 py-3 text-sm text-yellow-200">
              Silme isteği gönderildi. Tema bir hafta sonra kalıcı olarak silinecek.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
        <h2 className="text-2xl font-semibold text-[var(--text)]">CSS Kodu</h2>
        <label className="space-y-2 text-sm text-[var(--text)]">
          <span>Mevcut CSS</span>
          <textarea
            value={cssCode}
            onChange={(event) => setCssCode(event.target.value)}
            rows={10}
            className="w-full rounded-3xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
          />
        </label>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
        <h2 className="text-2xl font-semibold text-[var(--text)]">Yeni Sürüm Ekle</h2>
        <label className="space-y-2 text-sm text-[var(--text)]">
          <span>Sürüm Adı</span>
          <input
            value={versionName}
            onChange={(event) => setVersionName(event.target.value)}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <label className="space-y-2 text-sm text-[var(--text)]">
          <span>Yeni CSS Kod</span>
          <textarea
            value={newCssCode}
            onChange={(event) => setNewCssCode(event.target.value)}
            rows={10}
            className="w-full rounded-3xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <button
          type="button"
          onClick={handleNewVersion}
          disabled={saving}
          className="mt-4 inline-flex items-center justify-center rounded-3xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
        >
          {saving ? "Sürüm ekleniyor..." : "Yeni Sürüm Kaydet"}
        </button>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
        <h2 className="text-2xl font-semibold text-[var(--text)]">Sürüm Geçmişi</h2>
        {versions.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">Henüz sürüm geçmişi yok.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {versions.map((version) => (
              <div key={version.id} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-semibold text-[var(--text)]">{version.version_name}</span>
                  <span className="text-xs text-[var(--muted)]">{new Date(version.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)] truncate">{version.css_code.slice(0, 120)}{version.css_code.length > 120 ? "..." : ""}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {message ? <p className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}
