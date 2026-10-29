/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL (Project Settings → API), e.g. https://abcd.supabase.co. Unset = no admin edits. */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase publishable (or legacy anon) key. Public by design: row-level security guards writes. */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  /** Dev server only: the live site's origin, so saved links to it can point at the dev server. */
  readonly DEV_PRODUCTION_ORIGIN?: string;
}
