# Contexto do projeto

> **Para o agente (leia no início de cada sessão).** Este arquivo é a memória do
> projeto. Antes de propor qualquer coisa: leia `README.md` (estado e decisões
> técnicas), depois este arquivo (estado atual e o que está em aberto). Ao final
> de uma sessão de trabalho relevante, atualize a seção **Registro de sessões** e
> o **Próximo passo** — não deixe o arquivo defasado.

- **Projeto:** landing page de estudo da Nu, reconstruída a partir de um design
  autoral no Figma. Sem vínculo oficial com a Nu Pagamentos.
- **Figma:** https://www.figma.com/design/16kp2jwaILwDfp44uYuNkP
- **Frames implementados:** `Hero Section` (node `14:446`, 1920×1080) e
  `Ecossystem Section - Nubank` (node `52:3`, 1920×919)
- **Produção:** https://nubank-landing-estudo.vercel.app
- **Repositório:** https://github.com/nissopaulo/nubank-landing-estudo

---

## Estado atual

Duas telas implementadas e funcionando. A **Hero**, com header fixo, cards em
parallax e rodapé. Abaixo dela a **Ecossystem Section**, carrossel de pilares —
com apenas o Nubank desenhado, porque no Figma só existe o frame dele na
estrutura nova. Entre as duas e o rodapé existe um bloco **"Em construção"** que
é provisório e existe só para o CTA "Explore o Universo Nu" ter destino.

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
| `Text/text-tertiary` | `#6b7280` | `--color-nu-text-tertiary` |
| — (não é variable) | `#d8b4fe` | `--color-nu-hero-stop-3` |

**Leitura do nó `52:3` (Ecossystem), 2026-10-17:** mais 8 variables, e nenhuma
cor nova — `Text/text-tertiary` (`#6b7280`) era a única que faltava e virou
token. `Background/bg-primary` (`#ffffff`), `Action/action-disabled` (`#e5e7eb`,
mesmo valor de `Neutral/200`) e `Action/action-primary` (`#820ad1`, mesmo valor
de `Text/text-brand`) já estavam cobertos por tokens existentes.

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
## Fluxo pedido pelo usuário: "Pode commitar"

Sempre que ele disser **"pode commitar"**, executar esta sequência inteira, sem
esperar confirmação adicional:

1. `npx tsc --noEmit` — tem que passar.
2. `npm run lint` — tem que passar.
3. `npm run build` — **obrigatório**. O pedido explícito foi build para não haver
   problema na Vercel, então nunca commitar sem build limpo.
4. `git add -A` e `git commit` com mensagem longa e explicativa, descrevendo o
   *porquê* de cada decisão — é o padrão do repositório, não só o *o quê*.
5. Responder com o resumo do que foi feito e o hash do commit.

**Mensagem de commit com vários `-m` quebra no PowerShell**: ele insere quebra
de linha entre os argumentos e o resultado sai com parágrafos vazios no meio.
Escrever a mensagem num arquivo e usar `git commit -F <arquivo>`.

---

## Em aberto

| # | Pendência | Onde |
|---|---|---|
| 1 | **Desenhar no Figma os três pilares restantes da Ecossystem** (Croma, Ultravioleta, Empresas) na estrutura nova, e então ligá-los ao carrossel | `ecosystem-pillars.ts` |
| 2 | **Desenhar no Figma os painéis dos submenus da navegação.** É o bloqueio do restante da página | `SiteHeader.tsx` |
| 3 | Desenhar no Figma as seções `Porque a Nu`, `Cartões`, `Diferenciais` | `SiteFooter.tsx` (`PendingSections`) |
| 4 | Menu mobile (depende do nº 2) — **adiado**, só depois que o design mobile existir | `SiteHeader.tsx` |
| 5 | Exportar do Figma o ícone do app definitivo (hoje é um quadrado placeholder) | `src/app/icon.svg` |
| 6 | Revisar texto do rodapé com o usuário (a parte mobile dos cards saiu da lista) | — |
| 7 | Limpar comentário desatualizado em `HeroSection.tsx` — ainda cita `Neutral/200`, 2,74:1 e "ainda não atinge 4.5:1". O estado real é branco puro a 5,52:1, passando AA | `src/components/hero/HeroSection.tsx` |
| 8 | Regra de ESLint proibindo hex literal fora do `globals.css`. Motivo: o gradiente de `HeroSection.tsx:27` tem quatro hex hardcoded no JSX, três deles já existentes como token — e isso passou por lint e revisão. O gradiente da Ecossystem **também** traz literal, mas é o export do Figma em data URI e não tem como ser token. É a única trava de deriva que dá para instalar **antes** do design system existir. Prioridade baixa por decisão do usuário (ver Storybook) | `eslint.config.mjs` |
| 9 | Montar o catálogo de componentes (Storybook ou equivalente) **depois** que o design system existir — ver decisão 11 | — |

