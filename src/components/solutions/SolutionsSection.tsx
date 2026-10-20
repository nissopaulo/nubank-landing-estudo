"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";

import {
  ACTIVE_INDEX,
  CARROSSEL_DURACAO,
  PREVIEW_BLUR,
  PREVIEW_SCALE,
  SLOTS,
  SOLUTIONS,
  WINDOW,
  type SlotName,
  type Solution,
} from "@/lib/solutions";
import {
  DURATION,
  EASE_OUT_EXPO,
  revealUp,
  SOLUTIONS_SLIDE,
  staggerContainer,
} from "@/lib/motion";
import { PillTab } from "@/components/ui/PillTab";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import {
  useBackgroundParallax,
  type BackgroundParallaxValues,
} from "@/components/solutions/use-background-parallax";

/**
 * Solutions Section — Figma `Solutions Section - Safe` (`144:2`) e
 * `Solutions Section - Account` (`151:92`), 1920×1176.
 *
 * ## A seção é um carrossel, e a prévia é a JANELA encolhida
 *
 * A janela central mostra a opção **ativa** e as duas bordas mostram as
 * **vizinhas**: 135 px à esquerda são a opção anterior, 135 px à direita são a
 * seguinte. O frame do Safe não tem prévia esquerda — é a primeira opção.
 *
 * A prévia **não é uma miniatura**: é a janela escalada por 0,861111, com a
 * arte no mesmo recorte (o delta do recorte contra o da janela escalado é
 * 0,000 nos quatro números). Por isso a virada é **um transform só**: a arte
 * não muda de recorte, ela muda de lugar — sai da borda, cresce, e assume o
 * centro; e a que estava no centro encolhe para a borda e ganha o blur.
 *
 * ## O que se move, e o que não
 *
 * Só a **arte** viaja. O badge e o painel de texto ficam ancorados na janela e
 * trocam por cross-fade: as prévias do Figma **não têm badge nem painel**, e
 * é a arte que sangra para fora.
 *
 * ## O painel de texto surge a cada troca
 *
 * O pedido foi explícito, e é o mesmo reveal do resto da landing: o painel
 * sobe 24 px e aparece, com a curva do `revealUp`. Ele **repete** a cada
 * troca — não é a entrada da seção, é a da opção.
 *
 * ## Três âncoras diferentes, e por quê
 *
 * | Peça              | Âncora          | Por quê                                    |
 * |-------------------|-----------------|--------------------------------------------|
 * | badge e painel    | a **janela**    | mesma largura do `Main Content`, 256 px acima |
 * | arte              | o **slot**      | posição + escala, e é o que faz o carrossel  |
 * | seletor de pílulas | o `Title`       | `justify-between`: flush à direita           |
 *
 * O badge e o painel são posicionados **pela janela**, e não pelo `Main
 * Content`: a janela tem a mesma largura e começa 256 px mais abaixo, então
 * `(1330, 298)` no `Main Content` é `(1330, 42)` na janela. Ancorar na janela
 * deixa a composição ligada à imagem — e é o que faz o resultado bater com o
 * Figma mesmo com o título renderizando 0,16 px mais alto.
 *
 * ## O CTA é um link de texto, e não um `CtaLink`
 *
 * O `CtaLink` tem um `BASE` com `px-[18px] py-2.5` e `rounded-full`, e o
 * design deste CTA é só o texto com o caret — sem fundo e sem padding.
 * Acrescentar uma variante ao `CtaLink` brigaria com o `BASE` no CSS gerado
 * (utilitários base vencem utilitários base), então o link é montado aqui,
 * com o mesmo tratamento de link externo.
 */
