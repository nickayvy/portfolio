/**
 * Persisted user preferences shared by the header, the mobile menu and the
 * sound synth: colour theme and sound on/off. Both are tiny external stores so
 * every toggle on the page stays in sync (useSyncExternalStore).
 */
import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

export const THEME_KEY = "nn-theme";
export const SOUND_KEY = "nn-sound";

type Listener = () => void;

function createStore<T>(read: () => T, server: T) {
  const listeners = new Set<Listener>();
  return {
    subscribe(l: Listener) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    emit() {
      listeners.forEach((l) => l());
    },
    read,
    server: () => server,
  };
}

/* ---------------------------------------------------------------- theme */

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

const themeStore = createStore<Theme>(readTheme, "light");

type ShellState = { theme?: Theme; hydrated?: boolean; loading?: boolean; t0?: number };

export function shellState(): ShellState {
  const w = window as unknown as { __nnShell?: ShellState };
  if (!w.__nnShell) w.__nnShell = {};
  return w.__nnShell;
}

export function getTheme(): Theme {
  return readTheme();
}

export function setTheme(next: Theme) {
  if (typeof document === "undefined" || next === readTheme()) return;
  const root = document.documentElement;
  const apply = () => {
    root.setAttribute("data-theme", next);
    shellState().theme = next;
    themeStore.emit();
  };
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {}
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (!reduce && typeof doc.startViewTransition === "function") {
    // Cross-fades the whole page between themes (styled in shell.css).
    root.setAttribute("data-theme-switch", "");
    const vt = doc.startViewTransition(apply) as { finished?: Promise<void> };
    vt.finished?.finally(() => root.removeAttribute("data-theme-switch"));
  } else {
    apply();
  }
}

export function toggleTheme() {
  setTheme(readTheme() === "dark" ? "light" : "dark");
}

export function useTheme(): Theme {
  return useSyncExternalStore(themeStore.subscribe, themeStore.read, themeStore.server);
}

/* ---------------------------------------------------------------- sound */

let soundOn: boolean | null = null;

export function getSoundOn(): boolean {
  if (typeof window === "undefined") return false;
  if (soundOn === null) {
    try {
      soundOn = localStorage.getItem(SOUND_KEY) === "on";
    } catch {
      soundOn = false;
    }
  }
  return soundOn;
}

const soundStore = createStore<boolean>(getSoundOn, false);

export function setSoundOn(on: boolean) {
  soundOn = on;
  try {
    localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  } catch {}
  soundStore.emit();
}

export function useSoundOn(): boolean {
  return useSyncExternalStore(soundStore.subscribe, soundStore.read, soundStore.server);
}

/* ------------------------------------------------------------ utilities */

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Fixed header height in px, read from the --header-h token. */
export function headerOffset(): number {
  if (typeof document === "undefined") return 64;
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h"));
  return Number.isFinite(v) ? v : 64;
}

/** Smooth-scrolls the window so `el` sits just below the fixed header. */
export function scrollToElement(el: Element, opts: { focus?: boolean } = {}) {
  const top = el.getBoundingClientRect().top + window.scrollY - (el.id === "intro" ? 0 : headerOffset());
  window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  if (opts.focus && el instanceof HTMLElement) {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}
