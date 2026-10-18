"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Variants } from "motion/react";

import { CreditCard } from "@/components/cards/CreditCard";
import { useCardTilt } from "@/components/cards/use-card-tilt";
import { CtaLink } from "@/components/ui/CtaLink";
import {
  ACTIVE_INDEX,
  CARDS,
  SECTION_BACKGROUND,
  type ShowcaseCard,
} from "@/lib/card-showcase";
import {
  DURATION,
  EASE_EMPHASIZED,
  revealScale,
  revealUp,
  staggerContainer,
} from "@/lib/motion";

/**
 * Cards Section — Figma `Cards Section - Nubank` (nó `97:2`), 1920×1086.
 *
 * ## Só um frame está liberado
 *
 * O Figma tem quatro frames desta seção e **três estão ocultos**: o processo é
 * um frame por vez. As quatro pílulas aparecem no seletor desde o começo — é o
 * que o `97:2` mostra — mas só a do Nubank responde. As outras três são
 * `<button>` reais com `aria-disabled` e aviso para leitor de tela, a mesma
 * regra dos itens da navegação e dos pilares do Ecossystem: **um botão que não
 * faz nada não existe em silêncio.**
 *
 * Nenhum texto, cor ou geometria foi inventado para os três. Quando o frame
 * entrar, o trabalho é preencher o campo `showcase` em `lib/card-showcase.ts` e
 * nada mais muda aqui.
 *
 * ## O seletor é tablist, e não botões soltos
 *
 * Trocar de pílula troca o conteúdo inteiro da seção — cartão, título,
 * descrição e CTA. Isso é uma tablist, e dizer isso com `role="tab"` /
 * `aria-selected` / `tabpanel` é o que faz o leitor de tela anunciar "Cartão
 * Nubank, aba 1 de 4" em vez de quatro botões sem relação. O `EcosystemSection`
 * usa `aria-expanded` porque lá cada card é um botão que abre um bloco; aqui a
 * relação é de substituição, não de expansão.
 *
 * ## A virada é de duas peças, porque a inclinação também mexe em `rotateY`
 *
 * O cartão gira no próprio eixo Y na troca, e gira em `rotateX`/`rotateY` sob o
 * ponteiro. Um `transform` só não comporta os dois gestos. A virada fica num
 * elemento **externo** e a inclinação num **interno** — cada gesto tem a sua
 * transformada, e trocar de cartão não cancela a inclinação em curso.
 *
 * **A virada ainda não foi verificada:** com um único frame liberado não existe
 * troca para executar. As variantes estão prontas e entram assim que o segundo
 * frame existir — mas trata-se de código escrito sem poder rodar, e a única
 * forma de saber se o gesto é o que foi pedido é medi-lo no navegador quando
 * houver dois cartões.
 */
