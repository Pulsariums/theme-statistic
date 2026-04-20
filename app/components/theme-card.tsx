type ThemeCardData = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  author: string | null;
  tags?: string[] | null;
  popularity?: number;
  use_count?: number;
};

import Link from "next/link";

type Props = {
  theme: ThemeCardData;
};

export default function ThemeCard({ theme }: Props) {
  const popularity = theme.use_count ?? theme.popularity ?? 0;
  return (
    <Link href={`/themes/${encodeURIComponent(theme.slug)}`} className="group">
      <article className="min-w-[260px] max-w-[300px] rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 text-sm shadow-sm transition hover:border-[var(--accent)]">
        <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--accent)]/80">{theme.author || "Bilinmeyen"}</p>
          <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">{theme.name}</h3>
        </div>
        <span className="rounded-full bg-[var(--surface-strong)] px-2.5 py-1 text-[11px] text-[var(--muted)]">{popularity}%</span>
      </div>
      <p className="mt-3 leading-6 text-[var(--muted)]">{theme.description || "Açıklama yok."}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(theme.tags || []).map((tag) => (
          <span key={tag} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[10px] text-[var(--muted)]">
            {tag}
          </span>
        ))}
      </div>
    </article>
    </Link>
  );
}
