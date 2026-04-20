import Link from "next/link";

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 sm:px-10">
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-10 shadow-[0_30px_60px_rgba(15,23,42,0.7)]">
          <h1 className="text-4xl font-semibold">Search</h1>
          <p className="mt-4 text-slate-300">Tema arama sayfası. Burada anahtar kelime, renk veya proje ismiyle arama yapabilirsiniz.</p>
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-800/80 p-6">
            <p className="text-sm text-slate-400">Şimdilik bu sayfa placeholder. Sonraki adımda arama kutusu ve sonuç listesi ekleyeceğiz.</p>
          </div>
          <div className="mt-8">
            <Link href="/" className="inline-flex rounded-full bg-cyan-400 px-5 py-3 text-slate-950 transition hover:bg-cyan-300">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
