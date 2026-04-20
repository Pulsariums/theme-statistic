"use client";

import type { ThemeTag } from "@/lib/themes";

type Props = {
  tag: string;
  active?: boolean;
  onClick?: () => void;
};

export default function TagPill({ tag, active = false, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        active
          ? "border-cyan-300 bg-cyan-400/15 text-cyan-200"
          : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500 hover:text-slate-100"
      }`}
    >
      {tag}
    </button>
  );
}
