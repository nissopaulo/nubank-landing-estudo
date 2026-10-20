/**
 * Opções da Solutions Section.
 *
 * ## A seção é um carrossel, e a prévia é a JANELA escalada
 *
 * A janela central mostra a opção **ativa**, e as duas bordas da seção mostram
 * as **vizinhas** — 135 px de cada lado, sangrando para fora do frame.
 *
 * A prévia não é uma "miniatura" qualquer: ela é a **janela escalada por
 * 0,861111**, com a arte no mesmo recorte. Isso não é suposição, sai da
 * geometria do Figma:
 *
 * | | quadro | recorte da arte | raio |
 * |---|---|---|---|
 * | janela | 1520 × 720 | (−175, −141) 1803 × 1006,326 | 25 |
 * | prévia  | 1308,889 × 620 | (−248,861, −101,611) 1620,911 × 878,821 | 21,528 |
 * | razão   | **0,861111** | **0,861111** (delta 0,000) | 0,861120 |
 *
 * E a razão é a mesma nos dois eixos: 1308,889 / 1520 = 620 / 720. Uma
 * prévia é, literalmente, a janela encolhida — e é por isso que o carrossel
 * pode ser **um transform só**, sem morph de recorte.
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
 * (No Figma os dois últimos estão **todos** nomeados "Solutions Section -
 * Account" — a identidade deles vem do badge, não do nome do frame.)
 *
 * ## A arte existe antes do conteúdo
 *
 * A arte de cada opção — e o recorte dela na janela — está no Figma mesmo
 * quando a opção ainda não foi liberada: é ela que aparece na prévia da
 * vizinha. Por isso `art` e `active` são campos separados, e só `active` é o
 * que marca a opção como **implementada**.
 */

/** Recorte de uma arte dentro de um quadro. */
export type ArtBox = { x: number; y: number; w: number; h: number };

export type Solution = {
  id: string;
  /** Rótulo da pílula no seletor. */
  label: string;

  /**
   * A arte da opção e o seu recorte na janela.
   *
   * Existe para as quatro — inclusive para as que ainda não foram liberadas,
   * porque é a arte da vizinha que aparece na prévia.
   */
  art?: {
    src: string;
    /**
     * Recorte na **janela**.
     *
     * É o único recorte que existe: o da prévia é este mesmo, escalado pelo
     * fator do slot.
     */
    imageBox: ArtBox;
  };

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
     * Título do painel, nas linhas em que o design quebra.
     *
     * A quebra vem do dado, não de uma largura: o Figma tem um nó de texto
     * por linha, e o mesmo cuidado do `desc` do Ecossystem. São três linhas
     * no Caixinhas, no Conta e Pix e no Empréstimos, e **quatro** no
     * Investimentos.
     */
    title: string[];

    /** Rótulo do CTA. */
    cta: string;

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
    art: {
      /**
       * WebP. O PNG de origem tinha 4,28 MB; a conversão com `sharp` (quality
       * 86) deixa 149 KB, com erro médio de 1,31 nível e sem banding nas
       * gradientes — que é o caso mais desfavorável para WebP lossy. O comando
       * está no README.
       */
      src: "/images/backgrounds/safe-image.webp",
      imageBox: { x: -289, y: -118, w: 1882.348, h: 1020.567 },
    },
    active: {
      sectionTitle: ["Cada objetivo ", "merece seu espaço."],
      badge: "Caixinhas",
      title: ["Separe seu dinheiro por", "metas e acompanhe", "seu progresso."],
      cta: "Saiba Mais",
      badgeBox: { x: 1330, y: 42 },
      textBox: { x: 1094, y: 443, w: 384 },
    },
  },

  {
    id: "conta-e-pix",
    label: "Conta e Pix",
    art: {
      src: "/images/backgrounds/serenity-image.webp",
      imageBox: { x: -175, y: -141, w: 1803, h: 1006.326 },
    },
    active: {
      sectionTitle: ["Tudo flui no seu ", "dia a dia."],
      badge: "Conta e Pix",
      title: [
        "Acompanhe seu dinheiro,",
        "faça pagamentos e transfira",
        "valores pelo aplicativo.",
      ],
      cta: "Saiba Mais",
      badgeBox: { x: 1313, y: 42 },
      textBox: { x: 1035, y: 443, w: 443 },
    },
  },

  {
    id: "investimentos",
    label: "Investimentos",
    art: {
      src: "/images/backgrounds/upstairs-image.webp",
      imageBox: { x: -132, y: -31, w: 1784, h: 995.721 },
    },
    active: {
      sectionTitle: ["Olhe além ", "de hoje."],
      badge: "Investimentos",
      title: [
        "Explore alternativas para seus ",
        "objetivos e conheça as ",
        "características de cada ",
        "investimento.",
      ],
      cta: "Saiba Mais",
      badgeBox: { x: 1283, y: 42 },
      /*
       * O painel deste é o único que **sobe**: 29 px acima dos outros, na
       * 414 em vez da 443. E é o mais alto (264 px), porque o título tem
       * **quatro** linhas. É o Figma, e a diferença é visível.
       */
      textBox: { x: 1011, y: 414, w: 467 },
    },
  },

  {
    id: "emprestimos",
    label: "Empréstimos",
    art: {
      src: "/images/backgrounds/trade-image.webp",
      imageBox: { x: -155, y: -49, w: 1736, h: 968.93 },
    },
    active: {
      sectionTitle: ["Decisões com ", "mais clareza."],
      badge: "Empréstimos",
      title: [
        "Conheça as condições disponíveis ",
        "e avalie os custos antes ",
        "de contratar.",
      ],
      cta: "Saiba Mais",
      badgeBox: { x: 1292, y: 42 },
      textBox: { x: 959, y: 443, w: 519 },
    },
  },
];

