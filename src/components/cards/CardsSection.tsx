"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { CreditCard } from "@/components/cards/CreditCard";
import { useCardTilt } from "@/components/cards/use-card-tilt";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { CtaLink } from "@/components/ui/CtaLink";
import { PillTab } from "@/components/ui/PillTab";
import { CARDS, type ShowcaseCard } from "@/lib/card-showcase";
import {
  BG_SWAP,
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

/**
 * Cada metade da meia-volta. O giro completo são duas: 0,35s + 0,35s.
 * A curva e o porquê estão em `CARD_FLIP`.
 */
const FLIP_HALF = CARD_FLIP.half;
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

  /*
   * O pilar cuja paleta está **saindo**, enquanto a do que entra é lavada por
   * cima.
   *
   * Existe porque `background-image` não é animável, e a alternativa — uma
   * camada por paleta, com as duas sempre montadas — deixaria a seção pintando
   * dois gradientes o tempo todo e exigiria um estado por camada. Uma camada só
   * temporária é o custo menor, e some sozinha no `onAnimationComplete`.
   *
   * Ver `BG_SWAP` para o porquê de a seção segurar o fundo que SAI.
   */
  const [saindo, setSaindo] = useState<ShowcaseCard | null>(null);

  /** Metade da meia-volta em curso: 1 = indo a 90°, 2 = indo a 180°. */
  const [fase, setFase] = useState<1 | 2>(1);

  /** `true` quando, em repouso, quem está na tela é a face de verso. */
  const [virado, setVirado] = useState(false);

  /** O cartão que a UI mostra. Muda no clique, não no meio do giro. */
  const [alvo, setAlvo] = useState(par.frente);
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
  /*
   * Qual face está pintada.
   *
   * **Vem de `virado` e da fase, nunca do ângulo.** O `angulo` é o valor
   * **alvo** — no começo da primeira metade ele já vale 90°, com a peça ainda em
   * 0° — e ele não serve mesmo depois, porque é a geometria errada: o slot
   * pintado vira a cada **90°** do ângulo, mas o cartão só troca a cada
   * **180°**. Derivando dele, voltar do Croma para o Nubank acabava a segunda
   * metade pintando o slot velho, e o cartão aparecia **ao contrário**.
   *
   * A regra é a do gesto: na primeira metade pinta o slot que está na tela (a
   * peça ainda mostra o cartão de onde se está saindo, estreitando); na
   * segunda, o outro slot (o cartão de destino, alargando). Nos 90° as duas
   * estão de perfil e a largura projetada é zero, então a troca não aparece.
   *
   * Só uma face pinta por vez, e isso não é estética: é o que resolve o defeito
   * do Firefox. Ver "Só uma face pinta por vez".
   */
  const pintandoVerso = virando ? (fase === 1 ? virado : !virado) : virado;

  const visivel = CARDS[alvo] ?? CARDS[par.frente];

  // O ponteiro é escutado na seção inteira, e não no cartão — é o que faz a
  // interação parecer com a seção e não com uma caixa de 252px no meio dela.
  const tilt = useCardTilt();

  function select(index: number) {
    if (virando || index === alvo) return;

    /*
     * O destino vai para o slot **escondido** — o oposto de quem está pintado.
     *
     * "Escondido" é o que vai estar de frente **depois** da meia-volta, porque a
     * segunda metade pinta o outro slot. É essa a aritmética que faltava: a
     * versão anterior punha o destino no slot que já estava pintado, e indo do
     * Croma para o Nubank a segunda metade acabava mostrando o cartão velho
     * **ao contrário** — de costas, espelhado.
     *
     * Trocar o escondido não aparece: ele não está pintado. Por isso o
     * `requestAnimationFrame` — o slot novo precisa estar montado antes do
     * ângulo mudar, senão o primeiro quadro da virada já mostra o cartão errado
     * girando.
     */
    const noEscuro = virado ? par.frente !== index : par.verso !== index;

    if (noEscuro) {
      setPar((p) =>
        virado ? { frente: index, verso: p.verso } : { frente: p.frente, verso: index },
      );
      requestAnimationFrame(meiaVolta);
    } else {
      meiaVolta();
    }

    // A UI troca no clique, não no meio do giro — é o que mantém o `tabpanel`
    // honesto para o leitor de tela.
    setAlvo(index);
    /*
     * A camada do fundo **só existe sem movimento reduzido**, e não é
     * escolha de estilo: é que o `MotionConfig reducedMotion="user"` não cobre
     * esse caso.
     *
     * Medido: com `prefers-reduced-motion: reduce`, a camada fica **congelada em
     * `opacity: 0.007` e `scale(1.02)`** e o `onAnimationComplete` nunca
     * dispara — a camada não some nunca, e a seção fica mostrando a paleta
     * antiga para sempre. O Motion pula animação de *transform* sob movimento
     * reduzido, e pula deixando o valor inicial; a de `opacity` continua
     * rodando, e nenhuma das duas chega ao fim.
     *
     * Sem a camada a paleta troca na hora, que é o que o usuário pediu ao
     * ativar a preferência.
     */
    if (!mostrarMovimento) setSaindo(visivel);
    if (!mostrarMovimento) setVirando(true);
  }

  /**
   * Primeira metade: a peça vai até 90°, ainda pintando a frente.
   *
   * A meia-volta são **duas** transitions de 90° em 90°, e não uma de 180°, por
   * causa do Firefox: ele não cull a face de costas e as duas ficam pintadas o
   * tempo todo. Ver "Só uma face pinta por vez".
   *
   * Nos 90° as duas estão de perfil, com a largura projetada em zero — então a
   * troca de qual delas está pintada é invisível. Esse é o motivo de a troca
   * existir aqui e não em qualquer outro ângulo.
   */
  function meiaVolta() {
    setFase(1);
    /*
     * Com movimento reduzido não há transition, e portanto não há
     * `transitionend` para a segunda metade: a peça ficaria parada em 90°, de
     * perfil, e o cartão da frente nunca apareceria. O caminho reduzido salta a
     * meia-volta inteira num commit só.
     */
    setAngulo((a) => a + (mostrarMovimento ? 180 : 90));

    /*
     * Com movimento reduzido não há as duas metades: o `angulo` já saltou os
     * 180° e não haverá `transitionend` para inverter `virado`. Inverter aqui é
     * o mesmo movimento lógico, só que síncrono.
     */
    if (mostrarMovimento) setVirado((v) => !v);
  }

  /**
   * Fim de cada metade.
   *
   * Fim da primeira → já estamos de perfil: troca a face pintada e dispara a
   * segunda metade, no mesmo commit. Fim da segunda → destrava.
   *
   * Com `prefers-reduced-motion` não há `transitionend`: a regra global corta a
   * transition para 0.01ms, o Firefox nem chega a gerar transição, e a seção
   * ficava travada no primeiro clique. O caminho reduzido é síncrono e não
   * passa por evento nenhum — daí `mostrarMovimento` não marcar `virando`.
   */
  function fecharVirada() {
    if (mostrarMovimento) return;
    if (fase === 1) {
      setFase(2);
      setAngulo((a) => a + 90);
      return;
    }
    setFase(1);
    // A segunda metade pintou o outro slot, então é ele o que fica na tela.
    setVirado((v) => !v);
    setVirando(false);
  }

  return (
    <section
      id="cartoes"
      aria-label="Cartões"
      /*
       * A superfície acompanha o frame visível: o gradiente da seção muda de
       * claro para escuro entre eles (o Ultravioleta é roxo até #2e1065), e é
       * contra ele que a banda do anel de foco precisa contrastar.
       */
      data-surface={visivel.chrome.surface}
      className="nu-gutter relative flex flex-col items-center gap-[100px] py-[100px]"
      style={{
        // Durante a virada a seção segura o fundo que está SAINDO, e a camada de
        // baixo é a que entra. Ver `BG_SWAP`.
        backgroundImage: (saindo ?? visivel).chrome.background,
      }}
      {...tilt.bind}
    >
      {/*
        A paleta que entra, lavada por cima.

        `pointer-events: none` porque é uma camada de fundo: sem isso ela
        interceptaria o `pointermove` da seção e a inclinação do cartão deixaria
        de responder na metade da área onde a transição acontece.

        `aria-hidden` porque é decoração — a mesma razão do cartão.

        A escala vem de `1.02` e assenta em `1`, e é ela que dá o movimento:
        opacidade sozinha é um dissolve liso e parado. Como a camada termina com
        `opacity: 1` e `scale: 1` exatamente sobre o fundo que a seção passa a
        assumir, a desmontagem no fim não aparece.
      */}
      {saindo ? (
        <motion.div
          aria-hidden="true"
          className="cc-bg-entra"
          style={{ backgroundImage: visivel.chrome.background }}
          initial={{ opacity: 0, scale: BG_SWAP.from }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: BG_SWAP.duration, ease: BG_SWAP.ease }}
          onAnimationComplete={() => setSaindo(null)}
        />
      ) : null}
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
              "--pill-on-bg": visivel.chrome.pill.onBg,
              "--pill-on-ink": visivel.chrome.pill.onBgInk,
              "--pill-idle-ink": visivel.chrome.pill.idleInk,
              "--pill-idle-border": visivel.chrome.pill.idleBorder,
            } as React.CSSProperties
          }
        >
          {CARDS.map((item, index) => (
            <motion.div key={item.id} variants={revealUp}>
              <PillTab
                label={item.label}
                selected={index === alvo}
                liberado={Boolean(item.showcase)}
                id={`cartoes-aba-${item.id}`}
                controls={`cartoes-painel-${item.id}`}
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
              "--cc-flip-duration": `${FLIP_HALF}s`,
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
              Só uma face pinta por vez, e a troca é feita aqui — pelo React, no
              commit — e não pelo motor.

              OFirefox **não cull** a face de costas. Medido com WebDriver BiDi
              no Firefox 158, durante a meia-volta:

              | momento  | ângulo | frente | verso |
              |----------|--------|--------|-------|
              | 261ms    | 26°    | visible| visible |  ← o verso devia estar de costas
              | 444ms    | 77°    | visible| visible |
              | 528ms    | 102°   | visible| visible |  ← a frente devia estar de costas
              | 828ms    | 179°   | visible| visible |

              E o sintoma é o Nubank aparecendo **atrás** do Croma na segunda
              metade do giro: ele está de costas, e `backface-visibility`
              deveria ter sumido com ele.

              `backface-visibility: hidden` continua no CSS das duas faces: no
              Chrome ele basta, e é ele que resolve a troca suave. A pintura é
              que passa a ser garantida por `visibility`, que não depende de o
              motor acertar a conta de 3D.

              Por que a troca é invisível: ela acontece nos **90°**, onde as duas
              faces estão de perfil e a largura projetada é zero. Medido no
              Firefox: a troca acontece com a largura em **9,4px**, e não
              aparece. Por isso a meia-volta são duas metades de 90° em 90° — a
              troca vem no `transitionend` da primeira, e o cartão que sai
              acelerando é o mesmo que estava entrando.
            */}
            <div className="cc-card cc-card--frente" data-oculta={pintandoVerso || undefined}>
              <CreditCard card={CARDS[par.frente]} tilt={tilt.values} />
            </div>
            <div className="cc-card cc-card--verso" data-oculta={!pintandoVerso || undefined}>
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
          {/*
            A tinta vem do `chrome` do pilar visível. Ela era `text-nu-brand`
            fixo no componente, o que está certo no Nubank e no Croma e **errado**
            no Ultravioleta — onde o Figma põe `Text/text-on-brand` (branco),
            porque o fundo é roxo escuro e o roxo da marca sumiria nele.
          */}
          <h2
            className="font-display text-nu-display font-bold leading-[1.22]"
            style={{ color: visivel.chrome.titleInk }}
          >
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

      {/*
        O reveal do CTA fica num wrapper **estável**, e não dentro do elemento
        que o `AnimatePresence` remonta a cada troca.

        Estava no lado de dentro, e por isso o CTA **re-desliava 24px para cima a
        cada clique** — `revealUp` é `y: 24 → 0`, e um elemento novo com
        `initial="hidden"` recomeça nele. Medido: o CTA em y = 968 no meio da
        troca, contra 948 no repouso.

        Com o wrapper fora, o reveal acontece uma vez, quando a seção chega na
        tela, e a troca de pilar faz só o *cross-fade* de opacidade — que é o que
        o `AnimatePresence` sabe fazer.
      */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={revealUp}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={visivel.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
          >
            {/*
              A variante é do frame visível. `brand` é o `Action/action-primary`
              do Nubank e do Croma; o Ultravioleta usa `Purple/950`, que é a
              única vez que a seção não vai na cor da marca.
            */}
            <CtaLink
              variant={visivel.showcase?.ctaVariant ?? "brand"}
              href="https://www.nubank.com.br/"
            >
              {visivel.showcase?.cta}
            </CtaLink>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}


