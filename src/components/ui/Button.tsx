import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "lime" | "violet" | "paper" | "glass";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: "md" | "lg";
  children: ReactNode;
};

/** Link styled as a button. Every CTA on the page navigates, so this is always an <a>. */
export function ButtonLink({ variant = "lime", size = "md", className = "", children, ...rest }: Props) {
  return (
    <a className={`btn btn-${variant} ${size === "lg" ? "btn-lg" : ""} ${className}`} {...rest}>
      {children}
    </a>
  );
}
