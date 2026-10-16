import { CtaLink } from "@/components/ui/CtaLink";

/**
 * PROVISÓRIO — as seções "Porque a Nu", "Cartões" e "Diferenciais" ainda não
 * foram desenhadas no Figma. Este bloco existe apenas para que o CTA
 * "Explore o Universo Nu" tenha um destino real e para deixar claro o que
 * falta. Substitua pelo conteúdo definitivo assim que o design existir.
 */
export function PendingSections() {
  const pending = ["Porque a Nu", "Cartões", "Diferenciais"];

  return (
    <section
      id="proximas-secoes"
      aria-labelledby="proximas-secoes-titulo"
      className="w-full px-5 py-24 md:px-10 lg:px-[200px] 2xl:px-[clamp(200px,10.4vw,320px)] lg:py-32"
    >
      <h2
        id="proximas-secoes-titulo"
        className="font-display text-3xl font-bold text-nu-neutral-800 md:text-4xl"
      >
        Em construção
      </h2>

      <p className="mt-4 max-w-[60ch] font-body text-lg leading-relaxed text-nu-neutral-800/70">
        As próximas seções da landing page ainda estão sendo desenhadas no
        Figma. Este espaço será substituído pelo conteúdo definitivo.
      </p>

      <ul className="mt-10 flex flex-wrap gap-3">
        {pending.map((name) => (
          <li
            key={name}
            className="rounded-full border border-dashed border-nu-neutral-300 px-5 py-2.5 font-display text-sm text-nu-neutral-400"
          >
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-nu-neutral-200 bg-nu-neutral-100">
      <div className="w-full px-5 py-14 md:px-10 lg:px-[200px] 2xl:px-[clamp(200px,10.4vw,320px)]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[68ch]">
            <p className="font-display text-lg font-semibold text-nu-neutral-800">
              Projeto de estudo — não oficial
            </p>
            <p className="mt-3 font-body text-sm leading-relaxed text-nu-neutral-800/70">
              Esta página é um <strong>estudo de portfólio</strong> e não tem
              nenhum vínculo com a Nu Pagamentos S.A. Nubank é uma marca
              registrada de seus respectivos donos. O layout e as cores foram
              reproduzidos a partir de um arquivo autoral no Figma, apenas
              para fins de aprendizado. Não há vínculo comercial, não há
              captação de dados e nenhum formulário envia ou armazena
              informações.
            </p>
          </div>

          <CtaLink variant="solid" href="https://www.nubank.com.br/">
            Venha também para a Nubank
          </CtaLink>
        </div>

        <p className="mt-12 font-body text-xs text-nu-neutral-400">
          © 2026 — projeto de estudo. Desenvolvido com Next.js, Tailwind CSS e
          Motion.
        </p>
      </div>
    </footer>
  );
}