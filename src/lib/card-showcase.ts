/**
 * Cards Section — o seletor de cartões.
 *
 * ## O que está liberado no Figma
 *
 * A seção tem quatro frames (`97:2` Nubank, `103:248` Croma, `103:318`
 * Ultravioleta e `103:383` Business) e o trabalho é feito **um frame por vez**.
 * Hoje há dois: o Nubank e o Croma. Os outros dois seguem ocultos, e as
 * pílulas correspondentes aparecem no seletor como `<button>` com `aria-disabled`
 * e aviso para leitor de tela.
 *
 * A ausência do campo `showcase` é o que torna a pílula não-clicável, e não uma
 * flag separada: é o mesmo mecanismo do `ecosystem-pillars.ts`, e é o que impede
 * a próxima adição de virar conteúdo inventado por omissão.
 *
 * ## Nada aqui é cor genérica: cada frame traz a sua
 *
 * O que o segundo frame mostrou, e que é o motivo deste arquivo ter Crescido:
 *
 * - **O fundo da seção é por pilar.** Roxo radial de 8 paradas no Nubank,
 *   creme radial de 5 paradas no Croma.
 * - **As pílulas são por pilar.** No Nubank a ativa é `Action/action-primary`
 *   com texto branco, e as inativas têm borda da marca. No Croma a ativa é
 *   `#eeece9` com texto `Text/text-brand`, e as inativas têm borda e texto
 *   `#8f7f64` — que **não** é token do projeto e entra aqui como literal do
 *   Figma.
 * - **A tinta da descrição é por pilar.** `Text/text-primary` (#111) no Nubank,
 *   `Text/text-brand` (#820ad1) no Croma.
 * - **A composição do cartão é por pilar.** Não é abstração: os dois frames
 *   montam as mesmas três peças em árvores diferentes. Ver `layout`.
 *
 * O que **não** virou campo, porque é igual nos dois e seria chute:
 * `Action/action-primary` no CTA e `Background/bg-brand` no título. Se um frame
 * futuro divergir, o campo entra na hora — não antes.
 */

/**
 * As cores que cercam a seção inteira e mudam por pilar.
 *
 * Ficam fora de `showcase` de propósito: `showcase` é o que habilita a troca,
 * e estas cores existem mesmo para um frame ainda não liberado — é o que faz a
 * pílula dele já aparecer na cor certa se o usuário passar o mouse.
 */
export type CardChrome = {
  /** Fundo da seção. */
  background: string;
  pill: {
    /** Fundo da pílula ativa. */
    onBg: string;
    /** Texto da pílula ativa. */
    onBgInk: string;
    /** Texto da pílula inativa. */
    idleInk: string;
    /** Borda da pílula inativa. */
    idleBorder: string;
  };
};

/**
 * Como o frame compõe as peças dentro do cartão.
 *
 * `stack` — três peças empilhadas, sem rotação, alinhadas à esquerda.
 *   É o `97:2`.
 *
 * `rotated` — duas linhas, alinhadas à direita, e **cada peça girada 90°**.
 *   É o `103:248`: o nome e a marca `nu` na primeira linha, lado a lado, e a
 *   rede de cartões na segunda.
 *
 * Não é escolha de implementação — é a árvore que o Figma tem. Um modelo único
 * teria de forçar um dos dois num arranjo que o design não usa, e a diferença
 * entre eles é justamente o que dá a variedade da seção.
 */
export type CardLayout = "stack" | "rotated";

