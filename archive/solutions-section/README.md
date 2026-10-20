# Solutions Section — código arquivado

> **Arquivado em 2026-10-20.** A seção saiu da página: o resultado não foi
> aprovado, e a ideia é trabalhar a seção de outra forma. O código fica aqui
> **commitado, apenas para reaproveitar caso precise** — não é compilado, não é
> lintado e não faz parte da build.

## O que é isto

A implementação da seção "Solutions" (o carrossel de soluções) como ela ficou
depois de várias rodadas de ajuste. Três arquivos:

| arquivo | o que é |
|---|---|
| `SolutionsSection.tsx` | a seção: o carrossel, o seletor de pílulas, o parallax |
| `use-background-parallax.ts` | o hook da arte que segue o ponteiro |
| `solutions.ts` | os dados das quatro opções e a geometria dos slots |
| `motion.ts` | o `BACKGROUND_PARALLAX` e o `SOLUTIONS_SLIDE` (eram do `src/lib/motion.ts`) |
| `sol-arte.css` | a regra `.sol-arte` (a transição do quadro), que saiu do `globals.css` |

## O que a implementação tem de bom

Não é o resultado que foi aprovado, mas há coisas aqui que **custaram
medição** e que valem ser reaproveitadas:

- **A prévia É a janela encolhida.** 1308,889 / 1520 = 620 / 720 = **0,861111**,
  e o recorte da arte dentro da prévia é o da janela escalado pelo mesmo número
  — delta **0,000** nos quatro valores, nos quatro frames do Figma. Uma prévia
  não é uma "miniatura" desenhada à mão: é a janela encolhida. E o raio 21,528
  das prévias é 25 × 0,861111, o mesmo número.
- **A composição é um componente só** (arte + badge + painel no mesmo quadro de
  1520 × 720). O badge não está "atrelado" à arte por cálculo de posição: está
  **dentro** do quadro dela, e por isso não tem como ficar para trás.
- **O carrossel nunca salta, ele rola.** Clicar na terceira opção a partir da
  primeira rola, um degrau por vez, e cada degrau é a mesma transição de um
  degrau. É o que elimina as composições se cruzando no meio da janela.
- **A curva**: `cubic-bezier(0.6, 0.05, 0.3, 1)`, 1000 ms. A anterior
  (`EASE_EMPHASIZED`) fazia 78% do caminho no primeiro quarto do tempo — uma
  arrancada seguida de meio segundo de arrasto.
- **O desfoque é local**: 5,001 no espaço do quadro, que escalado por 0,861111 dá
  4,306 na tela — o número do Figma.

O histórico das medições está no `CONTEXTO.md`, nas sessões de 2026-10-20.

## Como trazer de volta

> **Atenção ao nome `solutions.ts`.** A Solutions Section **nova** (o quadro
> `178:205`, de 2026-10-20) já usa `src/lib/solutions.ts` — com outro formato
> e outro conteúdo. Trazer esta de volta exige **renomear** uma das duas (por
> exemplo `solutions-carrossel.ts`) antes de copiar.

1. Mova os quatro `.ts`/`.tsx` de volta para `src/`:
   - `SolutionsSection.tsx` → `src/components/solutions/`
   - `use-background-parallax.ts` → `src/components/solutions/`
   - `solutions.ts` → `src/lib/` (renomeado, ver o aviso acima)
   - `motion.ts` → `src/lib/` (ou o `BACKGROUND_PARALLAX` volta para o
     `src/lib/motion.ts` e o `use-background-parallax.ts` importa dele)
2. Copie o `sol-arte.css` para dentro do `globals.css` (a regra precisa ficar
   na camada de utilitários do Tailwind).
3. Importe e renderize a seção em `src/app/page.tsx`.
4. Tire o `"archive"` do `exclude` do `tsconfig.json` e o `"archive/**"` do
   `globalIgnores` do `eslint.config.mjs`.

Os **assets** que esta seção lia eram quatro WebP em
`public/images/backgrounds/` — e **foram removidos** em 2026-10-20, quando a
seção nova substituiu a antiga. As artes de hoje (`piggybank-bg`,
`account-bg`, `advance-bg`, `more-bg`) são de outro quadro, com outro
recorte, e não servem para o carrossel: ele precisa das artes dos nós
`145:33`, `149:37`, `149:38` e `150:39`, reexportáveis do Figma.

## O que ficou no projeto (e é reaproveitável em qualquer lugar)

- **O seletor de pílulas** — `src/components/ui/PillTab.tsx` e a regra
  `.pill-tab` no `globals.css` — **continua no projeto**: a Cards Section usa,
  e a Solutions Section **nova** também. Ele já tem a compensação de padding
  que faz a pílula bater com o Figma (17 em vez de 18, porque o `border` do
  CSS soma na caixa e o traço do Figma não).
- **O `SOLUTIONS_CROSSFADE`**, em `src/lib/motion.ts`, é o cross-fade da
  seção nova. O `SOLUTIONS_SLIDE` daqui é o deslize do carrossel antigo, e
  não é usado por ninguém.