**No Figma hoje existem dois frames visíveis** — `Hero Section` (`14:446`) e
`Ecossystem Section - Nubank` (`52:3`) — mais os 4 frames soltos de arte dos
cartões e **três frames ocultos da Ecossystem** (`76:3`, `77:40`, `80:77`) que
ainda estão na estrutura antiga, a que o projeto descartou. Não há design das
seções seguintes — por isso os itens 2 e 3 bloqueiam o resto.

### Antes de sugerir código

- **NUNCA usar `Set-Content`, `Out-File` ou `Get-Content -Raw` para ler e
  reescrever arquivo-fonte deste projeto.** São a causa de uma corrupção de
  encoding que já foi commitada e enviada — ver a entrada de 2026-10-17 sobre
  mojibake. Em Windows o PowerShell 5.1 lê UTF-8 como a página de códigos do
  sistema e escreve de volta na mesma, então cada acento vira dois caracteres.
  **Use sempre as ferramentas `edit` / `write`**, que operam em UTF-8.
- Para **verificar** encoding, le bytes crus com `node` e `TextDecoder` explícito.
  Não confie em `Get-Content` nem em `git show`: os dois passam pelo console do
  Windows e devolvem falso positivo **e** falso negativo.
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

### 2026-10-16 — a causa do piscar: `opacity` do Motion × transition de CSS

O PNG também piscou. Três assets depois (máscara → SVG inline → PNG), a hipótese
estava errada três vezes: **não era a imagem.**

**Como se chegou lá.** Primeiro, uma sonda de geometria no componente
(`DebugProbe`, temporária, já removida) mediu `getBoundingClientRect()` do logo e
dos ancestrais ao longo da animação. Em t=0:

```
img top=16.5 h=35.0 | li top=4.0 h=60.0 | linha h=100.0 | dif centro img-li=0.0
```

`16.5` é `32.5 − 16`, ou seja o `translateY(-16)` inicial — e `dif centro` = 0
confirma que logo e nav estavam alinhados ao milímetro. **Não era layout
shift.** Isso eliminou de uma vez toda a família de hipóteses de layout.

Depois, comparar estruturalmente os itens do header mostrou a diferença real:

| Elemento | Motion anima | transition CSS | Conflito |
|---|---|---|---|
| logo | `<motion.a>` | `transition-opacity` **no mesmo elemento** | **sim** |
| nav | `<motion.li>` | no `<button>` filho | não |
| CTAs | `<motion.span>` | `transition-colors` (não inclui opacity) | não |

O logo era o único elemento com `opacity` animado por Motion **e** transition de
CSS no mesmo lugar. A mecânica: o Motion escreve `opacity` inline a cada quadro,
cada escrita dispara a transition de 150 ms, e o valor renderizado fica sempre
atrás do do Motion. No fim o Motion remove o `opacity` inline e a transition leva
mais 150 ms para assentar — o logo continua mudando depois da animação acabar.

Correção estrutural: o reveal foi para um `<motion.span>` e o `<a>` com
`transition-opacity` virou filho, o elemento que o Motion não toca. É o padrão
que a nav e os CTAs já usavam.

Aproveitei para: `priority` nas duas imagens (o `loading="lazy"` padrão podia
terminar a decodificação bem depois da animação, mais um repaint no meio do
efeito) e remoção do `<span class="sr-only">Nubank</span>`, que era redundante —
o `aria-label` do link sempre teve precedência sobre ele, então nunca era
anunciado.

**Lição registrada no README como regra:** se um elemento animando por Motion
parece piscando, suspeite do conflito de `opacity` antes da imagem. Foram três
commits trocando o asset antes de olhar a transition.

### 2026-10-16 — `shrink-0` no elemento errado, e o resíduo de meio pixel

Piscar resolvido. Restava o logo "1 pixel acima e depois desce".

**A sonda de geometria pagou de novo.** Numa janela estreita (1250px) ela mediu
`a.h = 0.000` e o logo não aparecia no render. Causa: ao mover o reveal do
`<motion.a>` para um `<motion.span>` wrapper, o `shrink-0` ficou no `<a>` — que
deixou de ser o flex item. O flex item passou a ser o span, que encolhia
livremente e chegava a largura zero, sumindo com o logo.

