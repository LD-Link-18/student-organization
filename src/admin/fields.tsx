import { createContext, useContext, useId, useState, type ReactNode } from "react";
import { errorKey, getAt, setAt, type Draft, type Errors, type Path, type Scope } from "./draft";

/**
 * Form controls bound to the draft by path. "Bi" controls edit a field in both languages side by side;
 * the others edit one value, either language-independent data (`scope="site"`) or a field that must
 * be the same in both languages, like a project's slug (`scope="both"`, written to TR and EN).
 */

interface Editor {
  draft: Draft;
  update: (change: (draft: Draft) => Draft) => void;
  errors: Errors;
}

export const EditorContext = createContext<Editor | null>(null);

function useEditor() {
  const editor = useContext(EditorContext);
  if (!editor) throw new Error("Field used outside <EditorContext>");
  return editor;
}

type Single = "both" | "site";
const targets = (scope: Single): Scope[] => (scope === "both" ? ["tr", "en"] : ["site"]);

/** One value read from the first target and written to all of them (for custom controls). */
export function useField<T>(scope: Single, path: Path) {
  const { draft, update, errors } = useEditor();
  const [first] = targets(scope);
  return {
    value: getAt(draft[first], path) as T,
    set: (v: T) => update((d) => targets(scope).reduce((acc, s) => setAt(acc, [s, ...path], v), d)),
    error: targets(scope)
      .map((s) => errors.get(errorKey(s, path)))
      .find(Boolean),
  };
}

const LANGS = [
  { scope: "tr", label: "TR" },
  { scope: "en", label: "EN" },
] as const;

export const inputClass = (error?: string) =>
  `w-full rounded-xl border-2 bg-paper px-3 py-2 text-[15px] leading-snug outline-none transition-colors focus:border-violet ${
    error ? "border-red-600" : "border-ink/15 hover:border-ink/30"
  }`;

export function ErrorText({ error }: { error?: string }) {
  return error ? <p className="mt-1 text-sm font-medium text-red-700">{error}</p> : null;
}

export function Label({ htmlFor, label, hint }: { htmlFor?: string; label: string; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="font-display text-[15px] font-semibold tracking-tight">
        {label}
      </label>
      {hint && <p className="text-sm text-ink/60">{hint}</p>}
    </div>
  );
}

export function LangTag({ label }: { label: string }) {
  return <span className="mr-2 rounded-md bg-ink px-1.5 py-0.5 font-display text-[11px] font-bold text-paper">{label}</span>;
}

export function TextInput({
  id,
  value,
  onChange,
  multiline,
  error,
  placeholder,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  error?: string;
  placeholder?: string;
}) {
  return multiline ? (
    <textarea
      id={id}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={Math.min(10, Math.max(3, Math.ceil(value.length / 70)))}
      className={`${inputClass(error)} resize-y`}
    />
  ) : (
    <input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputClass(error)} />
  );
}

interface TextProps {
  path: Path;
  label: string;
  hint?: string;
  multiline?: boolean;
  /** Empty input removes the field instead of saving "" (for optional fields like `role`). */
  optional?: boolean;
  placeholder?: string;
}

