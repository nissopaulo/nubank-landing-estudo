"use client";

import Image from "next/image";
import { motion, type TargetAndTransition, type Variants } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";

import { SectionGrain } from "@/components/site/SectionGrain";
import { CtaLink } from "@/components/ui/CtaLink";
import { revealUp } from "@/lib/motion";
import {
  SECURITY_ART_RATIO,
  SECURITY_ART_W,
  SECURITY_CARD_H,
  SECURITY_CARD_W,
  SECURITY_CARDS,
  artePos,
  cardCqw,
  type SecurityCard,
} from "@/lib/security-cards";

/**
 * Security Section — Figma `274:2` (repouso) e `280:77` (hover), 1920×1840,
 * com a spec `288:262` ao lado.
 *
 * ## O que a spec pede, e como cada pedido virou código
 *
 * - **Entrada suave, como as outras seções.** O cabeçalho usa o `revealUp`, e
 *   os cards entram em cascata de 90 ms pela coluna — a mesma coreografia da
 *   Blog e da Cards Section. Cada card tem o próprio `whileInView`: a grade
 *   inteira tem 1384 px de altura, e com um gatilho só a segunda fileira
 *   entraria antes de estar na tela.
 * - **Duas artes por card, trocando suave no hover.** As duas estão no DOM o
 *   tempo todo, empilhadas; o hover faz um *crossfade*. Ver `CardArte`.
 * - **A borda vai para `Border/border-brand`, suave.** `transition` de
 *   `border-color`.
 * - **A seta no canto se comporta como os action buttons.** Ela não é um botão
 *   à parte: o card inteiro é o link, e a seta reage ao hover e ao foco dele,
 *   com a mesma cadeia de cor das setas da Blog (brand → Purple/800 →
 *   Purple/950).
 * - **O CTA ao lado do título** é o `CtaLink` `brand` — o mesmo hover de todo
 *   CTA roxo da página.
 *
 * ## Por que tudo isso é CSS, e não Motion
 *
 * O hover não tem estado: é `group-hover` no card. Sem `useState`, nada do que
 * muda no hover passa pelo React, o HTML do servidor é o mesmo do cliente e não
 * há o que hidratar de diferente. O Motion fica só na entrada por scroll, que é
 * onde as outras seções também o usam.
 *
 * ## Onde o Figma não fala
 *
 * - **Nenhum destino existe**: nem o do CTA, nem o de cada card. Os dois usam
 *   o placeholder de sempre do projeto (`https://www.nubank.com.br/`), e a
 *   spec confirma que por enquanto é só a interação de hover.
 * - **Durações e curvas são autorais** — o arquivo não tem motion. Seguem o
 *   vocabulário de `lib/motion.ts`: 0,7 s com a curva enfática para a arte,
 *   0,35 s para a borda e a seta.
 */

/**
 * As duas artes de um card.
 *
 * ## O *crossfade* é em registro
 *
 * As duas artes do Figma são a mesma composição: o objeto no mesmo lugar, com
 * um detalhe a mais no hover (a luz no cérebro, o envelope aberto, o segundo
 * cartão). Por isso elas **não** se movem uma contra a outra — a de repouso
 * some e a do hover aparece na mesma posição, e o objeto parece se
 * transformar, em vez de ser trocado.
 *
 * O que dá o movimento é a camada que contém as duas: no hover ela cresce 3%,
 * em 0,7 s com a curva enfática. O objeto "chega mais perto" enquanto ganha o
 * detalhe — é o gesto da `BG_SWAP` (a camada que entra assenta de 1,02 para 1),
 * do lado de dentro.
 *
 * A opacidade é mais curta (0,5 s) que a escala de propósito: com a mesma
 * duração, o meio da troca mostra as duas artes a 50%, e é ali que a
 * sobreposição se vê. Terminando antes, a troca já resolveu quando a escala
 * ainda está assentando.
 *
 * ## Cada arte tem a sua posição
 *
 * No Cartão Virtual a arte do hover está 20 px à direita da de repouso; nas
 * outras as duas coincidem. Como cada `<span>` usa a posição da **sua** arte,
 * o deslocamento do Figma vira parte do *crossfade*, sem código à parte.
 *
 * ## Movimento reduzido
 *
 * A escala só existe com `motion-safe`. Quem pede menos movimento vê só a
 * troca de opacidade e a borda — nada se desloca.
 *
 * ## Carregamento
 *
 * As duas artes são `lazy`, e a do hover também: ela está no DOM, com
 * opacidade 0, então o navegador a baixa quando o card se aproxima da tela —
 * e quando o ponteiro chega, ela já está lá, sem piscar.
 */
