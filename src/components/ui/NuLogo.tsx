/**
 * Logo da Nu como componente React.
 *
 * **DESVIO CONSCIENTE da convenção do projeto** ("nenhum path de SVG copiado
 * para dentro do código"). O caminho original continua em
 * `public/images/brand/nu-logo.svg` e este componente o reproduz fielmente —
 * os quatro `path` são os mesmos, com `fill="white"` trocado por
 * `currentColor`.
 *
 * Motivo: o logo era desenhado com `mask-image` apontando para o SVG de
 * `/public`, para acompanhar a cor do texto quando o header passa de
 * transparente para sólido. A máscara é rasterizada pelo navegador dentro do
 * contexto de empilhamento do ancestral — e o ancestral do logo é animado
 * (transform + opacity na entrada do header). Quando essa camada é recomposta,
 * a máscara pode não estar resolvida naquele frame, e o elemento aparece como
 * o `background-color: currentColor` **sem a máscara aplicada**: um retângulo
 * branco no lugar do logo. Era um piscar no fim da animação.
 *
 * `will-change` no `.nu-icon` resolveu promote o elemento a uma camada própria,
 * mas não resolveu — porque o gatilho é a recomposição do ancestral, não o
 * elemento. Com o SVG inline não existe máscara, nem requisição, nem rasterização
 * ambígua: o `fill="currentColor"` é resolvido em CSS e o logo acompanha a cor
 * do texto sem nenhum outro mecanismo.
 *
 * O `viewBox` é preservado e o `preserveAspectRatio="none"` do original é
 * descartado: o original tinha `width="64" height="34.91"` e o CSS o estica para
 * 64×35, então a proporção é praticamente a mesma e `meet` (o padrão) evita a
 * distorção que o `none` produzia em larguras diferentes da original.
 */
export function NuLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 34.9101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0.0354405 14.3663C-0.0443006 15.9227 0.0354405 17.5156 0.0354405 19.0794V34.099H8.488V20.3377C8.488 16.0464 8.459 12.2424 8.488 11.4642C8.64748 7.75477 9.66237 5.31819 11.5689 3.33982C11.4312 3.33982 11.2717 3.32527 11.134 3.32527C7.01641 3.32527 3.15259 5.68185 1.27505 9.31855C0.426897 10.926 0.12968 12.6425 0.0354405 14.3735V14.3663Z"
        fill="currentColor"
      />
      <path
        d="M19.418 0C16.2574 0 13.5607 1.2292 11.5454 3.33848C17.8378 3.33848 21.9262 7.61522 22.1438 14.4158C22.1873 15.9723 22.209 24.3367 22.209 24.3367V34.1048H30.6616V20.911C30.6616 16.9179 30.6906 13.4703 30.4078 11.0846C29.6394 4.45131 25.5581 0.00727337 19.418 0.00727337V0Z"
        fill="currentColor"
      />
      <path
        d="M63.9646 20.5451C64.0443 18.9886 63.9646 17.3958 63.9646 15.832V0.81249H55.5119V14.5738C55.5119 18.865 55.5409 22.6691 55.5119 23.4472C55.3525 27.1566 54.3375 29.5933 52.4311 31.5716C52.5688 31.5716 52.7282 31.5861 52.866 31.5861C56.9835 31.5861 60.8473 29.2296 62.7249 25.5928C63.573 23.9854 63.8703 22.2835 63.9646 20.5379V20.5451Z"
        fill="currentColor"
      />
      <path
        d="M44.587 34.9101C47.7476 34.9101 50.4443 33.6808 52.4596 31.5716C46.1672 31.5716 42.0786 27.2948 41.8612 20.4942C41.8177 18.9377 41.7815 15.0683 41.7815 10.5734V0.81249L33.329 0.827037V14.0209C33.329 18.0141 33.2999 21.4616 33.5826 23.8472C34.3656 30.4805 38.4541 34.9101 44.587 34.9101Z"
        fill="currentColor"
      />
    </svg>
  );
}