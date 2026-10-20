"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";

import {
  ACTIVE_INDEX,
  CARROSSEL_DURACAO,
  CARROSSEL_EASE,
  SLOTS,
  SOLUTIONS,
  WINDOW,
  foraPara,
  slotDe,
  type SlotName,
  type Solution,
} from "@/lib/solutions";
import { DURATION, EASE_OUT_EXPO, revealUp, staggerContainer } from "@/lib/motion";
import { PillTab } from "@/components/ui/PillTab";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import {
  useBackgroundParallax,
  type BackgroundParallaxValues,
} from "@/components/solutions/use-background-parallax";

/**
 * Solutions Section — Figma `Solutions Section - Safe` (`144:2`), `- Account`
 * (`151:92`), `- Billing` (`153:125`) e `- Business` (`153:167`), 1920×1176.
 *
 * ## Uma composição é UM componente
 *
 * A arte, o badge e o painel de texto vivem no **mesmo quadro**, e esse quadro
 * é o que muda de lugar quando a opção troca. Nada "flutua" — o badge está
 * atrelado à arte dele porque está **dentro** do quadro dela.
 *
 * ## O quadro tem três slots, e o slot é a diferença de índice
 *
 * | diferença | slot | o que é |
 * |---|---|---|
 * | 0 | centro | a opção ativa, nítida e cheia |
 * | −1 | esquerda | a anterior, miniatura e desfocada |
 * | +1 | direita | a seguinte, miniatura e desfocada |
 * | ≤ −2 | fora, pela esquerda | entrou ou saiu |
 * | ≥ +2 | fora, pela direita | entrou ou saiu |
 *
 * A miniatura é **a janela encolhida** por 0,861111, e o recorte da arte
 * dentro dela é o da janela escalado pelo mesmo número — delta 0,000 nos
 * quatro valores, nos quatro frames do Figma.
 *
 * ## Três âncoras diferentes, e por quê
 *
 * | Peça | Âncora | Por quê |
 * |---|---|---|
 * | composição | o **slot** | é ela que viaja |
 * | badge e painel | o quadro da composição | e é por isso que andam juntos |
 * | seletor de pílulas | o `Title` | `justify-between`: flush à direita |
 *
 * O badge e o painel são posicionados **pela janela**, e não pelo `Main
 * Content`: a janela tem a mesma largura e começa 256 px mais abaixo, então
 * `(1330, 298)` no `Main Content` é `(1330, 42)` na janela.
 *
 * ## O CTA é um link de texto, e não um `CtaLink`
 *
 * O `CtaLink` tem um `BASE` com `px-[18px] py-2.5` e `rounded-full`, e o
 * design deste CTA é só o texto com o caret — sem fundo e sem padding.
 * Acrescentar uma variante ao `CtaLink` brigaria com o `BASE` no CSS gerado
 * (utilitários base vencem utilitários base), então o link é montado aqui.
 */
