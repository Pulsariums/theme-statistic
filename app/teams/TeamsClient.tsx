"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Team = {
  id: number;
  name: string;
  description: string | null;
  owner_id: number | null;
  member_ids: number[];
  created_at: string;
};

type TeamsClientProps = {
  initialTeams: Team[];
};

export default function TeamsClient({ initialTeams }: TeamsClientProps) {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTeam = async () => {
    if (!name.trim()) {
      setError("Takım adı gereklidir.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
        cache: "no-store",
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Takım oluşturulamadı.");
        return;
      }

      setTeams([result.team, ...teams]);
      setName("");
      setDescription("");
      setMessage("Takım başarıyla oluşturuldu.");
      router.refresh();
    } catch (err) {
      setError("Takım oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-[var(--text)]">Takım Yönetimi</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Buradan yeni takımlar oluşturabilir ve mevcut takımlarınızı görüntüleyebilirsiniz.</p>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-[var(--text)]">Takım Adı</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
              placeholder="Takımınızı yazın"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-[var(--text)]">Açıklama</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-[120px] rounded-2xl border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--input-text)] outline-none transition focus:border-[var(--accent)]"
              placeholder="Takımınız hakkında kısa bir açıklama girin."
            />
          </div>
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
          <button
            type="button"
            onClick={handleCreateTeam}
            disabled={loading}
            className="inline-flex rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
          >
            {loading ? "Oluşturuluyor..." : "Yeni Takım Oluştur"}
          </button>
        </div>
      </div>

      <div className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-[var(--text)]">Kayıtlı Takımlarınız</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">Burada üyeliğiniz olan takımlar listelenir.</p>
        {teams.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6 text-[var(--muted)]">
            Henüz takımınız yok. İlk takımı oluşturun.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {teams.map((team) => (
              <div key={team.id} className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-[var(--text)]">{team.name}</h4>
                    <p className="mt-1 text-sm text-[var(--muted)]">{team.description || "Açıklama yok."}</p>
                  </div>
                  <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                    Üye {team.member_ids.length}
                  </span>
                </div>
                <p className="mt-4 text-sm text-[var(--muted)]">Oluşturuldu: {new Date(team.created_at).toLocaleDateString("tr-TR")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
