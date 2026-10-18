/**
 * Cards Section — o seletor de cartões.
 *
 * ## Só o frame do Nubank está liberado
 *
 * O Figma tem quatro frames (`97:2` Nubank, `103:248` Croma, `103:318`
 * Ultraviolet e `103:383` Business), mas **três estão ocultos** por decisão de
 * processo: o trabalho é feito um frame por vez, e cada frame liberado vira uma
 * adição aqui.
 *
 * Por isso os quatro aparecem no seletor desde o começo — é o que o frame do
 * Nubank mostra, com as quatro pílulas visíveis — mas só um tem `showcase`. A
 * ausência do campo é o que torna a pílula não-clicável, e não uma flag
 * separada: é o mesmo mecanismo do `ecosystem-pillars.ts`, e é o que impede a
 * próxima adição de virar conteúdo inventado por omissão.
 *
 * ## Os gradientes vão como data URI, e não como `radial-gradient` do CSS
 *
 * Os dois `radialGradient` do Figma vêm com `gradientTransform` em
 * `matrix(...)`, e o CSS não expressa: ele achata a elipse e ainda a gira. No
 * fundo da seção a rotação é de ~30° e a elipse éalongada; aproxima-la por
 * `radial-gradient(…) at …` clarearia a lateral errada e entregaria um fundo
 * visivelmente diferente do design. O export vai cru, que é literalmente o que
 * o Figma produziu.
 *
 * Duas armadilhas já conhecidas e já aplicadas aqui:
 *
 * 1. **Os `rgba()` do export não podem virar hex.** Dentro de `url("data:…")` um
 *    `#` não escapado é lido como fragmento de URL e trunca a string no meio — o
 *    gradiente simplesmente não aparece, sem erro no console.
 * 2. **`background-size` tem que ser explícito** (`100% 100%` +
 *    `background-repeat: no-repeat`, no `globals.css`). O SVG tem `viewBox` e não
 *    tem `width`/`height`, e aí os motores discordam do que `auto` significa: o
 *    Chrome estica até a caixa e o Firefox usa as dimensões do viewBox e
 *    **repete**. Já custou um bug real na Ecossystem.
 */

/**
 * Fundo da seção — gradiente radial de **oito** paradas.
 *
 * Lido do nó `97:2`. A primeira parada é `Purple/50` (#faf5ff), a última é
 * `Purple/700` (#820ad1) — dois nomes de variable que ainda não são token. Não
 * viram token porque estão dentro do gradiente: as seis paradas do meio são
 * interpolações, e tokenizar isso seria inventar cor.
 *
 * O `viewBox` é `1920×1086`, as dimensões reais do frame.
 */
export const SECTION_BACKGROUND = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1920 1086' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(54.95 220.87 -390.49 129.86 960 543)'><stop stop-color='rgba(250,245,255,1)' offset='0'/><stop stop-color='rgba(220,186,244,1)' offset='0.25'/><stop stop-color='rgba(190,128,232,1)' offset='0.5'/><stop stop-color='rgba(175,98,226,1)' offset='0.625'/><stop stop-color='rgba(160,69,221,1)' offset='0.75'/><stop stop-color='rgba(145,39,215,1)' offset='0.875'/><stop stop-color='rgba(138,25,212,1)' offset='0.9375'/><stop stop-color='rgba(130,10,209,1)' offset='1'/></radialGradient></defs></svg>")`;

export type ShowcaseCard = {
  id: string;

  /** Rótulo da pílula no seletor. */
  label: string;

  /**
   * Tudo que só existe quando o frame do pilar está liberado.
   *
   * A ausência é o que torna a pílula não-clicável, e a tela só tem uma pílula
   * funcional enquanto só houver um frame liberado.
   */
  showcase?: {
    /** Gradiente do cartão, lido do frame. */
    gradient: string;

    /**
     * Tinta do nome impresso no cartão.
     *
     * Varia por cartão porque a tinta acompanha o fundo: no Nubank o cartão é
     * roxo e o nome é branco, no pior ponto do gradiente dá 5,30:1 — passa em AA
     * para texto pequeno. Quando vier o frame claro do Croma ou do Empresas,
     * este campo é o que muda, e não uma regra no CSS.
     */
    ink: string;

    /** Nome impresso no cartão. */
    holder: string;

    /** Rede de cartões no canto superior esquerdo, em `/public/images/credit-card`. */
    network: string;

    /** Marca `nu` no rodapé do cartão, em `/public/images/credit-card`. */
    nuLogo: string;

    /** Título abaixo do cartão. */
    title: string;

    /** Descrição, nas duas linhas em que o design quebra. */
    desc: [string, string];

    /** Rótulo do CTA. */
    cta: string;
  };
};

export const CARDS: ShowcaseCard[] = [
  {
    id: "nubank",
    label: "Nubank",
    showcase: {
      /**
       * Radial de três paradas, lido do nó `98:150`. As três cores já são
       * tokens do projeto (`Purple/600`, a interpolação do meio e `Purple/800`),
       * mas o `gradientTransform` em `matrix(...)` continua não sendo expressável
       * em CSS — a matriz é degenerada (`r=10` esticado por `27.015`), então a
       * elipse é praticamente uma reta e a rotação dela é o desenho.
       */
      gradient: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 252.17 400' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0.043629 27.015 -17.031 0.027435 126.09 200)'><stop stop-color='rgba(155,47,232,1)' offset='0'/><stop stop-color='rgba(131,28,203,1)' offset='0.5'/><stop stop-color='rgba(106,8,173,1)' offset='1'/></radialGradient></defs></svg>")`,
      ink: "#ffffff",
      holder: "PAULO VINICIUS",
      network: "/images/credit-card/nubank-network.svg",
      nuLogo: "/images/credit-card/nubank-nu-logo.svg",
      title: "Cartão Nubank",
      desc: [
        "Cartão sem anuidade, com controle financeiro pelo aplicativo,",
        "pagamentos digitais e praticidade para o dia a dia.",
      ],
      cta: "Conheça o Cartão Nubank",
    },
  },
  { id: "croma", label: "Croma" },
  { id: "ultravioleta", label: "Ultravioleta" },
  { id: "empresas", label: "Empresas" },
];

/** Índice do cartão ativo no primeiro render. */
export const ACTIVE_INDEX = 0;

/**
 * Geometria do cartão de crédito, lida do nó `98:150`.
 *
 * Fica em um objeto e não em classes soltas porque é o mesmo número que o
 * `viewBox` do gradiente (`252.17×400`) e que o `background-size` resolve: se
 * um mudar e o outro não, o gradiente estica e ninguém vê o motivo.
 */
export const CARD_GEOMETRY = {
  width: 252.174,
  height: 400,
  radius: 10.435,
  padding: 20.87,
} as const;