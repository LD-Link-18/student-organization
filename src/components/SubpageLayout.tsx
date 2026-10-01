import type { ReactNode } from "react";
import { useContent } from "../content/i18n";
import type { Locale } from "../content/types";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { useHomeHref } from "./StandalonePage";

/** Pages below the homepage (project pages): the site's own navbar and footer, with links pointing home. */
export function SubpageLayout({ children, hrefFor }: { children: ReactNode; hrefFor?: (code: Locale) => string }) {
  const t = useContent();
  const home = useHomeHref();
  return (
    <div id="top">
      <a href="#main" className="btn btn-lime fixed top-3 left-3 z-[60] -translate-y-24 focus-visible:translate-y-0">
        {t.common.skipToContent}
      </a>
      <Navbar base={home} hrefFor={hrefFor} />
      <main id="main">{children}</main>
      <Footer base={home} />
    </div>
  );
}