**`shrink-0` foi para o `motion.span`.** Bug meu, introduzido em `7ea0219`, e
invisível para quem olha o cabeçalho em desktop largo. Depois da correção a
sonda mede `a.h = 35.000` e geometria estável em todas as amostras.

**O resíduo de 1px.** A sonda também revelou que o logo descansa em `32.500` —
meio pixel — porque a caixa tem 35px (ímpar) numa linha de 60px. Os itens da nav
descansam em pixel inteiro (`30.000`). Em meio pixel, o caminho de render
composto (durante a animação, com transform) e o caminho pintado (depois, sem
transform) não concordam no arredondamento, e o logo aparecia meio pixel acima
por um frame antes de assentar.

Correção: `will-change-transform` permanente no `motion.span` do logo, para que
o caminho de render seja o mesmo antes e depois da animação. Custo: uma camada de
64×35 mantida viva — irrelevante. Documentado no próprio componente, porque
`will-change` permanente costuma ser questionado em review e aqui é uma exceção
justificada.

Também documentei em `revealFromTop` que o `y: -16` é par de propósito: a cauda
do `EASE_OUT_EXPO` é lenta, e um deslocamento par mantém o trajeto em pixels
inteiros.

**Ainda não verificado:** se o resíduo de meio pixel some, depende de olho humano
— é um frame.

### 2026-10-16 — o resíduo era do Firefox; entrada do header virou CSS

A pista que fechou o caso veio do usuário: **o problema acontecia no Firefox, no
Chrome não.** Eu vinha investigando como se fosse universal, e era exatamente a
coisa em que os dois motores divergem.

**Por que os dois diferem.** Quando uma biblioteca de animação **remove** o
`transform` no fim, o elemento sai do caminho de render composto e volta ao
pintado. Chrome e Firefox arredondam essa transição de formas diferentes, e no
Firefox o logo aparecia ~1px acima até o repaint seguinte. No Chrome era quase
imperceptível — foi o que fez o bug parecer intermitente e me fazer perseguir a
causa errada quatro vezes.

**`will-change: transform` não resolveu**, e eu tinha verificado que a classe
estava no HTML antes de concluir isso. Não era a camada composta.

**A correção é não ter o instante.** A entrada do header passou a ser animação
CSS com `animation-fill-mode: both`: o keyframe final (`transform:
translateY(0px)`, `opacity: 1`) continua aplicado depois que a animação acaba.
Nunca existe um momento em que o `transform` vira `none`, então não há o que os
motores arredondem de formas diferentes. Mesmo código nos dois, sem caminho de
render alternativo.

O que mudou em `SiteHeader`:

- `<motion.header>` → `<header>`; os `motion.div`/`.nav`/`.li`/`.span` da entrada
  viraram elementos comuns com a classe `header-enter`.
- A cascata saiu de `staggerChildren` e virou a lista `ENTER`, com cada elemento
  recebendo `--header-enter-delay`. Valores idênticos aos que o Motion gerava
  (logo 0.12 · nav 0.23/0.28/0.33/0.38 · CTAs 0.31/0.37).
- `revealFromTop` saiu de `lib/motion.ts`: ficou órfã, só o header usava.
  `staggerContainer` continua, usada pela Hero.
- `globals.css` ganhou `@keyframes header-enter` e a utilitária `.header-enter`,
  e o bloco de movimento reduzido ganhou `animation-delay: 0.01ms !important`
  (sem isso, quem pede menos movimento ainda assistiria à cascata, só que
  instantânea).
- Mantido o `lg:translate-y-[0.5px]` no logo, para o repouso cair em pixel
  inteiro no `lg`.

O Motion continua no componente só para o `useScroll` que condensa o header ao
rolar.

**Verificado:** sem `transform` inline no HTML servido (Motion fora do caminho da
entrada), keyframe no CSS compilado, e screenshot do header completo no estado
final.

**Não verificado:** o comportamento no Firefox — não tenho Firefox aqui. Depende
do usuário confirmar.

### 2026-10-16 — sombra nos cards + fluxo "pode commitar"

**Sombra.** `filter: drop-shadow(0 14px 26px var(--color-nu-purple-950) / 0.2)`
em `.card-art`.

Escolhas:

- `drop-shadow`, não `box-shadow`: as quatro artes em WebP têm canal alfa
  (confirmado nos chunks `VP8X`, flag `ALPHA`) e os cantos arredondados do
  Figma. `drop-shadow` segue a silhueta real; um `box-shadow` no `.card-art`
  seria retangular, porque a caixa do slot é maior que a arte.
