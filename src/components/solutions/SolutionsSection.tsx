"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import Image from "next/image";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Solutions Section — Figma `Solutions Section - Safe` (nó `144:2`), 1920×1316.
 *
 * Primeira opção da seção de soluções (Caixinhas / Safe). As outras três
 * opções (Conta e Pix, Investimentos, Empréstimos) vêm nos frames ocultos
 * (`151:92`, `153:125`, `153:167`) e serão implementadas aos poucos.
 *
 * Comportamento:
 *  1. Entrada por scroll — elementos surgem ao chegar na seção.
 *  2. Background com parallax suave do mouse em toda a seção.
 *  3. Opção ativa em destaque; a próxima (à direita) desfocada e reduzida.
 *
 * Tokens (todos já em `src/app/globals.css`):
 *  --color-nu-brand          #820ad1
 *  --color-nu-action-surface #f3e8ff
 *  --color-nu-text-brand     #820ad1
 *  --color-nu-neutral-100    #f3f4f6
 *  --font-display            Montserrat
 */

/**
 * Dados da opção "Safe" (Caixinhas), lidos do nó `144:2` do Figma.
 */
const SAFE_OPTION = {
  id: "caixinhas",
  label: "Caixinhas",
  title: "Separe seu dinheiro por metas e acompanhe seu progresso.",
  cta: "Saiba Mais",
  /** Imagem principal do background (não desfocada). */
  mainImage: "/images/backgrounds/safe-image.png",
  /** Imagem do background desfocado à direita (próxima opção). */
  blurImage: "/images/backgrounds/serenity-image.png",
} as const;

const OPTIONS = [
  { id: "caixinhas", label: "Caixinhas" },
  { id: "conta-e-pix", label: "Conta e Pix" },
  { id: "investimentos", label: "Investimentos" },
  { id: "emprestimos", label: "Empréstimos" },
] as const;

export function SolutionsSection() {
  const reduceMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<"caixinhas" | "conta-e-pix" | "investimentos" | "emprestimos">("caixinhas");

  const isActive = (id: string) => id === activeId;

  return (
    <section
      id="solutions"
      aria-labelledby="solutions-titulo"
      ref={sectionRef}
      className="relative isolate size-full bg-white px-[200px] py-[100px] flex flex-col items-center gap-[100px]"
    >
      {/* ====================================================================
       * 1. Entrada por scroll — elementos surgem ao chegar na seção.
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
         * 2. Container do background principal com a imagem do porquinho.
         *    Figma: h-[720px] rounded-[25px] overflow-clip
         *    Imagem: left-[-289px] top-[-118px] w-[1882.348px] h-[1020.567px]
         * ==================================================================== */}
        <div className="relative shrink-0 w-full h-[720px] items-start overflow-clip rounded-[25px]">
          <Image
            src={SAFE_OPTION.mainImage}
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            width={1882}
            height={1021}
            unoptimized
            priority
          />
        </div>

        {/* Badge da opção ativa — "Caixinhas" */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="absolute bg-[var(--color-nu-action-surface)] border-2 border-[var(--color-nu-brand)] border-solid px-[24px] py-[12px] rounded-[100px] left-[1330px] top-[298px] flex items-center justify-center"
        >
          <p className="font-display text-[20px] font-semibold leading-[normal] text-[var(--color-nu-brand)] whitespace-nowrap">
            {SAFE_OPTION.label}
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
         * 3. Background desfocado à direita — próxima opção (prévia).
         *    Figma: blur-[4.306px] h-[620px] left-[1784.56px] top-[406px]
         *           w-[1308.889px] rounded-[21.528px]
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
       * 4. Navegação — pílulas das opções no final da seção.
       *    Ativa: fundo da marca + texto branco.
       *    Inativa: borda da marca + texto da marca, escala reduzida e blur.
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
