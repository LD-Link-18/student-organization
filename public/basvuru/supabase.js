// Supabase project for the public forms: /basvuru/ (table `applications`) and /proje-oner/ (table
// `project_pitches`), the same project as the admin panel. Same values as VITE_SUPABASE_URL and
// VITE_SUPABASE_PUBLISHABLE_KEY in .env.local: these pages aren't built by Vite, so they keep their own copy.
// Public by design: those tables only let visitors add a row, never read one.
const SUPABASE_URL = 'https://lqclknvtjusajmonjqms.supabase.co';
const SUPABASE_KEY = 'sb_publishable_uICMFLWBATSKZxI8yBrK9Q_BXl3jIXp';
