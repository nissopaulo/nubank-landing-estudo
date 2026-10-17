import { EcosystemSection } from "@/components/ecosystem/EcosystemSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { NoiseOverlay } from "@/components/site/NoiseOverlay";
import { PendingSections, SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function Home() {
  return (
    <>
      <a
        href="#conteudo"
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
        <PendingSections />
      </main>
      <SiteFooter />
    </>
  );
}
