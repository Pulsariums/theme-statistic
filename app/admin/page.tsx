"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: number;
  username: string;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
};

type Theme = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  author: string | null;
  tags: string[] | null;
  moderation_reason: string | null;
  use_count: number;
  release_date: string | null;
  status: string;
};

type AdminData = {
  user: {
    id: number;
    username: string;
    email: string;
    name: string | null;
    role: string;
  };
  users: User[];
  themes: Theme[];
};

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [reviewReason, setReviewReason] = useState<Record<number, string>>({});
  const [galleryCategory, setGalleryCategory] = useState("");
  const [galleryLabel, setGalleryLabel] = useState("");
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryMessage, setGalleryMessage] = useState<string | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const galleryCategories = ["backgrounds", "logos", "stickers", "patterns", "gif"];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = new URL("/api/admin", window.location.href);
        if (search) {
          url.searchParams.set("q", search);
        }
        const response = await fetch(url.toString());
        const result = await response.json();
        if (!response.ok) {
          setError(result.error || "Admin verileri yüklenemedi.");
          setData(null);
        } else {
          setData(result);
        }
      } catch (loadError) {
        setError("Sunucu bağlantısı sağlanamadı.");
        setData(null);
      }
      setLoading(false);
    };

    load();
  }, [search]);

  const handleSearch = () => {
    setSearch(query.trim());
  };

  const toggleRole = async (userId: number, currentRole: string) => {
    if (!data) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: currentRole === "admin" ? "user" : "admin" }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Rol güncellenemedi.");
      } else {
        setData((prev) =>
          prev
            ? {
                ...prev,
                users: prev.users.map((user) => (user.id === userId ? { ...user, role: result.user.role } : user)),
              }
            : prev
        );
        setError(null);
      }
    } catch {
      setError("Rol güncellenirken sunucu hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const changeThemeStatus = async (themeId: number, targetStatus: string) => {
    if (!data) return;
    const reason = reviewReason[themeId] || null;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/themes/${themeId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus, reason }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Tema durumu güncellenemedi.");
      } else {
        setData((prev) =>
          prev
            ? {
                ...prev,
                themes: prev.themes.map((theme) =>
                  theme.id === themeId ? { ...theme, status: result.theme.status, moderation_reason: result.theme.moderation_reason } : theme
                ),
              }
            : prev
        );
        setError(null);
      }
    } catch {
      setError("Tema durumu güncellenirken sunucu hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTheme = async (themeId: number) => {
    if (!data) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/themes/${themeId}/delete`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Tema silinemedi.");
      } else {
        setData((prev) =>
          prev
            ? {
                ...prev,
                themes: prev.themes.filter((theme) => theme.id !== themeId),
              }
            : prev
        );
        setError(null);
      }
    } catch {
      setError("Tema silinirken sunucu hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const uploadGalleryImage = async () => {
    setGalleryError(null);
    setGalleryMessage(null);
    if (!galleryCategory.trim() || !galleryFile) {
      setGalleryError("Kategori ve dosya gereklidir.");
      return;
    }

    const formData = new FormData();
    formData.append("category", galleryCategory.trim());
    formData.append("label", galleryLabel.trim());
    formData.append("file", galleryFile);

    try {
      setLoading(true);
      const response = await fetch("/api/admin/gallery-assets", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        setGalleryError(result.error || "Galeri görseli yüklenemedi.");
      } else {
        setGalleryMessage("Görsel yüklendi. Galeri sayfasını yenileyerek yeni resmi görebilirsiniz.");
        setGalleryCategory("");
        setGalleryLabel("");
        setGalleryFile(null);
        setGalleryError(null);
      }
    } catch {
      setGalleryError("Galeri yüklemesi sırasında sunucu hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[0_30px_60px_rgba(15,23,42,0.16)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]/80">Admin Paneli</p>
              <h1 className="mt-2 text-4xl font-semibold text-[var(--text)]">Yönetici Kontrolü</h1>
              <p className="mt-3 text-[var(--muted)]">Admin olarak kullanıcıları ve temaları buradan yönetebilirsiniz.</p>
            </div>
            <Link href="/" className="inline-flex rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)]">
              Ana Sayfaya Dön
            </Link>
          </div>

          {loading ? (
            <div className="mt-8 text-[var(--muted)]">Veriler yükleniyor...</div>
          ) : error ? (
            <div className="mt-8 rounded-3xl border border-rose-500/30 bg-rose-950/20 p-6 text-rose-300">{error}</div>
          ) : data ? (
            <div className="mt-8 space-y-8">
              <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
                <h2 className="text-2xl font-semibold text-[var(--text)]">Kendi Profilim</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-[var(--surface)] p-4 text-[var(--text)]">
                    <p className="text-sm text-[var(--muted)]">Kullanıcı Adı</p>
                    <p className="mt-2 text-lg font-semibold">{data.user.username}</p>
                  </div>
                  <div className="rounded-3xl bg-[var(--surface)] p-4 text-[var(--text)]">
                    <p className="text-sm text-[var(--muted)]">Rol</p>
                    <p className="mt-2 text-lg font-semibold">{data.user.role}</p>
                  </div>
                  <div className="rounded-3xl bg-[var(--surface)] p-4 text-[var(--text)]">
                    <p className="text-sm text-[var(--muted)]">E-posta</p>
                    <p className="mt-2 text-lg font-semibold">{data.user.email}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-[var(--text)]">Kullanıcılar</h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">Kullanıcı adı, e-posta ve rolü burada arayabilirsiniz.</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Kullanıcı ara"
                      className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                    />
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)]"
                    >
                      Ara
                    </button>
                  </div>
                </div>
                <div className="mt-6 overflow-x-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
                  <table className="min-w-full divide-y divide-[var(--border)] text-sm text-[var(--text)]">
                    <thead className="bg-[var(--surface-strong)] text-left text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                      <tr>
                        <th className="px-4 py-3">Kullanıcı</th>
                        <th className="px-4 py-3">E-posta</th>
                        <th className="px-4 py-3">Rol</th>
                        <th className="px-4 py-3">Oluşturulma</th>
                        <th className="px-4 py-3">Eylem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {data.users.map((user) => (
                        <tr key={user.id} className="hover:bg-[var(--surface-strong)]/50">
                          <td className="px-4 py-3">{user.username}</td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">{user.role}</td>
                          <td className="px-4 py-3">{new Date(user.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <button
                              disabled={loading}
                              onClick={() => toggleRole(user.id, user.role)}
                              className="rounded-2xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
                            >
                              {user.role === "admin" ? "Kullanıcı Yap" : "Admin Yap"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
                <h2 className="text-2xl font-semibold text-[var(--text)]">Temalar</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {data.themes.map((theme) => (
                    <div key={theme.id} className="rounded-3xl bg-[var(--surface)] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--text)]">{theme.name}</h3>
                          <p className="text-sm text-[var(--muted)]">{theme.slug}</p>
                        </div>
                        <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1 text-xs text-[var(--muted)]">{theme.status}</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{theme.description || "Açıklama yok."}</p>
                      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-[var(--muted)]">
                        <span>{theme.author || "Bilinmeyen"}</span>
                        <span>{theme.use_count} kullanım</span>
                      </div>
                      {theme.moderation_reason ? (
                        <div className="mt-3 rounded-3xl border border-yellow-500/20 bg-yellow-950/10 p-3 text-xs text-yellow-200">
                          <p className="font-semibold">İnceleme Notu</p>
                          <p>{theme.moderation_reason}</p>
                        </div>
                      ) : null}
                      <div className="mt-3 grid gap-3">
                        <Link
                          href={`/admin/themes/${theme.id}`}
                          className="inline-flex rounded-full bg-[var(--surface-strong)] px-4 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--surface)]"
                        >
                          Detayları Düzenle
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteTheme(theme.id)}
                          className="inline-flex rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-rose-500"
                        >
                          Kalıcı Sil
                        </button>
                      </div>
                      <label className="mt-3 space-y-2 text-xs text-[var(--muted)]">
                        <span>Onay/Reddet notu</span>
                        <input
                          value={reviewReason[theme.id] ?? ""}
                          onChange={(event) => setReviewReason((prev) => ({ ...prev, [theme.id]: event.target.value }))}
                          placeholder="Reddedilme nedeni veya kısa not"
                          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-xs text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                        />
                      </label>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {theme.status === "pending" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => changeThemeStatus(theme.id, "published")}
                              className="inline-flex rounded-2xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)]"
                            >
                              Onayla
                            </button>
                            <button
                              type="button"
                              onClick={() => changeThemeStatus(theme.id, "archived")}
                              className="inline-flex rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-rose-500"
                            >
                              Reddet
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => changeThemeStatus(theme.id, theme.status === "published" ? "archived" : "published")}
                            className="inline-flex rounded-2xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)]"
                          >
                            {theme.status === "published" ? "Arşivle" : "Yayınla"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-[var(--text)]">Galeri Yüklemesi</h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">Yeni görselleri kategori seçerek galeriye ekleyebilirsiniz.</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-[var(--text)]">
                    <span>Kategori</span>
                    <select
                      value={galleryCategory}
                      onChange={(event) => setGalleryCategory(event.target.value)}
                      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                    >
                      <option value="">Kategori seçin</option>
                      {galleryCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2 text-sm text-[var(--text)]">
                    <span>Etiket / Başlık</span>
                    <input
                      value={galleryLabel}
                      onChange={(event) => setGalleryLabel(event.target.value)}
                      placeholder="Ör. Re:Zero Logo"
                      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                    />
                  </label>
                </div>

                <label className="mt-4 block text-sm text-[var(--text)]">
                  <span>Görsel Dosyası</span>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.gif,.svg"
                    onChange={(event) => setGalleryFile(event.currentTarget.files?.[0] ?? null)}
                    className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                  />
                </label>

                {galleryError ? (
                  <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-4 text-sm text-rose-200">{galleryError}</div>
                ) : galleryMessage ? (
                  <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-sm text-emerald-200">{galleryMessage}</div>
                ) : null}

                <button
                  type="button"
                  onClick={uploadGalleryImage}
                  disabled={loading}
                  className="mt-4 inline-flex rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
                >
                  Galeriye Yükle
                </button>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
