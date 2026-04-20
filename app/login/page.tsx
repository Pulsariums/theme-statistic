"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AuthMode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = mode === "login" ? "/api/auth" : "/api/auth/register";
    const payload =
      mode === "login"
        ? { username, password }
        : { username, email, password, confirmPassword };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error || "İşlem başarısız oldu.");
      return;
    }

    if (result.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/browse");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 sm:px-10">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-10 shadow-[0_30px_60px_rgba(15,23,42,0.7)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Hesap Girişi</p>
              <h1 className="text-4xl font-semibold text-white">Pulsar Themes</h1>
              <p className="max-w-2xl text-slate-400">
                {mode === "login"
                  ? "Mevcut kullanıcı bilgilerinizle giriş yapın."
                  : "Yeni hesap oluşturun ve Pulsar Themes arayüzüne kayıtlı kullanıcı olarak erişin."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${mode === "login" ? "bg-fuchsia-400 text-slate-950" : "bg-slate-900 text-slate-200 hover:bg-slate-800"}`}
              >
                Giriş
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${mode === "register" ? "bg-fuchsia-400 text-slate-950" : "bg-slate-900 text-slate-200 hover:bg-slate-800"}`}
              >
                Kayıt
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 grid gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-200">Kullanıcı Adı</label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                placeholder="kullaniciadi"
              />
            </div>
            {mode === "register" ? (
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-200">E-Posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                  placeholder="ornek@pulsarthemes.local"
                />
              </div>
            ) : null}
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
            {mode === "register" ? (
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-200">Şifre Tekrar</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                  placeholder="••••••••"
                />
              </div>
            ) : null}
            {error ? <p className="text-sm text-rose-400">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="rounded-3xl bg-fuchsia-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-fuchsia-300 disabled:opacity-60"
            >
              {loading ? "İşlem sürüyor..." : mode === "login" ? "Giriş Yap" : "Hesap Oluştur"}
            </button>
          </form>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-800/80 p-6 text-slate-300">
            <p className="text-sm text-slate-400">
              Yönetici hesabı, `admin` kullanıcısı ile otomatik oluşturulacaktır. Yeni kullanıcılar varsayılan olarak normal kullanıcı rolü ile kaydedilir.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
