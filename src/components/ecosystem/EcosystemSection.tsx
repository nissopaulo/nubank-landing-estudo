"use client";

import { AnimatePresence, motion } from "motion/react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";

import { CtaLink } from "@/components/ui/CtaLink";
import {
  ACTIVE_CONTENT,
  ACTIVE_INDEX,
  PILLARS,
} from "@/lib/ecosystem-pillars";
import { personRise } from "@/lib/motion";

/**
 * Ecossystem Section — Figma `Ecossystem Section - Nubank` (node `52:3`,
 * 1920x919). Todas as medidas abaixo são px do frame de 1920.
 *
 * ## Só o Nubank está desenhado
 *
 * O Figma tem um frame visível (o Nubank, na estrutura nova) e três ocultos que
 * ainda estão na estrutura antiga. Então o carrossel e os quatro pilares existem,
 * e **só o primeiro abre**. Os outros três são botões de verdade com
 * `aria-disabled` e aviso para leitor de tela — nunca um botão que "não faz
 * nada" em silêncio, que é a mesma regra dos itens da navegação.
 *
 * Quando você redesenhar os três no Figma, o que entra é o estado: um
 * `useState` com o índice, um `onClick` no botão e o `src` da pessoa. O
 * `key={pillar.id}` do `AnimatePresence` já está lá, e é ele que faz a troca
 * reaproveitar a animação.
 *
 * ## Três decisões que valem explicar
 *
 * 1. **O texto do card recolhido é `Neutral/800`, não branco.** O Figma põe
 *    branco sobre `Action/action-disabled` (#e5e7eb), o que dá **1,24:1** —
 *    reprova até o mínimo de 3:1 de texto grande, e o rótulo tem 48px. A
 *    superfície continua exatamente a do design; só a tinta muda, e aí o
 *    contraste vai a 13,74:1. A leitura de "desabilitado" vem da superfície
 *    cinza, não da cor do texto.
 *
 * 2. **`writing-mode: vertical-rl` + `rotate-180`, e não o `rotate-90` do
 *    Figma.** Com `rotate-90` a caixa continua com a largura do texto na
 *    horizontal e só é girada visualmente: o texto transborda do card e o
 *    `overflow-hidden` corta o começo. Com `writing-mode` a caixa já nasce
 *    vertical e acompanha o texto — não há nada para transbordar. O resultado
 *    na tela é o mesmo.
 *
 * 3. **A altura dos cards não é declarada.** O `Main Content` tem 595px
 *    (`h-[595px]`), o gap de 100px e o título ocupam o resto — então os 339px
 *    do carrossel saem da sobra, com a linha de cards em `flex-1` e os cards
 *    esticados por `items-stretch`. Se a fonte renderizar o título com meio
 *    pixel a mais, o card encolhe junto em vez de estourar a seção.
 *
 * O crescimento no hover dos dois fica no CSS (`.eco-card-active` e
 * `.eco-pillar`), não aqui — o comentário do bloco em `globals.css` explica por
 * que é propriedade de layout e não `transform`.
 */
