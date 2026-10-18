"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Variants } from "motion/react";

import { CARD_GEOMETRY, CHIP_GEOMETRY, type ShowcaseCard } from "@/lib/card-showcase";
import type { CardTilt } from "@/components/cards/use-card-tilt";
import { DURATION, EASE_EMPHASIZED } from "@/lib/motion";

const FLIP = { duration: DURATION.base, ease: EASE_EMPHASIZED } as const;

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
 * Então ele é montado em DOM, com os SVG do Figma como asset em
 * `/public/images/credit-card` — nenhum `path` copiado para o código.
 *
 * ## Duas composições, porque o design tem duas
 *
 * `layout: "stack"` (Nubank) são três peças empilhadas e sem rotação.
 * `layout: "rotated"` (Croma) são duas linhas alinhadas à direita, e **cada peça
 * girada 90°**.
 *
 * Isso não é generalização prematura nem flexibilidade: são duas árvores
 * diferentes no Figma, com alinhamento, ordem e rotação diferentes. Forçar um
 * arranjo único entregaria um dos dois fora do design. O branch é o preço
 * honesto de ter dois frames de verdade.
 *
 * ## A inclinação vem de fora
 *
 * Este componente não escuta o ponteiro: recebe os valores prontos de
 * `useCardTilt`, porque quem escuta é a `<section>` — a interação é da seção
 * inteira, não do cartão.
 *
 * ## A virada é do elemento de fora, e a inclinação é do de dentro
 *
 * As duas usam `rotateY`, e um `transform` só não comporta os dois gestos — o
 * segundo cancelaria o primeiro no meio. Separadas, cada gesto tem a sua
 * transformada, e trocar de cartão não cancela a inclinação em curso.
 */
export function CreditCard({
  card,
  direction,
  tilt,
}: {
  card: ShowcaseCard;
  /** +1 à frente, −1 para trás. Vem da `CardsSection`. */
  direction: number;
  tilt: CardTilt;
}) {
  const data = card.showcase;
  // Desestruturado: a regra `react-hooks/refs` aceita um identificador direto
  // no `ref`, mas não uma leitura de propriedade (`tilt.cardRef`) durante o
  // render.
  const { cardRef, values } = tilt;

  if (!data) return null;

  /**
   * A virada, e por que `exit` é uma função.
   *
   * `initial` usa a prop `direction`, que é a direção **desta** transição — o
   * cartão que entra é criado agora e recebe a atual.
   *
   * `exit` não pode. O `AnimatePresence` mantém o cartão que sai montado com as
   * props do render **anterior**, e foi assim que os dois sentidos passaram a
   * girar para o mesmo lado: cada um usava a direção de quando foi criado, e não
   * a da troca que estava executando. Medido: Nubank → Croma saía a +90° e
   * Croma → Nubank **também**, quando deveria sair a −90°.
   *
   * O `custom` do `AnimatePresence` é a saída: ele chega ao `exit` do
   * componente que está saindo justamente porque esse componente já está com as
   * props velhas. Está em `CardsSection`.
   *
   * `rotateY(+90°)` traz a **esquerda** do cartão para quem olha e joga a
   * direita para trás — que é girar para a direita. O que entra vem do outro
   * lado, de `rotateY(-90°)`, e assenta em 0. Os dois se cruzam por 90°, e é aí
   * que o gesto lê como troca e não como dois cartões.
   */
  const flipVariants: Variants = {
    initial: { rotateY: -direction * 90 },
    animate: { rotateY: 0, transition: FLIP },
    exit: (dir: number) => ({ rotateY: dir * 90, transition: FLIP }),
  };

  const faceStyle = {
    width: CARD_GEOMETRY.width,
    height: CARD_GEOMETRY.height,
    padding: CARD_GEOMETRY.padding,
    borderRadius: CARD_GEOMETRY.radius,
    backgroundImage: data.gradient,
    color: data.ink,
  };

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
          data-layout={data.layout}
          style={faceStyle}
        >
          {data.layout === "stack" ? (
            <StackPieces data={data} />
          ) : (
            <RotatedPieces data={data} />
          )}

          {/*
            O chip é absoluto contra o cartão, não contra o conteúdo: os valores
            são do frame e não se multiplicam pelo padding. Por isso `left` e
            `top` são dados, e não classes — os dois frames os põem em lugares
            diferentes. O gradiente dele é `linear-gradient` nos dois casos e é
            o único gradiente da seção que o CSS sempre expressou sozinho, porque
            os dois tons são tokens (`Neutral/400` e `Neutral/200`).
          */}
          <span
            className="absolute overflow-clip"
            style={{
              left: data.chip.left,
              top: data.chip.top,
              width: CHIP_GEOMETRY.width,
              height: CHIP_GEOMETRY.height,
              borderRadius: CHIP_GEOMETRY.radius,
              borderWidth: CHIP_GEOMETRY.border,
              borderStyle: "solid",
              borderColor: "var(--color-nu-neutral-800)",
              backgroundImage:
                "linear-gradient(36.416deg, #9ca3af 0%, #e5e7eb 100%)",
            }}
          >
            <Image
              src={data.chip.contact}
              alt=""
              aria-hidden="true"
              width={17.4697}
              height={19.4308}
              className="absolute max-w-none"
              style={{ inset: data.chip.contactInset, width: "auto", height: "auto" }}
              unoptimized
            />
            <Image
              src={data.chip.lines}
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
            a verificação passava porque a opacidade vinha de outra fonte. Nem
            `motion.span` resolveu.

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

/** Peças do cartão no arranjo do `97:2` — três, empilhadas, sem rotação. */
function StackPieces({ data }: { data: NonNullable<ShowcaseCard["showcase"]> }) {
  return (
    <>
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
        `leading-[1.25]`, e não `leading-none`: é a altura natural do Montserrat a
        esta caixa, que é a convenção do projeto. A diferença não é de leitura, é
        de posição — o nome é o elemento do meio do `justify-between`, então a
        altura dele distribui os dois vãos e qualquer caixa diferente move o
        texto em ~2px.
      */}
      <span className="cc-holder font-display text-[17.391px] font-semibold leading-[1.25]">
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
    </>
  );
}

