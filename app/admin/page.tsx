import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 sm:px-10">
        <div className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-10 shadow-[0_30px_60px_rgba(15,23,42,0.7)]">
          <h1 className="text-4xl font-semibold">Admin Paneli</h1>
          <p className="mt-4 text-slate-300">Yönetici onayları, tema durum değişiklikleri ve proje ayarları burada olacak.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6">
              <h2 className="text-xl font-semibold text-white">Onay Bekleyen Temalar</h2>
              <p className="mt-2 text-sm text-slate-400">Burada `pending` durumundaki temalar listelenecek.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6">
              <h2 className="text-xl font-semibold text-white">Proje Yönetimi</h2>
              <p className="mt-2 text-sm text-slate-400">Proje metadata, thumbnail ve plugin durumunu yöneteceğiz.</p>
            </div>
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
