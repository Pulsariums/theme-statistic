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

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-10 shadow-[0_30px_60px_rgba(15,23,42,0.7)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300/80">Admin Paneli</p>
              <h1 className="mt-2 text-4xl font-semibold text-white">Yönetici Kontrolü</h1>
              <p className="mt-3 text-slate-400">Admin olarak kullanıcıları ve temaları buradan yönetebilirsiniz.</p>
            </div>
            <Link href="/" className="inline-flex rounded-full bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
              Ana Sayfaya Dön
            </Link>
          </div>

          {loading ? (
            <div className="mt-8 text-slate-400">Veriler yükleniyor...</div>
          ) : error ? (
            <div className="mt-8 rounded-3xl border border-rose-500/30 bg-rose-950/20 p-6 text-rose-300">{error}</div>
          ) : data ? (
            <div className="mt-8 space-y-8">
              <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <h2 className="text-2xl font-semibold text-white">Kendi Profilim</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900 p-4 text-slate-200">
                    <p className="text-sm text-slate-500">Kullanıcı Adı</p>
                    <p className="mt-2 text-lg font-semibold">{data.user.username}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900 p-4 text-slate-200">
                    <p className="text-sm text-slate-500">Rol</p>
                    <p className="mt-2 text-lg font-semibold">{data.user.role}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900 p-4 text-slate-200">
                    <p className="text-sm text-slate-500">E-posta</p>
                    <p className="mt-2 text-lg font-semibold">{data.user.email}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Kullanıcılar</h2>
                    <p className="mt-1 text-sm text-slate-500">Kullanıcı adı, e-posta ve rolü burada arayabilirsiniz.</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Kullanıcı ara"
                      className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="rounded-2xl bg-fuchsia-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-fuchsia-300"
                    >
                      Ara
                    </button>
                  </div>
                </div>
                <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900">
                  <table className="min-w-full divide-y divide-slate-800 text-sm text-slate-200">
                    <thead className="bg-slate-950 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Kullanıcı</th>
                        <th className="px-4 py-3">E-posta</th>
                        <th className="px-4 py-3">Rol</th>
                        <th className="px-4 py-3">Oluşturulma</th>
                        <th className="px-4 py-3">Eylem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {data.users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-950/60">
                          <td className="px-4 py-3">{user.username}</td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">{user.role}</td>
                          <td className="px-4 py-3">{new Date(user.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <button
                              disabled={loading}
                              onClick={() => toggleRole(user.id, user.role)}
                              className="rounded-2xl bg-fuchsia-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-fuchsia-300 disabled:opacity-60"
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

              <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <h2 className="text-2xl font-semibold text-white">Temalar</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {data.themes.map((theme) => (
                    <div key={theme.id} className="rounded-3xl bg-slate-900 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{theme.name}</h3>
                          <p className="text-sm text-slate-400">{theme.slug}</p>
                        </div>
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">{theme.status}</span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-400">{theme.description || "Açıklama yok."}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                        <span>{theme.author || "Bilinmeyen"}</span>
                        <span>{theme.use_count} kullanım</span>
                      </div>
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
