/**
 * Blog Section — as quatro matérias do carrossel.
 *
 * ## O quadro do Figma
 *
 * A seção tem **quatro frames**, e os quatro estão liberados:
 *
 * | matéria                          | frame              | nó        |
 * |----------------------------------|--------------------|-----------|
 * | O Nu está dando o próximo passo   | `Blog Section - 1` | `212:3`   |
 * | Brand Refresh                    | `Blog Section - 2` | `222:79`  |
 * | Proteção contra golpes           | `Blog Section - 3` | `223:105` |
 * | Inter Miami                      | `Blog Section - 4` | `223:137` |
 *
 * Eles não são quatro telas: são **a mesma fileira vista de quatro posições**.
 * No frame 1 aparecem as matérias 1, 2 e 3; no 2, as 2, 3 e 4; no 3, as 3, 4 e
 * 1; no 4, as 4, 1 e 2. É um **anel de quatro** com três slots visíveis — a
 * matéria principal (à esquerda, grande) e as duas seguintes. O quarto tópico é
 * o único fora da janela: é ele que entra quando a fileira anda um passo.
 *
 * ## A arte é maior que o card, e o card é a janela
 *
 * No Figma cada arte é desenhada num tamanho **fixo** (840×420, 800×450,
 * 1000×437,5) e recortada por uma janela menor — e a mesma arte tem um recorte
 * **diferente** como principal e como tópico ao lado. Por isso o dado aqui não é
 * "a imagem do card": é o tamanho da arte mais o deslocamento dela em cada
 * slot. Uma `img` que preenchesse o card daria outro enquadramento nos quatro.
 *
 * As medidas são px do quadro de 1920 e viram `cqw` no componente: a fileira é
 * um contêiner de consulta, então o recorte é o mesmo em 1280 e em 3840 — a
 * janela encolhe e a arte encolhe junto, sem nada ser reescalado para "caber".
 * Ver `BlogTopic` e `BLOG_ROW`.
 *
 * ## A descrição
 *
 * Duas linhas, 16 px Medium, `Text/text-tertiary`. As duas linhas são `<p>`
 * separados no Figma, ou seja, a quebra é do desenho — está preservada em
 * `desc` e vira um `<br>` no componente, como nas outras seções.
 *
 * **Pendência nº 23:** a descrição da matéria 1 ("Conta de alto rendimento…")
 * não descreve a arte da matéria 1 ("O Nu está dando o seu próximo passo"):
 * nos outros três frames a descrição combina com a arte. O texto foi mantido
 * **exatamente** como está no Figma — a correção é no desenho, não aqui.
 */

export type BlogTopic = {
  id: string;
  /** Arquivo em `/public/images/blog`. */
  image: string;
  /** A descrição, nas duas linhas em que o Figma quebra. */
  desc: readonly [string, string];
  /** A arte como desenhada, em px do quadro de 1920. */
  art: { w: number; h: number };
  /** O deslocamento da arte dentro da janela, em px, por slot. */
  crop: {
    main: { left: number; top: number };
    side: { left: number; top: number };
  };
};

export const BLOG_TOPICS: readonly BlogTopic[] = [
  {
    id: "proximo-passo",
    image: "/images/blog/proximo-passo.webp",
    desc: [
      "Conta de alto rendimento, transferências globais sem taxas e cartão premium.",
      "Conheça as novidades para quem mora no exterior.",
    ],
    art: { w: 840, h: 420 },
    crop: {
      main: { left: -47, top: 0 },
      side: { left: -307, top: 0 },
    },
  },
  {
    id: "brand-refresh",
    image: "/images/blog/brand-refresh.webp",
    desc: [
      "Brand Refresh: como renovamos a identidade visual do Nubank",
      "O design como sistema e o que muda quando uma marca cresce junto com quem a usa.",
    ],
    art: { w: 800, h: 450 },
    crop: {
      main: { left: -16, top: -15 },
      side: { left: -224, top: -15 },
    },
  },
  {
    id: "protecao",
    image: "/images/blog/protecao.webp",
    desc: [
      "Conheça as camadas de proteção que o Nubank usa para proteger seu dinheiro",
      "e seus dados contra golpes e fraudes.",
    ],
    art: { w: 1000, h: 437.5 },
    crop: {
      main: { left: -170, top: -9 },
      side: { left: -353, top: -9 },
    },
  },
  {
    id: "inter-miami",
    image: "/images/blog/inter-miami.webp",
    desc: [
      "A escalação está roxa: o Nu agora é patrocinador oficial do Inter Miami CF e do novíssimo Nu Stadium.",
      "Prepare-se para novidades e muitos marcos globais vindo aí.",
    ],
    art: { w: 800, h: 450 },
    crop: {
      main: { left: -16, top: -15 },
      side: { left: -224, top: -15 },
    },
  },
];

/**
 * A fileira, em px do quadro de 1920.
 *
 * A coluna de conteúdo (`Main Content`) tem 1520, e a soma dos slots é
 * exatamente ela: 768 + 24 + 352 + 24 + 352. O principal tem 768 porque o
 * bloco dos outros tópicos é `w-[728px]` fixo no Figma e o principal é o
 * `flex-1` que sobra.
 */
export const BLOG_ROW = {
  /** Largura do `Main Content` no Figma. */
  column: 1520,
  /** Altura da fileira — a proporção que ela mantém em qualquer tela. */
  height: 420,
  /** Os três slots visíveis: principal, lado 1 e lado 2. */
  slots: [
    { left: 0, width: 768 },
    { left: 792, width: 352 },
    { left: 1168, width: 352 },
  ],
  /** A largura de um tópico ao lado — a mesma nos dois slots. */
  sideWidth: 352,
  /** Onde o próximo card nasce, 24 px fora da janela pela direita. */
  offRight: 1544,
  /** Onde o card que entra pela esquerda nasce, 24 px fora pela esquerda. */
  offLeft: -376,
  /**
   * Onde o principal que sai termina.
   *
   * Não é `-768`: o card que sai **mantém a largura** até sumir, e é isso que
   * faz a fileira andar 792 px inteiros — o mesmo percurso do vizinho que vira
   * principal e do que entra pela direita. Com `-792` a borda direita dele
   * termina 24 px fora da janela, e o gesto lê como um empurrão só.
   */
  exitLeft: -792,
} as const;

/**
 * Converte px do quadro de 1920 para `cqw` da fileira.
 *
 * A fileira é `container-type: inline-size`, então `1cqw` é 1% da largura dela
 * — 15,2 px a 1920. É a unidade da arte: ela não pode ser porcentagem do card,
 * porque o card muda de largura na troca e a arte, não (só o recorte muda).
 */
export function cqw(px: number) {
  return `${(px / BLOG_ROW.column) * 100}cqw`;
}

/** O mesmo em porcentagem da fileira, para `left` e `width` dos cards. */
export function pct(px: number) {
  return `${(px / BLOG_ROW.column) * 100}%`;
}
