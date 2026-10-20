/**
 * Solutions Section — as quatro opções do seletor.
 *
 * ## O quadro do Figma
 *
 * A seção tem **quatro frames**, e **dois** estão liberados:
 *
 * | opção        | frame                            | nó        | estado   |
 * |--------------|----------------------------------|-----------|----------|
 * | Caixinhas    | `Solutions Section - Piggybank`  | `178:205` | liberado |
 * | Conta        | `Solutions Section - Account`    | `178:262` | liberado |
 * | Empréstimos  | `Solutions Section - Advance`    | `178:281` | oculto  |
 * | E muito mais | `Solutions Section - More`        | `178:296` | oculto  |
 *
 * Os dois ocultos **existem** no arquivo — com a arte, o título e a descrição
 * deles — e as artes já estão no repositório. O que não entra no código é o
 * **conteúdo** deles: um frame que o processo não liberou não vira texto
 * publicado. A ausência de `showcase` é o que torna a pílula não-clicável, e
 * é o mesmo mecanismo de `card-showcase.ts` — o que impede a próxima adição de
 * virar conteúdo inventado por omissão.
 *
 * ## Os dois frames liberados são idênticos fora da arte e do texto
 *
 * Conferido no `178:262`: a navegação, o vidro, o raio, a sombra, o padding, o
 * título em 48 px, a descrição em 16 px e o CTA são **os mesmos** do
 * `178:205`. A única variable nova do quadro é `Text/text-secondary`
 * (#4b5563), e ela é a tinta da descrição nos **dois** frames.
 *
 * O que muda entre eles é a arte de fundo e o texto do painel — e é por isso
 * que a troca de opção é uma troca de *cena*, e não de layout.
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
  };
};

export const SOLUTIONS: SolutionOption[] = [
  {
    id: "piggybank",
    label: "Caixinhas",
    background: "/images/backgrounds/piggybank-bg.webp",
    showcase: {
      title: "Seus planos merecem sair do papel.",
      desc: "Organize seu dinheiro por objetivos, guarde no seu ritmo e acompanhe cada passo até chegar onde você quer.",
      cta: "Conheça mais sobre",
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
    },
  },
  {
    id: "advance",
    label: "Empréstimos",
    background: "/images/backgrounds/advance-bg.webp",
  },
  {
    id: "more",
    label: "E muito mais",
    background: "/images/backgrounds/more-bg.webp",
  },
];

/** Índice da opção mostrada no primeiro render. */
export const ACTIVE_SOLUTION = 0;
