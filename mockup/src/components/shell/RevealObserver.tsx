"use client";

/**
 * Reveal-on-scroll contract: any element with class `reveal` (optional
 * `style={{"--i": n}}` for stagger) stays hidden until the loader is done and
 * it scrolls into view, then blur-fades in once. One IntersectionObserver for
 * the whole app; a MutationObserver picks up nodes added on route changes.
 * Without JS, `.reveal` is plain visible content (see shell.css).
 */
import { useEffect } from "react";

export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 },
    );
    const seen = new WeakSet<Element>();
    const scan = (root: ParentNode) => {
      if (root instanceof Element && root.classList.contains("reveal") && !seen.has(root)) {
        seen.add(root);
        io.observe(root);
      }
      root.querySelectorAll(".reveal:not([data-in])").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan(document.body);

    let pending = false;
    const mo = new MutationObserver((records) => {
      if (pending) return;
      for (const r of records) {
        if (r.addedNodes.length > 0) {
          pending = true;
          requestAnimationFrame(() => {
            pending = false;
            scan(document.body);
          });
          return;
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
