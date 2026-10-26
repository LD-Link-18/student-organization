import { createContext, useContext, type ReactNode } from "react";
import { defaultContent } from "./load";
import { comingSoonPath, siteDefaults, type LinkSource, type SiteData } from "./site";
import type { Content, Locale } from "./types";

/** The page's language comes from <html lang>, set by each HTML entry (index.html = tr, en/index.html = en). */
export function detectLocale(): Locale {
  return document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "tr";
}

const ContentContext = createContext<Content>(defaultContent.tr);
const SiteContext = createContext<SiteData>(siteDefaults);

/** `content` and `site` come from `resolve()` in load.ts: the defaults plus any edits saved in the admin panel. */
export function ContentProvider({ content, site, children }: { content: Content; site: SiteData; children: ReactNode }) {
  return (
    <SiteContext.Provider value={site}>
      <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
    </SiteContext.Provider>
  );
}

export const useContent = () => useContext(ContentContext);

/** Language-independent club data (links, email, sponsors), see site.ts. */
export const useSite = () => useContext(SiteContext);

/** Returns the real href, or this language's coming-soon page (tagged with the source) when the link isn't set up yet. */
export function useResolveLink() {
  const { locale } = useContent();
  return (href: string, source: LinkSource) => href || `${comingSoonPath[locale]}?l=${source}`;
}

export const isExternal = (href: string) => /^https?:\/\//.test(href);
