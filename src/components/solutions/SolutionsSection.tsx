"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";

import {
  ACTIVE_INDEX,
  PREVIEW_BLUR,
  PREVIEW_RADIUS,
  SOLUTIONS,
  WINDOW_H,
  WINDOW_RADIUS,
} from "@/lib/solutions";
import { revealFade, revealUp, staggerContainer } from "@/lib/motion";

/**
 * Solutions Section — Figma `Solutions Section - Safe` (nó `144:2`), 1920×1316.
 *
 * ## Só o primeiro frame está liberado
 *
 * O Figma tem quatro frames desta seção e **três continuam ocultos**: o
 * processo é um de cada vez, o mesmo dos quatro frames da Cards Section. As
 * quatro pílulas aparecem no seletor desde o começo — é o que o `144:2` mostra —
 * mas só a do Caixinhas responde. As outras três são `<button>` reais com
 * `aria-disabled` e aviso para leitor de tela, a mesma regra dos pilares do
 * Ecossystem e dos itens da navegação: **um botão que não faz nada não existe
 * em silêncio.**
 *
 * Nenhum texto, cor ou geometria foi inventado para as três. Quando o frame
 * entrar, o trabalho é preencher o campo `active` em `lib/solutions.ts` e
 * nada mais muda aqui.
 *
 * ## Três âncoras diferentes, e por quê
 *
 * O Figma posiciona as peças em três referenciais distintos, e confundi-los
 * desloca tudo:
 *
 * | Peça              | Âncora no Figma        | Por quê                              |
 * |-------------------|------------------------|--------------------------------------|
 * | badge e painel    | `Main Content` (`144:3`) | mesma largura da janela, 256 px acima |
 * | prévia desfocada  | a **seção**            | é irmã do `Main Content`, não filha   |
 * | seletor de pílulas | o fluxo da seção       | centralizado, não posicionado        |
 *
 * O badge e o painel são posicionados **pela janela**, e não pelo `Main
 * Content`: a janela tem a mesma largura e começa 256 px mais abaixo, então
 * `(1330, 298)` no `Main Content` é `(1330, 42)` na janela. Ancorar na janela
 * deixa a composição ligada à imagem — e é o que faz o resultado bater com o
 * Figma mesmo com o título renderizando 0,16 px mais alto (o `leading-[1.22]`
 * do projeto contra o `leading: normal` do design).
 *
 * A prévia é a exceção: no Figma ela é **irmã** do `Main Content`, então a
 * origem da coordenada é a seção, e não a janela. Ancorá-la na janela a
 * empurraria 200 px para a direita — para fora do frame de 1920, onde ela
 * sumiria por completo.
 *
 * ## A prévia é a próxima opção, não uma decoração
 *
 * No frame do Safe a prévia desfocada é a imagem do **Conta e Pix**, que é a
 * imagem principal do frame `151:92`. É a mesma ideia do card recolhido da
 * Ecossystem: o que vem depois aparece ao lado.
 *
 * ## O CTA é um link de texto, e não um `CtaLink`
 *
 * O `CtaLink` tem um `BASE` com `px-[18px] py-2.5` e `rounded-full`, e o
 * design deste CTA é só o texto com o caret — sem fundo e sem padding. Acrescentar
 * uma variante ao `CtaLink` brigaria com o `BASE` no CSS gerado (utilitários
 * base vencem utilitários base), então o link é montado aqui, com o mesmo
 * tratamento de link externo que o `CtaLink` faz.
 */
