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
 * | Conta e Pix   | Account | `151:92`  | liberado |
 * | Investimentos | —       | `153:125` | oculto |
 * | Empréstimos   | —       | `153:167` | oculto |
 *
 * (No Figma os três últimos estão **todos** nomeados "Solutions Section -
 * Account" — a identidade deles vem do badge, não do nome do frame.)
 *
 * ## A seção é um carrossel, e o design mostra isso
 *
 * A janela central mostra a opção **ativa**, e as duas bordas da seção
 * mostram as **vizinhas**: 135 px do lado esquerdo são a opção anterior, e
 * 135 px do lado direito são a seguinte. No frame do Safe não há prévia
 * esquerda — é a primeira opção, não tem vizinha anterior.
 *
 * A prévia é a **arte da vizinha**, e a arte dela é a mesma que vai estar na
 * janela na próxima troca. É por isso que a transição pode ser lida como
 * "a arte saiu da borda e entrou na janela".
 *
 * ## Geometria
 *
 * Todos os valores vêm do frame, em px do canvas de 1920, e foram conferidos
 * **contra o render do Figma**, não só contra a árvore de nós.
 *
 * As âncoras são três, e confundi-las desloca tudo:
 *
 * | Peça              | Âncora no Figma      |
 * |-------------------|----------------------|
 * | badge e painel    | a **janela**         |
 * | prévia esquerda   | a **seção**          |
 * | prévia direita    | a **seção**          |
 * | seletor de pílulas | o `Title`            |
 *
 * O badge e o painel são posicionados **pela janela**, e não pelo `Main
 * Content`: a janela tem a mesma largura e começa 256 px mais abaixo, então
 * `(1330, 298)` no `Main Content` é `(1330, 42)` na janela. Ancorar na janela
 * deixa a composição ligada à imagem, e é o que faz o resultado bater com o
 * Figma mesmo com o título renderizando 0,16 px mais alto.
 */

/**
 * Uma prévia: a arte de uma opção vizinha, sangrando pela borda da seção.
 *
 * O quadro e o recorte são **por frame**, e não por vizinha: o Figma mostra
 * uma fatia diferente de cada arte em cada frame, e quem manda é o design.
 */
export type SolutionPreview = {
  /** Arte que aparece na prévia. */
  src: string;
  /**
   * Quadro da prévia, em px do frame de 1920 (a seção).
   *
   * A prévia é mais larga que a faixa visível: 1308,889 de quadro para
   * 135,44 visíveis. O resto sai do frame — é o que dá a leitura de "a
   * imagem vem de fora".
   */
  frame: { x: number; y: number; w: number; h: number };
  /** Recorte da arte dentro do quadro. */
  crop: { x: number; y: number; w: number; h: number };
};

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
    /**
     * Título da seção, nas duas linhas em que o design quebra.
     *
     * É por opção e não fixo: o do Caixinhas é "Cada objetivo merece seu
     * espaço." e o do Conta e Pix é "Tudo flui no seu dia a dia.".
     *
     * **O espaço no fim da primeira linha é do Figma, e ele conta.** O nó de
     * texto `151:95` tem 554 de largura, e a linha "Tudo flui no seu" sem o
     * espaço mede 535,25 — os 18,75 que faltam são o espaço. Ele é invisível
     * (está no fim da linha), mas a caixa do texto o inclui, e por isso o
     * título precisa de `whitespace-pre` para reproduzir a medida.
     */
    sectionTitle: [string, string];

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

    /** Arte principal da composição. */
    image: string;

    /**
     * Recorte da arte principal dentro da janela.
     *
     * O Figma não dimensiona a arte pela janela: ele a põe num retângulo
     * maior e deixa a janela recortar. Em `144:2` são 1882,348 × 1020,567 a
     * partir de (−289, −118) dentro de uma janela de 1520 × 720.
     */
    imageBox: { x: number; y: number; w: number; h: number };

    /**
     * Badge, em relação à **janela**.
     *
     * O Figma posiciona o badge e o painel de texto em relação ao `Main
     * Content` (`144:3`), que tem a mesma largura da janela mas 256 px mais
     * acima — então `(1330, 298)` no `Main Content` é `(1330, 42)` na janela.
     */
    badgeBox: { x: number; y: number };

    /**
     * Painel de texto, em relação à janela.
     *
     * A largura é a do Figma e **difere por frame**: 384 no Safe e 443 no
     * Conta e Pix, porque no primeiro o texto é mais estreito e o painel
     * encolhe com ele (o auto-layout do Figma dá a largura do conteúdo mais o
     * padding).
     */
    textBox: { x: number; y: number; w: number };

    /** Prévia da opção **anterior**, sangrando pela borda esquerda. */
    prev?: SolutionPreview;

    /** Prévia da opção **seguinte**, sangrando pela borda direita. */
    next?: SolutionPreview;
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
      sectionTitle: ["Cada objetivo ", "merece seu espaço."],
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
      imageBox: { x: -289, y: -118, w: 1882.348, h: 1020.567 },
      badgeBox: { x: 1330, y: 42 },
      textBox: { x: 1094, y: 443, w: 384 },
      // Sem prévia esquerda: é a primeira opção.
      next: {
        src: "/images/backgrounds/serenity-image.webp",
        frame: { x: 1784.556, y: 406, w: 1308.889, h: 620 },
        crop: { x: -150.694, y: -121.417, w: 1552.583, h: 866.558 },
      },
    },
  },

  {
    id: "conta-e-pix",
    label: "Conta e Pix",
    active: {
      sectionTitle: ["Tudo flui no seu ", "dia a dia."],
      badge: "Conta e Pix",
      title: [
        "Acompanhe seu dinheiro,",
        "faça pagamentos e transfira",
        "valores pelo aplicativo.",
      ],
      cta: "Saiba Mais",
      image: "/images/backgrounds/serenity-image.webp",
      imageBox: { x: -175, y: -141, w: 1803, h: 1006.326 },
      badgeBox: { x: 1313, y: 42 },
      textBox: { x: 1035, y: 443, w: 443 },
      // A prévia esquerda é a arte do Caixinhas — a opção anterior.
      prev: {
        src: "/images/backgrounds/safe-image.webp",
        frame: { x: -1173.444, y: 408, w: 1308.889, h: 620 },
        crop: { x: -248.861, y: -101.611, w: 1620.911, h: 878.821 },
      },
      // E a direita é a arte do Investimentos — a opção seguinte.
      next: {
        src: "/images/backgrounds/upstairs-image.webp",
        frame: { x: 1784.556, y: 408, w: 1308.889, h: 620 },
        crop: { x: -113.667, y: -26.694, w: 1536.222, h: 857.426 },
      },
    },
  },

  /*
   * As duas opções seguintes entram uma de cada vez, com o frame correspondente
   * liberado no Figma. O que já se sabe do design delas, para quando chegar:
   *
   * | Opção         | Frame     | Arte principal  | Prévia esquerda   | Prévia direita |
   * |---------------|-----------|-----------------|-------------------|----------------|
   * | Investimentos | `153:125` | upstairs-image  | serenity-image    | trade-image    |
   * | Empréstimos   | `153:167` | trade-image     | upstairs-image    | —              |
   *
   * E as prévias **não** estão todas no mesmo lugar: a do Investimentos está
   * 200 px mais à esquerda (x = −1373,444) e 102 px mais acima (y = 306) do
   * que a do Conta e Pix, porque o Figma mostra uma fatia diferente da arte.
   * É por isso que a posição do quadro é por frame e não uma constante.
   *
   * Os títulos, badges e CTAs de cada uma estão nos frames correspondentes —
   * e nenhum texto vai ser inventado: tudo é lido do Figma no momento da
   * implementação.
   */

  { id: "investimentos", label: "Investimentos" },
  { id: "emprestimos", label: "Empréstimos" },
];

/** Índice da primeira opção liberada. */
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
 * Raio de arredondamento da prévia, lido do nó `151:77` (21,528 px).
 */
export const PREVIEW_RADIUS = 21.528;

/** Desfoque da prévia, lido do nó `151:77` (4,306 px). */
export const PREVIEW_BLUR = 4.306;

/**
 * Quanto da prévia sangra para fora da seção, em px.
 *
 * A prévia é mais larga que a faixa visível, e o que sobra sai do frame: o
 * quadro da prévia direita começa em 1784,556 e tem 1308,889 — ou seja, passa
 * 1173,449 px da borda direita. A da esquerda é o mesmo número pelo outro
 * lado, o que deixa a composição simétrica.
 */
export const PREVIEW_OVERFLOW = 1173.449;
