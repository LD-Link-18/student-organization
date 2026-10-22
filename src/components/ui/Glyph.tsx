/** Four-point spark used as a separator in marquees and badges. */
export function Spark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="currentColor" d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}

/** Small scribble — the club's "loop" mark. */
export function Loop({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 30c6-14 22-22 28-14 5 7-6 18-12 11-5-6 4-17 20-17"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Camera outline in Instagram's shape, drawn in the site's stroke style. */
export function InstagramGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="currentColor" strokeWidth="2.25" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2.25" />
      <circle cx="17.3" cy="6.7" r="1.35" fill="currentColor" />
    </svg>
  );
}

/** Speech bubble with a handset, WhatsApp's shape in the site's stroke style. */
export function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinejoin="round"
      />
      <path
        fill="currentColor"
        d="M8.6 7.6c.3-.3.8-.3 1 .1l.9 1.7c.2.4.1.8-.2 1.1l-.5.5a6 6 0 0 0 3.2 3.2l.5-.5c.3-.3.7-.4 1.1-.2l1.7.9c.4.2.4.7.1 1l-.8.8c-.6.6-1.5.7-2.3.4a9.4 9.4 0 0 1-5-5c-.3-.8-.2-1.7.4-2.3l.8-.8Z"
      />
    </svg>
  );
}
