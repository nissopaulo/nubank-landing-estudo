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

/**
 * Reveal que desce do topo — usado no header, que ocupa a borda superior da
 * tela. Sobe (`revealUp`) parece errado num elemento que vem do céu.
 */
export const revealFromTop: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT_EXPO },
  },
};

/**
 * Abertura em leque dos cards da Hero.
 *
 * Cada card sai com `from` graus a mais do que a rotação final do design e
 * assenta nela, como uma folha de leque girando até o lugar. Como o Figma já
 * dá uma rotação diferente a cada card (-38° a +52°), somar um deslocamento
 * constante é o que faz o leque parecer fechado no início e aberto no fim.
 *
 * Só a rotação e o fade: sem `y` e sem `scale`. O card já nasce no tamanho e
 * na posição finais — ele não chega, ele *aparece*. Um deslocamento vertical
 * faria a entrada voltar a ler como "surgir", que foi o que se pediu para tirar
 * na primeira revisão. O `opacity` fica, porque o card precisa começar
 * escondido; ele é revelado pelo giro, e não por um efeito separado.
 *
 * `origin` fica perto da base de propósito: com o pivô no centro o card
 * apenas gira no lugar; perto da base ele bascula, e é o bascular que lê como
 * leque abrindo.
 */
export const FAN = {
  /** Ângulo inicial, em graus, somado à rotação final do card. */
  from: -18,
  /** Ponto de rotação — perto da base, para o card bascular. */
  origin: "50% 78%",
} as const;