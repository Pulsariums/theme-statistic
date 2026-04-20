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
          ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--text)] hover:text-[var(--text)]"
      }`}
    >
      {tag}
    </button>
  );
}