/** Índice da primeira opção liberada. */
export const ACTIVE_INDEX = 0;

/**
 * A janela da imagem.
 *
 * É o quadro que as três réplicas compartilham: a central em escala 1, e as
 * prévias em `previewScale`. Por isso a arte vive **dentro** de um quadro de
 * 1520 × 720 e a prévia é o mesmo quadro encolhido.
 */
export const WINDOW = {
  w: 1520,
  h: 720,
  /** Raio de arredondamento, lido do nó `150:45`. */
  radius: 25,
} as const;

/**
 * O fator das prévias.
 *
 * 1308,889 / 1520 = 620 / 720 = **0,861111**. E o raio 21,528 das prévias é
 * 25 × 0,861120 — o mesmo número, o que confirma que a prévia é a janela
 * encolhida e não uma "miniatura" desenhada à mão.
 */
export const PREVIEW_SCALE = 1308.889 / 1520;

/**
 * Desfoque das prévias, em px **de tela**.
 *
 * O Figma dá 4,306. Como o desfoque é aplicado no espaço local do quadro e o
 * quadro está escalado por 0,861111, o valor local precisa ser
 * 4,306 / 0,861111 = **5,001** para dar 4,306 na tela.
 */
export const PREVIEW_BLUR = 4.306;

/**
 * Os três slots do carrossel, em px do frame de 1920.
 *
 * O slot é **posição + escala**, e é isso que faz a virada ser um transform
 * só: a arte não muda de recorte, ela muda de lugar.
 */
export const SLOTS = {
  /** A opção ativa, no centro. */
  centro: { x: 200, y: 356, scale: 1 },
  /** A opção anterior, sangrando pela borda esquerda. */
  esquerda: { x: -1173.444, y: 408, scale: PREVIEW_SCALE },
  /** A opção seguinte, sangrando pela borda direita. */
  direita: { x: 1784.556, y: 406, scale: PREVIEW_SCALE },
} as const;

export type SlotName = keyof typeof SLOTS;

/**
 * A duração da viagem da arte, em ms.
 *
 * **TEM DE BATER** com a `transition` do `.sol-arte` no `globals.css`.
 *
 * O motivo é a duplicação que os CTAs da header já têm: o Tailwind só
 * enxerga classes escritas por extenso, e a transição da arte é CSS escrito à
 * mão. E a duplicação aqui tem uma consequência prática — é este número que
 * diz ao badge e ao painel de texto **quando a arte chega**, e é por isso que
 * ele precisa estar nos dois lugares.
 */
export const CARROSSEL_DURACAO = 1000;

/**
 * A curva da viagem, e ela tem de bater com a do `.sol-arte` no
 * `globals.css`.
 *
 * `cubic-bezier(0.6, 0.05, 0.3, 1)`: partida macia, glide longo e chegada
 * amortecida. A curva anterior (`EASE_EMPHASIZED`) fazia 78% do caminho no
 * primeiro quarto do tempo — uma arrancada seguida de meio segundo de arrasto.
 */
export const CARROSSEL_EASE: [number, number, number, number] = [0.6, 0.05, 0.3, 1];

/**
 * O deslocamento de um slot para o outro, em px do frame de 1920.
 *
 * É a diferença entre a posição do slot centro e a do slot da prévia
 * esquerda, e é o que faz o badge e o painel de texto **viajarem com a arte**
 * em vez de ficarem parados enquanto apagam.
 *
 * O `scale` vem junto porque a arte encolhe na viagem, e um painel que
 * saísse do lugar encolhendo leria como parte do mesmo movimento.
 */
export const VIAGEM = {
  dx: SLOTS.esquerda.x - SLOTS.centro.x,
  dy: SLOTS.esquerda.y - SLOTS.centro.y,
  scale: PREVIEW_SCALE,
};
