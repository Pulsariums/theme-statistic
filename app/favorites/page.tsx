import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getUserFavorites } from "@/lib/db";
import ThemeCard from "@/app/components/theme-card";

export default async function FavoritesPage() {
  const cookiesStore = await cookies();
  const cookieValue = cookiesStore.get("pulsar_session")?.value ?? null;
  const user = await getCurrentUser(cookieValue);

  if (!user) {
    redirect("/login");
  }

  const favorites = await getUserFavorites(user.id);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_32px_80px_rgba(15,23,42,0.16)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]/90">Hesabım</p>
              <h1 className="mt-4 text-3xl font-semibold text-[var(--text)]">Favoriler</h1>
              <p className="mt-2 text-[var(--muted)]">Favori temalarını burada görebilir ve düzenlenebilir temalara kolayca ulaşabilirsin.</p>
            </div>
          </div>
        </section>

        {favorites.length === 0 ? (
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-[var(--muted)]">
            Henüz favori tema eklemediniz. Bir tema detay sayfasından favoriye ekleyebilirsiniz.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {favorites.map((theme) => (
              <ThemeCard key={theme.id} theme={theme} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
