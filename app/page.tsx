import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10">
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/90 p-10 shadow-[0_32px_80px_rgba(15,23,42,0.65)]">
          <div className="mb-8">
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-cyan-300/90">Pulsar Themes</p>
            <h1 className="text-4xl font-semibold sm:text-5xl">OpenAnime tema paylaşım portalı</h1>
            <p className="mt-4 max-w-3xl text-slate-300 sm:text-lg">
              Bu site, tema paylaşma ve sayım takibi için React/Next.js tabanlı bir portal sunacak.
              Sayfaları basit tutuyoruz: ana sayfa, browse, search, admin, görsel arayüzü ve proje bazlı sayaç URL’leri.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/browse" className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6 transition hover:border-cyan-400/60 hover:bg-slate-700/90">
              <h2 className="text-xl font-semibold text-white">Browse</h2>
              <p className="mt-2 text-sm text-slate-400">Temalara göz atma sayfası.</p>
            </Link>
            <Link href="/search" className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6 transition hover:border-cyan-400/60 hover:bg-slate-700/90">
              <h2 className="text-xl font-semibold text-white">Search</h2>
              <p className="mt-2 text-sm text-slate-400">Tema arama ve filtreleme.</p>
            </Link>
            <Link href="/admin" className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6 transition hover:border-cyan-400/60 hover:bg-slate-700/90">
              <h2 className="text-xl font-semibold text-white">Admin</h2>
              <p className="mt-2 text-sm text-slate-400">Yönetici paneli ve onaylama ekranı.</p>
            </Link>
            <Link href="/theme-builder" className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6 transition hover:border-cyan-400/60 hover:bg-slate-700/90">
              <h2 className="text-xl font-semibold text-white">Theme Builder</h2>
              <p className="mt-2 text-sm text-slate-400">Kendi temanı renk ve şekil seçerek oluştur.</p>
            </Link>
            <Link href="/images/341458125" className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6 transition hover:border-cyan-400/60 hover:bg-slate-700/90">
              <h2 className="text-xl font-semibold text-white">Görsel Arkaplan</h2>
              <p className="mt-2 text-sm text-slate-400">Örnek görsel URL'si: /images/341458125</p>
            </Link>
            <Link href="/statistichesaplayici/demo-proje" className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6 transition hover:border-cyan-400/60 hover:bg-slate-700/90">
              <h2 className="text-xl font-semibold text-white">Sayım Sayfası</h2>
              <p className="mt-2 text-sm text-slate-400">Proje bazlı sayaç için sample URL.</p>
            </Link>
          </div>

          <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-950/95 p-8">
            <h2 className="text-2xl font-semibold text-white">Not</h2>
            <p className="mt-3 text-slate-400">
              Bu ana sayfa, uygulamanın Next.js uç noktasını kullanıyor. Eğer Vercel projesi bu repo ile bağlıysa ve deploy tamamsa,
              push sonrası site açıldığında bu arayüz görünmelidir.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
