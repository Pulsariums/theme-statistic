import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserThemes } from "@/lib/db";
import ThemeCard from "@/app/components/theme-card";

export default async function MyThemesPage() {
  const cookiesStore = await cookies();
  const cookieValue = cookiesStore.get("pulsar_session")?.value ?? null;
  const user = await getCurrentUser(cookieValue);

  if (!user) {
    redirect("/login");
  }

  const themes = await getUserThemes(user.id, user.username);

  const formatStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Onay Bekleniyor";
      case "published":
        return "Kabul Edildi";
      case "archived":
        return "Reddedildi / Arşivlendi";
      case "draft":
        return "Taslak";
      case "pending_delete":
        return "Silme İsteği Gönderildi";
      default:
        return status;
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_32px_80px_rgba(15,23,42,0.16)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]/90">İsteklerim</p>
              <h1 className="mt-4 text-3xl font-semibold text-[var(--text)]">Temalarım</h1>
              <p className="mt-2 text-[var(--muted)]">Şu anki onay durumunu, reddedilme notunu ya da yayınlanmış temalarını bu sayfadan takip edebilirsin.</p>
            </div>
            <a href="/theme-upload" className="inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)]">
              Yeni Tema İsteği Gönder
            </a>
          </div>
        </section>

        {themes.length === 0 ? (
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-[var(--muted)]">
            Henüz kendi temalarını yüklemedin. Yeni bir tema eklemek için yukarıdaki butona tıkla.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {themes.map((theme) => (
              <div key={theme.id} className="group relative">
                <ThemeCard theme={theme} />
                <div className="mt-3 grid gap-3">
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`/my-themes/${theme.id}`}
                      className="inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)]"
                    >
                      Düzenle
                    </a>
                    <span className="rounded-full bg-[var(--surface-strong)] px-3 py-2 text-xs text-[var(--muted)]">
                      {formatStatus(theme.status)}
                    </span>
                  </div>
                  {theme.moderation_reason ? (
                    <div className="rounded-3xl border border-yellow-500/20 bg-yellow-950/10 p-3 text-sm text-yellow-200">
                      <p className="font-semibold text-[var(--text)]">Reddetme Notu</p>
                      <p>{theme.moderation_reason}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
