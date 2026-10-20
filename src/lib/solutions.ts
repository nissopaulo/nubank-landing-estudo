/**
 * Opções da Solutions Section.
 *
 * ## O que existe no Figma
 *
 * Quatro frames, todos desenhados:
 *
 * | Opção         | Frame   | Nó        | Estado |
 * |---------------|---------|-----------|--------|
 * | Caixinhas     | Safe    | `144:2`   | liberado |
 * | Conta e Pix   | —       | `151:92`  | oculto |
 * | Investimentos | —       | `153:125` | oculto |
 * | Empréstimos   | —       | `153:167` | oculto |
 *
 * (No Figma os três últimos estão **todos** nomeados "Solutions Section -
 * Account" — a identidade deles vem do badge, não do nome do frame.)
 *
 * Só o primeiro está liberado, e é o mesmo processo dos quatro frames da Cards
 * Section: um de cada vez, os outros presentes no seletor mas sem resposta.
 *
 * ## A ausência de `active` é o que marca a opção
 *
 * Não existe flag separada. A opção sem `active` aparece no seletor, não é
 * clicável e avisa o leitor de tela — a mesma regra dos pilares do Ecossystem
 * e dos itens da navegação. Nenhum texto, cor ou geometria foi inventado para
 * elas.
 *
 * ## Geometria
 *
 * Todos os valores vêm do frame, em px do canvas de 1920, e foram conferidos
 * **contra o render do Figma**, não só contra a árvore de nós:
 *
 * | Elemento            | Figma                  | Medido no render      |
 * |---------------------|------------------------|-----------------------|
 * | janela da imagem    | x 200 · y 356          | x 198,8 · y 356,2     |
 * | badge               | x 1530 · y 398         | x 1530,0 · y 397,4    |
 * | badge               | 148 × 48               | 148,1 × 48,7          |
 * | painel de texto     | x 1294 · y 799         | x 1293,8 · y 800,5    |
 * | prévia desfocada    | x 1784,56 (na seção)   | x 1783,1              |
 *
 * A prévia é medida na borda esquerda porque é a única borda visível: ela
 * começa em 1784,56 e vai até 3093,45 — bem fora do frame de 1920, e é
 * recortada por ele.
 */

/** Largura do `Main Content` no frame de 1920 (1920 − 2 × 200). */
const MAIN_W = 1520;

export type Solution = {
  id: string;
  /** Rótulo da pílula no seletor. */
  label: string;

  /**
   * Conteúdo do frame liberado.
   *
   * A ausência é o que marca a opção como ainda não implementada — e é ela que
   * a torna não-clicável.
   */
  active?: {
    /** Texto do badge sobre a imagem. */
    badge: string;

    /**
     * Título do painel, nas três linhas em que o design quebra.
     *
     * A quebra vem do dado, não de uma largura: o Figma tem três nós de texto
     * separados, e o mesmo cuidado do `desc` do Ecossystem.
     */
    title: [string, string, string];

    /** Rótulo do CTA. */
    cta: string;

    /** Imagem principal da composição. */
    image: string;

    /**
     * Imagem desfocada à direita.
     *
     * É a **prévia da opção seguinte**, e não uma decoração: no frame do Safe
     * ela é a imagem do Conta e Pix, que é a imagem principal do frame
     * `151:92`.
     */
    preview: string;

    /**
     * Recorte da imagem principal dentro da janela.
     *
     * O Figma não dimensiona a imagem pela janela: ele a põe num retângulo
     * maior e deixa a janela recortar. Em `144:2` a imagem ocupa
     * 1882,348 × 1020,567 a partir de (−289, −118) dentro de uma janela de
     * 1520 × 720.
     */
    imageBox: { x: number; y: number; w: number; h: number };

    /**
     * Badge, em relação à **janela**.
     *
     * O Figma posiciona o badge e o painel de texto em relação ao `Main
     * Content` (`144:3`), que tem a mesma largura da janela mas 256 px mais
     * acima — então `(1330, 298)` no `Main Content` é `(1330, 42)` na janela.
     *
     * Ancorar na janela deixa a composição ligada à imagem, e é o que faz o
     * resultado bater com o Figma mesmo com o título renderizando 0,16 px mais
     * alto do que lá (o `leading-[1.22]` do projeto contra o `leading: normal`
     * do design).
     */
    badgeBox: { x: number; y: number };

    /**
     * Painel de texto, em relação à janela.
     *
     * A largura é a do Figma (`150:69`): **384**, e não 443 — o 443 é o do
     * painel do frame vizinho (`151:105`), que é outra opção. Aqui o painel
     * tem a largura do seu conteúdo: o texto ocupa 300 e o padding são 42 de
     * cada lado, 300 + 84 = 384.
     */
    textBox: { x: number; y: number; w: number };

    /**
     * Prévia desfocada, em relação à **seção**.
     *
     * Diferente do badge e do painel: no Figma ela é irmã do `Main Content`,
     * não filha dele. Isso muda a origem da coordenada em 200 px e 100 px — e
     * é por isso que ela precisa de uma âncora própria.
     *
     * A posição é dada pela **borda esquerda**, como no Figma (1784,56 num
     * frame de 1920). Só que isso prende a prévia a uma largura mínima de
     * viewport: abaixo de 1785 px ela ficaria inteiramente fora da seção, e
     * sumiria. O componente ancorá-la pela **direita**, que dá o mesmo pixel em
     * 1920 e mantém o pedaço visível em qualquer largura.
     */
    previewBox: { x: number; y: number; w: number; h: number };

    /**
     * Quanto a prévia passa da borda direita da seção, em px.
     *
     * No Figma a borda esquerda dela fica em 1784,56 e o quadro tem 1920 —
     * então só 135,44 px aparecem, e o resto sai do frame. A distância da
     * borda direita é 1920 + 1308,889 − 1784,56 − 1308,889 = 1173,445.
     */
    previewOverflowRight: number;

    /** Recorte da imagem da prévia dentro dela. */
    previewImageBox: { x: number; y: number; w: number; h: number };
  };
};

