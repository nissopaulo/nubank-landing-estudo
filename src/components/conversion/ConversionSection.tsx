"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { SectionGrain } from "@/components/site/SectionGrain";
import { CtaLink } from "@/components/ui/CtaLink";
import {
  DURATION,
  EASE_OUT_EXPO,
  personRise,
  revealUp,
  staggerContainer,
} from "@/lib/motion";

/**
 * Conversion Section — Figma `301:2` (1920×1080), com a spec `308:50` ao lado.
 *
 * ## A composição é um quadro 16:9
 *
 * A arte (`307:29`) não é um fundo que cobre a seção: é uma peça de 2024 ×
 * 1129,6 posicionada em x −52 / y 263,66 do quadro, que sangra 52 px de cada
 * lado e é cortada embaixo. O texto fica por cima da parte branca do topo
 * dela, e o celular começa logo abaixo do CTA.
 *
 * Por isso a arte é medida em `%` da largura do quadro (no máximo 1920) e
 * ancorada **no fim do texto** — ver a janela da arte, no JSX. Os intervalos
 * verticais do texto são os tokens proporcionais da Hero
 * (`--spacing-nu-hero-*`), que valem exatamente o Figma a 1920: 100 / 24 /
 * 64. O título já é `text-nu-hero` (96 a 1920).
 *
 * ## A entrada (spec)
 *
 * - O texto entra como o de toda seção: `revealUp` em cascata.
 * - A arte **sobe por baixo** assim que a pessoa chega na seção — o gesto da
 *   pessoa da Ecossystem (`personRise`: 100% da própria altura, 1,5 s com a
 *   curva enfática). O `overflow-hidden` da seção é a janela que a esconde.
 * - O glow aparece **depois** que a arte assenta.
 *
 * ## O glow (`308:49`)
 *
 * No Figma é um círculo `#C084FC` (`nu-purple-400`) de raio 182 com desfoque
 * gaussiano de desvio 500, centrado em (960, 859) do quadro. Com um desvio
 * quase três vezes o raio, o que sobra é um halo de no máximo ~6% de
 * cobertura que se espalha por ~1500 px — por isso aqui ele é um
 * `radial-gradient` com o mesmo perfil, e não um `filter: blur(500px)`, que
 * custaria um desfoque de tela cheia por quadro (pendência E-07).
 *
 * O perfil: um disco de raio r desfocado por σ tem no centro cobertura
 * `1 − e^(−r²/2σ²)` ≈ 0,064, e cai como uma gaussiana de σ = 500. As paradas
 * do gradiente são essa curva amostrada a cada 250 px.
 *
 * "Fixo no mesmo lugar em qualquer proporção": ele é medido em `%` **da janela
 * da arte** — centro no meio dela, 595 px abaixo do topo, escalado com o
 * quadro —,
 * então fica no meio do celular e do cartão em qualquer tela. E fica fora da
 * camada que sobe: não vem junto, aparece no lugar.
 *
 * ## Onde o Figma não fala
 *
 * O destino de "Abra sua conta": placeholder de sempre do projeto. O
 * subtítulo é `Inter` no Figma; como na Hero, vira a fonte única do projeto.
 */

/**
 * A arte no quadro de 1920 (`307:29`: 2024 × 1129,605 em x −52 / y 263,66).
 * Tudo em `%` da largura do quadro.
 */
const ARTE = {
  left: (-52 / 1920) * 100,
  width: (2024 / 1920) * 100,
  /** Proporção da arte (a mesma do arquivo de origem, 2752 × 1536). */
  ratio: 2024 / 1129.605,
  /**
   * Quanto a arte sobe por baixo do texto: o CTA termina em y 481,66 e a arte
   * começa em 263,66 — 218 px, em % da largura.
   */
  sobreTexto: (218 / 1920) * 100,
  /** Proporção do trecho visível: 1920 × (1080 − 263,66). */
  janela: 1920 / (1080 - 263.66),
} as const;

/**
 * O glow como gradiente: cobertura da gaussiana a cada 250 px de distância
 * do centro, em fração do raio total de 1500 px.
 */
const GLOW_RAIO = 1500;
const GLOW_GRADIENTE = `radial-gradient(circle closest-side, ${[
  [0, 0.064],
  [250, 0.0565],
  [500, 0.0388],
  [750, 0.0208],
  [1000, 0.0087],
  [1250, 0.0028],
  [1500, 0],
]
  .map(
    ([d, a]) =>
      `rgb(192 132 252 / ${a}) ${((d / GLOW_RAIO) * 100).toFixed(2)}%`,
  )
  .join(", ")})`;

