/**
 * Cards Section — o seletor de cartões.
 *
 * ## O que está liberado no Figma
 *
 * A seção tem quatro frames (`97:2` Nubank, `103:248` Croma, `103:318`
 * Ultravioleta e `103:383` Business) e o trabalho é feito **um frame por vez**.
 * Hoje há **quatro**: Nubank, Croma, Ultravioleta e Empresas. A seção está
 * completa, e nenhuma pílula fica `aria-disabled`.
 *
 * A ausência do campo `showcase` é o que torna a pílula não-clicável, e não uma
 * flag separada: é o mesmo mecanismo do `ecosystem-pillars.ts`, e é o que impede
 * a próxima adição de virar conteúdo inventado por omissão.
 *
 * ## Nada aqui é cor genérica: cada frame traz a sua
 *
 * Os quatro frames estão liberados e a seção está completa. O que eles
 * mostraram, e que é o motivo deste arquivo ter crescido:
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
 * - **A composição do cartão é por pilar.** Não é abstração: os frames montam
 *   as mesmas peças em árvores diferentes. Ver `layout`.
 * - **A pílula ativa deixa de ser a cor da marca no Ultravioleta.** Passa a ser
 *   `Purple/950`, com a inativa em contorno branco. É a primeira vez que a
 *   ativa não é `#820ad1`, e é o que impede a troca de se ler "roxo sobre roxo".
 * - **O título é branco no Ultravioleta.** Era `text-nu-brand` fixo no
 *   componente — certo no Nubank e no Croma, errado aqui.
 * - **O nome do cartão é gradiente no Ultravioleta** (`background-clip: text`),
 *   e é a única peça que **falta**: o frame não tem logo de rede, e o vão de
 *   cima fica vazio. Ver `network`, `holderGradient` e `holderBox`.
 *
 * O que **não** virou campo, porque é igual nos quatro e seria chute: a caixa do
 * cartão e a do chip, e o gradiente do chip.
 *
 * E o que é divergência **de layout** continua sendo dos dois tipos, porque
 * são as duas árvores que o Figma tem: `stack` (Nubank e Empresas), `stack` com
 * o nome absoluto e `justify-end` (Ultravioleta) e `rotated` (Croma).
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

  /**
   * A superfície da seção é **clara** ou **escura**.
   *
   * Não é estilo: é o que decide **qual das duas bandas do anel de foco**
   * contrasta com o fundo — e o fundo é o gradiente deste frame, que muda de
   * claro para escuro entre eles.
   *
   * Vem do mesmo fato que `titleInk`: a tinta que o Figma escolhe para o
   * título só funciona sobre a superfície em que ele foi posto. Tinta clara
   * (branco) é fundo escuro; tinta da marca é fundo claro.
   */
  surface: "light" | "dark";

  /**
   * Tinta do título abaixo do cartão.
   *
   * Entra no `chrome` e não no `showcase` porque é uma cor da seção, e as
   * cores da seção existem mesmo para um frame ainda não liberado — é o que faz
   * a pílula dele já aparecer na cor certa.
   *
   * E é campo desde o Ultravioleta: o título era `text-nu-brand` fixo no
   * componente, o que está certo no Nubank e no Croma e **errado** no
   * Ultravioleta, onde o Figma põe `Text/text-on-brand` (branco) sobre um fundo
   * roxo escuro.
   */
  titleInk: string;
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

    /**
     * O nome em **gradiente**, quando o frame usa um.
     *
     * É `background-clip: text` no Figma, e não uma cor sólida: o frame do
     * Ultravioleta pinta o nome de `Neutral/400` a `Neutral/100`. Vira
     * `background-image` com `color: transparent`.
     *
     * Ausente nos outros dois frames, que têm tinta sólida em `ink`.
     */
    holderGradient?: string;

    /**
     * O nome posicionado **absolutamente** contra o cartão.
     *
     * No frame do Ultravioleta o nome é absoluto em `(20,87 ; 192,69)` e a
     * marca `nu` é a única peça no fluxo — não há logo de rede, e sobra o vão
     * de cima. Sem isto o `justify-end` da coluna jogaria o nome para o topo.
     *
     * Ausente nos outros dois frames, onde o nome flui na coluna e é o
     * `justify-between` que o posiciona.
     */
    holderBox?: { left: number; top: number };

    /**
     * Peças do cartão, em `/public/images/credit-card`.
     *
     * A rede é **opcional**: o frame do Ultravioleta não tem logo de rede, e
     * inventar uma seria conteúdo que o design não tem. Onde falta, o espaço
     * fica vazio — que é o que o Figma mostra.
     */
    network?: string;
    nuLogo: string;

    /**
     * Rótulo ao lado da marca `nu`, no rodapé do cartão.
     *
     * Só o frame do Business tem: `business`, em `Text/text-brand` (#820ad1) e
     * 17,391 px, alinhado à base da marca numa linha de largura cheia
     * (`items-end justify-between`, nó `103:428`).
     *
     * Ausente nos outros três, onde a marca `nu` é a peça sozinha na base da
     * coluna.
     */
    rowLabel?: string;

    /**
     * Tinta do rótulo, quando ele existe.
     *
     * Entra separada porque o rótulo **não** herda a tinta do cartão: no Business
     * a `ink` do cartão é `Text/text-primary` (#111) porque o cartão é claro,
     * e o rótulo é `Text/text-brand` (#820ad1). Herdar daria cinza-escuro no
     * lugar do roxo — que é o que aconteceu na primeira versão.
     */
    rowLabelInk?: string;

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

    /**
     * Variante do CTA.
     *
     * Ausente nos dois primeiros frames, que usam `Action/action-primary` — a
     * variante `brand`. O Ultravioleta usa `Purple/950` com texto branco, e é
     * a única vez que a seção não vai na cor da marca.
     */
    ctaVariant?: "brand" | "deep";
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
      titleInk: "#820ad1",
      surface: "light",
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
      titleInk: "#820ad1",
      surface: "light",
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
      /**
       * Radial de **cinco** paradas, roxo fundo. É o mesmo gradiente do cartão
       * — as cinco cores são as mesmas e na mesma ordem —, mudando de
       * `gradientTransform`: na seção ele é quase redondo (96 × 54,3) e no
       * cartão é alongado (36,5 × 8,8), que é o que dá a diagonal do cartão.
       *
       * A matriz tem rotação, e o CSS não expressa rotação de elipse em
       * `radial-gradient`: ele achata o raio e gira o eixo. Vai como data URI
       * pelo mesmo motivo do Nubank e do Croma.
       */
      background: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1920 1086' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(96 54.3 -54.3 96 960 543)'><stop stop-color='rgba(155,47,232,1)' offset='0'/><stop stop-color='rgba(128,39,199,1)' offset='0.25'/><stop stop-color='rgba(101,32,167,1)' offset='0.5'/><stop stop-color='rgba(73,24,134,1)' offset='0.75'/><stop stop-color='rgba(46,16,101,1)' offset='1'/></radialGradient></defs></svg>")`,
      pill: {
        /**
         * Pílula **da seção**: a inativa é contorno e texto brancos, e a ativa é
         * `Purple/950` — não a cor da marca. É a primeira vez que a ativa não é
         * `#820ad1`, e é o que faz a troca não se ler como "roxo sobre roxo".
         */
        onBg: "#2e1065",
        onBgInk: "#ffffff",
        idleInk: "#ffffff",
        idleBorder: "#ffffff",
      },
      /** `Text/text-on-brand`: branco. Sobre o roxo escuro do fundo. */
      titleInk: "#ffffff",
      /** O gradiente vai de #9b2fe8 a #2e1065: fundo escuro. */
      surface: "dark",
    },
    showcase: {
      /**
       * `stack`, com duas diferenças que são **dado**, não layout: sem logo de
       * rede, e o nome absoluto. O arranjo da coluna é o mesmo do Nubank —
       * `justify-end`, `items-start`, `gap` de 8,696.
       */
      layout: "stack",
      gradient: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 252.17 400' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(36.478 8.7826 -5.537 22.997 126.09 200)'><stop stop-color='rgba(155,47,232,1)' offset='0'/><stop stop-color='rgba(128,39,199,1)' offset='0.25'/><stop stop-color='rgba(101,32,167,1)' offset='0.5'/><stop stop-color='rgba(73,24,134,1)' offset='0.75'/><stop stop-color='rgba(46,16,101,1)' offset='1'/></radialGradient></defs></svg>")`,
      ink: "#ffffff",
      holder: "Paulo Vinicius",
      /**
       * `background-clip: text` no Figma. As duas cores são tokens do design
       * system (`Neutral/400` e `Neutral/100`) e o ângulo sai da matriz do
       * gradiente, então é o único gradiente de **texto** da seção — e é
       * `linear-gradient`, que o CSS expressa sem data URI.
       *
       * A segunda parada está em 109,71%: além de 100% o CSS deixa de interpolar
       * e fica no último tom, que é o que dá o nome quase branco.
       */
      holderGradient:
        "linear-gradient(221.31042032068433deg, #9ca3af 0.81826%, #f3f4f6 109.71%)",
      /** 20,87 é o padding do cartão; 192,69 é o `top` do nó `103:381`. */
      holderBox: { left: 20.87, top: 192.69 },
      nuLogo: "/images/credit-card/ultravioleta-nu-logo.svg",
      chip: {
        /** Mesmos valores do Nubank: o chip é a mesma peça, no mesmo lugar. */
        left: 130.43,
        top: 47.83,
        contactInset: "31.92% 26.67% 31.45% 28.69%",
        contact: "/images/credit-card/ultravioleta-chip-contact.svg",
        lines: "/images/credit-card/ultravioleta-chip-lines.svg",
      },
      title: "Cartão Ultravioleta",
      desc: [
        "Experiência premium com 1,25% de cashback ou acúmulo de pontos,",
        "benefícios para viagens e mensalidade de R$ 89, com possibilidade de isenção.",
      ],
      descInk: "#ffffff",
      cta: "Conheça o Cartão Ultravioleta",
      ctaVariant: "deep",
    },
  },
  {
    id: "empresas",
    label: "Empresas",
    chrome: {
      /**
       * Radial de **duas** paradas, branco para cinza claro — e é a única seção
       * da página com o miolo branco: as outras três são coloridas de ponta a
       * ponta.
       *
       * O `gradientTransform` é `matrix(96 54.3 -54.3 96 ...)`, idêntico ao do
       * Ultravioleta, e por isso vai como data URI pelo mesmo motivo.
       *
       * `#d1d5db` é `Neutral/300` e `#ffffff` é `Neutral/100`: as duas são
       * tokens, ao contrário das cinco paradas do Croma.
       */
      background: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1920 1086' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(96 54.3 -54.3 96 960 543)'><stop stop-color='rgba(255,255,255,1)' offset='0'/><stop stop-color='rgba(209,213,219,1)' offset='1'/></radialGradient></defs></svg>")`,
      pill: {
        /** `Action/action-primary` — volta a ser a cor da marca, como no Nubank. */
        onBg: "#820ad1",
        onBgInk: "#ffffff",
        /**
         * Aqui a inativa é `Border/border-brand` e `Text/text-brand` — o par do
         * design system, ao contrário do Ultravioleta (branco) e do Croma
         * (`#8f7f64`, que não é token).
         */
        idleInk: "#820ad1",
        idleBorder: "#820ad1",
      },
      titleInk: "#820ad1",
      /** O gradiente vai de #ffffff a #d1d5db: fundo claro. */
      surface: "light",
    },
    showcase: {
      /**
       * `stack` com `justify-between` — **não** o `flex-end` do Ultravioleta.
       * Aqui são três peças no fluxo (rede, nome, pé), e o eixo principal é o de
       * sempre.
       */
      layout: "stack",
      /**
       * Radial de duas paradas, `Neutral/100` para `Neutral/300`.
       *
       * A matriz é `matrix(0.043629 27.015 ...)` — a **mesma degenerada** do
       * cartão do Nubank, em que a elipse (`r=10`) é esticada por 27 e vira
       * praticamente uma reta: o gradiente é quase vertical e a rotação dela é o
       * desenho. Vai como data URI pelo mesmo motivo.
       */
      gradient: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 252.17 400' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0.043629 27.015 -17.031 0.027435 126.09 200)'><stop stop-color='rgba(243,244,246,1)' offset='0'/><stop stop-color='rgba(209,213,219,1)' offset='1'/></radialGradient></defs></svg>")`,
      /** `Text/text-primary` — cinza-escuro sobre cartão claro, o inverso do resto. */
      ink: "#111111",
      holder: "Paulo Vinicius",
      network: "/images/credit-card/empresas-network.svg",
      nuLogo: "/images/credit-card/empresas-nu-logo.svg",
      /**
       * A única peça que só este frame tem: `business` ao lado da marca `nu`,
       * alinhado à base dela, em `Text/text-brand`.
       */
      rowLabel: "business",
      rowLabelInk: "#820ad1",
      chip: {
        /** Mesmos valores dos outros três: mesma peça, mesmo lugar. */
        left: 130.43,
        top: 47.83,
        contactInset: "31.92% 26.67% 31.45% 28.69%",
        contact: "/images/credit-card/empresas-chip-contact.svg",
        lines: "/images/credit-card/empresas-chip-lines.svg",
      },
      title: "Cartão Empresas",
      desc: [
        "Cartão empresarial sem anuidade, com controle de gastos,",
        "pagamentos digitais e recursos para simplificar a gestão financeira do negócio.",
      ],
      descInk: "#820ad1",
      cta: "Conheça o Cartão Empresas",
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