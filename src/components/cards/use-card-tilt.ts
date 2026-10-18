"use client";

import { useCallback, useRef } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import { useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";

import { CARD_TILT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * A reação do cartão ao ponteiro, escutando a seção INTEIRA.
 *
 * ## Por que não no cartão
 *
 * O primeiro corte só escutava `pointermove` no próprio cartão, e o efeito ficava
 * concentrado numa caixa de 252×400 no meio de uma seção de 1920×1088. Passar o
 * mouse pela seção não produzia nada, e o cartão só reagia quando o ponteiro já
 * estava em cima dele — que é tarde para "o cartão te acompanha".
 *
 * Aqui o handler fica na `<section>` e o cartão responde a qualquer posição
 * dela. O que impede o cartão de ficar grudado é o `reach`: a resposta é
 * proporcional e se dissolve com a distância.
 *
 * ## A resposta é `direção × força`, e a força é a distância
 *
 * ```
 *   dentro do cartão          fora do cartão
 *   ┌───────────────┐         ····························  força 1
 *   │  força 1      │         ··                  ··           │  cai
 *   │               │         ··      força 0      ··           ↓  até 0
 *   └───────────────┘         ····························  força 0
 *         ↑ `reach` a partir da borda
 * ```
 *
 * A direção é normalizada contra a caixa do cartão e **saturada em ±1**: passando
 * do canto, a direção não continua crescendo, senão o cartão passaria do ângulo
 * máximo direto para o oposto, e o gesto viraria uma guinada.
 *
 * ## Tudo por MotionValue, sem re-render
 *
 * Cada `pointermove` escreve direto em motion values, e o React não renderiza a
 * seção nenhuma vez. O reflexo e a opacidade dele também são motion values, e a
 * opacidade chega ao CSS pela custom property `--cc-glare-strength` — se fosse
 * estado, a seção inteira renderizaria a cada quadro do mouse.
 */

export type CardTiltValues = {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  /** O gradiente do reflexo inteiro, já com a posição montada. */
  glareBackground: MotionValue<string>;
  /** 0–1: o quanto o ponteiro está perto, e o quanto o reflexo aparece. */
  glareOpacity: MotionValue<number>;
};

export type CardTilt = {
  /** Props para espalhar na `<section>` que deve escutar o ponteiro. */
  bind: {
    onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerLeave: () => void;
  };
  /**
   * Vai no cartão — é contra a caixa dele que a direção é calculada.
   *
   * Fica **fora** de `values` de propósito. A regra `react-hooks/refs` do
   * projeto proíbe acessar qualquer propriedade de um objeto que contenha uma
   * ref durante o render, porque ela não distingue "isto é um ref" de "isto
   * está ao lado de um ref". Separando, as motion values podem ser lidas no JSX
   * sem erro de lint — e sem desligar a regra.
   */
  cardRef: RefObject<HTMLDivElement | null>;
  values: CardTiltValues;
};

const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;

export function useCardTilt(): CardTilt {
  const reduceMotion = usePrefersReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // Ângulos finais, em graus. Escritos direto, e a mola fica por fora: assim o
  // `reset` volta ao repouso pelo mesmo caminho de ida.
  const angleX = useMotionValue(0);
  const angleY = useMotionValue(0);

  const rotateX = useSpring(angleX, CARD_TILT.spring);
  const rotateY = useSpring(angleY, CARD_TILT.spring);

  // Posição do reflexo, 0–1 dentro do cartão, saturada nas bordas.
  const glareRawX = useMotionValue(0.5);
  const glareRawY = useMotionValue(0.5);
  const glareX = useTransform(
    useSpring(glareRawX, CARD_TILT.glareSpring),
    (v) => `${v * 100}%`,
  );
  const glareY = useTransform(
    useSpring(glareRawY, CARD_TILT.glareSpring),
    (v) => `${v * 100}%`,
  );

  const glareOpacityRaw = useMotionValue(0);
  const glareOpacity = useSpring(glareOpacityRaw, CARD_TILT.glareSpring);

  /**
   * O gradiente inteiro como uma `MotionValue` de string.
   *
   * **Por que o gradiente vai por aqui e não por custom property.** A primeira
   * versão posicionava o reflexo com `--cc-glare-x` alimentada por motion value, e
   * o resultado foi o pior tipo de bug: sem erro, sem aviso, e o reflexo
   * simplesmente **não aparecia**. Nem `motion.span` resolveu — o
   * `useRender` do Motion passou o `style` direto ao React, que virou o objeto
   * em `[object Object]` no atributo. E como o `opacity` vinha de outra fonte, a
   * variável lia um valor e o `background` lia outro, então a checagem "o
   * `opacity` respondeu?" passava e o efeito não existia.
   *
   * `useMotionTemplate` monta a string final e a escreve em `backgroundImage`,
   * que é uma propriedade normal — não depende de o Motion saber tratar custom
   * property, e não dá para o React se meter no meio.
   *
   * Custo: um repaint do elemento por quadro, que é o mesmo custo de antes — o
   * gradiente teria de ser re-rasterizado de qualquer jeito, já que o ponto
   * luminoso se move. O que continua não existe é re-render do React.
   */
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.34), rgb(255 255 255 / 0.1) 36%, transparent 62%)`;

  const reset = useCallback(() => {
    angleX.set(0);
    angleY.set(0);
    glareRawX.set(0.5);
    glareRawY.set(0.5);
    glareOpacityRaw.set(0);
  }, [angleX, angleY, glareRawX, glareRawY, glareOpacityRaw]);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      // Só mouse. Em toque não existe "posição do ponteiro" para seguir, e o
      // `pointermove` de um dedo viraria o cartão a cada toque na tela.
      if (reduceMotion || event.pointerType !== "mouse") return;

      const card = cardRef.current;
      if (!card) return;

      const box = card.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;

      // Direção, saturada. `rotateY = -x` e `rotateX = +y`: a borda mais próxima
      // do ponteiro avança. Ver a conta em `CARD_TILT`.
      const nx = clamp((event.clientX - cx) / (box.width / 2), -1, 1);
      const ny = clamp((event.clientY - cy) / (box.height / 2), -1, 1);

      // Força: 1 dentro do cartão, caindo a zero `reach` depois da borda.
      const outX = Math.max(0, Math.abs(event.clientX - cx) - box.width / 2);
      const outY = Math.max(0, Math.abs(event.clientY - cy) - box.height / 2);
      const fora = Math.hypot(outX, outY);
      const forca = Math.max(0, 1 - fora / CARD_TILT.reach);

      angleY.set(-nx * CARD_TILT.maxY * forca);
      angleX.set(ny * CARD_TILT.maxX * forca);

      // O reflexo gruda na borda quando o ponteiro sai, em vez de continuar
      // correndo para fora: ele está preso à superfície do cartão, e um
      // gradiente que escapa da superfície denuncia que não é uma superfície.
      glareRawX.set(clamp((event.clientX - box.left) / box.width, 0, 1));
      glareRawY.set(clamp((event.clientY - box.top) / box.height, 0, 1));
      glareOpacityRaw.set(forca);
    },
    [
      reduceMotion,
      angleX,
      angleY,
      glareRawX,
      glareRawY,
      glareOpacityRaw,
    ],
  );

  return {
    bind: { onPointerMove: handlePointerMove, onPointerLeave: reset },
    cardRef,
    values: { rotateX, rotateY, glareBackground, glareOpacity },
  };
}