export function SolutionsSection() {
  const solution = SOLUTIONS[ACTIVE_INDEX];
  const active = solution.active;

  /*
   * O `active` ausente é o estado de "frame ainda não liberado". Ele existe
   * para a regra acima valer de forma mecânica, e não por commento.
   */
  if (!active) return null;

  const image = active.imageBox;
  const preview = active.previewBox;
  const previewImage = active.previewImageBox;

  return (
    <section
      id="solucoes"
      aria-labelledby="solucoes-titulo"
      className="relative flex flex-col items-center gap-[100px] overflow-clip bg-white px-[200px] py-[100px]"
    >
      {/*
        `overflow-clip` na seção porque a prévia desfocada vai **além** da
        borda direita: ela começa em 1784,56 e tem 1308,889 de largura, ou seja,
        termina em 3093,45 — 1173 px fora do frame de 1920. No Figma o frame
        recorta; aqui é a seção que recorta. Sem isso a página ganharia uma
        barra de rolagem horizontal.
      */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer(0.09)}
        className="flex w-full flex-col gap-[100px]"
      >
        <motion.h2
          id="solucoes-titulo"
          variants={revealUp}
          className="font-display text-[64px] font-bold leading-[1.22] text-nu-brand"
        >
          Cada objetivo
          <br />
          merece seu espaço.
        </motion.h2>

        {/*
          A janela da imagem. `relative` porque é a âncora do badge e do painel
          de texto, e `overflow-clip` porque é ela que recorta a imagem, como
          no Figma.
        */}
        <motion.div
          variants={revealUp}
          className="sol-window relative w-full overflow-clip"
          style={{ height: WINDOW_H, borderRadius: WINDOW_RADIUS }}
        >
          {/*
            A imagem não é dimensionada pela janela: o Figma a põe num
            retângulo maior (1882,348 × 1020,567 a partir de −289, −118) e deixa
            a janela recortar. É o que dá o enquadramento da arte, e o mesmo
            motivo pelo qual a sombra dos cards da Hero vai na `<img>` e não
            na caixa do slot.
          */}
          <div
            aria-hidden="true"
            className="absolute"
            style={{ left: image.x, top: image.y, width: image.w, height: image.h }}
          >
            <Image
              src={active.image}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1920px) 1882px, 100vw"
              unoptimized
            />
          </div>

          {/*
            O badge. `revealFade` e não `revealUp`: ele é posicionado em
            absoluto dentro da janela, que já está subindo com o reveal — e
            somar os dois deslocamentos o faria andar 48 px em vez de 24.

            **O padding é 22 e não 24.** No Figma (`151:75`) o quadro tem 148 de
            largura e o texto fica a 24 da borda: 2 do traço + 22 de padding.
            O `border` do CSS **soma na caixa**, e o traço do Figma não — o
            auto-layout do Figma exclui o traço do tamanho. Sem compensar, o
            badge sairia 4 px mais largo (151,27 contra 148) e o texto
            2 px mais para a direita.
          */}
          <motion.div
            variants={revealFade}
            className="sol-badge absolute flex items-center justify-center rounded-[100px] border-2 border-nu-brand bg-nu-bg-secondary px-[22px] py-[10px]"
            style={{ left: active.badgeBox.x, top: active.badgeBox.y }}
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

          {/*
            O painel de texto.

            A **largura** é declarada porque o conteúdo é quebrado em linhas
            explícitas: sem ela a caixa encolheria até a linha mais comprida.
            A altura não é — no Figma ela é a sobra do auto-layout (235 px), e
            declará-la com `overflow-clip` passaria a cortar o CTA por uma
            fração de pixel, já que o `leading` do projeto não é o do Figma.
          */}
          <motion.div
            variants={revealFade}
            className="sol-textbox absolute flex flex-col items-start gap-[64px] rounded-[42px] bg-nu-bg-secondary px-[42px] py-[32px]"
            style={{ left: active.textBox.x, top: active.textBox.y, width: active.textBox.w }}
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
        </motion.div>
      </motion.div>

      {/*
        O seletor. `role="tablist"` porque trocar de opção troca o **conteúdo
        inteiro** da seção — é a mesma relação de substituição da Cards
        Section, e é o que faz o leitor de tela anunciar "Caixinhas, aba 1 de
        4" em vez de quatro botões sem relação.
      */}
      <motion.div
        role="tablist"
        aria-label="Escolher a solução"
        aria-orientation="horizontal"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer(0.06)}
        className="sol-nav flex items-start gap-[24px]"
      >
        {SOLUTIONS.map((item, index) => (
          <SolutionTab
            key={item.id}
            label={item.label}
            selected={index === ACTIVE_INDEX}
            liberado={Boolean(item.active)}
          />
        ))}
      </motion.div>

      {/*
        A prévia desfocada da opção seguinte.

        `aria-hidden` porque é decorativa — a informação que ela carrega é a
        de uma opção que ainda não está liberada.

        O `blur` é do Figma (4,306 px) e fica no **contêiner**, não na imagem:
        no design o desfoque é da camada, e é ele que produz a borda suave.

        **Ancorada pela direita, não pela esquerda.** No Figma a borda esquerda
        dela fica em 1784,56 num frame de 1920, então só 135,44 px aparecem. Se
        a âncora fosse a esquerda, abaixo de 1785 px de viewport a prévia
        ficaria inteira fora da seção — e é a seção que recorta. Pela direita,
        o mesmo pixel em 1920 e o pedaço continua visível em qualquer largura.

        **`amount: "some"` e não 0,25.** O `IntersectionObserver` herda o
        recorte do `overflow-clip` da seção: a prévia tem 1308,889 de largura
        mas só 135,44 são visíveis, e a razão fica em 10,3% — nunca alcançando
        os 25%, que é o que a deixou em `opacity: 0` para sempre.
      */}
      <motion.div
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: "some" }}
        variants={revealFade}
        className="sol-preview absolute overflow-clip"
        style={{
          right: -active.previewOverflowRight,
          top: preview.y,
          width: preview.w,
          height: preview.h,
          borderRadius: PREVIEW_RADIUS,
          filter: `blur(${PREVIEW_BLUR}px)`,
        }}
      >
        <div
          className="absolute"
          style={{
            left: previewImage.x,
            top: previewImage.y,
            width: previewImage.w,
            height: previewImage.h,
          }}
        >
          <Image
            src={active.preview}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1920px) 1553px, 100vw"
            unoptimized
          />
        </div>
      </motion.div>
    </section>
  );
}