/**
 * Peças do cartão no arranjo do `103:248` — duas linhas, alinhadas à direita,
 * e cada peça girada 90°.
 *
 * A rotação é de peça e não do cartão inteiro, porque é o que o Figma tem: os
 * nós `103:292`, `103:294` e `103:299` são cada um um wrapper `rotate-90` em
 * volta da peça. Girar o cartão inteiro também os deixaria na vertical, mas
 * trocaria de lugar o nome e a marca `nu` em relação ao chip, que é absoluto.
 */
function RotatedPieces({ data }: { data: NonNullable<ShowcaseCard["showcase"]> }) {
  return (
    <>
      {/* Linha 1 — nome à esquerda, marca `nu` à direita, ambos girados. */}
      <div className="flex w-full items-start justify-between">
        <div className="flex h-[149px] w-[21px] shrink-0 items-center justify-center leading-[0]">
          <div className="flex-none rotate-90">
            <span className="cc-holder font-display text-[17.391px] font-semibold leading-[1.25] whitespace-nowrap">
              {data.holder}
            </span>
          </div>
        </div>
        <div className="flex h-[86.956px] w-[47.432px] shrink-0 items-center justify-center">
          <div className="flex-none rotate-90">
            <Image
              src={data.nuLogo}
              alt=""
              aria-hidden="true"
              width={86.9565}
              height={47.4323}
              className="h-[47.4323px] w-[86.9565px] max-w-none"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Linha 2 — rede de cartões, girada, alinhada à direita. */}
      <div className="flex h-[86.866px] w-[53.69px] shrink-0 items-center justify-center leading-[0]">
        <div className="flex-none rotate-90">
          <Image
            src={data.network}
            alt=""
            aria-hidden="true"
            width={86.8656}
            height={53.6897}
            className="h-[53.6897px] w-[86.8656px] max-w-none"
            unoptimized
          />
        </div>
      </div>
    </>
  );
}