"use client";

import { motion } from "motion/react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";

import { CardsShowcase } from "@/components/hero/CardsShowcase";
import { CtaLink } from "@/components/ui/CtaLink";
import { DURATION, EASE_OUT_EXPO, revealUp, staggerContainer } from "@/lib/motion";

/**
 * Hero Section — Figma node 14:446 (1920x1080).
 *
 * Medidas do design (absolute, em px):
 *   padding-top 24 · header 100 · gap 100 · título em y=224 · 234 de altura
 *   gap 24 · subtítulo · gap 64 · botões em y=565 · 40 de altura
 *
 * O bloco de texto usa fluxo natural com tipografia fluida (`clamp`). A
 * composição de cards é uma montagem artística e mantém posição proporcional
 * via `cqw` — ver `lib/hero-cards.ts`.
 */
export function HeroSection() {
  return (
    <section
      id="conteudo"
      aria-labelledby="hero-titulo"
      className="hero relative isolate flex min-h-[100svh] flex-col overflow-clip pt-20 md:pt-24 lg:pt-[124px]
        bg-[linear-gradient(180deg,#820ad1_0%,#9b2fe8_52%,#d8b4fe_86%,#f3e8ff_100%)]
        [container-type:inline-size]"
    >
      <CardsShowcase />

      <motion.div
        className="relative z-10 flex w-full flex-1 flex-col px-5 md:px-10 lg:px-[200px] 2xl:px-[clamp(200px,10.4vw,320px)]"
        variants={staggerContainer(0.1, 0.15)}
        initial="hidden"
        animate="visible"
      >
        {/* gap de 100px entre o header (que é fixo) e o bloco de conteúdo */}
        <div className="mt-[clamp(2.5rem,9vh,6.5rem)] flex flex-col items-start lg:mt-25">
          <h1
            id="hero-titulo"
            className="font-display text-[clamp(2.25rem,7.6vw,6rem)] font-bold leading-[1.22] tracking-[-0.02em] text-white"
          >
            <motion.span variants={revealUp} className="block">
              Seu dinheiro.
            </motion.span>
            <motion.span variants={revealUp} className="block">
              Suas escolhas. Seu ritmo.
            </motion.span>
          </h1>

          <motion.p
            variants={revealUp}
            /*
             * Figma usa `leading: normal` para o Inter de 16px (≈19px de
             * caixa). `leading-relaxed` dava 26px e empurrava os botões 7px
             * para baixo.
             *
             * Cor: o Figma pede Neutral/200 (#e5e7eb), que rende 2.74:1 sobre
             * o gradiente aqui — abaixo de AA. Trocamos por branco (mesma
             * aparência na prática) e chegamos a 3.4:1. Ainda não atinge 4.5:1;
             * ver README > Acessibilidade para as opções de correção.
             */
            className="mt-6 max-w-[46ch] font-body text-base leading-[1.2] text-white lg:mt-6 lg:max-w-none lg:text-base"
          >
            Uma experiência financeira feita para acompanhar você, simplificar
            decisões e abrir novas possibilidades.
          </motion.p>

          <motion.div variants={revealUp} className="mt-10 flex flex-wrap items-center gap-3 lg:mt-16">
            <CtaLink variant="solid" href="https://www.nubank.com.br/">
              Quero ser Nubank
            </CtaLink>

            {/*
              PROVISÓRIO — aponta para a seção "em construção". Quando você
              desenhar "Porque a Nu" no Figma, troque por `#porque-a-nu`.
            */}
            <CtaLink variant="ghost" href="#proximas-secoes">
              Explore o Universo Nu
              <CaretRight size={20} weight="regular" aria-hidden="true" />
            </CtaLink>
          </motion.div>
        </div>
      </motion.div>

      {/* Indicador de rolagem — apenas desktop. Quem prefere menos movimento
          não vê a animação porque o MotionConfig desliga transforms. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-10 z-10 hidden justify-center lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.slow, delay: 1.2, ease: EASE_OUT_EXPO }}
      >
        <span className="flex h-11 w-[26px] items-start justify-center rounded-full border-2 border-white/40 p-1.5">
          <motion.span
            className="h-2 w-2 rounded-full bg-white/80"
            animate={{ y: [0, 14, 0], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}