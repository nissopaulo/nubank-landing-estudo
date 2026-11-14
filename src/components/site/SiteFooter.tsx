"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Icon } from "@phosphor-icons/react";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr/InstagramLogo";
import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { XLogo } from "@phosphor-icons/react/dist/ssr/XLogo";
import { YoutubeLogo } from "@phosphor-icons/react/dist/ssr/YoutubeLogo";

import { SectionGrain } from "@/components/site/SectionGrain";
import { revealUp, staggerContainer } from "@/lib/motion";

/**
 * Footer — Figma `311:57` (1920×609). A última peça do arquivo.
 *
 * Substitui o rodapé provisório ("Projeto de estudo — não oficial") e o bloco
 * "Em construção", que existia só para o CTA "Explore o Universo Nu" da Hero
 * ter destino. Com a landing completa, o CTA aponta para a Ecossystem — a
 * seção logo abaixo da Hero, que é o "universo" que ele anuncia.
 *
 * ## Composição
 *
 * Duas faixas com 200 px entre elas: em cima, a marca e as redes à esquerda e
 * as quatro colunas de links à direita (813 px, 100 de intervalo); embaixo, o
 * crédito à esquerda e os links legais à direita (64 de intervalo). Na
 * coluna esquerda, logo e redes ficam nas pontas (`justify-between`), e a
 * altura é a das colunas de links.
 *
 * ## Onde o Figma não fala
 *
 * - **Nenhum link tem destino.** Todos usam o placeholder do projeto
 *   (`https://www.nubank.com.br/`), abrindo em nova aba como todo link externo
 *   do site. Os perfis das redes também: inventar a URL de cada perfil seria
 *   conteúdo fora do desenho.
 * - **Hover: PROVISÓRIO.** O Figma não traz estado. Os links de texto ganham
 *   sublinhado; os ícones das redes vão a 80%. Sem deslocamento.
 * - **Cores: desvio do Figma por contraste.** Ver `FUNDO`.
 * - **Ícones:** as camadas do Figma são os ícones do Phosphor
 *   (`InstagramLogo`, `XLogo`, `LinkedinLogo`, `YoutubeLogo`), no peso `fill`
 *   — como no resto do projeto, entram pelo pacote e não pelo SVG exportado.
 *
 * ## Entrada
 *
 * A mesma de toda seção: `revealUp` em cascata. Primeiro a marca e as
 * colunas, depois a faixa de baixo.
 */

const PLACEHOLDER = "https://www.nubank.com.br/";

const COLUNAS = [
  {
    titulo: "Nubank",
    links: ["Sobre nós", "Carreiras", "Imprensa", "Investidores"],
  },
  { titulo: "Produtos", links: ["Conta", "Cartões", "Caixinhas", "Empréstimos"] },
  {
    titulo: "Explore",
    links: ["Blog", "NuCommunity", "Novidades", "Educação financeira"],
  },
  {
    titulo: "Ajuda",
    links: ["Central de ajuda", "Segurança", "Contato", "Ouvidoria"],
  },
] as const;

/**
 * As redes, na ordem do Figma (`311:164`). O tamanho é o da caixa de cada
 * ícone no desenho: o Phosphor desenha num quadrado de 256, e a altura de 24
 * é o que o Figma fixa — a largura sai da proporção de cada glifo.
 */
const REDES: readonly { nome: string; Icone: Icon }[] = [
  { nome: "Instagram", Icone: InstagramLogo },
  { nome: "X", Icone: XLogo },
  { nome: "LinkedIn", Icone: LinkedinLogo },
  { nome: "YouTube", Icone: YoutubeLogo },
];

const LEGAIS = [
  "Termos de uso",
  "Política de privacidade",
  "Segurança",
  "Acessibilidade",
] as const;

/**
 * O gradiente — **o desenho do Figma, dois tons abaixo**.
 *
 * O Figma pinta Purple/600 → 500 → 400 → 300 (paradas 22,9 / 32,5 / 87,9 /
 * 135,4%), e o texto pequeno branco fica justamente na parte clara. Medido no
 * navegador: links das colunas 3,5–4,3:1, "Nubank pelo mundo digital." (80%)
 * 2,9, links legais (80%) 2,2, crédito (50%) 1,7. Branco puro sobre Purple/500
 * já dá 3,96 — tirar as opacidades sozinho não chegava a AA.
 *
 * Decisão do usuário (2026-11-13): mesmas paradas, mesmo formato, cada cor
 * descida dois tons — 800 → (meio de 800 e 600) → 600 → 500. O ponto mais claro
 * dentro do rodapé passa a ser perto do Purple/600, sobre o qual o branco dá
 * 5,28:1. O texto que era 80% e 50% virou branco puro pelo mesmo motivo.
 *
 * O ângulo é 180° (o Figma exporta 179,99999…, ruído de float).
 */
