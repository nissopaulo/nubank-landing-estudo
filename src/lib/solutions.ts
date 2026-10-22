/**
 * Solutions Section — as quatro opções do seletor.
 *
 * ## O quadro do Figma
 *
 * A seção tem **quatro frames**, e **os quatro** estão liberados:
 *
 * | opção        | frame                            | nó        | estado   |
 * |--------------|----------------------------------|-----------|----------|
 * | Caixinhas    | `Solutions Section - Piggybank`  | `178:205` | liberado |
 * | Conta        | `Solutions Section - Account`    | `178:262` | liberado |
 * | Empréstimos  | `Solutions Section - Advance`    | `178:281` | liberado |
 * | E muito mais | `Solutions Section - More`        | `178:296` | liberado |
 *
 * A ausência de `showcase` é o que torna a pílula não-clicável, e é o mesmo
 * mecanismo de `card-showcase.ts` — o que impede a próxima adição de virar
 * conteúdo inventado por omissão. Com os quatro liberados, nenhuma pílula fica
 * `aria-disabled`: a regra do botão que não faz nada continua no código, e
 * não há mais nenhum caso.
 *
 * ## Os frames liberados são idênticos fora da arte e do texto
 *
 * Conferido no `178:262`: a navegação, o vidro, o raio, a sombra, o padding, o
 * título em 48 px, a descrição em 16 px e o CTA são **os mesmos** do
 * `178:205`. A única variable nova do quadro é `Text/text-secondary`
 * (#4b5563), e ela é a tinta da descrição nos **dois** frames.
 *
 * O que muda entre eles é a arte de fundo, o texto do painel e a **largura do
 * vidro** (820 no Empréstimos, 680 nos outros) — e é por isso que a troca de
 * opção é uma troca de *cena*, e não de layout.
 *
 * ## A paleta do seletor é a mesma nos quatro frames
 *
 * Verificado no frame da Conta (`181:349`), que é o único outro frame com o
 * desenho legível: a pílula ativa é `Background/bg-brand` (#820ad1) com
 * `Text/text-on-brand` (branco), e as inativas são `Text/text-brand` (#820ad1)
 * **sem fundo e sem borda**.
 *
 * Isso é diferente da Cards Section, onde a pílula inativa tem borda da marca.
 * A diferença não é estilo: é o que o desenho mostra, e ela entra como uma
 * variante do `PillTab` (`borda="nenhuma"`), não como um componente novo.
 *
 * ## A arte é o fundo da seção inteira
 *
 * Não é uma imagem dentro de uma janela: ela ocupa a seção toda, sangrando
 * pelas bordas. O `object-fit: cover` reproduz o `103,65%` de largura e o
 * `-1,82%` de deslocamento que o Figma dá à arte — a diferença para o
 * `cover` puro é de 0,5 px. Ver `README.md > Solutions Section`.
 */
export type SolutionOption = {
  /** Identificador da opção. Vira o `id` do botão e do painel. */
  id: string;

  /** Rótulo da pílula no seletor. */
  label: string;

  /**
   * Arte de fundo da seção, em `public/images/backgrounds`.
   *
   * Existe para as quatro porque as quatro artes estão no repositório — mas só
   * a da opção liberada é carregada: as outras três nunca entram no DOM.
   */
  background: string;

  /**
   * Conteúdo do painel da opção.
   *
   * Ausente enquanto o frame não for liberado, e é a ausência que desabilita a
   * pílula. `title` e `desc` são o que o Figma escreve; o `cta` é o rótulo do
   * botão.
   */
  showcase?: {
    /** Título do painel. */
    title: string;
    /** Descrição do painel. */
    desc: string;
    /** Rótulo do CTA. */
    cta: string;
    /**
     * Largura do painel de vidro, em px — a do Figma.
     *
     * **É por quadro.** O `178:281` (Empréstimos) tem **820**, e não os 680
     * dos dois primeiros: o Figma dimensiona o painel pelo texto que cabe
     * nele, e "Um próximo passo começa" é bem mais largo que "Seu dinheiro,
     * no ritmo".
     *
     * E a largura não é só um número na caixa: ela decide onde o texto
     * quebra. Por isso o texto do painel tem a largura **desta** opção, e
     * não a do vidro — senão o texto antigo se re-quebraria no meio do
     * *dissolve*, que é a pior coisa que pode acontecer com ele.
     */
    largura: number;
  };
};

/**
 * Geometria do painel de vidro.
 *
 * O padding mora aqui porque a largura do texto é **derivada**: a largura do
 * painel menos duas vezes o padding. Se o padding mudasse no CSS e não
 * aqui, o texto vazaria para fora do vidro — e ninguém veria o motivo. É a
 * mesma razão do `CARD_GEOMETRY` em `card-showcase.ts`.
 */
export const PAINEL_GEOMETRIA = {
  /** Padding do painel, em px. */
  padding: 48,
  /** Largura do painel quando a opção não diz outra, em px. */
  largura: 680,
} as const;

export const SOLUTIONS: SolutionOption[] = [
  {
    id: "piggybank",
    label: "Caixinhas",
    background: "/images/backgrounds/piggybank-bg.webp",
    showcase: {
      title: "Seus planos merecem sair do papel.",
      desc: "Organize seu dinheiro por objetivos, guarde no seu ritmo e acompanhe cada passo até chegar onde você quer.",
      cta: "Conheça mais sobre",
      largura: 680,
    },
  },
  {
    id: "account",
    label: "Conta",
    background: "/images/backgrounds/account-bg.webp",
    showcase: {
      title: "Seu dinheiro, no ritmo da sua vida.",
      desc: "Pague, transfira, receba e acompanhe suas movimentações em uma conta digital feita para simplificar o seu dia a dia.",
      cta: "Conheça mais sobre",
      largura: 680,
    },
  },
  {
    id: "advance",
    label: "Empréstimos",
    background: "/images/backgrounds/advance-bg.webp",
    showcase: {
      title: "Um próximo passo começa com boas escolhas.",
      desc: "Conheça opções de crédito, consulte as condições disponíveis para você e avalie o que faz sentido para os seus planos.",
      cta: "Conheça mais sobre",
      largura: 820,
    },
  },
  {
    id: "more",
    label: "E muito mais",
    background: "/images/backgrounds/more-bg.webp",
    showcase: {
      /**
       * O texto é **exatamente** o do Figma (nós `178:302` e `178:304`) —
       * inclusive a descrição, que é a **mesma** da opção "Conta" (`178:257`).
       *
       * Não é um erro de digitação aqui: os dois frames do arquivo têm esse
       * texto. É o desenho que está repetido, e a correção é no Figma — o
       * código segue o que está lá. Ver a pendência nº 22 no `CONTEXTO.md`.
       */
      title: "Tem muito mais do seu jeito no Nu.",
      desc: "Pague, transfira, receba e acompanhe suas movimentações em uma conta digital feita para simplificar o seu dia a dia.",
      cta: "Conheça mais sobre",
      largura: 680,
    },
  },
];

/** Índice da opção mostrada no primeiro render. */
export const ACTIVE_SOLUTION = 0;
