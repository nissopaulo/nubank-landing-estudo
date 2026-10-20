"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";

import {
  ACTIVE_INDEX,
  CARROSSEL_EASE,
  DURACAO_PASSO,
  DURACAO_ROLAGEM,
  FORA_DIR,
  FORA_ESQ,
  SLOTS,
  SOLUTIONS,
  WINDOW,
  type SlotName,
  type Solution,
} from "@/lib/solutions";
import { DURATION, EASE_OUT_EXPO, revealUp, staggerContainer } from "@/lib/motion";
import { PillTab } from "@/components/ui/PillTab";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import {
  useBackgroundParallax,
  type BackgroundParallaxValues,
} from "@/components/solutions/use-background-parallax";

/**
 * Solutions Section — Figma `Solutions Section - Safe` (`144:2`), `- Account`
 * (`151:92`), `- Billing` (`153:125`) e `- Business` (`153:167`), 1920×1176.
 *
 * ## Uma composição é UM componente
 *
 * A arte, o badge e o painel de texto vivem no **mesmo quadro** de 1520 × 720,
 * e é esse quadro que muda de lugar. Nada "flutua" — o badge está atrelado à
 * arte dele porque está **dentro** do quadro dela.
 *
 * ## O quadro tem três posições, e a posição é o papel
 *
 * | papel | posição | escala | o que é |
 * |---|---|---|---|
 * | centro | 200, 356 | 1 | a opção ativa, nítida e cheia |
 * | esquerda | −1173,444, 408 | 0,861111 | a anterior, miniatura e desfocada |
 * | direita | 1784,556, 406 | 0,861111 | a seguinte, miniatura e desfocada |
 *
 * A miniatura é **a janela encolhida**: 1308,889 / 1520 = 620 / 720 =
 * 0,861111, e o recorte da arte dentro dela é o da janela escalado pelo mesmo
 * número (delta 0,000 nos quatro valores, nos quatro frames do Figma).
 *
 * ## O carrossel NUNCA salta — ele rola
 *
 * Clicar na terceira opção a partir da primeira **não** troca a página: o
 * carrossel **rola**, uma opção por vez, e cada passo é exatamente a mesma
 * transição de um degrau.
 *
 * É essa a decisão que elimina os dois defeitos mais chatos:
 *
 * - **As composições não se cruzam.** Num salto, as intermediárias têm de
 *   atravessar a janela, e o resultado é "todas as imagens aparecendo". Rolando,
 *   cada passo move uma composição de papel e só uma — nada cruza.
 * - **Cada composição se move uma vez.** A que sai tem a saída; a que entra tem
 *   a entrada; as duas que trocam de papel têm a viagem. Uma composição nunca
 *   faz duas coisas ao mesmo tempo.
 *
 * ## A entrada e a saída são do lado OPOSTO
 *
 * A faixa anda para um lado, então a que sai vai para esse lado e a que entra
 * vem do lado contrário. Num passo para a frente: a que sai sai pela esquerda
 * e a que entra entra pela direita.
 *
 * E é por isso que o "fora" é uma **função** da direção, e não um valor
 * fixo: o \`custom\` do Motion é o que carrega o sentido do gesto, e só uma
 * *variant* o recebe.
 */
