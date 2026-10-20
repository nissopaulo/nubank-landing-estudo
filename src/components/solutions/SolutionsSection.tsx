"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";

import {
  ACTIVE_INDEX,
  PREVIEW_BLUR,
  PREVIEW_OVERFLOW,
  PREVIEW_RADIUS,
  SOLUTIONS,
  WINDOW_H,
  WINDOW_RADIUS,
  type SolutionPreview,
} from "@/lib/solutions";
import {
  EASE_OUT_EXPO,
  revealFade,
  revealUp,
  SOLUTIONS_SLIDE,
  staggerContainer,
} from "@/lib/motion";
import { PillTab } from "@/components/ui/PillTab";
import { useBackgroundParallax } from "@/components/solutions/use-background-parallax";

/**
 * Solutions Section — Figma `Solutions Section - Safe` (`144:2`) e
 * `Solutions Section - Account` (`151:92`), 1920×1176.
 *
 * ## A seção é um carrossel
 *
 * A janela central mostra a opção **ativa** e as duas bordas mostram as
 * **vizinhas**: 135 px à esquerda são a opção anterior, 135 px à direita são a
 * seguinte. O frame do Safe não tem prévia esquerda — é a primeira opção.
 *
 * ## A troca é um gesto, e não uma substituição
 *
 * Quando a opção troca, **tudo anda na mesma direção**: a arte que estava na
 * prévia da direita entra na janela, a que estava na janela sai para a
 * prévia da esquerda, e uma nova entra pela direita.
 *
 * Isso é possível porque **a prévia é a arte da vizinha**: a prévia direita do
 * Safe é a arte do Conta e Pix, que é exatamente o que entra na janela na
 * troca seguinte. O olho segue a mesma arte e lê o movimento.
 *
 * ## O painel de texto surge a cada troca
 *
 * O pedido foi explícito, e é o mesmo reveal do resto da landing: o painel
 * sobe 24 px e aparece, com a curva do `revealUp`. Ele **repete** a cada
 * troca — não é a entrada da seção, é a da opção.
 *
 * ## Três âncoras diferentes, e por quê
 *
 * | Peça              | Âncora          | Por quê                                 |
 * |-------------------|-----------------|-----------------------------------------|
 * | badge e painel    | a **janela**    | mesma largura do `Main Content`, 256 px acima |
 * | prévias           | a **seção**     | são irmãs do `Main Content`, não filhas  |
 * | seletor de pílulas | o `Title`       | `justify-between`: flush à direita      |
 *
 * O badge e o painel são posicionados **pela janela**, e não pelo `Main
 * Content`: a janela tem a mesma largura e começa 256 px mais abaixo, então
 * `(1330, 298)` no `Main Content` é `(1330, 42)` na janela. Ancorar na janela
 * deixa a composição ligada à imagem — e é o que faz o resultado bater com o
 * Figma mesmo com o título renderizando 0,16 px mais alto (o `leading-[1.22]`
 * do projeto contra o `leading: normal` do design).
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

  const image = active.imageBox;

  function select(i: number) {
    if (i === indice) return;
    setDirecao(i > indice ? 1 : -1);
    setIndice(i);
  }

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
          O Title é uma linha só: o texto à esquerda e o seletor à direita, os
          dois alinhados pela base.

          No Figma (`150:48`) o Navigation virou **filho do Title**, em
          `justify-between` — e é por isso que ele sai em x = 902: 1520 − 618,
          ou seja, flush com a borda direita da coluna de conteúdo.
        */}
        <motion.div
          variants={revealUp}
          className="flex w-full items-end justify-between"
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
          A janela da imagem. `relative` porque é a âncora do badge e do painel
          de texto, e `overflow-clip` porque é ela que recorta a imagem, como
          no Figma.

          É aqui que o ponteiro é escutado: o efeito da arte fica **limitado a
          esta tela**, e passar pelo título ou pelas pílulas não move nada.
        */}
        <motion.div
          role="tabpanel"
          id={`solucoes-painel-${solucao.id}`}
          aria-labelledby={`solucoes-aba-${solucao.id}`}
          variants={revealUp}
          className="sol-window relative w-full overflow-clip"
          style={{ height: WINDOW_H, borderRadius: WINDOW_RADIUS }}
          {...parallax.bind}
        >
          {/*
            A arte não é dimensionada pela janela: o Figma a põe num retângulo
            maior e deixa a janela recortar. É o que dá o enquadramento, e o
            mesmo motivo pelo qual a sombra dos cards da Hero vai na `<img>` e
            não na caixa do slot.

            **A arte é a única coisa que se move.** O badge e o painel ficam
            ancorados na janela, e a ilustração desliza por baixo deles.

            `will-change: transform` é o custo consciente de mover uma arte de
            1882 × 1020: sem uma camada própria, cada quadro do ponteiro
            repintaria a região recortada.
          */}
          <AnimatePresence initial={false} custom={direcao}>
            <motion.div
              key={solucao.id}
              custom={direcao}
              aria-hidden="true"
              className="absolute will-change-transform"
              style={{
                left: image.x,
                top: image.y,
                width: image.w,
                height: image.h,
              }}
              /*
               * A saída é uma **variant**, e não um objeto literal — porque só
               * uma variant recebe o `custom`, e é o `custom` que carrega a
               * direção.
               *
               * A primeira versão usava `exit={{ opacity: 0, x: -direcao * 48 }}`,
               * e ela errava a direção **na volta**: o `exit` do elemento que
               * sai é o do render antigo, com a direção antiga. Medido: indo
               * para trás, a arte saía pela esquerda (tx = −35) quando
               * devia sair pela direita. Com a variant, o `custom` do
               * `AnimatePresence` chega ao `exit` e a direção fica certa.
               */
              variants={{
                sai: (d: number) => ({
                  opacity: 0,
                  x: -d * SOLUTIONS_SLIDE.distance,
                }),
              }}
              initial={{ opacity: 0, x: direcao * SOLUTIONS_SLIDE.distance }}
              animate={{ opacity: 1, x: 0 }}
              exit="sai"
              transition={{
                duration: SOLUTIONS_SLIDE.duration,
                ease: SOLUTIONS_SLIDE.ease,
              }}
            >
              <Image
                src={active.image}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1920px) 1882px, 100vw"
                unoptimized
              />
            </motion.div>
          </AnimatePresence>

          {/*
            O badge. Cruza com a arte, sem se mover: ele está ancorado na
            janela, e é a ilustração que passa por baixo dele.
          */}
          <AnimatePresence initial={false} custom={direcao}>
            <motion.div
              key={solucao.id}
              custom={direcao}
              className="sol-badge absolute flex items-center justify-center rounded-[100px] border-2 border-nu-brand bg-nu-bg-secondary px-[22px] py-[10px]"
              style={{ left: active.badgeBox.x, top: active.badgeBox.y }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: SOLUTIONS_SLIDE.fade }}
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
              variants={revealUp}
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

      {/*
        As prévias das opções vizinhas.
      */}
      <Preview
        key="prev"
        slot={active.prev}
        lado="esquerda"
        direcao={direcao}
        indice={indice}
      />
      <Preview
        key="next"
        slot={active.next}
        lado="direita"
        direcao={direcao}
        indice={indice}
      />
    </section>
  );
}

