<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Contexto do projeto — leia antes de agir

1. `README.md` — estado real do projeto, decisões técnicas e medições.
2. `CONTEXTO.md` — **memória das conversas com o usuário**: decisões e seus
   motivos, pendências numeradas, e o registro de cada sessão.

Toda sessão de trabalho relevante deve terminar atualizando `CONTEXTO.md`:
registro da sessão, pendências que mudaram de estado e o próximo passo. É esse
arquivo que permite retomar de onde parou sem refazer-contextualização.

Regras que valem sempre neste projeto: não inventar conteúdo que não esteja no
Figma (marcar `PROVISÓRIO`), manter contraste AA medido, e não quebrar a
hidratação em relação ao que é sensível ao servidor.
