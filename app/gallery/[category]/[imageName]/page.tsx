import Link from "next/link";
import { notFound } from "next/navigation";
import { getGalleryAsset, getGalleryAssetHistory, recordGalleryAssetView } from "@/lib/gallery";
import GalleryDetailActions from "@/app/components/gallery-detail-actions";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
}

export default async function GalleryImagePage({ params }: { params: { category: string; imageName: string } }) {
  const asset = await getGalleryAsset(params.category, params.imageName);
  if (!asset) {
    return notFound();
  }

  await recordGalleryAssetView(asset.imagePath);
  const history = await getGalleryAssetHistory(asset.imagePath, 14);
  const values = history.map((item) => item.view_count ?? 0);
  const maxValue = Math.max(...values, 1);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]/90">Galeri / {asset.category}</p>
            <h1 className="mt-3 text-3xl font-semibold text-[var(--text)]">{asset.label}</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Başlık, indirme ve günlük kullanım grafiği bu sayfada görüntülenir.</p>
          </div>
          <Link href="/gallery" className="inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)]">
            Galeriye Dön
          </Link>
        </div>

        <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_32px_80px_rgba(15,23,42,0.16)]">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--surface-strong)]">
              <img src={asset.url} alt={asset.label} className="h-full w-full object-contain" />
            </div>
            <div className="space-y-5">
              <div className="space-y-2 rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-5">
                <p className="text-sm text-[var(--muted)]">Dosya</p>
                <h2 className="text-xl font-semibold text-[var(--text)]">{asset.fileName}</h2>
                <p className="text-sm text-[var(--muted)]">Kategori: {asset.category}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                  <span className="rounded-full bg-[var(--surface)] px-3 py-1">{asset.views} görüntüleme</span>
                  <span className="rounded-full bg-[var(--surface)] px-3 py-1">{asset.downloads} indirme</span>
                </div>
              </div>

              <GalleryDetailActions imageUrl={asset.url} downloadApi={`/api/gallery/${encodeURIComponent(asset.category)}/${encodeURIComponent(asset.fileName)}/download`} />
            </div>
          </div>
        </div>

        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_32px_80px_rgba(15,23,42,0.16)]">
          <h2 className="text-2xl font-semibold text-[var(--text)]">Günlük Görüntüleme Grafiği</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Son 14 gün içinde bu görsel kaç kez görüntülendi.</p>
          <div className="mt-6 space-y-4">
            {history.length === 0 ? (
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6 text-[var(--muted)]">Henüz kullanım verisi yok.</div>
            ) : (
              <div className="space-y-4">
                {history.map((entry) => (
                  <div key={entry.usage_date} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                      <span>{formatDate(entry.usage_date)}</span>
                      <span>{entry.view_count ?? 0} görüntüleme</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-strong)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)] transition-all"
                        style={{ width: `${Math.round(((entry.view_count ?? 0) / maxValue) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