export function EcosystemSection() {
  const pillar = PILLARS[ACTIVE_INDEX];
  const { gradient, title, desc, body, cta, href } = ACTIVE_CONTENT;

  return (
    <section
      id="ecossistema"
      aria-labelledby="ecossistema-titulo"
      className="flex flex-col gap-[64px] bg-white px-[200px] py-[100px] 2xl:px-[clamp(200px,10.4vw,320px)]"
    >
      {/*
        `relative` porque a pessoa é posicionada contra este elemento, como no
        Figma.

        Aqui **não** tem `overflow-clip`, ao contrário do que o Figma pede — e a
        razão é o hover. A linha de cards preenche este elemento exatamente
        (1163 + 3x107 + 3x12 = 1520), então não sobra um pixel: qualquer
        crescimento no hover transbordaria, e o clip comeria a beirada — o card
        ativo perderia 14px da esquerda e o último pilar 14px da direita. O
        efeito deixaria de ser "empurrar" e viraria "ser cortado".

        A janela de recorte da pessoa é a mesma caixa; ela só foi para um
        wrapper próprio, com `inset-0`, logo abaixo. O resultado na tela é
        idêntico ao do Figma, e o card pode crescer de verdade.
      */}
      <div className="relative flex h-[595px] flex-col gap-[100px]">
        <h2
          id="ecossistema-titulo"
          className="font-display text-[64px] font-bold leading-[1.22] text-nu-brand"
        >
          {title[0]}
          <br />
          {title[1]}
        </h2>

        <div className="relative flex min-h-0 flex-1 flex-col">
          {/*
            gap-[12px] do Figma; a linha é `flex-1` para herdar a altura que
            sobrou do `Main Content` (339px em 1920).

            `justify-start` em vez do `justify-center` do Figma: no repouso as
            duas são idênticas, porque a linha preenche a largura toda — não há
            o que centralizar. No hover elas divergem, e é aí que importa: com
            `center` o card cresceria dos dois lados, atravessando o alinhamento
            de 200px da seção. Com `start` a borda esquerda fica em 200 e o
            crescimento vai todo para a direita, que é o "empurrar" que se pede.
          */}
          <div className="flex w-full flex-1 items-stretch justify-start gap-[12px]">
            {/*
              Card ativo. A largura vem de `.eco-card-active` no `globals.css`,
              por `flex-basis: calc(100% - 357px)` — 357 = 3x107 dos recolhidos
              + 3x12 de gap, o que faz a linha ocupar Main Content inteiro, como
              no Figma (1163px em 1920). Aqui só fica o `flex-1` como valor de
              reserva: se a regra for removida, a linha volta a se distribuir.
            */}
            <div
              className="eco-card-active flex flex-1 flex-col items-start overflow-hidden rounded-[16px] p-6"
              style={{ backgroundImage: gradient }}
            >
              <div className="flex flex-col items-start gap-6">
                <h3 className="font-display text-[64px] font-bold leading-[1.22] text-white">
                  {pillar.name}
                </h3>
                {/*
                  * Branco, como no Figma (nó 52:156). Sobre o gradiente do
                  * card o pior ponto da área do texto dá 5,95:1 — passa AA com
                  * folga.
                  *
                  * Houve uma tentativa de pôr `Text/text-tertiary` aqui, por
                  * leitura equivocada do pedido: o tertiary é do **parágrafo
                  * abaixo**, ao lado do CTA, e é onde ele está. Sobre este
                  * gradiente o tertiary dava 1,23:1 e não tinha canto que
                  * passasse.
                  *
                  * leading-[1.25] é a altura natural do Montserrat a 16px
                  * (≈20px de caixa). A quebra em duas linhas vem do dado, não de
                  * uma largura — ver `ACTIVE_CONTENT.desc`.
                  */}
                <p className="font-display text-[16px] font-medium leading-[1.25] text-white">
                  {desc[0]}
                  <br />
                  {desc[1]}
                </p>
              </div>
            </div>

            {PILLARS.filter((_, i) => i !== ACTIVE_INDEX).map((other) => (
              /*
               * Sem `onClick` de propósito: o botão não faz nada ainda, e um
               * handler que só reatribui o mesmo valor seria pior que
               * nenhum — pareceria funciona. Fica como está na navegação.
               */
              <button
                key={other.id}
                type="button"
                aria-disabled="true"
                className="eco-pillar flex shrink-0 flex-col items-center justify-end overflow-hidden rounded-[16px] bg-nu-neutral-200 p-6 hover:opacity-80 aria-disabled:cursor-not-allowed"
              >
                {/* A largura (107px) e o crescimento no hover vêm de
                    `.eco-pillar` no `globals.css` — precisam ser do CSS porque o
                    `width` anima e um `style` fixo não teria como. O texto
                    continua com os 59px de espessura. */}
                <span
                  className="font-display text-[48px] font-bold leading-none text-nu-neutral-800 [writing-mode:vertical-rl] rotate-180"
                  style={{ width: 59 }}
                >
                  {other.name}
                  <span className="sr-only">
                    {" "}
                    — ainda não implementado neste estudo
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/*
          A pessoa, dentro de uma janela de recorte com a MESMA caixa do
          `Main Content` (`inset-0`). O clip saiu do `Main Content` e veio para
          aqui — ver o comentário dele. `pointer-events-none` porque essa
          janela cobre a linha inteira e não pode roubar o hover dos cards.
        */}
        <div className="pointer-events-none absolute inset-0 overflow-clip">
          {/*
            `left` e `width` são 210px e 1129px do Figma, convertidos em fração
            da largura do `Main Content` (1520px) para escalarem sem distorcer.
            A altura não é declarada de propósito: o WebP é 2400x1792 — 2x da
            largura de exibição, para densidade de tela —, e 1129px de largura
            dá 842,99px de altura, que é o `h-[842.987px]` do design, com a
            proporção garantida pela própria imagem.
          */}
          <AnimatePresence>
            <motion.img
              key={pillar.id}
              src={pillar.person}
              alt=""
              aria-hidden="true"
              draggable={false}
              variants={personRise}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="pointer-events-none absolute top-0 select-none object-cover"
              style={{ left: "13.816%", width: "74.276%", height: "auto" }}
            />
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-start gap-[100px]">
        {/*
          O parágrafo ao lado do CTA é o único texto em `Text/text-tertiary`
          da seção — é o que o Figma pede (variável `Text/text-tertiary`, nó
          `52:164`) e o que dá 4,83:1 sobre o branco da seção.
        */}
        <p className="flex-1 font-display text-[16px] font-medium leading-[1.25] text-nu-text-tertiary">
          {body}
        </p>

        {/*
          Variante `brand` do design system — o mesmo par e a mesma cadeia de
          interação do "Quero ser Nubank" da header no estado condensado. Antes
          isto era um `style` inline em cima da variante `solid`, e o hover
          herdava o branco dela: o texto sumia a 1,18:1.
        */}
        <CtaLink variant="brand" href={href} className="shrink-0">
          {cta}
          <CaretRight size={20} weight="regular" aria-hidden="true" />
        </CtaLink>
      </div>
    </section>
  );
}
