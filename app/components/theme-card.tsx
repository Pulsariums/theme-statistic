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

type Props = {
  theme: ThemeCardData;
};

export default function ThemeCard({ theme }: Props) {
  const popularity = theme.use_count ?? theme.popularity ?? 0;
  return (
    <article className="min-w-[260px] max-w-[300px] rounded-2xl border border-slate-800 bg-slate-900/95 p-4 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-fuchsia-300/80">{theme.author || "Bilinmeyen"}</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-100">{theme.name}</h3>
        </div>
        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] text-slate-400">{popularity}%</span>
      </div>
      <p className="mt-3 leading-6 text-slate-400">{theme.description || "Açıklama yok."}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(theme.tags || []).map((tag) => (
          <span key={tag} className="rounded-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-[10px] text-slate-400">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
