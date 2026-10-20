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
 * ## O que se move, e o que não
 *
 * Só a **arte** se move. O badge e o painel de texto ficam ancorados na janela,
 * e a ilustração desliza por baixo deles — que é o que faz a leitura ser de
 * "janela" e não de "cartão inteiro mexendo".
 *
 * ## A direção é medida contra a janela, e não contra a seção
 *
 * A janela é a peça que se move, então é contra ela que a direção é
 * normalizada. O **ouvinte** é a seção inteira, que é o que faz a resposta
 * começar já quando o ponteiro entra na seção — e não só quando ele chega em
 * cima da arte.
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
 * ## A força é a distância até a janela
 *
 * Dentro da janela a força é 1; fora, ela morre `reach` px depois da borda.
 * Sem isso a arte ficaria travada no deslocamento máximo assim que o ponteiro
 * saísse da caixa — e aí não parece reação, parece defeito. É o mesmo
 * mecanismo da inclinação do cartão de crédito.
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
  /** Props para espalhar na `<section>` que deve escutar o ponteiro. */
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

      const janela = document.querySelector<HTMLElement>(".sol-window");
      if (!janela) return;

      const box = janela.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;

      // Direção normalizada contra a janela e saturada em ±1: passando da
      // borda, a direção não continua crescendo — senão a arte passaria do
      // deslocamento máximo direto para o oposto, e o gesto viraria uma
      // guinada.
      const nx = clamp((event.clientX - cx) / (box.width / 2), -1, 1);
      const ny = clamp((event.clientY - cy) / (box.height / 2), -1, 1);

      // Força: 1 dentro da janela, caindo a zero `reach` depois da borda.
      const outX = Math.max(0, Math.abs(event.clientX - cx) - box.width / 2);
      const outY = Math.max(0, Math.abs(event.clientY - cy) - box.height / 2);
      const fora = Math.hypot(outX, outY);
      const forca = Math.max(0, 1 - fora / BACKGROUND_PARALLAX.reach);

      targetX.set(nx * BACKGROUND_PARALLAX.amplitudeX * forca);
      targetY.set(ny * BACKGROUND_PARALLAX.amplitudeY * forca);
    },
    [reduceMotion, targetX, targetY],
  );

  return {
    bind: { onPointerMove: handlePointerMove, onPointerLeave: reset },
    values: { x, y },
  };
}
