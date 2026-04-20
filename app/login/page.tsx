import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-12 sm:px-10">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-10 shadow-[0_30px_60px_rgba(15,23,42,0.7)]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Hesap Girişi</p>
            <h1 className="text-4xl font-semibold text-white">Giriş Yap veya Hesap Beklet</h1>
            <p className="max-w-2xl text-slate-400">
              Veritabanı kurulduktan sonra bu form gerçek kullanıcı kimlik doğrulaması, hesap profilleri ve admin yetkisi için aktif hale gelecek.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6">
              <h2 className="text-xl font-semibold text-white">Standart Kullanıcı</h2>
              <p className="mt-2 text-sm text-slate-400">Kullanıcı adı, e-posta ve profil bilgileri burada saklanacak.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-800/80 p-6">
              <h2 className="text-xl font-semibold text-white">Yönetici Hesabı</h2>
              <p className="mt-2 text-sm text-slate-400">Varsayılan admin hesabı `admin` kullanıcı adıyla açılacak ve ayrı yetkiyle çalışacak.</p>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/80 p-6 text-slate-300">
              <p className="text-sm text-slate-400">Burada şu anda gerçek bir hesap/parola sistemi yok.</p>
              <p className="text-sm text-slate-300">
                Güvenlik önceliğiyle, hesap kimlik doğrulaması için yönetilen bir servis veya güçlü backend doğrulaması eklemeden önce bu alan kapalı kalacak.
              </p>
            </div>
            <button
              type="button"
              disabled
              className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400 transition"
            >
              Güvenli Kimlik Doğrulama Bekleniyor
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>Giriş yapıldığında kullanıcı profilleri ve hesap rolleri saklanacak.</p>
            <Link href="/" className="inline-flex rounded-full bg-cyan-400 px-5 py-3 text-slate-950 transition hover:bg-cyan-300">
              Ana Sayfaya Dön
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
