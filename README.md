# Nubank — Landing Page (estudo)

> **Projeto de estudo / portfólio. Não é um site oficial nem afiliado à
> Nubank.** Ver [Aviso legal](#aviso-legal).

Landing page de página única, reconstruída a partir de um design autoral feito
no Figma, com foco em movimento e hierarquia visual no espírito Apple.

- **Figma:** https://www.figma.com/design/16kp2jwaILwDfp44uYuNkP
- **Frame implementado:** `Hero Section` (node `14:446`, 1920×1080),
  `Ecossystem Section` (nós `52:3`–`80:77`, 1920×919) e `Cards Section`
  (nó `97:2`, 1920×1086 — só o frame do Nubank, por enquanto)

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
    site/
      SiteHeader.tsx   cabeçalho fixo, condensa ao rolar
      SiteFooter.tsx   rodapé + aviso legal + seções pendentes
      NoiseOverlay.tsx grão de textura sobre a página inteira
    ui/
      CtaLink.tsx      botão/link de CTA
    motion-provider.tsx MotionConfig reducedMotion="user"
  lib/
    hero-cards.ts      geometria dos cards lida do Figma
    card-showcase.ts   cartões e conteúdo da Cards Section
    ecosystem-pillars.ts  pilares e conteúdo do card ativo
    motion.ts          durações, curvas e variantes compartilhadas
    use-prefers-reduced-motion.ts
public/images/
  brand/               logo e carets (SVG exportados do Figma)
  cards/               artes dos cartões da Hero (WebP)
  credit-card/         peças do cartão de crédito (SVG do Figma)
  peoples/             recorte de cada pilar (WebP, alfa)
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

Figma `Cards Section - Nubank` (nó `97:2`), 1920×1086. Um seletor de pílulas
(Nubank · Croma · Ultravioleta · Empresas), o cartão de crédito, o nome, a
descrição e o CTA. **Só o frame do Nubank está liberado**: os outros três
existem no arquivo (nós `103:248`, `103:318` e `103:383`) e estão ocultos, e o
trabalho é feito um frame por vez.

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

#### Quem manda na pintura é a fase, não o ângulo

`angulo` é o valor **alvo**: no começo da primeira metade ele já vale 90°, com a
peça ainda em 0°. Derivar a face dele trocava a pintura no primeiro quadro e a
peça mostrava o verso de costas durante toda a fase 1. Quem manda é `fase`; o
ângulo só decide em repouso, onde é múltiplo de 180.

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
| Seletor | 4 pílulas, gap 24, py 10 | idem |

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

### Cards Section

Medido no render de produção, **com o grão ligado** (0.12), que é o estado que o
usuário vê. O método apaga a tinta do texto e fotografa a mesma região, para
medir o que está de fato atrás do glifo:

| Elemento | Razão | Mínimo | |
|---|---|---|---|
| Título 64 px (texto grande) | 5,00:1 | 3:1 | ✅ |
| Descrição 16 px | 12,65:1 | 4,5:1 | ✅ |
| Nome no cartão 17,4 px | 4,89:1 | 4,5:1 | ✅ |
| CTA 16 px | 6,53:1 | 4,5:1 | ✅ |
| Pílula ativa 16 px | 6,57:1 | 4,5:1 | ✅ |
| **Pílula inativa 16 px** | **4,40:1** | 4,5:1 | ⚠️ **reprova** |

**A pílula inativa é a única reprovação da seção, e é por 0,10:1.** As três
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
- **Três cartões da Cards Section** — os frames `103:248` (Croma), `103:318`
  (Ultraviolet) e `103:383` (Business) existem no Figma e estão ocultos, por
  decisão de processo: a seção é feita um frame por vez. As três pílulas
  restantes aparecem no seletor e são `<button>` com `aria-disabled` e aviso
  para leitor de tela. **A virada entre cartões foi verificada** entre os dois
  frames liberados — meia-volta de um cartão só, medida nos dois sentidos, com a
  curva em `CARD_FLIP`, a inclinação estável **durante** o giro e a seção
  responsiva em movimento normal e reduzido.
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
  **−92,2%**).
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

1. Liberar o terceiro frame da Cards Section (`103:318`, Ultravioleta) — a
   virada já aceita um terceiro cartão: só o slot **escondido** troca, e a
   troca não aparece porque ele está de costas.
2. Desenhar no Figma os painéis dos submenus da navegação — é o bloqueio do
   restante da página.
3. Decidir o contraste da pílula inativa da Cards Section (4,40:1 em 16 px).
4. Decidir o que fazer com o contraste da descrição do Croma (3,48:1 em 16 px) —
   hoje segue o Figma, e é o único texto do Ecossystem que não passa em AA.
5. Desenhar no Figma as seções `Porque a Nu` e `Diferenciais` (a de `Cartões` já
   começou, na Cards Section).
6. Revisar o texto do rodapé e a composição mobile dos cards.
7. Exportar o ícone do app definitivo do Figma.