export function SolutionsSection() {
  const [indice, setIndice] = useState(ACTIVE_INDEX);
  /**
   * A direção da troca: 1 = avançando, −1 = voltando.
   *
   * Ela decide de que lado a arte nova entra. E precisa ser estado, e não
   * derivado do índice, porque dois índices podem ter a mesma diferença com
   * sinais opostos.
   */
  const [direcao, setDirecao] = useState(1);

  const solucao = SOLUTIONS[indice];
  const active = solucao.active;

  /**
   * O instante em que a arte chega, em segundos.
   *
   * É o tempo que a arte leva para completar a viagem — o mesmo número da
   * transição do `.sol-arte` no `globals.css` (`CARROSSEL_DURACAO`). O badge e
   * o painel esperam esse instante para aparecerem, para não trocarem no meio
   * do movimento.
   *
   * Sob movimento reduzido o atraso é **zero**: a preferência pede mudança
   * instantânea, e esperar um segundo para o texto aparecer é o contrário.
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
   * As composições visíveis: a anterior, a ativa e a seguinte.
   *
   * As que ficam fora dessa janela **não são renderizadas** — e é o
   * `AnimatePresence` que segura as que estão saindo, para elas animarem
   * fora em vez de sumir.
   */
  const composicoes = SOLUTIONS.map((opcao, i) => ({ opcao, i })).filter(
    ({ i }) => Math.abs(i - indice) <= 1,
  );

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
          As composições. Cada uma é um quadro de 1520 × 720 — a janela — com a
          arte, o badge e o painel dentro.

          O quadro viaja entre os slots, e é isso que faz a troca parecer um
          carrossel: **nada é trocado, tudo se desloca**.
        */}
        <AnimatePresence initial={false} custom={direcao}>
          {composicoes.map(({ opcao, i }) => (
            <Composicao
              key={opcao.id}
              opcao={opcao}
              slot={slotDe(i - indice)}
              direcao={direcao}
              chegada={CHEGADA}
              parallax={parallax.values}
            />
          ))}
        </AnimatePresence>

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
          {/*
            O título da seção também é por opção, e por isso ele troca junto —
            mas **rápido**, sem esperar a arte chegar.

            A espera não caberia aqui: o título ficaria vazio durante toda a
            viagem, e um bloco de texto em branco no alto da seção parece
            defeito. Ele é a "chrome" da seção, e a chrome troca na hora.
          */}
          <AnimatePresence initial={false} mode="wait">
            <motion.h2
              key={solucao.id}
              id="solucoes-titulo"
              /*
               * `whitespace-pre` porque o Figma traz um espaço no fim da
               * primeira linha do título, e ele conta na largura da caixa de
               * texto: o nó `151:95` mede 554 e a linha sem o espaço mede
               * 535,25. O espaço é invisível, mas a medida é a do design.
               */
              className="font-display text-[64px] font-bold leading-[1.22] whitespace-pre text-nu-brand"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {active.sectionTitle[0]}
              <br />
              {active.sectionTitle[1]}
            </motion.h2>
          </AnimatePresence>

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
          A janela. Ela **não** tem `overflow-clip`, e é de propósito: o badge e
          o painel saem com a arte, e um clip aqui os cortaria no meio da
          viagem. O clip que importa é o do quadro da composição.

          E é aqui que o ponteiro é escutado: o efeito da arte fica **limitado
          a esta tela**, e passar pelo título ou pelas pílulas não move nada.
        */}
        <motion.div
          role="tabpanel"
          id={`solucoes-painel-${solucao.id}`}
          aria-labelledby={`solucoes-aba-${solucao.id}`}
          variants={revealUp}
          className="sol-window relative w-full"
          style={{ height: WINDOW.h, borderRadius: WINDOW.radius }}
          {...parallax.bind}
        />
      </motion.div>
    </section>
  );
}

/**
 * Uma composição: a arte, o badge e o painel de texto, no mesmo quadro.
 *
 * ## O quadro viaja, e o que ele leva junto
 *
 * A arte, o badge e o painel estão **dentro** do quadro, e o quadro é o que
 * muda de slot. É por isso que o badge está atrelado à arte dele: não é uma
 * coincidência de posição, é a mesma árvore.
 *
 * ## O desfoque é de CSS, e o resto é do Motion
 *
 * O Motion interpola `transform` e `opacity`, mas **não** interpola o `filter`
 * — e o desfoque da miniatura é justamente o que precisa de interpolação. Por
 * isso o `filter` fica no estilo inline com uma transição de CSS, e o
 * transform e a opacidade são variantes do Motion.
 */
