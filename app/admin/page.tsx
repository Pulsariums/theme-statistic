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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const changeThemeStatus = async (themeId: number, currentStatus: string) => {
    if (!data) return;
    const targetStatus = currentStatus === "published" ? "archived" : "published";

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/themes/${themeId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
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
                  theme.id === themeId ? { ...theme, status: result.theme.status } : theme
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
                      <button
                        type="button"
                        onClick={() => changeThemeStatus(theme.id, theme.status)}
                        className="mt-4 inline-flex rounded-2xl bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)]"
                      >
                        {theme.status === "published" ? "Arşivle" : "Yayınla"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
