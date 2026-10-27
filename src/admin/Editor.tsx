import type { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { clearPreview, previewKey, type Preview, type Saved } from "../content/load";
import { scopes, toDraft, validate, type Draft, type Scope } from "./draft";
import { EditorContext } from "./fields";
import { History } from "./History";
import { previewUrl, sections } from "./sections";
import { supabase } from "./supabase";

/** When each row was last saved (and by whom) as of loading, to catch someone else saving meanwhile. */
type Stamps = Partial<Record<Scope, { at: string; by: string | null }>>;

const partNames: Record<Scope, string> = { tr: "TR", en: "EN", site: "Links" };

async function fetchRows() {
  const { data, error } = await supabase!.from("content").select("key, data, updated_at, updated_by");
  if (error) throw error;
  const saved: Saved = {};
  const stamps: Stamps = {};
  for (const row of data) {
    saved[row.key as Scope] = row.data;
    stamps[row.key as Scope] = { at: row.updated_at, by: row.updated_by };
  }
  return { saved, stamps };
}

/** "projects.items.2.slug" → which sidebar section shows it. */
function sectionOf(scope: Scope, top: string) {
  return sections.find((s) => (scope === "site" ? (s.site as string[]) : (s.content as string[])).includes(top))?.id ?? sections[0].id;
}

export function Editor({ session }: { session: Session }) {
  const [baseline, setBaseline] = useState<{ draft: Draft; stamps: Stamps } | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [active, setActive] = useState(sections[0].id);
  const [status, setStatus] = useState<{ text: string; error?: boolean }>({ text: "" });
  const [saving, setSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const load = useCallback(async () => {
    try {
      const { saved, stamps } = await fetchRows();
      const fresh = toDraft(saved);
      setBaseline({ draft: fresh, stamps });
      setDraft(fresh);
    } catch (e) {
      setStatus({ text: `Couldn't load the content: ${(e as Error).message}`, error: true });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const errors = useMemo(() => (draft ? validate(draft) : new Map<string, string>()), [draft]);
  const changed = useMemo(
    () => (draft && baseline ? scopes.filter((s) => JSON.stringify(draft[s]) !== JSON.stringify(baseline.draft[s])) : []),
    [draft, baseline],
  );

  // Keeps the draft where preview tabs (same browser) read it; they redraw on every change. Only while
  // something is unsaved: once saved (or undone), the draft goes and they show the live site.
  useEffect(() => {
    if (!draft) return;
    const timer = setTimeout(() => {
      if (!changed.length) return clearPreview();
      try {
        localStorage.setItem(previewKey, JSON.stringify({ draft, problems: errors.size } satisfies Preview));
      } catch {
        // Storage full or blocked: the preview keeps showing the previous draft.
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [draft, errors, changed.length]);

  useEffect(() => {
    if (!changed.length) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [changed.length]);

  const errorCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const key of errors.keys()) {
      const [scope, path] = key.split(":") as [Scope, string];
      const id = sectionOf(scope, path.split(".")[0]);
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    return counts;
  }, [errors]);

  if (!draft || !baseline) {
    return <main className="grid min-h-dvh place-items-center bg-fog p-4 text-center font-display text-lg text-ink/60">{status.text || "Loading content…"}</main>;
  }

  async function save() {
    if (!draft || !baseline || !changed.length) return;
    if (errors.size) {
      setShowErrors(true);
      return setStatus({ text: "Fix the highlighted fields first.", error: true });
    }
    setSaving(true);
    setStatus({ text: "Saving…" });
    try {
      // Someone else may have saved since this page loaded: don't overwrite their work silently.
      const { stamps } = await fetchRows();
      const newer = changed.filter((s) => stamps[s]?.at !== baseline.stamps[s]?.at);
      if (newer.length) {
        const who = newer.map((s) => `${partNames[s]} by ${stamps[s]?.by ?? "someone"}`).join(", ");
        if (!confirm(`Changes were saved after you opened the editor (${who}). Saving now replaces them with your version. Continue?`)) {
          setStatus({ text: "Not saved. Reload the page to see the other changes (your edits here will be lost)." });
          return;
        }
      }
      const { error } = await supabase!.from("content").upsert(changed.map((key) => ({ key, data: draft[key] })));
      if (error) throw error;
      await load();
      setStatus({ text: "Saved. Visitors see the changes on their next page load." });
    } catch (e) {
      setStatus({ text: `Not saved: ${(e as Error).message}`, error: true });
    } finally {
      setSaving(false);
    }
  }

  function loadVersion(version: Saved, label: string) {
    if (!draft) return;
    if (changed.length && !confirm("Replace your unsaved changes with this version?")) return;
    setDraft(toDraft({ ...draft, ...version }));
    setStatus({ text: `Loaded the version from ${label}. Check it, then save to publish it.` });
  }

  const section = sections.find((s) => s.id === active);
  const navButton = (id: string, title: string, count = 0) => (
    <button
      key={id}
      type="button"
      onClick={() => {
        setActive(id);
        window.scrollTo({ top: 0 });
      }}
      aria-current={active === id ? "page" : undefined}
      className={`flex shrink-0 items-center justify-between gap-2 rounded-xl px-3 py-2 text-left font-display text-[15px] font-semibold tracking-tight transition-colors ${
        active === id ? "bg-ink text-paper" : "hover:bg-paper"
      }`}
    >
      {title}
      {count > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-red-600 px-1.5 text-xs text-paper">{count}</span>}
    </button>
  );

  return (
    <EditorContext.Provider
      value={{
        draft,
        update: (change) => {
          setDraft((d) => (d ? change(d) : d));
          setStatus({ text: "" });
        },
        errors,
      }}
    >
      <div className="min-h-dvh bg-fog pb-28">
        <header className="sticky top-0 z-30 border-b-2 border-ink bg-violet text-paper">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
            <p className="font-display text-lg font-bold tracking-tight">
              {draft.tr.club.name} <span className="font-medium text-paper/70">· admin</span>
            </p>
            <div className="ml-auto flex items-center gap-3 text-sm">
              <span className="hidden text-paper/75 sm:inline">{session.user.email}</span>
              <a href="/" target="_blank" rel="noreferrer" className="font-semibold underline decoration-lime decoration-2 underline-offset-4">
                View site
              </a>
              <button type="button" onClick={() => supabase!.auth.signOut()} className="font-semibold hover:text-lime">
                Sign out
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 md:grid-cols-[13rem_minmax(0,1fr)]">
          <nav aria-label="Sections" className="-mx-4 flex min-w-0 gap-1 overflow-x-auto px-4 md:sticky md:top-20 md:mx-0 md:flex-col md:self-start md:overflow-visible md:px-0">
            {sections.map((s) => navButton(s.id, s.title, errorCounts.get(s.id)))}
            <hr className="my-2 hidden border-ink/15 md:block" />
            {navButton("history", "History")}
          </nav>
          <main className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-6">{section ? <section.Form key={section.id} /> : <History onLoad={loadVersion} />}</main>
        </div>

        <footer className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink bg-paper">
          {showErrors && errors.size > 0 && (
            <ul className="mx-auto grid max-h-48 max-w-7xl gap-1 overflow-y-auto px-4 pt-3 text-sm">
              {[...errors].map(([key, message]) => {
                const [scope, path] = key.split(":") as [Scope, string];
                return (
                  <li key={key}>
                    <button type="button" onClick={() => setActive(sectionOf(scope, path.split(".")[0]))} className="text-left hover:underline">
                      <span className="font-semibold">
                        {partNames[scope]} · {path.replaceAll(".", " › ")}
                      </span>
                      : <span className="text-red-700">{message}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
            <p className={`min-w-0 flex-1 text-sm ${status.error ? "font-medium text-red-700" : "text-ink/70"}`} role="status">
              {status.text ||
                (changed.length ? `Unsaved changes: ${changed.map((s) => partNames[s]).join(", ")}` : "All changes saved.")}
            </p>
            {errors.size > 0 && (
              <button type="button" onClick={() => setShowErrors((v) => !v)} className="text-sm font-semibold text-red-700 hover:underline">
                {errors.size} {errors.size === 1 ? "problem" : "problems"}
              </button>
            )}
            <a
              href={previewUrl((section ?? sections[0]).preview(draft))}
              target="site-preview"
              className="btn btn-paper min-h-10 px-4 text-sm"
              title="Opens the site with your unsaved changes in another tab; it updates as you edit."
            >
              Preview
            </a>
            <button
              type="button"
              disabled={!changed.length || saving}
              onClick={() => {
                if (!confirm("Discard all unsaved changes?")) return;
                setDraft(baseline.draft);
                setStatus({ text: "" });
              }}
              className="btn btn-paper min-h-10 px-4 text-sm"
            >
              Discard
            </button>
            <button type="button" disabled={!changed.length || saving} onClick={save} className="btn btn-lime min-h-10 px-5 text-sm">
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </footer>
      </div>
    </EditorContext.Provider>
  );
}