export type ShowcaseCard = {
  id: string;

  /** Rótulo da pílula no seletor. */
  label: string;

  /** Cores da seção neste pilar. */
  chrome: CardChrome;

  /**
   * Tudo que só existe quando o frame do pilar está liberado.
   *
   * A ausência é o que torna a pílula não-clicável, e a seção só tem troca
   * funcional enquanto houver dois frames liberados.
   */
  showcase?: {
    layout: CardLayout;

    /**
     * Gradiente do cartão.
     *
     * Vai como CSS quando o Figma exporta `linear-gradient` — é o caso do
     * Croma, e o CSS expressa o ângulo sem esforço. Vira data URI quando vem
     * `radialGradient` com `gradientTransform` em `matrix(...)`, que o CSS não
     * expressa: ele achata a elipse e ainda a gira. É o caso do Nubank, cuja
     * matriz é degenerada (`r=10` esticado por `27.015`) — a elipse é
     * praticamente uma reta e a rotação dela **é** o desenho.
     */
    gradient: string;

    /**
     * Tinta do nome impresso no cartão.
     *
     * Branco no Nubank (roxo atrás) e `Purple/800` (#6a08ad) no Croma (creme
     * atrás). Acompanha o fundo, como nos cartões do Ecossystem.
     */
    ink: string;

    /** Nome impresso no cartão. */
    holder: string;

    /** Peças do cartão, em `/public/images/credit-card`. */
    network: string;
    nuLogo: string;

    /**
     * O chip, que é por pilar em posição e em peça.
     *
     * A caixa é a mesma nos dois frames (39,13 × 53,043) e por isso não é um
     * campo — a posição é, e o recuo do "N" também: no Croma o "N" está
     * girado dentro do chip e o inset é outro. São assets separados porque cada
     * frame exporta o seu, e é o export que se usa.
     */
    chip: {
      left: number;
      top: number;
      /** `inset` do "N", na ordem do CSS: topo, direita, base, esquerda. */
      contactInset: string;
      contact: string;
      lines: string;
    };

    /** Título abaixo do cartão. */
    title: string;

    /** Descrição, nas duas linhas em que o design quebra. */
    desc: [string, string];

    /** Tinta da descrição. */
    descInk: string;

    /** Rótulo do CTA. */
    cta: string;
  };
};

