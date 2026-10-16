"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown";

import { CtaLink } from "@/components/ui/CtaLink";
import { revealFromTop, staggerContainer } from "@/lib/motion";

/**
 * Cabeçalho da Hero.
 *
 * `initial={false}` no `<motion.header>` é deliberado: sem ele, trocar
 * `data-condensed` ao rolar re-dispararia a animação de entrada do header
 * inteiro. O reveal acontece no container interno, que só anima na montagem.
 */

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
      <motion.div
        className="flex h-16 w-full items-center justify-between px-5 md:h-20 md:px-10 lg:h-25 lg:px-[200px] 2xl:px-[clamp(200px,10.4vw,320px)]"
        variants={staggerContainer(0.07, 0.12)}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-8 md:gap-12">
          <motion.a
            href="#conteudo"
            className="shrink-0 rounded-sm transition-opacity hover:opacity-75"
            aria-label="Ir para o início da página"
            variants={revealFromTop}
          >
            {/*
              Logo em PNG, nas duas cores em que ela aparece. O header passa
              de transparente (logo clara, #f3e8ff) para sólido ao rolar (logo
              escura, #1c1c1e), e um arquivo só não teria as duas — era isso que
              o SVG resolvia via `mask-image` + `currentColor`, ou seja via
              rasterização de máscara dentro de um ancestral animado.

              Em vez de trocar o `src` no scroll, que piscaria enquanto o novo
              arquivo decodifica, os dois ficam no DOM e o CSS troca a
              visibilidade com `group-data-[condensed]`: a virada é instantânea e
              usa o mesmo mecanismo das outras trocas de cor do header.

              `alt` vazio: o link já tem `aria-label` e há um `sr-only` com o
              nome da marca logo abaixo — a imagem é decorativa.

              `unoptimized` como nos cards: são 5 KB, e passar pelo otimizador
              só adicionaria uma requisição a `/_next/image` para re-encodar um
              PNG que já é minúsculo.
            */}
            <Image
              src="/images/brand/nu-logo-light.png"
              alt=""
              width={64}
              height={35}
              unoptimized
              className="block h-[22px] w-10 md:h-[28px] md:w-[52px] lg:h-[35px] lg:w-16
                group-data-[condensed]:hidden"
            />
            <Image
              src="/images/brand/nu-logo-dark.png"
              alt=""
              width={64}
              height={35}
              unoptimized
              className="hidden h-[22px] w-10 md:h-[28px] md:w-[52px] lg:h-[35px] lg:w-16
                group-data-[condensed]:block"
            />
            <span className="sr-only">Nubank</span>
          </motion.a>

          {/*
            Container próprio para os itens da nav: o escalonamento desce por
            ramo da árvore, e os `<li>` estão dois níveis abaixo da linha. Sem
            este container os quatro itens entram juntos, atrás do logo.
          */}
          <motion.nav
            aria-label="Navegação principal"
            className="hidden lg:block"
            variants={staggerContainer(0.05, 0.04)}
          >
            <ul className="flex items-center">
              {NAV_ITEMS.map((item) => (
                <motion.li key={item} variants={revealFromTop}>
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
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        </div>

        {/* Container próprio pelo mesmo motivo da nav: sem ele os dois CTAs
            entram no mesmo instante, sem escalonamento entre eles. */}
        <motion.div className="flex items-center gap-3" variants={staggerContainer(0.06, 0.05)}>
          {/* No mobile fica só o CTA principal: o menu completo depende dos
              painéis que ainda não existem no design. */}
          <motion.span variants={revealFromTop}>
            <CtaLink
              variant="outline"
              href="https://www.nubank.com.br/"
              /*
               * `max-sm:hidden` e não `hidden sm:inline-flex`: o `inline-flex`
               * da base do CtaLink é um utilitário de display sem variante e,
               * no Tailwind, utilitários base vencem utilitários base. Usando
               * uma variante, ela é emitida depois e o `hidden` passa a valer.
               *
               * Ao condensar, contorno e texto vão para a cor da marca. O Figma
               * mantém `Action/action-secondary` (#f3e8ff) nos dois estados —
               * sobre o gradiente roxo quase não se distingue, mas sobre o branco
               * do header condensado some. Brand sobre branco dá 7,2:1 (AA pede
               * 4,5:1). Desvio consciente: ver CONTEXTO.md > Decisão 13.
               */
              className="max-sm:hidden group-data-[condensed]:border-nu-brand group-data-[condensed]:text-nu-brand group-data-[condensed]:hover:bg-nu-brand group-data-[condensed]:hover:text-white group-data-[condensed]:active:bg-nu-purple-800"
            >
              Login Empresas
            </CtaLink>
          </motion.span>

          {/* Mesmo desvio no CTA sólido: ao condensar, fundo na cor da marca
              e texto branco. Branco sobre #820ad1 dá 7,2:1. Sobre o
              gradiente o botão continua claro — brand ali não passaria de AA. */}
          <motion.span variants={revealFromTop}>
            <CtaLink
              variant="solid"
              href="https://www.nubank.com.br/"
              className="group-data-[condensed]:bg-nu-brand group-data-[condensed]:text-white group-data-[condensed]:hover:bg-nu-purple-800 group-data-[condensed]:active:bg-nu-purple-950"
            >
              Quero ser Nubank
            </CtaLink>
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}