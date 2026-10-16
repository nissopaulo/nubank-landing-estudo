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
7. **Desktop first; mobile está adiado por decisão do usuário (2026-10-16).** O
   Figma só tem 1920×1080 e o usuário vai desenhar a versão mobile lá. Até lá,
   **não investir em mobile**: não criar breakpoints, não refinar o CSS de
   telas estreitas, não auditar o layout em celular. Decisões e medidas devem
   ser tomadas no desktop e valem como referência; o comportamento em telas
   estreitas é considerado não projetado, não um bug a corrigir.
7a. **Composição mobile dos cards é decisão de layout, não do design.** Abaixo de
   1024 px os quatro cards ficam ilegíveis, então o CSS troca para dois maiores
   e mais baixos. É o que existe — não melhorar agora.
7b. **Desvio consciente: cards 160 px mais abaixo.** `mt-40` em `.card-art`
   baixa a arte dentro da bbox. É decisão do usuário, não do Figma — a tabela de
   fidelidade do README (y 842,24 / 693,43 / 705,61 / 814,86) **não** descreve
   mais o que está na tela. `mt-40` é px fixo e vale para todos os breakpoints,
   enquanto a geometria dos slots é `cqw`/%; o efeito no mobile não foi
   avaliado e fica pendente para quando o design mobile existir.
8. **Movimento é autoria nossa.** `get_motion_context` do Figma retorna vazio —
   entrada em cascata, parallax de rolagem e ponteiro, header que condensa.
9. **Nenhum path de SVG copiado para dentro do código.** Logo e ícones entram
   como asset ou componente.
10. **Escopo de portfólio, não de produção.** Sem backend, sem analytics, sem
    requisições a terceiros. CTAs são links redirecionadores para nubank.com.br.
11. **Storybook adiado até o design system existir no Figma** (decisão do
    usuário, 2026-10-16). Motivos: os tokens já têm casa autoritativa — o
    `@theme` do `globals.css` — e o Storybook *renderiza* token, não o armazena,
    então viria a ser um segundo lugar para manter em sincronia. Além disso o
    catálogo de hoje seria reescrito quando os componentes definitivos chegarem.
    Quando chegar, há três atritos já identificados: (a) `next/font/google` não
    roda no Storybook e `--font-nu-montserrat` ficaria indefinido — a saída é
    auto-hospedar a Montserrat como `@font-face` puro, o que remove também a
    consulta ao Google no build; (b) Tailwind v4 exige `@tailwindcss/vite` no
    `.storybook/main.ts`; (c) os componentes são `"use client"` com Motion e
    `initial={{opacity:0}}`, então toda story abre invisível e precisa de
    decorator global.
12. **O design system no Figma vai usar Variables, não só styles** (combinado em
    2026-10-16). É o que permite ler as variables pela MCP (`get_variable_defs`)
    e diferenciá-las contra o `@theme` — a verificação de deriva mais direta que
    existe, e mais barata que Storybook. Componentes como **variants** de
    `state`/`size`, não cópias diferentes.
13. **CTAs da header passam para a cor da marca quando o header condensa.**
    Decisão do usuário (2026-10-16) a partir de screenshot do estado condensado.
    Desvio do Figma, que mantém `Action/action-secondary` (`#f3e8ff`) nos dois
    estados — mas `#f3e8ff` sobre o branco do header praticamente desaparece.
    Aplicado **só no estado condensado**: no estado transparente sobre o
    gradiente roxo, brand não passaria de AA. Contrastes medidos: branco sobre
    `#820ad1` 7,21:1 · hover `#6a08ad` 9,33:1 · brand sobre o pior caso do
    header (`#ecdaf8`) 5,48:1. Detalhes em `README.md > CTAs da header no
    estado condensado`.