function Composicao({
  opcao,
  slot,
  direcao,
  chegada,
  parallax,
}: {
  opcao: Solution;
  slot: SlotName;
  direcao: number;
  chegada: number;
  parallax: BackgroundParallaxValues;
}) {
  const active = opcao.active;
  if (!active) return null;

  const s = SLOTS[slot];
  const miniatura = slot !== "centro";

  return (
    <motion.div
      /*
       * O `custom` entrega a **direção** à variant "fora" — é por ele que a
       * composição sabe de que lado entrar e de que lado sair. Na entrada
       * vale o `custom` do próprio quadro; na saída, o do `AnimatePresence`,
       * que é o do gesto atual.
       */
      custom={direcao}
      aria-hidden={miniatura ? "true" : undefined}
      className="sol-arte absolute overflow-clip"
      style={{
        left: 0,
        top: 0,
        width: WINDOW.w,
        height: WINDOW.h,
        borderRadius: WINDOW.radius,
        /*
         * A origem do transform é o **canto do quadro**, e não o centro: é o
         * que faz a escala encolher a partir do mesmo lugar de onde a
         * miniatura é posicionada.
         */
        transformOrigin: "0 0",
        /*
         * O desfoque é local: o `filter` é aplicado no espaço do quadro, e o
         * quadro está escalado por 0,861111 — então 5,001 local dá 4,306 na
         * tela, que é o número do Figma.
         */
        filter: `blur(${s.blur}px)`,
      }}
      variants={{
        centro: { x: SLOTS.centro.x, y: SLOTS.centro.y, scale: 1, opacity: 1 },
        esquerda: {
          x: SLOTS.esquerda.x,
          y: SLOTS.esquerda.y,
          scale: SLOTS.esquerda.scale,
          opacity: 1,
        },
        direita: {
          x: SLOTS.direita.x,
          y: SLOTS.direita.y,
          scale: SLOTS.direita.scale,
          opacity: 1,
        },
        /*
         * "fora" é uma **função**, e é por isso que ela recebe a direção: o
         * `custom` do `AnimatePresence` é o que carrega a direção do gesto
         * até a saída — e é o `custom` do próprio componente que a carrega até
         * a entrada.
         */
        fora: (d: number) => {
          const f = foraPara(d);
          return { x: f.x, y: f.y, scale: f.scale, opacity: 0 };
        },
      }}
      /*
       * O `initial` é "fora" e não `false`: uma composição que **entra**
       * tem de vir de fora do quadro, senão ela simplesmente aparece no lugar
       * e a troca não parece uma troca. O `AnimatePresence` com
       * `initial={false}` é o que impede isso na **primeira** renderização —
       * na carga da página a composição já nasce no centro, sem escorregar.
       */
      initial="fora"
      animate={slot}
      exit="fora"
      transition={{ duration: CARROSSEL_DURACAO / 1000, ease: CARROSSEL_EASE }}
    >
      {/*
        A arte, no recorte da janela. E é ela que o parallax move — e o
        movimento é local, então nas miniaturas ele encolhe junto com o quadro.
      */}
      <motion.div
        className="absolute will-change-transform"
        style={{
          left: opcao.art?.imageBox.x,
          top: opcao.art?.imageBox.y,
          width: opcao.art?.imageBox.w,
          height: opcao.art?.imageBox.h,
          x: parallax.x,
          y: parallax.y,
        }}
      >
        <Image
          src={opcao.art?.src ?? ""}
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 1920px) 1882px, 100vw"
          unoptimized
        />
      </motion.div>

      {/*
        O badge. Ele está **dentro** do quadro, e é por isso que acompanha a
        arte — não há nada para sincronizar, é a mesma árvore.

        E a opacidade dele é a da miniatura: a opacidade do quadro já resolve
        o resto.
      */}
      <motion.div
        className="sol-badge absolute flex items-center justify-center rounded-[100px] border-2 border-nu-brand bg-nu-bg-secondary px-[22px] py-[10px]"
        style={{ left: active.badgeBox.x, top: active.badgeBox.y }}
        variants={{
          centro: {
            opacity: 1,
            transition: { duration: 0.4, delay: chegada },
          },
          esquerda: { opacity: 0, transition: { duration: CARROSSEL_DURACAO / 1000 } },
          direita: { opacity: 0, transition: { duration: CARROSSEL_DURACAO / 1000 } },
          fora: { opacity: 0 },
        }}
      >
        {/*
          `leading-[1.2]`: o texto do Figma (`151:76`) tem 24 px de caixa para
          20 de fonte, e é essa altura que fecha o quadro em 48
          (2 + 10 + 24 + 10 + 2).
        */}
        <p className="font-display text-[20px] font-semibold leading-[1.2] whitespace-nowrap text-nu-brand">
          {active.badge}
        </p>
      </motion.div>

      {/*
        O painel de texto. A mesma história do badge: dentro do quadro, e com a
        entrada **atrasada até a arte chegar**.
      */}
      <motion.div
        className="sol-textbox absolute flex flex-col items-start gap-[64px] rounded-[42px] bg-nu-bg-secondary px-[42px] py-[32px]"
        style={{ left: active.textBox.x, top: active.textBox.y, width: active.textBox.w }}
        variants={{
          centro: {
            opacity: 1,
            y: 0,
            transition: { duration: DURATION.slow, delay: chegada, ease: EASE_OUT_EXPO },
          },
          esquerda: {
            opacity: 0,
            y: 0,
            transition: { duration: CARROSSEL_DURACAO / 1000, ease: CARROSSEL_EASE },
          },
          direita: {
            opacity: 0,
            y: 0,
            transition: { duration: CARROSSEL_DURACAO / 1000, ease: CARROSSEL_EASE },
          },
          fora: { opacity: 0, y: 0 },
        }}
      >
        <p className="font-display text-[24px] font-bold leading-[1.21] whitespace-pre text-nu-brand">
          {active.title.map((linha) => (
            <span key={linha}>
              {linha}
              <br />
            </span>
          ))}
        </p>

        {/*
          O caret do Figma é um `CaretDown` girado −90°, que é um caret para a
          direita — e é o `CaretRight` do Phosphor, o mesmo que a Ecossystem usa
          no CTA dela.
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
    </motion.div>
  );
}