- No `.card-art` e não na `<img>`: o deslocamento é aplicado no espaço local do
  elemento, antes da rotação, então a sombra sai inclinada junto com o card em
  vez de destacada dele.
- Cor `purple-950` em vez de preto, para não sujar o gradiente.
- Intensidade calibrada por comparação visual lado a lado (sem sombra / .16 /
  .20) renderizada em Chrome headless. .20 é onde aparece como profundidade sem
  virar destaque.

**Nota de custo:** `filter` no elemento que o leque anima significa
re-rasterização por quadro durante a entrada dos cards. São quatro cartões e uma
animação única, então o custo é irrelevante — mas é o tipo de coisa que pesa se
a composição crescer muito.

**Fluxo "pode commitar"** registrado na seção própria deste arquivo: tipos, lint,
build (obrigatório, por causa da Vercel), commit com mensagem longa e
`git commit -F` em vez de `-m` múltiplos, que o PowerShell embaralha.

### 2026-10-16 — sombra dos cards: duas camadas, depois de três calibrações erradas

A sombra foi calibrada três vezes e as três primeiras falharam. O registro importa
mais que o número final.

**Erro 1 — chute sem base.** `0.20` com 26px de blur, do instinto de "bem de
leve". Ignorava que `drop-shadow` espalha a energia da sombra pelo raio de
desfoque: o valor é a opacidade da *cor*, não o pico que chega na tela.

**Erro 2 — não resolveu.** Subi para `0.50` e ajustei o blur; continuou
imperceptível.

**Erro 3 — medi no lugar errado.** Ao refazer a régua, posicionei o card no topo
do gradiente, contra o roxo escuro. Na composição real os cards ficam no fim da
Hero, sobre a parte clara. Número medido no contexto errado não transfere.

**O que resolveu não foi um número maior, foi estrutura:** DUAS sombras
empilhadas, a técnica padrão de elevação.

```
drop-shadow(0 1px 2px  purple-950 / .45)   <- contato: define a borda
drop-shadow(0 14px 28px purple-950 / .55)  <- difusão: cria a altura
```

As três calibrações mediram **só a sombra de difusão**. E difusão sozinha é
justamente o que não separa nada: larga demais para marcar a borda. Quem dá
leitura num card sobreposto é a de contato.

**Antes de recalibrar, confirmar que o efeito APLICA.** Um
`drop-shadow(0 0 25px red)` na página real acendeu todos os cards — filtro,
token e silhueta estavam certos, e o que faltava era estrutura. Isso poupou
duas calibrações inúteis e evitou mexer na rastreabilidade do token.

**Firefox:** está instalado na máquina, e foi testado. Duas hipóteses minhas
caíram antes de chegar na causa:

1. "`filter` junto com a propriedade `rotate` no mesmo elemento é bug do
   Firefox" — **falso**. Testei as três combinações (rotate no pai, filter
   sozinho, rotate e filter juntos): o Firefox renderiza as três normalmente.
2. "`will-change: transform` no filho quebra o filtro do pai" — **falso**.
   Testei a cadeia real completa (slot com `translate` → `.card-art` com
   `rotate` + `filter` → div com `will-change` → `img`): renderiza.

Também confirmei que o **dev server** servia o CSS certo, então não era a
armadilha de CSS velho dessa vez. Continuar checando antes de culpar o código.

**Método para capturar o Firefox:** `firefox --headless --profile <dir>
--screenshot`. Limitação: fotografa no load, então a entrada dos cards (≈2s, em
rAF) ainda não terminou — para ver o estado final no Firefox não há método
aqui. O que resolve é isolar a pergunta numa página de teste, e foi assim que as
duas hipóteses caíram.

### 2026-10-16 — a sombra dos cards é VALOR DO FIGMA, e eu errei quatro vezes

O usuário mandou o CSS do card do Figma:

```css
border-radius: 15.461px;
background: linear-gradient(202deg, #EEECE9 0%, #BFB299 50.14%, #8F7F64 100%);
box-shadow: -8.226px 10.968px 18.281px 0 rgba(0, 0, 0, 0.10);
```

**Eu vinha afirmando, em três commits, que o Figma não tinha sombra nos cards.
Estava errado.** Eu tinha lido o design context procurando `boxShadow` e não
encontrei — mas não procurei direito, e o valor estava lá o tempo todo.

Quatro tentativas de intuir o número (0.20/26px → 0.50/20px → 0.70/10/16px →
duas camadas), todas baseadas em "bem de leve" e em réguas renderizadas por
mim. **A lição que importa não é de CSS: é de método.** Quando um valor existe no
design, ele se lê no design — não se estima, não se calibra por comparação
visual. Eu gastei quatro commits calibrando por intuição o que era uma leitura.

