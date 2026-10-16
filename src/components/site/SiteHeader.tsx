"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown";

import { CtaLink } from "@/components/ui/CtaLink";

/**
 * Cabeçalho da Hero.
 *
 * A entrada é CSS (`.header-enter`, ver `globals.css`), não Motion. O motivo
 * está documentado lá: o Firefox e o Chrome discordam quando uma biblioteca de
 * animação remove o `transform` no fim, e o logo ficava ~1px acima no Firefox.
 * Com `animation-fill-mode: both` o estado final nunca é removido, então não há
 * arredondamento divergente. O Motion continua aqui só para o `useScroll` que
 * condensa o header ao rolar.
 *
 * A cascata é uma lista de atrasos, não `staggerChildren` — é o mesmo escalonamento
 * que o Motion produzia, escrito na mão para ficar explícito:
 *   linha 0.07 · nav 0.05 · CTAs 0.06 · atrasos iniciais 0.12 / 0.04 / 0.05
 */
const ENTER = {
  logo: "0.12s",
  nav: ["0.23s", "0.28s", "0.33s", "0.38s"],
  ctaOutline: "0.31s",
  ctaSolid: "0.37s",
} as const;

/** Aplica o atraso da entrada sem repetir a lista de classes. */
const enter = (delay: string): CSSProperties => ({
  "--header-enter-delay": delay,
} as CSSProperties);

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
    <header
      data-condensed={condensed || undefined}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ease-out
        group
        data-[condensed]:border-b data-[condensed]:border-nu-neutral-200 data-[condensed]:bg-white/85 data-[condensed]:shadow-sm data-[condensed]:backdrop-blur-xl
        ${tone}`}
    >
      <div className="flex h-16 w-full items-center justify-between px-5 md:h-20 md:px-10 lg:h-25 lg:px-[200px] 2xl:px-[clamp(200px,10.4vw,320px)]">
        <div className="flex items-center gap-8 md:gap-12">
          {/*
            `shrink-0` fica aqui, no wrapper, e não no `<a>`.

            O flex item da linha é este `<span>`; o `<a>` é um filho dele e não
            encolhe por conta própria. Com o `shrink-0` só no `<a>`, era o span
            que encolhia — e quando a linha aperta ele chega a largura zero e o
            logo desaparece.

            O `transition-opacity` do hover fica no `<a>`, separado do elemento
            animado. No Motion os dois brigavam: cada escrita de `opacity` por
            quadro disparava a transition de 150ms do CSS, e o valor renderizado
            ficava sempre atrás. Separados, cada um no seu elemento.
          */}
          <span className="header-enter shrink-0" style={enter(ENTER.logo)}>
            <a
              href="#conteudo"
              className="rounded-sm transition-opacity hover:opacity-75 lg:translate-y-[0.5px]"
              aria-label="Ir para o início da página — Nubank"
            >
              {/*
                Logo em PNG, nas duas cores em que ela aparece. O header passa
                de transparente (logo clara, #f3e8ff) para sólido ao rolar
                (logo escura, #1c1c1e), e um arquivo só não teria as duas.

                As duas imagens ficam no DOM e o CSS troca a visibilidade com
                `group-data-[condensed]`: a virada é instantânea e usa o mesmo
                mecanismo das outras trocas de cor do header. Trocar o `src` no
                scroll piscaria enquanto o novo arquivo decodifica.

                `alt` vazio: o link tem `aria-label`, então a imagem é decorativa
                e o nome acessível não depende dela. Por isso o antigo
                `sr-only` com "Nubank" foi removido — o `aria-label` sempre
                teve precedência sobre ele, então ele nunca era anunciado.

                `priority`: o logo está acima da dobra, e com `loading="lazy"`
                padrão ele podia terminar de decodificar bem depois da animação
                de entrada — mais um repaint no meio do efeito.

                `unoptimized` como nos cards: são 5 KB, e passar pelo otimizador
                só adicionaria uma requisição a `/_next/image` para re-encodar um
                PNG que já é minúsculo.

                `lg:translate-y-[0.5px]`: no `lg` a caixa do logo tem 35px
                (ímpar) e é centralizada numa linha de 40px, então desce em
                32.5px — meio pixel. Descansar em pixel inteiro evita divergência
                de arredondamento entre os motores. Só no `lg`: em `base` e `md`
                as caixas são pares e o centro já cai em pixel inteiro (21 e 26).
              */}
              <Image
                src="/images/brand/nu-logo-light.png"
                alt=""
                width={64}
                height={35}
                priority
                unoptimized
                className="block h-[22px] w-10 md:h-[28px] md:w-[52px] lg:h-[35px] lg:w-16
                  group-data-[condensed]:hidden"
              />
              <Image
                src="/images/brand/nu-logo-dark.png"
                alt=""
                width={64}
                height={35}
                priority
                unoptimized
                className="hidden h-[22px] w-10 md:h-[28px] md:w-[52px] lg:h-[35px] lg:w-16
                  group-data-[condensed]:block"
              />
            </a>
          </span>

          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center">
              {NAV_ITEMS.map((item, i) => (
                <li key={item} className="header-enter" style={enter(ENTER.nav[i])}>
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
          <span className="header-enter" style={enter(ENTER.ctaOutline)}>
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
          </span>

          {/* Mesmo desvio no CTA sólido: ao condensar, fundo na cor da marca
              e texto branco. Branco sobre #820ad1 dá 7,2:1. Sobre o
              gradiente o botão continua claro — brand ali não passaria de AA. */}
          <span className="header-enter" style={enter(ENTER.ctaSolid)}>
            <CtaLink
              variant="solid"
              href="https://www.nubank.com.br/"
              className="group-data-[condensed]:bg-nu-brand group-data-[condensed]:text-white group-data-[condensed]:hover:bg-nu-purple-800 group-data-[condensed]:active:bg-nu-purple-950"
            >
              Quero ser Nubank
            </CtaLink>
          </span>
        </div>
      </div>
    </header>
  );
}