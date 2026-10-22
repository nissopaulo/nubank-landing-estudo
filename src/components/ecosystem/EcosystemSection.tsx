"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";

import { CtaLink } from "@/components/ui/CtaLink";
import {
  ACTIVE_INDEX,
  PILLARS,
  type Pillar,
} from "@/lib/ecosystem-pillars";
import { personRise } from "@/lib/motion";

/**
 * Ecossystem Section — Figma `Ecossystem Section - Nubank` (nó `52:3`) e
 * `Ecossystem Section - Croma` (nó `76:3`), 1920×919.
 *
 * ## Quatro slots, não "um ativo e três botões"
 *
 * É a leitura do design, não uma escolha de implementação. No frame do Croma
 * o card ativo é o **segundo** da lista, com o Nubank recolhido no primeiro: os
 * quatro cards existem sempre, na mesma ordem, e um deles é o ativo. Se fosse
 * "um ativo e três botões", trocar de pilar desmontaria a linha inteira em vez
 * de rebalanceá-la.
 *
 * Por isso a animação de troca é só o `flex-basis` indo de 107px para
 * `calc(100% - 357px)` no card que entra e o caminho inverso no que sai — os
 * dois ao mesmo tempo. Está tudo em `.eco-card` no `globals.css`, com a
 * coreografia de tempos explicada no comentário do bloco.
 *
 * ## Decisões que valem explicar
 *
 * 1. **O texto do card recolhido é `Neutral/800`, não branco.** O Figma pede
 *    branco sobre `Action/action-disabled` (#e5e7eb), o que dá **1,24:1** —
 *    reprova até o mínimo de 3:1 de texto grande, e o rótulo tem 48 px. A
 *    superfície continua exatamente a do design; só a tinta muda, e aí o
 *    contraste vai a 13,74:1. (O Figma acabou de adotar essa mesma correção.)
 *
 * 2. **`writing-mode: vertical-rl` + `rotate-180`, e não o `rotate-90` do
 *    Figma.** Com `rotate-90` a caixa continua com a largura do texto na
 *    horizontal e só é girada visualmente: o texto transborda do card e o
 *    `overflow-hidden` corta o começo. Com `writing-mode` a caixa já nasce
 *    vertical e acompanha o texto — não há nada para transbordar.
 *
 * 3. **A altura dos cards não é declarada.** O `Main Content` tem 595 px
 *    (`h-[595px]`), o gap de 100 px e o título ocupam o resto — então os 339 px
 *    do carrossel saem da sobra, com a linha em `flex-1` e os cards esticados
 *    por `items-stretch`.
 *
 * 4. **`justify-start` em vez do `justify-center` do Figma.** No repouso as
 *    duas são idênticas, porque a linha preenche tudo e não há o que
 *    centralizar. Quando um card cresce, elas divergem: com `center` ele
 *    cresceria dos dois lados e atravessaria o alinhamento de 200 px da seção.
 *
 * 5. **A pessoa sobe a cada troca**, e não só na montagem. É o que foi pedido,
 *    e o `AnimatePresence` com `key` faz a nova nascer em `hidden` (100% da
 *    própria altura abaixo, fora da janela de recorte) enquanto a antiga desce
 *    e some. A posição e a largura são por pilar porque o design não usa as
 *    mesmas — ver `personLeft` / `personWidth` nos dados.
 */
