/**
 * Geometria da composição de cards na Hero.
 *
 * Todos os valores vêm do Figma, frame `Hero Section` (node 14:446),
 * canvas de 1920x1080. O wrapper `cards` usa `display: contents`, então as
 * coordenadas dos cards são relativas à Hero — não ao wrapper.
 *
 * Convertemos tudo para `cqw` (1 cqw = 1% da largura da Hero) para que a
 * composição escale sem distorcer: largura e offset horizontal escalam com a
 * largura da viewport, e a altura de cada card vem de `aspect-ratio`, nunca de
 * uma altura fixa em pixel.
 *
 * As posições usam o CENTRO de cada card, então `left`/`top` já incluem o
 * deslocamento do centro e o CSS aplica `translate(-50%, -50%)`.
 */

/** Proporção da arte do card (373.631 x 592.656 no Figma). */
export const CARD_ART_ASPECT = 373.631 / 592.656;

export type HeroCard = {
  id: string;
  /** Caminho do asset em /public. */
  src: string;
  /** Texto alternativo — o nome é conteúdo, não decoração. */
  alt: string;
  /** Descrição da variante, usada no alt longo. */
  label: string;
  /** `aspect-ratio` da caixa envolvente (bbox já rotacionado). */
  boxAspect: number;
  /**
   * Altura da arte em % da altura da caixa envolvente.
   *
   * A caixa envolvente é o bounding box do card JÁ ROTACIONADO, então é maior
   * que a arte — por isso a fração, não 100%.
   *
   * Usamos a ALTURA (e não a largura) de propósito: a caixa tem altura
   * definida pelo `aspect-ratio`, então a porcentagem resolve de forma
   * determinística. Com `width: %` contra um pai de largura automática a
   * resolução é circular e a imagem fica 0x0 enquanto não carrega — o que
   * nunca dispara o lazy-load.
   */
  artHeightPct: number;
  /** Centro horizontal, em cqw a partir da borda esquerda da Hero. */
  centerX: number;
  /** Centro vertical, em cqw a partir do topo da Hero. */
  centerY: number;
  /** Largura da caixa envolvente, em cqw. */
  width: number;
  /** Rotação aplicada à arte, em graus. */
  rotate: number;
  /**
   * Atraso da entrada, em segundos.
   *
   * Não é informado aqui: sai de `FAN_CASCADE`, calculado pela posição
   * horizontal para o leque abrir da esquerda para a direita.
   */
  delay: number;
  /**
   * Carregar sem `loading="lazy"`.
   *
   * Só os dois cards que aparecem em todos os breakpoints entram aqui: eles
   * podem virar o LCP da página. Nos outros dois ficariam `display:none` no
   * mobile, e carregar ~185 KB de imagens invisíveis seria desperdício.
   */
  eager?: boolean;
};

/** Altura real da arte do card no Figma, em px do canvas de 1920. */
const CARD_ART_HEIGHT = 592.656;

/** Monta um card a partir da geometria bruta do Figma. */
function card(input: {
  id: string;
  src: string;
  alt: string;
  label: string;
  /** `x`, `y`, `largura` e `altura` da caixa no canvas de 1920x1080. */
  box: { x: number; y: number; w: number; h: number };
  rotate: number;
  eager?: boolean;
}): HeroCard {
  const { x, y, w, h } = input.box;

  return {
    ...input,
    boxAspect: w / h,
    artHeightPct: (CARD_ART_HEIGHT / h) * 100,
    centerX: (x + w / 2) / 19.2,
    centerY: (y + h / 2) / 19.2,
    width: w / 19.2,
    // Preenchido abaixo, a partir da posição horizontal — ver FAN_CASCADE.
    delay: 0,
  };
}

const RAW_CARDS: HeroCard[] = [
  card({
    id: "business",
    src: "/images/cards/nu-card-business.webp",
    alt: "Cartão Nu Business",
    label: "Nu Business, acabamento em tons de cinza",
    box: { x: 342.28, y: 842.24, w: 659.621, h: 696.953 },
    rotate: -38.08,
  }),
  card({
    id: "croma",
    src: "/images/cards/nu-card-croma.webp",
    alt: "Cartão Nu Croma",
    label: "Nu Croma, acabamento em tons de areia",
    box: { x: 597.37, y: 693.43, w: 519.06, h: 671.222 },
    rotate: -15.58,
    eager: true,
  }),
  card({
    id: "roxo",
    src: "/images/cards/nu-card.webp",
    alt: "Cartão Nu roxo",
    label: "Nu, edição roxa",
    box: { x: 738.84, y: 705.61, w: 616.579, h: 699.76 },
    rotate: 29.42,
    eager: true,
  }),
  card({
    id: "ultraviolet",
    src: "/images/cards/nu-card-ultraviolet.webp",
    alt: "Cartão Nu Ultraviolet",
    label: "Nu Ultraviolet, edição escura",
    box: { x: 892.53, y: 814.86, w: 696.953, h: 659.621 },
    rotate: 51.92,
  }),
];

/**
 * Cascata do leque: o atraso sai da posição horizontal do card, não do índice
 * do array. Assim a ordem visual é a ordem da animação — da esquerda para a
 * direita — e inserir um card no meio da lista não embaralha a sequência.
 *
 * Antes os atrasos eram fixos por card (0.42 / 0.24 / 0.12 / 0.33), uma ordem
 * que não acompanhava a composição na tela.
 */
const FAN_CASCADE = {
  /** Atraso do card mais à esquerda. */
  startDelay: 0.3,
  /** Intervalo entre cards vizinhos, em segundos. */
  step: 0.085,
} as const;

/** Posição de cada card na ordem horizontal, da esquerda para a direita. */
const RANK_BY_X = new Map(
  [...RAW_CARDS].sort((a, b) => a.centerX - b.centerX).map((card, i) => [card.id, i]),
);

export const HERO_CARDS: HeroCard[] = RAW_CARDS.map((card) => ({
  ...card,
  delay: FAN_CASCADE.startDelay + (RANK_BY_X.get(card.id) ?? 0) * FAN_CASCADE.step,
}));

/**
 * Todos os cards são renderizados e ocultados por CSS nos breakpoints
 * estreitos — assim não existe divergência entre HTML do servidor e
 * hidratação. A folha `hero.css` define qual card aparece em cada largura.
 *
 *   ≥1280px → os quatro cards (composição original do Figma)
 *   768–1279px → três cards
 *   <768px   → dois cards, maiores
 */