export function SolutionsSection() {
  const [indice, setIndice] = useState(ACTIVE_INDEX);
  /**
   * A direção da troca: 1 = avançando, −1 = voltando.
   *
   * Ela é o que decide de que lado a arte nova entra. E precisa ser estado,
   * e não derivado do índice, porque dois índices podem ter a mesma diferença
   * com sinais opostos.
   */
  const [direcao, setDirecao] = useState(1);

  const solucao = SOLUTIONS[indice];
  const active = solucao.active;

  /**
   * O instante em que a arte chega, em segundos.
   *
   * É o tempo que a arte leva para completar a viagem entre os slots — o
   * mesmo número da `transition` do `.sol-arte` no `globals.css`
   * (`CARROSSEL_DURACAO`). O badge e o painel de texto esperam esse instante
   * para aparecerem, para não trocarem no meio do movimento.
   *
   * Sob movimento reduzido o atraso é **zero**: a preferência pede que a
   * mudança seja instantânea, e esperar um segundo para o texto aparecer é
   * exatamente o contrário disso.
   */
  const CHEGADA = usePrefersReducedMotion() ? 0 : CARROSSEL_DURACAO / 1000;

  /*
   * A arte de fundo segue o ponteiro. O ouvinte é a **janela** — é o que
   * limita o efeito àquela tela: passar o ponteiro pelo título ou pelas
   * pílulas não move a arte.
   *
   * O hook vem **antes** do `return` antecipado: a regra de hooks exige a
   * mesma ordem em todo render, e um hook depois de uma saída antecipada é
   * exatamente o que ela proíbe.
   */
  const parallax = useBackgroundParallax();

  /*
   * O `active` ausente é o estado de "frame ainda não liberado". Ele existe
   * para a regra acima valer de forma mecânica, e não por commento.
   */
  if (!active) return null;

  function select(i: number) {
    if (i === indice) return;
    setDirecao(i > indice ? 1 : -1);
    setIndice(i);
  }

  /*
   * As opções visíveis, cada uma no seu slot.
   *
   * A arte da opção anterior vai para a borda esquerda, a da atual fica no
   * centro e a da seguinte vai para a borda direita. A arte é a mesma nos três
   * casos — muda só o slot, que é posição e escala.
   */
  const visiveis: { opcao: Solution; slot: SlotName }[] = [
    ...(indice > 0 ? [{ opcao: SOLUTIONS[indice - 1], slot: "esquerda" as const }] : []),
    { opcao: solucao, slot: "centro" as const },
    ...(indice < SOLUTIONS.length - 1
      ? [{ opcao: SOLUTIONS[indice + 1], slot: "direita" as const }]
      : []),
  ];

  return (
    <section
      id="solucoes"
      aria-labelledby="solucoes-titulo"
      className="relative flex flex-col items-center gap-[100px] overflow-clip bg-white px-[200px] py-[100px]"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer(0.09)}
        className="flex w-full flex-col gap-[100px]"
      >
        {/*
          As artes, uma por opção visível.
        */}
        {visiveis.map((v) => (
          <Arte key={v.opcao.id} opcao={v.opcao} slot={v.slot} parallax={parallax.values} />
        ))}

        {/*
          O Title é uma linha só: o texto à esquerda e o seletor à direita, os
          dois alinhados pela base.

          No Figma (`150:48`) o Navigation virou **filho do Title**, em
          `justify-between` — e é por isso que ele sai em x = 902: 1520 − 618,
          ou seja, flush com a borda direita da coluna de conteúdo.
        */}
        <motion.div
          variants={revealUp}
          className="relative flex w-full items-end justify-between"
        >
          <h2
            id="solucoes-titulo"
            /*
             * `whitespace-pre` porque o Figma traz um espaço no fim da primeira
             * linha do título, e ele conta na largura da caixa de texto: o nó
             * `151:95` mede 554 e a linha sem o espaço mede 535,25. O espaço
             * é invisível, mas a medida é a do design.
             */
            className="font-display text-[64px] font-bold leading-[1.22] whitespace-pre text-nu-brand"
          >
            {active.sectionTitle[0]}
            <br />
            {active.sectionTitle[1]}
          </h2>

          {/*
            O seletor. `role="tablist"` porque trocar de opção troca o
            **conteúdo inteiro** da seção — é a mesma relação de substituição
            da Cards Section, e é o que faz o leitor de tela anunciar
            "Caixinhas, aba 1 de 4" em vez de quatro botões sem relação.

            É o **mesmo componente** da Cards Section (`PillTab`), com a mesma
            regra de CSS. A paleta é a da marca, que é o default das custom
            properties — e por isso o seletor não precisa declarar nenhuma.
          */}
          <div
            role="tablist"
            aria-label="Escolher a solução"
            aria-orientation="horizontal"
            className="sol-nav flex items-start gap-[24px]"
          >
            {SOLUTIONS.map((item, i) => (
              <PillTab
                key={item.id}
                label={item.label}
                selected={i === indice}
                liberado={Boolean(item.active)}
                id={`solucoes-aba-${item.id}`}
                controls={`solucoes-painel-${item.id}`}
                onSelect={() => select(i)}
              />
            ))}
          </div>
        </motion.div>

        {/*
          A janela. Ela **não** tem a arte dentro: a arte vive no slot, e no
          centro o slot cobre a janela exatamente. O que fica aqui é o que é
          ancorado na janela — o badge e o painel de texto.

          `relative` porque é a âncora deles, e `overflow-clip` porque é ela
          que recorta, como no Figma.

          É aqui que o ponteiro é escutado: o efeito da arte fica **limitado a
          esta tela**, e passar pelo título ou pelas pílulas não move nada.
        */}
        <motion.div
          role="tabpanel"
          id={`solucoes-painel-${solucao.id}`}
          aria-labelledby={`solucoes-aba-${solucao.id}`}
          variants={revealUp}
          className="sol-window relative w-full overflow-clip"
          style={{ height: WINDOW.h, borderRadius: WINDOW.radius }}
          {...parallax.bind}
        >
          {/*
            O badge. Cruza com a arte, sem se mover: ele está ancorado na
            janela, e é a ilustração que passa por baixo dele.

            **A entrada espera a arte chegar.** O pedido foi que o badge e o
            painel só aparecessem quando a nova tela estivesse de fato aqui —
            e não no meio da viagem. A saída é rápida (o conteúdo antigo sai
            logo) e a entrada é adiada em `CARROSSEL_DURACAO`, que é o tempo
            que a arte leva para chegar.
          */}
          <AnimatePresence initial={false} custom={direcao}>
            <motion.div
              key={solucao.id}
              custom={direcao}
              className="sol-badge absolute flex items-center justify-center rounded-[100px] border-2 border-nu-brand bg-nu-bg-secondary px-[22px] py-[10px]"
              style={{ left: active.badgeBox.x, top: active.badgeBox.y }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: SOLUTIONS_SLIDE.fade, delay: CHEGADA },
              }}
              exit={{ opacity: 0, transition: { duration: SOLUTIONS_SLIDE.textExit } }}
            >
              {/*
                `leading-[1.2]`: o texto do Figma (`151:76`) tem 24 px de caixa
                para 20 de fonte, e é essa altura que fecha o quadro em 48
                (2 + 10 + 24 + 10 + 2). Com o `leading-[1.25]` do projeto ele
                seria 25 e o badge teria 53.
              */}
              <p className="font-display text-[20px] font-semibold leading-[1.2] whitespace-nowrap text-nu-brand">
                {active.badge}
              </p>
            </motion.div>
          </AnimatePresence>

          {/*
            O painel de texto.

            A **largura** é declarada porque o conteúdo é quebrado em linhas
            explícitas: sem ela a caixa encolheria até a linha mais comprida.
            A altura não é — no Figma ela é a sobra do auto-layout (235 px), e
            declará-la com `overflow-clip` passaria a cortar o CTA por uma
            fração de pixel, já que o `leading` do projeto não é o do Figma.

            **A entrada é o `revealUp`**, o mesmo reveal do resto da landing
            (sobe 24 px e aparece), e ele **repete a cada troca** — é o que o
            pedido foi: o texto tem que surgir de novo sempre que se troca de
            uma opção para a outra.

            E a entrada **espera a arte chegar**: o `delay` é o tempo que a
            arte leva para completar a viagem, para o texto não aparecer
            enquanto a tela ainda está em movimento.
          */}
          <AnimatePresence initial={false} custom={direcao}>
            <motion.div
              key={solucao.id}
              custom={direcao}
              className="sol-textbox absolute flex flex-col items-start gap-[64px] rounded-[42px] bg-nu-bg-secondary px-[42px] py-[32px]"
              style={{
                left: active.textBox.x,
                top: active.textBox.y,
                width: active.textBox.w,
              }}
              /*
               * A variant tem o **atraso dentro dela**, e não na prop
               * `transition`. Com o `animate` apontando para um rótulo de
               * variant, é a transition da variant que vale — a prop é
               * ignorada. Medido: com o atraso na prop, o painel aparecia em
               * 250 ms, no meio da viagem da arte, que é exatamente o que o
               * pedido foi para evitar.
               *
               * A forma é a do `revealUp` (sobe 24 px e aparece), e a duração
               * também — o que muda é só o **quando**.
               */
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: DURATION.slow,
                    delay: CHEGADA,
                    ease: EASE_OUT_EXPO,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
              exit={{
                opacity: 0,
                y: -12,
                transition: { duration: SOLUTIONS_SLIDE.textExit, ease: "easeOut" },
              }}
            >
              <p className="font-display text-[24px] font-bold leading-[1.21] whitespace-pre text-nu-brand">
                {active.title[0]}
                <br />
                {active.title[1]}
                <br />
                {active.title[2]}
              </p>

              {/*
                O caret do Figma é um `CaretDown` girado −90°, que é um caret
                para a direita — e é o `CaretRight` do Phosphor, o mesmo que a
                Ecossystem usa no CTA dela.
              */}
              <a
                href="https://www.nubank.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[10px] text-nu-brand transition-opacity hover:opacity-75"
              >
                <span className="font-display text-[16px] font-semibold leading-[1.25] whitespace-nowrap">
                  {active.cta}
                </span>
                <CaretRight size={20} weight="regular" aria-hidden="true" />
              </a>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}