/**
 * O glow medido na **janela** da arte: centro em (960, 859) do quadro, ou seja
 * no meio da largura e 595,34 px abaixo do topo da janela (y 263,66); diâmetro
 * de 3000 px em % da largura do quadro.
 */
const GLOW_TOPO = ((859 - 263.66) / (1080 - 263.66)) * 100;
const GLOW_DIAMETRO = ((2 * GLOW_RAIO) / 1920) * 100;

export function ConversionSection() {
  return (
    <section
      id="conversao"
      aria-labelledby="conversao-titulo"
      data-surface="light"
      className="relative isolate overflow-hidden bg-nu-bg-primary"
    >
      <div className="mx-auto w-full max-w-[1920px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer(0.12)}
          className="nu-frame flex flex-col items-center pt-nu-hero-gap text-center"
        >
          <motion.h2
            id="conversao-titulo"
            variants={revealUp}
            className="font-display text-nu-hero font-bold leading-[1.22] text-nu-brand"
          >
            A vida é sua.
            <br />O Nu vai com você.
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="mt-nu-hero-sub max-w-[60ch] font-body text-base leading-[1.22] text-nu-text-tertiary text-balance lg:max-w-none lg:whitespace-nowrap"
          >
            Mais liberdade para escolher, realizar e cuidar do seu dinheiro.
            Tudo em um só lugar, no seu ritmo.
          </motion.p>

          <motion.div variants={revealUp} className="mt-nu-hero-cta">
            <CtaLink variant="brand" href="https://www.nubank.com.br/">
              Abra sua conta
            </CtaLink>
          </motion.div>
        </motion.div>

        {/*
          A janela da arte: o trecho visível dela no quadro do Figma (de
          y 263,66 ao fim, 816,34 px), com a proporção desse trecho.

          Ela começa **218 px acima do fim do CTA** (`marginTop` negativo, em
          `%` da largura — margem percentual resolve contra a largura, então
          escala com o quadro). Ancorar no fim do texto, e não numa fração da
          altura do quadro, é o que mantém o respiro entre o CTA e o celular
          abaixo de 1920: o subtítulo (16 px) e o CTA (40 px) não encolhem, e
          com a arte presa ao quadro o CTA encostava no celular a 1024.

          A arte vive numa camada interna com `overflow-y: clip`, que a corta
          embaixo (é onde ela nasce, antes de subir) e deixa ela sangrar os 52
          px dos lados. O glow fica **fora** dessa camada: com um raio de
          1500 px ele passaria da borda de cima da janela, e o corte ali
          desenharia uma linha a ~3,4% de roxo no meio do texto. Fora dela, ele
          é cortado só pelas bordas da seção — como no Figma, onde quem corta é
          o quadro.

          `z-[-1]`: abaixo do texto e do grão (que vem depois no DOM, com o
          mesmo z), como a arte da Solutions.

          É também o **gatilho**: ela não se move. O `IntersectionObserver`
          mede a caixa já transladada, e a arte nasce fora da janela — o
          gatilho nela nunca dispararia. A mesma lição da Ecossystem.
        */}
        <motion.div
          aria-hidden="true"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="pointer-events-none relative z-[-1] w-full"
          style={{
            marginTop: `${-ARTE.sobreTexto}%`,
            aspectRatio: ARTE.janela,
          }}
        >
          <div
            className="absolute inset-0"
            style={{ overflowX: "visible", overflowY: "clip" }}
          >
            <div
              className="absolute top-0"
              style={{
                left: `${ARTE.left}%`,
                width: `${ARTE.width}%`,
                aspectRatio: ARTE.ratio,
              }}
            >
              <motion.div variants={personRise} className="absolute inset-0">
                <Image
                  src="/images/backgrounds/conversion-bg/conversion-bg.webp"
                  alt=""
                  fill
                  /* 2024 px a 1920 — 105,4% da tela, até o quadro parar. */
                  sizes="(min-width: 1920px) 2024px, 106vw"
                  className="select-none object-cover"
                  draggable={false}
                />
              </motion.div>
            </div>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  duration: DURATION.slow,
                  ease: EASE_OUT_EXPO,
                  // A subida leva 1,5 s; o glow começa quando ela está quase
                  // pousada, para aparecer sobre os objetos, e não no vazio.
                  delay: 1.1,
                },
              },
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: "50%",
              top: `${GLOW_TOPO}%`,
              width: `${GLOW_DIAMETRO}%`,
              aspectRatio: 1,
              backgroundImage: GLOW_GRADIENTE,
            }}
          />
        </motion.div>
      </div>

      <SectionGrain />
    </section>
  );
}