Segunda lição, que já estava valendo: antes de calibrar, confirmar que o efeito
**aplica**. O `drop-shadow(0 0 25px red)` na página real provou em um build que
filtro e token estavam certos — e o que faltava era estrutura, não intensidade.
Sem aquele teste eu continuava mexendo em número.

**Implementação.** `box-shadow` na `<img>`, não no `.card-art`: a caixa do
`.card-art` é a do *slot*, maior que a arte (o slot tem o bounding box já
rotacionado), e a sombra sairia errada em volta do cartão. A `<img>` tem
exatamente o retângulo da arte — a largura vem da proporção intrínseca do WebP e
a altura do `artHeightPct`.

`box-shadow` em vez de `drop-shadow` porque o `drop-shadow` seguiria o alfa, que
aqui é o arredondamento de `15.461px` gravado na arte — e a diferença é
desprezível, já que a sombra é deslocada 8/11px e borrada em 18px.

**Achado de operação, pela terceira vez:** o `next dev` (:3000) servia uma
versão atrasada da regra enquanto o build de produção já tinha a nova. Antes de
suspectar do código, conferir o CSS servido nos dois ports.

**Pendente de confirmação:** o `next dev` do usuário precisa ser reiniciado, e
falta o retorno sobre Firefox na entrada do header (que agora é CSS puro com
`animation-fill-mode: both`).

### 2026-10-16 — confirmado no navegador

Usuário: *"Ficou perfeito"*, depois de reiniciar o `next dev` com `.next` limpo.
Sombra dos cards resolvida com o valor do Figma.

Também confirmado de passagem: a entrada do header em CSS puro funcionou — é o
que o usuário vinha reclamando no Firefox, e foi exatamente por isso que virou
`animation-fill-mode: both`.

**Operação, quando o dev server ficar suspecto:** matar os três processos
(`next dev`, `start-server` e o worker do Turbopack) e **remover `.next`**. Foi
o que resolveu, depois de três incidentes de CSS velho — a recompilação
incremental não dá conta.

### 2026-10-17 — Ecossystem Section removida, recomeçando do zero

Pedido do usuário: apagar a seção inteira e refazê-la com calma. Três commits
sairam da `main` por `git reset --hard e9459a7` — `4f2bbe1`, `8e1bd2b` e
`89ced5b`, **nenhum deles tinha sido enviado**. `main` voltou a estar em sincronia
com o `origin/main`.

O README e este arquivo voltaram ao estado de `e9459a7` junto com o código, sem
edição manual: aquela versão nunca menciona a seção. Os `grep` por
`ecosystem|eco-|PILLARS` em `src/` e por `ecosystem|pilares|Croma|Ultraviolet`
nos `.md` não acham nada — e os `Croma`/`Ultraviolet`/`Empresas` que sobram no
README são os cards da **Hero** e o CTA `Login Empresas` do header, não a seção
removida. `tsc`, `eslint` e `build` verdes no estado final.

**O que mais foi junto:** o `HeroSection.tsx` estava com `min-h-[420px]`, que era o
atalho temporário para fotografar a seção em headless (a Hero é `min-h-[100svh]`
e empurra tudo para fora da viewport). Não tinha sido restaurado e ia entrar no
commit por engano. Voltou.

**Rede de segurança:** branch local `backup/ecosystem-89ced5b` apontando para o
`89ced5b`, caso o experimento ainda sirva. Pode apagar à vontade.

**O que se perdeu de propósito:** as decisões de cor dos cards (`grayscale()`
contra cinza chapado `neutral-500`, a geometria do radial do Ultravioleta, o
metalizado medido em 6,00:1) saíram daqui junto com o código. Se a seção voltar,
**reler os quatro frames do Figma** (`52:3`, `52:188`, `52:255`, `52:293`) em vez
de confiar nessas notas — o que vale como método continua valendo: valor que
existe no design se lê no design, não se calibra por comparação visual. (Os
nós citados ali estavam errados: no estado atual do arquivo são `52:3`, `76:3`,
`77:40` e `80:77`.)

**Lição de método, que vem da sequência e não só do resultado:** a última
iteração mexeu em três coisas ao mesmo tempo (card fechado chapado, tinta movida
para custom properties, gradiente e tinta do Ultravioleta retunados) e ficou
sendo um experimento não verificado, com um fix de contraste já medido
(`at 50% 85%`, 6,00:1) revertido sem nova medição. Em iteração visual, manter as
variáveis separáveis para que cada uma possa ser medida sozinha.

