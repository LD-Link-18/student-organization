import { createClient } from "@supabase/supabase-js";

/**
 * How the visitor got here, read before supabase-js consumes the URL: "invite" (first sign-in from an
 * invitation email) and "recovery" (password reset link) both ask for a new password first.
 */
export const arrivedVia = new URLSearchParams(window.location.hash.slice(1)).get("type");

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/** Null until VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set (see README). */
export const supabase = url && key ? createClient(url, key) : null;

export const ASSET_BUCKET = "site-assets";
