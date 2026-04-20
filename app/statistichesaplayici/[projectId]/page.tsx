import Link from "next/link";

export default function StatsPage({ params }: { params: { projectId: string } }) {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 sm:px-10">
        <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[0_30px_60px_rgba(15,23,42,0.16)]">
          <h1 className="text-4xl font-semibold text-[var(--text)]">Sayaç Sayfası</h1>
          <p className="mt-4 text-[var(--muted)]">
            Proje ID: <span className="font-medium text-[var(--accent)]">{params.projectId}</span>
          </p>
          <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
            <p className="text-sm text-[var(--muted)]">Bu sayfa, proje bazlı sayaç ve istatistik göstergelerini barındıracak.</p>
          </div>
          <div className="mt-8">
            <Link href="/" className="inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-[var(--text)] transition hover:bg-[var(--accent-strong)]">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