**Próximo passo:** aguardando o usuário definir como a seção vai ser refeita. A
pendência nº 1 (painéis dos submenus no Figma) continua sendo o bloqueio do
restante da página e não depende desta seção.

### 2026-10-17 — Ecossystem Section refeita do zero, só com o Nubank

O usuário redesenhou a seção no Figma e pediu para começar por partes: só o pilar
do Nubank, os outros três depois. Não é restauração da versão removida — a
estrutura mudou o bastante para que quase nada aproveitasse.

**O que existe no Figma:** um frame visível, `52:3` "Ecossystem Section -
Nubank" (1920x919), e três ocultos (`76:3` Croma, `77:40` Ultraviolet, `80:77`
Business) que continuam na estrutura antiga. Então existe **um** pilar
desenhado. Os três recolhidos entram com nome e foto — que vieram do design e
dos assets — e sem descrição, parágrafo nem CTA, porque nada foi inventado. São
`<button>` com `aria-disabled` e aviso para leitor de tela, o mesmo padrão dos
itens da navegação.

**Armadilha do `get_metadata`:** devolveu `52:3` como frame **vazio**, sem
filhos, mesmo com o frame cheio e visível. Quem acreditar nele conclui que o
design não existe; quem renderiza (`get_screenshot`) ou pede o
`get_design_context` vê o conteúdo. **Ao esbarrar num nó vazio, confirme pelo
render antes de concluir qualquer coisa.**

**O `#` não pode entrar no data URI.** O gradiente do card ativo é o export do
Figma: um `radialGradient` com `gradientTransform` em `matrix(...)`, que o CSS
não expressa (achata a elipse e ainda a gira) — então ele vai como data URI. Na
primeira tentativa converti os `rgba()` do export para hex e **o card roxo
simplesmente não apareceu**, sem erro no console: dentro de `url("data:...")` um
`#` não escapado é lido como fragmento de URL e trunca a string no meio.
Deixei os `rgba()` literais do Figma.

**A quebra de linha do card é do dado, não da largura.** A descrição tem duas
linhas compostas no Figma. Como o card ativo tem 1163px e sobra 1115px de área
útil, o texto correria numa linha só e passaria por baixo da pessoa. Largura
máxima seria chute; o que se reproduz é a composição.

**A altura dos cards não é declarada.** Sai da sobra: `Main Content` com 595px,
menos o título, menos o gap de 100px. A linha é `flex-1` e os cards esticam por
`items-stretch`. Se a fonte renderizar meio pixel a mais, o card encolhe em vez
de estourar a seção.

**Verificação por pixel, não por olho.** Comparando o render do frame com o build
de produção, os dois na grade de 1920x919: card ativo 1163x339 em (200; 356)
contra 1162,8x338,4 em (200,4; 356,4); os três recolhidos em x 1375 / 1494 /
1613 com 107 de largura, contra 1375,2 / 1494 / 1612,8 com 106,8; título e
parágrafo batendo dentro de 1px. Os 3,2px de diferença no CTA são do ícone —
Phosphor no lugar do SVG do Figma tem outra avance width.

Foi preciso o truque de sempre: esconder header e Hero e zerar a duração da
animação num build de verificação, para a seção sair exatamente no frame. Os
três ajustes temporários foram revertidos e conferidos por `grep`.

**Contraste do card recolhido — desvio aceito pelo usuário.** O Figma põe branco
sobre `Action/action-disabled` (`#e5e7eb`): **1,24:1**, que reprova até o mínimo
de 3:1 de texto grande, e o rótulo tem 48px. Mantida a superfície exatamente
como o design, a tinta passa para `Neutral/800` e vai a **13,74:1** — a leitura
de "desabilitado" vem da superfície, não da cor do texto.

**Assets:** os quatro PNGs somavam 6.362 KB. Convertidos com o `sharp` (já no
`node_modules`) para WebP com alfa. Os PNGs foram removidos depois da conversão
(mesmo procedimento das artes dos cartões) e estão preservados em
`%TEMP%\opencode\peoples-png-originais`.

**A pessoa sobe de baixo para cima** com `personRise`, em `lib/motion.ts`. O
deslocamento é % da altura da própria imagem e o que esconde é a posição, não
`opacity` — o HTML do servidor já sai com `transform: translateY(100%)`, então
não há flash antes da hidratação. 100% basta aqui (a pessoa tem 843px e a
janela de recorte tem 595px) onde os cards da Hero precisam de 150%. O caminho
de saída, que desce e some, **ainda não roda** — só existe um pilar — e é a
única parte da animação que precisa de olho humano.