/**
 * A arte de uma opção, no slot em que ela está.
 *
 * ## O quadro é a janela, e a prévia é ele encolhido
 *
 * O elemento tem **sempre** 1520 × 720, com a arte no recorte da janela. O
 * que muda entre os slots é a `transform` — posição e escala — e o desfoque.
 *
 * Por isso o raio não precisa ser animado: 25 px escalados por 0,861111 dão
 * 21,528, que é **exatamente** o raio que o Figma dá nas prévias.
 *
 * ## O desfoque é local, e por isso vale 5 px
 *
 * O `filter` é aplicado no espaço local do quadro, e o quadro está escalado
 * por 0,861111. Para que o desfoque **na tela** seja 4,306 — o valor do
 * Figma —, o valor local tem de ser 4,306 / 0,861111 = 5,001.
 *
 * ## A transição é uma transição de CSS, e não do Motion
 *
 * O `transform` interpola de "translate(200px, 356px) scale(1)" para
 * "translate(-1173.444px, 408px) scale(0.861111)", e o CSS interpola listas
 * de transform com a mesma estrutura de funções. É a peça mais barata de
 * manter: nenhum estado, nenhum `AnimatePresence`, e a arte continua sendo o
 * mesmo elemento — que é o que faz ela **viajar** em vez de trocar.
 */
