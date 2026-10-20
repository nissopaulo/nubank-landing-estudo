import type { ReactNode } from "react";

/**
 * Pílula de um seletor de opções.
 *
 * ## É o mesmo componente nas duas seções
 *
 * A Cards Section e a Solutions Section têm **o mesmo seletor**: quatro pílulas
 * que escolhem uma opção e trocam o conteúdo da seção. A diferença entre elas
 * é só a paleta, e ela chega por custom property — no Nubank a pílula ativa é
 * `Action/action-primary` com texto branco, e no Croma é `#eeece9` com texto
 * `Text/text-brand`. Com `#8f7f64` — que não é token — nas inativas do Croma,
 * não há classe a escrever: o valor vem do Figma e entra por `style`.
 *
 * As duas seções usam, portanto, **o mesmo componente e a mesma regra de CSS**.
 *
 * ## O padding compensa a borda, e isso não é detalhe
 *
 * O auto-layout do Figma **exclui o traço do tamanho do quadro**: a pílula
 * `101:186` tem 102 de largura e o texto 66, a 18 da borda — `18 + 66 + 18 =
 * 102`, sem o traço de 1 px. E a altura é `10 + 20 + 10 = 40`.
 *
 * No CSS o `border` **sempre** entra na caixa. Por isso o padding da pílula
 * com borda é 17 (e não 18), e o da pílula sem borda é 18 (e não 17): os dois
 * casos dão a mesma caixa, e o texto fica a 18 da borda nos dois — exatamente
 * como no Figma.
 *
 * A consequência importante é que a pílula ativa **não tem** `border-width`, e
 * não uma borda transparente: com a borda transparente ela ocuparia 1 px a
 * mais e ficaria 2 px mais larga que a inativa.
 *
 * ## O cursor precisa da regra
 *
 * O UA stylesheet põe `cursor: default` em `<button>` e o preflight do
 * Tailwind v4 não desfaz — a mesma razão do `.eco-card`.
 */
type PillTabProps = {
  /** Rótulo da pílula. */
  label: string;
  /** Esta é a opção selecionada. */
  selected: boolean;
  /**
   * O frame da opção já está liberado, e portanto ela responde.
   *
   * Quando é `false`, a pílula continua visível e focável, mas não faz nada —
   * e o aviso em `sr-only` diz isso ao leitor de tela, porque **um botão que
   * não faz nada não existe em silêncio**.
   */
  liberado: boolean;
  /** `id` do botão, para o `aria-labelledby` do painel. */
  id?: string;
  /** `id` do painel que esta pílula controla. */
  controls?: string;
  /** Chamado no clique, quando a opção está liberada. */
  onSelect?: () => void;
  /** Conteúdo extra depois do rótulo. */
  children?: ReactNode;
};

export function PillTab({
  label,
  selected,
  liberado,
  id,
  controls,
  onSelect,
  children,
}: PillTabProps) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={liberado ? selected : undefined}
      aria-disabled={!liberado}
      aria-controls={controls}
      onClick={liberado ? onSelect : undefined}
      data-state={selected ? "active" : "idle"}
      className="pill-tab shrink-0 whitespace-nowrap rounded-[100px] font-display text-[16px] font-semibold leading-[1.25]"
    >
      {label}
      {!liberado && (
        <span className="sr-only">— ainda não implementado neste estudo</span>
      )}
      {children}
    </button>
  );
}
