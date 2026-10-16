import type { Transition, Variants } from "motion/react";

/**
 * Curvas e durações compartilhadas.
 *
 * O Figma deste projeto não define animação (consulta de motion retornou
 * vazia), então o movimento foi desenhado daqui em diante no espírito Apple:
 * entrada longa, saída muito amortecida, nada "elástico" demais.
 */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
} as const;

export const springSoft: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 22,
  mass: 0.9,
};

/** Reveal genérico: sobe e aparece. Base de quase todo reveal da página. */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO },
  },
};

/** Reveal com escala, para elementos que "entram em foco". */
export const revealScale: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO },
  },
};

/** Container que escalona os filhos revealed. */
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});