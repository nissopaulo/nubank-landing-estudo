"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { CreditCard } from "@/components/cards/CreditCard";
import { useCardTilt } from "@/components/cards/use-card-tilt";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { CtaLink } from "@/components/ui/CtaLink";
import { CARDS, type ShowcaseCard } from "@/lib/card-showcase";
import {
  CARD_FLIP,
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

/** Índices dos pilares cujo frame já está liberado, na ordem do seletor. */
function liberados() {
  return CARDS.map((c, i) => (c.showcase ? i : -1)).filter((i) => i >= 0);
}

/** O próximo liberado depois de `de`, em ciclo. `-1` se não houver par. */
function liberadoSeguinte(de: number) {
  const l = liberados();
  if (l.length < 2) return -1;
  return l[(l.indexOf(de) + 1) % l.length];
}

/** Meia-volta do cartão. A curva e o porquê estão em `CARD_FLIP`. */
const FLIP_DURATION = CARD_FLIP.duration;
const FLIP_EASE = CARD_FLIP.ease;

export function CardsSection() {
  /**
   * `par` é a dupla **montada**: o cartão da frente e o do verso. Os dois ficam
   * no DOM o tempo todo, e a virada é o que revela um ou outro.
   *
   * Com um único frame liberado não há verso: `verso` fica `-1`, o `CreditCard`
   * daquele lado devolve `null`, e a pílula correspondente é desabilitada. Não é
   * um estado previsto — é o que segura a seção de pé até o segundo frame
   * existir, que é o mesmo mecanismo dos pilares do Ecossystem.
   */
  const [par, setPar] = useState<{ frente: number; verso: number }>(() => {
    const l = liberados();
    return { frente: l[0], verso: liberadoSeguinte(l[0]) };
  });
  /*
   * O ângulo **acumula** e nunca volta a zero, e isso é o que elimina a
   * dessincronização entre a peça e o par.
   *
   * Quem está visível é decidido pelo ângulo, não pelo `par`:
   *
   * | ângulo | visível   |
   * |--------|-----------|
   * | 0°     | frente    |
   * | 180°   | verso     |
   * | 360°   | frente    |
   * | 540°   | verso     |
   *
   * Como a visibilidade é **derivada** do ângulo, não existe nada para
   * sincronizar. A versão anterior zerava o ângulo no fim do giro e trocava o par
   * junto — e foi ela que mostrou o cartão errado numa troca Nubank → Croma: o
   * título virava "Cartão Croma" e o cartão na tela era o Nubank. Para o par
   * valer no momento certo os dois precisavam cair no mesmo commit, com o
   * `transform` de 180° para 0° sem transição (`data-travado`). Não há mais o
   * que sincronizar: o ângulo só cresce e a conta do que se vê é feita dele.
   *
   * `virando` sobrou só como trava de reentrância — ignora clique durante o giro.
   */
  const [virando, setVirando] = useState(false);
  const [angulo, setAngulo] = useState(0);
  const mostrarMovimento = usePrefersReducedMotion();

  /*
   * A paleta, as pílulas, o título, a descrição e o CTA vêm do cartão
   * **visível** — e o visível sai do ângulo, não do que está na frente.
   *
   * A troca na UI é imediata, no clique: é isso que mantém o painel
   * (`tabpanel`) honesto para o leitor de tela, que não pode ficar 300ms
   * mostrando o cartão anterior. E a paleta acompanha na mesma hora, senão o
   * fundo lilás, o título roxo e a pílula do Nubank ficariam marcados durante
   * o giro todo, com o cartão do Croma já visível na tela.
   *
   * O `??` cobre o estado em que não há verso — `par.verso` é `-1` com um só
   * frame liberado —, onde o visível é a frente mesmo.
   */
  const mostrandoFrente = angulo % 360 === 0;
  const ativo = mostrandoFrente ? par.frente : par.verso;
  const visivel = CARDS[ativo] ?? CARDS[par.frente];

  /*
   * Em repouso, a face que não está de frente sai da pintura.
   *
   * Redundante com o `backface-visibility: hidden` do CSS, e é deliberado: só o
   * CSS **não cull** a face de trás em pelo menos um motor, e o sintoma é o
   * cartão de trás aparecendo ao lado do da frente num ângulo levemente
   * diferente. Ver o comentário no JSX.
   *
   * Durante o giro as duas pintam — a passagem de uma para a outra é aos 90° e é
   * por ângulo, que é o que o `backface-visibility` faz certo.
   */
  const ocultaFrente = !virando && !mostrandoFrente;
  const ocultaVerso = !virando && mostrandoFrente;

  // O ponteiro é escutado na seção inteira, e não no cartão — é o que faz a
  // interação parecer com a seção e não com uma caixa de 252px no meio dela.
  const tilt = useCardTilt();

  function select(index: number) {
    if (virando || index === ativo) return;

    // Já está na dupla montada: meia-volta e pronto.
    if (index === par.frente || index === par.verso) {
      meiaVolta();
      return;
    }

    /*
     * Não está. Só o slot **escondido** pode mudar, e só ele: mudar o que está
     * visível apareceria na hora, antes do giro.
     *
     * Quando a frente é quem se vê, o escondido é o verso; quando é o verso,
     * é a frente. Trocar o escondido não aparece — ele está de costas, e
     * `backface-visibility: hidden` some com ele. Por isso o `requestAnimationFrame`:
     * o slot novo precisa estar montado antes de o ângulo mudar, senão o primeiro
     * quadro da virada já mostra o cartão errado girando.
     */
    if (mostrandoFrente) {
      setPar((p) => ({ frente: p.frente, verso: index }));
    } else {
      setPar((p) => ({ frente: index, verso: p.verso }));
    }
    requestAnimationFrame(meiaVolta);
  }

  /**
   * Mais meia-volta.
   *
   * Sem `prefers-reduced-motion`, é um `transition` CSS e o fim vem no
   * `transitionend`. Com ele, a peça salta de uma vez e **não existe
   * `transitionend`**: a regra global corta a transition para 0.01ms, o navegador
   * nem chega a gerar transição, e a seção ficava travada no primeiro clique —
   * ângulo em 0, pílula parada, nada mais respondendo. Por isso o caminho
   * reduzido é síncrono e não passa por evento nenhum.
   */
  function meiaVolta() {
    if (!mostrarMovimento) setVirando(true);
    setAngulo((a) => a + 180);
  }

  function fecharVirada() {
    setVirando(false);
  }

  return (
    <section
      id="cartoes"
      aria-label="Cartões"
      className="flex flex-col items-center gap-[100px] px-[200px] py-[100px]"
      style={{ backgroundImage: visivel.chrome.background }}
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
        {/*
          A paleta das pílulas vem do pilar **ativo**, e não do pilar de cada
          pílula. É o que o Figma mostra: no frame do Nubank as quatro pílulas
          usam `#820ad1`, e no do Croma as quatro usam `#8f7f64` — a paleta do
          frame, não a de cada um.

          A diferença é observável: com a paleta por pílula, a pílula do Croma
          ficava `#8f7f64` sobre o fundo lilás do Nubank, e a mediava em 2,38:1.
          Não é um estado que o Figma jamais mostra, e por isso não é um estado
          que a seção pode ter.
        */}
        <div
          role="tablist"
          aria-label="Escolher o cartão"
          aria-orientation="horizontal"
          className="flex items-start gap-[24px]"
          style={
            {
              "--cc-pill-on-bg": visivel.chrome.pill.onBg,
              "--cc-pill-on-ink": visivel.chrome.pill.onBgInk,
              "--cc-pill-idle-ink": visivel.chrome.pill.idleInk,
              "--cc-pill-idle-border": visivel.chrome.pill.idleBorder,
            } as React.CSSProperties
          }
        >
          {CARDS.map((item, index) => (
            <motion.div key={item.id} variants={revealUp}>
              <CardTab
                card={item}
                selected={index === ativo}
                onSelect={() => select(index)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div
        role="tabpanel"
        id={`cartoes-painel-${visivel.id}`}
        aria-labelledby={`cartoes-aba-${visivel.id}`}
        className="flex w-full flex-1 flex-col items-center justify-center gap-[64px]"
      >
        {/*
          A virada é de UM cartão só, girando — e as costas dele já são o cartão
          seguinte. É decisão de arquétipo, e é o que foi pedido: com dois cartões
          se cruzando por 90° lê-se "um cartão sai e outro entra"; com um só
          girando 180° lê-se "virou o cartão", que é o gesto de um cartão de
          verdade.

          Por isso os dois `.cc-face` ficam **sempre montados**, um como frente e
          outro como verso, e o `AnimatePresence` saiu daqui. Isso também mata o
          bug da interação: ela vinha de uma ref que o `AnimatePresence` zerava
          quando o cartão antigo saía de cena. Sem remontagem, não há saída de
          cena.

          E é por isso que o conteúdo **dentro** de cada face continua trocando
          por `AnimatePresence`, num container à parte: nome, texto e foto mudam
          no meio do giro, sem remontar a peça que gira.

          A entrada é `revealScale`, e não o `revealUp` das pílulas: o cartão é
          o centro da seção, e escala é o que dá a sensação de objeto sendo posto
          no lugar em vez de texto subindo.
        */}
        <motion.div
          className="cc-stage"
          style={{ perspective: 1400 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={revealScale}
        >
          <motion.div
            className="cc-flip"
            style={{
              rotateY: angulo,
              "--cc-flip-duration": `${FLIP_DURATION}s`,
              "--cc-flip-ease": FLIP_EASE,
            } as React.CSSProperties}
            onTransitionEnd={(e) => {
              // `onTransitionEnd`, e **não** `onAnimationComplete`: a peça gira
              // por transition CSS (ver `.cc-flip` no `globals.css`), e o
              // `onAnimationComplete` do Motion só dispara para animação que ele
              // próprio gerencia.
              //
              // Só a transição do `transform` dispara, e não qualquer uma: o
              // `box-shadow` do cartão também transiciona no hover, e fecharia a
              // virada no meio da sombra. E só o próprio elemento conta — as
              // faces também transicionam o próprio `transform`.
              if (e.target !== e.currentTarget) return;
              if (e.propertyName !== "transform") return;
              fecharVirada();
            }}
          >
            {/*
              A face que **não** está de frente fica `visibility: hidden` quando
              a peça está parada — e isso é redundante com o
              `backface-visibility: hidden` do CSS, de propósito.

              O `backface-visibility` sozinho **não é suficiente** e a falha é
              visível: em pelo menos um motor ele não cull a face de trás, e o
              Croma aparece com o cartão do Nubank aparecendo atrás, num ângulo
              ligeiramente diferente. O ângulo é o do `rotateY(180°)` do pai
              combinado com a inclinação: `R_y(180)·R_x(θ)` espelha o eixo X, então
              a face de trás aparece com a inclinação invertida — e é exatamente
              o deslocamento da imagem do usuário.

              `visibility: hidden` não depende do motor acertar a conta de 3D: em
              repouso só a face visível é pintada, ponto. E o custo é zero, porque
              a face escondida é a mesma que já estava sendo descartada.

              **Durante o giro as duas ficam pintadas**, porque a passagem de uma
              para a outra acontece aos 90° e é por ângulo — aí o
              `backface-visibility` é a ferramenta certa, e nenhum motor erra
              durante 700ms de rotação.
            */}
            <div className="cc-card cc-card--frente" data-oculta={ocultaFrente || undefined}>
              <CreditCard card={CARDS[par.frente]} tilt={tilt.values} />
            </div>
            <div className="cc-card cc-card--verso" data-oculta={ocultaVerso || undefined}>
              <CreditCard card={CARDS[par.verso]} tilt={tilt.values} />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-[24px] text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={revealUp}
        >
          <h2 className="font-display text-[64px] font-bold leading-[1.22] text-nu-brand">
            {visivel.showcase?.title}
          </h2>
          <p
            className="font-display text-[16px] font-medium leading-[1.25]"
            style={{ color: visivel.showcase?.descInk }}
          >
            {visivel.showcase?.desc[0]}
            <br />
            {visivel.showcase?.desc[1]}
          </p>
        </motion.div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={visivel.id}
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
              {visivel.showcase?.cta}
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

