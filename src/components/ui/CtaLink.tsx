import type { AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "solid" | "outline" | "ghost";

const VARIANTS: Record<Variant, string> = {
  // Action/action-secondary sobre Action/action-secondary-text
  solid:
    "bg-nu-action-surface text-nu-brand hover:bg-white active:bg-nu-neutral-100",
  // contorno em Action/action-secondary, texto Action/action-secondary
  outline:
    "border border-nu-action-surface text-nu-action-surface hover:bg-nu-action-surface hover:text-nu-brand",
  // apenas texto, com seta opcional
  ghost: "text-nu-action-surface hover:text-white",
};

const BASE =
  "inline-flex items-center justify-center gap-2.5 rounded-full px-[18px] py-2.5 " +
  // `leading-normal` do Tailwind vale 1.5 e deixaria o botão com 44px.
  // O Figma usa a altura natural do Montserrat (≈1.22), gerando 40px.
  "font-display text-base leading-[1.25] whitespace-nowrap " +
  "transition-colors duration-200 ease-out";

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type CtaLinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

/** Link externo de CTA — abre em nova aba com rel seguro. */
export function CtaLink({
  variant = "solid",
  className = "",
  children,
  href,
  ...rest
}: CtaLinkProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}