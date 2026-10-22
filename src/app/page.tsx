import { CardsSection } from "@/components/cards/CardsSection";
import { EcosystemSection } from "@/components/ecosystem/EcosystemSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { SolutionsSection } from "@/components/solutions/SolutionsSection";
import { NoiseOverlay } from "@/components/site/NoiseOverlay";
import { PendingSections, SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function Home() {
  return (
    <>
      <a
        href="#conteudo"
        /*
         * `data-surface="dark"`: o skip link aparece no topo esquerdo, **por
         * cima da Hero**, que é roxa. O fundo dele é branco, mas o que está
         * atrás é a superfície escura — e é contra ela que a banda do anel de
         * foco precisa contrastar.
         */
        data-surface="dark"
        className="sr-only-focusable absolute left-4 top-4 z-[100] rounded-full bg-white px-5 py-3 font-display font-semibold text-nu-brand shadow-lg"
      >
        Pular para o conteúdo
      </a>

      {/* Textura da página inteira. Fica antes do header no DOM e abaixo dele
          em z-index (40 contra 50), então o header nunca recebe grão. */}
      <NoiseOverlay />

      <SiteHeader />
      <main>
        <HeroSection />
        <EcosystemSection />
        <CardsSection />
        <SolutionsSection />
        <PendingSections />
      </main>
      <SiteFooter />
    </>
  );
}