/**
 * Prévia de uma opção vizinha, sangrando pela borda da seção.
 *
 * `aria-hidden` porque é decorativa — a informação que ela carrega é a de uma
 * opção vizinha, e essa informação está no seletor.
 *
 * O `blur` é do Figma (4,306 px) e fica no **contêiner**, não na imagem: no
 * design o desfoque é da camada, e é ele que produz a borda suave.
 */
function Preview({
  slot,
  lado,
  direcao,
  indice,
}: {
  slot: SolutionPreview | undefined;
  lado: "esquerda" | "direita";
  direcao: number;
  indice: number;
}) {
  if (!slot) return null;

  /*
   * O quadro é **ancorado pela borda** da seção, e não pela esquerda.
   *
   * A prévia é mais larga que a faixa visível e o que sobra sai do frame. Se
   * a âncora fosse a esquerda, abaixo de 1785 px de viewport a prévia ficaria
   * inteira fora da seção — e é a seção que recorta. Pela borda, o mesmo pixel
   * em 1920 e o pedaço continua visível em qualquer largura.
   */
  const posicao =
    lado === "direita"
      ? { right: -PREVIEW_OVERFLOW }
      : { left: -PREVIEW_OVERFLOW };

  return (
    <AnimatePresence initial={false} custom={direcao}>
      <motion.div
        key={indice}
        custom={direcao}
        aria-hidden="true"
        className="absolute overflow-clip"
        style={{
          ...posicao,
          top: slot.frame.y,
          width: slot.frame.w,
          height: slot.frame.h,
          borderRadius: PREVIEW_RADIUS,
          filter: `blur(${PREVIEW_BLUR}px)`,
        }}
        variants={revealFade}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0 }}
        transition={{ duration: SOLUTIONS_SLIDE.fade, ease: EASE_OUT_EXPO }}
      >
        {/*
          A arte dentro do quadro desliza na direção da troca. É ela que dá a
          leitura de carrossel: a arte que estava na borda é a mesma que entra
          na janela, e o olho segue o deslocamento.

          A saída é uma **variant** pelo mesmo motivo da arte da janela: só uma
          variant recebe o `custom` da direção.
        */}
        <motion.div
          custom={direcao}
          className="absolute"
          style={{
            left: slot.crop.x,
            top: slot.crop.y,
            width: slot.crop.w,
            height: slot.crop.h,
          }}
          variants={{
            sai: (d: number) => ({ x: -d * SOLUTIONS_SLIDE.distance }),
          }}
          initial={{ x: direcao * SOLUTIONS_SLIDE.distance }}
          animate={{ x: 0 }}
          exit="sai"
          transition={{
            duration: SOLUTIONS_SLIDE.duration,
            ease: SOLUTIONS_SLIDE.ease,
          }}
        >
          <Image
            src={slot.src}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1920px) 1553px, 100vw"
            unoptimized
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
