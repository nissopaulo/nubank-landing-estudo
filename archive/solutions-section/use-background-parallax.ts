"use client";

import { useCallback } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useMotionValue, useSpring } from "motion/react";
import type { MotionValue } from "motion/react";

import { BACKGROUND_PARALLAX } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * A arte de fundo da Solutions Section responde ao ponteiro.
 *
 * ## O escopo é a JANELA, e não a seção
 *
 * O ouvinte está na janela da imagem, e não na seção. Isso é o que limita o
 * efeito àquela "tela": passar o ponteiro pelo título ou pelas pílulas não
 * move a arte, e a resposta só existe enquanto o ponteiro está sobre a
 * imagem.
 *
 * A consequência é que **a força virou 1 dentro da janela** e não há mais
 * `reach`: com o ouvinte na própria janela, o ponteiro nunca está fora dela
 * quando o handler roda, e uma distância de alcance seria um número morto.
 * O que modula a resposta é só a **direção**, que cresce do centro para as
 * bordas.
 *
 * ## O que se move, e o que não
 *
 * Só a **arte** se move. O badge e o painel de texto ficam ancorados na janela,
 * e a ilustração desliza por baixo deles — que é o que faz a leitura ser de
 * "janela" e não de "cartão inteiro mexendo".
 *
 * ## O sinal é o do pedido: a arte vai PARA ONDE o ponteiro está
 *
 * `x = +nx * amplitude`. A arte e o conteúdo andam juntos — estão pintados
 * um no outro —, então mover a arte para a direita move o porquinho para a
 * direita, e é isso que faz a leitura de "o fundo me segue".
 *
 * O sinal contrário (o parallax clássico, em que a cena parece recuar do
 * cursor) é trocar um sinal: `x = -nx * amplitude`. Foi medido e olhado nos
 * dois sentidos antes de escolher — com o sinal invertido, a moldura do quadro
 * na árvore saía pela borda esquerda da janela, que é o oposto de "segue".
 *
 * ## Cortado por `prefers-reduced-motion`
 *
 * O corte é no **handler**, e não no `MotionConfig`: este é um motion value,
 * não uma animação, e o `MotionConfig` não governa motion values. Quem pede
 * menos movimento não vê a arte se mexer.
 */

export type BackgroundParallaxValues = {
  /** Deslocamento horizontal da arte, em px. */
  x: MotionValue<number>;
  /** Deslocamento vertical da arte, em px. */
  y: MotionValue<number>;
};
export type BackgroundParallax = {
  /** Props para espalhar na janela que contém a arte. */
  bind: {
    onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
    onPointerLeave: () => void;
  };
  /** Só as motion values, para o JSX ler sem esbarrar na regra de refs. */
  values: BackgroundParallaxValues;
};

const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v;

export function useBackgroundParallax(): BackgroundParallax {
  const reduceMotion = usePrefersReducedMotion();

  // Alvo e valor animado são separados: a mola fica entre eles, e é a mola que
  // faz a arte chegar depois do gesto.
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);

  const x = useSpring(targetX, BACKGROUND_PARALLAX.spring);
  const y = useSpring(targetY, BACKGROUND_PARALLAX.spring);

  const reset = useCallback(() => {
    targetX.set(0);
    targetY.set(0);
  }, [targetX, targetY]);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      // Só mouse. Em toque não existe "posição do ponteiro" para seguir, e o
      // `pointermove` de um dedo viraria a arte a cada toque na tela.
      if (reduceMotion || event.pointerType !== "mouse") return;

      // A caixa é a do **próprio elemento que escuta** — a janela. Não precisa
      // de `querySelector` no documento: o `currentTarget` do evento é
      // exatamente a caixa que contém a arte.
      const box = event.currentTarget.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;

      // Direção normalizada contra a janela e saturada em ±1. A saturação
      // importa pouco aqui (com o ouvinte na janela, o ponteiro nunca sai
      // dela), mas ela é a rede de segurança contra uma janela degenerada.
      const nx = clamp((event.clientX - cx) / (box.width / 2), -1, 1);
      const ny = clamp((event.clientY - cy) / (box.height / 2), -1, 1);

      targetX.set(nx * BACKGROUND_PARALLAX.amplitudeX);
      targetY.set(ny * BACKGROUND_PARALLAX.amplitudeY);
    },
    [reduceMotion, targetX, targetY],
  );

  return {
    bind: { onPointerMove: handlePointerMove, onPointerLeave: reset },
    values: { x, y },
  };
}