function Arte({
  opcao,
  slot,
  parallax,
}: {
  opcao: Solution;
  slot: SlotName;
  parallax: BackgroundParallaxValues;
}) {
  const art = opcao.art;
  if (!art) return null;

  const s = SLOTS[slot];
  const preview = slot !== "centro";
  /*
   * O desfoque local: 0 no centro e 5,001 nas prévias. O valor local de 5,001
   * é o que dá 4,306 na tela, que é o número do Figma.
   */
  const blurLocal = preview ? PREVIEW_BLUR / PREVIEW_SCALE : 0;

  return (
    <div
      aria-hidden="true"
      className="sol-arte absolute overflow-clip"
      style={{
        left: 0,
        top: 0,
        width: WINDOW.w,
        height: WINDOW.h,
        borderRadius: WINDOW.radius,
        transform: `translate(${s.x}px, ${s.y}px) scale(${s.scale})`,
        transformOrigin: "0 0",
        filter: `blur(${blurLocal}px)`,
      }}
    >
      {/*
        A arte dentro do quadro, no recorte da janela. É ela que o parallax
        move — e o movimento é local, então nas prévias ele encolhe junto com
        o quadro.
      */}
      <motion.div
        className="absolute will-change-transform"
        style={{
          left: art.imageBox.x,
          top: art.imageBox.y,
          width: art.imageBox.w,
          height: art.imageBox.h,
          x: parallax.x,
          y: parallax.y,
        }}
      >
        <Image
          src={art.src}
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 1920px) 1882px, 100vw"
          unoptimized
        />
      </motion.div>
    </div>
  );
}
