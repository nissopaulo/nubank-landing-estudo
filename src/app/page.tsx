import { HeroSection } from "@/components/hero/HeroSection";
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

      <SiteHeader />
      <main>
        <HeroSection />
        <PendingSections />
      </main>
      <SiteFooter />
    </>
  );
}
