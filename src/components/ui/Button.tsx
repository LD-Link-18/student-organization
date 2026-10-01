import type { AnchorHTMLAttributes, ReactNode } from "react";
import { isExternal, useContent } from "../../content/i18n";

type Variant = "lime" | "violet" | "paper" | "glass";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: "md" | "lg";
  children: ReactNode;
};

/** Link styled as a button. External links open in a new tab and say so to screen readers. */
export function ButtonLink({ variant = "lime", size = "md", className = "", href, children, ...rest }: Props) {
  const t = useContent();
  const external = !!href && isExternal(href);
  return (
    <a
      className={`btn btn-${variant} ${size === "lg" ? "btn-lg" : ""} ${className}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...rest}
    >
      {children}
      {external && <span className="sr-only">{t.common.newTab}</span>}
    </a>
  );
}
