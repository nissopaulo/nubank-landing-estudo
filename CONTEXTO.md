# Contexto do projeto

> **Para o agente (leia no início de cada sessão).** Este arquivo é a memória do
> projeto. Antes de propor qualquer coisa: leia `README.md` (estado e decisões
> técnicas), depois este arquivo (estado atual e o que está em aberto). Ao final
> de uma sessão de trabalho relevante, atualize a seção **Registro de sessões** e
> o **Próximo passo** — não deixe o arquivo defasado.

- **Projeto:** landing page de estudo da Nu, reconstruída a partir de um design
  autoral no Figma. Sem vínculo oficial com a Nu Pagamentos.
- **Figma:** https://www.figma.com/design/16kp2jwaILwDfp44uYuNkP
- **Frames implementados:** `Hero Section` (node `14:446`, 1920×1080),
  `Ecossystem Section - Nubank` (node `52:3`, 1920×919) e `Cards Section -
  Nubank` (node `97:2`, 1920×1086)
- **Produção:** https://nubank-landing-estudo.vercel.app
- **Repositório:** https://github.com/nissopaulo/nubank-landing-estudo

---

## Estado atual

Três telas implementadas e funcionando. A **Hero**, com header fixo, cards em
parallax e rodapé. Abaixo dela a **Ecossystem Section**, carrossel de pilares —
**completa: os quatro desenhados**, os quatro clicáveis, e nenhum `PROVISÓRIO`
sobrando. Clicar num pilar reequilibra a linha de cards inteira, com transição.
Depois dela a **Cards Section**: um seletor de pílulas, o cartão de crédito que
inclina em 3D sob o ponteiro, e o nome, a descrição e o CTA. A Cards Section
**entra por scroll** — nada está lá quando se chega nela —, e a interação é da
**seção inteira**, não só do cartão.

A Cards Section está **no primeiro frame dos quatro**: só o `97:2` (Nubank) está
liberado, e as outras três pílulas são botões desativados com aviso para leitor
de tela. É decisão de processo, não falta de design — os quatro frames existem
no Figma, três deles ocultos.

Entre as seções e o rodapé existe um bloco **"Em construção"** que é
provisório e existe só para o CTA "Explore o Universo Nu" ter destino.

| | |
|---|---|
| Stack | Next.js 16.4 (App Router, Turbopack), React 19.3, TS, Tailwind v4, Motion 14, Phosphor Icons |
| Tipografia | Montserrat (única fonte), `next/font` self-hosted |
| Ícones | Phosphor Icons; logo da marca e peças do cartão são SVG do Figma |
| Qualidade | `tsc --noEmit` e `eslint` passam limpos (verificado 2026-10-18) |

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

**Leitura do nó `76:3` (Croma), 2026-10-17:** nenhuma variable nova também. O
único nome novo é `Background/bg-brand` (`#820ad1`), que é o mesmo valor de
`Text/text-brand` com outro nome — mais um caso de `#820ad1` ter dois nomes no
Figma, agora três.

**O Figma adotou a correção de contraste dos cards recolhidos.** O nó `76:3`
traz `text-[color:var(--neutral/800,#1c1c1e)]` no rótulo dos cards recolhidos,
que é a tinta que propus na sessão anterior (branco sobre `#e5e7eb` dava 1,24:1).
O design passou a ter 13,74:1.

**Leitura do nó `77:40` (Ultravioleta), 2026-10-17:** nenhuma variable nova
também. `Purple/950` e `Purple/600` aparecem porque a primeira e a última parada do
gradiente do card são exatamente esses dois valores — mas isso **não** significa
que são tokens utilizáveis: as três paradas do meio são interpolações do gradiente,
não cores do design system, e transformá-las em token seria inventar cor.

**Leitura do nó `97:2` (Cards Section), 2026-10-18:** **duas variables novas**,
e nenhuma delas é uma cor nova:

- `Purple/700` = `#820ad1` — o **quinto** nome que o Figma dá a esse valor
  (já eram `Text/text-brand`, `Action/action-secondary-text`,
  `Action/action-primary`, `Background/bg-brand` e `Border/border-brand`).
  Não vira token: `--color-nu-brand` já cobre o valor.
- `Purple/50` = `#faf5ff` — primeira parada do gradiente do fundo da seção.
  **Não** vira token pelo mesmo motivo de `Purple/950`/`Purple/600`: é a
  extremidade de um gradiente, e as seis paradas do meio são interpolações.

**O ponto 1 da lista de pendências abaixo subiu de 4 para 5 nomes.** Consolidar
`#820ad1` é agora ainda mais necessário, e o caso já tem lugar de fixo: o token
`--color-nu-brand`.

**Três pontos para resolver ao criar o design system:**

1. **`#820ad1` tem cinco nomes no Figma** — `Action/action-secondary-text`,
   `Text/text-brand`, `Action/action-primary`, `Background/bg-brand` e
   `Border/border-brand`. Consolidar em um só quando o DS for criado.
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
| 1 | ~~Desenhar no Figma o último pilar da Ecossystem~~ — **feito 2026-10-17**, os quatro frames (`52:3`, `76:3`, `77:40`, `80:77`) estão desenhados e os quatro abrem | — |
| 2 | **Desenhar no Figma os painéis dos submenus da navegação.** É o bloqueio do restante da página | `SiteHeader.tsx` |
| 3 | Desenhar no Figma as seções `Porque a Nu`, `Cartões`, `Diferenciais` — **a de `Cartões` começou** e virou a Cards Section (frame `97:2`); faltam `Porque a Nu` e `Diferenciais` | `SiteFooter.tsx` (`PendingSections`) |
| 4 | Menu mobile (depende do nº 2) — **adiado**, só depois que o design mobile existir | `SiteHeader.tsx` |
| 5 | Exportar do Figma o ícone do app definitivo (hoje é um quadrado placeholder) | `src/app/icon.svg` |
| 6 | Revisar texto do rodapé com o usuário (a parte mobile dos cards saiu da lista) | — |
| 7 | Limpar comentário desatualizado em `HeroSection.tsx` — ainda cita `Neutral/200`, 2,74:1 e "ainda não atinge 4.5:1". O estado real é branco puro a 5,52:1, passando AA | `src/components/hero/HeroSection.tsx` |
| 8 | Regra de ESLint proibindo hex literal fora do `globals.css`. Motivo: o gradiente de `HeroSection.tsx:27` tem quatro hex hardcoded no JSX, três deles já existentes como token — e isso passou por lint e revisão. O gradiente da Ecossystem **também** traz literal, mas é o export do Figma em data URI e não tem como ser token. É a única trava de deriva que dá para instalar **antes** do design system existir. Prioridade baixa por decisão do usuário (ver Storybook) | `eslint.config.mjs` |
| 9 | Montar o catálogo de componentes (Storybook ou equivalente) **depois** que o design system existir — ver decisão 11 | — |
| 10 | **A descrição do Croma reprova AA em texto pequeno** — 3,48:1 a 16 px, por desenho (a tinta é a própria marca sobre um creme que escurece). Implementado como o Figma pede. Se for para produção, a correção é no design, não no código | `ecosystem-pillars.ts` |
| 11 | **A descrição do Empresas passa em AA por 0,06:1 de folga** — pior ponto 4,56:1 a 16 px. Passa, mas é o mais apertado dos quatro cards e qualquer ajuste de tom no fundo para mais escuro reprova. Vale revisar junto com a nº 10, que é o caso oposto | `ecosystem-pillars.ts` |
| 12 | **A pílula inativa da Cards Section reprova AA em texto pequeno** — 4,40:1 a 16 px, contra 4,5:1. **Por 0,10:1.** O design puro passa (≈4,93:1 no export do Figma) e o grão 0.12 come 0,24 dessa folga; sem grão são 4,64:1. Implementado como o Figma pede. A correção é de design: fundo próprio na pílula, ou outra cor de texto | `card-showcase.ts` / `globals.css` |
| 13 | ~~A virada entre cartões está escrita e nunca executou~~ — **resolvido 2026-10-18**. Medida por CDP, e a medição achou um bug real: **os dois sentidos giravam para o mesmo lado**. Corrigido com o `custom` do `AnimatePresence` | `CreditCard.tsx` |
| 14 | **A pílula inativa do Croma reprova AA em texto pequeno** — 2,59:1 calculado direto do gradiente do design, 2,44:1 com o grão. É a pior reprovação do projeto: `#8f7f64` sobre o creme de `rgb(217,210,196)` na altura das pílulas. Implementado como o Figma pede; a correção é de design | `card-showcase.ts` |
| 15 | **O nome no cartão do Croma reprova AA em texto pequeno** — 4,26:1 no design, 4,12:1 com o grão. `Purple/800` sobre o gradiente do cartão. O pior ponto é a **base** do texto, onde o gradiente já passou da parada `bfb299`. Implementado como o Figma pede | `card-showcase.ts` |

**No Figma hoje existem nove frames visíveis** — `Hero Section` (`14:446`), os
**quatro** da Ecossystem (`52:3` Nubank, `76:3` Croma, `77:40` Ultravioleta,
`80:77` Business) e os **quatro** da Cards Section (`97:2` Nubank, `103:248`
Croma, `103:318` Ultravioleta, `103:383` Business) — mais os 4 frames soltos de
arte dos cartões. A Ecossystem está completa. Na Cards Section **só o `97:2`
está liberado**: os outros três estão ocultos por decisão de processo. Não há
design das seções seguintes — por isso os itens 2 e 3 bloqueiam o resto.

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
- **Medir contraste com o grão ligado**, porque é o estado que o usuário vê, e
  comparar com a mesma seção sem grão para separar as duas causas. Foi assim que
  a pílula inativa da Cards Section ficou registrada como 4,40:1 sendo 4,93:1 no
  design.
- **Contraste de fundo com gradiente: calcule, não amostre.** Quando o fundo é
  um `radialGradient` do Figma — que é uma string SVG que a gente copia crua —
  dá para avaliar o valor **no ponto**, analiticamente: `t = |M⁻¹(p − c)| / r`,
  e a cor é a interpolação das paradas em `t`. Sem amostra, sem grão, sem
  dithering. Validado duas vezes: a pílula do Nubank dá **4,61:1** calculada e
  **4,64:1** medida no render sem grão. Amostrar erra de três maneiras que já
  morderam aqui: glifo dentro da amostra, borda de 1px numa imagem reduzida (a
  borda da pílula dominou a faixa de 5px e devolveu a própria tinta), e o grão
  por cima.
- **Ao medir `rotateY` no navegador, o valor vivo está em `getComputedStyle`.**
  O Motion 14 anima transform por **WAAPI**, e com ela o `style.transform`
  inline fica no valor de **origem** enquanto o corrente mora na animação — ler o
  inline dá a mesma linha por 700ms e um salto no fim, que é a duração da
  animação, e parece bug de código. E o ângulo sai de `atan2(m31, m11)`:
  **`atan2(m13, m11)` devolve o valor negado**, e foi o que quase mostrou o gesto
  da virada invertido quando ele estava certo. Conferir o decoder contra um
  `rotateY(45deg)` conhecido leva um minuto e fecha a dúvida.
