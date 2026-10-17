/**
 * Pilares do Ecossystem.
 *
 * ## O que existe no Figma hoje
 *
 * Dois frames visíveis na estrutura nova: `Ecossystem Section - Nubank` (node
 * `52:3`) e `Ecossystem Section - Croma` (node `76:3`). Os outros dois —
 * `77:40` Ultraviolet e `80:77` Business — seguem ocultos e ainda na estrutura
 * antiga, a que este projeto descartou.
 *
 * Todos os quatro pilares aparecem no carrossel desde o começo, porque é assim
 * que o design mostra: **os quatro cards existem sempre, na mesma ordem, e um
 * deles é o ativo**. No frame do Croma o ativo é o *segundo* card — o Nubank
 * recolhe. Por isso o componente tem quatro slots fixos em vez de "um card
 * ativo mais três botões", e a animação de troca é o rebalanceamento da linha.
 *
 * `active` ausente = pilar **ainda não desenhado**. Ele aparece recolhido, sem
 * conteúdo, e não é clicável. Nenhum texto, cor ou geometria foi inventado para
 * ele.
 */

export type Pillar = {
  id: string;
  /** Nome do pilar. No card recolhido aparece lido de baixo para cima. */
  name: string;
  /** Recorte da pessoa, em `/public/images/peoples`. */
  person: string;

  /**
   * Tudo que só existe quando o pilar está ativo. A ausência dele é o que
   * torna o pilar não-clicável — não uma flag separada.
   */
  active?: {
    /** Gradiente do card. Só aparece quando o pilar está ativo. */
    gradient: string;

    /**
     * Cor do nome e da descrição dentro do card ativo.
     *
     * Varia por pilar porque a tinta accompanies o fundo: no Nubank o card é
     * roxo e o texto é branco (5,95:1 no pior ponto do gradiente); no Croma o
     * card é creme e o texto é `Background/bg-brand` (#820ad1).
     */
    ink: string;

    /** Descrição, nas duas linhas em que o design quebra. */
    desc: [string, string];

    /** Parágrafo ao lado do CTA. */
    body: string;

    /** Rótulo do CTA. */
    cta: string;

    /**
     * Posição da pessoa, em fração da largura do `Main Content` (1520px).
     *
     * É por pilar porque o design não usa a mesma: a pessoa do Nubank é
     * `left-210px w-1129px` e a do Croma é `left-414px w-973px`. A altura não
     * entra — ela sai da proporção do asset, que bate com a caixa em ambos os
     * casos (1129/843 = 2400/1792 e 973/648 = 2400/1599).
     */
    personLeft: number;
    personWidth: number;
  };
};

const MAIN_W = 1520; // largura do Main Content no frame de 1920

/**
 * `person` é WebP: os PNGs de origem foram convertidos com `sharp` (quality 86,
 * alfa preservado), de 6.362 KB para 519 KB. O do Nubank é um upscale 2x
 * reexportado do Figma. O comando está no README.
 */
export const PILLARS: Pillar[] = [
  {
    id: "nubank",
    name: "Nubank",
    person: "/images/peoples/nubank-people.webp",
    active: {
      /**
       * O export do Figma em data URI, sem arredondar.
       *
       * O `radialGradient` vem com `gradientTransform` em `matrix(...)`, e o
       * CSS não consegue expressar: ele achata a elipse e ainda a gira. Um
       * `radial-gradient(62% 187% at 60.55% 52%)` parece equivalente e não é —
       * sem a rotação de ~25° o terço direito do card clareia e o gradiente
       * perde o peso que tem no design.
       *
       * Os `rgba()` do export não podem virar hex: dentro de `url("data:...")`
       * um `#` não escapado é lido como fragmento de URL e trunca a string no
       * meio — o gradiente simplesmente não aparece, sem erro no console.
       */
      gradient: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1163 339' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-70.421 16.288 -55.877 -30.013 704.21 176.12)'><stop stop-color='rgba(155,47,232,1)' offset='0'/><stop stop-color='rgba(131,28,203,1)' offset='0.5'/><stop stop-color='rgba(106,8,173,1)' offset='1'/></radialGradient></defs></svg>")`,
      ink: "#ffffff",
      desc: [
        "Controle sua vida financeira com uma",
        "experiência digital simples, prática e sem complicação.",
      ],
      body: "O Nubank simplifica a maneira como você cuida do seu dinheiro. Com conta digital, cartão e ferramentas para organizar suas finanças, você acompanha suas movimentações, realiza pagamentos e administra sua vida financeira diretamente pelo aplicativo. Tudo pensado para oferecer mais autonomia, transparência e controle nas decisões do dia a dia.",
      cta: "Conheça o Nubank",
      personLeft: (210 / MAIN_W) * 100,
      personWidth: (1129 / MAIN_W) * 100,
    },
  },
  {
    id: "croma",
    name: "Croma",
    person: "/images/peoples/croma-people.webp",
    active: {
      // Gradiente linear, com o ângulo cheio que o Figma exporta.
      gradient:
        "linear-gradient(107.80411246665999deg, #eeece9 0%, #bfb299 50%, #8f7f64 100%)",
      /**
       * `Background/bg-brand` (#820ad1) — mesmo valor de `Text/text-brand`, com
       * outro nome no Figma. Sobre este creme dá 6,11:1 na ponta mais clara e
       * cerca de 3,3:1 na mais escura, que é onde a descrição termina: passa
       * em texto grande, e não em texto pequeno (16px). Ver README.
       */
      ink: "#820ad1",
      desc: [
        "Mais vantagens para o cotidiano, com cashback,",
        "benefícios exclusivos e soluções que valorizam cada compra.",
      ],
      body: "O Nubank Croma reúne produtos e benefícios pensados para tornar sua experiência financeira ainda mais vantajosa. Além do cashback nas compras e de condições especiais em assinaturas digitais, oferece benefícios associados a serviços como NuCel e HBO Max, além de soluções para guardar dinheiro. Uma experiência que combina praticidade, vantagens para o dia a dia e mais valor para o seu dinheiro.",
      cta: "Conheça o Croma",
      personLeft: (414 / MAIN_W) * 100,
      personWidth: (973 / MAIN_W) * 100,
    },
  },
  // PROVISÓRIO — Ultravioleta e Empresas ainda não foram redesenhados na
  // estrutura nova; os frames `77:40` e `80:77` seguem ocultos na antiga.
  // Ficam recolhidos e não-clicáveis até existirem.
  { id: "ultravioleta", name: "Ultravioleta", person: "/images/peoples/ultraviolet-people.webp" },
  { id: "empresas", name: "Empresas", person: "/images/peoples/business-people.webp" },
];

/** Índice do pilar ativo no primeiro render. */
export const ACTIVE_INDEX = 0;
