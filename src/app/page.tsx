import { BlogSection } from "@/components/blog/BlogSection";
import { CardsSection } from "@/components/cards/CardsSection";
import { EcosystemSection } from "@/components/ecosystem/EcosystemSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { SolutionsSection } from "@/components/solutions/SolutionsSection";
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

      <SiteHeader />
      <main>
        <HeroSection />
        <EcosystemSection />
        <CardsSection />
        <SolutionsSection />
        <BlogSection />
        <PendingSections />
      </main>
      <SiteFooter />
    </>
  );
}