/** The same field in Turkish and English, side by side. */
export function BiText({ path, label, hint, multiline, optional, placeholder }: TextProps) {
  const { draft, update, errors } = useEditor();
  const id = useId();
  return (
    <div>
      <Label htmlFor={`${id}-tr`} label={label} hint={hint} />
      <div className="grid gap-2 md:grid-cols-2 md:gap-3">
        {LANGS.map(({ scope, label: lang }) => {
          const error = errors.get(errorKey(scope, path));
          return (
            <div key={scope} className="flex items-start">
              <span className="pt-2.5">
                <LangTag label={lang} />
              </span>
              <div className="min-w-0 flex-1">
                <TextInput
                  id={`${id}-${scope}`}
                  value={(getAt(draft[scope], path) as string | undefined) ?? ""}
                  onChange={(v) => update((d) => setAt(d, [scope, ...path], optional && v === "" ? undefined : v))}
                  multiline={multiline}
                  error={error}
                  placeholder={placeholder}
                />
                <ErrorText error={error} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** One text value: language-independent (`scope="site"`) or kept identical in both languages (`"both"`). */
export function Text({ scope, path, label, hint, multiline, optional, placeholder }: TextProps & { scope: Single }) {
  const { value, set, error } = useField<string | undefined>(scope, path);
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} label={label} hint={hint} />
      <TextInput
        id={id}
        value={value ?? ""}
        onChange={(v) => set(optional && v === "" ? undefined : v)}
        multiline={multiline}
        error={error}
        placeholder={placeholder}
      />
      <ErrorText error={error} />
    </div>
  );
}

export function Select<T extends string | number>({
  scope,
  path,
  label,
  hint,
  options,
}: {
  scope: Single;
  path: Path;
  label: string;
  hint?: string;
  options: readonly { value: T; label: string }[];
}) {
  const { value, set, error } = useField<T>(scope, path);
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} label={label} hint={hint} />
      <select
        id={id}
        value={options.findIndex((o) => o.value === value)}
        onChange={(e) => set(options[Number(e.target.value)].value)}
        className={inputClass(error)}
      >
        {options.map((o, i) => (
          <option key={String(o.value)} value={i}>
            {o.label}
          </option>
        ))}
      </select>
      <ErrorText error={error} />
    </div>
  );
}

export function Toggle({ scope, path, label, hint }: { scope: Single; path: Path; label: string; hint?: string }) {
  const { value, set } = useField<boolean | undefined>(scope, path);
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" checked={!!value} onChange={(e) => set(e.target.checked)} className="mt-1 size-5 accent-violet" />
      <span>
        <span className="font-display text-[15px] font-semibold tracking-tight">{label}</span>
        {hint && <span className="block text-sm text-ink/60">{hint}</span>}
      </span>
    </label>
  );
}

export function BiNumber({ path, label, hint, step = 0.05 }: { path: Path; label: string; hint?: string; step?: number }) {
  const { draft, update, errors } = useEditor();
  return (
    <div>
      <Label label={label} hint={hint} />
      <div className="grid gap-2 md:grid-cols-2 md:gap-3">
        {LANGS.map(({ scope, label: lang }) => {
          const error = errors.get(errorKey(scope, path));
          return (
            <div key={scope} className="flex items-start">
              <span className="pt-2.5">
                <LangTag label={lang} />
              </span>
              <div className="min-w-0 flex-1">
                <input
                  type="number"
                  step={step}
                  aria-label={`${label} (${lang})`}
                  value={getAt(draft[scope], path) as number}
                  onChange={(e) => update((d) => setAt(d, [scope, ...path], e.target.valueAsNumber))}
                  className={inputClass(error)}
                />
                <ErrorText error={error} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const iconButton =
  "grid size-8 place-items-center rounded-lg border-2 border-ink/15 bg-paper text-sm font-bold hover:border-ink disabled:opacity-30 disabled:hover:border-ink/15";

/** A list of short texts per language (tools, tech stack, perks …); the two languages may differ in length. */
export function BiStrings({ path, label, hint }: { path: Path; label: string; hint?: string }) {
  const { draft, update, errors } = useEditor();
  return (
    <div>
      <Label label={label} hint={hint} />
      <div className="grid gap-3 md:grid-cols-2">
        {LANGS.map(({ scope, label: lang }) => {
          const list = (getAt(draft[scope], path) as string[] | undefined) ?? [];
          const setList = (next: string[]) => update((d) => setAt(d, [scope, ...path], next));
          return (
            <div key={scope} className="rounded-xl border-2 border-dashed border-ink/15 p-2.5">
              <LangTag label={lang} />
              <ul className="mt-2 grid gap-1.5">
                {list.map((item, i) => {
                  const error = errors.get(errorKey(scope, [...path, i]));
                  return (
                    <li key={i}>
                      <div className="flex gap-1.5">
                        <input
                          aria-label={`${label} ${i + 1} (${lang})`}
                          value={item}
                          onChange={(e) => setList(list.map((x, j) => (j === i ? e.target.value : x)))}
                          className={inputClass(error)}
                        />
                        <button
                          type="button"
                          className={iconButton + " mt-1 shrink-0"}
                          aria-label={`Remove ${item || "item"}`}
                          onClick={() => setList(list.filter((_, j) => j !== i))}
                        >
                          ✕
                        </button>
                      </div>
                      <ErrorText error={error} />
                    </li>
                  );
                })}
              </ul>
              <button type="button" onClick={() => setList([...list, ""])} className="mt-2 text-sm font-semibold text-violet hover:underline">
                + Add
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * A list whose items exist in both languages (projects, events, team …): adding, removing and moving an
 * item does it in TR and EN at once, so item 3 is always the same thing in both. With `scope="site"` it's a
 * plain language-independent list (sponsors). `fixed` lists can be edited but not grown or shrunk.
 */
export function List({
  scope = "both",
  path,
  label,
  hint,
  itemTitle,
  newItem,
  fixed,
  collapsed,
  addLabel = "Add",
  children,
}: {
  scope?: Single;
  path: Path;
  label: string;
  hint?: string;
  /** Heading of item `i` (e.g. the project name). */
  itemTitle: (i: number) => string;
  /** A fresh item for the given language (or "site"). */
  newItem?: (scope: Scope) => unknown;
  fixed?: boolean;
  /** Items start folded (long items like projects). */
  collapsed?: boolean;
  addLabel?: string;
  children: (i: number) => ReactNode;
}) {
  const { draft, update, errors } = useEditor();
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const list = (getAt(draft[targets(scope)[0]], path) as unknown[] | undefined) ?? [];
  const change = (edit: (items: unknown[], s: Scope) => unknown[]) =>
    update((d) => targets(scope).reduce((acc, s) => setAt(acc, [s, ...path], edit([...((getAt(acc[s], path) as unknown[]) ?? [])], s)), d));
  const move = (i: number, by: number) => {
    change((items) => {
      [items[i], items[i + by]] = [items[i + by], items[i]];
      return items;
    });
    setOpen(new Set());
  };
  const listError = targets(scope)
    .map((s) => errors.get(errorKey(s, path)))
    .find(Boolean);
  const hasErrorsIn = (i: number) => [...errors.keys()].some((k) => targets(scope).some((s) => k.startsWith(errorKey(s, [...path, i]) + ".") || k === errorKey(s, [...path, i])));

  return (
    <div>
      <Label label={label} hint={hint} />
      <ErrorText error={listError} />
      <ol className="grid gap-3">
        {list.map((_, i) => {
          const itemError = targets(scope)
            .map((s) => errors.get(errorKey(s, [...path, i])))
            .find(Boolean);
          const isOpen = !collapsed || open.has(i) || hasErrorsIn(i);
          return (
            <li key={i} className={`rounded-2xl border-2 bg-paper ${hasErrorsIn(i) ? "border-red-600" : "border-ink/15"}`}>
              <div className={`flex items-center gap-2 px-3 py-2 ${isOpen ? "border-b-2 border-ink/10" : ""}`}>
                <button
                  type="button"
                  disabled={!collapsed}
                  onClick={() => setOpen((s) => new Set(s.has(i) ? [...s].filter((x) => x !== i) : [...s, i]))}
                  aria-expanded={collapsed ? isOpen : undefined}
                  className="group/item -my-1 -ml-1.5 flex min-w-0 flex-1 items-center gap-2 rounded-xl py-1 pl-1.5 text-left enabled:hover:bg-fog disabled:cursor-default"
                >
                  {collapsed && (
                    <span
                      aria-hidden="true"
                      className={`grid size-7 shrink-0 place-items-center rounded-lg bg-ink text-xs text-paper transition-transform ${isOpen ? "rotate-90" : ""}`}
                    >
                      ▶
                    </span>
                  )}
                  <span className="meta shrink-0 text-ink/50">#{i + 1}</span>
                  <span className="truncate font-display text-[17px] font-semibold tracking-tight">{itemTitle(i) || "Untitled"}</span>
                  {collapsed && (
                    <span className="ml-auto shrink-0 pr-1 text-sm font-semibold text-violet group-hover/item:underline">{isOpen ? "Close" : "Edit"}</span>
                  )}
                </button>
                <button type="button" className={iconButton} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                  ↑
                </button>
                <button type="button" className={iconButton} disabled={i === list.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                  ↓
                </button>
                {!fixed && (
                  <button
                    type="button"
                    className={iconButton + " hover:border-red-600 hover:text-red-700"}
                    aria-label={`Remove ${itemTitle(i) || "item"}`}
                    onClick={() => {
                      if (!confirm(`Remove "${itemTitle(i) || `item ${i + 1}`}"${scope === "both" ? " in both languages" : ""}?`)) return;
                      change((items) => items.filter((__, j) => j !== i));
                      setOpen(new Set());
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
              {isOpen && (
                <div className="grid gap-4 p-3 md:p-4">
                  <ErrorText error={itemError} />
                  {children(i)}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {!fixed && newItem && (
        <button
          type="button"
          onClick={() => {
            change((items, s) => [...items, newItem(s)]);
            if (collapsed) setOpen((s) => new Set([...s, list.length]));
          }}
          className="btn btn-paper mt-3 min-h-10 px-4 text-sm"
        >
          + {addLabel}
        </button>
      )}
    </div>
  );
}

/** A titled box of related fields. */
export function Group({ title, hint, children }: { title: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-3xl border-2 border-ink bg-paper p-4 shadow-[var(--shadow-brut-sm)] md:p-6">
      <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
      {hint && <p className="mt-1 text-sm text-ink/65">{hint}</p>}
      <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-5">{children}</div>
    </section>
  );
}

/** Divides a long item form into parts (e.g. a project's card and its page). */
export function Subhead({ hint, children }: { hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="-mx-3 mt-2 border-t-2 border-ink/10 px-3 pt-4 first:mt-0 first:border-t-0 first:pt-0 md:-mx-4 md:px-4">
      <h3 className="font-display text-lg font-bold tracking-tight text-violet">{children}</h3>
      {hint && <p className="text-sm text-ink/65">{hint}</p>}
    </div>
  );
}

/** Read the draft in a section (e.g. for item titles). */
export const useDraft = () => useEditor().draft;
