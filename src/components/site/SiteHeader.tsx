"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown";

import { CtaLink } from "@/components/ui/CtaLink";
import { DURATION, EASE_OUT_EXPO } from "@/lib/motion";

/**
 * Itens de navegação da Hero.
 *
 * PROVISÓRIO — no Figma cada item tem um caret (ícone de submenu), mas o
 * arquivo não contém o conteúdo desses menus. Não vamos inventar conteúdo nem
 * esconder botões que "não fazem nada": cada item é um botão real, focável
 * por teclado, com `aria-disabled` e um aviso para leitor de tela. Quando você
 * desenhar os painéis no Figma, basta preencher `NAV_PANELS`.
 */
const NAV_ITEMS = ["Para Você", "Para seu negócio", "Segurança", "Saiba Mais"];

const icon = (src: string): CSSProperties => ({
  ["--nu-icon-src" as string]: `url(${src})`,
});

export function SiteHeader() {
  const [condensed, setCondensed] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setCondensed(y > 40));

  // Sobre a Hero o header é transparente e o texto é branco (como no Figma);
  // ao rolar, ganha fundo e a cor do texto inverte para acompanhar o branco.
  const tone = condensed ? "text-nu-neutral-800" : "text-nu-action-surface";

  return (
    <motion.header
      data-condensed={condensed || undefined}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ease-out
        group
        data-[condensed]:border-b data-[condensed]:border-nu-neutral-200 data-[condensed]:bg-white/85 data-[condensed]:shadow-sm data-[condensed]:backdrop-blur-xl
        ${tone}`}
      initial={false}
    >
      <div className="flex h-16 w-full items-center justify-between px-5 md:h-20 md:px-10 lg:h-25 lg:px-[200px] 2xl:px-[clamp(200px,10.4vw,320px)]">
        <div className="flex items-center gap-8 md:gap-12">
          <a
            href="#conteudo"
            className="shrink-0 rounded-sm transition-opacity hover:opacity-75"
            aria-label="Ir para o início da página"
          >
            <span
              className="nu-icon block h-[22px] w-10 md:h-[28px] md:w-[52px] lg:h-[35px] lg:w-16"
              style={icon("/images/brand/nu-logo.svg")}
              aria-hidden="true"
            />
            <span className="sr-only">Nubank</span>
          </a>

          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center">
              {NAV_ITEMS.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    aria-disabled="true"
                    className="flex items-center gap-2.5 rounded-full px-[18px] py-2.5
                      font-display text-base leading-[1.25] transition-opacity hover:opacity-75 aria-disabled:cursor-not-allowed"
                  >
                    {item}
                    <span className="sr-only">— menu ainda não implementado neste estudo</span>
                    <CaretDown size={20} weight="regular" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* No mobile fica só o CTA principal: o menu completo depende dos
              painéis que ainda não existem no design. */}
          <CtaLink
            variant="outline"
            href="https://www.nubank.com.br/"
            /*
             * `max-sm:hidden` e não `hidden sm:inline-flex`: o `inline-flex`
             * da base do CtaLink é um utilitário de display sem variante e,
             * no Tailwind, utilitários base vencem utilitários base. Usando
             * uma variante, ela é emitida depois e o `hidden` passa a valer.
             */
            className="max-sm:hidden group-data-[condensed]:border-nu-neutral-800 group-data-[condensed]:text-nu-neutral-800 group-data-[condensed]:hover:bg-nu-neutral-800 group-data-[condensed]:hover:text-white"
          >
            Login Empresas
          </CtaLink>

          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT_EXPO, delay: 0.12 }}
          >
            <CtaLink variant="solid" href="https://www.nubank.com.br/">
              Quero ser Nubank
            </CtaLink>
          </motion.span>
        </div>
      </div>
    </motion.header>
  );
}