"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/**
 * Lê `prefers-reduced-motion` sem quebrar a hidratação.
 *
 * `useReducedMotion` do Motion (e um `useState` + `useEffect`) têm o mesmo
 * problema: no servidor o valor é sempre `false`, então usá-lo direto em props
 * que viram HTML gera divergência de hidratação para quem prefere menos
 * movimento.
 *
 * `useSyncExternalStore` resolve: durante a hidratação ele usa o
 * `getServerSnapshot` (sempre `false`, igual ao SSR) e só depois passa a usar
 * o valor real do navegador, re-renderizando sem divergência.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}