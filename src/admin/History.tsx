import { useEffect, useState } from "react";
import type { Saved } from "../content/load";
import type { Scope } from "./draft";
import { supabase } from "./supabase";

interface Version {
  savedAt: string;
  savedBy: string | null;
  data: Saved;
}

const partNames: Record<Scope, string> = { tr: "Turkish", en: "English", site: "Links & sponsors" };

/**
 * Earlier saves, newest first. One save writes the changed rows ("tr", "en", "site") in a single
 * transaction, so rows with the same timestamp belong together.
 */
export function History({ onLoad }: { onLoad: (version: Saved, label: string) => void }) {
  const [versions, setVersions] = useState<Version[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase!
      .from("content_history")
      .select("key, data, saved_at, saved_by")
      .order("saved_at", { ascending: false })
      .limit(150)
      .then(({ data, error }) => {
        if (error) return setError(error.message);
        const grouped = new Map<string, Version>();
        for (const row of data) {
          const v: Version = grouped.get(row.saved_at) ?? { savedAt: row.saved_at, savedBy: row.saved_by, data: {} };
          v.data[row.key as Scope] = row.data;
          grouped.set(row.saved_at, v);
        }
        setVersions([...grouped.values()]);
      });
  }, []);

  return (
    <section className="rounded-3xl border-2 border-ink bg-paper p-4 shadow-[var(--shadow-brut-sm)] md:p-6">
      <h2 className="font-display text-xl font-bold tracking-tight">History</h2>
      <p className="mt-1 text-sm text-ink/65">
        Every save, newest first. "Load" puts that version's parts into the editor; nothing changes on the site until you save.
      </p>
      {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}
      {!versions && !error && <p className="mt-4 text-ink/60">Loading…</p>}
      {versions?.length === 0 && <p className="mt-4 text-ink/60">Nothing saved yet: the site shows the texts from the code.</p>}
      <ol className="mt-5 grid gap-2">
        {versions?.map((v, i) => {
          const when = new Date(v.savedAt).toLocaleString();
          return (
            <li key={v.savedAt} className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border-2 border-ink/15 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold tracking-tight">
                  {when}
                  {i === 0 && <span className="ml-2 pill border-ink bg-lime px-2 py-0.5 text-xs">latest</span>}
                </p>
                <p className="text-sm text-ink/65">
                  {v.savedBy ?? "unknown"} · {(Object.keys(v.data) as Scope[]).map((k) => partNames[k]).join(", ")}
                </p>
              </div>
              <button type="button" onClick={() => onLoad(v.data, when)} className="btn btn-paper min-h-10 px-4 text-sm">
                Load
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