export function SolutionsSection() {
  /*
   * `indice` é a opção **exibida**; `alvo` é a pedida.
   *
   * Eles só divergem durante a rolagem, e é essa divergência que faz o
   * carrossel andar um degrau por vez.
   */
  const [indice, setIndice] = useState(ACTIVE_INDEX);
  const [alvo, setAlvo] = useState(ACTIVE_INDEX);
  /** A duração do degrau, em ms. Definida no clique, porque depende do salto. */
  const [duracao, setDuracao] = useState(DURACAO_PASSO);
  /**
   * O sentido do gesto.
   *
   * Precisa ser estado: no clique, `alvo` e `indice` ficam iguais, e o
   * sentido derivado deles se perde — voltar para a anterior seria lido como
   * avançar.
   */
  const [direcao, setDirecao] = useState(1);

  const solucao = SOLUTIONS[indice];
  const active = solucao.active;

  /**
   * O instante em que a arte chega, em segundos.
   *
   * É o tempo do degrau — o mesmo número da transição da arte
   * (`CARROSSEL_DURACAO` no CSS). O badge e o painel esperam esse instante
   * para aparecerem, para não trocarem no meio do movimento.
   *
   * Sob movimento reduzido o atraso é **zero**: a preferência pede mudança
   * instantânea, e esperar um segundo para o texto aparecer é o contrário.
   */
  const chegada = usePrefersReducedMotion() ? 0 : duracao / 1000;

  /*
   * A arte de fundo segue o ponteiro. O ouvinte é a **janela** — é o que
   * limita o efeito àquela tela: passar o ponteiro pelo título ou pelas
   * pílulas não move a arte.
   *
   * O hook vem **antes** do `return` antecipado: a regra de hooks exige a
   * mesma ordem em todo render, e um hook depois de uma saída antecipada é
   * exatamente o que ela proíbe.
   */
  const parallax = useBackgroundParallax();

  /*
   * A rolagem: um degrau por vez, e cada degrau espera a animação anterior
   * terminar. Sem este efeito, um clique na terceira opção pularia direto —
   * e o salto é justamente o que não funciona.
   */
  useEffect(() => {
    if (indice === alvo) return;
    const t = setTimeout(() => {
      setIndice(indice + Math.sign(alvo - indice));
    }, duracao);
    return () => clearTimeout(t);
  }, [indice, alvo, duracao]);

  /*
   * O `active` ausente é o estado de "frame ainda não liberado". Ele existe
   * para a regra acima valer de forma mecânica, e não por commento.
   */
  if (!active) return null;

  function select(i: number) {
    if (i === alvo) return;
    const passos = Math.abs(i - indice);
    /*
     * Uma troca de uma em uma é o caso comum, e é lenta — foi o que o usuário
     * pediu. Uma rolagem de vários degraus é rápida, senão três degraus
     * levariam três segundos.
     */
    setDuracao(passos > 1 ? DURACAO_ROLAGEM : DURACAO_PASSO);
    setDirecao(Math.sign(i - indice));
    setAlvo(i);
    /*
     * O **primeiro degrau é imediato**.
     *
     * Se o índice só advancedse no efeito, haveria um tempo morto do tamanho
     * da duração antes de a animação começar — e foi exatamente o que a
     * primeira medição mostrou: um segundo parado, e depois o gesto.
     */
    setIndice(indice + Math.sign(i - indice));
  }


  /*
   * As três composições visíveis: a anterior, a ativa e a seguinte.
   *
   * São sempre exatamente três (ou menos, nas pontas), e o papel de cada uma é
   * a sua posição relativa à ativa.
   */
  const visiveis = [
    { opcao: SOLUTIONS[indice - 1], papel: "esquerda" as SlotName },
    { opcao: SOLUTIONS[indice], papel: "centro" as SlotName },
    { opcao: SOLUTIONS[indice + 1], papel: "direita" as SlotName },
  ].filter((c) => c.opcao && c.opcao.active);

  return (
    <section
      id="solucoes"
      aria-labelledby="solucoes-titulo"
      className="relative flex flex-col items-center gap-[100px] overflow-clip bg-white px-[200px] py-[100px]"
      /*
       * A duração do degrau, em CSS, para a transição do desfoque acompanhar
       * a do transform. É a mesma duplicação que os CTAs da header têm: o
       * Tailwind só enxerga classes escritas por extenso, e esta transição é
       * CSS escrito à mão.
       */
      style={{ "--sol-dur": `${duracao}ms` } as React.CSSProperties}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer(0.09)}
        className="flex w-full flex-col gap-[100px]"
      >
        {/*
          As composições. Cada uma é um quadro de 1520 × 720 — a janela — com a
          arte, o badge e o painel dentro.

          O quadro é o que viaja, e o papel é o que muda: de "centro" para
          "esquerda" a composição encolhe e ganha blur, e vice-versa.
        */}
        <AnimatePresence initial={false}>
          {visiveis.map(({ opcao, papel }) => (
            <Composicao
              key={opcao.id}
              opcao={opcao}
              papel={papel}
              direcao={direcao}
              duracao={duracao}
              chegada={chegada}
              parallax={parallax.values}
            />
          ))}
        </AnimatePresence>

        {/*
          O Title é uma linha só: o texto à esquerda e o seletor à direita, os
          dois alinhados pela base.

          No Figma (`150:48`) o Navigation virou **filho do Title**, em
          `justify-between` — e é por isso que ele sai em x = 902: 1520 − 618,
          ou seja, flush com a borda direita da coluna de conteúdo.
        */}
        <motion.div
          variants={revealUp}
          className="relative flex w-full items-end justify-between"
        >
          {/*
            O título da seção também é por opção, e por isso ele troca junto —
            mas **rápido**, sem esperar a arte chegar.

            A espera não caberia aqui: o título ficaria vazio durante toda a
            viagem, e um bloco de texto em branco no alto da seção parece
            defeito. Ele é a "chrome" da seção, e a chrome troca na hora.
          */}
          <AnimatePresence initial={false} mode="wait">
            <motion.h2
              key={solucao.id}
              id="solucoes-titulo"
              /*
               * `whitespace-pre` porque o Figma traz um espaço no fim da
               * primeira linha do título, e ele conta na largura da caixa de
               * texto: o nó `151:95` mede 554 e a linha sem o espaço mede
               * 535,25. O espaço é invisível, mas a medida é a do design.
               */
              className="font-display text-[64px] font-bold leading-[1.22] whitespace-pre text-nu-brand"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {active.sectionTitle[0]}
              <br />
              {active.sectionTitle[1]}
            </motion.h2>
          </AnimatePresence>

          {/*
            O seletor. `role="tablist"` porque trocar de opção troca o
            **conteúdo inteiro** da seção — é a mesma relação de substituição
            da Cards Section, e é o que faz o leitor de tela anunciar
            "Caixinhas, aba 1 de 4" em vez de quatro botões sem relação.

            É o **mesmo componente** da Cards Section (`PillTab`), com a mesma
            regra de CSS. A paleta é a da marca, que é o default das custom
            properties — e por isso o seletor não precisa declarar nenhuma.
          */}
          <div
            role="tablist"
            aria-label="Escolher a solução"
            aria-orientation="horizontal"
            className="sol-nav flex items-start gap-[24px]"
          >
            {SOLUTIONS.map((item, i) => (
              <PillTab
                key={item.id}
                label={item.label}
                selected={i === indice}
                liberado={Boolean(item.active)}
                id={`solucoes-aba-${item.id}`}
                controls={`solucoes-painel-${item.id}`}
                onSelect={() => select(i)}
              />
            ))}
          </div>
        </motion.div>

        {/*
          A janela. Ela **não** tem `overflow-clip`, e é de propósito: o badge e
          o painel saem com a arte, e um clip aqui os cortaria no meio da
          viagem. O clip que importa é o do quadro da composição.

          E é aqui que o ponteiro é escutado: o efeito da arte fica **limitado
          a esta tela**, e passar pelo título ou pelas pílulas não move nada.
        */}
        <motion.div
          role="tabpanel"
          id={`solucoes-painel-${solucao.id}`}
          aria-labelledby={`solucoes-aba-${solucao.id}`}
          variants={revealUp}
          className="sol-window relative w-full"
          style={{ height: WINDOW.h, borderRadius: WINDOW.radius }}
          {...parallax.bind}
        />
      </motion.div>
    </section>
  );
}

