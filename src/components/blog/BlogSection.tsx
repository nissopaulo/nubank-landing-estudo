"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  type Transition,
} from "motion/react";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";

import { CtaLink } from "@/components/ui/CtaLink";
import {
  BLOG_ROW,
  BLOG_TOPICS,
  cqw,
  pct,
  type BlogTopic,
} from "@/lib/blog-topics";
import {
  BLOG_STRIP,
  PANEL_TEXT,
  revealUp,
  staggerContainer,
} from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Blog Section — Figma `Blog Section - 1` a `- 4` (`212:3`, `222:79`,
 * `223:105`, `223:137`), 1920×1184.
 *
 * ## O que anda, e em que direção
 *
 * A fileira tem três slots e um anel de quatro matérias (ver
 * `blog-topics.ts`). "Próxima" empurra tudo para a esquerda: o principal sai
 * pela esquerda, o primeiro ao lado cresce para o lugar dele, o segundo vira o
 * primeiro e o tópico que estava fora entra pela direita. "Anterior" é o
 * caminho espelho.
 *
 * O card que sai **não encolhe**: mantém a largura de principal e anda
 * `BLOG_ROW.exitLeft`, saindo inteiro. Se encolhesse até `-376` ficaria meio
 * dentro da janela; se sumisse por fade, seria outro gesto.
 *
 * ## Clicar no segundo tópico ao lado anda **dois** passos
 *
 * É o único jeito de "o clicado vira o principal" num anel de quatro com três
 * slots: o clicado precisa passar pelo slot do meio. A fileira anda dois passos
 * seguidos, um de cada vez, encadeados pelo `onExitComplete` do
 * `AnimatePresence` — e não um salto de dois, que obrigaria o principal a
 * reaparecer à direita (a volta do anel) no meio do movimento. Enquanto um
 * passo está em curso, um clique novo só atualiza o destino, e não abre uma
 * segunda saída ao mesmo tempo.
 *
 * ## A descrição troca junto
 *
 * `mode="wait"`: o texto velho sai antes de o novo entrar, e o painel nunca
 * mostra dois textos sobrepostos. O `Veja Mais` fica **fora** do
 * `AnimatePresence` — ele não muda com a matéria, e se fosse remontado pularia
 * de posição a cada troca (é o mesmo cuidado que a Cards Section tomou com o
 * CTA dela).
 *
 * ## Semântica: a fileira é um tablist
 *
 * Cada card é uma aba (`role="tab"`, `aria-selected` no principal) e o bloco de
 * texto é o painel (`role="tabpanel"`, `aria-labelledby` da aba ativa) — o
 * mesmo modelo da Cards e da Solutions, e aqui com `aria-controls` apontando
 * para um painel que existe.
 *
 * O nome acessível de cada aba é a **primeira linha da descrição da matéria**:
 * o título está *dentro* da imagem e o Figma não tem esse texto em nó separado,
 * então inventar um seria conteúdo fora do desenho. As setas ficam **fora** do
 * tablist — elas não são abas, são o seletor.
 *
 * ## Onde o Figma não fala
 *
 * O destino de "Veja Mais" e de "Acesse nosso Blog" não existe no desenho: os
 * dois usam o placeholder de sempre do projeto
 * (`https://www.nubank.com.br/`), e o "Veja Mais" abre em nova aba como todo
 * link externo do site.
 */

type Direcao = "proximo" | "anterior";

/**
 * O sentido do caminho mais curto no anel.
 *
 * Com quatro matérias, andar três passos para a frente é andar um para trás — é
 * o que faz a seta da esquerda voltar do primeiro frame para o último sem
 * atravessar a fileira inteira.
 */
function direcaoDe(de: number, para: number): Direcao {
  const adiante = (para - de + BLOG_TOPICS.length) % BLOG_TOPICS.length;
  return adiante === BLOG_TOPICS.length - 1 ? "anterior" : "proximo";
}

/**
 * Um card da fileira.
 *
 * ## O card que sai fica inerte
 *
 * O `AnimatePresence` mantém o card que sai no DOM durante os 700 ms do
 * movimento, com as props congeladas da renderização anterior — inclusive
 * `aria-selected`. Para o tablist isso significaria duas abas selecionadas ao
 * mesmo tempo, e o card em movimento ainda aceitaria clique e foco. O
 * `useIsPresent` avisa o card de que ele está saindo: aí ele perde a semântica
 * de aba (`aria-selected` some, `aria-hidden` o tira da árvore) e o ponteiro.
 */
