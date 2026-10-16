"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";

import { HERO_CARDS } from "@/lib/hero-cards";
import { DURATION, EASE_OUT_EXPO, FAN } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Composição de cards da Hero.
 *
 * Quatro camadas de movimento, todas desligadas sob `prefers-reduced-motion`:
 *  1. entrada em leque — cada card parte 18° fora da rotação do design e
 *     assenta nela, em cascata da esquerda para a direita (o atraso sai da
 *     posição horizontal, ver `lib/hero-cards.ts`);
 *  2. parallax de rolagem — a camada desliza mais devagar que a página;
 *  3. paralaxe de ponteiro — deslocamento sutil na direção do cursor
 *     (apenas em dispositivos com ponteiro fino).
 */
export function CardsShowcase() {
  const reduceMotion = usePrefersReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: layerRef,
    offset: ["start end", "end start"],
  });

  // (1) parallax de rolagem — desligado para quem pede menos movimento
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -140]);

  // (2) paralaxe de ponteiro
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const spring = { stiffness: 60, damping: 22, mass: 0.6 };
  const depthX = useSpring(pointerX, spring);
  const depthY = useSpring(pointerY, spring);

  // Combina as duas entradas de Y de forma reativa — ler `scrollY.get()`
  // dentro de uma função criaria uma transformação não-reativa.
  const layerY = useTransform([scrollY, depthY], ([scroll, depth]: number[]) => scroll + depth);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const ratioX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const ratioY = (event.clientY - bounds.top) / bounds.height - 0.5;

    pointerX.set(ratioX * -34);
    pointerY.set(ratioY * -22);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.div
      ref={layerRef}
      aria-label="Cartões Nubank"
      className="pointer-events-none absolute inset-0"
      style={{ x: depthX, y: layerY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      {HERO_CARDS.map((card) => (
        <div
          key={card.id}
          data-card={card.id}
          className="card-slot absolute"
          style={
            {
              "--card-cx": `${card.centerX}cqw`,
              "--card-cy": `${card.centerY}cqw`,
              "--card-w": `${card.width}cqw`,
              "--card-rot": `${card.rotate}deg`,
              "--card-aspect": String(card.boxAspect),
              // `translate` (propriedade CSS) é independente de `transform`,
              // então não briga com o `y` do Motion aplicado na camada acima.
              translate: "-50% -50%",
            } as React.CSSProperties
          }
        >
          {/* Rotação final: fica no HTML do servidor, então não há "flash"
              de card torto antes da hidratação. */}
          <div className="card-art mt-40 flex size-full items-center justify-center">
            <motion.div
              /*
               * `size-full` é obrigatório: sem altura definida neste
               * intermediário, o `height: N%` da imagem não tem base e o
               * navegador cai no tamanho natural (681x1080 em vez de
               * 373x593). Com a cadeia de alturas definida, a caixa também
               * tem área desde o primeiro frame — o que permite ao Chrome
               * avaliar a interseção e disparar o lazy-load.
               */
              className="flex size-full items-center justify-center will-change-transform"
              style={{ transformOrigin: FAN.origin }}
              /*
               * Só `rotate` e `y`. Sem `opacity` e sem `scale`, que é o que
               * fazia o card "surgir": ele já nasce renderizado, opaco e no
               * tamanho final. O que o esconde no primeiro frame é estar em
               * `y` abaixo da Hero, de onde o `overflow-clip` da seção o
               * recorta. O leque é o que o traz para dentro da tela.
               */
              initial={{ rotate: FAN.from, y: FAN.y }}
              animate={{ rotate: 0, y: 0 }}
              transition={{
                duration: DURATION.slow * 1.25,
                ease: EASE_OUT_EXPO,
                delay: card.delay,
              }}
            >
              <Image
                src={card.src}
                alt={card.alt}
                width={374}
                height={593}
                // `width` inline é necessário: sem ele o `width: 100%` do
                // Tailwind resolveria contra o pai de largura automática e
                // inflaria a arte. A fração vem de `artWidthPct`.
                sizes="(min-width: 1440px) 340px, (min-width: 1024px) 280px, 60vw"
                className="w-auto max-w-none"
                // Altura em % da caixa: a caixa tem altura definida pelo
                // aspect-ratio, então a fração resolve sem dependência do
                // carregamento da imagem (evita 0x0 e o lazy-load travado).
                style={{ height: `${card.artHeightPct}%` }}
                loading={card.eager ? "eager" : "lazy"}
                unoptimized
              />
            </motion.div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}