/**
 * Pílula do seletor.
 *
 * `aria-disabled` nas opções cujo frame ainda não foi liberado, com o aviso em
 * `sr-only` — sem ele o botão seria focável e não faria nada. `aria-selected`
 * só na que existe, porque é nela que a troca acontece de verdade.
 */
function SolutionTab({
  label,
  selected,
  liberado,
}: {
  label: string;
  selected: boolean;
  liberado: boolean;
}) {
  return (
    <motion.button
      type="button"
      role="tab"
      aria-selected={liberado ? selected : undefined}
      aria-disabled={!liberado}
      variants={revealUp}
      /*
       * **O padding é 17 e não 18 nas pílulas com borda.**
       *
       * No Figma (`151:86`) o quadro tem 129 de largura e o texto fica a 18 da
       * borda: 1 do traço + 17 de padding. O `border` do CSS soma na caixa e o
       * traço do Figma não sai no auto-layout — então, sem compensar, a pílula
       * teria 131 de largura e 42 de altura, contra 129 e 40 do design.
       *
       * A pílula ativa não tem traço no Figma (`151:84`), e por isso o padding
       * dela é o do Figma, 18. As duas continuam com a **mesma caixa**, que é o
       * que faz o seletor não "pular" quando o estado muda.
       */
      className={`sol-pill shrink-0 whitespace-nowrap rounded-[100px] font-display text-[16px] font-semibold leading-[1.25] ${
        selected
          ? "bg-nu-brand px-[18px] py-[10px] text-white"
          : "border border-nu-brand px-[17px] py-[9px] text-nu-brand"
      }`}
    >
      {label}
      {!liberado && (
        <span className="sr-only">— ainda não implementado neste estudo</span>
      )}
    </motion.button>
  );
}