function BlogTab({
  topico: t,
  slot,
  direcao,
  transicao,
  onSelect,
}: {
  topico: BlogTopic;
  slot: number;
  direcao: Direcao;
  transicao: Transition;
  onSelect: () => void;
}) {
  const presente = useIsPresent();

  return (
    <motion.button
      type="button"
      role="tab"
      id={`blog-aba-${t.id}`}
      aria-selected={presente ? slot === 0 : undefined}
      aria-controls="blog-painel"
      aria-label={t.desc[0]}
      aria-hidden={presente ? undefined : true}
      tabIndex={presente ? undefined : -1}
      onClick={onSelect}
      initial={{
        left: pct(
          direcao === "proximo" ? BLOG_ROW.offRight : BLOG_ROW.offLeft,
        ),
        width: pct(BLOG_ROW.sideWidth),
      }}
      animate={{
        left: pct(BLOG_ROW.slots[slot].left),
        width: pct(BLOG_ROW.slots[slot].width),
      }}
      exit={{
        left: pct(slot === 0 ? BLOG_ROW.exitLeft : BLOG_ROW.offRight),
      }}
      transition={transicao}
      className={`absolute top-0 h-full overflow-hidden rounded-[16px] bg-nu-brand p-0 ${
        !presente
          ? "pointer-events-none"
          : slot === 0
            ? "cursor-default"
            : "cursor-pointer"
      }`}
    >
      {/*
        A arte é posicionada em `cqw` da **fileira**, e não em `%` do card: o
        card muda de largura na troca, a arte não. O que muda entre os slots é
        só o recorte (o `left`/`top`), que anda junto com o card — o efeito é
        uma câmera deslizando sobre a mesma imagem.
      */}
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{
          left: cqw(slot === 0 ? t.crop.main.left : t.crop.side.left),
          top: cqw(slot === 0 ? t.crop.main.top : t.crop.side.top),
        }}
        transition={transicao}
        className="absolute block"
        style={{ width: cqw(t.art.w), height: cqw(t.art.h) }}
      >
        <Image
          src={t.image}
          alt=""
          fill
          /* A maior arte tem 1000 px a 1920; abaixo disso ela é 65,8% da
             fileira, que é 79,17% da tela. */
          sizes="(min-width: 1920px) 1000px, 53vw"
          className="object-cover"
          draggable={false}
        />
      </motion.span>
    </motion.button>
  );
}