/**
 * Uma composição: a arte, o badge e o painel de texto, no mesmo quadro.
 *
 * ## O quadro viaja, e o que ele leva junto
 *
 * A arte, o badge e o painel estão **dentro** do quadro, e o quadro é o que
 * muda de papel. É por isso que o badge está atrelado à arte dele: não é uma
 * coincidência de posição, é a mesma árvore.
 *
 * ## Quem é CSS e quem é do Motion
 *
 * O Motion interpola `transform` e `opacity`, mas **não** interpola `filter` —
 * e o desfoque da miniatura é justamente o que precisa de interpolação. Por
 * isso o `filter` fica no estilo inline com uma transição de CSS, e o
 * transform e a opacidade são variantes do Motion.
 */
function Composicao({
  opcao,
  papel,
  direcao,
  duracao,
  chegada,
  parallax,
}: {
  opcao: Solution;
  papel: SlotName;
  direcao: number;
  /** A duração do degrau, em ms. */
  duracao: number;
  chegada: number;
  parallax: BackgroundParallaxValues;
}) {
  const active = opcao.active;
  if (!active) return null;

  const s = SLOTS[papel];
  const miniatura = papel !== "centro";

  /*
   * As duas posições de fora, calculadas no render.
   *
   * A **saída** é do lado para onde a faixa anda; a **entrada** é do lado
   * contrário, porque quem entra vem de onde a faixa vai.
   *
   * E é melhor calcular aqui do que deixar a variant depender do `custom` do
   * Motion: ele chega na **saída** e não chega na **entrada** — o que fazia a
   * composição que entra pelo lado errado, e o gesto virava um varrido.
   */
   const foraSaida = direcao > 0 ? FORA_ESQ : FORA_DIR;
  const foraEntrada = direcao > 0 ? FORA_DIR : FORA_ESQ;

  return (
    <motion.div
      aria-hidden={miniatura ? "true" : undefined}
      className="sol-arte absolute overflow-clip"
      style={{
        left: 0,
        top: 0,
        width: WINDOW.w,
        height: WINDOW.h,
        borderRadius: WINDOW.radius,
        /*
         * A origem do transform é o **canto do quadro**, e não o centro: é o
         * que faz a escala encolher a partir do mesmo lugar de onde a
         * miniatura é posicionada.
         */
        transformOrigin: "0 0",
        /*
         * O desfoque é local: o `filter` é aplicado no espaço do quadro, e o
         * quadro está escalado por 0,861111 — então 5,001 local dá 4,306 na
         * tela, que é o número do Figma.
         */
        filter: `blur(${s.blur}px)`,
      }}
      variants={{
        centro: { x: SLOTS.centro.x, y: SLOTS.centro.y, scale: 1, opacity: 1 },
        esquerda: {
          x: SLOTS.esquerda.x,
          y: SLOTS.esquerda.y,
          scale: SLOTS.esquerda.scale,
          opacity: 1,
        },
        direita: {
          x: SLOTS.direita.x,
          y: SLOTS.direita.y,
          scale: SLOTS.direita.scale,
          opacity: 1,
        },
        /* A **saída** é do lado para onde a faixa anda. */
        sai: { x: foraSaida.x, y: foraSaida.y, scale: foraSaida.scale, opacity: 0 },
        /* A **entrada** é do lado contrário. */
        entra: { x: foraEntrada.x, y: foraEntrada.y, scale: foraEntrada.scale, opacity: 0 },
      }}
      /*
       * O `initial` é "entra" e não `false`: uma composição que **entra** tem de
       * vir de fora do quadro, senão ela simplesmente aparece no lugar e a
       * troca não parece uma troca. O `AnimatePresence` com `initial={false}` é
       * o que impede isso na **primeira** renderização — na carga da página a
       * composição já nasce no centro, sem escorregar.
       */
      initial="entra"
      animate={papel}
      exit="sai"
      transition={{ duration: duracao / 1000, ease: CARROSSEL_EASE }}
    >
      {/*
        A arte, no recorte da janela. E é ela que o parallax move — e o
        movimento é local, então nas miniaturas ele encolhe junto com o quadro.
      */}
      <motion.div
        className="absolute will-change-transform"
        style={{
          left: opcao.art?.imageBox.x,
          top: opcao.art?.imageBox.y,
          width: opcao.art?.imageBox.w,
          height: opcao.art?.imageBox.h,
          x: parallax.x,
          y: parallax.y,
        }}
      >
        <Image
          src={opcao.art?.src ?? ""}
          alt=""
          fill
          className="object-cover"
          sizes="(min-width: 1920px) 1882px, 100vw"
          unoptimized
        />
      </motion.div>

      {/*
        O badge. Ele está **dentro** do quadro, e é por isso que acompanha a
        arte — não há nada para sincronizar, é a mesma árvore.

        E a opacidade dele é a do papel: na miniatura ele some, porque as
        prévias do Figma não têm badge.
      */}
      <motion.div
        className="sol-badge absolute flex items-center justify-center rounded-[100px] border-2 border-nu-brand bg-nu-bg-secondary px-[22px] py-[10px]"
        style={{ left: active.badgeBox.x, top: active.badgeBox.y }}
        variants={{
          centro: {
            opacity: 1,
            transition: { duration: 0.4, delay: chegada },
          },
          esquerda: { opacity: 0, transition: { duration: duracao / 1000 } },
          direita: { opacity: 0, transition: { duration: duracao / 1000 } },
          sai: { opacity: 0 },
          entra: { opacity: 0 },
        }}
      >
        {/*
          `leading-[1.2]`: o texto do Figma (`151:76`) tem 24 px de caixa para
          20 de fonte, e é essa altura que fecha o quadro em 48
          (2 + 10 + 24 + 10 + 2).
        */}
        <p className="font-display text-[20px] font-semibold leading-[1.2] whitespace-nowrap text-nu-brand">
          {active.badge}
        </p>
      </motion.div>

      {/*
        O painel de texto. A mesma história do badge: dentro do quadro, e com a
        entrada **atrasada até a arte chegar**.
      */}
      <motion.div
        className="sol-textbox absolute flex flex-col items-start gap-[64px] rounded-[42px] bg-nu-bg-secondary px-[42px] py-[32px]"
        style={{ left: active.textBox.x, top: active.textBox.y, width: active.textBox.w }}
        variants={{
          centro: {
            opacity: 1,
            y: 0,
            transition: { duration: DURATION.slow, delay: chegada, ease: EASE_OUT_EXPO },
          },
          esquerda: {
            opacity: 0,
            y: 0,
            transition: { duration: duracao / 1000, ease: CARROSSEL_EASE },
          },
          direita: {
            opacity: 0,
            y: 0,
            transition: { duration: duracao / 1000, ease: CARROSSEL_EASE },
          },
          sai: { opacity: 0, y: 0 },
          entra: { opacity: 0, y: 0 },
        }}
      >
        <p className="font-display text-[24px] font-bold leading-[1.21] whitespace-pre text-nu-brand">
          {active.title.map((linha) => (
            <span key={linha}>
              {linha}
              <br />
            </span>
          ))}
        </p>

        {/*
          O caret do Figma é um `CaretDown` girado −90°, que é um caret para a
          direita — e é o `CaretRight` do Phosphor, o mesmo que a Ecossystem usa
          no CTA dela.
        */}
        <a
          href="https://www.nubank.com.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-[10px] text-nu-brand transition-opacity hover:opacity-75"
        >
          <span className="font-display text-[16px] font-semibold leading-[1.25] whitespace-nowrap">
            {active.cta}
          </span>
          <CaretRight size={20} weight="regular" aria-hidden="true" />
        </a>
      </motion.div>
    </motion.div>
  );
}
