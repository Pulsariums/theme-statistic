import Link from "next/link";
import ThemeCard from "@/app/components/theme-card";
import { getPublishedThemes, type ThemeRecord } from "@/lib/db";

function sortLatest(themes: ThemeRecord[]) {
  return [...themes].sort((a, b) => {
    if (!a.release_date) return 1;
    if (!b.release_date) return -1;
    return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
  });
}

function sortPopular(themes: ThemeRecord[]) {
  return [...themes].sort((a, b) => b.use_count - a.use_count);
}

export default async function Home() {
  let themes: ThemeRecord[] = [];
  try {
    themes = await getPublishedThemes();
  } catch {
    themes = [];
  }

  const popular = sortPopular(themes).slice(0, 6);
  const latest = sortLatest(themes).slice(0, 6);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <section className="py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:px-10">
          <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[0_30px_60px_rgba(15,23,42,0.18)]">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex rounded-full bg-[var(--accent)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                Pulsar Themes
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">
                Koyu siyah / mor, açık pembe / beyaz tema sistemi.
              </h1>
              <p className="mt-4 max-w-2xl text-[var(--muted)] sm:text-lg">
                İki ana mod. Üstte sağda hızlı geçiş, altta kaydırmalı popüler ve yeni temalar.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/browse" className="inline-flex items-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)]">
                Temalara Bak
              </Link>
            </div>
          </div>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text)]">Popüler Temalar</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Veritabanından çekilen en çok kullanılan temalar.</p>
            </div>
            {popular.length > 0 ? (
              <div className="-mx-4 overflow-x-auto pb-4 no-scrollbar sm:-mx-6 sm:px-6">
                <div className="flex gap-4 px-4 sm:px-0">
                  {popular.map((theme) => (
                    <div key={theme.id} className="min-w-[270px] flex-shrink-0 snap-start sm:min-w-[320px]">
                      <ThemeCard theme={theme} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-[var(--muted)]">
                Henüz veritabanında yayınlanmış tema bulunmuyor.
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text)]">Yeni Güncellenenler</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">Veritabanındaki en son güncellenen temalar.</p>
            </div>
            {latest.length > 0 ? (
              <div className="-mx-4 overflow-x-auto pb-4 no-scrollbar sm:-mx-6 sm:px-6">
                <div className="flex gap-4 px-4 sm:px-0">
                  {latest.map((theme) => (
                    <div key={theme.id} className="min-w-[270px] flex-shrink-0 snap-start sm:min-w-[320px]">
                      <ThemeCard theme={theme} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-[var(--muted)]">
                Henüz veritabanında güncellenmiş tema yok.
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