export function BlogSection() {
  const reduzido = usePrefersReducedMotion();

  const [ativo, setAtivo] = useState(0);
  /** Destino pedido. Igual a `ativo` em repouso; diferente durante a troca. */
  const [alvo, setAlvo] = useState(0);
  const [direcao, setDirecao] = useState<Direcao>("proximo");
  /**
   * Há um passo em curso.
   *
   * Sem a trava, dois cliques rápidos abririam duas saídas ao mesmo tempo e o
   * `AnimatePresence` remontaria a fileira no meio do movimento — o mesmo
   * defeito que a trava da Solutions evita na troca de cena.
   */
  const [trocando, setTrocando] = useState(false);

  const topico = BLOG_TOPICS[ativo];
  const visiveis = [0, 1, 2].map(
    (i) => BLOG_TOPICS[(ativo + i) % BLOG_TOPICS.length],
  );

  /*
   * A duração vai a zero sob movimento reduzido. O `MotionConfig` do projeto
   * desliga transform e layout; aqui o que anda é `left` e `width`, que ele não
   * cobre — o mesmo caso que a Solutions resolve à mão.
   */
  const transicao = {
    duration: reduzido ? 0 : BLOG_STRIP.duration,
    ease: BLOG_STRIP.ease,
  };

  function passo(dir: Direcao) {
    setDirecao(dir);
    setTrocando(true);
    setAtivo((atual) =>
      dir === "proximo"
        ? (atual + 1) % BLOG_TOPICS.length
        : (atual - 1 + BLOG_TOPICS.length) % BLOG_TOPICS.length,
    );
  }

  function irPara(indice: number) {
    setAlvo(indice);
    if (trocando || indice === ativo) return;
    passo(direcaoDe(ativo, indice));
  }

  /** Um passo terminou: libera a trava e dá o próximo, se ainda faltar. */
  function aoSair() {
    setTrocando(false);
    if (ativo === alvo) return;
    passo(direcaoDe(ativo, alvo));
  }

  function andar(dir: Direcao) {
    const destino =
      dir === "proximo"
        ? (ativo + 1) % BLOG_TOPICS.length
        : (ativo - 1 + BLOG_TOPICS.length) % BLOG_TOPICS.length;
    irPara(destino);
  }

  return (
    <section
      id="blog"
      aria-labelledby="blog-titulo"
      /* Superfície clara: a seção é branca e o que recebe foco (as setas, as
         abas e o link) está sobre ela. */
      data-surface="light"
      className="nu-frame bg-white py-[100px]"
    >
      <div className="flex flex-col gap-[100px]">
        <div className="flex flex-col gap-[100px]">
          {/*
            `items-end`: as setas alinham pela base do título, que é o que o
            Figma mostra nos quatro frames. O `pb-[2px]` é o inset de 2 px que
            o desenho deixa entre a caixa do seletor (46) e o círculo (42).
          */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={revealUp}
            className="flex items-end justify-between gap-[24px]"
          >
            <h2
              id="blog-titulo"
              className="font-display text-nu-display font-bold leading-[1.22] text-nu-text-primary"
            >
              As novidades do
              <br />
              universo Nu.
            </h2>

            <div className="flex shrink-0 items-center gap-[24px] px-[2px] pb-[2px]">
              {/*
                Os dois círculos são os do Figma (`imgSelector`, 112×46: dois
                de 42 com 24 de intervalo). O ícone é Phosphor no lugar do SVG
                do arquivo, como no resto do projeto.

                A fileira é um anel, então nenhuma seta fica desabilitada — o
                Figma desenha as duas com a mesma tinta.
              */}
              <button
                type="button"
                onClick={() => andar("anterior")}
                aria-label="Matéria anterior"
                className="grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-full bg-nu-brand text-white transition-colors hover:bg-nu-purple-800 active:bg-nu-purple-950"
              >
                <ArrowLeft size={20} weight="regular" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => andar("proximo")}
                aria-label="Próxima matéria"
                className="grid h-[42px] w-[42px] cursor-pointer place-items-center rounded-full bg-nu-brand text-white transition-colors hover:bg-nu-purple-800 active:bg-nu-purple-950"
              >
                <ArrowRight size={20} weight="regular" aria-hidden="true" />
              </button>
            </div>
          </motion.div>

          {/*
            O bloco de baixo entra em cascata: a fileira, o texto e a linha. É a
            mesma coreografia da entrada da Cards Section, e cada peça tem o seu
            `revealUp` — o texto **não** está dentro do `AnimatePresence`, para
            não repetir a entrada a cada troca de matéria.
          */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={staggerContainer(0.09)}
            className="flex flex-col gap-[64px]"
          >
            {/*
              A fileira é `container-type: inline-size` e a altura é a proporção
              do Figma (1520×420). Tudo o que está dentro — slots e arte — é
              medido em `%`/`cqw` dela, então a 1280 o conjunto encolhe inteiro,
              no mesmo enquadramento, e a 3840 ele para no tamanho do Figma.

              `overflow-hidden` é o que faz o card que sai desaparecer de
              verdade: a janela corta na borda da coluna, e não na do card.
            */}
            <motion.div
              variants={revealUp}
              role="tablist"
              aria-label="Matérias do blog"
              aria-orientation="horizontal"
              className="relative aspect-[1520/420] w-full overflow-hidden [container-type:inline-size]"
            >
              <AnimatePresence initial={false} onExitComplete={aoSair}>
                {visiveis.map((t, slot) => (
                  /*
                   * O `exit` sai do **slot em que o card estava**, e não da
                   * direção atual: o `AnimatePresence` guarda o elemento da
                   * renderização anterior, então a `direcao` lida aqui seria a
                   * de um passo atrás. O slot congelado não mente — quem sai é
                   * sempre o principal (0) ou o último ao lado (2).
                   */
                  <BlogTab
                    key={t.id}
                    topico={t}
                    slot={slot}
                    direcao={direcao}
                    transicao={transicao}
                    onSelect={() =>
                      irPara((ativo + slot) % BLOG_TOPICS.length)
                    }
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            <motion.div
              variants={revealUp}
              id="blog-painel"
              role="tabpanel"
              aria-labelledby={`blog-aba-${topico.id}`}
              className="flex items-start gap-[100px]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={topico.id}
                  initial={{ opacity: 0, y: PANEL_TEXT.y }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    transition: { duration: PANEL_TEXT.exit, ease: "easeIn" },
                  }}
                  transition={{
                    duration: PANEL_TEXT.enter,
                    ease: PANEL_TEXT.ease,
                  }}
                  className="flex-1 font-display text-[16px] font-medium leading-[1.25] text-nu-text-tertiary"
                >
                  {topico.desc[0]}
                  <br />
                  {topico.desc[1]}
                </motion.p>
              </AnimatePresence>

              {/*
                "Veja Mais" é texto + seta, sem pílula: o Figma não dá padding
                nenhum ao nó (`223:174`), e o `CtaLink` acrescentaria 18/10. O
                `-mt-1 py-1` dá área de clique sem tirar o texto da linha de
                base da descrição.

                A cadeia de hover é PROVISÓRIA: o Figma não traz estado para
                este link. É o mesmo `Purple/800` dos outros CTAs da página.
              */}
              <a
                href="https://www.nubank.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="-mt-1 inline-flex shrink-0 items-center gap-[10px] py-1 font-display text-[16px] font-semibold leading-[1.25] text-nu-brand transition-colors hover:text-nu-purple-800"
              >
                Veja Mais
                <CaretRight size={20} weight="regular" aria-hidden="true" />
              </a>
            </motion.div>

            <motion.div
              variants={revealUp}
              aria-hidden="true"
              className="h-px w-full bg-nu-neutral-200"
            />
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={revealUp}
          className="flex justify-center"
        >
          <CtaLink variant="brand" href="https://www.nubank.com.br/">
            Acesse nosso Blog
          </CtaLink>
        </motion.div>
      </div>
    </section>
  );
}
