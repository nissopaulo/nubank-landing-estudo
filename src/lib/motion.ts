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

/**
 * Curva de desaceleração enfática — a mesma do Material 3.
 *
 * Existe por causa de uma medição, não por gosto. `EASE_OUT_EXPO` é a curva
 * certa para entradas curtas (cards da Hero, 24px de deslocamento), mas na
 * pessoa do Ecossystem ela **desfaz a própria duração**: o percurso é de 843px
 * e o expo põe 82% dele nos primeiros 375ms de 1500ms. O que sobra é 1,1s de
 * arrasto de 5% — movimento lento demais para ser lido como movimento, e longo
 * demais para ser lido como repouso. Foi exatamente por isso que subir de 1,1s
 * para 1,5s quase não mudou nada: com uma curva desse formato, duração e
 * velocidade percebida não são a mesma coisa, e aumentar a primeira só
 * comprimenta a cauda.
 *
 * Comparando as duas no mesmo instante (fração da distância percorrida):
 *
 * | fração do tempo | expo | enfática |
 * |-----------------|------|----------|
 * | 17%             | 65%  | 53%      |
 * | 25%             | 78%  | 77%      |
 * | 40%             | 91%  | 92%      |
 * | 74%             | 99,9%| 99%      |
 *
 * A diferença está no meio do trajeto, que é onde o olho acompanha. A enfática
 * mantém o arranque rápido — resposta imediata ao clique, o que faz o gesto
 * parecer dinâmico — e distribui o resto do caminho de forma que a chegada é
 * suave, sem a cauda arrastada do expo.
 */
export const EASE_EMPHASIZED = [0.32, 0.72, 0, 1] as const;

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
 * Entrada da pessoa do Ecossystem, de baixo para cima.
 *
 * O deslocamento é em porcentagem **da altura da própria imagem**, e o
 * esconde não é `opacity`: é a posição. A pessoa nasce 100% da própria altura
 * abaixo, de onde o `overflow-clip` do `Main Content` a recorta — ela está
 * renderizada o tempo todo, e é só a translação que a traz para a vista.
 *
 * Por que 100% basta aqui, quando os cards da Hero precisam de 150%: a pessoa
 * tem 843px de altura e a janela de recorte tem 595px, então qualquer
 * deslocamento acima de ~70% já a põe inteiramente fora da tela. A folga é de
 * propósito — se o card ou a viewport mudarem de proporção, sobra margem.
 *
 * `exit` é o caminho espelho: a pessoa que sai desce e some. Ele roda a cada
 * troca de pilar — é o `AnimatePresence` no `EcosystemSection` que mantém a
 * antiga montada enquanto a nova entra, e por isso as duas se cruzam em vez de
 * se cortarem.
 */

/**
 * Duração da subida, em segundos.
 *
 * Tem valor próprio, e não `DURATION.slow`, por dois motivos. O primeiro é de
 * medida: a pessoa percorre 843px, quase o dobro do deslocamento dos cards da
 * Hero, então o mesmo tempo cobre uma distância maior e a velocidade sobe. O
 * segundo é de escopo: `DURATION.slow` também governa o `revealUp` da Hero e o
 * texto da seção, e afinar a entrada dela junto para acompanhar a pessoa
 * mudaria duas telas que estão aprovadas.
 *
 * 1,1s lia como "colocada". Com `EASE_OUT_EXPO`, aumentar para 1,5s **não**
 * resolveu — ver `EASE_EMPHASIZED`, que é a correção de verdade: a curva, não
 * o número. Com a curva enfática os 1,5s valem 1,5s.
 */
const PERSON_RISE = 1.5;

export const personRise: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: { duration: PERSON_RISE, ease: EASE_EMPHASIZED },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: { duration: DURATION.base, ease: EASE_EMPHASIZED },
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