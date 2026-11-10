/**
 * Grão de textura de **uma seção**, abaixo do conteúdo.
 *
 * Ver `globals.css` > `.nu-grain` para o porquê de cada escolha. Em resumo: a
 * camada é `absolute`, `z-index: -1`, e a seção que a recebe precisa de
 * `relative isolate`. Ela entra como **último filho** da seção para pintar
 * acima de outras camadas negativas (o fundo que entra na Cards, a arte da
 * Solutions) e abaixo de todo o texto e dos controles.
 *
 * Era uma camada `fixed` de página inteira, por cima do texto — e era ela que
 * derrubava o contraste das tintas escuras. O header fica fora das seções, e
 * por isso continua sem grão, como o requisito pedia.
 *
 * É um componente de servidor de propósito: não usa estado nem efeito, então
 * entra no HTML estático sem custo de hidratação.
 */
export function SectionGrain() {
  return <div className="nu-grain" aria-hidden="true" />;
}