14. **Grão de textura na página inteira, exceto no header.** Decisão do usuário
    (2026-10-16), e **vale como convenção daqui em diante** — toda seção nova
    nasce com textura. Desvio autoral: o Figma **não tem** ruído (o `bg`, nó
    `14:460`, é gradiente puro; o que parece grão é dithering do viewer).
    Implementado como `.nu-grain` (`globals.css`) + `NoiseOverlay`, um
    `feTurbulence` inline em data URI — zero requisições, zero bytes no repo.
    Três escolhas registradas no CSS: sem `mix-blend-mode` (porque `overlay` e
    `soft-light` são neutros em cinza-médio e a metade da página é branca), tile
    de 180 px repetido (rasteriza uma vez), e `z-index: 40` contra os `z-50` do
    header — requisito explícito de que o header nunca receberia grão, nem ao
    rolar. Opacidade 3% (moves os canais em ±1,5%), ajustável pela custom
    property `--nu-grain-opacity`.

    **Teto de opacidade: 0.12.** O grão fica por cima do texto e escurece os
    glifos. Medindo o tile real em canvas ele vai de 116 a 236 (±60 níveis),
    bem mais forte do que aparenta. Aplicado sobre o texto branco da Hero e
    comparado com o gradiente na altura de cada texto: a 0.18 o subtítulo cai
    para 4,45:1 e o CTA fantasma para 4,20:1 — ambos abaixo de AA. A 0.12
    passam (4,80 e 4,54). Tabela completa no `globals.css`. O 0.03 inicial era
    invisível; o 0.08 nunca chegou a ser servido pelo dev server, o que levou a
    concluir cedo demais que o efeito não funcionava.

    **Pendência conhecida:** para passar de 0.12 sem perder intensidade, o grão
    teria de ser por seção e ficar *abaixo* do texto, em vez de ser uma camada
    de página inteira por cima de tudo. Aí texturiza a superfície sem tocar nos
    glifos. É a solução correta, mas muda a arquitetura e não foi feita.

---

## Mapeamento Figma → código

Lido de `get_variable_defs` no nó `14:446` em 2026-10-16: **15 variables**.
Treze viraram token; duas são alias do mesmo valor.

| Variable no Figma | Hex | Token no `globals.css` |
|---|---|---|
| `Purple/950` | `#2e1065` | `--color-nu-purple-950` |
| `Purple/800` | `#6a08ad` | `--color-nu-purple-800` |
| `Purple/600` | `#9b2fe8` | `--color-nu-purple-600` |
| `Purple/400` | `#c084fc` | `--color-nu-purple-400` |
| `Neutral/100` | `#f3f4f6` | `--color-nu-neutral-100` |
| `Neutral/200` | `#e5e7eb` | `--color-nu-neutral-200` |
| `Neutral/300` | `#d1d5db` | `--color-nu-neutral-300` |
| `Neutral/400` | `#9ca3af` | `--color-nu-neutral-400` |
| `Neutral/800` | `#1c1c1e` | `--color-nu-neutral-800` |
| `Text/text-primary` | `#111111` | `--color-nu-text-primary` |
| `Action/action-secondary` | `#f3e8ff` | `--color-nu-action-surface` |
| `Action/action-primary-text` | `#ffffff` | `--color-nu-action-text` |
| `Action/action-secondary-text` **ou** `Text/text-brand` | `#820ad1` | `--color-nu-brand` |
| — (não é variable) | `#d8b4fe` | `--color-nu-hero-stop-3` |

**Três pontos para resolver ao criar o design system:**

1. **`#820ad1` tem dois nomes no Figma** — `Action/action-secondary-text` e
   `Text/text-brand`. Consolidar em um só quando o DS for criado.
2. **Três tokens foram renomeados** em relação ao Figma (`action-secondary` →
   `action-surface`, `action-primary-text` → `action-text`, `action-secondary-text`
   → `brand`). A renomeação foi boa — `surface`/`text` descrevem melhor o papel
   — mas significa que a comparação automática entre os dois lados não pode ser
   por igualdade de nome. Vale decidir: manter a tabela acima como mapa
   explícito, ou renomear também no Figma.