export function CardsSection() {
  const [active, setActive] = useState(ACTIVE_INDEX);
  const [direction, setDirection] = useState(1);
  const card = CARDS[active];

  // O ponteiro é escutado na seção inteira, e não no cartão — é o que faz a
  // interação parecer com a seção e não com uma caixa de 252px no meio dela.
  const tilt = useCardTilt();

  function select(index: number) {
    if (index === active) return;
    // A direção é a do **sentido da troca**, não o sinal do índice: indo do
    // Croma para o Nubank (índice 1 → 0) o cartão também tem de girar para a
    // esquerda, e não para a direita. Comparar índices daria o gesto invertido
    // justamente nos saltos para trás.
    setDirection(index > active ? 1 : -1);
    setActive(index);
  }

  return (
    <section
      id="cartoes"
      aria-label="Cartões"
      className="flex flex-col items-center gap-[100px] px-[200px] py-[100px]"
      style={{ backgroundImage: SECTION_BACKGROUND }}
      {...tilt.bind}
    >
      {/*
        Container da entrada. `whileInView` com `once` — a seção surge **na
        chegada**, e não na montagem: quem já abre a página no meio da rolagem
        não pode ver a seção inteira passar pela animação.

        **Este wrapper é um elemento de verdade, e precisa ser.** A primeira
        versão usava `className="contents"` para não acrescentar caixa nenhuma,
        e com isso a entrada nunca rodava: `display: contents` não gera caixa, o
        `IntersectionObserver` do `whileInView` não tem o que observar, e as
        pílulas ficavam presas em `translateY(24px)` — 24px abaixo do lugar, sem
        nenhum erro em lugar nenhum. Trocar por um `div` de verdade não muda o
        layout: a seção é `items-center`, então o wrapper encolhe até o conteúdo
        e continua centralizado, ocupando o mesmo slot de `gap`.
      */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer(0.09)}
      >
        <div
          role="tablist"
          aria-label="Escolher o cartão"
          aria-orientation="horizontal"
          className="flex items-start gap-[24px]"
        >
          {CARDS.map((item, index) => (
            <motion.div key={item.id} variants={revealUp}>
              <CardTab
                card={item}
                selected={index === active}
                onSelect={() => select(index)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div
        role="tabpanel"
        id={`cartoes-painel-${card.id}`}
        aria-labelledby={`cartoes-aba-${card.id}`}
        className="flex w-full flex-1 flex-col items-center justify-center gap-[64px]"
      >
        {/*
          O palco tem tamanho fixo e `position: relative` porque os dois cartões
          ficam **montados ao mesmo tempo** durante a virada — em fluxo normal
          eles empilhariam e a seção cresceria para 800px no meio do gesto. Os
          cartões são absolutos um sobre o outro por isso.

          A `perspective` fica aqui, e não no cartão: é o palco que dá a
          referência de profundidade, e é ele que não se move quando o cartão
          gira. Sem `preserve-3d` na cadeia a rotação achata em 2D.

          A entrada é `revealScale`, e não o `revealUp` das pílulas: o cartão é
          o centro da seção, e escala é o que dá a sensação de objeto sendo
          posto no lugar em vez de texto subindo.
        */}
        <motion.div
          className="cc-stage relative h-[400px] w-[252.174px]"
          style={{ perspective: 1400 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={revealScale}
        >
          <AnimatePresence initial={false}>
            <CreditCard
              key={card.id}
              card={card}
              flipVariants={flipVariants(direction)}
              tilt={tilt}
            />
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-[24px] text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={revealUp}
        >
          <h2 className="font-display text-[64px] font-bold leading-[1.22] text-nu-brand">
            {card.showcase?.title}
          </h2>
          <p className="font-display text-[16px] font-medium leading-[1.25] text-nu-text-primary">
            {card.showcase?.desc[0]}
            <br />
            {card.showcase?.desc[1]}
          </p>
        </motion.div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={card.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.26, ease: "easeOut" }}
        >
          {/* Entrada por conta própria: o `AnimatePresence` acima troca a
              opacidade por cartão, e as duas coisas no mesmo elemento brigariam
              — uma virada poderia reverter a entrada da seção. */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={revealUp}
          >
            <CtaLink variant="brand" href="https://www.nubank.com.br/">
              {card.showcase?.cta}
            </CtaLink>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

/**
 * Pílula do seletor.
 *
 * `aria-disabled` nos cartões cujo frame ainda não foi liberado, com o aviso em
 * `sr-only` — sem ele, o botão seria focável e não faria nada. `aria-selected`
 * só nos que existem, porque é nesses que a troca acontece de verdade.
 */
function CardTab({
  card,
  selected,
  onSelect,
}: {
  card: ShowcaseCard;
  selected: boolean;
  onSelect: () => void;
}) {
  const liberado = Boolean(card.showcase);

  return (
    <button
      type="button"
      role="tab"
      id={`cartoes-aba-${card.id}`}
      aria-selected={liberado ? selected : undefined}
      aria-disabled={!liberado}
      aria-controls={`cartoes-painel-${card.id}`}
      onClick={liberado ? onSelect : undefined}
      data-state={selected ? "active" : "idle"}
      className="cc-tab rounded-full px-[18px] py-[10px] font-display text-base font-semibold leading-[1.25] whitespace-nowrap"
    >
      {card.label}
      {!liberado && (
        <span className="sr-only">— ainda não implementado neste estudo</span>
      )}
    </button>
  );
}

/**
 * A virada.
 *
 * Os dois cartões ficam montados ao mesmo tempo (o `AnimatePresence` sem
 * `mode="wait"`) e se cruzam por 90°, que é o que faz ler como **um** objeto
 * girando em vez de dois cartões trocando. Com `wait` o antigo sumiria antes do
 * novo aparecer, e o gesto seria um corte com dois intervalos.
 *
 * `EASE_EMPHASIZED`, pelo mesmo motivo do Ecossystem: com `EASE_OUT_EXPO` o
 * cartão chega em 90° cedo demais e passa o resto da duração quase parado na
 * borda — o movimento se lê como travado, não como giro.
 */
function flipVariants(direction: number): Variants {
  const edge = direction * 90;

  return {
    initial: { rotateY: -edge },
    animate: {
      rotateY: 0,
      transition: { duration: DURATION.base, ease: EASE_EMPHASIZED },
    },
    exit: {
      rotateY: edge,
      transition: { duration: DURATION.base, ease: EASE_EMPHASIZED },
    },
  };
}