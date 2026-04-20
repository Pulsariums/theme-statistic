import Link from "next/link";

const features = [
  { title: "Kullanıcı Dostu", description: "Temiz top navigation ve mobil duyarlı tasarım." },
  { title: "Tema Kategorileri", description: "Mobil, PC, Anime, Dark ve daha fazlası için etiket desteği." },
  { title: "Hızlı Erişim", description: "Ana sayfa, browse, search ve admin kontrolü tek bir çatı altında." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden py-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/5 blur-3xl" />
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 sm:px-10">
          <div className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-4 inline-flex rounded-full bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                  OpenAnime Tema Portalı
                </p>
                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Tema paylaşımını ve sayaç takibini tek platformda birleştimek.
                </h1>
                <p className="mt-6 max-w-xl text-slate-400 sm:text-lg">
                  Şimdi mobil ve masaüstü için modern bir tema deneyimi kuruyoruz. "Use device" yaklaşımıyla her ekran boyutunda akıcı bir navigasyon sağlayacağız.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/browse" className="inline-flex items-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
                    Temalara Bak
                  </Link>
                  <Link href="/theme-builder" className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/90 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300 hover:bg-slate-800">
                    Theme Builder
                  </Link>
                </div>
              </div>

              <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-[420px]">
                <div className="rounded-[28px] border border-slate-800 bg-slate-950/95 p-6">
                  <h2 className="text-xl font-semibold text-white">Mobil Tema</h2>
                  <p className="mt-3 text-slate-400">Dokunmatik kullanıma uygun, kusursuz yuvarlak butonlar ve geniş kartlar.</p>
                </div>
                <div className="rounded-[28px] border border-slate-800 bg-slate-950/95 p-6">
                  <h2 className="text-xl font-semibold text-white">Anime Teması</h2>
                  <p className="mt-3 text-slate-400">Canlı renkler, neon vurgu ve anime ruhunu taşıyan görsel tasarım.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((item) => (
              <div key={item.title} className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.25)] transition hover:border-cyan-300/60 hover:bg-slate-800/95">
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
