"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";

import { CtaLink } from "@/components/ui/CtaLink";
import { PillTab } from "@/components/ui/PillTab";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { ACTIVE_SOLUTION, PAINEL_GEOMETRIA, SOLUTIONS } from "@/lib/solutions";
import { revealUp, SOLUTIONS_ART, SOLUTIONS_TEXT, staggerContainer } from "@/lib/motion";

/**
 * Solutions Section — Figma `Solutions Section - Piggybank` (nó `178:205`) e
 * `Solutions Section - Account` (nó `178:262`), 1920×1080.
 *
 * ## A seção é um quadro só, e o quadro é a arte
 *
 * Não há imagem dentro de uma janela: a arte **é** o fundo da seção, sangrando
 * pelas bordas, e o conteúdo (o seletor e o painel) flutua por cima. Isso muda a
 * forma de pensar a seção: ela não tem "cartão de imagem" — ela tem um fundo e
 * duas peças de vidro.
 *
 * ## A geometria vem do `padding` e do `justify-between`, e não de coordenadas
 *
 * O Figma dá a navegação em (200, 100) e o painel em (1040, 580), ambos dentro
 * de um `Main Content` de 1520×880. A traduzido para fluxo, isso é:
 *
 *   - `px-[200px] py-[100px]` — a borda do conteúdo;
 *   - `justify-between` — o seletor em cima, o painel embaixo;
 *   - `items-end` — o painel encosta na borda direita (840 + 680 = 1520).
 *
 * O painel é o único alinhado à direita, e é por isso que o seletor fica
 * dentro de um wrapper `items-start`: ele é alinhado à **esquerda** (x = 0 do
 * `Main Content`), como o Figma mostra.
 *
 * ## O vidro é o mesmo truque do header condensado
 *
 * `bg-white/90` + `backdrop-blur` + `drop-shadow`: a superfície semiopaca
 * sobre a arte, e o desfoque do que está atrás. O header usa 85% e 5px de
 * desfoque; aqui o Figma pede 90% e 5px no seletor, e 90% e **10px** no painel.
 * A diferença de 5px entre os dois vidro é do desenho, e é o que faz o painel
 * ler como uma peça mais perto do olho do que o seletor.
 *
 * ## A pílula inativa aqui **não** tem borda
 *
 * É a diferença entre esta seção e a Cards Section, e ela vem do desenho: no
 * Figma a pílula inativa da navegação é só o texto na cor da marca, sem
 * contorno. Não é estilo — é a variante `borda="nenhuma"` do `PillTab`, e ela
 * também compensa o padding (18/10 em vez de 17/9), porque sem traço a caixa
 * é a do Figma sem a meia-borda do CSS.
 *
 * ## A troca de opção é uma troca de cena
 *
 * Os dois frames liberados são idênticos fora da arte e do texto: o vidro, o
 * raio, a sombra, o padding e os tipos são os mesmos. O que muda é a **cena**
 * de fundo e o **texto** do painel — e por isso a troca é animada em duas
 * partes independentes: a arte faz um *pull* de foco (a que sai desfoca, a que
 * entra assenta) e o texto emerge de novo, desfocado, enquanto sobe.
 *
 * ## Só dois frames estão liberados
 *
 * Os quatro frames da seção existem no arquivo, e **dois** foram liberados
 * (`178:205` e `178:262`). As outras duas pílulas aparecem — o design mostra
 * as quatro — e não respondem: são botões de verdade, com `aria-disabled` e
 * aviso para o leitor de tela. A mesma regra dos pilares do Ecossystem e das
 * pílulas da Cards Section: **um botão que não faz nada não existe em
 * silêncio.**
 */

/**
 * O texto do painel, na entrada e na saída.
 *
 * A entrada é o `revealUp` de sempre (sobe e aparece) com um **desfoque que se
 * resolve** por cima — é o que faz o "surgir" ser suave em vez de um corte com
 * fade. A saída é o inverso e é rápida, porque a cena nova já está entrando.
 */
