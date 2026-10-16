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
    hero/
      HeroSection.tsx  seção da Hero (node 14:446)
      CardsShowcase.tsx composição de cards: entrada, parallax, ponteiro
    site/
      SiteHeader.tsx   cabeçalho fixo, condensa ao rolar
      SiteFooter.tsx   rodapé + aviso legal + seções pendentes
    ui/
      CtaLink.tsx      botão/link de CTA
    motion-provider.tsx MotionConfig reducedMotion="user"
  lib/
    hero-cards.ts      geometria dos cards lida do Figma
    motion.ts          durações, curvas e variantes compartilhadas
    use-prefers-reduced-motion.ts
public/images/
  brand/               logo e carets (SVG exportados do Figma)
  cards/               artes dos cartões (WebP)
```

---

## Design tokens

Todos os valores vêm das **variáveis do Figma** (nó `14:446`) e estão em
`src/app/globals.css`:

| Token | Valor | Origem no Figma |
|---|---|---|
| `--color-nu-brand` | `#820ad1` | `Action/action-secondary-text`, `Text/text-brand` |
| `--color-nu-action-surface` | `#f3e8ff` | `Action/action-secondary` |
| `--color-nu-action-text` | `#ffffff` | `Action/action-primary-text` |
| `--color-nu-purple-950/800/600/400` | `#2e1065` `#6a08ad` `#9b2fe8` `#c084fc` | `Purple/*` |
| `--color-nu-neutral-100/200/300/400/800` | `#f3f4f6` `#e5e7eb` `#d1d5db` `#9ca3af` `#1c1c1e` | `Neutral/*` |
| `--color-nu-text-primary` | `#111111` | `Text/text-primary` |
| `--color-nu-hero-stop-3` | `#d8b4fe` | lido direto do gradiente (não é token) |

Tipografia: **Montserrat** (títulos, navegação, botões) e **Inter** (corpo),
carregadas com `next/font` e servidas localmente — nenhuma requisição ao Google.

### Fidelidade medida contra o Figma

| Elemento | Figma | Implementado |
|---|---|---|
| Logo | x 200 · y 29.5 · 64×35 | idem |
| Título — topo | y 224 | y 224 |
| Título — altura | 234 (2 linhas) | 234,22 |
| Título — corpo/linha | 96 px / 117 | 96 px / 117,12 |
| Subtítulo | y 482 · alt. 19 | y 482,22 · alt. 19,19 |
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

### Mobile

O Figma só define 1920×1080. Abaixo de 1024 px, os quatro cartões com as
rotações originais ficam sobrepostos e ilegíveis, então `globals.css` troca
para dois cartões maiores e mais baixos. **Essa composição mobile é uma decisão
de layout, não um valor do design** — ajuste em `globals.css` à vontade.

---

## Movimento

O Figma **não define animação** (`get_motion_context` retorna vazio), então o
movimento foi desenhado aqui:

1. **Entrada** — cards sobem e assentam a rotação, em cascata.
2. **Parallax de rolagem** — a camada de cards desliza mais devagar que a página.
3. **Paralaxe de ponteiro** — deslocamento sutil na direção do cursor
   (apenas em dispositivos com ponteiro fino).
4. **Header** — condensa e ganha fundo ao rolar.
5. **Texto** — reveal escalonado com `cubic-bezier(0.16, 1, 0.3, 1)`.

### Movimento reduzido

Quem tem `prefers-reduced-motion` ativo no sistema não vê nenhum
deslocamento. Isso é feito com `<MotionConfig reducedMotion="user">`, e **não**
com `useReducedMotion()` dentro dos componentes: esse hook devolve `false` no
servidor e o valor real no cliente, e como o resultado vira HTML (`initial`,
condições de render), quebraria a hidratação. `lib/use-prefers-reduced-motion.ts`
usa `useSyncExternalStore` para ler a preferência sem divergência.

---

## Acessibilidade

- HTML semântico: `header` / `nav` / `main` / `section` / `footer`, um `h1`,
  `lang="pt-BR"`.
- Link "Pular para o conteúdo" como primeiro elemento focável.
- `alt` em todas as imagens; nenhum link sem nome acessível.
- Foco visível com anel branco de 3 px, que contrasta sobre o gradiente.
- Respeito a `prefers-reduced-motion` (ver acima).
- **Sem formulários, sem telemetria, sem requisições a terceiros.**

### Contraste — pendências conhecidas

Medido contra o gradiente real da Hero:

| Elemento | Razão | WCAG AA |
|---|---|---|
| Título (96 px bold) | 4,67:1 | ✅ (precisa 3:1) |
| Itens do menu no header | ~7,2:1 | ✅ |
| CTA sólido (`#820ad1` sobre `#f3e8ff`) | 6,1:1 | ✅ |
| Aviso legal no rodapé | 15,5:1 | ✅ |
| Subtítulo (16 px) | 3,39:1 | ❌ (precisa 4,5:1) |
| CTA "Explore o Universo Nu" (16 px) | 2,32:1 | ❌ (precisa 4,5:1) |

As duas falhas **não são defeito de implementação**: o gradiente do Figma
clareia demais na metade inferior da Hero, onde ficam textos de 16 px em cor
clara. Correções possíveis, nenhuma aplicada por alterarem o design:

1. **Deslocar as paradas do gradiente** — de `0 / 25 / 75 / 100` para algo como
   `0 / 45 / 82 / 100`. Mantém as quatro cores e o topo idêntico; só adia onde
   aclareia. Resolve o subtítulo; o CTA fantasma chega a ~3,5:1.
2. **Fundo no CTA fantasma** — um pílula translúcida branca atrás do texto.
   Passa com folga, mas muda o visual.
3. **Manter como está** — se a fidelidade ao Figma pesar mais que o AA.

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
- **Assets**: os SVGs e as artes foram exportados do Figma e salvos em
  `public/`. Nenhum path foi copiado para dentro do código. Os PNGs dos cartões
  foram convertidos para WebP (4.370 KB → 341 KB, **−92,2%**).
- **Ícones da marca** usam `mask-image` sobre o SVG original para acompanhar a
  cor do texto quando o header muda de transparente para sólido.
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

1. Desenhar no Figma os submenus da navegação e as seções restantes.
2. Decidir a questão do contraste (ver acima).
3. Revisar o texto do rodapé e a composição mobile dos cards.