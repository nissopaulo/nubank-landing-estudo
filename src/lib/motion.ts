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

/**
 * Vocabulário de movimento ainda sem uso — 2026-10-18.
 *
 * `EASE_OUT_QUINT` e `springSoft` estão exportados e **nenhum componente os usa
 * hoje**; `revealScale` saiu desta lista em 2026-10-18, quando a Cards Section
 * passou a usar ele na entrada do cartão.
 *
 * Os dois que ficam estão aqui de propósito: as seções `Porque a Nu` e
 * `Diferenciais` ainda vão ser desenhadas, e mola amortecida é o que costuma
 * pedir nelas.
 *
 * Estão aqui documentados como tal porque export morto sem explicação se confunde
 * com esquecimento. **Se uma seção passar sem nenhum dos dois, apague** — código
 * que ninguém usa não é biblioteca, é dívida. O lint não pega export não
 * importado, então essa revisão é manual.
 */
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

/**
 * Inclinação do cartão de crédito sob o ponteiro (Cards Section).
 *
 * Concentrado aqui, e não no componente, pelo mesmo motivo do `FAN`: são os
 * números que se ajustam enquanto a sensação está sendo calibrada, e eles
 * mudam juntos.
 *
 * ## Os ângulos são pequenos de propósito
 *
 * `maxY: 12°` e `maxX: 9°`. Acima disso o cartão passa a parecer um painel de
 * windshield em vez de um cartão bancário — e o alvo é um cartão bancário.
 *
 * ## O alcance é o que faz a interação parecer com a seção
 *
 * `reach: 460px` é a distância, a partir da borda do cartão, em que a resposta
 * morre. O ponteiro é seguido na **seção inteira**, não no cartão: passando pela
 * seção o cartão já responde, e a resposta se dissolve conforme o ponteiro se
 * afasta.
 *
 * Sem o `reach` o cartão fica travado no ângulo máximo assim que o ponteiro sai
 * da sua caixa — e aí não parece reação, parece defeito. Com ele, a inclinação
 * é uma coisa só em toda a seção, e o cartão volta ao repouso antes de a
 * seção acabar.
 *
 * 460px é quase duas vezes a largura do cartão: perto o bastante para a seção
 * inteira estar no raio de ação, longe o bastante para o cartão não ficar
 * grudado no ponteiro.
 *
 * ## A mola é o que dá o peso
 *
 * `stiffness: 220 / damping: 26` no cartão acompanha o ponteiro rápido o bastante
 * para parecer resposta, e ainda entrega um leve atraso na volta. Sem mola, o
 * cartão gruda no cursor e o efeito fica plástico; com mola fraca demais, ele
 * chacoalha atrás do mouse e deixa de ler como objeto.
 *
 * O `glareSpring` é mais frouxo de propósito: o reflexo é a parte que **segue**
 * o ponteiro, e a mola dele tem que ser visivelmente mais lenta que a do
 * cartão. Com a mesma mola os dois se movem juntos e o reflexo parece grudado
 * na imagem, não numa superfície.
 *
 * ## Os dois eixos têm sinal oposto, e é proposital
 *
 * `rotateY = -x` e `rotateX = +y`, com `x`/`y` normalizados na direção do
 * ponteiro. A conta é a da mão direita de CSS: `rotateX(+θ)` traz a **base** para
 * quem olha e joga o topo para trás, e `rotateY(+θ)` traz a **esquerda** para
 * quem olha e joga a direita para trás.
 *
 * O que se quer é o oposto nos dois: a borda mais próxima do ponteiro avança, e
 * a outra recua. Com o sinal trocado o cartão afunda na direção do mouse, que
 * é o gesto de quem pressiona — não o de quem acompanha.
 */
export const CARD_TILT = {
  /** Inclinação máxima no eixo Y (o cartão acompanha o ponteiro na horizontal). */
  maxY: 12,
  /** Inclinação máxima no eixo X (na vertical). */
  maxX: 9,
  /** Distância da borda do cartão em que a resposta morre, em px. */
  reach: 460,
  spring: { stiffness: 220, damping: 26, mass: 0.6 },
  glareSpring: { stiffness: 120, damping: 26, mass: 0.7 },
} as const;