/**
 * As quatro pílulas aparecem desde o começo, porque é assim que o design
 * mostra: o seletor é do **frame**, e o frame mostra as quatro.
 */
export const SOLUTIONS: Solution[] = [
  {
    id: "caixinhas",
    label: "Caixinhas",
    active: {
      badge: "Caixinhas",
      title: ["Separe seu dinheiro por", "metas e acompanhe", "seu progresso."],
      cta: "Saiba Mais",
      /**
       * WebP. O PNG de origem tinha 4,28 MB; a conversão com `sharp` (quality
       * 86) deixa 149 KB, com erro médio de 1,31 nível e sem banding nas
       * gradientes — que é o caso mais desfavorável para WebP lossy. O comando
       * está no README.
       */
      image: "/images/backgrounds/safe-image.webp",
      preview: "/images/backgrounds/serenity-image.webp",
      imageBox: { x: -289, y: -118, w: 1882.348, h: 1020.567 },
      badgeBox: { x: 1330, y: 42 },
      textBox: { x: 1094, y: 443, w: 384 },
      previewBox: { x: 1784.556, y: 406, w: 1308.889, h: 620 },
      previewOverflowRight: 1173.445,
      previewImageBox: { x: -150.694, y: -121.417, w: 1552.583, h: 866.558 },
    },
  },

  /*
   * As três opções seguintes entram uma de cada vez, com o frame correspondente
   * liberado no Figma. O que já se sabe do design delas, para quando chegar:
   *
   * | Opção         | Frame   | Imagem principal | Prévia           |
   * |---------------|---------|------------------|------------------|
   * | Conta e Pix   | `151:92`| serenity-image   | upstairs-image   |
   * | Investimentos | `153:125`| upstairs-image | serenity-image   |
   * | Empréstimos   | `153:167`| trade-image     | upstairs-image   |
   *
   * Os títulos, badges e CTAs de cada uma estão nos frames correspondentes —
   * e nenhum texto vai ser inventado: tudo é lido do Figma no momento da
   * implementação.
   */

  { id: "conta-e-pix", label: "Conta e Pix" },
  { id: "investimentos", label: "Investimentos" },
  { id: "emprestimos", label: "Empréstimos" },
];

/** Índice da opção liberada. */
export const ACTIVE_INDEX = 0;

/**
 * Largura da janela da imagem, em px do frame de 1920.
 *
 * A janela é o `Main Content` inteiro: `w-full` na seção, que já tem 200 px de
 * padding dos dois lados. E a altura é fixa em 720 px, como no Figma.
 */
export const WINDOW_H = 720;

/** Raio de arredondamento da janela, lido do nó `150:45`. */
export const WINDOW_RADIUS = 25;

/**
 * Raio de arredondamento da prévia desfocada, lido do nó `151:77`
 * (21,528 px — o mesmo `radius/2` do retângulo de 1308,889 px).
 */
export const PREVIEW_RADIUS = 21.528;

/** Desfoque da prévia, lido do nó `151:77` (4,306 px). */
export const PREVIEW_BLUR = 4.306;

/**
 * Largura do `Main Content`, exportada porque a verificação de geometria
 * precisa dela para conferir a soma da linha do seletor.
 */
export { MAIN_W };
