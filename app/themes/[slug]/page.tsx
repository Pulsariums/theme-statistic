import { notFound } from "next/navigation";
import { getThemeBySlug, getThemeUsageHistory, recordThemeUsage } from "@/lib/db";
import CopyLinkButton from "@/app/components/copy-link-button";
import ThemeFavoriteButton from "@/app/components/theme-favorite-button";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
}

export default async function ThemeDetailPage({ params }: { params: { slug: string } }) {
  const theme = await getThemeBySlug(params.slug);
  if (!theme) {
    return notFound();
  }

  await recordThemeUsage(theme.id);
  const history = await getThemeUsageHistory(theme.id, 14);
  const maxValue = Math.max(...history.map((item) => item.use_count), 1);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_32px_80px_rgba(15,23,42,0.16)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]/90">Tema Detayı</p>
              <h1 className="mt-4 text-3xl font-semibold text-[var(--text)]">{theme.name}</h1>
              <p className="mt-2 text-sm text-[var(--muted)]">Bu temanın günlük kullanım grafiği ve CSS kodu burada gösterilir.</p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <ThemeFavoriteButton themeId={theme.id} />
              <CopyLinkButton value={`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/themes/${encodeURIComponent(theme.slug)}`} />
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
              <div className="rounded-3xl bg-[var(--surface)] p-6">
                <p className="text-sm text-[var(--muted)]">Açıklama</p>
                <p className="mt-3 text-lg font-semibold text-[var(--text)]">{theme.description || "Açıklama yok."}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                  <span className="rounded-full bg-[var(--surface)] px-3 py-1">Yazar: {theme.author || "Bilinmeyen"}</span>
                  <span className="rounded-full bg-[var(--surface)] px-3 py-1">Kullanım: {theme.use_count}</span>
                  <span className="rounded-full bg-[var(--surface)] px-3 py-1">Slug: {theme.slug}</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[var(--text)]">CSS Kodu</h2>
                <pre className="mt-4 max-h-[420px] overflow-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">
                  <code>{theme.css_code || "CSS kodu mevcut değil."}</code>
                </pre>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
                <h2 className="text-xl font-semibold text-[var(--text)]">Günlük Kullanım Grafiği</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">Son 14 gündeki ziyaret sayısı.</p>
                <div className="mt-6 space-y-4">
                  {history.length === 0 ? (
                    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--muted)]">Henüz kullanım verisi yok.</div>
                  ) : (
                    history.map((entry) => (
                      <div key={entry.usage_date} className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                          <span>{formatDate(entry.usage_date)}</span>
                          <span>{entry.use_count} kullanım</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-[var(--surface)]">
                          <div
                            className="h-full rounded-full bg-[var(--accent)] transition-all"
                            style={{ width: `${Math.round((entry.use_count / maxValue) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