export const CARDS: ShowcaseCard[] = [
  {
    id: "nubank",
    label: "Nubank",
    chrome: {
      background: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1920 1086' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(54.95 220.87 -390.49 129.86 960 543)'><stop stop-color='rgba(250,245,255,1)' offset='0'/><stop stop-color='rgba(220,186,244,1)' offset='0.25'/><stop stop-color='rgba(190,128,232,1)' offset='0.5'/><stop stop-color='rgba(175,98,226,1)' offset='0.625'/><stop stop-color='rgba(160,69,221,1)' offset='0.75'/><stop stop-color='rgba(145,39,215,1)' offset='0.875'/><stop stop-color='rgba(138,25,212,1)' offset='0.9375'/><stop stop-color='rgba(130,10,209,1)' offset='1'/></radialGradient></defs></svg>")`,
      pill: {
        onBg: "#820ad1",
        onBgInk: "#ffffff",
        idleInk: "#820ad1",
        idleBorder: "#820ad1",
      },
    },
    showcase: {
      layout: "stack",
      gradient: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 252.17 400' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0.043629 27.015 -17.031 0.027435 126.09 200)'><stop stop-color='rgba(155,47,232,1)' offset='0'/><stop stop-color='rgba(131,28,203,1)' offset='0.5'/><stop stop-color='rgba(106,8,173,1)' offset='1'/></radialGradient></defs></svg>")`,
      ink: "#ffffff",
      holder: "PAULO VINICIUS",
      network: "/images/credit-card/nubank-network.svg",
      nuLogo: "/images/credit-card/nubank-nu-logo.svg",
      chip: {
        left: 130.43,
        top: 47.83,
        contactInset: "31.92% 26.67% 31.45% 28.69%",
        contact: "/images/credit-card/chip-contact.svg",
        lines: "/images/credit-card/chip-lines.svg",
      },
      title: "Cartão Nubank",
      desc: [
        "Cartão sem anuidade, com controle financeiro pelo aplicativo,",
        "pagamentos digitais e praticidade para o dia a dia.",
      ],
      descInk: "#111111",
      cta: "Conheça o Cartão Nubank",
    },
  },
  {
    id: "croma",
    label: "Croma",
    chrome: {
      /**
       * Radial de **cinco** paradas, creme. O `gradientTransform` gira ~29° e a
       * elipse é quase redonda, ao contrário do Nubank — e mesmo assim o CSS não
       * expressa a rotação, então vai como data URI pelo mesmo motivo.
       *
       * A primeira parada é `#eeece9` e a última `#8f7f64`. Nenhuma das duas é
       * token: `#8f7f64` não existe no design system do projeto, e `#eeece9`
       * também não. São valores literais do arquivo de design, como o gradiente
       * linear do Ecossystem.
       */
      background: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1920 1086' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(179.8 101.55 -101.55 179.8 960 543)'><stop stop-color='rgba(238,236,233,1)' offset='0'/><stop stop-color='rgba(215,207,193,1)' offset='0.25'/><stop stop-color='rgba(191,178,153,1)' offset='0.5'/><stop stop-color='rgba(167,153,127,1)' offset='0.75'/><stop stop-color='rgba(143,127,100,1)' offset='1'/></radialGradient></defs></svg>")`,
      pill: {
        onBg: "#eeece9",
        onBgInk: "#820ad1",
        /**
         * `#8f7f64` é a última parada do gradiente da seção, usada como tinta e
         * borda da pílula inativa. Não é token e não tem variable no Figma deste
         * nó — é literal, e por isso entra aqui e não no `globals.css`.
         */
        idleInk: "#8f7f64",
        idleBorder: "#8f7f64",
      },
    },
    showcase: {
      layout: "rotated",
      /**
       * Linear puro — o único gradiente da seção que o CSS expressa sozinho,
       * porque aqui não há `gradientTransform` para achatar nem girar. As três
       * cores são `#eeece9`, `#bfb299` e `#8f7f64`, as mesmas do fundo da seção.
       */
      gradient:
        "linear-gradient(212.2287526257366deg, #eeece9 0%, #bfb299 50.141%, #8f7f64 100%)",
      ink: "#6a08ad",
      holder: "PAULO VINICIUS",
      network: "/images/credit-card/croma-network.svg",
      nuLogo: "/images/credit-card/croma-nu-logo.svg",
      chip: {
        left: 86.96,
        top: 304.35,
        contactInset: "33.77% 24.16% 33.3% 26.18%",
        contact: "/images/credit-card/croma-chip-contact.svg",
        lines: "/images/credit-card/croma-chip-lines.svg",
      },
      title: "Cartão Croma",
      desc: [
        "Cashback de 0,8% nas compras elegíveis, até 5% em assinaturas selecionadas e",
        "benefícios exclusivos por uma mensalidade de R$ 39, com possibilidade de isenção.",
      ],
      descInk: "#820ad1",
      cta: "Conheça o Cartão Croma",
    },
  },
  {
    id: "ultravioleta",
    label: "Ultravioleta",
    chrome: {
      background: "#ffffff",
      pill: { onBg: "#820ad1", onBgInk: "#ffffff", idleInk: "#820ad1", idleBorder: "#820ad1" },
    },
  },
  {
    id: "empresas",
    label: "Empresas",
    chrome: {
      background: "#ffffff",
      pill: { onBg: "#820ad1", onBgInk: "#ffffff", idleInk: "#820ad1", idleBorder: "#820ad1" },
    },
  },
];

/** Índice do cartão ativo no primeiro render. */
export const ACTIVE_INDEX = 0;

/**
 * Geometria da caixa do cartão, lida dos nós `98:150` e `103:290`.
 *
 * Os dois frames usam exatamente a mesma caixa — 252,174 × 400, raio 10,435,
 * padding 20,87. Fica num objeto e não em classes soltas porque é o mesmo
 * número que o `viewBox` do gradiente do Nubank resolve: se um mudar e o outro
 * não, o gradiente estica e ninguém vê o motivo.
 */
export const CARD_GEOMETRY = {
  width: 252.174,
  height: 400,
  radius: 10.435,
  padding: 20.87,
} as const;

/** Caixa do chip — igual nos dois frames. */
export const CHIP_GEOMETRY = {
  width: 39.13,
  height: 53.043,
  radius: 5.217,
  border: 0.435,
} as const;