3. **`#d8b4fe` foi lido direto do gradiente** do nó `14:460`, não de variable.
   Se o DS for criado, vale promovê-lo a variable para que nada mais dependa de
   leitura manual.

---

## Em aberto

| # | Pendência | Onde |
|---|---|---|
| 1 | **Desenhar no Figma os painéis dos submenus da navegação.** É o próximo passo combinado. | `SiteHeader.tsx` |
| 2 | Desenhar no Figma as seções `Porque a Nu`, `Cartões`, `Diferenciais` | `SiteFooter.tsx` (`PendingSections`) |
| 3 | Menu mobile (depende do nº 1) — **adiado**, só depois que o design mobile existir | `SiteHeader.tsx` |
| 4 | Exportar do Figma o ícone do app definitivo (hoje é um quadrado placeholder) | `src/app/icon.svg` |
| 5 | Revisar texto do rodapé com o usuário (a parte mobile dos cards saiu da lista) | — |
| 6 | Limpar comentário desatualizado em `HeroSection.tsx` — ainda cita `Neutral/200`, 2,74:1 e "ainda não atinge 4.5:1". O estado real é branco puro a 5,52:1, passando AA | `src/components/hero/HeroSection.tsx` |
| 7 | Regra de ESLint proibindo hex literal fora do `globals.css`. Motivo: o gradiente de `HeroSection.tsx:27` tem quatro hex hardcoded no JSX, três deles já existentes como token — e isso passou por lint e revisão. É a única trava de deriva que dá para instalar **antes** do design system existir. Prioridade baixa por decisão do usuário (ver Storybook) | `eslint.config.mjs` |
| 8 | Montar o catálogo de componentes (Storybook ou equivalente) **depois** que o design system existir — ver decisão 11 | — |

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
- **Trabalhar e julgar no desktop (≥1024 px).** Não propor breakpoint novo, nem
  "aproveitar para já tratar o mobile", nem auditar tela estreita — a menos que
  o usuário peça. Medidas, espaçamentos e decisões de layout são tomadas no
  frame de 1920×1080 do Figma.

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
  `mt-40` são 160 px **fixos**, contra uma geometria de slots em `cqw`/%. No
  mobile não foi avaliado — e não precisa ser agora: ver decisão 7.
- **Memória do projeto criada:** `CONTEXTO.md` na raiz + ponteiro no `AGENTS.md`
  instructing o agente a lê-lo no início de cada sessão. Passa a ser o lugar
  onde registrar decisões, pendências e histórico de sessão.
- **Escopo definido pelo usuário: desktop primeiro, mobile adiado.** Ele vai
  desenhar a versão mobile no Figma. Passa a valer a regra de que não se investe
  em mobile até esse design existir — nada de criar breakpoints, refinar o CSS
  de tela estreita ou auditar celular. Registrado como decisão 7 e como item de
  "Antes de sugerir código".

### 2026-10-16 — Storybook discutido e adiado

Perguntou-se se um Storybook evitaria deriva de tokens. **Resposta: não agora**,
e o usuário concordou em esperar o design system do Figma. Ver decisão 11 para
o raciocínio completo e para os três atritos já mapeados, para não ter que
rediscutar do zero quando a hora chegar.

Fechou-se também o combinado de que **o DS no Figma vai usar Variables** em
Collections, com componentes em variants de `state`/`size` — é o que habilita a
comparação automática Figma ↔ `@theme` (decisão 12).

Leitura de `get_variable_defs` no nó `14:446` registrada em **Mapeamento
Figma → código**, com três pendências para quando o DS existir: consolidar o
`#820ad1` que tem dois nomes, decidir entre mapa explícito e renomear os
tokens no Figma, e promover `#d8b4fe` a variable.

**Próximo passo inalterado:** desenhar os painéis dos submenus da navegação,
depois o design system. O DS é a dependência do item 8.

