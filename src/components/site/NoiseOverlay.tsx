/**
 * Grão de textura sobre a página inteira.
 *
 * Convenção da landing page (ver `globals.css` > `.nu-grain` para o porquê de
 * cada escolha): dá profundidade sem competir com o texto e sem custar uma
 * requisição — o ruído é um `feTurbulence` inline, não um asset.
 *
 * Fica em `z-index: 40`, abaixo do header (`z-50`), que por isso nunca recebe
 * grão — inclusive ao rolar, que era o requisito.
 *
 * É um componente de servidor de propósito: não usa estado nem efeito, então
 * entra no HTML estático sem custo de hidratação.
 */
export function NoiseOverlay() {
  return <div className="nu-grain" aria-hidden="true" />;
}