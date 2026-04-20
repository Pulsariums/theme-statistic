import { cookies } from "next/headers";
import GalleryBrowser from "@/app/components/gallery-browser";
import { getCurrentUser } from "@/lib/auth";
import { getGalleryAssets } from "@/lib/gallery";

export default async function GalleryPage() {
  const assets = await getGalleryAssets();
  const cookiesStore = await cookies();
  const cookieValue = cookiesStore.get("pulsar_session")?.value ?? null;
  const currentUser = await getCurrentUser(cookieValue);
  const isAdmin = currentUser?.role === "admin";

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 sm:px-10">
        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_32px_80px_rgba(15,23,42,0.16)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]/90">Galeri</p>
              <h1 className="mt-4 text-3xl font-semibold text-[var(--text)]">Arkaplan Kütüphanesi</h1>
              <p className="mt-2 max-w-3xl text-[var(--muted)]">Duvar kağıtları, logolar ve stickerları burada arayabilir, filtreleyebilir ve büyük halini görüntüleyebilirsiniz.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_32px_80px_rgba(15,23,42,0.16)]">
          <GalleryBrowser initialAssets={assets} isAdmin={isAdmin} />
        </section>
      </div>
    </main>
  );
}
