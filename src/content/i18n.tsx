import { createContext, useContext, type ReactNode } from "react";
import { comingSoonPath, type LinkSource } from "./site";
import { en } from "./en";
import { tr } from "./tr";
import type { Content, Locale } from "./types";

const dictionaries: Record<Locale, Content> = { tr, en };

/** The page's language comes from <html lang>, set by each HTML entry (index.html = tr, en/index.html = en). */
export function detectLocale(): Locale {
  return document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "tr";
}

const ContentContext = createContext<Content>(tr);

export function ContentProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <ContentContext.Provider value={dictionaries[locale]}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext);

/** Returns the real href, or this language's coming-soon page (tagged with the source) when the link isn't set up yet. */
export function useResolveLink() {
  const { locale } = useContent();
  return (href: string, source: LinkSource) => href || `${comingSoonPath[locale]}?l=${source}`;
}

export const isExternal = (href: string) => /^https?:\/\//.test(href);