**Próximo passo:** o usuário redesenha os três pilares no Figma. Aí entra um
`useState` com o índice e um `onClick` no botão; o `key` do `AnimatePresence` já
está lá e é ele que faz a troca reaproveitar a animação.

### 2026-10-17 — cor da descrição e a interação do CTA

Duas mudanças pedidas, ambas sobre a Ecossystem que acabou de subir.

**1. Descrição do card ativo em `Text/text-tertiary`.** Implementado — e
**revertido no mesmo dia**, porque o texto do pedido apontava para outro
elemento.

O que aconteceu, na ordem:

1. O pedido dizia "a descrição abaixo dos cards/pilares" e vinha com uma
   captura em que a descrição **de dentro** do card aparecia cinza. Eu li como a
   de dentro e pus `#6b7280` ali.
2. Antes de editar, reli o Figma: `get_design_context` no nó `52:156` devolvia
   `text-white`, e o render do `52:3` saiu idêntico ao da sessão anterior — ou
   seja, **a alteração não estava no arquivo**. Apliquei mesmo assim, tratando a
   captura como a fonte, e registrei a divergência.
3. A medição do resultado deu **1,23:1 no pior ponto** da área do texto e
   **1,93:1 no melhor** — nenhum canto passava. Com branco, 5,95:1.
4. O usuário esclareceu: o tertiary é do **parágrafo ao lado do CTA**, que é o
   único "abaixo dos cards/pilares" — e que **já** estava em text-tertiary desde
   a primeira implementação. A descrição de dentro volta ao branco.

Duas lições que valem mais que o resultado:

- **A pergunta certa antes de editar uma cor é "qual elemento?", não "qual
  hex?".** Havia dois textos candidatos e "abaixo dos cards" apontava para o
  outro. O elemento certo estava à vista e eu não conferi.
- **A divergência entre o Figma e a captura era o sinal.** Quando o arquivo não
  mostra o que a captura mostra, a captura pode ser de outro estado, de outro
  frame, ou de outra intenção — e nenhuma dessas é "aplique assim mesmo". O
  certo era perguntar antes de codar, não depois de medir.

**2. O CTA "Conheça o Nubank" com a interação do "Quero ser Nubank".** Aqui
estava um **bug real**, não só uma inconsistência: o botão usava
`variant="solid"` com um `style` inline em cima, que fixava as cores de repouso
mas **não** tocava no `hover` nem no `active` — que continuavam vindo da
`solid`. O texto claro sobre o branco do hover e sobre o `Neutral/100` do active
dava menos de 1,2:1: o texto sumia nos dois estados.

Corrigido na raiz, e não com mais um `style` inline: **`CtaLink` ganhou a variante
`brand`**, que é **exatamente** o par e a cadeia do "Quero ser Nubank" da header
no estado condensado — `bg-nu-brand text-white hover:bg-nu-purple-800
active:bg-nu-purple-950`. Os dois botões ficaram indistinguíveis.

O texto do CTA é **branco**, e o usuário estava certo ao dizer `#ffffff`. Vale
registrar o porque, porque é o tipo de coisa que dá dúvida: o "Quero ser Nubank"
**no estado transparente** tem texto `Action/action-secondary-text` (`#820ad1`)
sobre o fundo claro `#f3e8ff` — não é branco. O branco é o do **estado
condensado**, que é o de fundo na cor da marca. Como o CTA da Ecossystem tem
fundo na cor da marca, é o condensado que serve de referência.

Contraste medido da variante `brand`: **7,21:1** no repouso, **9,33:1** no hover,
**15,24:1** no active.

**A duplicação com a header é intencional e precisa continuar em sincronia.** A
header escreve os mesmos valores em `group-data-[condensed]:`. Não dá para
extrair para uma constante: o Tailwind só enxerga classes escritas por extenso
no fonte, então uma string montada por concatenação não entraria no CSS gerado.
É uma restrição da ferramenta, e vale para qualquer refatoração desse tipo aqui.

**Lição que vem dos dois:** o `style` inline que "resolvia" a cor do botão
escondeu um bug de interação, porque a propriedade que ele sobrescrevia era só
uma das três do estado. Quando um componente tem variantes de interação, a
variação tem de morar no mesmo lugar — num `style`, o resto da cadeia fica para
trás em silêncio.

### 2026-10-17 — mojibake em `globals.css`, commitado e enviado

**Erro meu, corrigido.** Precisa ficar registrado porque o método de detecção
usado foi o que quase mascarou o problema.

