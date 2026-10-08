import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "lime" | "violet" | "paper" | "glass";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: "md" | "lg";
  children: ReactNode;
};

/** Link styled as a button. Opens in the same tab, external or not. */
export function ButtonLink({ variant = "lime", size = "md", className = "", href, children, ...rest }: Props) {
  return (
    <a
      className={`btn btn-${variant} ${size === "lg" ? "btn-lg" : ""} ${className}`}
      href={href}
      {...rest}
    >
      {children}
    </a>
  );
}
