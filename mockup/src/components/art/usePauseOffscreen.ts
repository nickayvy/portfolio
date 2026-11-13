"use client";

import { useEffect, type RefObject } from "react";

/**
 * Sets `data-paused` on the element while it is off screen or the tab is hidden.
 * art.css pauses every looping animation inside a `[data-paused]` element.
 */
export function usePauseOffscreen(ref: RefObject<Element | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let inView = false;
    const apply = () => {
      if (inView && document.visibilityState === "visible") el.removeAttribute("data-paused");
      else el.setAttribute("data-paused", "");
    };
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      apply();
    }, { rootMargin: "80px" });
    io.observe(el);
    document.addEventListener("visibilitychange", apply);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", apply);
    };
  }, [ref]);
}
