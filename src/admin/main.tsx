import type { Session } from "@supabase/supabase-js";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import { clearPreview } from "../content/load";
import "../index.css";
import type { Access } from "./access";
import { Loading, NoAccess, NotConfigured, SetPassword, SignIn } from "./Auth";
import { Editor } from "./Editor";
import { arrivedVia, supabase } from "./supabase";

/** Sign-in → (new password after an invite or reset link) → admin check → editor. */
function Admin() {
  const [session, setSession] = useState<Session | null>();
  const [needsPassword, setNeedsPassword] = useState(arrivedVia === "invite" || arrivedVia === "recovery");
  /** What this admin may do; null: signed in but not an admin; undefined: still checking. */
  const [access, setAccess] = useState<Access | null>();
  const userId = session?.user.id;

  useEffect(() => {
    supabase!.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase!.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "PASSWORD_RECOVERY") setNeedsPassword(true);
      // Leaves no unsaved draft behind for whoever uses this browser next (see `inPreview`).
      if (event === "SIGNED_OUT") clearPreview();
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setAccess(undefined);
    if (!userId) return;
    // select("*"): before 0008_admin_roles.sql there are no roles yet, and every admin may do everything.
    supabase!
      .from("admins")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data, error }) => setAccess(!error && data ? { full: data.full_access ?? true, areas: data.areas ?? [] } : null));
  }, [userId]);

  if (session === undefined) return <Loading />;
  if (!session) return <SignIn />;
  if (needsPassword) return <SetPassword onDone={() => setNeedsPassword(false)} />;
  if (access === undefined) return <Loading />;
  if (!access) return <NoAccess email={session.user.email} />;
  return <Editor session={session} access={access} />;
}

createRoot(document.getElementById("root")!).render(<StrictMode>{supabase ? <Admin /> : <NotConfigured />}</StrictMode>);
