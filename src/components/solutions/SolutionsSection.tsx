"use client";

import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from "motion/react";
import { useRef, useState } from "react";
import Image from "next/image";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Solutions Section — Figma `Solutions Section - Safe` (nó `144:2`), 1920×1316.
 *
 * Esta é a primeira opção ("Safe" / Caixinhas) da seção de soluções. As outras
 * opções (Conta e Pix, Investimentos, Empréstimos) vêm nos frames ocultos
 * (`151:92`, `153:125`, `153:167`) e serão implementadas aos poucos.
 *
 * Comportamento solicitado:
 *  1. Entrada por scroll: os elementos surgem na tela ao chegar na seção,
 *     igual às demais seções (Hero, Ecossystem, Cards).
 *  2. Background com movimento suave do mouse em toda a seção (parallax),
 *     não apenas ao passar sobre a tela — dando imersão.
 *  3. A opção ativa fica em destaque; a próxima (à direita) fica com blur e
 *     um pouco reduzida.
 *
 * Tokens usados (todos já definidos em `src/app/globals.css`):
 *  --color-nu-brand          #820ad1  (texto ativo / borda ativa)
 *  --color-nu-action-surface #f3e8ff  (fundo da pílula ativa)
 *  --color-nu-text-brand     #820ad1  (texto inativo / borda inativa)
 *  --color-nu-text-primary   #111111  (texto do card)
 *  --color-nu-neutral-100    #f3f4f6  (fundo da seção / bg-secondary)
 *  --font-display            Montserrat
 */

/**
 * Dados da opção "Safe" (Caixinhas), lidos do nó `144:2` do Figma.
 */
const SAFE_OPTION = {
  id: "caixinhas",
  label: "Caixinhas",
  badge: "Caixinhas",
  title: "Separe seu dinheiro por metas e acompanhe seu progresso.",
  cta: "Saiba Mais",
  /** Imagem principal do background (não desfocada). */
  mainImage: "/images/backgrounds/safe-image.png",
  /** Imagem do background desfocado à direita (próxima opção). */
  blurImage: "/images/backgrounds/serenity-image.png",
} as const;

