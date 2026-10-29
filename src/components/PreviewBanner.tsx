import { exitPreview } from "../content/load";

/** Marks a page showing the admin panel's unsaved draft (see `inPreview` in load.ts). Admin-facing, so English. */
export function PreviewBanner({ problems }: { problems: number }) {
  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex max-w-[calc(100vw-7.5rem)] flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border-2 border-ink bg-lime px-4 py-2 text-sm text-ink shadow-[var(--shadow-brut-sm)] sm:left-6"
    >
      <span className="font-display font-bold tracking-tight">Preview: unsaved changes</span>
      {problems > 0 && (
        <span className="font-medium">
          {problems} {problems === 1 ? "problem" : "problems"} in the panel: those parts show the default text
        </span>
      )}
      <button type="button" onClick={exitPreview} className="font-semibold underline underline-offset-2 hover:no-underline">
        Exit preview
      </button>
    </div>
  );
}
