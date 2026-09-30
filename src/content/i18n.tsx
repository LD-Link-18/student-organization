import { createContext, useContext, type ReactNode } from "react";
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