**O que aconteceu.** Para remover o bloco da Ecossystem do `globals.css` eu usei
`splice` de linhas em PowerShell com `Set-Content`. O PowerShell 5.1 grava na
página de códigos do sistema, então os bytes UTF-8 de cada acento foram
reinterpretados: `à` (C3 A0) virou `Ã` + espaço não separável (C3 83 C2 A0). O
arquivo inteiro ficou assim — **143 ocorrências**, a começar da primeira linha.

Pior: o commit `6858522` só versionava o `CONTEXTO.md`, então a corrupção ficou
fora dele. Ela entrou no **`15c62a0`, que foi para o GitHub**.

**A detecção errada.** Cheguei a "confirmar" que o arquivo estava limpo usando
`git show` + regex, e o resultado dizia **LIMPO**. Estava errado: `git show`
escreve UTF-8 no stdout e o console do Windows devolve como CP1252, o que produz
`Ã§` numa string que estava correta. O mesmo vale para `Get-Content`. **Um teste
de encoding que passa pelo console do Windows dá falso positivo e falso
negativo.** Só bytes crus lidos com `TextDecoder` explícito, no `node`.

O `Ã` que apareceu numa linha do `globals.css` era o próprio caractere
corrompido. E `Ân` de "Ângulo" e `ÃO` de "NÃO" são falsos positivos do meu
padrão — acentos legítimos em português. Vale registrar porque um scanner de
mojibake sem lista de falsos positivos vira alarme constante.

**A correção.** `git checkout 6858522 -- src/app/globals.css` devolve a versão
limpa (o `git` mexe em bytes, não em texto, então não tem risco de encoding), e
a única alteração legítima — a linha do `--color-nu-text-tertiary` — foi
reaplicada com a ferramenta `edit`. O diff contra `6858522` agora tem **exatamente
uma linha**, e o arquivo está com as 143 CURVAS legítimas de volta.

**A regra que sai daqui:** `Set-Content` / `Out-File` / `Get-Content -Raw` não
tocam em arquivo-fonte deste projeto. Estão em "Antes de sugerir código".

### 2026-10-17 — hover nos cards da Ecossystem e pessoa mais suave

**A pessoa, mais suave.** `DURATION.slow` (1,1s) ficou curto para um percurso de
843px — lia como "colocada" e não como "subindo". Duração própria, 1,5s, sem
mexer em `DURATION.slow` porque a Hero e o reveal de texto usam o mesmo valor e
não são o caso.

**O hover empurra, e por isso não é `transform`.** Os dois crescem só na
horizontal, e o detalhe que define o efeito é **propriedade de layout, não
transform**: `flex-grow` no card ativo e `width` no pilar recolhido. `scale`
redesenha o elemento sem mexer no fluxo — o card cresceria *por cima* do vizinho
em vez de empurrá-lo, e é justamente o empurrar que foi pedido. Vertical não se
mexe: nenhum dos dois muda altura, o que manteria a composição alinhada.

Os valores são pequenos de propósito: 2,4% no card ativo (que tem mais de 1000px
— 2% seria imperceptível, 5% pareceria um clique) e 13% no pilar recolhido (107px
são poucos, e menos que isso não se veria). `:focus-visible` entra junto do
`:hover` nos dois botões, senão quem navega por teclado fica sem o feedback.

**A listra escura no Firefox foi `background-size` implícito.** O gradiente é um
SVG em data URI com `viewBox` e **sem** `width`/`height`, e aí os motores
divergem no que `auto` significa: o Chrome estica até a caixa, o Firefox usa as
dimensões do viewBox (1163×339) e **repete**. No repouso (1163px) as duas
leituras dão o mesmo pixel, então o defeito só aparecia no hover, quando o card
vai a 1193px: sobram 30px e a faixa repetida era a borda esquerda do gradiente —
que é a parte mais escura dele. Medido na mesma coluna: Firefox
`rgb(114,21,179)` contra Chrome `rgb(131,34,198)`, delta de ~26.

`background-size: 100% 100%` + `background-repeat: no-repeat` resolve, e os
dois motores passam a bater dentro de 2,4 níveis em toda a faixa.

**A lição que dá fora daqui:** um asset com tamanho **intrínseco ausente** é uma
divergência entre motores esperando para acontecer, e ela só aparece quando
alguma coisa muda de tamanho. Em repouso os dois motores davam o mesmo pixel, o
que fez o defeito parecer ser do *hover* — e não era: o hover só deu a condição
de aparecer. **Antes de culpar a propriedade que mudou, olhar as duas que não
mudaram.** O mesmo raciocínio já apareceu no resíduo de meio pixel do logo, que
também era divergência de motor e não de layout.