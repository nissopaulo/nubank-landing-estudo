/**
 * Motion da Solutions Section **arquivada**.
 *
 * O carrossel que morava em `src/lib/motion.ts` saiu da página em 2026-10-20 e
 * foi para o arquivo. Estes dois blocos-travelam com ele: o `BACKGROUND_PARALLAX`
 * é usado pelo `use-background-parallax.ts` daqui do lado, e o `SOLUTIONS_SLIDE`
 * não é usado por ninguém — ficou para trás quando o carrossel foi refeito e
 * nunca mais voltou.
 *
 * A Solutions Section **nova** (nó `178:205`, quadro de 2026-10-20) é outra
 * coisa: a arte é o fundo da seção inteira, não uma janela, e a sua animação
 * está em `SOLUTIONS_CROSSFADE`, no `src/lib/motion.ts`.
 */

/**
 * A arte de fundo da Solutions Section responde ao ponteiro.
 *
 * ## A amplitude não é livre — a janela corta a arte
 *
 * No Figma a imagem **não** é dimensionada pela janela: ela é maior e fica
 * deslocada, e é a janela que recorta. Em `144:2` a arte ocupa 1882,348 ×
 * 1020,567 a partir de (−289, −118) dentro de uma janela de 1520 × 720.
 *
 * A margem disponível é, portanto, assimétrica, e é ela que limita o
 * deslocamento:
 *
 * | direção | quanto a arte aguenta antes de appear a borda |
 * |---|---|
 * | para a esquerda | **73,348 px** (a borda direita encosta na janela) |
 * | para a direita   | 289 px |
 * | para cima       | 182,567 px |
 * | para baixo      | 118 px |
 *
 * A amplitude horizontal de 14 px usa 19% da folga mais apertada. Acima de
 * 73 px a borda direita da arte apareceria — e é por isso que o valor está
 * aqui, num lugar só.
 *
 * ## O alcance sumiu, e o motivo é o escopo
 *
 * A primeira versão ouvia o ponteiro na **seção**, com a força morrendo 240 px
 * depois da borda da janela. O ouvinte agora está na **janela**, que é o que
 * limita o efeito àquela tela: passar pelo título ou pelas pílulas não move
 * a arte.
 *
 * Com o ouvinte na própria janela, o ponteiro nunca está fora dela quando o
 * handler roda — e um `reach` seria um número morto. O que modula a resposta
 * é só a direção, que cresce do centro para as bordas.
 *
 * ## A mola é o que faz o movimento parecer vivo
 *
 * Sem mola a arte grudaria no cursor, como um adesivo. Com mola, ela chega
 * depois e volta antes — e é esse atraso entre o gesto e a resposta que dá a
 * sensação de objeto pesado.
 *
 * O amortecimento é ligeiramente **superamortecido** (ζ ≈ 1,12): sem overshoot,
 * porque uma ilustração grande que oscila parece emperra e não viva.
 *
 * ## O sentido é o do pedido
 *
 * A arte vai **para onde o ponteiro está**, e o conteúdo dela junto. O sinal
 * contrário — o parallax clássico, em que a cena recua do cursor — é trocar um
 * sinal em `use-background-parallax.ts`. Foi medido e olhado nos dois
 * sentidos antes de escolher.
 */
export const BACKGROUND_PARALLAX = {
  /**
   * Amplitude horizontal máxima, em px.
   *
   * **Foi reduzida duas vezes: 44 → 26 → 14.** O movimento precisa existir,
   * mas a sensação pedida foi sempre de *suavidade*, não de resposta: 44 px
   * numa janela de 1520 passava de "a arte acompanha o mouse" para "a arte está
   * sendo arrastada", e 26 ainda era mais do que o olho seguia sem notar.
   */
  amplitudeX: 14,
  /**
   * Amplitude vertical máxima, em px.
   *
   * Reduzida na mesma proporção da horizontal: 28 → 16 → 9.
   */
  amplitudeY: 9,
  /**
   * A mola ficou **mais lenta** a cada ajuste.
   *
   * `stiffness` 120 → 90 → 70 deixa a arte demorar mais a chegar, e a `mass`
   * 0,8 → 0,9 aumenta a inércia. O `damping` acompanha para manter o
   * amortecimento relativo: ζ ≈ 1,32, ou seja, bem amortecida e **sem
   * overshoot** — uma ilustração grande que oscila parece emperra e não viva.
   */
  spring: { stiffness: 70, damping: 21, mass: 0.9 },
} as const;

/**
 * A troca de opção da Solutions Section.
 *
 * ## A seção é um carrossel, e a arte sai da borda para a janela
 *
 * Quando a opção troca, **tudo anda na mesma direção**: a arte que estava na
 * prévia da direita entra na janela, a que estava na janela sai para a prévia
 * da esquerda, e uma nova entra pela direita. É o gesto de um carrossel, e é
 * o que faz a troca ser lida como "a imagem saiu de lá e veio para cá" em vez
 * de "o conteúdo foi trocado".
 *
 * ## O deslocamento é curto, e por um motivo geométrico
 *
 * 48 px é o maior deslocamento que a prévia da direita aguenta sem invadir a
 * janela: a prévia começa em 1784,556 e a janela termina em 1720, e a folga
 * é de 64,56 px. Passar dela faria a prévia desfocada invadir a arte nítida.
 *
 * ## A curva é a enfática
 *
 * A mesma do resto do projeto em trocas de conteúdo: ela é rápida no começo
 * (o clique responde na hora) e chega tangenciando o fim (sem corte seco).
 */
export const SOLUTIONS_SLIDE = {
  /** Distância do deslocamento horizontal, em px. */
  distance: 48,
  /** Duração do deslize da arte, em segundos. */
  duration: 0.6,
  ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
  /** Duração do cross-fade das prévias, em segundos. */
  fade: 0.4,
  /** Duração da saída do painel de texto, em segundos. */
  textExit: 0.22,
} as const;
