import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getThemeById, getThemeVersions } from "@/lib/db";
import MyThemeEditor from "@/app/components/my-theme-editor";

export default async function MyThemeEditPage({ params }: { params: { id: string } }) {
  const cookiesStore = await cookies();
  const cookieValue = cookiesStore.get("pulsar_session")?.value ?? null;
  const user = await getCurrentUser(cookieValue);

  if (!user) {
    redirect("/login");
  }

  const themeId = Number(params.id);
  if (!themeId || isNaN(themeId)) {
    redirect("/my-themes");
  }

  const theme = await getThemeById(themeId);
  const isOwner = theme && (theme.owner_id === user.id || (theme.owner_id === null && user.username && theme.author?.toLowerCase() === user.username.toLowerCase()));
  if (!theme || !isOwner) {
    redirect("/my-themes");
  }

  const versions = await getThemeVersions(theme.id);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:px-10">
        <section className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_32px_80px_rgba(15,23,42,0.16)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]/90">Tema Yönetimi</p>
              <h1 className="mt-4 text-3xl font-semibold text-[var(--text)]">{theme.name}</h1>
              <p className="mt-2 text-[var(--muted)]">Buradan temanın bilgilerini güncelleyebilir, yeni sürüm ekleyebilir ve görünürlüğünü yönetebilirsin.</p>
            </div>
            <a href="/my-themes" className="inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)]">
              Temalarıma Dön
            </a>
          </div>
        </section>

        <MyThemeEditor theme={theme} versions={versions} />
      </div>
    </main>
  );
}