export function EcosystemSection() {
  const [active, setActive] = useState(ACTIVE_INDEX);
  const pillar = PILLARS[active];

  return (
    <section
      id="ecossistema"
      aria-labelledby="ecossistema-titulo"
      /* Superfície clara: a seção é branca, e era aqui que o anel branco
          sumia por completo (1,00:1). */
      data-surface="light"
      /*
       * A moldura (`.nu-frame`) fica **na seção**, e não no `Main Content`.
       *
       * A pessoa é posicionada em porcentagem — e porcentagem resolve contra a
       * **caixa de padding** do ancestral posicionado. Com a moldura no
       * `Main Content`, a caixa de padding dele passaria a ser a moldura
       * inteira (1920) em vez da coluna de conteúdo (1520), e a pessoa saía
       * 26% maior e 55px à esquerda. Na seção, o `Main Content` volta a ser a
       * coluna de 1520, e a geometria da pessoa é a do Figma.
       *
       * A seção é branca, e o fundo da página também — limitar a seção a
       * 1920px não aparece em lugar nenhum.
       */
      className="nu-frame flex flex-col gap-[64px] bg-white py-[100px]"
    >
      {/*
        `relative` porque a pessoa é posicionada contra este elemento.

        Aqui **não** tem `overflow-clip`, ao contrário do que o Figma pede. A
        linha de cards preenche este elemento exatamente, então o clip do
        container comeria o crescimento do hover. A janela de recorte da pessoa
        é a mesma caixa, só que num wrapper próprio, logo abaixo.
      */}
      <div className="relative flex h-[595px] flex-col gap-[100px] [container-type:inline-size]">
        <h2
          id="ecossistema-titulo"
          className="font-display text-nu-display font-bold leading-[1.22] text-nu-brand"
        >
          Um Nu para
          <br />
          cada momento.
        </h2>

        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="flex w-full flex-1 items-stretch justify-start gap-[12px]">
            {PILLARS.map((p, i) => (
              <PillarCard
                key={p.id}
                pillar={p}
                active={i === active}
                onSelect={() => setActive(i)}
              />
            ))}
          </div>
        </div>

        {/* Janela de recorte da pessoa: a mesma caixa do `Main Content`
            (`inset-0`), com `pointer-events-none` para não roubar o hover dos
            cards. */}
        <div className="pointer-events-none absolute inset-0 overflow-clip">
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
              style={{
                left: `${pillar.active?.personLeft ?? 0}%`,
                width: `${pillar.active?.personWidth ?? 0}%`,
                height: "auto",
              }}
            />
          </AnimatePresence>
        </div>
      </div>

      {/*
        O parágrafo e o CTA trocam junto com o card. `mode="wait"` faz a saída
        terminar antes da entrada, para os dois textos nunca ficarem
        sobrepostos — é a diferença entre "trocar" e "duplicar".

        A coluna de texto é a mesma fração da tela que a linha de cards: as duas
        são o `Main Content` de 1520 do Figma.
      */}
      <div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            className="flex items-start gap-[100px]"
          >
            <p className="flex-1 font-display text-[16px] font-medium leading-[1.25] text-nu-text-tertiary">
              {pillar.active?.body}
            </p>

            <CtaLink variant="brand" href="https://www.nubank.com.br/" className="shrink-0">
              {pillar.active?.cta}
              <CaretRight size={20} weight="regular" aria-hidden="true" />
            </CtaLink>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/**
 * Pede o download da pessoa antes do clique.
 *
 * A pessoa só entra em cena no clique, e o `src` só é trocado ali — então o
 * navegador começa a decodificar no mesmo quadro em que a animação parte. Em
 * rede fria isso é um quadro em branco no meio da subida, que é justamente o
 * oposto de "suave". Aquecer no `pointerenter` e no `focus` antecipa o
 * download sem custar nada a quem não vai clicar, e sem carregar as quatro
 * imagens para a maioria que nunca troca de pilar.
 */
function aquecerPessoa(src: string) {
  if (typeof window === "undefined") return;
  const img = new Image();
  img.src = src;
}

function PillarCard({
  pillar,
  active,
  onSelect,
}: {
  pillar: Pillar;
  active: boolean;
  onSelect: () => void;
}) {
  const desenhado = Boolean(pillar.active);
  const precar = () => aquecerPessoa(pillar.person);

  return (
    /*
     * `aria-disabled` nos pilares ainda não desenhados, com aviso para leitor de
     * tela — a mesma regra dos itens da navegação. Um botão que não faz nada
     * não existe em silêncio. `aria-expanded` só nos desenhados, porque é
     * nesses que o clique realmente expande.
     *
     * O `cursor` fica no CSS, no bloco `.eco-card`, e não aqui como
     * utilitária: o UA stylesheet põe `default` em `<button>`, então o card
     * precisa da regra — e o `aria-disabled` que troca por `not-allowed` fica
     * ao lado dela para não haver duas fontes.
     */
    <button
      type="button"
      data-state={active ? "active" : "idle"}
      aria-expanded={desenhado ? active : undefined}
      aria-disabled={!desenhado}
      onClick={desenhado ? onSelect : undefined}
      onPointerEnter={precar}
      onFocus={precar}
      style={{ "--eco-ink": pillar.active?.ink } as React.CSSProperties}
      className="eco-card relative shrink-0 overflow-hidden rounded-[16px] bg-nu-neutral-200 p-0 text-left"
    >
      {/* Gradiente em camada própria. `background-image` não é interpolável, e
          o card está crescendo justo na hora da troca — um `background-image`
          trocando por outro seria um corte seco. */}
      <span
        aria-hidden="true"
        className="eco-card__grad"
        style={{ backgroundImage: pillar.active?.gradient }}
      />

      {/* Estado recolhido: o nome lido de baixo para cima, como no Figma. */}
      <span className="eco-card__label">
        <span
          className="font-display text-[48px] font-bold leading-none text-nu-neutral-800 [writing-mode:vertical-rl] rotate-180"
          style={{ width: 59 }}
        >
          {pillar.name}
        </span>
      </span>

      {/*
        Estado aberto. `leading-[1.25]` é a altura natural do Montserrat a
        16px (≈20px de caixa), que é o que o design usa. A quebra em duas
        linhas vem do dado, não de uma largura — ver `active.desc`.

        **A largura máxima é a caixa do texto no Figma.** A pessoa é desenhada
        por cima do card, e o texto não pode entrar embaixo dela. Medido na
        arte (o canal alfa do WebP, nas linhas em que a descrição aparece), o
        corpo da pessoa do Nubank começa em x = 531,8 do `Main Content` — e o
        texto começa em 24, ou seja, sobram 507,8px. A caixa de texto do Figma
        (nó `52:156`) tem 445px, e essa diferença de 62,8px é a folga que o
        desenho deixou.

        A largura máxima é então a **própria caixa do Figma, escalada com a
        coluna**: 30,5%. A 1920 ela não aperta nada — o texto tem 444,5px de
        largura natural e continua em duas linhas, como no Figma. A 1280 ela
        segura a descrição antes da pessoa, em vez de deixá-la sumir atrás
        dela, e ainda mantém a primeira linha inteira (306,9px, que é o que
        cabe em 30,5% de 1013px).

        A medida é a do caso **Nubank**, que é o mais apertado dos quatro: nos
        outros a pessoa entra 95px, 105px e 168px depois.
      */}
      {pillar.active && (
        <span className="eco-card__body">
          <span className="font-display text-nu-display font-bold leading-[1.22]">
            {pillar.name}
          </span>
          <span className="max-w-[30.5cqw] font-display text-[16px] font-medium leading-[1.25]">
            {pillar.active.desc[0]}
            <br />
            {pillar.active.desc[1]}
          </span>
        </span>
      )}

      {/* Fora das duas camadas de conteúdo, para o leitor de tela não ler o
          nome duas vezes — as cópias visuais saem da árvore por
          `visibility`, mas esta cópia do texto é a que conta. */}
      {!desenhado && (
        <span className="sr-only">— ainda não implementado neste estudo</span>
      )}
    </button>
  );
}