const FUNDO =
  "linear-gradient(180deg, var(--color-nu-purple-800) 22.903%, color-mix(in srgb, var(--color-nu-purple-800), var(--color-nu-purple-600)) 32.504%, var(--color-nu-purple-600) 87.911%, var(--color-nu-purple-500) 135.4%)";

/**
 * Links da faixa de baixo. No Figma: SemiBold 15,904 a 80% de opacidade; aqui
 * branco puro (ver `FUNDO`). Hover PROVISÓRIO: sublinhado, como nas colunas.
 */
const LINK_LEGAL =
  "whitespace-nowrap font-display text-[15.904px] font-semibold leading-[1.22] text-white underline-offset-4 hover:underline";

export function SiteFooter() {
  return (
    <footer
      data-surface="dark"
      className="relative isolate"
      style={{ backgroundImage: FUNDO }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer(0.12)}
        className="nu-frame flex flex-col gap-[100px] py-[100px] xl:gap-[200px]"
      >
        <motion.div
          variants={revealUp}
          /*
           * Lado a lado a partir de 1280. A coluna de links não tem a largura
           * fixa de 813 do Figma: com ela, a 1280 sobravam 136 px para a marca
           * e "Nubank pelo mundo digital." quebrava em duas linhas. O intervalo
           * entre as colunas é que encolhe com o quadro (100 a 1920, 67 a
           * 1280), e a largura sai do conteúdo — 811,5 a 1920, o 813 do Figma
           * menos o arredondamento do texto.
           */
          className="flex flex-col gap-[64px] xl:flex-row xl:items-stretch xl:justify-between"
        >
          <div className="flex flex-col items-start justify-between gap-[48px] xl:gap-0">
            {/*
              `nu-logo.svg` é o mesmo arquivo do header, já em branco; aqui no
              tamanho do Figma (`329:97`, 128 × 69,82 — o dobro do header).
            */}
            <a
              href="#conteudo"
              aria-label="Nubank — voltar ao início"
              className="block"
            >
              <Image
                src="/images/brand/nu-logo.svg"
                alt=""
                width={128}
                height={69.82}
                className="h-[69.82px] w-[128px]"
              />
            </a>

            <div className="flex flex-col gap-[12px]">
              <p className="font-display text-[15.904px] font-semibold leading-[1.22] text-white">
                Nubank pelo mundo digital.
              </p>
              <ul className="flex items-center gap-[12px]">
                {REDES.map(({ nome, Icone }) => (
                  <li key={nome}>
                    <a
                      href={PLACEHOLDER}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Nubank no ${nome}`}
                      className="block text-white transition-opacity duration-200 ease-out hover:opacity-80"
                    >
                      <Icone size={24} weight="fill" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <nav
            aria-label="Rodapé"
            className="grid grid-cols-2 gap-[48px] md:flex md:gap-[min(100px,5.2083vw)] xl:shrink-0"
          >
            {COLUNAS.map((c) => (
              <div key={c.titulo} className="flex flex-col gap-[24px]">
                <h2 className="font-display text-[24px] font-bold leading-[1.22] text-white">
                  {c.titulo}
                </h2>
                <ul className="flex flex-col gap-[12px]">
                  {c.links.map((l) => (
                    <li key={l} className="flex">
                      <a
                        href={PLACEHOLDER}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whitespace-nowrap font-display text-[16px] font-medium leading-[1.22] text-white underline-offset-4 transition-colors duration-200 ease-out hover:underline"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </motion.div>

        <motion.div
          variants={revealUp}
          /*
           * `flex-wrap`, e não uma troca de direção por breakpoint: crédito
           * (580) + links legais (703) + intervalo (64) só cabem numa linha
           * perto de 1920. Abaixo disso os links descem para a linha de baixo
           * sozinhos, alinhados à esquerda, em vez de espremer o crédito em
           * três linhas.
           */
          className="flex flex-wrap items-end justify-between gap-x-[64px] gap-y-[24px]"
        >
          <p className="font-display text-[16px] font-semibold leading-[1.22] text-white xl:whitespace-nowrap">
            © Nubank. Todos os direitos reservados.
            <br />
            Projeto de Estudo desenvolvido por Paulo Vinicius Leonardo de Souza.
          </p>

          <ul className="flex flex-wrap gap-x-[64px] gap-y-[12px]">
            {LEGAIS.map((l) => (
              <li key={l} className="flex">
                <a
                  href={PLACEHOLDER}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK_LEGAL}
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      <SectionGrain />
    </footer>
  );
}
