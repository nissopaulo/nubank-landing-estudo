# Nubank — Landing Page (estudo)

> **Projeto de estudo / portfólio. Não é um site oficial nem afiliado à
> Nubank.** Ver [Aviso legal](#aviso-legal).

Landing page de página única, reconstruída a partir de um design autoral feito
no Figma, com foco em movimento e hierarquia visual no espírito Apple.

- **Figma:** https://www.figma.com/design/16kp2jwaILwDfp44uYuNkP
- **Frame implementado:** `Hero Section` (node `14:446`, 1920×1080),
  `Ecossystem Section` (nós `52:3`–`80:77`, 1920×919), `Cards Section`
  (nós `97:2`–`103:383`, 1920×1086) e `Solutions Section - Safe`
  (nó `144:2`, 1920×1316)

---

## Stack

| | |
|---|---|
| Next.js 16.4 (App Router, Turbopack) | framework e build |
| React 19.3 | UI |
| TypeScript | tipagem |
| Tailwind CSS v4 | tokens de design + utilitários |
| Motion 14 | animação |
| Phosphor Icons 2.1 | ícones de interface |

**Tipografia:** apenas **Montserrat**, em todos os pesos. O arquivo do Figma
tinha `Inter` no subtítulo, mas era a única referência a Inter em todo o design.

**Ícones:** [Phosphor Icons](https://phosphoricons.com) (`CaretDown`,
`CaretRight`). O logo da marca continua sendo o SVG exportado do Figma.

Sem backend, sem banco, sem autenticação, sem analytics, sem serviços pagos.
A rota `/` é **estática** e prerenderizada.

---

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:3000
```

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção |
| `npm start` | serve o build de produção |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | checagem de tipos |
| `npx next typegen` | gera os tipos globais de rota (`LayoutProps`, etc.) |

Requer **Node.js 20.9+**.

---

## Estrutura

```
src/
  app/
    globals.css        tokens de design, utilitários e regras base
    layout.tsx         fontes, idioma (pt-BR), metadados, MotionProvider
    page.tsx           composição da página
  components/
    cards/
      CardsSection.tsx   seletor de pílulas + cartão, título e CTA (nó 97:2)
      CreditCard.tsx     o cartão de crédito e a inclinação sob o ponteiro
    ecosystem/
      EcosystemSection.tsx  carrossel de pilares, um aberto por vez
    hero/
      HeroSection.tsx  seção da Hero (node 14:446)
      CardsShowcase.tsx composição de cards: entrada, parallax, ponteiro
    solutions/
      SolutionsSection.tsx  seção de soluções (nó 144:2) e seu seletor
      use-background-parallax.ts  a arte de fundo seguindo o ponteiro
    site/
      SiteHeader.tsx   cabeçalho fixo, condensa ao rolar
      SiteFooter.tsx   rodapé + aviso legal + seções pendentes
      NoiseOverlay.tsx grão de textura sobre a página inteira
    ui/
      CtaLink.tsx      botão/link de CTA
      PillTab.tsx      pílula de seletor (Cards e Solutions Sections)
    motion-provider.tsx MotionConfig reducedMotion="user"
  lib/
    hero-cards.ts      geometria dos cards lida do Figma
    card-showcase.ts   cartões e conteúdo da Cards Section
    ecosystem-pillars.ts  pilares e conteúdo do card ativo
    solutions.ts       opções e geometria da Solutions Section
    motion.ts          durações, curvas e variantes compartilhadas
    use-prefers-reduced-motion.ts
public/images/
  brand/               logo e carets (SVG exportados do Figma)
  cards/               artes dos cartões da Hero (WebP)
  credit-card/         peças do cartão de crédito (SVG do Figma)
  peoples/             recorte de cada pilar (WebP, alfa)
  backgrounds/         artes da Solutions Section (WebP)
```

---

## Design tokens

### Quais arquivos o Tailwind varre — leia antes de citar uma classe

O `globals.css` abre com

```css
@import "tailwindcss" source(none);
@source "..";
```

Isso **não é boilerplate**. O Tailwind v4 detecta as fontes sozinho e varre o
projeto inteiro, **inclusive o Markdown** — então qualquer string com cara de
classe escrita nesta documentação vira uma regra de verdade no CSS.

Aconteceu. Ao registrar o mapeamento Figma → código, este arquivo e o
`CONTEXTO.md` citam a classe que o `get_design_context` devolve, e o Tailwind
leu aquilo como candidato:

```css
.text-\[color\:var\(--neutral\/800\,\#1c1c1e\)\] {
  color: var(--neutral/800,#1c1c1e);
}
```

`var(--neutral/800)` é **CSS inválido**: o nome de uma custom property é um
`<dashed-ident>` e `/` não é identificador. O Lightning CSS — que é o
transformador do Turbopack — rejeita com `Unexpected token Delim('/')`.

O detalhe que fez isso passar despercebido: **`next build` trata parse failure de
CSS como aviso e segue adiante**, então a Vercel fez deploy sem reclamar. **`next
dev` trata como erro fatal.** O mesmo código passa no CI e não abre local. Para
CSS, o teste é abrir o `next dev` — `tsc` e `eslint` não passam arquivo nenhum
por um transformador de CSS.

`@source ".."` resolve a partir do diretório do CSS, que é `src/app`, então
`..` é o `src/` da raiz. Só `src/` usa `className` (verificado). Se essa linha
for removida, citar uma classe de qualquer forma na documentação volta a derrubar
o build.

### Os tokens

Todos os valores vêm das **variáveis do Figma** (nós `14:446` e `52:3`) e estão
em `src/app/globals.css`:

| Token | Valor | Origem no Figma |
|---|---|---|
| `--color-nu-brand` | `#820ad1` | `Action/action-secondary-text`, `Text/text-brand` |
| `--color-nu-action-surface` | `#f3e8ff` | `Action/action-secondary` |
| `--color-nu-action-text` | `#ffffff` | `Action/action-primary-text` |
| `--color-nu-bg-primary` | `#ffffff` | `Background/bg-primary` |
| `--color-nu-bg-secondary` | `#f9fafb` | `Background/bg-secondary` (nó `144:2`) |
| `--color-nu-purple-950/800/600/400` | `#2e1065` `#6a08ad` `#9b2fe8` `#c084fc` | `Purple/*` |
| `--color-nu-neutral-100/200/300/400/800` | `#f3f4f6` `#e5e7eb` `#d1d5db` `#9ca3af` `#1c1c1e` | `Neutral/*` |
| `--color-nu-text-primary` | `#111111` | `Text/text-primary` |
| `--color-nu-text-tertiary` | `#6b7280` | `Text/text-tertiary` |
| `--color-nu-hero-stop-3` | `#d8b4fe` | lido direto do gradiente (não é token) |

Tipografia: **Montserrat** (variável), carregada com `next/font` e servida
localmente — nenhuma requisição ao Google.

### Ajuste no gradiente (única alteração de cor em relação ao Figma)

As quatro cores são exatamente as do design. O que mudou foram as **paradas**:

| | Figma | Aqui |
|---|---|---|
| Paradas | `0% / 25% / 75% / 100%` | `0% / 52% / 86% / 100%` |

**Motivo:** com as paradas originais, o gradiente clareava cedo demais e todo
texto de 16 px na metade inferior da Hero ficava abaixo de WCAG AA — o subtítulo
caía para 2,74:1 e o CTA "Explore o Universo Nu" para 2,32:1 (o mínimo é
4,5:1). Nenhuma cor clara conseguiria passar naquele ponto: o fundo já tinha
luminância alta demais. Adiar o clareamento mantém as quatro cores e o topo
idêntico, e resolve os dois textos.

O efeito visual é uma Hero mais saturada na faixa do texto, clareando mais
perto dos cards. Se preferir fidelidade máxima, volte as paradas em
`src/components/hero/HeroSection.tsx` e aceite as duas falhas de contraste.

### Fidelidade medida contra o Figma

| Elemento | Figma | Implementado |
|---|---|---|
| Logo | x 200 · y 29.5 · 64×35 | idem |
| Título — topo | y 224 | y 224 |
| Título — altura | 234 (2 linhas) | 234,22 |
| Título — corpo/linha | 96 px / 117 | 96 px / 117,12 |
| Subtítulo | y 482 · alt. 19 | y 482,22 · alt. 19,19 |
| Largura do subtítulo | 798 (Inter) | 835,8 (Montserrat — fonte pedida no projeto) |
| CTA primário | x 200 · y 565 | x 200 · y 565,41 |
| Card `business` | x 342,28 · y 842,24 · 659,62×696,95 | x 342,27 · y 842,23 · 659,61×696,94 |
| Card `croma` | x 597,37 · y 693,43 · 519,06×671,22 | x 597,37 · y 693,43 · 519,05×671,20 |
| Card `roxo` | x 738,84 · y 705,61 · 616,58×699,76 | x 738,84 · y 705,61 · 616,58×699,75 |
| Card `ultraviolet` | x 892,53 · y 814,86 · 696,95×659,62 | x 892,53 · y 814,86 · 696,94×659,59 |
| Arte do card | 373,631 × 592,656 | 373,69 × 592,64 |

---

## Como a composição de cards funciona

No Figma, o wrapper `cards` usa `display: contents`, então as coordenadas dos
cartões são relativas à **Hero**, não ao wrapper. Cada cartão é a *bounding box
já rotacionada* — por isso a caixa é maior que a arte.

Em `lib/hero-cards.ts` isso vira custom properties:

```css
.card-slot { left: var(--card-cx); top: var(--card-cy); width: var(--card-w); aspect-ratio: var(--card-aspect); }
```

- `cx`/`cy`/`w` em **`cqw`** (1% da largura da Hero) — escalam com a viewport.
- A **altura** vem do `aspect-ratio`, nunca de pixel fixo — por isso a
  composição não distorce em telas com proporção diferente de 16:9.
- A arte usa `height: <fração>%`: a caixa já está rotacionada, então a fração
  é `<altura da arte> / <altura da bbox>`.

### Sombra dos cards

Os valores vêm do style do card no Figma (`nu-card-croma`), lidos direto:

```css
.card-shadow {
  box-shadow: -8.226px 10.968px 18.281px 0 rgb(0 0 0 / 0.1);
}
```

- **Na `<img>`, não no `.card-art`.** A caixa do `.card-art` é a do *slot*, que
  é maior que a arte do card (o slot tem o bounding box já rotacionado) — uma
  sombra naquele tamanho apareceria errada em volta do cartão. A `<img>` tem
  exatamente o retângulo da arte: a largura sai da proporção intrínseca do WebP
  e a altura vem do `artHeightPct`.
- **`box-shadow` em vez de `drop-shadow`.** O `drop-shadow` segue o canal alfa,
  que aqui é o do arredondamento de `15.461px` gravado na arte. A diferença é
  desprezível: a sombra do design é deslocada 8px na horizontal, 11px na
  vertical e borrada em 18px, então os cantos da sombra ficam longe o bastante da
  arte para o arredondamento não aparecer.
- **O deslocamento acompanha o card.** A rotação está no `.card-art`, e a sombra
  da `<img>` sai girada junto, como no design.

> **Esta parte custou quatro commits e um equívoco meu.** Eu venho afirmando que
> o Figma *não* tem sombra nos cards — está errado, tem, e é essa. Tive quatro
> tentativas de intuir o valor (chute de "bem de leve", depois calibração por
> régua, depois duas camadas de `drop-shadow`) e errei em todas, porque estava
> **calibrando por intuição um valor que estava à mão o tempo todo**. Quando um
> valor existe no design, ele se lê no design.
>
> A segunda lição: antes de calibrar, confirmar que o efeito **aplica** — um
> `drop-shadow(0 0 25px red)` na página real prova isso em um build. Sem isso eu
> ajustava número sobre número sem saber se o problema era intensidade ou
> mecanismo.

### Mobile

O Figma só define 1920×1080. Abaixo de 1024 px, os quatro cartões com as
rotações originais ficam sobrepostos e ilegíveis, então `globals.css` troca
para dois cartões maiores e mais baixos. **Essa composição mobile é uma decisão
de layout, não um valor do design** — ajuste em `globals.css` à vontade.

---

## Ecossystem Section

Figma `Ecossystem Section - Nubank` (nó `52:3`), `Ecossystem Section - Croma`
(nó `76:3`), `Ecossystem Section - Ultraviolet` (nó `77:40`) e `Ecossystem Section -
Business` (nó `80:77`), todos 1920×919. Carrossel de pilares: um aberto por vez, o
resto recolhido com o nome lido de baixo para cima. Clicar num pilar recolhido abre.

### Quatro slots fixos, não "um ativo e três botões"

A decisão de arquitetura vem do design, não de preferência. **Os quatro cards
existem sempre, na mesma ordem, e um deles é o ativo** — e no frame do Croma o
ativo é o *segundo* da lista, com o Nubank recolhido no primeiro. Um modelo de
"um card ativo mais três botões" não teria como representar isso: trocar de pilar
desmontaria a linha inteira em vez de rebalanceá-la.

Com quatro slots a animação é só o rebalanceamento, e a conta fecha em qualquer
estado:

```
ativo  calc(100% - 357px)  +  3 × 107 recolhidos  +  3 × 12 de gap  =  1520px
```

1520 é a largura do `Main Content`, seja qual for o slot que estiver ativo.

### Os quatro pilares desenhados

| Pilar | Frame | Slot | Gradiente | Tinta |
|---|---|---|---|---|
| Nubank | `52:3` | 1 | radial roxo, 3 paradas | branco |
| Croma | `76:3` | 2 | linear creme | `Text/text-brand` |
| Ultravioleta | `77:40` | 3 | radial roxo, 5 paradas | branco |
| Empresas | `80:77` | 4 | radial cinza, 2 paradas | `Text/text-brand` |

**Nenhum `PROVISÓRIO` sobra aqui**, e nenhum card está desativado: os quatro
abrem. A regra do bloco `active` ausente continua no código porque é ela que
impede a próxima adição de virar conteúdo inventado por omissão — não porque
exista um caso agora.

**O ativo não fica sempre no mesmo slot**, e é por isso que os quatro cards são
fixos. O Figma mostra um por frame — primeiro, segundo, terceiro, quarto — cada
um com os anteriores recolhidos à esquerda. Trocar de pilar reequilibra a linha
inteira, e os dois extremos exercitam **direções opostas**: para o Nubank a
linha cresce para a direita, para o Empresas ela encolhe pela esquerda.

### O gradiente do card ativo vai como SVG, não como CSS

O `radialGradient` do Figma vem com `gradientTransform` em `matrix(...)`, que o
CSS não consegue expressar: ele achata a elipse e ainda a gira. A alternativa
era um `radial-gradient(62% 187% at 60.55% 52%, ...)`, que parece equivalente e
não é — sem a rotação de ~25°, o terço direito do card clareia e o gradiente
perde o peso que tem no design. Por isso o export vai como **data URI**, que é
literalmente o que o Figma produziu.

Um detalhe que custa caro: os `rgba()` do export **não podem virar hex**. Dentro
de `url("data:...")` um `#` não escapado é lido como fragmento de URL e trunca a
string no meio — o gradiente simplesmente não aparece, sem erro no console.

**`background-size` tem que ser explícito.** O SVG tem `viewBox` e não tem
`width`/`height`, e aí os motores discordam do que `auto` significa: o Chrome
estica até a caixa, o Firefox usa as dimensões do viewBox (1163×339) e **repete**.
No repouso as duas leituras dão o mesmo pixel, então o defeito só aparecia no
hover — quando o card vai a 1193px e sobram 30px, pintados com a borda esquerda
do gradiente, que é a parte mais escura dele. Era a listra que surgia no
Firefox. `background-size: 100% 100%` com `background-repeat: no-repeat` resolve,
e os dois motores passam a bater dentro de 2,4 níveis.

### Fidelidade medida nos quatro estados

Comparação entre o render do frame e o build de produção, ambos na grade de
1920×919. Medido em coordenadas do `Main Content`, que é como o Figma declara:

| | Nubank `52:3` | Croma `76:3` | Ultravioleta `77:40` | Empresas `80:77` |
|---|---|---|---|---|
| Card ativo — Figma | x 0 · 1163 | x 119 · 1163 | x 238 · 1163 | x 357 · 1163 |
| Card ativo — nosso | **x 0 · 1163** | **x 119 · 1163** | **x 238 · 1163** | **x 357 · 1163** |
| Recolhidos — nosso | 1175 · 1294 · 1413 | 0 · 1294 · 1413 | 0 · 119 · 1413 | 0 · 119 · 238 |
| Soma da linha | 1520 | 1520 | 1520 | 1520 |
| Pessoa — Figma | 210 · 1129×843 | 414 · 973×648 | 551 · 928×618 | 735 · 889×668 |
| Pessoa — nosso | **igual** | **igual** | **igual** | **igual** |

O `x 357` do Empresas é `3 × 119` do frame: três recolhidos de 107 e três gaps
de 12 antes dele. **Nenhum dos deltas é de 1px**, e a fórmula do `flex-basis`
fecha para qualquer slot sem caso especial — o que era a aposta da arquitetura
de quatro slots fixos, agora exercitada nas quatro posições.

**A geometria é medida no DOM** (`getBoundingClientRect`), não por cor de pixel.
Classificar o card pela cor parece melhor e não funciona: a página tem grão em
`opacity` fixo sobre tudo, então o branco de fundo fica entre ~215 e 255, e o
card recolhido é #e5e7eb = 229 — **dentro** dessa faixa. Duas versões de um script
de verificação mediram errado por isso antes de o DOM resolver a pergunta.

O gradiente do Ultravioleta foi conferido à parte, desligando o grão com
`--nu-grain-opacity: 0`: o erro residual contra o Figma passa a ser de **1 a 2
níveis em 290px de card, com inclinação de 0,0006 níveis por px**. Inclinação
praticamente nula é a assinatura de um offset uniforme — a textura autoral — e não
de um gradiente errado, que daria erro crescendo de uma ponta à outra.

A altura dos cards (339 px) **não é declarada no CSS**: ela sai da sobra do
`Main Content` (595 px − título − gap de 100 px), com a linha em `flex-1` e os
cards esticados por `items-stretch`. Se a fonte renderizar o meio pixel a mais,
o card encolhe junto em vez de estourar a seção.

Os 3,2 px de diferença no CTA vêm do ícone: o projeto usa Phosphor
(`CaretRight`) no lugar do SVG do Figma, e a avance width dos dois não é igual.

### A tinta dos cards recolhidos

O Figma põe **branco** sobre `Action/action-disabled` (`#e5e7eb`), o que dá
**1,24:1** — reprova até o mínimo de 3:1 de texto grande, e o rótulo tem 48 px.
A superfície continua exatamente a do design; só a tinta passa para
`Neutral/800` (`#1c1c1e`), e o contraste vai a **13,74:1**. A leitura de
"desabilitado" vem da superfície cinza, não da cor do texto.

### Onde cada cor de texto entra

Só **um** texto da seção usa `Text/text-tertiary`: o parágrafo ao lado do CTA
("O Nubank simplifica a maneira como você cuida do seu dinheiro…"). É o que o
Figma pede — variável `Text/text-tertiary`, nó `52:164` — e dá **4,83:1** sobre
o branco da seção.

**A tinta do card ativo é por pilar, e acompanha o fundo.** Não pode ser branco
por definição: o card do Nubank é roxo e o do Croma é creme, e a mesma tinta
funciona num e não no outro. O Figma resolve com `Background/bg-brand` (#820ad1)
no Croma, e é o que está implementado, como `--eco-ink` por card.

| Texto | Cor | Contraste |
|---|---|---|
| Título da seção | `Text/text-brand` `#820ad1` | 6,59:1 sobre branco |
| Nome no card ativo (Nubank) | branco | 5,95:1 no pior ponto do gradiente |
| Descrição no card ativo (Nubank) | branco | 5,95:1 |
| Nome no card ativo (Croma) | `Background/bg-brand` `#820ad1` | 4,98:1 sob o título |
| Descrição no card ativo (Croma) | `Background/bg-brand` `#820ad1` | **3,48:1** ⚠️ |
| Nome no card ativo (Ultravioleta) | branco | 6,04:1 no pior ponto do gradiente |
| Descrição no card ativo (Ultravioleta) | branco | **6,04:1** ✅ |
| Nome no card ativo (Empresas) | `Text/text-brand` `#820ad1` | 4,56:1 sob o título |
| Descrição no card ativo (Empresas) | `Text/text-brand` `#820ad1` | **4,56:1** ⚠️ |
| Parágrafo ao lado do CTA | `Text/text-tertiary` `#6b7280` | 4,83:1 |
| Rótulo do card recolhido | `Neutral/800` `#1c1c1e` | 13,74:1 sobre `#e5e7eb` |

**O tertiary não serve sobre o gradiente do card.** Ele chega a 1,23:1 no pior
ponto da área da descrição do Nubank, e 1,93:1 no melhor — nenhum canto passa.
Não é ajuste de tom: para chegar a 4,5:1 o texto precisaria de luminância ≈ 0,72,
um cinza visualmente indistinguível do branco. Houve uma tentativa de colocá-lo
ali por leitura equivocada do pedido, e foi revertida.

#### A descrição do Croma reprova AA em texto pequeno

Medido na faixa real da descrição (x 343..870), em linhas de fundo puro — entre
o título e a primeira linha, e abaixo da segunda — para o número não depender de
acertar uma amostra dentro de uma letra:

| Origem | Pior ponto | Onde |
|---|---|---|
| Nosso render | **3,48:1** | x 865, fundo `#beb39d` |
| Export do Figma | 3,32:1 | x 865, fundo `#baaf97` |

Os dois concordam dentro de 0,16:1 — a diferença é o grão, que escurece o fundo do
export. E a faixa é larga: **7,09:1** na borda esquerda da descrição caindo até
3,48:1 na ponta direita, porque o gradiente vai de `#eeece9` a `#8f7f64`.

Passa em texto grande (mínimo 3:1) e **reprova em texto pequeno**, que é o caso —
a descrição tem 16 px. Não é um ajuste de tom que resolva: para chegar a 4,5:1
sobre `#8f7f64` o texto precisaria ser bem mais claro que a própria marca, e a
mesma tinta passaria a falhar no lado claro do gradiente. É uma falha do design, e
a implementação segue o Figma. Se o Croma for para produção com texto pequeno,
o caminho é mudar o desenho — não a cor no código.

**O Ultravioleta é o oposto e não tem problema nenhum.** Mesmo branco, mesmo
tamanho de texto, e o pior ponto do card dá **6,04:1** — e a medida mais forte é
que **todo** o card passa: a parada mais clara do gradiente (#9b2fe8, offset 0)
dá 5,30:1, então o resultado não depende de onde o texto cai. É o gradiente com
cinco paradas que faz a diferença, e não a escolha de tinta.

### O CTA e a variante `brand`

`CtaLink` ganhou uma quarta variante, `brand`, que é **exatamente** o par e a
cadeia de interação do "Quero ser Nubank" da header no estado condensado:

```
bg-nu-brand text-white hover:bg-nu-purple-800 active:bg-nu-purple-950
```

O CTA "Conheça o Nubank" da Ecossystem usa essa variante, então os dois botões
são indistinguíveis — inclusive no hover e no active.

| Estado | Fundo | Contraste com o texto branco |
|---|---|---|
| repouso | `#820ad1` | 7,21:1 ✅ |
| hover | `Purple/800` `#6a08ad` | 9,33:1 ✅ |
| active | `Purple/950` `#2e1065` | 15,24:1 ✅ |

**Por que a variante existe.** O botão usava `variant="solid"` com um `style`
inline por cima, que fixava as cores de repouso mas **não** tocava no `hover` nem
no `active` — que continuavam vindo da `solid`. O texto claro sobre o branco do
hover e sobre o `Neutral/100` do active dava menos de 1,2:1: some.

**A duplicação com a header é intencional e precisa continuar em sincronia.** A
header escreve os mesmos valores em `group-data-[condensed]:`. Não dá para
extrair para uma constante compartilhada: o Tailwind só enxerga classes
escritas por extenso no fonte, então uma string montada por concatenação não
entraria no CSS gerado. É uma restrição da ferramenta.

### A pessoa

Recorte em WebP com alfa, posicionado em absoluto contra o `Main Content` nas
coordenadas do Figma, convertidas em fração da largura dele para escalarem sem
distorcer. A altura não é declarada: sai da proporção do próprio asset.

**A geometria é por pilar, porque o design não usa a mesma.** No Figma a pessoa
do Nubank é `left-210px w-1129px` e a do Croma é `left-414px w-973px` — e cada
caixa bate com a proporção do asset correspondente, o que confirma a leitura:

| Pilar | Caixa no Figma | Proporção da caixa | Asset |
|---|---|---|---|
| Nubank | 1129 × 843 | 1,33929 | 2400×1792 = 1,33929 |
| Croma | 973 × 648 | 1,50154 | 2400×1599 = 1,50094 |
| Ultravioleta | 928 × 618 | 1,50162 | 2400×1599 = 1,50094 |
| Empresas | 889 × 668,242 | 1,33036 | 2384×1792 = 1,33036 |

O `top` é 0 nos quatro, mas expressado de jeitos diferentes no Figma — o do
Nubank é filho do `Main Content`, os outros três são filhos do `Content` com
`top-[-256px]`, que desce exatamente o `gap` de 100 mais a altura do título.
Convertido para a mesma referência, os quatro são 0.

A janela de recorte é um `absolute inset-0 overflow-clip` **dentro** do
`Main Content`, e não o próprio `Main Content`. O motivo está na seção do hover
abaixo: a linha de cards preenche o `Main Content` inteiro, então o clip do
container comeria o crescimento. A caixa é a mesma, então o corte da figura
continua exatamente na borda inferior do card.

### A interação de hover

Card ativo e pilares recolhidos crescem **só na horizontal** sob o ponteiro, e o
vizinho sai do lugar junto. Medido contra o repouso, a 1920:

| | repouso | hover | |
|---|---|---|---|
| Card ativo | x 200 · 1163 de largura | x 200 · 1193 | +30 px, borda esquerda parada |
| Pilar 1 | x 1375 | x 1405 | empurrado +30 |
| Pilar 2 | x 1494 | x 1524 | empurrado +30 |
| Pilar 3 | x 1613 | x 1643 | empurrado +30 |
| Altura dos dois | 339 | 339 | não muda |

Sobre um pilar: ele vai de 107 para 121 de largura e empurra **os que vêm
depois** dele — o primeiro não se move.

**É propriedade de layout, e não `transform`.** `scale` redesenha o elemento sem
mexer no fluxo, então o card cresceria *por cima* do vizinho em vez de empurrá-lo
— que é justamente o efeito pedido. Aqui o flexbox recalcula a linha.

**O card ativo usa `flex-basis`, não `flex-grow`.** `flex-grow` reparte o espaço
livre *entre os itens que crescem*, e aqui ele é o único que cresce: os três
recolhidos são de largura fixa. Com `flex-grow` de 1 para 1,024 a largura não
mudava uma vírgula — foi testado e medido antes de trocar de propriedade.
`flex-basis: calc(100% - 357px)` resolve, com 357 = 3×107 dos recolhidos +
3×12 de gap, o que faz a linha ocupar a largura toda como no repouso.

**`justify-start` em vez do `justify-center` do Figma.** No repouso as duas são
idênticas — a linha preenche tudo, não há o que centralizar. No hover divergem,
e é aí que importa: com `center` o card cresceria dos dois lados e atravessaria
o alinhamento de 200 px da seção.

`:focus-visible` entra junto do `:hover` nos quatro cards, senão quem navega por
teclado fica sem o feedback.

### O cursor dos cards

`cursor: pointer` nos quatro. Parece detalhe e é uma correção real: medido no
navegador, `.eco-card` computava **`cursor: default`**, e o card cresce no hover
mesmo assim — então parecia texto, não botão.

A causa é o **UA stylesheet**: o Chrome põe `cursor: default` em `<button>`, e o
preflight do Tailwind v4 não desfaz — a única regra de cursor em todo o CSS
servido era a de `aria-disabled`. Então o efeito é de botão em vez de link, e por
isso `<button>` continua sendo o elemento certo aqui (`aria-expanded` e
acionamento por teclado de graça). **A correção é a regra, não trocar o
elemento.**

O `aria-disabled` troca para `not-allowed` com especificidade maior. Hoje não há
nenhum card assim, mas a regra do botão que não faz nada não pode depender de
existir um caso concreto — e é a mesma que os itens de navegação da header já
usam.

**Por que medir o valor computado, e não procurar a regra:** a regra pode existir
e perder para outra de especificidade maior, ou ser anulada por
`pointer-events` do ancestral. Só o valor que o navegador calcula responde, e é
ele que se compara com o esperado por atributo.

### A transição entre pilares

Clicar num pilar recolhido não troca um card por outro: a linha inteira se
reequilibra, porque o card que entra ocupa o slot dele e o que sai recolhe no
dele. É isso que a coreografia abaixo executa.

| O quê | Quando | Por quê |
|---|---|---|
| largura dos cards | 0 → 700 ms, os dois ao mesmo tempo | o rebalanceamento é um gesto só |
| gradiente | 0 → 520 ms | camada com `opacity`, não `background-image` |
| conteúdo sai | 0 → 220 ms | some cedo, para não atrapalhar o morph |
| conteúdo entra | 260 → 580 ms | atrasado de propósito |
| rótulo entra | 180 → 480 ms | idem, pelo outro lado |
| pessoa | 0 → 1500 ms, sobe de baixo | fecha o gesto por último |
| parágrafo e CTA | 260 ms + 260 ms, `mode="wait"` | saída antes da entrada, nunca os dois juntos |

**O conteúdo atrasa de propósito.** Se nome e descrição entrassem junto com a
largura, os dois textos ficariam sobrepostos no meio da transformação. As duas
camadas de conteúdo ficam sempre no DOM e trocam por `opacity`, o que faz a
virada ser uma transição de verdade em vez de uma remontagem — e o
`visibility` com atraso no fim do fade é o que tira a camada da pintura e da
árvore de acessibilidade sem cortar a opacidade pela metade.

**O gradiente é uma camada, não um `background-image` que troca.**
`background-image` não é interpolável, e o card está crescendo exatamente no
instante da virada: seria um corte seco. O card tem sempre o cinza no fundo e o
gradiente por cima, entrando por `opacity`.

**A curva é `--ease-emphasized`, e isso foi medido.** Com `ease-out-expo` a
transição ficava 93% concluída aos 180 ms e depois arrastava até 700 ms sem nada
acontecendo. A curva não é um detalhe: é ela que faz a duração declarada
significar alguma coisa. Ver `EASE_EMPHASIZED` no `lib/motion.ts`.

**A pessoa é aquecida no hover.** O `src` só é trocado no clique, então em rede
fria o navegador começaria a decodificar no mesmo quadro em que a animação
parte — um quadro em branco no meio da subida. `pointerenter` e `focus` pedem o
download antes, o que não custa nada a quem não vai clicar e não carrega as
quatro imagens para a maioria que nunca troca de pilar.

### Medido por CDP

`chrome --screenshot` fotografa no load e não interage, então a transição foi
medida dirigindo o Chrome pelo DevTools Protocol: navegar, `click()` de verdade
no segundo card, e ler a cada ~100 ms.

```
antes      larg 1163 / 107 / 107 / 107   pessoa nubank 843px  no lugar
+134 ms    o card que entrou está a  62%
+586 ms    card a 100%                   pessoa a  91%
+1005 ms                              pessoa a  98%
+1687 ms                              pessoa a 100%
depois     larg 107 / 1163 / 107 / 107   pessoa croma  648px  no lugar
```

O quadro dos 141 ms mostra o estado intermediário real: os dois cards no meio do
morph, os dois gradientes em crossfade, a pessoa subindo de baixo e recortada pela
janela, e o parágrafo antigo ainda saindo. Sem texto duplicado em nenhum momento.

### assets: PNG → WebP

Os quatro recortes vieram em PNG e foram convertidos com o `sharp` (quality 86,
alfa preservado). O do Nubank foi depois **substituído por um upscale 2×**,
reexportado do Figma pelo autor:

| Arquivo | Dimensões | Origem | WebP | |
|---|---|---|---|---|
| `nubank-people` | **2400×1792** | upscale 2× | 197,1 KB | |
| `croma-people` | 2400×1599 | 1.917,4 KB | 152,0 KB | −92,1% |
| `ultraviolet-people` | 2400×1599 | 1.821,4 KB | 134,8 KB | −92,6% |
| `business-people` | 2384×1792 | 1.993,1 KB | 156,5 KB | −92,2% |

O upscale do Nubank importa: a versão anterior tinha 1200×896, ou seja **1,06×**
da largura de exibição (1129px a 1920) — o navegador já estava esticando, e em
tela de alta densidade isso aparecia como softness. Com 2400×1792 são 2,1×, e a
proporção é idêntica (1,33929), então nenhum valor de layout mudou.

Para regerar:

```bash
node -e "const s=require('sharp');const f=require('fs');\
for(const n of f.readdirSync('public/images/peoples').filter(x=>x.endsWith('.png')))\
s('public/images/peoples/'+n).webp({quality:86,alphaQuality:100,effort:6})\
.toFile('public/images/peoples/'+n.replace(/\.png$/,'.webp'))"
```

Os PNGs de origem foram removidos do repositório depois da conversão (mesmo
procedimento das artes dos cartões). Todos são reexportáveis do Figma.

---

## Cards Section

Figma `Cards Section` — **os quatro frames liberados**: `97:2` (Nubank),
`103:248` (Croma), `103:318` (Ultravioleta) e `103:383` (Empresas), todos
1920×1086. A seção está completa: nenhuma pílula fica `aria-disabled`, e as
quatro trocam de verdade. Um seletor de pílulas
(Nubank · Croma · Ultravioleta · Empresas), o cartão de crédito, o nome, a
descrição e o CTA. **Só o frame do Nubank está liberado**: os outros três
existem no arquivo (nós `103:248`, `103:318` e `103:383`) e estão ocultos, e o
trabalho é feito um frame por vez.

### Cada frame diverge, e nenhuma divergência é estilo

Os quatro frames são **quatro árvores diferentes** no Figma, e a lista abaixo é o
resumo do que muda entre elas. Nenhum item aqui é escolha de implementação:

| | Nubank `97:2` | Croma `103:248` | Ultravioleta `103:318` | Empresas `103:383` |
|---|---|---|---|---|
| layout | `stack` | `rotated` | `stack` | `stack` |
| eixo principal | `space-between` | `space-between` | **`flex-end`** | `space-between` |
| logo de rede | sim | sim | **não** | sim |
| nome | no fluxo | girado 90° | **absoluto, com gradiente** | no fluxo |
| rótulo no pé | não | não | não | **"business"** |
| fundo da seção | 8 paradas, roxo | 5 paradas, creme | 5 paradas, roxo | **2 paradas, branco** |
| pílula ativa | `#820ad1` | `#eeece9` | **`#2e1065`** | `#820ad1` |
| pílula inativa | `#820ad1` | **`#8f7f64`** | **branco** | `#820ad1` |
| título | `#820ad1` | `#820ad1` | **branco** | `#820ad1` |
| nome no cartão | `PAULO VINICIUS` | `PAULO VINICIUS` | **`Paulo Vinicius`** | `Paulo Vinicius` |
| CTA | `action-primary` | idem | **`Purple/950`** | `action-primary` |

Sete campos novos no total, e **nenhum é abstração**: `holderBox`,
`holderGradient`, `network` opcional, `rowLabel`/`rowLabelInk`, `titleInk` no
`chrome` e `ctaVariant`. O eixo principal entra pelo mesmo atributo do
`holderBox` porque no Figma os dois fatos vêm juntos no nó `103:363`.

**O vão de cima do Ultravioleta fica vazio**, e é assim que o design mostra: não
tem logo de rede. Inventar uma seria conteúdo que o Figma não tem.

**O rótulo do pé não herda a tinta do cartão.** No Business a `ink` do cartão é
`Text/text-primary` (#111) porque o cartão é claro, e o rótulo é
`Text/text-brand` (#820ad1). Herdar dava cinza-escuro no lugar do roxo — que foi
o que aconteceu na primeira versão, e é a razão de `rowLabelInk` existir.

**O nome em gradiente** (`background-clip: text`) é o do Ultravioleta, e é o único
gradiente de **texto** da seção. Precisa de `color: transparent` junto — sem ele o
gradiente fica atrás do texto e não aparece.

### O Ultravioleta diverge em cinco pontos, e quatro viraram campo

O terceiro frame (`103:318`) é o primeiro que **não** segue o padrão dos dois
primeiros. Nada aqui é estilo: são os cinco pontos em que a árvore do Figma é
diferente, e a lista é curta porque o resto do componente já estava certo.

| | Nubank `97:2` | Croma `103:248` | Ultravioleta `103:318` |
|---|---|---|---|
| layout | `stack` | `rotated` | `stack` |
| eixo principal | `space-between` | `space-between` | **`flex-end`** |
| logo de rede | sim | sim | **não** |
| nome | no fluxo | girado 90° | **absoluto, com gradiente** |
| pílula ativa | `#820ad1` | `#eeece9` | **`#2e1065`** |
| título | `#820ad1` | `#820ad1` | **branco** |
| CTA | `Action/action-primary` | idem | **`Purple/950`** |

Os quatro últimos viraram campo (`holderBox`, `holderGradient`, `network`
opcional, `titleInk` no `chrome`, `ctaVariant`). O primeiro — o eixo principal
— é CSS, e entra pelo mesmo atributo do `holderBox` porque no Figma os dois fatos
vêm juntos no nó `103:363`.

**O vão de cima do Ultravioleta fica vazio**, e é assim que o design mostra: não
tem logo de rede. Inventar uma seria conteúdo que o Figma não tem.

**O nome é gradiente** (`background-clip: text` em `Neutral/400` →
`Neutral/100`), e é o único gradiente de **texto** da seção. Precisa de
`color: transparent` junto — sem ele o gradiente fica atrás do texto e não
aparece, o mesmo modo de falha do reflexo.

### A paleta da seção também vira, e `background-image` não dá para isso

Trocar de pilar trocava o fundo de uma vez. `background-image` **não é animável**:
`transition: background-image` no CSS não dá erro nenhum e não acontece nada — o
mesmo modo de falha do reflexo e do texto em gradiente.

A saída são duas camadas empilhadas. Durante a virada, o `background-image` da
`<section>` é o do pilar que está **saindo**, e uma `<div>` por cima é a do que
está **entrando**; no fim a seção assume o novo e a camada é desmontada.

**Qual camada carrega o quê é o que a torna invisível.** No instante da desmontagem
a camada de cima já está com `opacity: 1` e `scale: 1`, exatamente sobre o que
passa a ser o fundo. Se fosse o inverso, haveria um quadro em que as duas estão a
50% e o fundo pisca no meio.

A **escala** é o que dá o movimento: opacidade sozinha é um *dissolve*, liso e
parado. A camada que entra vem de `1.02` e assenta em `1` — a paleta nova
**chega** em vez de aparecer, e o gesto da meia-volta, que gira para fora, continua
para dentro. Medido na virada Nubank → Croma:

| momento | opacidade | escala |
|---------|-----------|--------|
| logo após o clique | 0 | 1,020 |
| +90ms | 0,414 | — |
| +180ms | 0,827 | — |
| +450ms | 0,987 | — |
| +630ms | 1 | — |
| último quadro | 1 | **1,000** |
| +720ms | *(camada desmontada)* | — |

A duração é `DURATION.base`, que é exatamente `2 × CARD_FLIP.half` — o que a
meia-volta inteira leva. É o que faz o cartão e a paleta chegarem **juntos**.

Dois detalhes que custaram:

- `pointer-events: none` na camada. Sem isso ela intercepta o `pointermove` da
  seção e a inclinação do cartão morre na área onde a transição acontece —
  verificado com `elementFromPoint` e com a inclinação ainda viva a 320ms da
  virada.
#### E a camada não pode ser uma filha como as outras

A primeira versão resolveu a ordem de pintura com `#cartoes > * { position:
relative; z-index: 1 }` — e foi um desastre: a regra casa **também** com a
camada, porque ela é filha direta da seção, e `#cartoes > *` tem especificidade de
**ID**, que ganha do `.cc-bg-entra`. A camada perdeu o `position: absolute`, saiu
do fluxo e virou item do flex da coluna: **todo o conteúdo desceu 200px** (a
altura da camada mais o `gap`), a seção ficou inutilizável, e nada acusou erro.

A correção inverte a estratégia: a camada é `z-index: -1` e a seção cria contexto
de empilhamento com `isolation: isolate`. Assim ela pinta acima do fundo da seção e
abaixo de todo o conteúdo **sem nenhuma regra nos filhos** — e não há regra cega
para errar de novo.

> **Nenhuma verificação de geometria pegaria isso**, porque as caixas de cada peça
> continuam certas: o que mudou foi a posição delas na seção. A verificação que
> pega mede a geometria *da seção* — altura, e a posição das pílulas, do cartão,
> do título e do CTA — e afirma que elas **não mudam durante a virada**.

A seção também precisa de `position: relative`, sem o que o `inset: 0` da
camada resolve contra a viewport e não contra a seção.

> **Com `prefers-reduced-motion` a camada não existe, e isso é corrigir um bug.**
> O `MotionConfig reducedMotion="user"` não cobre esse caso: medido, a camada
> ficava **congelada em `opacity: 0.007` e `scale(1.02)`**, o
> `onAnimationComplete` nunca disparava e a seção mostrava a paleta antiga para
> sempre. O Motion pula animação de *transform* sob movimento reduzido, e pula
> deixando o valor inicial; a de `opacity` continua rodando, e nenhuma das duas
> chega ao fim. Sem a camada, a paleta troca na hora — que é o que a preferência
> pede.

#### O CTA re-desliava a cada troca — e isso era antigo

O `revealUp` do CTA (`y: 24 → 0`) estava **dentro** do elemento que o
`AnimatePresence` remonta a cada troca de pilar. Um elemento novo com
`initial="hidden"` recomeça nele — então o CTA subia 24px a cada clique, por
cima do *cross-fade* de opacidade que o `AnimatePresence` já fazia. Medido: CTA em
y = 968 no meio da troca, contra 948 no repouso.

O reveal foi para um wrapper **estável** em volta do `AnimatePresence`: ele
acontece uma vez, quando a seção chega na tela, e a troca de pilar faz só o
*cross-fade*.

### O cartão é DOM, e não uma imagem exportada

O Figma compõe o cartão em camadas: fundo em gradiente, rede de cartões, nome,
marca `nu`, e um chip com duas peças. Exportá-lo como um PNG daria o cartão
perfeito e **mataria a interação** — não há como girar em 3D nem fazer um
reflexo seguir o ponteiro, porque não haveria nada para transformar. Então ele é
montado em DOM, com os quatro SVG do Figma como asset em
`/public/images/credit-card`. Nenhum `path` de SVG foi copiado para o código.

### A inclinação responde à seção inteira, com alcance

O primeiro corte escutava `pointermove` só no cartão, e o efeito ficava
concentrado numa caixa de 252×400 no meio de uma seção de 1920×1088: passar o
mouse pela seção não produzia nada.

Agora o handler está na `<section>` e a resposta é **direção × força**:

```
   dentro do cartão           fora do cartão
   ┌───────────────┐          ·························  força 1
   │   força 1     │          ··                  ··        │
   │               │          ··     força 0      ··        ↓  cai até 0
   └───────────────┘          ·························  força 0
         ↑ reach = 460px a partir da borda
```

A direção é normalizada contra a caixa do cartão e **saturada em ±1** — sem a
saturação, passar do canto levaria o cartão do ângulo máximo direto ao oposto.
A força morre 460 px depois da borda, e é ela que evita o cartão ficar travado no
ângulo máximo assim que o ponteiro sai da caixa: sem isso não parece reação,
parece defeito.

`rotateY = -x` e `rotateX = +y`. Em CSS, `rotateX(+θ)` traz a **base** para quem
olha e `rotateY(+θ)` traz a **esquerda**; o que se quer é o oposto nos dois, para
que a borda mais próxima do ponteiro avance. Com o sinal trocado o cartão afunda
na direção do mouse, que é o gesto de quem pressiona.

Medido no navegador, a 1920:

| Posição do ponteiro | `rotateY` | `rotateX` | Força |
|---|---|---|---|
| Canto superior direito do cartão | −11,04° | −8,55° | 1,000 |
| Canto inferior esquerdo do cartão | +10,85° | +8,60° | 1,000 |
| Centro do cartão | ~0° | ~0° | 1,000 |
| 150 px acima do cartão | ~0° | −6,07° | 0,674 |
| 400 px abaixo do cartão | ~0° | +1,25° | 0,139 |

Os dois últimos batem com `1 − distância/460`: `1 − 150/460 = 0,674` e
`1 − 400/460 = 0,130`. O cartão volta a `transform: none` quando o ponteiro sai
da seção.

**O reflexo é a mesma força.** A opacidade e a posição vêm de `useSpring`, então
reflexo e cartão se apagam juntos. Com `:hover` o brilho ficaria aceso com o
ponteiro a 900 px do cartão — que é a maior parte da seção.

### A sombra é desvio autoral

O Figma **não tem** sombra no cartão, e isso foi medido antes de adicionar: a
transição da borda é abrupta dos dois lados (fundo `236,223,246` a 3 px, cartão
`109,17,174` em 0 px, sem pixel intermediário) e o `get_design_context` não
devolve `boxShadow` no nó `98:150`. É decisão nossa, como a textura da página.

Duas camadas, pela mesma razão da sombra dos cards da Hero: difusão sozinha é
larga demais para marcar borda, e quem dá leitura de objeto é a de contato.

```css
box-shadow:
  0  2px  4px       rgb(46 16 101 / 0.16),   /* contato: define a borda */
  0 24px 56px −12px  rgb(46 16 101 / 0.32);  /* difusão: cria a altura  */
```

O tom é `Purple/950` e não preto: preto puro sobre o lilás do fundo deixa um halo
cinza que parece sujeira. No hover as duas camadas aprofundam, e é a única parte
do efeito que custa repaint — o steady state da inclinação é transform.

### A virada é de UM cartão só, e o ângulo só acumula

A troca de pílula **vira o cartão**, e não troca um cartão por outro. `.cc-flip`
gira 180° a cada vez; dentro dele, `.cc-card--frente` e `.cc-card--verso` ficam
**sempre montados**, com `backface-visibility: hidden`, e a virada é o que revela
um ou o outro. O `AnimatePresence` do cartão saiu — o conteúdo de dentro (nome,
texto, foto) continua trocando por `AnimatePresence`, num container à parte.

```
.cc-stage   perspectiva, tamanho fixo
└ .cc-flip      rotateY, transition CSS
  ├ .cc-card--frente
  └ .cc-card--verso   rotateY(180deg)
```

O ângulo **acumula** — 0, 180, 360, 540, 720 — e **quem está visível é derivado
dele**: frente nos múltiplos de 360, verso nos outros. Isso não é estilo, é o
que elimina uma classe de bug: a versão anterior zerava o ângulo no fim do giro
e trocava o par frente/verso junto, o que obrigava os dois a caírem no mesmo
commit para não dessincronizarem — e quando dessincronizaram, **o título virava
"Cartão Croma" com o cartão do Nubank na tela**. Sem reset, não há o que
dessincronizar.

#### A curva é própria, e `EASE_EMPHASIZED` estava errada aqui

`EASE_EMPHASIZED` é a curva de *entrada*. Em meia-volta ela é errada, e o erro é
mensurável — com a transição ancorada no `transitionrun`:

| momento | quanto do giro já foi feito |
|---------|---------------------------|
| 100ms   | 43%                      |
| 133ms   | 70%                      |
| 284ms   | 93%                      |
| 417ms   | 98%                      |
| 567ms   | 100%                     |

O cartão **passa de perfil (90°) aos 16% da duração**. A troca acontece ali, e
os ~500ms restantes arrastam nos últimos 7% do giro. Não é lento: é o
contrário — resolve o gesto em um quinto do tempo e depois finge que continua.

Os 90° importam porque a largura projetada é `w·|cos θ|`: zero a 90°, e é onde
frente e verso trocam de vez.

`CARD_FLIP` usa `cubic-bezier(0.75, 0.75, 0.8, 1)`, escolhido por busca em grade.
**Medido com ela:** giro de 667ms, **90° aos 317ms = 47%**, e
`12% → 22% → 32% → 43% → 54% → 65% → 76% → 87% → 96%`. Os últimos 7% do giro
caíram de **40% para 13%** da duração.

> **O conflito, e por que ele não tem solução melhor.** Com uma Bézier só,
> "responde no clique" e "troca no meio" puxam em direções opostas. Exigindo 90°
> entre 45% e 52%, pouso com `y₂ ≥ 0.85` e cauda até 95% da duração, o conjunto
> de soluções é **vazio**. O que se sacrifica é o arranque: `EASE_EMPHASIZED` tem
> 18% do giro aos 50ms, a curva nova tem 7% (≈12°, no terceiro quadro). É a
> escolha certa porque ~3 quadros de atraso não se veem, e 500ms de arrasto se veem.

#### Só uma face pinta por vez — o Firefox não cull a face de costas

Reportado: **no Firefox**, durante a virada, o cartão do Nubank aparecia atrás do
Croma. No Chrome nunca.

Medido com WebDriver BiDi no Firefox 158, quadro a quadro durante a meia-volta:

| momento | ângulo | frente | verso |
|---------|--------|--------|-------|
| 261ms   | 26°    | visible | visible | ← o verso está de costas
| 444ms   | 77°    | visible | visible |
| 528ms   | 102°   | visible | visible | ← a frente está de costas
| 828ms   | 179°   | visible | visible |

`backface-visibility: hidden` está no estilo computado das duas faces e
**não é cumprido**. O motor pinta as duas o giro inteiro, e a que não devia
aparece por trás.

Não é só do `will-change`: testado no próprio Firefox, e **nenhuma** destas
resolve — remover o `will-change: transform` do `.cc-tilt`, propagar o
`backface-visibility` para `.cc-tilt` e `.cc-face`, ou as duas juntas. As três
continuam pintando as duas faces.

A correção é **remover a dependência**: a pintura é decidida pelo React, e só uma
face pinta por vez.

```jsx
<div className="cc-card cc-card--frente" data-oculta={pintandoVerso || undefined}>
<div className="cc-card cc-card--verso"  data-oculta={!pintandoVerso || undefined}>
```

```css
.cc-card[data-oculta] { visibility: hidden; }
```

**E é por isso que a meia-volta são duas metades de 90° em 90°**, e não uma
transition de 180°. A troca de qual face está pintada acontece no
`transitionend` da primeira metade — nos **90°**, onde as duas faces estão de
perfil e a largura projetada é zero, então a troca não aparece.

Medido no Firefox depois da correção:

| ângulo | frente | verso | largura projetada |
|--------|--------|-------|-------------------|
| 0°     | painted | hidden | 252,2px |
| 56°    | painted | hidden | 142,3px |
| 85°    | painted | hidden | **22,4px** |
| 94°    | hidden | painted | **19,1px** |
| 146°   | hidden | painted | 209,3px |
| 180°   | hidden | painted | 252,2px |

A troca acontece entre 22px e 19px de largura — de sliver para sliver, e não se
vê.

O `backface-visibility` **continua no CSS**: no Chrome ele basta, e é ele que
resolve a troca suave. A garantia é que a pintura não depende do motor.

#### Quem manda na pintura é a fase, e não o ângulo

`angulo` é o valor **alvo**: no começo da primeira metade ele já vale 90°, com a
peça ainda em 0°. E ele não serve nem depois, porque é a geometria errada — **o
slot pintado vira a cada 90° do ângulo, mas o cartão só troca a cada 180°**.

Derivando a face do ângulo, voltar do Croma para o Nubank acabava a segunda
metade pintando o slot velho, e o cartão aparecia **ao contrário**, de costas e
espelhado.

A regra é a do gesto, e é a mesma nos dois sentidos:

| metade | quem pinta | o que aparece |
|--------|-----------|---------------|
| 1ª (0°→90°) | o slot que já estava na tela | o cartão de onde se está saindo, estreitando |
| 2ª (90°→180°) | o outro slot | o cartão de destino, alargando |

E por isso o destino vai para o slot **escondido** — o oposto de quem está
pintado, que é justamente o que vai estar de frente depois da meia-volta. Trocar
o escondido não aparece: ele não está pintado.

Verificado com um invariante geométrico, que é mais forte que comparar
timestamps: **a face pintada tem que estar de frente para quem olha**, e pode
estar de costas só quando a largura projetada é ~0.

| ângulo | slot pintado | ângulo efetivo | largura | cartão |
|--------|--------------|----------------|---------|--------|
| 13°  | frente | 13°  | 245,7px | Nubank |
| 81°  | frente | 81°  | 40,1px  | Nubank |
| 94°  | verso  | 274° | 19,1px  | Croma  |
| 171° | verso  | 351° | 249px   | Croma  |

No Firefox a troca acontece com **2,1px** de largura.

#### A interação é medida contra o palco, nunca contra a face

A direção da inclinação vem da caixa do **`.cc-stage`**, que não gira e não é
remontado, e tem exatamente a mesma caixa do cartão (252,174 × 400).

Duas alternativas quebraram, ambas sem erro:

1. **A `ref` no elemento do cartão.** O `AnimatePresence` mantém o cartão antigo
   montado durante o `exit`, e o `ref` só é limpo quando o elemento **deixa de
   existir** — o cartão que saía zerava a ref do que tinha acabado de entrar, e a
   inclinação morria para sempre. Só voltava com F5.
2. **`querySelector(".cc-face")`.** Com a virada nova existem **duas** faces, e a
   primeira do DOM é a da frente — que **durante o giro está de costas**. Pior:
   `rotateY` estreita o `getBoundingClientRect()`, e a 95° a largura cai de
   252px para **23px**, então a direção passava a ser medida contra uma caixa
   quase nula.

> **Filtrar por `backface-visibility` não funciona, e esse é o ponto.** As
> **duas** faces têm `hidden` — é exatamente isso que faz a virada mostrar só
> uma. Nenhum filtro em `backface-visibility` separa frente de verso; o que
> decide é o ângulo da peça.

Medido com o ponteiro **parado** no mesmo ponto, antes, durante e depois do giro:
**8,18014° → 8,18415° → 8,18415°**. Variação 0,00°.

#### `prefers-reduced-motion` tem caminho próprio

O caminho normal é `transition` CSS, com o fim em `transitionend`. Com movimento
reduzido a regra global corta a transition para 0.01ms, o navegador **não gera
transição**, e o `transitionend` nunca dispara — a peça ficava em 180°, a trava
de reentrância nunca abria, e a seção **ignorava todo clique seguinte**. Seção
morta no primeiro clique.

O caminho reduzido é **síncrono**, sem evento: `meiaVolta` não seta `virando`
quando `usePrefersReducedMotion()` é verdadeiro, e o ângulo salta.

### A entrada é por scroll, e `display: contents` quebrou isso

`whileInView` com `once: true`: a seção surge **na chegada**, e não na montagem,
para quem já abre a página no meio da rolagem não ver tudo passar pela animação.
O cartão entra com `revealScale` (escala) e o resto com `revealUp`, escalonados
por `staggerContainer(0.09)`.

> **O container do escalonamento tem que ser um elemento de verdade.** A
> primeira versão usou `className="contents"` para não acrescentar caixa, e com
> isso a entrada **nunca rodou**: `display: contents` não gera caixa, o
> `IntersectionObserver` do `whileInView` não tem o que observar, e as pílulas
> ficaram presas em `translateY(24px)` — 24 px abaixo do lugar, sem nenhum erro em
> lugar nenhum. Virou `div` de verdade e o layout não mudou: a seção é
> `items-center`, então o wrapper encolhe até o conteúdo e continua centralizado.

### O reflexo vai por `useMotionTemplate`, nunca por custom property

A primeira versão posicionava o reflexo com `--cc-glare-x` alimentada por motion
value. O resultado foi o pior tipo de bug: **sem erro e sem efeito**. O React
escrevia literalmente `[object Object]` no atributo `style`, o gradiente ficava
inválido, e a verificação passava porque a opacidade vinha de outra fonte — dois
"efeitos" que só se confundem quando se olha o `background-image` e não a
variável. Nem `motion.span` resolveu.

Agora o gradiente inteiro é uma `MotionValue<string>` de `useMotionTemplate`,
escrita em `backgroundImage`, que é uma propriedade normal. Custo: um repaint do
elemento por quadro — que é o mesmo de antes, já que o ponto luminoso se move. O
que continua não existindo é re-render do React.

### Fidelidade medida contra o frame `97:2`

Geometria lida do DOM (`getBoundingClientRect`), em coordenadas do frame:

| | Figma | Implementado |
|---|---|---|
| Seção | 1920 × 1086 | 1920 × 1088,08 |
| Cartão | 252,174 × 400 | idem |
| Raio / padding do cartão | 10,435 / 20,87 | idem |
| Rede de cartões | x 20,87 · y 20,87 · 86,865 × 53,69 | idem |
| Chip | x 130,43 · y 47,83 · 39,13 × 53,043 | idem |
| Marca `nu` | 86,956 × 47,432 | idem |
| Nome no cartão | y ≈ 192,5 | 192,27 |
| Título | 64 px · altura 78,08 | idem |
| Seletor | 4 pílulas, gap 24, 514 × 40 | **512,33 × 40** |

Os 2,08 px a mais na seção não são de layout: vêm das três caixas de texto em
que o Figma usa `leading: normal` e o projeto usa `leading-[1.25]` — a altura
natural do Montserrat. São ~0,9 px por texto e não deslocam elemento nenhum: o
cartão, o título e o CTA batem exatamente.

### O fundo e o gradiente do cartão vão como data URI

Os dois `radialGradient` vêm com `gradientTransform` em `matrix(...)`, que o
CSS não expressa — ele achata a elipse e ainda a gira. No cartão a matriz é
degenerada (`r=10` esticado por `27.015`), então a elipse é praticamente uma
reta e a rotação dela **é** o desenho. O export vai cru.

Os `rgba()` não podem virar hex: dentro de `url("data:…")` um `#` não escapado é
lido como fragmento de URL e trunca a string no meio — o gradiente simplesmente
não aparece, sem erro no console. E `background-size: 100% 100%` +
`background-repeat: no-repeat` são obrigatórios, pelo mesmo motivo documentado
na seção do Ecossystem: o SVG tem `viewBox` e não tem `width`/`height`, e o
Firefox **repete** em vez de esticar.

### Comparação de pixel com o export do Figma

Grão desligado (é desvio autoral e, ligado, produz um offset uniforme que
mascara qualquer diferença real), os dois em 1024 de largura:

| | |
|---|---|
| Erro médio absoluto | 8,17 níveis |
| Offset uniforme por canal | −5,87 / −4,66 / −6,94 (R/G/B) |
| Resíduo depois de tirar o offset | **3,54 níveis** |
| Inclinação do erro no eixo X | **0,00000 níveis/px** |

A inclinação nula é o discriminador: é erro de offset uniforme, não gradiente
errado — que daria erro crescendo de uma ponta à outra. O offset de ~6 níveis é
o dithering do viewer do Figma, que o próprio `CONTEXTO.md` já registra como
falso grão. O resíduo de 3,54 é a antialiasing do texto e a borda de 1 px do
cartão, que cai em largura de pixel diferente por causa dos 2,08 px de altura.

**O cartão não tem sombra no Figma.** Medido: a transição da borda é abrupta
dos dois lados (fundo `236,223,246` a 3 px da borda, cartão `109,17,174` em
0 px), sem pixel intermediário, e o `get_design_context` não devolve
`boxShadow` no nó `98:150`. A sombra que existe na nossa implementação é
desvio autoral, pedido pelo usuário, e está documentada na seção da Cards
Section. O contorno que aparece no diff é a borda de 1 px amplificada, não
sombra.

---

## Solutions Section

Figma `Solutions Section - Safe` (nó `144:2`) e `Solutions Section -
Account` (nó `151:92`), 1920×1176. É a seção que vem **abaixo** da Cards
Section.

### A seção é um carrossel

A janela central mostra a opção **ativa**, e as duas bordas da seção mostram as
**vizinhas**: 135 px à esquerda são a opção anterior, 135 px à direita são a
seguinte. O frame do Safe não tem prévia esquerda — é a primeira opção, não
tem vizinha anterior.

| Opção | Frame | Nó | Estado |
|---|---|---|---|
| Caixinhas | Safe | `144:2` | liberado |
| Conta e Pix | Account | `151:92` | liberado |
| Investimentos | — | `153:125` | liberado |
| Empréstimos | — | `153:167` | liberado |

**A seção está completa**: as quatro opções trocam, e o carrossel vai e volta
sem travar.

(No Figma os dois últimos ainda estão **todos** nomeados "Solutions Section -
Account" — a identidade deles vem do badge, não do nome do frame.)

### A prévia É a janela encolhida — e isso é o que faz o carrossel

Este é o achado que define a implementação, e ele sai da geometria do Figma, não
de um palpite:

| | quadro | recorte da arte | raio |
|---|---|---|---|
| janela | 1520 × 720 | (−175, −141) 1803 × 1006,326 | 25 |
| prévia  | 1308,889 × 620 | (−248,861, −101,611) 1620,911 × 878,821 | 21,528 |
| razão   | **0,861111** | **0,861111** (delta 0,000) | 0,861120 |

1308,889 / 1520 = 620 / 720 = 0,861111, e o mesmo número divide o recorte da
arte (delta **0,000** nos quatro valores) e o raio. Uma prévia é, literalmente,
**a janela encolhida** — e não uma miniatura desenhada à mão.

Duas consequências que economizam a implementação inteira:

- **O raio não precisa ser animado.** 25 px escalados por 0,861111 dão 21,528,
  que é exatamente o raio que o Figma dá nas prévias.
- **A arte só precisa de um recorte.** O da janela. O da prévia é ele escalado.

### A troca é um carrossel de verdade

**Uma composição é um componente só**: a arte, o badge e o painel de texto
vivem no **mesmo quadro** de 1520 × 720, e é esse quadro que muda de lugar.
Nada "flutua" — o badge está atrelado à arte dele porque está **dentro** do
quadro dela.

O slot é a **diferença de índice** entre a composição e a opção ativa:

| diferença | slot | o que é |
|---|---|---|
| 0 | centro | a opção ativa, nítida e cheia |
| −1 | esquerda | a anterior, miniatura e desfocada |
| +1 | direita | a seguinte, miniatura e desfocada |
| ≤ −2 | fora, pela esquerda | entrou ou saiu |
| ≥ +2 | fora, pela direita | entrou ou saiu |

| slot | posição | escala | desfoque |
|---|---|---|---|
| centro | 200, 356 | 1 | 0 |
| esquerda | −1173,444, 408 | 0,861111 | 4,306 |
| direita | 1784,556, 406 | 0,861111 | 4,306 |

Ao trocar, a composição que estava no centro **encolhe e ganha blur** para a
borda esquerda, e a que estava na miniatura direita **cresce e afina** para o
centro. Nenhuma arte é trocada: as duas se deslocam — e o badge e o painel vão
com elas, porque são o mesmo componente.

**O "fora" é do lado para onde o gesto vai**, e é além do quadro de 1920 — a
seção recorta. É de lá que a composição entra e para onde ela sai, e é por
isso que uma troca de duas ou mais posições **também anima**: as que saem
deslizam para fora e a que entra vem de fora.

**O painel de texto repete o reveal a cada troca.** É o mesmo `revealUp` do
resto da landing (sobe 24 px, curva expo, 1,1 s) — e ele **repete** sempre que
se troca de uma opção para a outra.

O título da seção troca **rápido**, sem esperar a arte chegar: ele é a
"chrome" da seção, e um bloco de texto em branco no alto durante toda a
viagem pareceria defeito.

### A janela não recorta nada

A janela **não** tem `overflow-clip`, e é de propósito: um clip ali cortaria o
badge e o painel no meio da viagem. O clip que importa é o do quadro da
composição, que é quem recorta a ilustração.

### Quem interpola o quê

O **transform** e a **opacity** são variantes do Motion, porque o Motion
interpola os dois. O **filter** é transição de CSS, porque o Motion **não**
interpola `filter` — e o desfoque da miniatura é justamente o que precisa de
interpolação.

O valor do desfoque é **local**: o `filter` é aplicado no espaço do quadro, e
o quadro está escalado por 0,861111, então 5,001 local dá 4,306 na tela — que é
o número do Figma.

**A curva e a duração.** A primeira versão usava `EASE_EMPHASIZED` e 800 ms.
Medida, ela fazia **78% do caminho no primeiro quarto do tempo** — uma
arrancada seguida de meio segundo de arrasto, que é o que lê como "intenso".

| | curva | duração |
|---|---|---|
| antes | `cubic-bezier(0.32, 0.72, 0, 1)` | 800 ms |
| agora | `cubic-bezier(0.6, 0.05, 0.3, 1)` | **1000 ms** |

A de agora tem partida macia, glide longo e chegada amortecida. Distribuição
medida do caminho percorrido: **50% em 524 ms** (era 95%), 75% em 651 ms, 90%
em 727 ms.

**A duração tem de bater com `CARROSSEL_DURACAO` em `lib/solutions.ts`**,
porque o badge e o painel de texto esperam esse número para aparecerem quando
a arte chega. É a mesma duplicação que os CTAs da header têm: o Tailwind só
enxerga classes escritas por extenso, e esta transição é CSS.

### A janela não recorta nada

A janela **não** tem `overflow-clip`, e é de propósito: um clip ali cortaria o
badge e o painel no meio da viagem. O clip que importa é o do quadro da
composição, que é quem recorta a ilustração.

### O badge e o painel só aparecem quando a arte chega

O conteúdo da janela **não** troca no meio da viagem. A linha do tempo é:

| | |
|---|---|
| 0 – 1000 ms | a composição viaja: a arte se desloca, e o badge e o painel **antigos** apagam com ela |
| 1000 ms | a arte chega — e o badge e o painel **novos** entram |
| ~2100 ms | tudo assentado |

A espera é o mesmo número da transição da arte (`CARROSSEL_DURACAO` em
`lib/solutions.ts`), e ela mora **dentro da variant** do painel — não na prop
`transition`. Com o `animate` apontando para um rótulo de variant, é a
transition **da variant** que vale, e a prop é ignorada. Medido: com o atraso na
prop, o painel aparecia em 250 ms, no meio da viagem.

Sob `prefers-reduced-motion` o atraso é **zero** — a preferência pede mudança
instantânea, e esperar um segundo para o texto aparecer é o contrário disso.

### A direção da saída é uma *variant*, e não um objeto

O `exit` do elemento que sai é o do **render antigo**, e é por isso que ele
precisa da direção de agora. O `custom` do Motion é o que resolve isso — e ele
só chega a uma **variant**, nunca a um objeto literal.

Com `exit={{ opacity: 0, x: -direcao * 48 }}`, a arte saía **pelo lado
errado na volta**: medido, indo para trás ela saía pela esquerda (tx = −35)
quando devia sair pela direita. Com a variant, o `custom` do `AnimatePresence`
chega ao `exit` e a direção fica certa (tx = +36). É a mesma armadilha que a
Cards Section já tinha encontrado na virada do cartão.

### Três âncoras, e por que confundi-las desloca tudo

O Figma posiciona as peças em três referenciais distintos:

| Peça | Âncora no Figma | Por quê |
|---|---|---|
| badge e painel | `Main Content` (`144:3`) | mesma largura da janela, 256 px acima |
| prévia desfocada | a **seção** | é irmã do `Main Content`, não filha |
| seletor de pílulas | o `Title` (`150:48`) | `justify-between`: flush à direita |

**O seletor virou filho do `Title`** — e é por isso que ele sai em x = 902:
1520 − 618, ou seja, flush com a borda direita da coluna de conteúdo. Antes ele
era irmão do `Main Content`, no pé da seção, e a seção tinha 1316 de altura;
agora tem 1176.

O badge e o painel são posicionados **pela janela**, e não pelo `Main Content`:
a janela tem a mesma largura e começa 256 px mais abaixo, então `(1330, 298)`
no `Main Content` é `(1330, 42)` na janela. Ancorar na janela deixa a
composição ligada à imagem — e é o que faz o resultado bater com o Figma mesmo
com o título renderizando 0,16 px mais alto (o `leading-[1.22]` do projeto
contra o `leading: normal` do design).

A prévia é a exceção: no Figma ela é **irmã** do `Main Content`, então a
origem da coordenada é a seção. Ancorá-la na janela a empurraria 200 px para
a direita — para fora do frame de 1920, onde ela sumiria por completo.

### O `border` do CSS soma na caixa; o traço do Figma não

Este é o ponto que mais custou medição, e vale registrar porque **ele já
existe na Cards Section** (ver pendência nº 17).

O auto-layout do Figma **exclui o traço do tamanho do quadro**. No badge
(`151:75`): o quadro tem 148 de largura e o texto 100, a 24 da borda — ou seja
`24 + 100 + 24 = 148`, sem o traço de 2 px. E na altura: `12 + 24 + 12 = 48`.
O mesmo nas pílulas (`151:86`): `18 + 93 + 18 = 129`, e a altura é `10 + 20 +
10 = 40`.

No CSS o `border` **sempre** entra na caixa. Sem compensar, o badge saía
151,27 × 53 (contra 148 × 48) e as pílulas 42 de altura (contra 40).

**A correção é compensar o padding pela metade da borda:**

```css
/* badge: traço de 2px -> padding 22 (e não 24) */
border-2 px-[22px] py-[10px]   /* texto a 2 + 22 = 24 da borda, caixa 48 */

/* pílula com traço: 1px -> padding 17 (e não 18) */
border px-[17px] py-[9px]       /* texto a 1 + 17 = 18 da borda, caixa 40 */
```

Com isso **todo** número do Figma é reproduzido: a posição do texto, a largura
da caixa e a altura. O único resto é o traço em si, que o Figma desenha
centrado na borda (0,5 px para fora, 0,5 para dentro) e o CSS desenha todo
para dentro — 0,5 px, abaixo da resolução da medição.

E as duas pílulas continuam com a **mesma caixa** — que é o que faz o seletor
não "pular" quando o estado muda.

### A prévia precisa de `amount: "some"`, e de âncora pela direita

Dois efeitos do mesmo fato: a prévia tem 1308,889 de largura mas só **135,44**
dentro do frame de 1920.

**A âncora é pela direita.** No Figma a borda esquerda dela fica em 1784,56.
Se a âncora fosse a esquerda, abaixo de 1785 px de viewport a prévia ficaria
inteira fora da seção — e é a seção que recorta. Pela direita (`right:
-1173,445px`) o pixel em 1920 é o mesmo e o pedaço continua visível em
qualquer largura.

**O gatilho é `amount: "some"`.** O `IntersectionObserver` herda o recorte do
`overflow-clip` da seção: a razão entre o visível e o total fica em **10,3%**,
que nunca alcança os 25% usados no resto da página — e a prévia ficava em
`opacity: 0` para sempre. Foi a única seção que precisou de um limite
diferente, e a razão é do recorte, não da animação.

### A imagem não é dimensionada pela janela

O Figma não dimensiona a imagem pela janela: ele a põe num retângulo maior
(1882,348 × 1020,567 a partir de −289, −118) e deixa a janela recortar. É o
mesmo motivo pelo qual a sombra dos cards da Hero vai na `<img>` e não na caixa
do slot.

### A arte de fundo segue o ponteiro

A ilustração dentro da janela desliza na direção do ponteiro, com inércia. É
desvio autoral — o Figma não define animação para nada (decisão 8) — e segue o
mesmo vocabulário de movimento do resto do projeto.

**Só a arte se move.** O badge e o painel de texto ficam ancorados na janela e
a ilustração passa por baixo deles: é o que faz a leitura ser de "janela" e não
de "cartão inteiro mexendo".

| | valor | por quê |
|---|---|---|
| amplitude horizontal | 14 px | 44 → 26 → 14: a sensação pedida é de suavidade, não de resposta |
| amplitude vertical | 9 px | 28 → 16 → 9, na mesma proporção |
| mola | `stiffness 70 / damping 21 / mass 0.9` | ζ ≈ 1,32, bem amortecida, sem overshoot |

**A amplitude não é livre.** No Figma a arte **não** é dimensionada pela
janela: ela é maior e deslocada, e é a janela que recorta. Em `144:2` a arte
ocupa 1882,348 × 1020,567 a partir de (−289, −118) dentro de uma janela de
1520 × 720 — e a margem disponível é assimétrica:

| direção | quanto a arte aguenta antes de aparecer a borda |
|---|---|
| para a esquerda | **73,348 px** (a borda direita encosta na janela) |
| para a direita | 289 px |
| para cima | 182,567 px |
| para baixo | 118 px |

Os 14 px usam 19% da folga mais apertada. **Acima de 73 px a borda direita da
arte apareceria** — e é por isso que o número mora num lugar só.

**O sentido é o do pedido:** a arte vai *para onde* o ponteiro está, e o
conteúdo dela junto. O sinal contrário (o parallax clássico, em que a cena
recua do cursor) é trocar um sinal em `use-background-parallax.ts`. Foi
medido e olhado nos dois sentidos antes de escolher — com o sinal invertido, a
moldura do quadro na árvore saía pela borda esquerda da janela, que é o oposto
de "segue".

**O escopo é a janela, e não a seção.** O ouvinte do ponteiro está na própria
janela da imagem: passar pelo título ou pelas pílulas **não move a arte**. É o
que limita o efeito àquela "tela".

E com o ouvinte na janela, o `reach` **deixou de existir** — o ponteiro nunca
está fora dela quando o handler roda, e uma distância de alcance seria um
número morto. O que modula a resposta é só a **direção**, que cresce do centro
para as bordas.

**Medido** (Chrome e Firefox, dentro de 0,1 px):

| Ponteiro | `x` | `y` | |
|---|---|---|---|
| centro da janela | 0 | 0 | parado |
| borda esquerda da janela | −13,6 | 0 | responde |
| borda direita da janela | +13,2 | 0 | responde |
| borda de cima | 0 | −8,7 | responde |
| **sobre o título** | 0 | 0 | **parado** |
| **sobre as pílulas** | 0 | 0 | **parado** |
| **100 px abaixo da janela** | 0 | 0 | **parado** |
| 240 px acima | 0 | 0 (a resposta morreu) |

E o deslocamento do **conteúdo** foi conferido por correlação cruzada entre
duas capturas: 84,52 px entre a ponta esquerda e a ponta direita da janela, com
a amplitude de 44 px — exatamente o dobro, o que confirma que a arte e o que
está pintado nela andam juntos.

Sob `prefers-reduced-motion` o deslocamento é **0,00** com o ponteiro na borda
da janela. O corte é no *handler* e não no `MotionConfig`, porque isto é um
motion value e não uma animação.

### O seletor é o mesmo componente das duas seções

A Cards Section e a Solutions Section têm **o mesmo seletor** — quatro pílulas
que escolhem uma opção e trocam o conteúdo da seção. E agora são literalmente
o mesmo código: `components/ui/PillTab.tsx` e a regra `.pill-tab` no
`globals.css`.

O que muda entre as duas seções é só a **paleta**, e ela chega por custom
property: no Nubank a pílula ativa é `Action/action-primary` com texto branco, e
no Croma é `#eeece9` com texto `Text/text-brand`. Com `#8f7f64` — que não é
token — nas inativas do Croma, não há classe a escrever: o valor vem do Figma e
entra por `style`. A Solutions Section usa os **defaults** (a cor da marca), e
por isso não declara nenhuma.

Unificar as duas resolveu também a **pendência nº 17**: com a compensação do
padding, as pílulas da Cards Section passaram de 520,33 × 42 para
**512,33 × 40** — o Figma dá 514 × 40, e a diferença que resta é a métrica do
texto.

### Fidelidade medida contra os quatro frames

Geometria lida do DOM (`getBoundingClientRect`), em coordenadas de documento,
nos dois motores. Todos os números de baixo são do Figma.

| | Safe `144:2` | Account `151:92` | Billing `153:125` | Business `153:167` |
|---|---|---|---|---|
| Título da seção | Cada objetivo merece seu espaço. | Tudo flui no seu dia a dia. | Olhe além de hoje. | Decisões com mais clareza. |
| Arte na janela | 200 / 356 | idem | idem | idem |
| Badge | 1530 · 148×48 | 1513 · 165×48 | 1483 · 195×48 | 1492 · 186×48 |
| Painel de texto | 1294 · **384**×235 | 1235 · **443**×235 | 1211 · **467**×**264** | 1159 · **519**×235 |
| Linha do painel | 799 | 799 | **770** | 799 |
| Arte principal | safe (−289, −118) | serenity (−175, −141) | upstairs (−132, −31) | trade (−155, −49) |

**O painel do Investimentos é o único que sobe** — 29 px acima dos outros (770
em vez de 799) — e é o mais alto (264 px), porque o título tem **quatro**
linhas. É o Figma, e a diferença é visível.

**A largura do painel muda por frame** (384 · 443 · 467 · 519): o auto-layout
do Figma dá a largura do conteúdo mais o padding, e cada texto tem um
tamanho diferente.

Medido, com **±0,9 px** de diferença em todas as caixas — que é a métrica do
texto, não o layout.

### As prévias são as artes vizinhas, e o Figma é inconsistente nelas

O recorte da arte de cada prévia é **exatamente** o recorte da janela
escalado por 0,861111 — delta 0,000 nos quatro números, nos quatro frames. Mas
a **posição do quadro** da prévia não é igual em todos:

| prévia | Figma | implementado |
|---|---|---|
| direita | 1784,556 (y 406 e 408) | 1784,556 |
| esquerda, no Account | −1173,444 · y 408 | −1173,444 · y 408 |
| esquerda, no Investimentos | −1373,444 · y 306 | −1173,444 · y 408 |

O do Investimentos é 200 px mais à esquerda e 102 px mais acima — e, a 200 px
mais à esquerda, o quadro inteiro sairia do frame de 1920 e a prévia ficaria
**invisível**. O render do próprio Figma mostra a prévia visível, em 0..140 —
que é onde o modelo a põe. A implementação segue o render, e não o número
isolado. Vale corrigir o Figma.

### Contraste

Medido no render de produção, **com o grão ligado** (0,12), pelo método do
projeto — apagar a tinta do texto, esperar o repaint e fotografar o fundo real
atrás do glifo:

| Texto | Razão | Mínimo | |
|---|---|---|---|
| Badge, 20 px | 6,21:1 | 4,5:1 | ✅ |
| Título do painel, 24 px | 6,26:1 | 4,5:1 | ✅ |
| CTA "Saiba Mais", 16 px | 6,37:1 | 4,5:1 | ✅ |
| Pílula ativa, 16 px | 6,59:1 | 4,5:1 | ✅ |
| Pílula inativa, 16 px | 6,67:1 | 4,5:1 | ✅ |

A tinta é `Text/text-brand` (#820ad1) sobre `Background/bg-secondary` (#f9fafb),
que dá 6,90:1 sem grão. Nenhum texto da seção reprova.

---

## Movimento

O Figma **não define animação** (`get_motion_context` retorna vazio), então o
movimento foi desenhado aqui:

1. **Entrada em leque** — os cards partem de baixo e giram até a rotação do
   design, em cascata da esquerda para a direita (ver abaixo).
2. **Parallax de rolagem** — a camada de cards desliza mais devagar que a página.
3. **Paralaxe de ponteiro** — deslocamento sutil na direção do cursor
   (apenas em dispositivos com ponteiro fino).
4. **Header** — condensa e ganha fundo ao rolar; na entrada, logo, itens de nav
   e CTAs descem em cascata (ver a seção da entrada em CSS, abaixo).
5. **Texto** — reveal escalonado com `cubic-bezier(0.16, 1, 0.3, 1)`.
6. **Ecossystem** — a pessoa do pilar sobe de baixo para cima, e desce quando o
   tópico troca. Toda a troca de pilar é uma coreografia; ver a seção do
   Ecossystem.
7. **Cartão de crédito** — a seção inteira responde ao ponteiro: o cartão
   inclina em 3D e um reflexo viaja com ele, ambos desvanecendo com a distância.
   Ver a seção da Cards Section.
8. **Fundo da Solutions Section** — a arte dentro da janela segue o ponteiro,
   com mola, e volta ao repouso quando ele sai. Só a arte se move: os painéis
   ficam ancorados na janela. Ver a seção da Solutions.

### O corte de movimento reduzido não vem só do `MotionConfig`

`<MotionConfig reducedMotion="user">` desliga **animações**. Ele não desliga
**motion values** — e a inclinação do cartão é exatamente isso: não tem início
nem fim, é o ponteiro empurrando um número a cada `pointermove`.

Então o corte tem de ser no `handler`, com `usePrefersReducedMotion()`, e é o
que o `CreditCard` faz — a mesma abordagem da paralaxe da Hero. Sem isso, quem
pede menos movimento veria o cartão girar a cada movimento do mouse.

O reflexo também sai fora: sem movimento ele continuaria aparecendo parado no
centro do cartão, o que não é movimento, é uma mudança de aparência que ninguém
pediu. Medido nos dois estados com `Emulation.setEmulatedMedia`:

| | `rotateX`/`rotateY` | Reflexo |
|---|---|---|
| Sem preferência | ±11° / ∓8,6° | opacidade 1 perto do cartão, 0 a 460px |
| `reduce` | `transform: none` | opacidade 0 |

> **Regra do repositório:** a ref precisa vir **fora** do objeto que traz as
> motion values. A regra `react-hooks/refs` proíbe acessar qualquer propriedade de
> um objeto que contenha uma ref durante o render — ela não distingue "isto é uma
> ref" de "isto está ao lado de uma ref". Separar `cardRef` de `values` deixa o
> JSX ler as motion values sem erro de lint, sem desligar a regra.

### A pessoa que sobe de baixo para cima

O deslocamento é em porcentagem **da altura da própria imagem**, e o que esconde
não é `opacity` — é a posição. A pessoa nasce 100% da própria altura abaixo, de
onde o `overflow-clip` a recorta: ela está renderizada o tempo todo, e é só a
translação que a traz para a vista. O HTML do servidor já sai com
`transform: translateY(100%)`, então não há flash antes da hidratação.

Por que 100% basta aqui, quando os cards da Hero precisam de 150%: a pessoa tem
843 px de altura e a janela de recorte tem 595 px, então qualquer deslocamento
acima de ~70% já a põe inteiramente fora da tela.

**1,5 s, e não os 1,1 s de `DURATION.slow`.** O percurso dela é de 843 px —
quase o dobro dos cards da Hero —, então no mesmo tempo a velocidade sobe e o
movimento lia como *colocada* em vez de *subindo*. Tem valor próprio para não
arrastar junto o `revealUp` da Hero e o texto da seção, que já estão aprovados.

**A curva, e não o número, é o que faz esses 1,5 s valerem.** Com
`EASE_OUT_EXPO`, o expo põe 82% dos 843 px nos primeiros 375 ms — o que sobra é
1,1 s de arrasto dos 5% finais, movimento lento demais para ser lido como
movimento e longo demais para ser lido como repouso. Subir de 1,1 s para 1,5 s
**não** resolveu isso: com uma curva desse formato, duração e velocidade
percebida não são a mesma coisa, e aumentar a primeira só comprimenta a cauda.

`EASE_EMPHASIZED` (`cubic-bezier(0.32, 0.72, 0, 1)`, a do Material 3) resolve.
Comparando as duas no mesmo instante:

| Fração do tempo | expo | enfática |
|---|---|---|
| 17% | 65% | 53% |
| 25% | 78% | 77% |
| 40% | 91% | 92% |
| 74% | 99,9% | 99% |

A diferença está no meio do trajeto, que é onde o olho acompanha. Medido no
navegador depois da troca: a pessoa está a 91% da subida aos 600 ms, a 98% aos
1005 ms, e assenta em 1690 ms. Com o expo ela estaria a 91% aos 370 ms e a
100% aos 1300 ms, com o resto do tempo sem nada visível acontecendo.

O caminho de saída (`exit`, desce e some) **roda a cada troca de pilar** — é o
`AnimatePresence` que mantém a antiga montada enquanto a nova entra, e é por isso
que as duas se cruzam em vez de se cortarem.

### O leque dos cards

Os cards **não surgem**: já estão renderizados, opacos e no tamanho final. No
primeiro frame estão em `translateY(150%)`, abaixo da borda inferior da Hero, de
onde o `overflow-clip` da seção os recorta. A única animação deles é o leque:
cada card sai 18° fora da rotação do design, com pivô em `50% 78%`, e assenta
nela girando — da esquerda para a direita.

Três decisões:

- **Sem `opacity` e sem `scale`.** Um fade faria o card *surgir* em vez de
  *chegar*. Ele nasce sólido; quem o traz para dentro da tela é o giro.
- **`y` em porcentagem da própria altura do card**, não em pixel. A geometria da
  composição é toda proporcional (`cqw` + `aspect-ratio`), então um pixel fixo
  desalinharia em outras larguras. 150% é folgado: em 16:9 um card precisa de
  34% a 58% do próprio tamanho para passar da borda, e viewport mais alta que
  16:9 exige mais.
- **Pivô perto da base.** Com pivô no centro o card só gira no lugar; perto da
  base ele bascula, e é o bascular que lê como leque abrindo.

Os valores estão em `FAN` (`lib/motion.ts`) e na cascata em `FAN_CASCADE`
(`lib/hero-cards.ts`), esta ordenada pela posição horizontal do card — não pelo
índice do array, para que a ordem visual seja a ordem da animação.

### Regra: nunca misturar `opacity` do Motion com transition de CSS

O Motion escreve `opacity` inline a cada quadro. Se o **mesmo** elemento também
tiver `transition-opacity`, cada uma dessas escritas dispara a transition de
150 ms do CSS e o valor renderizado fica sempre atrás do valor do Motion. No fim
da animação o Motion remove o `opacity` inline, a transition pega o computed de
1 e leva mais 150 ms para assentar — o elemento continua mudando depois da
animação ter acabado.

O sintoma aparece como um piscar no fim do reveal, e é fácil culpar o asset: no
logo da marca ele foi perseguido por `mask-image`, depois por SVG inline e depois
por PNG, três vezes, até a causa aparecer. **Se um elemento animando por Motion
parece piscando, suspeite do conflito de `opacity` antes da imagem.**

A correção é estrutural: o reveal fica num wrapper `motion.*` e o elemento com
a transition CSS é o filho, que o Motion não toca. É o que já fazem os itens da
nav (transition no `<button>`) e os CTAs (transition no link dentro do
`motion.span`).

### A entrada do header é CSS, não Motion — e por quê

O logo ficava ~1 px acima no fim da animação e depois descia. **No Firefox
claramente, no Chrome quase imperceptível.** Essa diferença entre motores foi a
pista decisiva.

A causa: quando uma biblioteca de animação **remove** o `transform` no fim, o
elemento sai do caminho de render composto e volta ao pintado. Os dois motores
arredondam a posição de forma diferente, e no Firefox a troca aparecia como um
deslocamento de um pixel.

`will-change: transform` — a aposta óbvia — **não resolveu** (e custava uma
camada viva à toa).

A solução é não ter esse instante. A entrada do header é uma animação CSS com
`animation-fill-mode: both`, então o keyframe final (`transform:
translateY(0px)`, `opacity: 1`) **continua aplicado** depois que a animação
acaba. Nunca existe um momento em que o `transform` vira `none`, então não há o
que os motores arredondem de formas diferentes. O mesmo código nos dois, sem
caminho de render alternativo.

O Motion continua no componente, mas só para o `useScroll` que condensa o header
ao rolar. A cascata saiu de `staggerChildren` e virou uma lista explícita de
atrasos em `ENTER`, cada elemento com `--header-enter-delay`. Os valores são os
mesmos que o Motion produzia.

O logo também recebe `lg:translate-y-[0.5px]`: no `lg` a caixa tem 35 px (ímpar)
centralizada numa linha de 40 px, então desce em 32,5 px. Descansar em pixel
inteiro elimina a última chance de divergência entre motores.

### Movimento reduzido

Quem tem `prefers-reduced-motion` ativo no sistema não vê nenhum
deslocamento. Isso é feito com `<MotionConfig reducedMotion="user">`, e **não**
com `useReducedMotion()` dentro dos componentes: esse hook devolve `false` no
servidor e o valor real no cliente, e como o resultado vira HTML (`initial`,
condições de render), quebraria a hidratação. `lib/use-prefers-reduced-motion.ts`
usa `useSyncExternalStore` para ler a preferência sem divergência.

### Textura (grão)

Uma camada de ruído sutil cobre a página inteira, para dar textura e
profundidade. **É um desvio autoral:** o `bg` da Hero no Figma (nó `14:460`) é
gradiente puro — sem camada de ruído, sem blend mode, sem filtro. O que parece
grão no Figma é o dithering do próprio viewer ao renderizar um gradiente tão
suave. A partir daqui a textura é convenção da landing page.

Três decisões:

- **`feTurbulence` inline, não um PNG.** Zero requisições, zero bytes no
  repositório, escala sem perda. O tile é de 180 px e se repete, então o
  navegador rasteriza uma vez em vez de gerar ruído para a viewport inteira.
- **Sem `mix-blend-mode`.** Os modos usuais (`overlay`, `soft-light`) são
  neutros em cinza-médio: sobre branco não fariam nada, e boa parte da página é
  branca. Sem blend, o mesmo tile escurece o branco e clareia o roxo.
- **Abaixo do header.** Fica em `z-index: 40` contra os `z-50` do header, que
  por isso nunca recebe grão — inclusive ao rolar.

A opacidade é 3%: move os canais em ±1,5%, o que aparece como textura sem
competir com o texto. Para alterar só num trecho, use a custom property em vez
de editar a classe:

```tsx
<NoiseOverlay />                              {/* página inteira */}
<div style={{ "--nu-grain-opacity": 0.05 }} /> {/* mais presente */}
```

---

## Acessibilidade

- HTML semântico: `header` / `nav` / `main` / `section` / `footer`, um `h1`,
  `lang="pt-BR"`.
- Link "Pular para o conteúdo" como primeiro elemento focável.
- `alt` em todas as imagens; nenhum link sem nome acessível.
- Foco visível com anel branco de 3 px, que contrasta sobre o gradiente.
- Respeito a `prefers-reduced-motion` (ver acima).
- **Sem formulários, sem telemetria, sem requisições a terceiros.**

### Contraste

Medido por script, interpolando os stops do gradiente na posição real de cada
texto (não por amostragem de pixel, que erra em gradientes):

| Elemento | Razão | WCAG AA |
|---|---|---|
| Título (96 px bold) | 6,03:1 | ✅ (precisa 3:1) |
| Itens do menu | 5,96:1 | ✅ |
| CTA sólido (`#820ad1` sobre `#f3e8ff`) | 6,11:1 | ✅ |
| Subtítulo (16 px) | 5,52:1 | ✅ |
| CTA "Explore o Universo Nu" (16 px) | 4,98:1 | ✅ |
| Aviso legal no rodapé | 17,01:1 | ✅ |

Todos passam. Para chegar nisso foram duas mudanças além das paradas do
gradiente: o subtítulo e o CTA fantasma passaram de `Action/action-secondary`
(`#f3e8ff`) para branco puro. Sobre roxo a diferença visual é imperceptível,
mas o branco rende ~0,5:1 a mais.

**A Ecossystem Section tem uma exceção, e ela é do design:** a descrição do card
do Croma é `Background/bg-brand` sobre um gradiente creme e chega a **3,48:1** na
ponta direita — passa em texto grande, reprova em texto pequeno, e a descrição
tem 16 px. Implementado como o Figma pede; a discussão está na seção do
Ecossystem.

**A Solutions Section não tem nenhuma.** Os cinco textos medem de 6,21:1 a
6,67:1 com o grão ligado — a tabela está na seção da Solutions.

### Cards Section

Medido no render de produção, **com o grão ligado** (0.12), que é o estado que o
usuário vê. O método apaga a tinta do texto e fotografa a mesma região, para
medir o que está de fato atrás do glifo:

**Nubank** (`97:2`):

| Elemento | Razão | Mínimo | |
|---|---|---|---|
| Título 64 px (texto grande) | 5,00:1 | 3:1 | ✅ |
| Descrição 16 px | 12,65:1 | 4,5:1 | ✅ |
| Nome no cartão 17,4 px | 4,89:1 | 4,5:1 | ✅ |
| CTA 16 px | 6,53:1 | 4,5:1 | ✅ |
| Pílula ativa 16 px | 6,57:1 | 4,5:1 | ✅ |
| **Pílula inativa 16 px** | **4,40:1** | 4,5:1 | ⚠️ **reprova** (nº 12) |

**Croma** (`103:248`):

| Elemento | Razão | Mínimo | |
|---|---|---|---|
| Título 64 px (texto grande) | 12,80:1 | 3:1 | ✅ |
| Descrição 16 px | 4,62:1 | 4,5:1 | ✅ |
| **Nome no cartão 17,4 px** | **4,12:1** | 4,5:1 | ⚠️ **reprova** (nº 15) |
| CTA 16 px | 6,53:1 | 4,5:1 | ✅ |
| Pílula ativa 16 px | 5,58:1 | 4,5:1 | ✅ |
| **Pílula inativa 16 px** | **2,44:1** | 4,5:1 | ⚠️ **reprova** (nº 14) |

**Ultravioleta** (`103:318`):

| Elemento | Razão | Mínimo | |
|---|---|---|---|
| Título 64 px (texto grande) | 5,55:1 | 3:1 | ✅ |
| Descrição 16 px | 5,97:1 | 4,5:1 | ✅ |
| **Nome no cartão 17,4 px** | **1,93:1** | 4,5:1 | ⚠️ **reprova** (nº 16) |
| CTA 16 px | 12,37:1 | 4,5:1 | ✅ |
| Pílula ativa 16 px | 12,68:1 | 4,5:1 | ✅ |
| Pílula inativa 16 px | 7,10:1 | 4,5:1 | ✅ |

**Empresas** (`103:383`) — **todas passam**:

| Elemento | Razão | Mínimo | |
|---|---|---|---|
| Título 64 px (texto grande) | 5,93:1 | 3:1 | ✅ |
| Descrição 16 px | 5,93:1 | 4,5:1 | ✅ |
| Nome no cartão 17,4 px | 13,62:1 | 4,5:1 | ✅ |
| CTA 16 px | 6,53:1 | 4,5:1 | ✅ |
| Pílula ativa 16 px | 6,57:1 | 4,5:1 | ✅ |
| Pílula inativa 16 px | 5,76:1 | 4,5:1 | ✅ |

**Empresas é o único pilar sem nenhuma reprovação**, e não por acaso: é o único
com fundo claro. A pílula inativa roxa sobre branco dá 5,76:1, enquanto a mesma
tinta sobre o lilás do Nubank dá 4,40:1 e sobre o creme do Croma dá 2,44:1.

O Ultravioleta é o **único em que a pílula inativa passa entre os coloridos**, e
com folga, porque ela é branca sobre roxo escuro.

**O nome em gradiente do Ultravioleta é a pior reprovação do projeto (nº 16).**
O texto é `background-clip: text` indo de `Neutral/400` (`#9ca3af`) a
`Neutral/100` (`#f3f4f6`), e o primeiro vale **0,81826%** do gradiente — está
quase no fim da rampa, sobre a parte mais clara do cartão. O par medido é
`#9ca3af` sobre `rgb(159,62,228)`, que dá **1,93:1**.

Registrado como está, e o número é保守 por construção: a sonda emparelha a
**parada mais escura** do gradiente com o **pior pixel de fundo** da caixa do
nome, como faz com qualquer outro alvo. Mesmo o outro extremo, o `#f3f4f6` sólido,
daria 4,45:1 contra esse mesmo fundo — ou seja, **as duas pontas da rampa
reprovam**.

**A pílula inativa do Nubank é a reprovação nº 12, e é por 0,10:1.** As três
causas, separadas por medição:

| Origem | Razão |
|---|---|
| Design puro, no export do Figma | ≈ 4,93:1 |
| Nosso render, **sem** grão | 4,64:1 |
| Nosso render, **com** grão 0.12 | 4,40:1 |

Ou seja: **o design passa com 0,43 de folga, e o grão come 0,24 disso.** Não é
tom errado nem tinta errada — é `#820ad1` sobre a parte mais clara do gradiente
da seção, que dá `#e1dcf6` na altura em que as pílulas ficam.

O texto é 16 px, então o mínimo é 4,5:1. Implementado como o Figma pede e
registrado como pendência. As saídas são todas de design, não de código: um
fundo próprio na pílula inativa, ou rever a cor do texto nela.

### CTAs da header no estado condensado

Desvio consciente do design. Sobre o gradiente os dois botões seguem o Figma
(`#f3e8ff`). **Ao condensar**, sobre o branco do header, eles passam para a cor
da marca:

| | Transparente (sobre o gradiente) | Condensado |
|---|---|---|
| `Login Empresas` | borda + texto `#f3e8ff` | borda + texto `#820ad1` |
| `Quero ser Nubank` | fundo `#f3e8ff`, texto `#820ad1` | fundo `#820ad1`, texto `#ffffff` |

O motivo é que `#f3e8ff` sobre branco praticamente desaparece. Medido:

| Elemento | Razão | AA |
|---|---|---|
| `Quero ser Nubank` — texto branco sobre `#820ad1` | 7,21:1 | ✅ |
| `Quero ser Nubank` — hover, branco sobre `#6a08ad` | 9,33:1 | ✅ |
| `Login Empresas` — brand sobre o pior caso do header | 5,48:1 | ✅ |
| `Login Empresas` — brand sobre branco puro | 7,21:1 | ✅ |

O pior caso do texto do outline (5,48:1) considera `bg-white/85` do header
composto sobre a cor mais escura que passa por trás dele (`#ecdaf8`). Em
folha branca cheia o valor é 7,21:1.

---

## Conteúdo provisório

Nada foi inventado. Onde o Figma ainda não tem conteúdo, o código está marcado
com `PROVISÓRIO`:

- **Submenus da navegação.** O Figma mostra o caret, mas não tem o conteúdo.
  Cada item é um `<button>` real, focável, com `aria-disabled` e um aviso para
  leitor de tela — em vez de um botão que "não faz nada" em silêncio.
- **Menu mobile.** Ausente; depende dos painéis.
- **Seções seguintes** (`Porque a Nu`, `Cartões`, `Diferenciais`) — hoje existe
  um bloco "Em construção" só para o CTA "Explore o Universo Nu" ter destino.
- **Nenhum pilar do Ecossystem está faltando** — os quatro frames da seção estão
  desenhados no Figma (`52:3`, `76:3`, `77:40`, `80:77`) e os quatro abrem.
  A regra do bloco `active` ausente continua no `ecosystem-pillars.ts` porque é
  ela que impede a próxima adição de virar conteúdo inventado por omissão.
- **A Cards Section está completa** — os quatro frames (`97:2`, `103:248`,
  `103:318`, `103:383`) estão liberados, as quatro pílulas trocam e nenhuma fica
  `aria-disabled`. A virada foi verificada com os quatro, inclusive nos saltos
  que forçam a troca do slot escondido, em Chrome e Firefox, movimento normal e
  reduzido.
- **A Solutions Section está no primeiro frame** — o `144:2` (Caixinhas) está
  liberado e as outras três pílulas são botões desativados com aviso para
  leitor de tela. É decisão de processo, não falta de design: os quatro frames
  existem no Figma, três deles ocultos.
- **Texto do rodapé** com o aviso legal — redigido para este estudo.

Além disso, **não há** números de usuários, taxas, limites, depoimentos nem
qualquer afirmação factual sobre a Nu. Se forem necessários, devem vir do
Figma ou ser fornecidos por você.

---

## Aviso legal

Este repositório é um **estudo de portfólio**, sem vínculo com a Nu Pagamentos
S.A. Nubank é marca registrada de seus respectivos donos. O layout e as cores
foram reproduzidos a partir de um arquivo autoral no Figma, apenas para fins
de aprendizado. Não há vínculo comercial, não há captação de dados e nenhum
formulário envia ou armazena informações.

Os CTAs apontam para `https://www.nubank.com.br/` e são apenas links
redirecionadores — esta página não tem função de cadastro.

---

## Notas técnicas

- **Geometria dos cartões em `cqw`**: o wrapper nativo do Figma posiciona os
  cards por valores absolutos. Em vez de copiar isso, convertemos para
  unidades de container, o que mantém a composição proporcional em qualquer
  largura.
- **Logo da marca** é rasterizada em dois PNGs a partir do SVG do Figma:
  `nu-logo-light.png` (`#f3e8ff`, header transparente) e `nu-logo-dark.png`
  (`#1c1c1e`, header sólido). As duas cores são exatamente as que o logo tinha
  como `currentColor` nos dois estados, então a aparência não muda.

  As duas imagens ficam no DOM e o CSS troca a visibilidade com
  `group-data-[condensed]`. Trocar o `src` no scroll faria o logo piscar
  enquanto o novo arquivo decodifica.

  Isso é o desvio consciente de uma convenção do projeto, e a tentativa tem
  história. A primeira abordagem era `mask-image` sobre o SVG de `/public`, para
  acompanhar `currentColor`; a segunda foi o SVG inline com
  `fill="currentColor"`. **As duas piscavam** no fim da animação de entrada do
  header. O ancestral do logo é animado (transform + opacity), e tanto a
  máscara quanto o vetor são rasterizados de novo quando essa camada é
  recomposta — o frame chega sem a forma desenhada. Com `will-change` no
  elemento não resolveu, porque o gatilho é o ancestral, não o logo. Um PNG já
  rasterizado não passa por esse caminho: a camada carrega os pixels prontos.

  O SVG original continua em `public/images/brand/nu-logo.svg` como fonte, e é
  de onde os PNGs saem. Para regerar em outro tamanho, basta renderizar o SVG em
  Chrome headless com `--default-background-color=00000000` e `--window-size`
  nas dimensões desejadas.
- **Assets**: os SVGs e as artes foram exportados do Figma e salvos em
  `public/`. Os PNGs dos cartões foram convertidos para WebP (4.370 KB → 341 KB,
  **−92,2%**). Os quatro fundos da Solutions Section também: 19,4 MB → 736 KB
  (**−96,3%**), com erro médio de 1,3 nível e sem banding — as gradientes
  suaves são o caso mais desfavorável para WebP lossy, e foi por isso que a
  qualidade 86 foi conferida pixel a pixel. O comando:

  ```bash
  node -e "const s=require('sharp');const f=require('fs');\
  for(const n of f.readdirSync('public/images/backgrounds').filter(x=>x.endsWith('.png')))\
  s('public/images/backgrounds/'+n).webp({quality:86,effort:6})\
  .toFile('public/images/backgrounds/'+n.replace(/\.png$/,'.webp'))"
  ```
- **Ícone do app** (`src/app/icon.svg`) é um quadrado placeholder na cor da
  marca. O definitivo deve ser exportado do Figma.
- **Contraste de botões**: `leading-normal` do Tailwind vale 1,5 e deixaria os
  CTAs com 44 px; o Figma usa a altura natural do Montserrat, então usamos
  `leading-[1.25]` (40 px).
- **Auditoria**: `npm audit` reporta 5 vulnerabilidades de severidade alta na
  cadeia `braces → micromatch → fast-glob → eslint-config-next`. São
  dependências de **desenvolvimento** do ESLint e não chegam à build. O
  `npm audit fix --force` resolveria rebaixando o Next para a v14 — não foi
  aplicado.

---

## Próximos passos

1. **A Solutions Section está completa** — os quatro frames (`144:2`, `151:92`,
   `153:125`, `153:167`) estão liberados, as quatro opções trocam, e o
   carrossel vai e volta. O próximo bloco é a navegação.
2. Decidir as quatro reprovações de contraste da Cards Section, que são **do
   design** e estão implementadas como o Figma pede: nº 12 (pílula inativa do
   Nubank, 4,40:1), nº 14 (pílula inativa do Croma, 2,44:1), nº 15 (nome no
   cartão do Croma, 4,12:1) e nº 16 (nome em gradiente do Ultravioleta, 1,93:1 —
   a pior do projeto).
3. Decidir o que fazer com o contraste da descrição do Croma (3,48:1 em 16 px) —
   hoje segue o Figma, e é o único texto do Ecossystem que não passa em AA.
4. Desenhar no Figma as seções `Porque a Nu` e `Diferenciais` (a de `Cartões` já
   começou, na Cards Section).
5. Revisar o texto do rodapé e a composição mobile dos cards.
6. Exportar o ícone do app definitivo do Figma.