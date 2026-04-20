import Link from "next/link";
import { themes } from "@/lib/themes";

const features = [
  { title: "Siyah Mod", description: "Jet tema ile siyah arayüz, net kontrast ve şık vurgu renkler." },
  { title: "Blush Mod", description: "Açık mor ve pembemsi beyaz temasına hızlı geçiş." },
  { title: "Kolay Keşif", description: "En son çıkan ve en çok kullanılan temaları hızlıca görüntüle." },
];

const latest = themes
  .slice()
  .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
  .slice(0, 3);

const popular = themes.slice().sort((a, b) => b.useCount - a.useCount).slice(0, 3);

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden py-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-transparent blur-3xl" />
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 sm:px-10">
          <div className="rounded-[36px] border border-slate-800 bg-slate-900/95 p-10 shadow-[0_40px_90px_rgba(15,23,42,0.55)] backdrop-blur-xl">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-fuchsia-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-300">
                  epuslar themes
                </p>
                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Tema platformu, siyah ve blush modlarıyla hazır.
                </h1>
                <p className="mt-6 max-w-xl text-slate-400 sm:text-lg">
                  Son çıkan temaları keşfet, popüler koleksiyonlara göz at ve Browse sayfası üzerinden anında arama yap.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/browse" className="inline-flex items-center rounded-full bg-fuchsia-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-fuchsia-300">
                    Browse&apos;a Git
                  </Link>
                  <Link href="/theme-builder" className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/90 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-fuchsia-300 hover:bg-slate-800">
                    Theme Builder
                  </Link>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border border-slate-800 bg-slate-950/95 p-6">
                  <h2 className="text-xl font-semibold text-white">Dark / Black</h2>
                  <p className="mt-3 text-slate-400">Zengin siyah altyapı, derin kontrast ve neon vurgu deneyimi.</p>
                </div>
                <div className="rounded-[28px] border border-slate-800 bg-slate-950/95 p-6">
                  <h2 className="text-xl font-semibold text-white">Blush / Pembe</h2>
                  <p className="mt-3 text-slate-400">Açık mor ve pembe tonlar, beyaz detaylarla modern bir tema.</p>
                </div>
              </div>
            </div>
          </div>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-6">
              <h2 className="text-2xl font-semibold text-white">En Son Çıkan Temalar</h2>
              <div className="mt-5 space-y-4">
                {latest.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <p className="text-sm text-slate-400">{item.author}</p>
                      </div>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">{item.releaseDate}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-6">
              <h2 className="text-2xl font-semibold text-white">En Çok Kullanılan Temalar</h2>
              <div className="mt-5 space-y-4">
                {popular.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <p className="text-sm text-slate-400">{item.author}</p>
                      </div>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">{item.useCount} kullan</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((item) => (
              <div key={item.title} className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.25)] transition hover:border-fuchsia-300/60 hover:bg-slate-800/95">
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
