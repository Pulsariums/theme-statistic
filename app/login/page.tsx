"use client";

import { FormEvent, useEffect, useState } from "react";
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
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth", { cache: "no-store", credentials: "include" });
        if (response.ok) {
          const result = await response.json();
          if (result.user) {
            router.replace(result.user.role === "admin" ? "/admin" : "/browse");
            return;
          }
        }
      } catch {
        // ignore
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

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
      credentials: "include",
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

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
        <div className="mx-auto flex max-w-4xl items-center justify-center px-6 py-20 sm:px-10">
          <p className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-6 py-5 text-sm text-[var(--text)] shadow-sm">
            Oturumunuz kontrol ediliyor...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 sm:px-10">
        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[0_30px_60px_rgba(15,23,42,0.16)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]/90">Hesap Girişi</p>
              <h1 className="text-4xl font-semibold text-[var(--text)]">Pulsar Themes</h1>
              <p className="max-w-2xl text-[var(--muted)]">
                {mode === "login"
                  ? "Mevcut kullanıcı bilgilerinizle giriş yapın."
                  : "Yeni hesap oluşturun ve Pulsar Themes arayüzüne kayıtlı kullanıcı olarak erişin."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${mode === "login" ? "bg-[var(--accent)] text-[var(--text)]" : "bg-[var(--surface-strong)] text-[var(--text)] hover:bg-[var(--surface)]"}`}
              >
                Giriş
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${mode === "register" ? "bg-[var(--accent)] text-[var(--text)]" : "bg-[var(--surface-strong)] text-[var(--text)] hover:bg-[var(--surface)]"}`}
              >
                Kayıt
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 grid gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[var(--text)]">Kullanıcı Adı</label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                placeholder="kullaniciadi"
              />
            </div>
            {mode === "register" ? (
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[var(--text)]">E-Posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                  placeholder="ornek@pulsarthemes.local"
                />
              </div>
            ) : null}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[var(--text)]">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                placeholder="••••••••"
              />
            </div>
            {mode === "register" ? (
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[var(--text)]">Şifre Tekrar</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
                  placeholder="••••••••"
                />
              </div>
            ) : null}
            {error ? <p className="text-sm text-rose-400">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="rounded-3xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
            >
              {loading ? "İşlem sürüyor..." : mode === "login" ? "Giriş Yap" : "Hesap Oluştur"}
            </button>
          </form>

          <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6 text-[var(--muted)]">
            <p className="text-sm">
              Yönetici hesabı, `admin` kullanıcısı ile otomatik oluşturulacaktır. Yeni kullanıcılar varsayılan olarak normal kullanıcı rolü ile kaydedilir.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
