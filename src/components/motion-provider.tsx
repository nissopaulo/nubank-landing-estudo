"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Respeita `prefers-reduced-motion` em toda a árvore.
 *
 * Por que não usar `useReducedMotion()` direto nos componentes: o hook
 * retorna `false` durante o SSR e o valor real no cliente. Como o resultado
 * entra em props que viram HTML (`initial`, condições de render), isso geraria
 * divergência de hidratação para todo usuário com movimento reduzido.
 *
 * `MotionConfig reducedMotion="user"` decide dentro do ciclo de animação, já
 * depois da hidratação: o HTML do servidor é sempre o mesmo e, no cliente,
 * transformações e layouts pulam direto para o estado final — mantendo apenas
 * opacidade e cor, que não provocam deslocamento.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  );
}