- **Ao medir contraste pela captura:** a caixa do *texto*, e não a do elemento
  (CTA e pílulas são `rounded-full`, e os cantos da caixa do elemento são fundo
  da seção — foi o que reprovou o CTA em 1,44:1 e a pílula em 1,2:1); o `clip` do
  CDP em coordenadas de **documento**, e não de viewport; e **esperar um repaint**
  depois de apagar a tinta. Sem a espera, `color: transparent` deixa o glifo na
  rasterização da camada composta e ele aparece como um fantasma claro — que é
  o pixel que reprova. A solução que funciona é pintar o glifo **da cor do
  próprio fundo**, o que mantém a layout intacta.
- **Verificar que o efeito APLICA antes de calibrar.** Esta é a quarta vez que a
  lição aparece (as três primeiras foram a sombra dos cards da Hero). O sintoma
  "o `nu` não aparece no cartão" parecia ser de asset, e era o `loading="lazy"`
  do `next/image` em elemento abaixo da dobra: `naturalWidth` 0 e um retângulo
  que não corresponde a pixel nenhum.
- **`prefers-reduced-motion` não é só o `MotionConfig`.** Ele desliga animação,
  não motion value, e a inclinação do cartão é motion value puro — o corte tem de
  ser no `handler` (`usePrefersReducedMotion()`), como na paralaxe da Hero.
- Este é o **Next.js 16**, não o que veio no treinamento. Ler o guia relevante em
  `node_modules/next/dist/docs/` antes de escrever qualquer coisa.
- Qualquer valor novo que venha do Figma precisa ser rastreável à origem (node id,
  nome da variável). `README.md > Fidelidade medida contra o Figma` é o padrão.
- Não quebrar as garantias já pagas: contraste AA medido, sem hydration mismatch,
  sem `aria-disabled` silencioso, sem conteúdo inventado.
- **NUNCA escrever uma classe do Tailwind "literal" na documentação.** O Tailwind
  v4 varre **o projeto inteiro** para achar classes, inclusive Markdown, e
  qualquer string com cara de classe vira uma regra de verdade no CSS. Citar
  `text-[color:var(--neutral/800,#1c1c1e)]` — que é o que o `get_design_context`
  devolve e o que a documentação precisa registrar — gera
  `color: var(--neutral/800,...)`, e `/` não é válido no nome de uma custom
  property: o Lightning CSS (Turbopack) rejeita com `Unexpected token
  Delim('/')`. O `@import "tailwindcss" source(none)` + `@source ".."` no
  `globals.css` impede que isso volte; **se ele for removido, a documentação
  volta a derrubar o build.** Ver a entrada de 2026-10-17 sobre isso.
- **`next build` e `next dev` discordam sobre gravidade de erro de CSS.** O build
  trata parse failure como **aviso** e segue — a Vercel deploya sem reclamar. O
  dev trata como **erro fatal** e mostra overlay. Então "passou no build" não
  prova que o CSS está válido: para CSS, o teste é abrir o `next dev`.
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

**A pessoa sobe de baixo para cima** — *(registro desta sessão; o `exit` passou a
rodar quando o Croma entrou, em 2026-10-17)*. Com `personRise`, em `lib/motion.ts`.
O deslocamento é % da altura da própria imagem e o que esconde é a posição, não
`opacity` — o HTML do servidor já sai com `transform: translateY(100%)`, então
não há flash antes da hidratação. 100% basta aqui (a pessoa tem 843px e a janela
de recorte tem 595px) onde os cards da Hero precisam de 150%.

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

### 2026-10-17 — Croma liberado, e a transição entre pilares

O usuário redesenhou o Croma no Figma na mesma estrutura (`76:3`, agora visível)
e pediu a animação de troca: dinâmica e suave.

**O achado que mudou a arquitetura.** No frame do Croma o card ativo é o
**segundo** da lista — o Nubank recolhe para o primeiro slot. Nas sessões
anteriores eu tratei como "um card ativo mais três botões", o que não permite
trocar de pilar sem remontar a linha. O certo são **quatro slots fixos, na ordem
do design, e um deles é o ativo**; a animação é o rebalanceamento. A soma confere
em qualquer estado: ativo `calc(100% - 357px)` + três de 107 + três gaps de 12 =
1520, a largura do `Main Content`.

Medido por CDP depois de um clique real: antes `1163/107/107/107`, depois
`107/1163/107/107` com o ativo em x=319 — que é a geometria do frame `76:3`.

