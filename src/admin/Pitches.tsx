import { useEffect, useMemo, useState } from "react";
import { inputClass } from "./fields";
import { supabase } from "./supabase";

/** A row of `project_pitches` (supabase/migrations/0004_project_pitches.sql), sent from the form at /proje-oner/. */
interface Pitch {
  id: number;
  created_at: string;
  title: string;
  description: string;
  name: string;
  email: string;
  student_no: string | null;
  lang: "tr" | "en";
}

/** Project ideas sent from the pitch form, newest first: read, reply by email, delete once handled (KVKK). */
export function Pitches() {
  const [rows, setRows] = useState<Pitch[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    supabase!
      .from("project_pitches")
      .select("id, created_at, title, description, name, email, student_no, lang")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => (error ? setError(error.message) : setRows(data as Pitch[])));
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q || !rows) return rows;
    return rows.filter((p) => [p.title, p.description, p.name, p.email].some((v) => v.toLocaleLowerCase("tr").includes(q)));
  }, [rows, query]);

  async function remove(p: Pitch) {
    if (!confirm(`Delete the pitch "${p.title}" from ${p.name}? This can't be undone.`)) return;
    const { error } = await supabase!.from("project_pitches").delete().eq("id", p.id);
    if (error) return setError(error.message);
    setRows((r) => r?.filter((x) => x.id !== p.id) ?? null);
  }

  return (
    <section className="rounded-3xl border-2 border-ink bg-paper p-4 shadow-[var(--shadow-brut-sm)] md:p-6">
      <h2 className="font-display text-xl font-bold tracking-tight">Project pitches</h2>
      <p className="mt-1 text-sm text-ink/65">
        Sent from the form at{" "}
        <a href="/proje-oner/" target="_blank" rel="noreferrer" className="font-semibold text-violet hover:underline">
          /proje-oner/
        </a>
        , newest first. Personal data: delete a pitch once it's been handled, or when its sender asks.
      </p>

      {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}
      {!rows && !error && <p className="mt-4 text-ink/60">Loading…</p>}
      {rows?.length === 0 && <p className="mt-4 text-ink/60">No pitches yet.</p>}

      {rows && rows.length > 0 && (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, description, name, email…"
              aria-label="Search pitches"
              className={`${inputClass()} max-w-md`}
            />
            <p className="text-sm text-ink/65">
              {shown!.length === rows.length ? `${rows.length} in total` : `${shown!.length} of ${rows.length}`}
            </p>
          </div>
          <ol className="mt-5 grid gap-3">
            {shown!.map((p) => (
              <li key={p.id} className="rounded-2xl border-2 border-ink/15 px-4 py-3">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="min-w-0 flex-1 font-display text-lg font-bold tracking-tight">
                    {p.title}
                    {p.lang === "en" && <span className="ml-2 pill border-ink/30 px-1.5 py-0 align-middle text-[11px]">EN</span>}
                  </h3>
                  <p className="text-sm text-ink/60">{new Date(p.created_at).toLocaleString()}</p>
                </div>
                <p className="mt-1 text-sm text-ink/75">
                  <span className="font-semibold">{p.name}</span>
                  {" · "}
                  <a href={`mailto:${p.email}?subject=${encodeURIComponent(p.title)}`} className="break-all hover:underline">
                    {p.email}
                  </a>
                  {p.student_no && ` · ${p.student_no}`}
                </p>
                <p className="mt-3 whitespace-pre-wrap break-words text-[15px] leading-relaxed">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold">
                  <a href={`mailto:${p.email}?subject=${encodeURIComponent(p.title)}`} className="text-violet hover:underline">
                    Reply by email
                  </a>
                  <button type="button" onClick={() => remove(p)} className="text-red-700 hover:underline">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
