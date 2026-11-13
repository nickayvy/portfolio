"use client";

/**
 * Header veil: a fixed band behind the header where content blurs and fades
 * into paper as it scrolls underneath. Two stacked backdrop-filter layers
 * with gradient masks give a graduated blur. Invisible
 * (and not blurring anything) at the very top of the page.
 */
import { useEffect, useRef } from "react";

export function HeaderVeil() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let on = false;
    const update = () => {
      raf = 0;
      const next = window.scrollY > 4;
      if (next !== on) {
        on = next;
        el.toggleAttribute("data-scrolled", on);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="shell-veil" aria-hidden="true">
      <span />
      <span />
    </div>
  );
}