### 2026-10-16 — CTAs da header na cor da marca ao condensar

A partir de um screenshot do header condensado, o usuário pediu mais destaque:
`Quero ser Nubank` com fundo na cor da marca e texto branco, `Login Empresas`
com borda e texto na cor da marca.

**O Figma discorda nos dois casos** — lá os dois botões usam
`Action/action-secondary` (`#f3e8ff`) nos dois estados. Então isto é desvio
deliberado, não correção de fidelidade, e ficou documentado como tal em
`README.md` e como decisão 13.

Aplicado apenas no estado condensado (`group-data-[condensed]:`), porque sobre
o gradiente roxo a cor da marca reprovaria em AA. Todas as combinações
novas passam: pior caso 5,48:1, mínimo AA 4,5:1. Lint e tipos OK.

Estado transparente do header, como no Figma, segue intocado — o comportamento
de condensar em si também foi aprovado como está.

### 2026-10-16 — grão de textura na página inteira

O usuário pediu um ruído bem leve sobre a LP inteira, por textura e
profundidade, **exceto no header ao rolar**. Vira decisão 14 e convenção para
as seções que ainda vão existir.

Antes de implementar, conferi o Figma: **não há noise lá.** O `bg` (14:460) é
gradiente puro, sem camada de ruído, sem blend mode, sem filtro — confirmado
tanto pelo `get_design_context` quanto pelo render, que sai liso. Provavelmente
o que aparece como grão é o dithering do viewer sobre um gradiente muito suave.
Ficou registrado como desvio autoral, não como valor lido do design.

`NoiseOverlay` é componente de servidor de propósito: sem estado e sem efeito,
entra no HTML estático sem custo de hidratação. Lint e tipos OK.

