"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error || "Giriş başarısız oldu.");
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 sm:px-10">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-10 shadow-[0_30px_60px_rgba(15,23,42,0.7)]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Giriş</p>
            <h1 className="text-4xl font-semibold text-white">Pulsar Themes Giriş</h1>
            <p className="max-w-2xl text-slate-400">
              Lütfen yönetici hesabınız veya kullanıcı bilgilerinizle giriş yapın. Sistem, Postgres veritabanı üzerinden doğrulama yapar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 grid gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-200">Kullanıcı Adı</label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                placeholder="admin"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-200">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                placeholder="••••••••"
              />
            </div>
            {error ? <p className="text-sm text-rose-400">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="rounded-3xl bg-fuchsia-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-fuchsia-300 disabled:opacity-60"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-800/80 p-6 text-slate-300">
            <p className="text-sm text-slate-400">
              Yönetici hesabı, `admin` kullanıcısı ile yapılandırılacaktır. Lütfen bağlantı ayarlarını `DATABASE_URL`, `JWT_SECRET` ve `ADMIN_PASSWORD` ile sağlayın.
            </p>
          </div>

          <div className="mt-8 text-sm text-slate-400">
            <p>Henüz yeni hesap oluşturma desteği yok. Yalnızca mevcut kullanıcılarla giriş yapılabilir.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
