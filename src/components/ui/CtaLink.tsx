import type { AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "solid" | "outline" | "ghost" | "brand";

const VARIANTS: Record<Variant, string> = {
  // Action/action-secondary sobre Action/action-secondary-text
  solid:
    "bg-nu-action-surface text-nu-brand hover:bg-white active:bg-nu-neutral-100",
  // contorno em Action/action-secondary, texto Action/action-secondary
  outline:
    "border border-nu-action-surface text-nu-action-surface hover:bg-nu-action-surface hover:text-nu-brand",
  // apenas texto, com seta opcional.
  // Branco (e não Action/action-secondary) porque #f3e8ff sobre a parte mais
  // clara do gradiente fica em 4,17:1; o branco chega a 4,92:1 e na diferença
  // é imperceptível sobre roxo.
  ghost: "text-white hover:text-nu-action-surface",
  /*
   * Fundo em Action/action-primary (#820ad1), com texto branco — o par exato do
   * "Quero ser Nubank" da header no estado condensado. O CTA "Conheça o Nubank"
   * da Ecossystem usa este, para que os dois sejam indistinguíveis.
   *
   * A cadeia de interação também é a mesma (brand → Purple/800 → Purple/950,
   * escurecendo), e ela não é decorativa: com a variante `solid` o hover iria
   * para branco e o active para Neutral/100, e um texto claro sobre qualquer um
   * dos dois dá menos de 1,2:1 — o texto some.
   *
   * Os valores são os mesmos que a header escreve em `group-data-[condensed]`,
   * e as duas cópias precisam continuar iguais. Não dá para compartilhar a
   * string: o Tailwind só enxerga classes escritas por extenso no fonte, então
   * uma constante montada por concatenação não entraria no CSS gerado.
   *
   * Contraste medido: 7,21:1 no repouso, 9,33:1 no hover, 15,24:1 no active.
   */
  brand:
    "bg-nu-brand text-white hover:bg-nu-purple-800 active:bg-nu-purple-950",
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