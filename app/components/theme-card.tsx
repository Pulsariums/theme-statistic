import type { ThemeItem } from "@/lib/themes";

type Props = {
  theme: ThemeItem;
};

export default function ThemeCard({ theme }: Props) {
  return (
    <article className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-6 shadow-lg shadow-slate-950/20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">{theme.author}</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-100">{theme.name}</h3>
        </div>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">{theme.popularity}%</span>
      </div>
      <p className="mt-4 text-slate-400">{theme.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {theme.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs text-slate-400">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