function CardArte({ card }: { card: SecurityCard }) {
  const camada = (a: SecurityCard["idle"], hover: boolean) => (
    <span
      aria-hidden="true"
      className={`absolute block transition-opacity duration-500 ease-[var(--ease-emphasized)] ${
        hover
          ? "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          : "opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0"
      }`}
      style={{
        ...artePos(a),
        width: cardCqw(SECURITY_ART_W),
        aspectRatio: SECURITY_ART_RATIO,
      }}
    >
      <Image
        src={a.src}
        alt=""
        fill
        /*
         * A arte tem 1080 px a 1920 — 56,25% da tela. Abaixo de 1920 ela
         * continua a mesma fração, porque o card encolhe com a moldura; em uma
         * coluna (abaixo de `md`) o card é a tela inteira e a arte, 2,2 vezes
         * ela.
         */
        sizes="(min-width: 1920px) 1080px, (min-width: 768px) 57vw, 220vw"
        className="select-none object-cover"
        draggable={false}
      />
    </span>
  );

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 block origin-center transition-transform duration-700 ease-[var(--ease-emphasized)] motion-safe:group-hover:scale-[1.03] motion-safe:group-focus-visible:scale-[1.03]"
    >
      {camada(card.idle, false)}
      {camada(card.hover, true)}
    </span>
  );
}

/**
 * Um card — Figma `Card - …` (`283:131` e vizinhos).
 *
 * O `<li>` é o container (`container-type: inline-size`) e o `<a>` é o card:
 * a borda faz parte dele, então `1cqw` é 1% da largura do card **com a
 * borda**, que é o que o Figma mede (490,67).
 *
 * ## O que encolhe e o que não
 *
 * Título, padding, intervalo e seta são `cqw` com `clamp`: no quadro de 1920
 * eles valem exatamente o Figma (32 / 24 / 12 / 42) e não passam disso; abaixo,
 * encolhem com o card até um mínimo legível. A descrição fica em 16 px, a regra
 * de sempre do projeto: é o menor texto legível, e não é fluido.
 *
 * O título não é `nowrap`, ao contrário do Figma: a 1920 ele cabe em uma linha
 * como no desenho, e abaixo de ~1400 "Defesas Inteligentes" e "Central de
 * Proteção" passariam por baixo da seta. Quebrar é melhor que colidir.
 */
/**
 * O `revealUp` com atraso pela coluna.
 *
 * O atraso não pode ir na prop `transition` do card: no Motion a `transition`
 * declarada dentro da variante vence a da prop, e o `revealUp` declara a dele.
 * Por isso a variante é uma função do `custom`.
 */
const cardReveal: Variants = {
  hidden: revealUp.hidden,
  visible: (coluna: number) => {
    const v = revealUp.visible as TargetAndTransition;
    return { ...v, transition: { ...v.transition, delay: coluna * 0.09 } };
  },
};