/**
 * A meia-volta do cartão, quando a pílula troca de pilar.
 *
 * Não é `EASE_EMPHASIZED`, e a curva é própria por uma razão medida: **as duas
 * curvas são a curva de entradas, não a de uma rotação de 180°.**
 *
 * ## O defeito de `EASE_EMPHASIZED` aqui
 *
 * Medido no navegador, com a transição ancorada no `transitionrun`:
 *
 * | momento | quanto do giro já foi feito, com `EASE_EMPHASIZED` |
 * |---------|------------------------------------------------------|
 * | 100ms   | 43%                                                    |
 * | 133ms   | 70%                                                    |
 * | 284ms   | 93%                                                    |
 * | 417ms   | 98%                                                    |
 * | 567ms   | 100%                                                   |
 *
 * O cartão **passa de perfil aos 16% da duração** — 112ms de 700ms. A troca de
 * frente e verso acontece ali, e o que sobra são 500ms arrastando nos últimos
 * 7% do giro. É o "transição ruim": não é lenta, é o contrário — ela resolve o
 * gesto em um quinto do tempo e depois finge que continua.
 *
 * O ponto de 90° não é detalhe: é o instante em que o cartão é mais estreito na
 * tela (a largura projetada é `w·cos θ`, zero aos 90°), e é onde frente e verso
 * trocam de vez. Fora do meio, o gesto não lê como "virou o cartão".
 *
 * ## A curva escolhida
 *
 * `cubic-bezier(0.75, 0.75, 0.8, 1)` põe os 90° em **48%** da duração e mantém
 * um pouso amortecido. Saiu de uma busca em grade, não do gosto: entre as curvas
 * que passam pelo meio, é a de maior arranque nos primeiros 50ms com
 * `y₂ ≥ 0.85` — ou seja, que chega tangenciando o fim em vez de parar de seco.
 *
 * ## O conflito, e por que ele é resolvido assim
 *
 * Com uma Bézier só, **"responde no clique" e "troca no meio" puxam em direções
 * opostas**, e nenhuma curva satisfaz os três pedidos ao mesmo tempo. A grade
 * confirma: exigindo 90° entre 45% e 52%, pouso com `y₂ ≥ 0.85` e cauda até 95%
 * da duração, o conjunto de soluções é **vazio**.
 *
 * O que se sacrifica é o arranque: `EASE_EMPHASIZED` já tem 18% do giro aos
 * 50ms, e a curva escolhida tem 7% — cerca de 12°, visível no terceiro quadro.
 * É a escolha certa porque o atraso é de ~3 quadros e não se vê, enquanto os
 * 500ms de arrasto se vêem.
 *
 * ## A perceção do giro não é linear no ângulo
 *
 * A largura projetada é `w·|cos θ|`: o cartão **estreita** de 0° a 90° e
 * **alarga** de 90° a 180°, simétrico em torno dos 90°. Por isso uma curva
 * praticamente linear acompanha melhor o movimento percebido do que uma ease-out,
 * que acerta a primeira metade e erra a segunda.
 */
export const CARD_FLIP = {
  /**
   * Duração de **uma metade** da meia-volta, em segundos.
   *
   * A meia-volta são duas transições de 90° em 90°, e não uma de 180°, porque o
   * Firefox não cull a face de costas e as duas ficam pintadas durante o giro
   * inteiro. A troca de qual delas está pintada acontece no `transitionend` da
   * primeira metade — nos 90°, onde as duas estão de perfil e a largura projetada
   * é zero, então a troca não aparece.
   *
   * Como são duas, cada uma leva metade: 0,35s + 0,35s = 0,7s de giro, que é o
   * `DURATION.base` que a meia-volta teria com uma transition só.
   *
   * E a curva é a mesma nas duas, o que coloca uma quebra de velocidade exatamente
   * nos 90° — onde o cartão tem largura zero. A desaceleração de uma metade e a
   * aceleração da seguinte acontecem no ponto morto.
   */
  half: DURATION.fast,
  ease: "cubic-bezier(0.75, 0.75, 0.8, 1)",
} as const;