const texto: Variants = {
  hidden: {
    opacity: 0,
    y: SOLUTIONS_TEXT.y,
    filter: `blur(${SOLUTIONS_TEXT.blur}px)`,
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: SOLUTIONS_TEXT.enter, ease: SOLUTIONS_TEXT.ease },
  },
  exit: {
    opacity: 0,
    /*
     * A saída é um **desfoque**, e não um deslocamento.
     *
     * O texto antigo desfoca e some, no lugar. Subir 8 px seria bonito — e
     * seria um movimento: sob `prefers-reduced-motion` o Motion pula a
     * animação de transform e o elemento **salta** para o valor final, e
     * quem pediu menos movimento veria o texto dar um pulo de 8 px antes de
     * sumir. Um desfoque não desloca nada, e é o gesto que combina com a
     * entrada (que sobe e entra em foco).
     */
    filter: `blur(${SOLUTIONS_TEXT.blur}px)`,
    transition: { duration: SOLUTIONS_TEXT.exit, ease: "easeIn" },
  },
};

export function SolutionsSection() {
  /** Índice da opção mostrada. */
  const [ativo, setAtivo] = useState(ACTIVE_SOLUTION);

  /**
   * Trava da troca.
   *
   * Enquanto a cena está trocando, um clique novo é ignorado: sem a trava, o
   * `AnimatePresence` trocaria a arte que está saindo no meio do fade, e a
   * tela mostraria as duas cenas ao mesmo tempo. É a mesma trava que a Cards
   * Section aplica durante a meia-volta.
   */
  const [trocando, setTrocando] = useState(false);

  const movimentoReduzido = usePrefersReducedMotion();

  const visivel = SOLUTIONS[ativo];

  /** Largura do vidro, da opção visível — o Figma varia por quadro. */
  const largura = visivel.showcase?.largura ?? PAINEL_GEOMETRIA.largura;

  /**
   * A largura do TEXTO, e não a do vidro.
   *
   * As duas são diferentes de propósito. O vidro muda de largura na troca
   * (680 no Caixinhas, 820 nos Empréstimos) e o texto tem que ficar na
   * largura **da sua** opção: se ele preenchesse o vidro, a largura do vidro
   * crescendo re-quebraria as linhas do texto antigo **no meio do fade** — e
   * um texto que muda de quebra de linha enquanto some é a pior coisa que
   * pode acontecer com ele.
   *
   * E o texto que entra já nasce na largura certa, porque a troca do vidro
   * dura exatamente o mesmo tempo que a saída do texto antigo.
   */
  const larguraTexto = largura - PAINEL_GEOMETRIA.padding * 2;

  function select(index: number) {
    const destino = SOLUTIONS[index];
    if (index === ativo || !destino?.showcase || trocando) return;

    setTrocando(true);
    setAtivo(index);
  }

  return (
    <section
      id="solucoes"
      aria-label="Soluções"
      className="relative isolate flex min-h-[1080px] flex-col overflow-hidden bg-nu-action-surface"
    >
      {/*
        A arte de fundo.

        Duas camadas com a **mesma** geometria — a que sai e a que entra — e
        cada uma com o seu gesto: a que sai perde o foco, a que entra assenta
        no lugar. A curva e os números estão em `SOLUTIONS_ART`.

        `object-cover` reproduz o desenho: a arte tem 2048×1112 (1,84173) e a
        caixa 1920×1080 (1,77778), então o `cover` escala pela altura, deixa a
        largura em 1989,2 e transborda 34,6 px para cada lado — que é
        exatamente o `103,65%` de largura com `-1,82%` de deslocamento que o
        Figma declara. Na vertical não há sobra nenhuma, e por isso a posição
        do `object-position` é irrelevante.

        **`initial={false}`**: a primeira arte entra com a página, sem
        cross-fade — a entrada da seção é do `revealUp` do conteúdo, e uma
        arte que nascesse desfocada brigaria com ele.

        **Sob movimento reduzido a troca é instantânea**: a duração vai a zero
        e não há *dissolve* nem desfoque. Quem pede menos movimento não deve
        ver a cena escurecer e clarear — e o `MotionConfig` sozinho não cobre
        esse caso (foi medido na Cards Section: a camada ficava congelada em
        `opacity: 0,007` e a seção mostrava a paleta antiga para sempre).
      */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <AnimatePresence initial={false} onExitComplete={() => setTrocando(false)}>
          <motion.div
            key={visivel.id}
            className="absolute inset-0"
            initial={{
              opacity: 0,
              scale: SOLUTIONS_ART.scale,
              filter: "blur(0px)",
            }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              scale: 1,
              filter: `blur(${SOLUTIONS_ART.blur}px)`,
            }}
            transition={{
              duration: movimentoReduzido ? 0 : SOLUTIONS_ART.duration,
              ease: SOLUTIONS_ART.ease,
            }}
          >
            <Image
              src={visivel.background}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/*
        O conteúdo da seção.

        O wrapper é um elemento de verdade — e precisa ser: `display: contents`
        não gera caixa, e o `IntersectionObserver` do `whileInView` não teria
        o que observar, e a entrada nunca rodaria. (Foi exatamente esse o modo
        de falha na Cards Section: as pílulas ficavam presas 24px abaixo do
        lugar, sem erro em lugar nenhum.)
      */}
      <motion.div
        className="relative z-10 flex flex-1 flex-col items-end justify-between px-[200px] py-[100px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer(0.12)}
      >
        {/*
          O wrapper do seletor é de largura cheia e com `items-start` — é ele que
          deixa a navegação **encostada na borda esquerda** (x = 0 do `Main
          Content`), enquanto o painel encosta na direita. A coluna tem
          `items-end`, e é por isso que o wrapper precisa de `w-full`: sem ele
          o wrapper encolheria até o conteúdo e a navegação iria para a
          direita junto com o painel.
        */}
        <div className="flex w-full flex-col items-start">
          <motion.div
            role="tablist"
            aria-label="Escolher a solução"
            aria-orientation="horizontal"
            className="flex items-start gap-[24px] rounded-[120px] bg-white/90 px-[16px] py-[12px]
              shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] backdrop-blur-[5px]"
            variants={revealUp}
          >
            {SOLUTIONS.map((item, index) => (
              <PillTab
                key={item.id}
                label={item.label}
                selected={index === ativo}
                liberado={Boolean(item.showcase)}
                borda="nenhuma"
                id={`solucoes-aba-${item.id}`}
                controls={`solucoes-painel-${item.id}`}
                onSelect={() => select(index)}
              />
            ))}
          </motion.div>
        </div>

        {/*
          O painel da solução.

          O `revealUp` fica **neste** elemento, e não dentro do `AnimatePresence`
          do conteúdo: o painel não é remontado na troca (só o conteúdo dentro
          dele é), então a entrada acontece uma vez — quando a seção chega na
          tela — e a troca de opção faz só o *cross-fade* do texto.

          **A largura é do dado e ela ANIMA.** O Figma dá 680 no Caixinhas e
          na Conta, e 820 nos Empréstimos — e um vidro que mudasse de tamanho
          num salto seria o único corte duro de uma troca que é toda suave.
          A transição do `width` dura exatamente o mesmo tempo que a saída do
          texto (180 ms), então o vidro já assentou quando o texto novo
          entra.
        */}
        <motion.div
          role="tabpanel"
          id={`solucoes-painel-${visivel.id}`}
          aria-labelledby={`solucoes-aba-${visivel.id}`}
          className="flex flex-col items-start gap-[64px] rounded-[24px] bg-white/90
            shadow-[6px_6px_20px_0_rgba(0,0,0,0.2)] backdrop-blur-[10px]
            transition-[width] duration-[180ms] ease-out"
          style={{ width: largura, padding: PAINEL_GEOMETRIA.padding }}
          variants={revealUp}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={visivel.id}
              className="flex flex-col gap-[42px]"
              style={{ width: larguraTexto }}
              variants={texto}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="font-display text-[48px] font-bold leading-[1.22] text-nu-brand">
                {visivel.showcase?.title}
              </h2>
              <p className="font-display text-[16px] font-medium leading-[1.22] text-nu-text-secondary">
                {visivel.showcase?.desc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/*
            O CTA.

            O `variant="brand"` é o mesmo par do "Quero ser Nubank" da header no
            estado condensado — fundo na cor da marca, texto branco — e é
            também o `Action/action-primary` que o Figma pede aqui.

            O caret é o `CaretRight` do Phosphor: o Figma usa o `CaretDown`
            dele girado 90°, e o projeto já usa ícones do Phosphor no lugar
            dos SVG do Figma.
          */}
          <CtaLink variant="brand" href="https://www.nubank.com.br/">
            {visivel.showcase?.cta}
            <CaretRight size={20} weight="regular" aria-hidden="true" />
          </CtaLink>
        </motion.div>
      </motion.div>
    </section>
  );
}
