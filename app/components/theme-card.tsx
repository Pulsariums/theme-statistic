import type { ThemeItem } from "@/lib/themes";

type Props = {
  theme: ThemeItem;
};

export default function ThemeCard({ theme }: Props) {
  return (
    <article className="rounded-[24px] border border-slate-800 bg-slate-900/95 p-5 shadow-[0_20px_45px_rgba(0,0,0,0.25)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-fuchsia-300/80">{theme.author}</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-100">{theme.name}</h3>
        </div>
        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] text-slate-400">{theme.popularity}%</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-400">{theme.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {theme.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-slate-700 bg-slate-950/80 px-2.5 py-1 text-[11px] text-slate-400">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
