# Contexto do projeto

> **Para o agente (leia no início de cada sessão).** Este arquivo é a memória do
> projeto. Antes de propor qualquer coisa: leia `README.md` (estado e decisões
> técnicas), depois este arquivo (estado atual e o que está em aberto). Ao final
> de uma sessão de trabalho relevante, atualize a seção **Registro de sessões** e
> o **Próximo passo** — não deixe o arquivo defasado.

- **Projeto:** landing page de estudo da Nu, reconstruída a partir de um design
  autoral no Figma. Sem vínculo oficial com a Nu Pagamentos.
- **Figma:** https://www.figma.com/design/16kp2jwaILwDfp44uYuNkP
- **Frame implementado:** `Hero Section` (node `14:446`, 1920×1080)
- **Produção:** https://nubank-landing-estudo.vercel.app
- **Repositório:** https://github.com/nissopaulo/nubank-landing-estudo

---

## Estado atual

Uma única tela implemented e funcionando: a Hero, com header fixo, cards em
parallax e rodapé. Abaixo dela existe um bloco **"Em construção"** que é
provisório e existe só para o CTA "Explore o Universo Nu" ter destino.

| | |
|---|---|
| Stack | Next.js 16.4 (App Router, Turbopack), React 19.3, TS, Tailwind v4, Motion 14, Phosphor Icons |
| Tipografia | Montserrat (única fonte), `next/font` self-hosted |
| Ícones | Phosphor Icons; só o logo da marca é SVG do Figma |
| Qualidade | `tsc --noEmit` e `eslint` passam limpos (verificado 2026-10-16) |

---

## Decisões já tomadas (o "porquê" importa mais que o "o quê")

1. **Nada de conteúdo inventado.** Onde o Figma não tem conteúdo, o código é
   marcado `PROVISÓRIO` em comentário. Nada de números de usuários, taxas,
   limites ou depoimentos — se precisar, tem que vir do Figma ou do usuário.
2. **Botão que não faz nada não existe em silêncio.** Os itens de nav com caret
   viraram `<button>` reais com `aria-disabled` e aviso para leitor de tela.
3. **Gradiente: paradas trocadas, cores intactas.** `0/25/75/100` →
   `0/52/86/100`. Com as originais o texto de 16 px na metade inferior da Hero
   caía para 2,74:1 e 2,32:1 (mínimo AA = 4,5:1). Adiar o clareamento resolveu.
   As quatro cores continuam sendo exatamente as do design. Está documentado que,
   se o usuário preferir fidelidade máxima, dá para voltar — e aceitar as falhas.
4. **Medir contraste por interpolação do gradiente**, não por amostragem de
   pixel (erra em gradientes). Razão mínima em texto pequeno: 4,5:1.
5. **`prefers-reduced-motion` via `<MotionConfig reducedMotion="user">`**, nunca
   via `useReducedMotion()` dentro dos componentes — esse hook diverge entre
   servidor e cliente e quebra a hidratação.
6. **Cards em `cqw` + `aspect-ratio`**, nunca pixel absoluto: escala sem distorcer
   em proporção diferente de 16:9. A bbox do card já é rotacionada, então a arte
   usa `height: <fração>%`.
7. **Composição mobile dos cards é decisão de layout, não do design.** O Figma só
   define 1920×1080; abaixo de 1024 px os quatro cards ficam ilegíveis, então o
   CSS troca para dois maiores e mais baixos.
7b. **Desvio consciente: cards 160 px mais abaixo.** `mt-40` em `.card-art`
   baixa a arte dentro da bbox. É decisão do usuário, não do Figma — a tabela de
   fidelidade do README (y 842,24 / 693,43 / 705,61 / 814,86) **não** descreve
   mais o que está na tela. `mt-40` é px fixo e vale para todos os breakpoints,
   enquanto a geometria dos slots é `cqw`/%; conferir o resultado no mobile.
8. **Movimento é autoria nossa.** `get_motion_context` do Figma retorna vazio —
   entrada em cascata, parallax de rolagem e ponteiro, header que condensa.
9. **Nenhum path de SVG copiado para dentro do código.** Logo e ícones entram
   como asset ou componente.
10. **Escopo de portfólio, não de produção.** Sem backend, sem analytics, sem
    requisições a terceiros. CTAs são links redirecionadores para nubank.com.br.

---

## Em aberto

