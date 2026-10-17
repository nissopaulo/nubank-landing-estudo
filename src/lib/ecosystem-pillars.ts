/**
 * Pilares do Ecossystem.
 *
 * ## O que existe no Figma hoje
 *
 * Só o frame `Ecossystem Section - Nubank` (node `52:3`, 1920x919) está na
 * estrutura nova, e é o único visível. Os outros três (`76:3` Croma, `77:40`
 * Ultraviolet, `80:77` Business) continuam ocultos e ainda na estrutura antiga
 * — que é a que este projeto descartou.
 *
 * Então existe **um** pilar desenhado. Os outros três aparecem recolhidos, com o
 * nome e a foto, que já vieram do Figma e dos assets. Nenhum texto, cor ou CTA
 * foi inventado para eles: quando forem redesenhados, o conteúdo de cada um
 * entra no mesmo lugar do Nubank.
 */

/** Um pilar do carrossel. */
export type Pillar = {
  id: string;
  /** Nome do pilar. No card recolhido aparece lido de baixo para cima. */
  name: string;
  /** Recorte da pessoa, em `/public/images/peoples`. */
  person: string;
};

/**
 * Os quatro pilares, na ordem do carrossel. O primeiro é o ativo.
 *
 * `person` é WebP: os PNGs de origem foram convertidos com `sharp` (quality 86,
 * alfa preservado), de 6.362 KB para 519 KB. O comando está no README.
 */
export const PILLARS: Pillar[] = [
  {
    id: "nubank",
    name: "Nubank",
    person: "/images/peoples/nubank-people.webp",
  },
  { id: "croma", name: "Croma", person: "/images/peoples/croma-people.webp" },
  {
    id: "ultravioleta",
    name: "Ultravioleta",
    person: "/images/peoples/ultraviolet-people.webp",
  },
  {
    id: "empresas",
    name: "Empresas",
    person: "/images/peoples/business-people.webp",
  },
];

/** Índice do pilar ativo. Só o Nubank está desenhado — ver a nota do topo. */
export const ACTIVE_INDEX = 0;

/**
 * Conteúdo do pilar ativo, lido do node `52:3`.
 *
 * As três cores do gradiente são literais do Figma: `Purple/600` (#9b2fe8), um
 * tom intermediário sem variable (#831ccb) e `Purple/800` (#6a08ad).
 */
export const ACTIVE_CONTENT = {
  /** Título da seção, nas duas linhas que o design quebra. */
  title: ["Um Nu para", "cada momento."],

  /**
   * Descrição dentro do card, nas duas linhas que o design quebra.
   *
   * A quebra é explícita de propósito. O card ativo tem 1163px e sobra 1115px
   * de área útil, então o texto correria numa linha só — e passaria por baixo
   * da pessoa. No Figma o nó de texto tem duas linhas compostas, então é a
   * composição que se reproduz, e não uma largura máxima chutada.
   */
  desc: [
    "Controle sua vida financeira com uma",
    "experiência digital simples, prática e sem complicação.",
  ],

  /** Parágrafo abaixo do carrossel. */
  body: "O Nubank simplifica a maneira como você cuida do seu dinheiro. Com conta digital, cartão e ferramentas para organizar suas finanças, você acompanha suas movimentações, realiza pagamentos e administra sua vida financeira diretamente pelo aplicativo. Tudo pensado para oferecer mais autonomia, transparência e controle nas decisões do dia a dia.",

  cta: "Conheça o Nubank",
  href: "https://www.nubank.com.br/",

  /**
   * Gradiente do card ativo — a exportação do próprio Figma, sem arredondar.
   *
   * O `radialGradient` do Figma vem com `gradientTransform` em `matrix(...)`, e
   * o CSS não consegue expressar isso: ele achata a elipse e ainda a gira. A
   * alternativa era um `radial-gradient(62% 187% at 60.55% 52%, ...)`, que
   * parece equivalente e não é — sem a rotação de ~25°, o terço direito do
   * card clareia e o gradiente perde o peso que tem no design. Por isso o SVG
   * vai como data URI, que é literalmente o que o Figma exporta.
   *
   * O `preserveAspectRatio="none"` também é do Figma: o card ativo é `flex-1`,
   * então a largura dele muda com a viewport e o gradiente acompanha, esticando.
   *
   * Os `rgba()` do export são literais e **não podem virar hex**: dentro de
   * `url("data:...")` um `#` não escapado é lido como fragmento de URL e
   * trunca a string no meio — o gradiente simplesmente não aparece. Foi
   * exatamente o que aconteceu na primeira tentativa, com `stop-color='#...'`.
   */
  gradient: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1163 339' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-70.421 16.288 -55.877 -30.013 704.21 176.12)'><stop stop-color='rgba(155,47,232,1)' offset='0'/><stop stop-color='rgba(131,28,203,1)' offset='0.5'/><stop stop-color='rgba(106,8,173,1)' offset='1'/></radialGradient></defs></svg>")`,
};