export function SolutionsSection() {
  const reduceMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  /* ========================================================================
   * 1. Movimento de fundo com o mouse (parallax em toda a seção)
   * ========================================================================
   *
   * O background principal se move suavemente conforme o ponteiro atravessa a
   * seção inteira. O cálculo é direção × força, com alcance limitado, para o
   * background não ficar "grudado" no cursor nem travar no deslocamento máximo.
   *
   * Sob `prefers-reduced-motion`, o movimento é desligado.
   */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 26, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 26, mass: 0.6 });

  // Deslocamento em px, baseado no spring: ±40px horizontal, ±30px vertical.
  const translateX = useTransform(springX, (v) => `${v * 40}px`);
  const translateY = useTransform(springY, (v) => `${v * 30}px`);

  // Template de transform para aplicar no elemento do background.
  const backgroundTransform = useMotionTemplate`translate(${translateX}, ${translateY})`;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;

    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Direção normalizada, saturada em ±1.
    const nx = (event.clientX - cx) / (rect.width / 2);
    const ny = (event.clientY - cy) / (rect.height / 2);

    // Força: 1 no centro, caindo a zero à medida que se afasta.
    const reach = 600; // px de alcance do efeito
    const dx = Math.max(0, Math.abs(event.clientX - cx) - rect.width / 2);
    const dy = Math.max(0, Math.abs(event.clientY - cy) - rect.height / 2);
    const fora = Math.hypot(dx, dy);
    const forca = Math.max(0, 1 - fora / reach);

    const saturatedX = Math.max(-1, Math.min(1, nx));
    const saturatedY = Math.max(-1, Math.min(1, ny));

    mouseX.set(saturatedX * forca);
    mouseY.set(saturatedY * forca);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  /* ========================================================================
   * 2. Qual opção está ativa
   * ========================================================================
   *
   * Hoje só o "Safe" (Caixinhas) está desenhado no Figma (frame `144:2`).
   * As outras três pílulas existem na navegação, mas sem conteúdo de frame
   * ainda — por isso clicar nelas não muda o conteúdo, mas mantém a pílula
   * pressionada visualmente.
   */
  const [activeId, setActiveId] = useState<"caixinhas" | "conta-e-pix" | "investimentos" | "emprestimos">("caixinhas");

  const OPTIONS = [
    { id: "caixinhas", label: "Caixinhas" },
    { id: "conta-e-pix", label: "Conta e Pix" },
    { id: "investimentos", label: "Investimentos" },
    { id: "emprestimos", label: "Empréstimos" },
  ] as const;

  const isActive = (id: string) => id === activeId;

  return (
    <section
      id="solutions"
      aria-labelledby="solutions-titulo"
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative isolate size-full bg-[var(--color-nu-neutral-100)] px-[200px] py-[100px] flex flex-col items-center gap-[100px]"
    >
      {/* ====================================================================
       * 3. Entrada por scroll — elementos surgem ao chegar na seção.
       *    O wrapper é um elemento de verdade (não display: contents) para
       *    o IntersectionObserver do whileInView funcionar.
       * ==================================================================== */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: { opacity: 0, y: 24 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] },
          },
        }}
        className="flex flex-col gap-[100px] items-start relative shrink-0 w-full"
      >
        {/* Título — "Cada objetivo merece seu espaço." */}
        <div className="flex items-end justify-between relative shrink-0 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
            className="font-display text-[64px] font-bold leading-[0] text-[var(--color-nu-brand)] whitespace-nowrap"
          >
            Cada objetivo<br />
            merece seu espaço.
          </motion.div>
        </div>

        {/* ====================================================================
         * 4. Background principal com parallax do mouse.
         *    A imagem se move suavemente com o ponteiro (transform baseado em
         *    motion values, sem re-render do React).
         * ==================================================================== */}
        <motion.div
          style={{ transform: backgroundTransform }}
          className="relative shrink-0 w-full h-[720px] items-start overflow-clip rounded-[25px]"
        >
          <Image
            src={SAFE_OPTION.mainImage}
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            width={1882}
            height={1021}
            unoptimized
            priority
          />
        </motion.div>

        {/* Badge da opção ativa — "Caixinhas" */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="absolute bg-[var(--color-nu-action-surface)] border-2 border-[var(--color-nu-brand)] border-solid px-[24px] py-[12px] rounded-[100px] left-[1330px] top-[298px] flex items-center justify-center"
        >
          <p className="font-display text-[20px] font-semibold leading-[normal] text-[var(--color-nu-brand)] whitespace-nowrap">
            {SAFE_OPTION.badge}
          </p>
        </motion.div>

        {/* text-box — título, descrição e CTA da opção ativa */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="absolute bg-[var(--color-nu-neutral-100)] flex flex-col gap-[64px] items-start left-[1094px] overflow-clip px-[42px] py-[32px] rounded-[42px] top-[699px]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="font-display text-[24px] font-bold leading-[0] text-[var(--color-nu-brand)] whitespace-nowrap"
          >
            {SAFE_OPTION.title}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex gap-[10px] items-center justify-center relative rounded-[100px] shrink-0"
          >
            <button
              type="button"
              className="font-display text-[16px] font-semibold leading-[normal] text-[var(--color-nu-brand)] whitespace-nowrap"
            >
              {SAFE_OPTION.cta}
            </button>
          </motion.div>
        </motion.div>

        {/* ====================================================================
         * 5. Background desfocado à direita — próxima opção (prévia).
         *    Está sempre presente, com blur e reduzida, como no Figma.
         * ==================================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          className="absolute blur-[4px] h-[620px] items-start left-[1784px] overflow-clip rounded-[22px] top-[406px] w-[1308px]"
        >
          <Image
            src={SAFE_OPTION.blurImage}
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            width={1552}
            height={866}
            unoptimized
          />
        </motion.div>
      </motion.div>

      {/* ====================================================================
       * 6. Navegação — pílulas das opções. A ativa tem fundo da marca e
       *    texto branco; as inativas têm borda da marca e texto da marca.
       *    Sob movimento reduzido, não há animação de escala/blur.
       * ==================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="flex gap-[24px] items-start relative shrink-0"
      >
        {OPTIONS.map((option) => {
          const active = isActive(option.id);
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveId(option.id)}
              className={`flex items-center justify-center px-[18px] py-[10px] rounded-[100px] shrink-0 ${
                active
                  ? "bg-[var(--color-nu-brand)] text-[var(--color-nu-action-text)]"
                  : "border border-[var(--color-nu-brand)] border-solid text-[var(--color-nu-text-brand)]"
              } font-display text-[16px] font-semibold leading-[normal] whitespace-nowrap transition-all duration-300 ease-out ${
                reduceMotion ? "" : active ? "scale-105" : "scale-95 blur-sm"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </motion.div>
    </section>
  );
}