| # | Pendência | Onde |
|---|---|---|
| 1 | **Desenhar no Figma os painéis dos submenus da navegação.** É o próximo passo combinado. | `SiteHeader.tsx` |
| 2 | Desenhar no Figma as seções `Porque a Nu`, `Cartões`, `Diferenciais` | `SiteFooter.tsx` (`PendingSections`) |
| 3 | Menu mobile (depende do nº 1) | `SiteHeader.tsx` |
| 4 | Exportar do Figma o ícone do app definitivo (hoje é um quadrado placeholder) | `src/app/icon.svg` |
| 5 | Revisar texto do rodapé e a composição mobile dos cards com o usuário | — |
| 6 | Limpar comentário desatualizado em `HeroSection.tsx` — ainda cita `Neutral/200`, 2,74:1 e "ainda não atinge 4.5:1". O estado real é branco puro a 5,52:1, passando AA | `src/components/hero/HeroSection.tsx` |

**No Figma hoje só existe o frame `Hero Section`** (mais os 4 frames soltos de
arte dos cartões). Não há design das seções seguintes — por isso os itens 1 e 2
bloqueiam o resto.

### Antes de sugerir código

- Este é o **Next.js 16**, não o que veio no treinamento. Ler o guia relevante em
  `node_modules/next/dist/docs/` antes de escrever qualquer coisa.
- Qualquer valor novo que venha do Figma precisa ser rastreável à origem (node id,
  nome da variável). `README.md > Fidelidade medida contra o Figma` é o padrão.
- Não quebrar as garantias já pagas: contraste AA medido, sem hydration mismatch,
  sem `aria-disabled` silencioso, sem conteúdo inventado.

---

## Registro de sessões

### 2026-10-16 — fim de tarde (revisão de contexto)

Retomada após a última sessão. Situação: dois commits na noite anterior
(15→16/10), árvore limpa, lint e tipos OK.

- `14c22a4` — **Hero Section** (node `14:446`) implementada do zero: tokens do
  Figma em `globals.css`, Montserrat + Inter via `next/font`, cards convertidos de
  pixel absoluto para `cqw`, entrada escalonada, parallax de rolagem e ponteiro,
  header que condensa, `prefers-reduced-motion` sem quebrar hidratação, HTML
  semântico com skip link.
- `1c94c4a` — **Montserrat em todo o projeto** (Inter removido: era a única
  referência a Inter no design inteiro), **Phosphor Icons** no lugar dos SVGs de
  caret, **correção das duas falhas de contraste AA** (paradas do gradiente +
  subtítulo e CTA fantasma para branco puro), e `src/app/icon.svg` placeholder
  para matar o 404 de `/favicon.ico`.

Ambos os commits revisam o README inteiro junto — ele é a fonte da verdade do
estado do projeto, não um documento decorativo.

**Onde paramos:** a Hero está fechada e polida. O gargalo não é mais código, é
**design**: nada existe no Figma além da Hero, e o próximo passo combinado era
os painéis dos submenus da nav (itens `for-you` / `17:469`–`17:462`, que já têm
os carets mas nenhum conteúdo).

**Seleção do Figma no momento da retomada:** `17:470` — o texto "Para Você",
primeiro item da navegação. Indica que o trabalho seguinte é justamente o item
de pendência nº 1.

**Próximo passo sugerido:** desenhar os quatro painéis de submenu no Figma e,
em seguida, implementá-los em `SiteHeader.tsx` (substituindo `NAV_ITEMS` /
`aria-disabled` por painéis reais). Enquanto isso não existir, o item 6 da lista
de pendências (comentário desatualizado em `HeroSection.tsx`) é o único limpeza
de código que dá para fazer sem esperar o Figma.

### 2026-10-16 — ajuste visual nos cards + memória do projeto

- **Ajuste do usuário:** `mt-40` em `.card-art` (`CardsShowcase.tsx:94`) para
  baixar a arte dos cards dentro da bbox. Lint e tipos passam.
  ⚠️ `mt-40` são 160 px **fixos**, aplicados também abaixo de 1024 px — onde os
  slots usam `top: 82%/86%` da altura da Hero. 160 px ali é ~43% da largura de
  um celular e pode empurrar os cards para fora da dobra. **Conferir no mobile**;
  se estiver ruim, a correção é `lg:mt-40` (só no desktop).
- **Memória do projeto criada:** `CONTEXTO.md` na raiz + ponteiro no `AGENTS.md`
  instructing o agente a lê-lo no início de cada sessão. Passa a ser o lugar
  onde registrar decisões, pendências e histórico de sessão.