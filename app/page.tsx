import Link from "next/link";
import ThemeCard from "@/app/components/theme-card";
import { themes } from "@/lib/themes";

const popular = themes.slice().sort((a, b) => b.useCount - a.useCount).slice(0, 6);
const latest = themes.slice().sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()).slice(0, 6);

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:px-10">
          <div className="flex flex-col gap-8 rounded-[36px] border border-slate-800 bg-slate-900/95 p-8 shadow-[0_40px_90px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex rounded-full bg-fuchsia-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-300">
                epulsar themes
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Koyu siyah / mor, açık pembe / beyaz tema sistemi.
              </h1>
              <p className="mt-4 max-w-2xl text-slate-400 sm:text-lg">
                İki ana mod. Üstte sağda hızlı geçiş, altında kaydırmalı en popüler ve en yeni temalar.
              </p>
            </div>

            <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
              <button className="rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(168,85,247,0.24)] transition hover:scale-[1.02]">
                Koyu Tema
              </button>
              <button className="rounded-full border border-pink-400/20 bg-white/5 px-5 py-3 text-sm font-semibold text-pink-200 transition hover:bg-white/10 hover:text-white">
                Açık Tema
              </button>
            </div>
          </div>

          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">En Popüler Temalar</h2>
                <p className="mt-2 text-sm text-slate-400">En çok kullanılan tema koleksiyonu.</p>
              </div>
              <Link href="/browse" className="text-sm font-semibold text-fuchsia-300 transition hover:text-fuchsia-200">
                Hepsini Gör
              </Link>
            </div>
            <div className="-mx-4 overflow-x-auto pb-4 sm:-mx-6 sm:px-6">
              <div className="flex gap-4 px-4 sm:px-0">
                {popular.map((theme) => (
                  <div key={theme.id} className="min-w-[270px] flex-shrink-0 snap-start sm:min-w-[320px]">
                    <ThemeCard theme={theme} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">En Yeni Güncellenenler</h2>
                <p className="mt-2 text-sm text-slate-400">Son yayınlanan ve güncellenen temalar.</p>
              </div>
              <Link href="/browse" className="text-sm font-semibold text-fuchsia-300 transition hover:text-fuchsia-200">
                Tüm Yeni Temalar
              </Link>
            </div>
            <div className="-mx-4 overflow-x-auto pb-4 sm:-mx-6 sm:px-6">
              <div className="flex gap-4 px-4 sm:px-0">
                {latest.map((theme) => (
                  <div key={theme.id} className="min-w-[270px] flex-shrink-0 snap-start sm:min-w-[320px]">
                    <ThemeCard theme={theme} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
