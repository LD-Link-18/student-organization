import type { Session } from "@supabase/supabase-js";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "../index.css";
import { Loading, NoAccess, NotConfigured, SetPassword, SignIn } from "./Auth";
import { Editor } from "./Editor";
import { arrivedVia, supabase } from "./supabase";

/** Sign-in → (new password after an invite or reset link) → admin check → editor. */
function Admin() {
  const [session, setSession] = useState<Session | null>();
  const [needsPassword, setNeedsPassword] = useState(arrivedVia === "invite" || arrivedVia === "recovery");
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const userId = session?.user.id;

  useEffect(() => {
    supabase!.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase!.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "PASSWORD_RECOVERY") setNeedsPassword(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setIsAdmin(undefined);
    if (!userId) return;
    supabase!
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data, error }) => setIsAdmin(!error && !!data));
  }, [userId]);

  if (session === undefined) return <Loading />;
  if (!session) return <SignIn />;
  if (needsPassword) return <SetPassword onDone={() => setNeedsPassword(false)} />;
  if (isAdmin === undefined) return <Loading />;
  if (!isAdmin) return <NoAccess email={session.user.email} />;
  return <Editor session={session} />;
}

createRoot(document.getElementById("root")!).render(<StrictMode>{supabase ? <Admin /> : <NotConfigured />}</StrictMode>);
