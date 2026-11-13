"use client";

/**
 * Scrolling glue for the whole app:
 * - same-page `#hash` links scroll smoothly to their target, offset for the
 *   fixed header, and move focus there for keyboard users;
 * - route changes start at the top, or at the hash target when the URL has one.
 */
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { headerOffset, prefersReducedMotion } from "@/lib/prefs";

function targetFor(hash: string) {
  if (!hash || hash === "#") return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

/** Where the target's top edge should land: below the fixed header, plus any
 *  `scroll-margin-top` the page's CSS asks for (case-study sections use it). */
function landingTop(el: HTMLElement) {
  if (el.id === "intro") return 0;
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  return Math.max(headerOffset(), margin);
}

function scrollToTarget(el: HTMLElement, opts: { focus?: boolean } = {}) {
  const top = el.getBoundingClientRect().top + window.scrollY - landingTop(el);
  window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  if (opts.focus) {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}

export function ScrollManager() {
  const pathname = usePathname();
  const prev = useRef<string | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
      if (!url.hash) return;
      const el = targetFor(url.hash);
      if (!el) return;
      e.preventDefault();
      // keyboard activation (detail 0) moves focus to the section too
      scrollToTarget(el, { focus: e.detail === 0 });
      if (location.hash !== url.hash) history.pushState(history.state, "", url.hash);
    };
    // capture phase so this runs before next/link's own handler
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    const first = prev.current === null;
    const changed = prev.current !== pathname;
    prev.current = pathname;
    if (!changed) return;
    const hash = location.hash;
    if (!hash) {
      if (!first) window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    // wait for the new page (and fonts) to lay out before jumping to the hash
    let tries = 0;
    let raf = 0;
    const go = () => {
      const el = targetFor(hash);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - landingTop(el);
        window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
      } else if (tries++ < 30) raf = requestAnimationFrame(go);
    };
    raf = requestAnimationFrame(go);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
