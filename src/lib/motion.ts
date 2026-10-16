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
 * `y` é o detalhe que define a animação. O card **nasce renderizado, opaco e
 * no tamanho final**, mas em `y` abaixo da Hero, de onde o `overflow-clip` da
 * seção o esconde. O leque o traz para dentro da tela. Sem `opacity` e sem
 * `scale`: um fade faria o card *surgir* em vez de *chegar*, que foi
 * justamente o que se pediu para tirar.
 *
 * O deslocamento é em porcentagem **da própria altura do card**, que resolve
 * pela cadeia de alturas do slot (o slot tem `aspect-ratio`). 150% é folgado
 * de propósito: em 16:9 um card precisa de 34% a 58% do próprio tamanho para
 * passar da borda inferior da Hero, e viewport mais alta que 16:9 exige mais
 * ainda. Com 100% bastaria em 1920×1080 e vazaria em telas altas.
 *
 * `origin` fica perto da base de propósito: com o pivô no centro o card
 * apenas gira no lugar; perto da base ele bascula, e é o bascular que lê como
 * leque abrindo.
 */
export const FAN = {
  /** Ângulo inicial, em graus, somado à rotação final do card. */
  from: -18,
  /** Quanto o card começa abaixo da Hero, em % da altura dele. */
  y: "150%",
  /** Ponto de rotação — perto da base, para o card bascular. */
  origin: "50% 78%",
} as const;