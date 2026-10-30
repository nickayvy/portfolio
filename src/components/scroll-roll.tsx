"use client";

import { useEffect } from "react";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

export function ScrollRoll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bands = [...document.querySelectorAll<HTMLElement>("[data-roll]")];
    const visible = new Set<HTMLElement>();
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const band of visible) {
        const rect = band.getBoundingClientRect();
        const local = clamp01((vh - rect.top) / Math.max(1, vh + rect.height));
        const enter = smoothstep(clamp01((0.3 - local) / 0.3));
        const exit = smoothstep(clamp01((local - 0.7) / 0.3));
        const style = band.style;
        style.setProperty("--roll-origin-y", enter > 0 ? "4%" : exit > 0 ? "96%" : "50%");
        style.setProperty("--roll-angle", `${(-14 * enter + 28 * exit).toFixed(2)}deg`);
        style.setProperty("--roll-angle-mobile", `${(-9 * enter + 18 * exit).toFixed(2)}deg`);
        style.setProperty("--roll-y", `${(6 * enter - 10 * exit).toFixed(1)}px`);
        style.setProperty("--roll-opacity", (1 - 0.1 * enter - 0.14 * exit).toFixed(3));
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const band = entry.target as HTMLElement;
          if (entry.isIntersecting) visible.add(band);
          else visible.delete(band);
        }
        schedule();
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    bands.forEach((band) => observer.observe(band));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return null;
}