function SecurityCardItem({
  card,
  coluna,
}: {
  card: SecurityCard;
  coluna: number;
}) {
  return (
    <motion.li
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardReveal}
      custom={coluna}
      /*
       * A cascata é pela coluna, e não pela ordem na lista: cada card tem o
       * próprio gatilho, e os da mesma fileira entram juntos com 90 ms entre
       * um e outro — o `staggerContainer(0.09)` das outras seções, sem um
       * container que dispararia a segunda fileira antes de ela estar na tela.
       */
      className="[container-type:inline-size]"
    >
      <a
        href="https://www.nubank.com.br/"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative isolate flex overflow-hidden rounded-[24px] border-2 border-nu-neutral-200 bg-nu-bg-primary transition-[border-color] duration-[350ms] ease-out hover:border-nu-brand focus-visible:border-nu-brand"
        style={{
          aspectRatio: `${SECURITY_CARD_W} / ${SECURITY_CARD_H}`,
          padding: `clamp(16px, ${cardCqw(24)}, 24px)`,
        }}
      >
        <CardArte card={card} />

        {/*
          `relative`: o texto e a seta vêm depois da arte no DOM e precisam
          pintar acima dela. A arte começa em y 80 e o bloco de texto termina
          antes disso, mas em telas estreitas a descrição quebra em mais linhas
          e encostaria na arte.
        */}
        <span
          className="relative flex min-w-0 flex-1 items-start"
          style={{ gap: `clamp(8px, ${cardCqw(12)}, 12px)` }}
        >
          <span className="flex min-w-0 flex-1 flex-col gap-[12px]">
            <span
              className="font-display font-bold leading-[1.22] text-nu-text-primary"
              style={{ fontSize: `clamp(1.125rem, ${cardCqw(32)}, 2rem)` }}
            >
              {card.title}
            </span>
            <span className="font-display text-[16px] font-medium leading-[1.22] text-nu-text-tertiary">
              {/*
                As quebras do Figma só a partir de 1536: abaixo disso a coluna
                de texto não tem a largura de "Suas ferramentas de segurança",
                e a quebra forçada somava uma terceira linha órfã. Abaixo, o
                espaço junta as linhas e o texto quebra sozinho.
              */}
              {card.desc.map((linha, i) => (
                <span key={i}>
                  {i > 0 && (
                    <>
                      <br className="hidden 2xl:inline" />
                      <span className="2xl:hidden"> </span>
                    </>
                  )}
                  {linha}
                </span>
              ))}
            </span>
          </span>

          {/*
            A seta é decorativa para a árvore de acessibilidade — o nome do
            link já é o título e a descrição. A cadeia de cor é a das setas da
            Blog e do CTA `brand`, puxada pelo hover e pelo `active` do card.
          */}
          <span
            aria-hidden="true"
            className="grid shrink-0 place-items-center rounded-full bg-nu-brand text-white transition-colors duration-[350ms] ease-out group-hover:bg-nu-purple-800 group-focus-visible:bg-nu-purple-800 group-active:bg-nu-purple-950"
            style={{
              width: `clamp(32px, ${cardCqw(42)}, 42px)`,
              height: `clamp(32px, ${cardCqw(42)}, 42px)`,
            }}
          >
            <ArrowRight size={20} weight="regular" />
          </span>
        </span>
      </a>
    </motion.li>
  );
}

export function SecuritySection() {
  return (
    <section
      id="seguranca"
      aria-labelledby="seguranca-titulo"
      /* Superfície clara: o fundo é `Background/bg-secondary` e os cards são
         brancos — o anel de foco precisa contrastar com os dois. */
      data-surface="light"
      className="relative isolate bg-nu-bg-secondary"
    >
      <div className="nu-frame flex flex-col gap-[100px] py-[100px]">
        {/*
          `items-end`: o CTA alinha pela base do título, como no Figma
          (`274:4`, `items-end justify-between`).
        */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={revealUp}
          className="flex items-end justify-between gap-[24px]"
        >
          <h2
            id="seguranca-titulo"
            className="font-display text-nu-display font-bold leading-[1.22] text-nu-text-primary"
          >
            Sua vida financeira
            <br />
            merece estar protegida.
          </h2>

          <CtaLink
            variant="brand"
            href="https://www.nubank.com.br/"
            className="shrink-0"
          >
            Explore nossas proteções
          </CtaLink>
        </motion.div>

        {/*
          Uma grade só com os seis cards: três colunas a partir de 1280 (as
          duas fileiras do Figma), duas a partir de 768 e uma abaixo. Com
          três colunas a 1024 o card tinha 254 px, e a descrição de 16 px
          quebrava em quatro linhas por cima da arte.
        */}
        <ul className="grid grid-cols-1 gap-[24px] md:grid-cols-2 xl:grid-cols-3">
          {SECURITY_CARDS.map((card, i) => (
            <SecurityCardItem key={card.id} card={card} coluna={i % 3} />
          ))}
        </ul>
      </div>

      <SectionGrain />
    </section>
  );
}