**Duas coisas do Figma que mudaram em relação à sessão anterior.** O rótulo dos
cards recolhidos agora é `Neutral/800` — a correção de contraste que propus foi
adotada no design. E a tinta do card ativo **não é mais sempre branca**: no
Croma é `Background/bg-brand` (#820ad1), porque o fundo é creme. Implementado
como `--eco-ink` por card.

**A curva estava errada, e só medir mostra isso.** Subir de 1,1s para 1,5s não
resolvheu a sensação de "colocada" que a pessoa dava, e a intuição era aumentar
mais. O problema era outro: com `EASE_OUT_EXPO`, 82% dos 843px do percurso
acontecem nos primeiros 375ms — o que sobra é 1,1s arrastando os 5% finais.
Com uma curva assim **duração e velocidade percebida não são a mesma coisa**, e
aumentar a primeira só comprimenta a cauda. Substituí por `EASE_EMPHASIZED`
(`cubic-bezier(0.32, 0.72, 0, 1)`, Material 3) na pessoa e no morph dos cards.

Medido no navegador depois da troca: pessoa a 91% da subida aos 600ms (era 370ms),
98% aos 1005ms, assentada em 1690ms. Card a 62% aos 134ms. A diferença está no
meio do trajeto, que é onde o olho acompanha.

**Como medir transição, que é o que faltava.** `chrome --screenshot` fotografa no
load e não interage. Dirigi o Chrome pelo **DevTools Protocol** — `node` 22 já
tem `WebSocket` e `fetch` nativos, então dá para navegar, dar `click()` de
verdade e capturar em instantes escolhidos, sem dependência nova. Dois
detalhes: cada `Page.captureScreenshot` leva ~230ms, então um laço de amostragem
atrasa e o rótulo do tempo não bate com a foto (medir a posição e fotografar no
mesmo laço dá tempos falsos); e o `Runtime.evaluate` do clique precisa contar o
`t0` **dentro** da página, senão o instante 0 é o do retorno da chamada.

**Armadilha de verificação que quase custou um bug.** Para medir o hover sem
mouse, eu removia o `:hover` do CSS compilado com um replace. No `SiteHeader` o
patch temporário comeu o `background` de `transition-[background-color,…]` e
deixou `transition-[-color,…]` — alteração silenciosa, que o `git diff` mostrou
só porque eu conferi o arquivo depois de reverter. **Patch em arquivo-fonte
exige reverter verificando com `git diff`, não confiando no replace.**

**Contraste do Croma — falha de AA no texto pequeno, do próprio design.**
Medido na faixa real da descrição (x 343..870), em linhas de fundo puro: pior
ponto **3,48:1** no nosso render e 3,32:1 no export do Figma (a diferença é o
grão). Passa em texto grande, e a descrição tem 16px. Não é ajuste de tom que
resolve — para chegar a 4,5:1 sobre `#8f7f64` o texto precisaria ser bem mais
claro que a própria marca. Implementado como o design pede; registrado como
pendência nº 10.

**Armadilha de medição de contraste.** Medir em `x` até 900 dá 3,38:1 — pior que
o real — porque além de x≈870 não há mais glifo, é gradiente limpo. Medir
somente o pior pixel da faixa de fundo **adjacente** ao texto também erra: as
linhas y=499 e y=512 caem **dentro** das letras, e o pior ponto vira `#7d09ca`,
que é o próprio glifo. As linhas certas são as que ficam **entre** as linhas de
texto: y=468, 479 e 530.

**Movimento reduzido verificado de verdade.** Com
`Emulation.setEmulatedMedia({features:[{name:"prefers-reduced-motion",
value:"reduce"}]})`, 60ms após o clique as larguras já estão nas finais e a
pessoa já trocou de `src` sem subir. O seletor de teste precisou ser
`img[aria-hidden="true"]` — `img[draggable="false"]` também pega as imagens da
Hero.

### 2026-10-17 — o build quebrou por causa de uma linha de documentação

O usuário mandou o print do overlay do `next dev`: `Parsing CSS source code
failed`
em `globals.css.css:656`, `Unexpected token Delim('/')`, na regra

```
.text-\[color\:var\(--neutral\/800\,\#1c1c1e\)\] { color: var(--neutral/800,#1c1c1e); }
```

**A causa é a linha 170 do próprio `CONTEXTO.md`**, escrita na sessão anterior.
Ao documentar o mapeamento Figma → código, eu citei a classe que o
`get_design_context` devolve. O Tailwind v4 detecta as fontes **sozinho** e
varre o projeto inteiro — Markdown incluído —, então leu aquilo da documentação
como candidato e gerou a regra. E `var(--neutral/800)` é CSS inválido: o nome de
uma custom property é um `<dashed-ident>`, e `/` não é identificador.

**O detalhe que explica por que isso passou meses de revisão:** `next build`
trata parse failure de CSS como **aviso** e segue adiante — foi assim que a
Vercel fez deploy, com o CSS sem aquela regra, sem reclamar. `next dev` trata
como **erro fatal**. O mesmo código passa no CI e não abre local. E o commit
anterior foi verificado com `tsc` e `eslint` — **nenhum dos dois passa o
arquivo por um transformador de CSS**, então a verificação de sempre não tinha
como pegar isso.

**A correção é declarar as fontes, não escaping.** Em `globals.css`:

```css
@import "tailwindcss" source(none);
@source "..";
```

Duas coisas aprendidas no caminho, ambas por ter medido em vez de suposto:

1. **`@source` resolve a partir do diretório do CSS**, que aqui é `src/app`.
   Escrever `@source "../src"` aponta para `src/src`, que não existe — e o
   Tailwind **não avisa**: ele simplesmente não gera nada. Resultado silencioso:
   225 utilitárias desaparecidas do bundle e o build "passando". Foi comparar o
   número de seletores entre os dois builds que revelou.
2. **Comparar dois builds prova pouco.** O que prova é perguntar se **toda
   classe usada em `src/` tem regra no CSS** — 183 classes, e aí sim. Uma
   classe presente no código e ausente no CSS é estilo que não existe, e **não**
   quebra o build, então passa despercebido. Esse é o teste certo para
   qualquer mudança em detecção de fontes, e vale mais que a comparação.

**Verificado depois da correção:** `next dev` responde HTTP 200 com log limpo;
CSS servido com as 355 regras e `.eco-card*`, `--ease-emphasized` presentes e
zero ocorrência da classe venenosa. No build, diff de pixel do antes e do
depois: **23 pixels em 2.073.600** (0,0011%), numa única mancha de 8×9 numa
borda de card rotacionado, com o pixel de origem idêntico — antialiasing do
headless, não estilo perdido.

**A regra que fica:** `source(none)` não é configuração, é o que impede a
documentação de derrubar o build. Está em "Antes de sugerir código".

### 2026-10-17 — Ultravioleta liberado

O usuário redesenhou o Ultravioleta no Figma (`77:40`, agora visível). Só o
Empresas (`80:77`) continua oculto.

**O ativo é o terceiro slot** — Nubank e Croma recolhidos à esquerda. Isso era a
aposta da arquitetura de quatro slots fixos, e ela se pagou: **nenhum delta de 1px
nos três estados**, e a fórmula do `flex-basis` fecha para qualquer slot sem
nenhum caso especial. O caso do meio (ativo cercado de recolhidos dos dois lados)
é o único que os outros dois não exercitam.

| | Nubank | Croma | Ultravioleta |
|---|---|---|---|
| x do ativo (Main Content) | 0 | 119 | 238 |
| pessoa, Figma | 210 · 1129 × 843 | 414 · 973 × 648 | 551 · 928 × 618 |
| pessoa, nosso | igual | igual | igual |

O gradiente são **cinco paradas** (contra três no Nubank), ainda como data URI
pelo mesmo motivo do `gradientTransform`.

**Contraste: o Ultravioleta não tem problema nenhum, e é o oposto do Croma.**
Mesmo branco, mesmo 16 px, pior ponto **6,04:1** — e, mais forte que isso, **todo**
o card passa: a parada mais clara (#9b2fe8) dá 5,30:1. O que salva é o gradiente
de cinco paradas, não a escolha de tinta. Registrado porque mostra que a falha do
Croma é do **desenho** e não da decisão de texto claro sobre roxo.

### Medir gradiente: grão atrapalha, e inclinação separa as explicações

Comparar o gradiente do meu render com o do export do Figma acusou 13% dos pontos
fora de tolerância, delta 113. **Não era o gradiente.** Duas etapas para chegar
nisso, e as duas são reutilizáveis:

**1. O grão impede classificar card por cor.** A página tem `.nu-grain` em
`opacity` fixo sobre tudo, então o branco de fundo fica entre ~215 e 255 — e o card
recolhido é #e5e7eb = **229, dentro dessa faixa**. Duas versões do script
mediram errado por isso antes de eu parar de tentar: uma classificou o creme do
Croma como cinza e mediu 1225px; outra classificou o próprio fundo como card e
mediu a linha inteira (1650px). **A geometria tem que vir do DOM**
(`getBoundingClientRect`), que não chuta.

**2. O gradiente está certo se o erro for uniforme.** O perfil mostrou um
deslocamento de ~+10 no verde em todo o card — e a conta bate com o grão:
overlay de ruído a 0,12 sobre fundo escuro clareia em 0,12 × (128 − fundo); para o
verde 0x26 = 38 isso dá 11. Desligando com `--nu-grain-opacity: 0`, o resíduo cai
para 1–2 níveis em 290px, com **inclinação de 0,0006 níveis por px**. Inclinação
praticamente nula é a assinatura de offset uniforme; gradiente errado daria erro
crescendo de uma ponta à outra, de ordem 0,05 ou mais. **A inclinação é o
discriminador.**

**A lição sobre os meus próprios verificadores, que errei três vezes seguidas:**

1. Medi a geometria do "ativo" em coordenadas do frame (200 + slot × 119)
   esperando x=200/319/438, mas o DOM devolve **relativo ao `Main Content`** —
   0/119/238. O código estava certo nas três vezes.
2. Escrevi a fórmula de x à mão e errei o termo: o ativo é 1056px mais largo que
   um recolhido, então `x_i = i×119 + (i > k ? 1056 : 0)`. First escrevi `i >= k`,
   depois `i*119` sem o excesso. **Toda divergência que acusa erro onde a linha
   fecha em 1520 é do verificador** — e por isso o script agora imprime medido e
   esperado lado a lado, para a próxima divergência se explicar sozinha.

A regra: **fórmula de geometria no verificador é derivada, nunca digitada.** E
qualquer "DIVERGE" que persista depois de a soma fechar é motivo para olhar o
verificador antes do código.

**Verificado:** `tsc` e `eslint` limpos; build sem aviso de CSS; ciclo pelos quatro
cards em build de produção — Nubank, Croma, Ultravioleta, clique no Empresas
desativado (não muda nada), volta ao Nubank e Ultravioleta de novo. Soma da linha
1520 nos seis estados, pessoa com posição e tamanho exatos, CTA e texto do card
trocando juntos, e exatamente 1 card desativado em todos eles.

### 2026-10-17 — Empresas liberado, e o cursor dos cards

Duas coisas: o quarto pilar (frame `80:77`, agora visível) e um pedido de UX — os
cards não pareciam clicáveis no hover.

**A Ecossystem está completa.** Os quatro frames estão desenhados, os quatro abrem,
e nenhum `PROVISÓRIO` sobra. O Empresas é o **quarto** slot, o primeiro caso em
que o ativo vai para o fim da linha — e a linha **encolhe pela esquerda** em vez de
crescer para a direita, o oposto de todos os outros. Fecha em 1520 igual, com o
ativo em x 357 = 3 × 119, e a pessoa em left 735 · 889 × 668.

O gradiente do Empresas é o único não-roxo: **duas paradas em cinza claro**
(`Neutral/100` e `Neutral/300`, que já eram tokens), e a tinta volta a ser
`Text/text-brand`. Ou seja: é o Croma invertido — roxo sobre claro, quando o
Nubank e o Ultravioleta são branco sobre roxo.

**A folha de contraste dos quatro, que é a informação útil desta sessão:**

| Card | Fundo | Tinta | Pior ponto | AA texto pequeno |
|---|---|---|---|---|
| Nubank | radial roxo, 3 paradas | branco | 5,95:1 | sim |
| Ultravioleta | radial roxo, 5 paradas | branco | 6,04:1 | sim |
| Empresas | radial cinza, 2 paradas | roxo | **4,56:1** | sim, por 0,06 |
| Croma | linear creme | roxo | 3,48:1 | **nao** |

O que separa quem passa de quem não é a tinta, é o **gradiente**. Os dois que
passam com folga são os de 3 e 5 paradas em roxo; o que reprova é um linear de
duas cores com pouco contraste intrínseco. O Empresas passa mas raspando, e isso
virou pendência nº 11.

**O cursor: `<button>` não mostra a maozinha, e a causa não é o Tailwind.**
Medido pelo valor computado:

```
.eco-card            <button>  cursor: default      <- o bug
header nav button    <button>  cursor: not-allowed (tem aria-disabled)
header a             <a>       cursor: pointer
```

É o **UA stylesheet**: o Chrome põe `cursor: default` em `<button>`, e o
preflight do Tailwind v4 não desfaz — a única regra de cursor em todo o CSS
servido era a de `aria-disabled`. Ou seja, **todo botão deste projeto mostrava
seta**, e só ficou visível porque o pedido foi sobre o carrossel. A header escapa
por acaso, porque todos os botões dela estão desativados.

A correção é a regra `.eco-card { cursor: pointer }` com
`.eco-card[aria-disabled="true"] { cursor: not-allowed }` ao lado — **não** trocar
o elemento. `<button>` continua certo aqui: `aria-expanded` e acionamento por
teclado saem de graça, e um `<a>` sem `href` não é focável. Removi a utilitária
`aria-disabled:cursor-not-allowed` do JSX para o cursor ter fonte única; ela
continua em uso na header, que é outro componente.

**A lição de método:** eu ia procurar a regra no CSS e dizer que estava lá. Isso
não prova nada — a regra pode existir e perder para outra de especificidade maior,
ou ser anulada por `pointer-events` do ancestral. **Só o valor computado pelo
navegador responde**, e comparar com o esperado derivado do atributo é o que fecha
o teste. Vale para qualquer propriedade de aparência aparente, que é justamente
o tipo de coisa em que "o CSS está certo" e "aparece certo" divergem.

### 2026-10-17 — auditoria de fim da Ecossystem

A seção ficou completa, então usei a sessão para caçar o que tinha sobrado das
sessões anteriores. O que apareceu:

**Duas referências desatualizadas no CONTEXTO.** O "Estado atual" ainda dizia
"dois pilares desenhados", e a nota de pendência contava os frames ocultos do
Figma. Corrigido. E o registro da sessão do "só Nubank" afirmava que o `exit` da
pessoa **não rodava** e que o próximo passo era ligar o `useState` — as duas
coisas já eram verdade na sessão seguinte.

Ali é registro histórico e **não se reescreve**; o que fiz foi acrescentar uma
ponte de uma linha, para quem ler não parar ali achando que o `exit` nunca roda.
A seção "Estado atual" é a fonte da verdade, e ela estava errada.

**Export morto em `motion.ts`: três.** `EASE_OUT_QUINT`, `springSoft` e
`revealScale` estão exportados e nenhum componente os usa. **Mantive**, porque as
seções `Porque a Nu`, `Cartões` e `Diferenciais` vão ser desenhadas agora, e
reveal com escala e mola amortecida é o que costuma pedir nelas. Documentei o
status no próprio arquivo, com a instrução de apagar se não forem usados — export
morto sem explicação se confunde com esquecimento, e o lint não pega export não
importado.

**Utilitária órfã no CSS: zero, e isso é resultado do `source(none)`.** Cruzei as
utilitárias do bundle com o texto de `src/` e o resultado é **0 órfãs** — nenhuma
regra está mais sendo gerada a partir de documentação. O bundle caiu de 29.368
para 26.892 bytes (−2.476, −8,4%) e de 379 para 357 chaves de regra. O ganho é
duplo: o build parou de quebrar **e** parou de entregar peso que ninguém usa.

Esse script deu falso positivo **três vezes**, todas por causa do extrator e nunca
do CSS:

1. Só lia `className="..."`, e as variantes do `CtaLink` vivem em mapa de objeto
   → acusou 10 classes de hover/active como órfãs.
2. Passou a tokenizar por espaço com um lexer de classe delicado → engoliu
   `lg:mt-16`, `gap-[12px]` e companhia.
3. A versão que funciona **não tokeniza**: pergunta se o nome gerado aparece como
   substring em algum lugar do `src/`. É o que importa para "essa regra tem
   dono?", e como o texto é concatenado de todo o `src/`, uma classe citada em
   comentário também conta — o que só reduz falso positivo.

É a terceira vez seguida que um verificador meu acusa erro onde o código está
certo (as outras duas foram as fórmulas de geometria da Ecossystem). O padrão é
o mesmo: **confiar na medida feita com heurística antes de confiar no número que
ela imprime.**

### 2026-10-18 — Cards Section, primeiro frame (`97:2`)

O usuário desenhou uma seção nova e escondeu três dos quatro frames, para que o
trabalho fosse feito um de cada vez. Implementei só o `97:2`: seletor de pílulas,
cartão de crédito, nome, descrição e CTA.

**A decisão que define a seção: o cartão é DOM, não uma imagem exportada.** O
Figma compõe o cartão em camadas, e exportar como PNG daria o cartão perfeito
matando a interação pedida — não há como girar em 3D nem fazer um reflexo
seguir o ponteiro se não há nada para transformar. Montado em DOM, com os quatro
SVG do Figma como asset, e nada de `path` copiado para o código.

**Virada e inclinação não podem compartilhar um `transform`:** as duas usam
`rotateY`. São dois elementos aninhados — `.cc-flip` gira na troca, `.cc-tilt`
inclina no ponteiro. Se fossem um só, o segundo gesto cancelaria o primeiro no
meio. E a `perspective` fica no palco, que não se move, e não no cartão.

**O corte de movimento reduzido teve de ser em dois lugares.** O
`MotionConfig reducedMotion="user"` desliga animação, não motion value — e a
inclinação é motion value puro. O corte no `handler` é o mesmo da paralaxe da
Hero. O reflexo também sai fora por CSS, porque sem movimento ele continuaria
aparecendo parado no centro do cartão, o que não é movimento.

**O `rotateX` é invertido.** Girar para cima tem que empurrar o topo para longe
de quem olha. O caminho inverso foi testado e lê como "cartão caindo para
trás".

**A pílula inativa reprova AA por 0,10:1 — 4,40:1 a 16 px.** Separando as
causas por medição: 4,93:1 no export do Figma, 4,64:1 no nosso render sem grão,
4,40:1 com o grão em 0.12. Ou seja, **o design passa com 0,43 de folga e o grão
come 0,24**. Não é tinta errada nem tom errado. Implementado como o Figma pede e
registrado como pendência nº 12 — a correção é de design.

**A evidência da reprovação só saiu depois de três verificadores errados.** O
número do código estava certo desde o começo; o que estava errado foi o script,
três vezes seguidas, e pela mesma razão de sempre:

1. Medi a **caixa do elemento** em vez da **caixa do texto**. CTA e pílulas são
   `rounded-full`, então os cantos da caixa do elemento são fundo da seção — e
   foi esse pixel que reprovou o CTA em 1,44:1 e a pílula em 1,2:1, contra
   6,53:1 e 6,57:1 do texto real.
2. Usei o `clip` do CDP em coordenadas de **viewport**. Ele é em coordenadas de
   **documento**: o recorte caía na Ecossystem, que é branca, e toda tinta clara
   saía em 1:1.
3. Apaguei a tinta com `color: transparent` e capturei no mesmo instante. Em
   elemento promovido a camada própria — e o CTA e a pílula passam por animação
   do Motion — o glifo continua na rasterização e aparece como um fantasma
   claro, que é o pixel que reprova. A solução foi **pintar o glifo da cor do
   próprio fundo**, que some com o fantasma e mantém a layout intacta, mais uma
   espera de repaint antes de fotografar.

**É a quarta vez que um verificador meu acusa erro onde o código está certo**, e
a quinta vez que "confirmar que o efeito aplica" vem antes de calibrar. Esta vez
foi o `nu` do cartão que "não aparecia": parecia asset corrompido e era o
`loading="lazy"` do `next/image` em elemento abaixo da dobra — `naturalWidth` 0 e
um retângulo que não corresponde a pixel nenhum. Confirmar o efeito teria dito
"o asset está lá, o render é que ainda não pediu".

**Fidelidade, por medição e não por olho.** Geometria lida do DOM contra os nós
do frame: cartão 252,174 × 400, chip em `130,43 / 47,83`, marca `nu` 86,956 ×
47,432, pílula em `699,83` com gap 24 — todos batendo. Os 2,08 px a mais na altura
da seção vêm das três caixas de texto em que o Figma usa `leading: normal` e o
projeto usa `leading-[1.25]`, e não deslocam elemento nenhum.

Contra o export do Figma, com o grão desligado: erro médio 8,17 níveis, dos
quais **6,94 / 5,87 / 4,66** (R/G/B) são um offset uniforme — o dithering do
viewer, que o próprio arquivo já registra como falso grão. Tirado o offset o
resíduo cai para **3,54 níveis**, e a **inclinação do erro no eixo X é
0,00000 níveis/px**: zero é a assinatura de offset, e gradiente errado daria
erro crescendo de ponta a ponta.

**O cartão não tem sombra.** O diff mostrava um contorno aceso ao redor dele e
parecia sombra. Medido: a transição da borda é abrupta dos dois lados
(`236,223,246` a 3 px, `109,17,174` em 0 px), sem pixel intermediário. O
contorno é a borda de 1 px amplificada pelo fator 6 da visualização do diff.

**A tilt foi medida nos dois estados de movimento**, por CDP:
`rotateY` +11,2° / `rotateX` −8,5° no canto superior direito, `−11,2°` / `+8,3°`
no inferior esquerdo, `transform: none` ao sair do cartão, e `none` também com
`prefers-reduced-motion: reduce`.

**Posição na página:** a Cards Section entra **depois** da Ecossystem, e o bloco
"Em construção" continua existindo — ele existe para o CTA "Explore o Universo
Nu" ter destino, e a Cards Section não é esse destino.

**Verificado:** `tsc` e `eslint` limpos, build sem aviso de CSS, geometria batendo
com os nós do frame, contraste dos seis textos medido no render de produção com o
grão ligado, e a inclinação medida nos dois estados de movimento.

**Não verificado:** a **virada entre cartões**. As variantes estão escritas, com
os dois cartões montados ao mesmo tempo e a direção vinda do sentido da troca,
mas com um único frame liberado não existe troca para executar. Registrado como
pendência nº 13.

**Próximo passo:** aguardar o usuário liberar o `103:248` (Croma). Aí o
preenchimento é o campo `showcase` em `lib/card-showcase.ts` e nada mais muda no
componente — e a virada passa a ser medível.

### 2026-10-18 — interação na seção inteira, entrada por scroll e sombra

Três pedidos numa sessão: a interação do cartão deve alcançar a seção, a seção
deve **surgir** quando se chega nela, e o cartão precisa de sombra.

**1. A interação passou a ser da seção, com alcance.** O handler do `pointermove`
saiu do cartão e foi para a `<section>`, em `use-card-tilt.ts`. A resposta é
**direção × força**: direção normalizada contra a caixa do cartão e saturada em
±1, força que vale 1 dentro do cartão e morre 460 px depois da borda
(`CARD_TILT.reach`).

A saturação não é detalhe. Sem ela, passar do canto levava o cartão do ângulo
máximo direto ao oposto — o gesto virava uma guinada. E a força é o que evita o
cartão ficar travado no ângulo máximo assim que o ponteiro sai da caixa: sem
isso não parece reação, parece defeito. Medido, e as duas batem com a fórmula:

| Distância | Medida | `1 − d/460` |
|---|---|---|
| dentro do cartão | 1,000 | 1,000 |
| 150 px acima | 0,674 | 0,674 |
| 400 px abaixo | 0,139 | 0,130 |

**Os sinais dos dois eixos estavam trocados, e eu só descobri porque fui ler o
`transform` em texto.** Na sessão anterior eu tinha publicado uma tabela de
sinais lida da `matrix3d` computada, e ela estava errada: em `matrix3d` o sinal
de `rotateY` aparece em dois elementos com sinais opostos, e a leitura depende de
qual deles se olha. `style.transform` entrega `rotateX(-8.55deg) rotateY(-11.04deg)`
sem ambiguidade. O sinal certo é `rotateY = -x` e `rotateX = +y`: em CSS,
`rotateX(+θ)` traz a **base** para quem olha e `rotateY(+θ)` traz a **esquerda**,
e o que se quer é o oposto nos dois — a borda mais próxima do ponteiro avança.
Com o sinal trocado o cartão afunda na direção do mouse, que é o gesto de quem
pressiona.

**2. O reflexo nunca tinha funcionado — e eu não tinha percebido.** Era
posicionado por `--cc-glare-x`, uma custom property alimentada por motion value.
O React escrevia literalmente `[object Object]` no atributo `style`, o gradiente
ficava inválido, e **não havia erro nem aviso**. Nem `motion.span` resolveu: o
`useRender` do Motion passou o `style` direto ao React.

O que enganou foi a verificação: eu media o `opacity` do reflexo, que vinha de
outra fonte e respondia normalmente. Dois "efeitos" que só se confundem quando se
olha o `background-image` e não a variável. Agora o gradiente inteiro é uma
`MotionValue<string>` de `useMotionTemplate`, escrita em `backgroundImage` — uma
propriedade normal, sem depender de o Motion saber tratar custom property.

**Esta é a quinta vez que "confirmar que o efeito APLICA" vem antes de
calibrar**, e a segunda vez nesta seção só. O checklist honesto para um efeito
visual é: o `opacity` mudou, **o `background` mudou**, e a captura mostra o
elemento.

**3. `display: contents` quebrou a entrada por scroll, e em silêncio.** O
container do escalonamento usava `className="contents"` para não acrescentar
caixa nenhuma. `display: contents` **não gera caixa**, então o
`IntersectionObserver` do `whileInView` não tinha o que observar, a entrada
nunca rodava, e as pílulas ficaram presas em `translateY(24px)` — 24 px abaixo do
lugar, com a página toda funcionando. Virou `div` de verdade e o layout não
mudou: a seção é `items-center`, então o wrapper encolhe até o conteúdo e
continua centralizado. Confirmado por `pillBox.y` voltando a 96 na viewport.

**4. A sombra é desvio autoral, e medida antes de existir.** O Figma não tem
sombra no cartão — a transição da borda é abrupta dos dois lados
(`236,223,246` a 3 px, `109,17,174` em 0 px, sem pixel intermediário) e o
`get_design_context` não devolve `boxShadow`. Duas camadas pelo motivo da Hero:
difusão sozinha é larga demais para marcar borda. Tom em `Purple/950`, porque
preto puro sobre o lilás deixa halo cinza.

**A ref precisa ficar fora do objeto das motion values.** A regra
`react-hooks/refs` do projeto proíbe acessar qualquer propriedade de um objeto
que contenha uma ref durante o render — ela não distingue "isto é uma ref" de
"isto está ao lado de uma ref". Separar `cardRef` de `values` resolve, sem
desligar a regra.

**Duas sondas minhas encore erradas, pela mesma razão de sempre** (o verificador,
não o código):

1. `Emulation.setDeviceMetricsOverride` **não sobrevive entre execuções**, e a
   janela ficou em 764×485. Três dos pontos de teste caíam fora dela ou embaixo
   do header fixo, e a leitura saía zerada com cara de "o efeito não funciona".
   `elementFromPoint` no ponto do teste resolveu em uma linha.
2. A medição de contraste lia o retângulo **antes** da espera de repaint. Com a
   entrada por scroll, as pílulas ainda se movem durante a espera, e o recorte
   caía no fundo da seção — reprovando a pílula **ativa** em 1,51:1, que é a cor
   do próprio texto. Reler o retângulo depois da espera devolveu os 6,57:1
   corretos.

**Verificado:** `tsc`, `eslint` e build limpos; entrada medida antes e depois da
rolagem (`translateY(28px) scale(0.94)` com `opacity: 0` → assentada); sombra
computada em `rgb(46 16 101 / 0.16) 0 2px 4px` + `rgb(46 16 101 / 0.32) 0 24px
56px −12px`; inclinação e alcance medidos nos pontos da tabela; movimento
reduzido sem inclinação e sem reflexo; geometria da seção inalterada
(1920 × 1088,08, pílulas em y 100); e contraste dos seis textos refeito, com os
mesmos números de antes — o que confirma que a sombra não encosta no texto.

**`revealScale` saiu da lista de export morto.** Ele era uma das três variáveis
documentadas em `motion.ts` sem uso, mantidas para as seções que viriam; a
entrada do cartão passou a usá-la. `EASE_OUT_QUINT` e `springSoft` continuam sem
uso, e o comentário foi atualizado.

**Próximo passo:** aguardar o `103:318` (Ultravioleta). O preenchimento é o campo
`showcase` em `lib/card-showcase.ts` e, se o frame vier na composição `stack`,
nada mais no componente muda.

---

### 2026-10-18 — Croma liberado (`103:248`): a virada medida, e um bug nela

O usuário liberou o segundo frame. A seção agora tem dois cartões que trocam, e
a **pendência nº 13 — a virada escrita e nunca executada — foi medida**. Ela
achou um bug real.

**O bug: os dois sentidos giravam para o mesmo lado.** Medido por CDP:

```
Nubank -> Croma   saindo  0° -> +90°   entrando -90° -> 0°    correto
Croma  -> Nubank  saindo  0° -> +90°   entrando +90° -> 0°    ERRADO
```

A causa é estrutural e não é óbvia. O `AnimatePresence` mantém o cartão que sai
montado durante o `exit`, mas **com as props do render anterior** — e a direção
da transição é uma delas. Então o cartão que saía usava a direção de quando foi
criado, não a da troca que estava executando. A troca de conteúdo funcionava; o
gesto, não.

A correção é o `custom` do `AnimatePresence`, que é exatamente para isso: chega ao
`exit` do componente que está saindo, que já está com props velhas. O `initial`
continua vindo da prop, porque o cartão que entra é criado agora. Depois da
correção, os dois sentidos invertem.

**O que a medição custou, e por que ela quase mentiu.** Quatro sondas, quatro
erros, e em três deles o código estava certo:

1. `Emulation.setDeviceMetricsOverride` **não sobrevive entre execuções**. A
   janela ficou em 764×485, três pontos caíam fora dela ou sob o header, e a
   leitura saía zerada com cara de "a animação não roda".
2. Ler `el.style.transform` dá o valor **declarado**, não o vivo. O Motion 14
   anima transform por **WAAPI**, e com ela o inline fica na origem enquanto o
   corrente mora na animação. O sintoma é uma linha congelada por 700ms — que é
   exatamente a duração — e um salto no fim.
3. O decoder do ângulo usou `atan2(m13, m11)`, que é o par de **sinal oposto**:
   devolve o valor negado. Cheguei a concluir que o gesto estava invertido, e na
   verdade estava certo. Conferir contra um `rotateY(45deg)` conhecido resolveu em
   uma linha: o ângulo é `atan2(m31, m11)`.
4. O `clip` do CDP é em coordenadas de documento, e a espera de repaint precisa
   vir **antes** de ler o rect, não depois.

**A segunda coisa que o frame do Croma mostrou: quase nada é genérico.** O que
virou campo em `card-showcase.ts` porque muda entre os dois frames: o fundo da
seção (radial roxo de 8 paradas contra creme de 5), a paleta das pílulas, a tinta
da descrição (`Text/text-primary` contra `Text/text-brand`), a posição do chip e
o seu `inset`, os quatro assets do cartão e — o mais visível — **a composição**:
o `97:2` empilha três peças sem rotação, o `103:248` usa duas linhas alinhadas à
direita com **cada peça girada 90°**.

O que **não** virou campo: `Action/action-primary` no CTA e
`Background/bg-brand` no título, iguais nos dois. Se um frame futuro divergir, o
campo entra na hora.

**A paleta das pílulas vem do pilar ATIVO, e não do pilar de cada pílula.** A
primeira versão fez por pílula, e a pílula do Croma ficava `#8f7f64` sobre o
fundo lilás do Nubank — medindo 2,38:1. Não é um estado que o Figma jamais
mostra, e por isso não é um estado que a seção pode ter. O Figma mostra as quatro
pílulas na paleta do frame.

**Um bug de geometria que a medição pegou:** a rede de cartões do Croma saiu em
x 20,86 quando o frame a põe em 177,61. Faltava o `align-items: flex-end` do nó
`103:290` — o `items-end` é **do frame**, e eu tinha ficado só com o do Nubank.

**Duas reprovações novas de AA, e as duas são do design.** Para dizer isso sem
sampling — que erra de três maneiras aqui — o fundo foi **calculado do próprio
`radialGradient`**, que é a mesma string SVG que o Figma exportou:

```
t = |M⁻¹ (p − centro)| / r, e a cor é a interpolação das paradas em t
```

O método se validou sozinho: para a pílula do **Nubank** ele dá **4,61:1**, e o
pixel medido no render sem grão dá **4,64:1** — a diferença é o dithering do
viewer. Com o método aceito:

| Texto | No design | Com o grão 0,12 | |
|---|---|---|---|
| Pílula inativa — Nubank | 4,61:1 | 4,40:1 | ⚠️ nº 12 |
| Pílula inativa — Croma | **2,59:1** | 2,44:1 | ⚠️ nº 14 |
| Nome no cartão — Croma | **4,26:1** | 4,12:1 | ⚠️ nº 15 |

A nº 14 é a pior reprovação do projeto inteiro: `#8f7f64` sobre `rgb(217,210,196)`.
Oito valores que **não são token** e **não têm variable no Figma** entraram no
`globals.css` (`#8f7f64`, `#d7cfc1`, `#a7997f`, `#bfb299`, `#eeece9`), todos
literais do arquivo de design, como o gradiente linear do Ecossystem. As duas
cores das pílulas do Croma entram por custom property e não por classe: com
`#8f7f64` no meio não há classe a escrever.

**Verificado:** `tsc`, `eslint` e build limpos; geometria do Croma contra os nós
(`103:290`, `103:292`, `103:294`, `103:299`, `103:305`) batendo — nome em
20,86/20,86 21×149, marca `nu` em 183,89 47,42×86,95, rede em 177,63 53,69×86,86,
chip em 86,95/304,34; virada medida nos dois sentidos; contraste dos seis textos
nos dois pilares; e contra o export do Figma, com o grão desligado, erro médio
6,98 níveis, dos quais 5,61/5,03/4,68 são offset uniforme, com resíduo de **3,30**
e inclinação de erro de **0,00001 níveis/px** — a mesma assinatura do Nubank.

### 2026-10-18 — o Firefox não cull a face de costas, e a meia-volta virou duas

O defeito anterior reapareceu, agora identificado: **no Firefox, e durante o giro**.
No Chrome nunca acontecia — e é por isso que a correção anterior (que só tratava o
repouso) não resolveu.

#### Medido no Firefox de verdade

Firefox 158 instalado aqui, dirigido por **WebDriver BiDi**
(`--remote-debugging-port`), com `browsingContext.captureScreenshot`. Isso
importa: sem ele a hipótese anterior não seria testável, e o padrão do projeto —
verificar antes de mexer — seria inviável fora do Chrome.

Estado das duas faces, quadro a quadro, na meia-volta:

| momento | ângulo | frente | verso |
|---------|--------|--------|-------|
| 261ms   | 26°    | visible | visible |
| 444ms   | 77°    | visible | visible |
| 528ms   | 102°   | visible | visible |
| 828ms   | 179°   | visible | visible |

`backface-visibility: hidden` no estilo computado das duas faces, e **não
cumprido**. As duas pintam o giro inteiro.

#### Nenhuma das correções de CSS resolve — testadas no próprio Firefox

| candidata | resultado |
|---|---|
| remover `will-change: transform` do `.cc-tilt` | as duas continuam pintando |
| propagar `backface-visibility` para `.cc-tilt` e `.cc-face` | as duas continuam pintando |
| as duas juntas | as duas continuam pintando |

A correção é **remover a dependência**: a pintura é decidida pelo React, com
`visibility: hidden` na face que não está de frente.

#### E por isso a meia-volta passou a ser DUAS metades de 90°

A troca de face pintada acontece no `transitionend` da primeira metade — nos
**90°**, onde as duas faces estão de perfil e a largura projetada é zero. Medido
depois da correção: a troca acontece entre **22,4px e 19,1px** de largura, de
sliver para sliver, e não se vê.

`CARD_FLIP.half` substitui `CARD_FLIP.duration`: são `0,35s + 0,35s`, o mesmo
`DURATION.base` de antes. A curva é a mesma nas duas metades, o que coloca uma
quebra de velocidade exatamente nos 90° — onde a largura é zero.

#### Dois erros meus no caminho

**O primeiro:** derivei a face pintada do `angulo`, que é o valor **alvo**. No
começo da primeira metade ele já vale 90°, com a peça ainda em 0° — a pintura
trocava no primeiro quadro e a peça mostrava o verso de costas a meia volta
inteira. Quem manda é a fase.

**O segundo, mais caro:** no primeiro frame do Firefox eu vi "fundo roxo do
Nubank com nome, chip e marca do Croma" e escrevi que o motor estava
**intercalando** as duas faces. É falso — **os dois cartões dizem "PAULO
VINICIUS"**. O quadro roxo era o cartão do Nubank, correto. Só a face do Nubank
aparecendo era o defeito, e nada mais. Fui checar `card-showcase.ts` e os dois
`holder` são iguais.

Vale pelos dois: um diagnóstico que parece mais grave e mais interessante do que
o real é pior que nenhum, porque leva a uma correção errada com confiança.

#### Movimento reduzido

Sem transition não há `transitionend` para a segunda metade: a peça ficava
parada em 90°, de perfil, e o cartão da frente nunca aparecia. O caminho reduzido
salta os 180° num commit só.

**Verificado:** Chrome e Firefox, movimento normal e reduzido. 8 trocas
coerentes nos quatro casos; curva com 90° aos 49% do giro; tilt estável durante o
giro (8,18014° → 8,18415° → 8,18415°); diff contra o Figma sem regrão com resíduo
3,30 e inclinação 0,00001 níveis/px; contraste com as três reprovações de sempre
(4,40 / 2,44 / 4,12).

**Ferramenta nova:** o Firefox é dirigível por WebDriver BiDi nesta máquina, e
`browsingContext.captureScreenshot` existe no 158. Qualquer defeito de render
que só apareça fora do Chrome agora é verificável aqui — antes de mexer.

### 2026-10-18 — na volta o cartão aparecia ao contrário

A correção do Firefox resolveu o fantasma, mas criou outro defeito, só na
volta: **Croma → Nubank mostrava o cartão do Nubank de costas**, espelhado
("SUICIИIV OLUAP", logo `nu` invertida), depois de sumir.

#### A causa: eu estava contando em 90° o que é de 180°

A pintura vinha do ângulo, com `resto ∈ [90, 270] ⇒ verso`. Só que o **slot
pintado vira a cada 90°** do ângulo, e o **cartão só troca a cada 180°** — são
contagens diferentes, e eu tinha usado a segunda para a primeira.

Rastreando Croma → Nubank com `angulo` em 180, `virado` verdadeiro, `par` =
`{frente: Nubank, verso: Croma}`:

| fase | ângulo | slot pintado | cartão | |
|------|--------|--------------|--------|---|
| 1 | 180→270 | verso | Croma | certo: quem sai |
| 2 | 270→360 | verso | **Croma** | **errado**: o destino (Nubank) está na frente, de costas |

A fase 2 pintava o slot velho. E `fecharVirada` invertia o `par` no fim, tarde
demais para a segunda metade.

#### A correção

A pintura vem de `virado` e da fase, nunca do ângulo:

```ts
const pintandoVerso = virando ? (fase === 1 ? virado : !virado) : virado;
```

Primeira metade pinta quem está na tela (a peça mostra o cartão de onde se está
saindo, estreitando); segunda pinta o outro (o destino, alargando). E em
`select` o destino vai para o slot **escondido** — o oposto de quem está pintado,
que é justamente o que estará de frente depois:

```ts
const noEscuro = virado ? par.frente !== index : par.verso !== index;
```

Com movimento reduzido não há as duas metades, então `meiaVolta` inverte
`virado` junto com o ângulo.

#### Verificação: invariante geométrico, não comparação de tempos

Comparar "o que a pílula diz" com "o que está na tela" por timestamp foi o que
deixou passar as duas versões anteriores deste defeito. O invariante real é
geométrico e não depende de amostra:

> A face pintada tem que estar **de frente** para quem olha. Effective
> `angulo + 180` se for a de verso, e isso tem que cair em `[0,90)` ou `(270,360]`.
> Pode estar de costas só quando a largura projetada é ~0.

Na volta completa, a 380ms do giro: `ang=270`, `efetivo=270`, largura **2,1px** —
perfil, invisível, e logo depois o slot certo com o cartão certo. Chrome e Firefox.

**Verificado:** 8 trocas coerentes em movimento normal e reduzido; uma e apenas
uma face pintada em 27 amostras de giro; curva com 90° aos 49% (684ms); inclinação
estável durante o giro; diff contra o Figma com resíduo 3,30 e inclinação
0,00001 níveis/px; contraste com as três reprovações de sempre.

**Sobre a trava de reentrância:** `select` ignora clique durante o giro, e isso
descartou cliques nos meus próprios testes porque o CDP é lento. É o
comportamento correto (uma virada por vez), mas vale saber que existe.

### 2026-10-18 — Ultravioleta liberado (`103:318`)

O terceiro frame da Cards Section. Foi o primeiro em que **quase nada** do que os
dois primeiros ensinaram se aplica, e vale registrar por quê.

#### O que o frame traz de diferente

| | Nubank `97:2` | Croma `103:248` | Ultravioleta `103:318` |
|---|---|---|---|
| layout | `stack` | `rotated` | `stack` |
| eixo principal | `space-between` | `space-between` | **`flex-end`** |
| logo de rede | sim | sim | **não** |
| nome | no fluxo | girado 90° | **absoluto, com gradiente** |
| pílula ativa | `#820ad1` | `#eeece9` | **`#2e1065`** |
| pílula inativa | `#820ad1` | `#8f7f64` | **branco** |
| título | `#820ad1` | `#820ad1` | **branco** |
| CTA | `Action/action-primary` | idem | **`Purple/950`** |
| nome no cartão | "PAULO VINICIUS" | "PAULO VINICIUS" | **"Paulo Vinicius"** |

Cinco campos novos, e **nenhum é abstração**: cada um é um ponto em que a árvore
do Figma é diferente. `holderBox`, `holderGradient`, `network` opcional,
`titleInk` no `chrome` e `ctaVariant`.

O vão de cima do cartão **fica vazio**, e é assim que o design mostra: não tem
logo de rede. Inventar uma seria conteúdo que o Figma não tem.

#### O eixo principal, e o bug de uma linha

Com o nome absoluto (nó `103:381`), a única peça no fluxo é a marca `nu`, e
`space-between` com um filho só põe o filho no **começo** — a marca foi parar no
topo do cartão. O Figma diz `justify-end` (nó `103:363`), e é o que põe a marca
embaixo.

A regra entra pelo mesmo atributo do `holderBox` (`.cc-face[data-nome-absoluto]`)
porque no design os dois fatos vêm sempre juntos: não pode existir um sem o
outro.

E para isso aparecer foi preciso reiniciar o `next dev` — o Turbopack não tinha
recompilado o `globals.css` e a regra simplesmente não existia na página, sem
erro. **A mesma armadilha do `npm start` servindo build velha, com outro
disfarce.**

#### O nome em gradiente

`background-clip: text` de `Neutral/400` a `Neutral/100`. É o primeiro gradiente
de **texto** da seção, e precisa de `color: transparent` junto — sem ele o
gradiente fica atrás do texto e não aparece.

**A sonda de contraste precisou de duas mudanças** para medir esse caso:

1. `querySelector` com lista devolve o primeiro em ordem de **documento**, e o
   wrapper `.cc-holder` vem antes do filho — então o alvo precisa de `:has()`.
2. Com `background-clip: text`, a cor sonda é pintada **por cima** pelo fundo
   recortado, e o texto nunca "desaparece" — que é exatamente o que a sonda usa
   para achar o fundo. A sonda agora apaga o gradiente antes de medir.

E a tinta não é `cs.color`, que é `transparent`: entra a parada de **menor
luminância** do gradiente, que é o pior caso com texto claro sobre fundo escuro.

#### A quarta reprovação de contraste — e a pior do projeto

| # | Onde | Razão |
|---|---|---|
| 12 | Pílula inativa, Nubank | 4,40:1 |
| 14 | Pílula inativa, Croma | 2,44:1 |
| 15 | Nome no cartão, Croma | 4,12:1 |
| **16** | **Nome em gradiente, Ultravioleta** | **1,93:1** |

`#9ca3af` sobre `rgb(159,62,228)`. A primeira parada vale **0,81826%** do
gradiente — está quase no fim da rampa, sobre a parte mais clara do cartão. E o
número é conservador por construção: a sonda emparelha a parada mais escura com
o pior pixel da caixa. Mesmo a outra ponta, `#f3f4f6` sólido, daria 4,45:1 contra
o mesmo fundo — **as duas pontas reprovam**.

E o Ultravioleta é o **único dos três em que a pílula inativa passa**, com 7,10:1
— que era justamente o que estava em questão nos outros dois.

#### O CTA ganhou variante

`Purple/950` com texto branco é a única vez que a seção não usa a cor da marca.
Entrou como variante `deep` no `CtaLink`, e **a cadeia de interação é
PROVISÓRIA**: o Figma não traz hover nem active para este CTA, e o `Purple/950`
é o roxo mais escuro do design system — não há como escurecer mais no `active`.

#### Verificação

`tsc`, `eslint` e build limpos. Geometria contra os nós do frame: cartão 252,17 ×
400; nome em 20,86 / 192,69 (Figma 20,87 / 192,69); chip em 130,42 / 47,83
(Figma 130,43 / 47,83); marca `nu` 86,95 × 47,42 em 331,72; **sem** logo de rede;
`justify-content: flex-end`; `background-clip: text` com o gradiente certo; três
assets, todos do Ultravioleta.

Diff contra o export do Figma sem grão: erro médio **5,37** níveis (Croma é 6,98),
offset uniforme de 2,76/1,09/4,48, **resíduo 2,59** (Croma é 3,30), inclinação de
erro 0,00001 níveis/px — a mesma assinatura dos outros dois, e melhor que ambos.

Virada com **três** cartões, em Chrome e Firefox, movimento normal e reduzido: as
seis transições, inclusive os saltos que forçam a troca do slot escondido
(Nubank → Ultravioleta → Croma), sempre com uma face pintada e de frente para
quem olha. Contraste dos dezoito textos, com as quatro reprovações de design.

### 2026-10-18 — Empresas liberado (`103:383`): a Cards Section está completa

O quarto e último frame. **Seção fechada**: as quatro pílulas trocam, nenhuma fica
`aria-disabled`, e o aviso para leitor de tela some de todos.

#### Uma peça que só este frame tem

O rodapé do cartão do Business não é a marca `nu` sozinha: divide a linha com o
rótulo `business`, em `Text/text-brand` (#820ad1), alinhado à **base** da marca
(`items-end`) e na largura toda do conteúdo — 252,174 − 2 × 20,87 = **210,435px**
(nó `103:428`).

Entrou como `rowLabel` + `rowLabelInk`.

**O `rowLabelInk` é um campo separado, e por um motivo concreto.** A primeira
versão deixou o rótulo herdar a `ink` do cartão — e saiu `rgb(17,17,17)`, porque
no Business a tinta do cartão é `Text/text-primary` (#111), já que o cartão é
claro. O Figma põe o rótulo em `Text/text-brand`. Um campo só não dá conta: a
tinta do rótulo e a do cartão **são diferentes por design**, e só nesta combinação
(o cartão claro com rótulo roxo) é que a herança errada aparece.

#### E o eixo principal volta a ser `space-between`

O Business tem **três peças no fluxo** (rede, nome, pé) e volta ao
`space-between`. Só o Ultravioleta é `flex-end`, porque tem uma peça só. A regra
continua entrando pelo atributo do `holderBox`, e aqui ele não aparece — o que é
a prova de que o atributo está ligada ao fato certo e não ao cartão.

#### Empresas é o único pilar sem nenhuma reprovação

| | |
|---|---|
| Título 64 px | 5,93:1 ✅ |
| Descrição 16 px | 5,93:1 ✅ |
| Nome no cartão | 13,62:1 ✅ |
| CTA | 6,53:1 ✅ |
| Pílula ativa | 6,57:1 ✅ |
| Pílula inativa | 5,76:1 ✅ |

E não por acaso: é o **único com fundo claro**. A mesma tinta roxa da pílula
inativa dá 5,76:1 sobre o branco do Business, 4,40:1 sobre o lilás do Nubank e
2,44:1 sobre o creme do Croma. **A mesma escolha de design, três resultados
diferentes** — e o contraste do texto não é propriedade da tinta, é do par tinta
sobre fundo.

#### Sobre o offset uniforme do diff

O diff acusa −5,95 / −5,91 / −6,17 contra o export do Figma, e vale registrar
que **é sistemático**: o Croma acusa −5,61 / −5,03 / −4,68 e o Ultravioleta
−2,76 / −1,09 / −4,48. É o resíduo do método (grão desligado por custom property
no `:root`, que não é o elemento onde a regra do `.nu-grain` é lida), não uma
diferença do Business.

O número que compara entre frames é o **resíduo depois do offset**, e o Business
fica em **2,82** — melhor que o Croma e o Nubank (3,30), na mesma linha do
Ultravioleta (2,59), com a mesma inclinação de erro de 0,00001 níveis/px.

#### Verificação

`tsc`, `eslint` e build limpos.

Geometria contra os nós do frame: cartão 252,17 × 400 em (833,91; 242);
`justify-content: space-between`; nome em 20,86 / 192,27; rede 86,86 × 53,67 em
20,86; linha de base 210,45 × 47,42 em 20,86 / 331,72; rótulo "business" em
152,89 / 357,41 (a base dele fecha com a da marca, em 379,14); chip em
130,42 / 47,83; título e descrição em `#820ad1`; CTA `#820ad1` com texto branco;
quatro assets, todos `empresas-`; **sem** `data-nome-absoluto`, que é o que
confirma o `space-between`.

Virada com **quatro** cartões, em Chrome e Firefox, movimento normal e reduzido:
**doze transições**, inclusive os saltos que forçam a troca do slot escondido
(Croma → Ultravioleta → Empresas → Nubank → Ultravioleta → …), sempre com uma face
pintada e de frente para quem olha.

Contraste dos **vinte e quatro** textos dos quatro pilares. Diff com resíduo
2,82 e inclinação 0,00001 níveis/px.

**Uma verificação ficou obsoleta e teve de ser invertida:** `prova-ocultas.mjs`
afirmava que as pílulas sem frame eram `aria-disabled` sem efeito — o que deixou de
ser verdade. Passou a afirmar o oposto: **zero** pílulas bloqueadas e as quatro
trocando. Uma verificação que não acompanha o produto passa a garantir o
contrário do que diz.

### 2026-10-18 — a paleta da seção também passou a virar

Pedido: a troca de pilar trocava o fundo de uma vez. E "talvez algo mais dinâmico
e suave".

#### `background-image` não é animável, e isso não dá erro

`transition: background-image` no `globals.css` **não dá erro nenhum e não
acontece nada** — o mesmo modo de falha do reflexo e do texto em gradiente, e a
terceira vez que a mesma armadilha aparece nesta seção.

A saída são duas camadas empilhadas.

#### Qual camada carrega o quê — e por que é a que importa

**Durante** a virada, o `background-image` da `<section>` é o do pilar que está
**saindo**, e a camada por cima é a do que está **entrando**. No fim, a seção
assume o novo e a camada é desmontada.

Isso é o que torna a desmontagem **invisível**: no instante em que ela acontece a
camada já está com `opacity: 1` e `scale: 1`, exatamente sobre o que passa a ser o
fundo. Se fosse o inverso — a seção assumindo o novo e a camada carregando o
antigo — haveria um quadro em que as duas estão a 50% e o fundo pisca no meio.

**Medido no último quadro em que a camada existe: `opacity: 1`,
`transform: none`.** É a prova de que a saída não é um pulo.

E para medir isso a verificação quase passou errado: eu media o `style` **inline**
da camada, que mostra `opacity: 0; scale: 1.02` porque o Motion escreve os
valores animados por **WAAPI** e o atributo fica nos do `initial` a vida toda. O
certo é o `getComputedStyle` no último quadro — o que está visível no quadro
seguinte.

#### A escala é o que dá o movimento

Opacidade sozinha é um *dissolve*: liso, e parado. A camada que entra vem de
`1.02` e assenta em `1` — a paleta nova **chega** em vez de aparecer, e o gesto da
meia-volta, que gira para fora, continua para dentro.

A duração é `DURATION.base`, que é exatamente `2 × CARD_FLIP.half` — o que a
meia-volta inteira leva. É o que faz cartão e paleta chegarem **juntos**; fazer a
paleta durar mais deixaria o cartão parado no destino com o fundo ainda chegando.

#### Dois detalhes que só aparecem medidos

- **`pointer-events: none` na camada.** Sem isso ela intercepta o `pointermove` da
  seção e a inclinação do cartão morre exatamente na área onde a transição
  acontece. Verificado por `elementFromPoint` (o alvo tem que ser a própria seção)
  e pela inclinação ainda viva a 320ms da virada.
- **`#cartoes > * { position: relative; z-index: 1 }`.** Na ordem de pintura, um
  descendente posicionado com `z-index: 0` pinta **depois** do conteúdo em fluxo.
  A camada sozinha cobriria as pílulas e o cartão — e nenhuma verificação de
  geometria pegaria isso, porque as caixas continuam certas.

#### E o movimento reduzido congelava a seção

`MotionConfig reducedMotion="user"` governa as animações do Motion, e eu assumi
que cobria a camada. **Não cobre.** Medido: com `prefers-reduced-motion: reduce` a
camada fica **congelada em `opacity: 0.007` e `scale(1.02)`**, o
`onAnimationComplete` nunca dispara, a camada nunca some — e a seção fica
mostrando a paleta antiga **para sempre**, em duas trocas de cada quatro.

O Motion pula animação de *transform* sob movimento reduzido, e pula **deixando
o valor inicial**; a de `opacity` continua rodando, e nenhuma das duas chega ao
fim.

Correção: a camada **não existe** sob movimento reduzido, e a paleta troca na
hora — que é o que a preferência pede. É o mesmo caminho síncrono que a meia-volta
já usava, e pela mesma razão: nenhum evento dependable numa animação que o
usuário pediu para não ver.

**Verificado:** Chrome e Firefox, movimento normal e reduzido. A camada entra
(0 → 0,414 → 0,827 → 0,919 → 0,966 → 0,987 → 0,996 → 1), não intercepta o
ponteiro, assenta em `opacity: 1` / `scale: 1` no último quadro e some sem pulo.
A inclinação continua respondendo durante a virada do fundo. Curva do cartão,
contraste dos vinte e quatro textos e as doze transições de quatro cartões, sem
regressão.

#### E aí quebrou a seção inteira, por uma regra cega

Relatado logo depois: **todo o conteúdo desce na troca, o cartão gira e não tem
animação nenhuma**.

A causa foi a regra que eu mesmo escrevi para resolver a ordem de pintura —
`#cartoes > * { position: relative; z-index: 1 }`. Ela casa **também** com a
camada, porque a camada é filha direta da seção, e `#cartoes > *` tem
especificidade de **ID**, que ganha do `.cc-bg-entra`. A camada perdeu o
`position: absolute`, saiu do fluxo e virou item do flex da coluna: os 100px de
`gap` mais a altura dela empurraram tudo para baixo.

**Nenhuma verificação de geometria pegaria.** As caixas de cada peça continuam
certas — o que mudou foi a posição delas na seção. E eu medi geometria de
peça, não geometria de seção.

A correção inverte a estratégia em vez de consertar a regra: `z-index: -1` na
camada e `isolation: isolate` na seção. A camada passa a pintar entre o fundo da
seção e o conteúdo sem nenhuma regra nos filhos — e não há mais regra cega para
errar de novo.

#### E um segundo defeito, mais antigo, que eu nunca tinha visto

O `revealUp` do CTA (`y: 24 → 0`) estava **dentro** do elemento que o
`AnimatePresence` remonta a cada troca. Elemento novo com `initial="hidden"`
recomeça nele — então o CTA **subia 24px a cada clique**, por cima do
cross-fade que o `AnimatePresence` já fazia.

Isto não foi introduzido agora: está na seção desde o primeiro frame. Eu nunca
tinha medido a posição do CTA **durante** a troca, só em repouso — e em repouso
ele sempre esteve certo.

O reveal foi para um wrapper estável em volta do `AnimatePresence`.

#### A verificação que pega os dois

`prova-fluxo.mjs` mede a geometria **da seção** — altura, e a posição das pílulas,
do cartão, do título e do CTA — e afirma que **nenhuma delas muda durante a
virada**, em cinco instantes. É a contraparte de todas as outras, que medem as
peças: uma caixa de peça continua certa quando a peça inteira é deslocada.

**Verificado:** geometria da seção constante (altura 1088; pílulas 100; cartão 242;
título 706; CTA 948) em repouso e em cinco instantes da virada. Camada
`absolute` / `z-index: -1` / `pointer-events: none`, assentando em `opacity: 1` e
`scale: 1`. Movimento reduzido sem camada. Chrome e Firefox. Curva, contraste e
as doze transições sem regressão.

### 2026-10-18 — a face de trás aparecia, e a culpa não era do `backface-visibility`

Relatório: no Croma o cartão do Nubank aparecia **atrás**, num ângulo levemente
diferente.

#### O ângulo errado é a assinatura

A face de trás fica em `R_y(180°)·R_tilt`. A rotação de 180° do pai **espelha o
eixo X**, então a inclinação da face oculta aparece invertida e o cartão de trás
fica deslocado para o lado oposto do que a face da frente faz. Desenhar o
produto das matrizes explica a imagem antes de qualquer medição.

#### Não reproduz no Chrome headless

Seis configurações, com o cartão parado e inclinado, sem `will-change`, sem
sombra, com a frente em `display: none`: **o roxo nunca aparece**. Uma delas
ainda media a região errada — o `clip` do `Page.captureScreenshot` é em
coordenadas de **documento**, e sem somar `window.scrollX/Y` a amostra caía na
Hero, que é lilás por outro motivo. Foi esse o erro que quase mandou seguir adiante
com uma bissecção que "confirmava" a hipótese errada.

#### A correção não é um conserto de navegador: é remover a dependência

`visibility: hidden` na face que não está de frente, **em repouso**:

```jsx
<div className="cc-card cc-card--frente" data-oculta={ocultaFrente || undefined}>
<div className="cc-card cc-card--verso"  data-oculta={ocultaVerso  || undefined}>
```

O `data-oculta` sai de `!virando && !mostrandoFrente` — e `mostrandoFrente` já
existia, derivado do ângulo acumulado. Nada de estado novo.

Durante o giro as duas pintam, porque a passagem é aos 90° e é por ângulo. O
`backface-visibility` continua sendo a ferramenta certa ali.

**Verificado:** cull determinístico em repouso (só a face de frente pinta, nos
dois pilares) e as duas pintando em seis amostras durante o giro, com o `virando`
destravando certo ao fim. Virada, ângulo acumulado, inclinação e contraste sem
regressão.

#### E uma armadilha da própria verificação

`contrast-cards.mjs` mede o nome no cartão com `querySelector('.cc-holder')` — a
**primeira** do DOM, que é a da face oculta. Depois da correção ela passou a
medir um elemento com `visibility: hidden` e reportou **1,76:1** com tinta
branca: um número que não existe na tela. O alvo virou
`.cc-card:not([data-oculta]) .cc-holder`, e os três números voltaram a bater com
as pendências: **4,40** (nº 12), **2,44** (nº 14) e **4,12** (nº 15).

Vale registrar porque a leitura foi a de uma regressão séria de contraste, e a
regra é a mesma de outros casos aqui: **verificação que mede o que está na tela,
não o que está no DOM.**

### 2026-10-18 — a virada virou um cartão de verdade, e o bug da interação morreu

O relato foi duplo: **trocar para o Croma matava a interação** (a inclinação
não voltava nem com F5) e **a transição estava ruim**.

#### O que era

A virada era o archetype "dois cartões se cruzando": o `AnimatePresence`
montava o cartão novo, o antigo saía em `rotateY(+90°)` e o novo entrava de
`rotateY(-90°)`, cruzando por 90° no meio. É o gesto de *um cartão sai e outro
entra*, não de *virou o cartão*.

#### A interação morria por causa do `AnimatePresence`, e era a ref

`useCardTilt` segurava uma `ref` no elemento do cartão. O `AnimatePresence`
mantém o cartão antigo montado durante o `exit`, e o `ref` de um elemento só é
limpo quando ele **deixa de existir** — então o cartão que saía zerava a ref do
cartão que tinha acabado de entrar, e a inclinação morria para sempre. Nenhum
erro, nenhum aviso.

A primeira correção foi trocar a ref por `document.querySelector(".cc-face")`,
e **isso estava errado por um motivo instructive**: com a virada nova existem
**duas** `.cc-face` (frente e verso), e a primeira do DOM é a da frente — que
**durante o giro está de costas**. Pior: `rotateY` estreita o
`getBoundingClientRect()` da face, e aos 95° a largura cai de 252px para
**23px**, então a direção passava a ser medida contra uma caixa quase nula.

A tentativa de distinguir as faces por `backface-visibility` também falhou, e é
o mais instrutivo de todos: **as duas faces têm `hidden`** — é exatamente isso
que faz a virada mostrar só uma. Não existe filtro em `backface-visibility` que
separe frente de verso; o que decide é o **ângulo da peça**, e o ângulo já é da
peça.

**O que resolveu:** medir contra o **palco** (`.cc-stage`). Ele não gira, não é
remontado, e tem exatamente a mesma caixa do cartão — 252,174 × 400, sem
padding. Medido com o ponteiro **parado** sobre o mesmo ponto, antes, durante e
depois do giro: **8,18014° → 8,18415° → 8,18415°**. Variação 0,00°.

#### A transição ruim tinha nome: era `EASE_EMPHASIZED`

`EASE_EMPHASIZED` é a curva certa para *entrada*. Em meia-volta ela é errada, e o
erro é mensurável. Com a transição ancorada no `transitionrun`:

| momento | quanto do giro já foi feito, com `EASE_EMPHASIZED` |
|---------|-------------------------------------------------------|
| 100ms   | 43%                                                     |
| 133ms   | 70%                                                     |
| 284ms   | 93%                                                     |
| 417ms   | 98%                                                     |
| 567ms   | 100%                                                    |

O cartão **passa de perfil (90°) aos 16% da duração** — 112ms de 700ms. A troca
de frente e verso acontece ali, e o que sobra são ~500ms arrastando nos últimos
7% do giro. Não é lento: é o contrário, resolve o gesto em um quinto do tempo e
depois finge que continua.

Os 90° são o instante decisivo porque a largura projetada é `w·|cos θ|`: zero
aos 90°, e é onde frente e verso trocam de vez.

**A curva nova é `cubic-bezier(0.75, 0.75, 0.8, 1)`, em `CARD_FLIP`.** Saiu de
uma busca em grade, não do gosto. E o resultado registra um conflito real:

> Com uma Bézier só, **"responde no clique" e "troca no meio" puxam em direções
> opostas**. Exigindo 90° entre 45% e 52%, pouso com `y₂ ≥ 0.85` e cauda até
> 95% da duração, o conjunto de soluções é **vazio**. O que se sacrifica é o
> arranque: `EASE_EMPHASIZED` tem 18% do giro aos 50ms, a nova tem 7% (≈12°,
> no terceiro quadro).

Medido com a curva nova: giro de 667ms, **90° aos 317ms = 47%**, e
`12% → 22% → 32% → 43% → 54% → 65% → 76% → 87% → 96%`. Os últimos 7% do giro
caíram de **40% para 13%** da duração.

#### A virada é de UM cartão só, e o ângulo só acumula

`.cc-flip` gira 180° a cada troca; `.cc-card--frente` e `.cc-card--verso` ficam
**sempre montados**, um como frente e outro como verso, com
`backface-visibility: hidden`. O `AnimatePresence` saiu do cartão.

O ângulo **acumula** — 0, 180, 360, 540, 720 — e quem está visível é **derivado
dele**: frente nos múltiplos de 360, verso nos outros.

Isso não é detalhe, é o que elimina a classe inteira de bug. A versão anterior
zerava o ângulo no fim do giro e trocava o par junto, e para o par valer na hora
os dois precisavam cair no mesmo commit, com o `transform` de 180° para 0° sem
transição (`data-travado`). **Funcionou, mas com o preço de um dessincronismo
que apareceu em produção:** numa troca Nubank → Croma o título virava "Cartão
Croma" e o cartão na tela era o Nubank — a peça em 180° mostrando o verso, que
já era o antigo. Sem reset, não há o que dessincronizar.

#### `prefers-reduced-motion` prendeva a seção inteira

O caminho normal é `transition` CSS e o fim vem no `transitionend`. Com
movimento reduzido a regra global corta a transition para 0.01ms, o navegador
**não chega a gerar transição**, e `transitionend` nunca dispara: a peça ficava
em 180°, `virando` nunca voltava a `false`, e o `select` ignorava todo clique
seguinte. Seção morta no primeiro clique.

O caminho reduzido é **síncrono** e não passa por evento nenhum:
`meiaVolta` não seta `virando` quando `usePrefersReducedMotion()` é verdadeiro,
e o ângulo salta.

#### Verificação que os bugs anteriores não pegavam

Duas verificações antigas só liam o `h2` e a pílula, e **passaram com o cartão
errado na tela**. A que pega é `prova-face.mjs`: ela lê a face que o ângulo diz
que está de frente, e compara com a pílula. E `prova-acumulo.mjs` lê o **style
inline** (`rotateY(360deg)`, `rotateY(540deg)`…), porque `atan2` devolve o
ângulo módulo 360 e não distingue 0 de 360.

**Verificado:** `tsc`, `eslint` e build limpos. Inclinação viva nas 3
voltas (9 medições), estável durante o giro, sinal correto dos dois lados;
8 trocas coerentes em movimento normal **e** reduzido; ângulo acumulando
0→180→360→540→720→900→1080 com a face visível sempre acompanhando; curva com
90° aos 47%; diff contra o export do Figma sem regrão com resíduo 3,30 e
inclinação 0,00001 níveis/px; contraste dos oito textos inalterado.

**Lição que custou tempo:** `npm start` é **`next start`**, não `next dev`.
Ele serve o `.next` da **última build** — vários testes rodaram código velho sem
nenhum sinal, e um `setVirando(false)` que eu tinha acabado de adicionar "não
funcionava". A sequência correta de verificação é `npm run build` **antes** de
`npm start`.

### 2026-10-19 — commit e push da Cards Section completa (Empresas liberado)

Commit `d772a87` no `main`, push para o GitHub (`origin/main`). O deploy na
Vercel é disparado automaticamente pelo push (produção:
https://nubank-landing-estudo.vercel.app).

**Fluxo "pode commitar" executado na íntegra:** `tsc --noEmit` (limpo),
`npm run lint` (limpo), `npm run build` (limpo, produção estática na rota `/`),
commit com mensagem longa em arquivo (`git commit -F`), push.

**O que foi commitado:** a Cards Section fecha com o quarto e último frame
(Empresas / `103:383`), a camada de paleta que entra/sai na troca de pilar
(`cc-bg-entra`, `isolation: isolate`, `z-index: -1`), o `revealUp` do CTA em
wrapper estável, e a constante `CARD_BG` em `lib/motion.ts`. Quatro novos SVGs
em `public/images/credit-card/empresas-*`. README.md e CONTEXTO.md atualizados
com a tabela de divergência dos quatro frames, contraste de Empresas (zero
reprovações) e próximos passos (navegação/submenus é o próximo bloco).

**Próximo passo natural:** desenhar no Figma os painéis dos submenus da
navegação (pendência #2, bloqueio do restante da página) e, em seguida,
implementá-los em `SiteHeader.tsx` substituindo `NAV_ITEMS` /
`aria-disabled` por painéis reais. Enquanto não existe no Figma, não há código
para escrever aqui — conteúdo não se inventa.

### 2026-10-20 — Solutions Section: primeira opção (Safe / Caixinhas)

Commit `55ebb88` no `main`, push para o GitHub (`origin/main`). O deploy na
Vercel é disparado automaticamente pelo push.

**Fluxo "pode commitar" executado na íntegra:** `tsc --noEmit` (limpo),
`npm run lint` (limpo), `npm run build` (limpo), commit com mensagem longa
em arquivo (`git commit -F`), push.

**O que foi commitado:**
- `src/components/solutions/SolutionsSection.tsx` — primeiro frame da seção
  (Safe / Caixinhas, nó `144:2` do Figma), integrado em
  `src/app/page.tsx` entre a Cards Section e o PendingSections.
- Entrada por scroll (`whileInView` com `once`), igual ao padrão das demais
  seções.
- Background principal com parallax suave do mouse em toda a seção (direção ×
  força, alcance 600px, mola), desligado sob `prefers-reduced-motion`.
- Opção ativa em destaque (fundo da marca + texto branco); inativas com borda
  da marca, texto da marca, escala reduzida e blur.
- Badge "Caixinhas", título e CTA "Saiba Mais" lidos do Figma.
- Background desfocado à direita (prévia da próxima opção).
- Imagens de background em `public/images/backgrounds/` (safe-image,
  serenity-image, trade-image, upstairs-image — já colocadas pelo usuário).

**Próximo passo:** implementar as outras três opções da Solutions Section
(Conta e Pix — `151:92`, Investimentos — `153:125`, Empréstimos — `153:167`),
todos frames ocultos no Figma, um de cada vez, trocando o conteúdo ativo
quando o usuário clicar na pílula correspondente.
