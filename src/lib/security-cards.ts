/**
 * Security Section — Figma `Security Section - Innactive` (`274:2`) e
 * `Security Section - Interactive` (`280:77`), 1920×1840, e a spec ao lado
 * (`288:262`).
 *
 * Os dois frames são **a mesma seção em dois estados**: o repouso e o hover. O
 * que muda de um para o outro é a arte de cada card e a borda
 * (`Border/border-default` → `Border/border-brand`). Por isso cada card tem
 * duas artes, e cada arte tem a **sua** posição: no Cartão Virtual a arte do
 * hover está 20 px mais à direita (`left` −200 em vez de −220), e a troca
 * herda esse deslocamento.
 *
 * ## As medidas são px do Figma
 *
 * O card tem 490,67 × 680 no quadro de 1920 (três colunas de 1520 com 24 de
 * intervalo). Ele é `container-type: inline-size`, e tudo o que está dentro
 * — arte, título, padding, seta — vira `cqw` dele: a 1280 o card encolhe
 * inteiro, no mesmo enquadramento, e a 3840 ele para no tamanho do Figma (a
 * moldura para em 1920).
 *
 * As coordenadas da arte são as do Figma **menos a borda de 2 px**: no Figma a
 * posição absoluta é medida da borda externa do frame; no CSS, da caixa de
 * padding — que começa depois da borda.
 */

/** Largura do card no quadro de 1920: (1520 − 2 × 24) / 3. */
export const SECURITY_CARD_W = 1472 / 3;

/** Altura do card no Figma. */
export const SECURITY_CARD_H = 680;

/** Espessura da borda do card no Figma. */
const BORDA = 2;

/** Largura da arte no Figma (as doze têm 1080 de largura). */
export const SECURITY_ART_W = 1080;

/** Proporção das doze artes de origem (2752 × 1536). */
export const SECURITY_ART_RATIO = 2752 / 1536;

/** Converte px do card de 1920 para `cqw` do card. */
export function cardCqw(px: number) {
  return `${((px / SECURITY_CARD_W) * 100).toFixed(4)}cqw`;
}

type Arte = {
  src: string;
  /** `left` do Figma, em px, medido da borda externa do card. */
  x: number;
  /** `top` do Figma, em px, medido da borda externa do card. */
  y: number;
};

export type SecurityCard = {
  id: string;
  /** Nó do card no frame de repouso. */
  node: string;
  title: string;
  /** As linhas da descrição, com as quebras do Figma. */
  desc: readonly string[];
  idle: Arte;
  hover: Arte;
};

/** Posição da arte na caixa de padding do card, em `cqw`. */
export function artePos(a: Arte) {
  return { left: cardCqw(a.x - BORDA), top: cardCqw(a.y - BORDA) };
}

const arte = (nome: string, estado: "innactive" | "interactive") =>
  `/images/backgrounds/security-bg/${nome}-bg-${estado}.webp`;

/**
 * As duas fileiras do Figma (`283:130` e `276:47`), na ordem do desenho.
 *
 * Os nomes de arquivo seguem os nomes das camadas — inclusive o "innactive",
 * que é como o Figma e a pasta do repositório escrevem.
 */
export const SECURITY_ROWS: readonly (readonly SecurityCard[])[] = [
  [
    {
      id: "modo-rua",
      node: "283:131",
      title: "Modo Rua",
      desc: ["Mais proteção quando você", "está fora de casa."],
      idle: { src: arte("roadmode", "innactive"), x: -297, y: 80 },
      hover: { src: arte("roadmode", "interactive"), x: -297, y: 80 },
    },
    {
      id: "alerta-de-golpe",
      node: "283:140",
      title: "Alerta de Golpe",
      desc: ["Um alerta antes de uma", "possível fraude."],
      idle: { src: arte("scamalert", "innactive"), x: -220, y: 80 },
      hover: { src: arte("scamalert", "interactive"), x: -220, y: 80 },
    },
    {
      id: "cartao-virtual",
      node: "283:149",
      title: "Cartão Virtual",
      desc: ["Mais segurança para suas", "compras online."],
      idle: { src: arte("virtualcard", "innactive"), x: -220, y: 60 },
      hover: { src: arte("virtualcard", "interactive"), x: -200, y: 60 },
    },
  ],
  [
    {
      id: "alo-protegido",
      node: "276:44",
      title: "Alô Protegido",
      // Uma linha só no Figma (`278:52`): a quebra é a do próprio bloco.
      desc: ["Proteção contra falsas centrais de atendimento."],
      idle: { src: arte("protectioncall", "innactive"), x: -303, y: 80 },
      hover: { src: arte("protectioncall", "interactive"), x: -303, y: 80 },
    },
    {
      id: "central-de-protecao",
      node: "276:48",
      title: "Central de Proteção",
      desc: ["Suas ferramentas de segurança", "em um só lugar."],
      idle: { src: arte("safecentral", "innactive"), x: -296.67, y: 80 },
      hover: { src: arte("safecentral", "interactive"), x: -296.67, y: 80 },
    },
    {
      id: "defesas-inteligentes",
      node: "276:45",
      title: "Defesas Inteligentes",
      desc: ["Sua conta protegida contra", "comportamentos suspeitos."],
      idle: { src: arte("brainshield", "innactive"), x: -220.33, y: 80 },
      hover: { src: arte("brainshield", "interactive"), x: -220.33, y: 80 },
    },
  ],
];

/** Os seis cards em sequência — a grade decide quantos cabem por fileira. */
export const SECURITY_CARDS: readonly SecurityCard[] = SECURITY_ROWS.flat();
