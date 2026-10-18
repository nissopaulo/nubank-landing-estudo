"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Variants } from "motion/react";

import { CARD_GEOMETRY, type ShowcaseCard } from "@/lib/card-showcase";
import type { CardTilt } from "@/components/cards/use-card-tilt";

/**
 * O cartão de crédito, e o que faz dele o diferencial da seção.
 *
 * ## O cartão é DOM, e não uma imagem exportada
 *
 * O Figma compõe o cartão em camadas (fundo em gradiente, rede de cartões, nome,
 * marca `nu`, chip com duas peças). Exportá-lo como um PNG daria o cartão
 * perfeito e **mataria a interação**: não há como girar em 3D, nem fazer um
 * reflexo seguir o ponteiro, porque não haveria nada para transformar.
 *
 * Então ele é montado em DOM, com os quatro SVG do Figma como asset em
 * `/public/images/credit-card` — nenhum `path` copiado para o código.
 *
 * ## A inclinação vem de fora
 *
 * Este componente não escuta o ponteiro: recebe os valores prontos de
 * `useCardTilt`, porque quem escuta é a `<section>` — a interação é da seção
 * inteira, não do cartão. Ver `use-card-tilt.ts`.
 *
 * O corte de movimento reduzido também mora lá, pelo mesmo motivo do corte da
 * paralaxe da Hero: `MotionConfig reducedMotion="user"` desliga **animações**,
 * não motion values, e a inclinação é motion value puro.
 *
 * ## A virada é do elemento de fora, e a inclinação é do de dentro
 *
 * As duas usam `rotateY`, e um `transform` só não comporta os dois gestos — o
 * segundo cancelaria o primeiro no meio. Separadas, cada gesto tem a sua
 * transformada, e trocar de cartão não cancela a inclinação em curso.
 */
export function CreditCard({
  card,
  flipVariants,
  tilt,
}: {
  card: ShowcaseCard;
  flipVariants: Variants;
  tilt: CardTilt;
}) {
  const data = card.showcase;
  // Desestruturado: a regra `react-hooks/refs` aceita um identificador direto
  // no `ref`, mas não uma leitura de propriedade (`tilt.cardRef`) durante o
  // render.
  const { cardRef, values } = tilt;

  if (!data) return null;

  return (
    // `aria-hidden`: o cartão é uma peça de mockup. O conteúdo que importa —
    // título, descrição e CTA — está fora dele, no `tabpanel`.
    <motion.div
      className="cc-flip"
      aria-hidden="true"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={flipVariants}
    >
      <motion.div
        className="cc-tilt"
        style={{ rotateX: values.rotateX, rotateY: values.rotateY }}
        /*
         * `will-change` permanente é exceção aqui, e é justificada: o cartão é
         * transformado a cada quadro enquanto o ponteiro passa por cima, e sem
         * a dica o navegador decide isso tarde. O custo é uma camada de
         * 252×400 — irrelevante para uma seção com um cartão só.
         */
      >
        <div
          ref={cardRef}
          className="cc-face"
          style={{
            width: CARD_GEOMETRY.width,
            height: CARD_GEOMETRY.height,
            padding: CARD_GEOMETRY.padding,
            borderRadius: CARD_GEOMETRY.radius,
            backgroundImage: data.gradient,
            color: data.ink,
          }}
        >
          <Image
            src={data.network}
            alt=""
            aria-hidden="true"
            width={86.8654}
            height={53.6896}
            className="h-auto w-[86.8654px] max-w-none"
            unoptimized
          />

          {/*
            `leading-[1.25]`, e não `leading-none`: é a altura natural do
            Montserrat a esta caixa, que é a convenção do projeto. A diferença
            não é de leitura, é de posição — o nome é o elemento do meio do
            `justify-between`, então a altura dele distribui os dois vãos e
            qualquer caixa diferente move o texto em ~2px.
          */}
          <span className="font-display text-[17.391px] font-semibold leading-[1.25]">
            {data.holder}
          </span>

          <Image
            src={data.nuLogo}
            alt=""
            aria-hidden="true"
            width={86.9561}
            height={47.4322}
            className="h-auto w-[86.9561px] max-w-none"
            unoptimized
          />

          {/*
            O chip é absoluto contra o cartão, não contra o conteúdo: os
            valores são do frame e não se multiplicam pelo padding. O gradiente
            dele é o único gradiente da seção que o CSS expressa sozinho
            (`linear-gradient`), porque os dois tons são tokens — `Neutral/400`
            e `Neutral/200` — e ele não tem `gradientTransform`.
          */}
          <span
            className="absolute overflow-clip rounded-[5.217px] border-[0.435px] border-nu-neutral-800"
            style={{
              left: 130.43,
              top: 47.83,
              width: 39.13,
              height: 53.043,
              backgroundImage:
                "linear-gradient(36.416378722528655deg, #9ca3af 0%, #e5e7eb 100%)",
            }}
          >
            <Image
              src="/images/credit-card/chip-contact.svg"
              alt=""
              aria-hidden="true"
              width={17.4697}
              height={19.4308}
              className="absolute max-w-none"
              style={{
                inset: "31.92% 26.67% 31.45% 28.69%",
                width: "auto",
                height: "auto",
              }}
              unoptimized
            />
            <Image
              src="/images/credit-card/chip-lines.svg"
              alt=""
              aria-hidden="true"
              width={39.1302}
              height={53.0435}
              className="absolute left-0 top-0 max-w-none"
              unoptimized
            />
          </span>

          {/*
            Reflexo.

            O gradiente inteiro vem como `MotionValue<string>` de
            `useMotionTemplate`, e a opacidade como `MotionValue<number>` — nunca
            por custom property. A primeira versão posicionava o reflexo com
            `--cc-glare-x` alimentada por motion value, e o resultado foi um
            efeito que **não aparecia, sem erro nenhum**: o React escrevia
            `[object Object]` no atributo `style`, o gradiente ficava inválido, e
            como a opacidade vinha de outra fonte a verificação "o `opacity`
            respondeu?" passava. Nem `motion.span` resolveu.

            `motion.span`, e não `span`, porque é o componente do Motion que
            escreve a `style` sem passar pelo React.
          */}
          <motion.span
            aria-hidden="true"
            className="cc-glare"
            style={{
              backgroundImage: values.glareBackground,
              opacity: values.glareOpacity,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}