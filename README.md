# Nubank — Landing Page (estudo)

> **Projeto de estudo / portfólio. Não é um site oficial nem afiliado à
> Nubank.** Ver [Aviso legal](#aviso-legal).

Landing page de página única, reconstruída a partir de um design autoral feito
no Figma, com foco em movimento e hierarquia visual no espírito Apple.

- **Figma:** https://www.figma.com/design/16kp2jwaILwDfp44uYuNkP
- **Frame implementado:** `Hero Section` (node `14:446`, 1920×1080)

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
    ecosystem-pillars.ts  pilares e conteúdo do card ativo
    motion.ts          durações, curvas e variantes compartilhadas
    use-prefers-reduced-motion.ts
public/images/
  brand/               logo e carets (SVG exportados do Figma)
  cards/               artes dos cartões (WebP)
  peoples/             recorte de cada pilar (WebP, alfa)
```

---

## Design tokens

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

Figma `Ecossystem Section - Nubank` (nó `52:3`, 1920×919). Carrossel de pilares:
um aberto por vez, o resto recolhido com o nome lido de baixo para cima.

### Só o Nubank está desenhado

O Figma tem **um** frame visível — o Nubank, na estrutura nova — e três ocultos
(`76:3` Croma, `77:40` Ultraviolet, `80:77` Business) que ainda estão na estrutura
antiga, que é a que este projeto descartou. Então o carrossel e os quatro pilares
existem, e **só o primeiro abre**.

Os três recolhidos são botões de verdade com `aria-disabled` e aviso para leitor
de tela — a mesma regra dos itens da navegação: um botão que não faz nada não
existe em silêncio. **Nada foi inventado** para eles: nome e foto vieram do
Figma e dos assets, e não há descrição, parágrafo nem CTA porque ainda não
existem no design. Quando os três forem redesenhados, o que entra é um
`useState` com o índice e um `onClick` no botão — o `key` do `AnimatePresence`
já está lá, e é ele que faz a troca reaproveitar a animação.

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

### Fidelidade medida contra o Figma (nó `52:3`)

Comparação pixel a pixel entre o render do frame e o build de produção, ambos
normalizados na grade de 1920×919:

| Elemento | Figma | Implementado |
|---|---|---|
| Título da seção | x 202,8 · y 117,6 · 520,8×122,4 | x 202 · y 117 · 521×123 |
| Card ativo | x 200,4 · y 356,4 · 1162,8×338,4 | x 200 · y 356 · 1163×339 |
| Card recolhido 1 | x 1375,2 · 106,8 de largura | x 1375 · 107 |
| Card recolhido 2 | x 1494 · 106,8 | x 1494 · 107 |
| Card recolhido 3 | x 1612,8 · 108 | x 1613 · 107 |
| Botão do CTA | x 1496,4 · y 759,6 · 223,2×39,6 | x 1500 · y 759 · 220×40 |
| Parágrafo | 3 linhas a partir de y 763 | 3 linhas a partir de y 762 |

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

Todo o resto é branco:

| Texto | Cor | Contraste |
|---|---|---|
| Título da seção | `Text/text-brand` `#820ad1` | 6,59:1 sobre branco |
| Nome no card ativo | branco | 5,95:1 no pior ponto do gradiente |
| Descrição no card ativo | branco | 5,95:1 |
| Parágrafo ao lado do CTA | `Text/text-tertiary` `#6b7280` | 4,83:1 |
| Rótulo do card recolhido | `Neutral/800` `#1c1c1e` | 13,74:1 sobre `#e5e7eb` |

**O tertiary não serve sobre o gradiente do card.** Ele chega a 1,23:1 no pior
ponto da área da descrição, e 1,93:1 no melhor — nenhum canto passa. Não é
ajuste de tom: para chegar a 4,5:1 o texto precisaria de luminância ≈ 0,72, um
cinza visualmente indistinguível do branco. Houve uma tentativa de colocá-lo ali
por leitura equivocada do pedido, e foi revertida.

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
mesmas coordenadas do Figma (`left-210px top-0`), convertidas em fração da
largura dele para escalarem sem distorcer. A altura não é declarada de propósito:
o asset é 2400×1792, e 1129 px de largura dá 842,99 px de altura — que é o
`h-[842.987px]` do design, com a proporção garantida pela própria imagem.

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

`:focus-visible` entra junto do `:hover` nos dois botões, senão quem navega por
teclado fica sem o feedback. O card ativo não é interativo, então nele só o
`:hover`.

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
   tópico troca (ver a seção do Ecossystem).

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

O caminho de saída (`exit`, desce e some) ainda **não roda** — só existe um pilar
desenhado. Ele fica pronto para quando os outros três entrarem, e é a única
parte da animação que precisa de olho humano.

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
- **Os três pilares recolhidos do Ecossystem** — Croma, Ultravioleta e Empresas
  já existem no carrossel com nome e foto, mas o Figma só tem o frame do Nubank.
  Não há descrição, parágrafo nem CTA para eles, e nenhum foi inventado.
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

1. Desenhar no Figma os três pilares restantes da Ecossystem Section (Croma,
   Ultravioleta, Empresas) na estrutura nova — e então ligá-los ao carrossel.
2. Desenhar no Figma os submenus da navegação e as seções restantes.
3. Revisar o texto do rodapé e a composição mobile dos cards.
4. Exportar o ícone do app definitivo do Figma.

## Deploy

| | |
|---|---|
| Repositório | https://github.com/nissopaulo/nubank-landing-estudo |
| Produção | https://nubank-landing-estudo.vercel.app |

O projeto está ligado ao GitHub na Vercel: a branch `main` gera produção e
cada pull request gera um preview próprio. Os previews por deployment exigem
login (Vercel Authentication); a URL de produção é pública.