O usuário aprovou o resultado com o grão **por cima** do texto ("ainda é
totalmente legível"). A pendência de mover o grão para baixo do texto fica
aberta só como opção para intensidades acima de 0.12.

### 2026-10-16 — entrada do header + leque nos cards

Duas animações pedidas:

1. **Header entra em cascata.** Estava estático na montagem; agora logo, itens
   de nav e CTAs descem de 16px em `revealFromTop`, escalonados com
   `staggerContainer`. `initial={false}` continua no `<motion.header>` — é o que
   impede a animação de re-disparar quando `data-condensed` muda ao rolar; o
   reveal fica no container interno, que só anima na montagem. A nav e o grupo
   de CTAs ganharam containers próprios: o escalonamento desce por ramo da
   árvore, e sem eles os filhos entram todos no mesmo instante.
2. **Cards abrem em leque, da esquerda para a direita.** Cada card sai 18° fora
   da rotação do design e assenta nela, com pivô em `50% 78%` — é o bascular a
   partir da base que lê como leque abrindo. O `transformOrigin` perto da base
   importa: com pivô no centro o card apenas gira no lugar.

O atraso dos cards deixou de ser hardcoded por card (0.42 / 0.24 / 0.12 / 0.33,
ordem que não acompanhava a tela) e passou a ser derivado da posição
horizontal: `FAN_CASCADE` em `hero-cards.ts` ordena por `centerX` e aplica
`startDelay + rank × step`. Assim a ordem visual é a ordem da animação, e
inserir um card no meio da lista não embaralha a cascata.

Os valores ficaram concentrados para ajuste rápido: `FAN` (ângulo, escala, y,
origem) em `lib/motion.ts`; `FAN_CASCADE` (atraso inicial e passo) em
`lib/hero-cards.ts`.

**Limite da verificação:** o escalonamento do header foi confirmado por
screenshots headless em 450ms, 1.000ms e 1.800ms (logo → dois itens de nav →
header inteiro com um card aparecendo). O estado final assentado **não** foi
verificado por screenshot: `--virtual-time-budget` não dirige bem animações em
rAF e produz frames inconsistentes (t=700 mostrou menos que t=1.000; t=2.200 veio
sem título nem cards). O que não fecha visualmente precisa de olho humano no
localhost.

### 2026-10-16 — leque sem fade, e o piscar do logo

**Cards não "surgem" mais.** Tiram-se `opacity` e `scale` do estado inicial: o
card já está na Hero no primeiro frame, opaco e do tamanho final, só 18° fora
do lugar. O giro é o que o revela. Com fade, os cards apareciam durante o
leque. `FAN.y` caiu de 26 para 10px pelo mesmo motivo — deslocamento grande
devolve a leitura de "o card chega". Verificado por screenshot do primeiro
frame: os quatro cards já estão visíveis e tiltados, com o header ainda
invisível (que é o esperado da entrada dele).

**O logo da Nu piscava no fim da animação** — bug introduzido pela cascata do
header. Causa: o logo é desenhado com `mask-image`, e animar o ancestral faz o
navegador rasterizar a máscara a cada quadro. No fim o Motion remove a
transform, e essa última re-rasterização chegava depois do paint.

Correção: `will-change: transform, opacity` em `.nu-icon`, que promove o
ícone a uma camada própria. A máscara passa a ser rasterizada uma vez, e as
transformações do ancestral movem o resultado pronto. Só o logo usa `.nu-icon`
— os carets são Phosphor desde `1c94c4a` — então o custo de manter a camada é
de um elemento só.

**Não verificado:** o piscar é de um frame só e não aparece em screenshot
estático. Precisa de olho humano.

### 2026-10-16 — o dev server serviu CSS desatualizado (segunda vez)

Depois de aplicar `will-change` em `.nu-icon`, o usuário continuou vendo o
piscar. Causa: **o CSS servido pelo `next dev` não continha a declaração.** A
única ocorrência de `will-change` no CSS servido era a classe utilitária do
Tailwind vinda de `CardsShowcase`, e a regra `.nu-icon` servida tinha
`-webkit-mask-image` duplicado — resíduo de merge do dev server. No build de
produção a declaração está presente normalmente.

Ou seja: o fix estava certo no código, mas **nunca chegou ao navegador dele**.
É a segunda vez que isso acontece (a primeira foi a opacidade do grão, 0.03 em
vez de 0.08). Antes de investigar qualquer coisa que "não funciona no
navegador", conferir o CSS servido: `curl` na página, pegar o `href` do `.css` e
procurar a regra. Produção é determinístico, dev não é.

### 2026-10-16 — cards escondidos no início, revelados só pelo giro

O usuário esclareceu o que queria, e a leitura anterior estava errada: os cards
**devem** começar escondidos e aparecer durante o leque. O que ele não queria
era o card *chegar* — subir e crescer.

Estado final: `initial={{ opacity: 0, rotate: FAN.from }}` e
`animate={{ opacity: 1, rotate: 0 }}`. Sem `y`, sem `scale`. O card nasce no
tamanho e na posição do design, invisível; o giro de 18° é o que o traz à
vista. `FAN.y` saiu do objeto — não sobrou ajuste de deslocamento vertical, e
não deve voltar sem o usuário pedir.

Verificado por screenshot do primeiro frame em produção: cards invisíveis e
header invisível, que é o estado inicial correto.

### 2026-10-16 — leque definitivo (sem surgir) e o piscar do logo, resolvido

As duas interpretações anteriores da animação dos cards estavam erradas na
direção — esta é a correta.

**Cards: escondidos abaixo da seção, não por opacity.** O usuário foi claro: os
cards precisam **já estar renderizados** e **literalmente escondidos embaixo da
seção**, e a **única** animação é o leque. Estado final:
`initial={{ rotate: FAN.from, y: FAN.y }}` → `animate={{ rotate: 0, y: 0 }}`, com
`FAN.y = "150%"`.

Sem `opacity` e sem `scale` — é isso que produzia o "surgir". O card nasce sólido
e do tamanho final; o que o esconde é estar em `translateY(150%)`, abaixo da
borda inferior da Hero, de onde o `overflow-clip` da seção recorta. O leque o
traz para dentro da tela.

`y` é **porcentagem da própria altura do card**, não pixel: a geometria da
composição é toda proporcional (`cqw` + `aspect-ratio`). 150% é folgado porque em
16:9 um card precisa de 34% a 58% do próprio tamanho para passar da borda, e
viewport mais alta que 16:9 exige mais.

Verificado no HTML do servidor: `transform:translateY(150%) rotate(-18deg)` sem
`opacity` — é exatamente o que distingue "escondido por posição" de "escondido
por fade". Frame 0 em produção, sem cards visíveis.

**Logo: a máscara foi eliminada, não remendada.** O piscar era um **retângulo
branco**, não o logo sumindo: `.nu-icon` tinha `background-color: currentColor` e
`mask-image` sobre o SVG de `/public`; quando a máscara não estava resolvida
naquele frame, o elemento aparecia com o fundo cru e sem a forma.

Duas tentativas anteriores falharam, por motivos diferentes:
1. `will-change: transform, opacity` — não resolveu, porque o gatilho é a
   recomposição do **ancestral** animado (transform + opacity na entrada do
   header), não o elemento.
2. E nem chegou a ser testado de verdade: o `next dev` servia CSS desatualizado
   (já registrado acima como a segunda vez que isso acontece).

Solução: `src/components/ui/NuLogo.tsx` com o SVG **inline** e
`fill="currentColor"`. Sem máscara, sem requisição, sem rasterização ambígua. A
utilitária `.nu-icon` e o helper `icon()` foram removidos — não sobrou uso.

**É o único path SVG dentro do código, e é um desvio consciente da convenção.** O
original segue em `public/images/brand/nu-logo.svg`, e os quatro `path` são os
mesmos com `fill="white"` trocado por `currentColor`. Documentado no README e no
próprio componente. O `preserveAspectRatio="none"` do original foi descartado: o
`width="64" height="34.91"` com o CSS esticando para 64×35 dá proporção
praticamente igual, e o padrão `meet` evita a distorção que o `none` produziria
em larguras diferentes da original.

### 2026-10-16 — logo em PNG (duas cores)

O SVG inline **também** piscava. A hipótese de que a máscara era o problema
estava errada: o ancestral do logo é animado (transform + opacity na entrada do
header), e **tanto a máscara quanto o vetor** são rasterizados de novo quando
essa camada é recomposta. O frame chega antes da forma desenhada.

Solução: rasterizar. `nu-logo-light.png` (`#f3e8ff`) e `nu-logo-dark.png`
(`#1c1c1e`), 256×140 RGBA (4x do tamanho de exibição, para densidade alta),
gerados renderizando o SVG do Figma em Chrome headless com
`--default-background-color=00000000` e `--window-size=256,140`. Um PNG já
rasterizado não passa pelo caminho de rasterização de vetor na recomposição.

As duas cores são **exatamente** as que o logo tinha como `currentColor` nos dois
estados do header, então a aparência é idêntica. As duas imagens ficam no DOM e
o CSS troca a visibilidade por `group-data-[condensed]` — trocar `src` no scroll
piscaria enquanto o novo arquivo decodifica.

`src/components/ui/NuLogo.tsx` foi removido: não sobrou uso. O SVG original
continua em `public/` como fonte dos PNGs, e o README traz o comando para
regerar.

**Não verificado:** se o piscar some é o mesmo tipo de coisa que não aparece em
screenshot estático. A hipótese é mais forte agora — não há vetor nem máscara no
caminho de rasterização — mas continua sendo hipótese até alguém olhar.

**Nota de método:** converter SVG→PNG com Chrome headless dispensou pedir o
arquivo ao usuário. Vale lembrar para a próxima: antes de oferecer trabalho
manual, checar se a ferramenta local resolve.