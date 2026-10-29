"use client";

import { useEffect, useRef } from "react";

const LENSES = [
  { left: "39.2%", top: "21.35%" },
  { left: "43.4%", top: "21.5%" },
] as const;

export function HeroCharacters() {
  const rootRef = useRef<HTMLSpanElement>(null);
  const siameseRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const siamese = siameseRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pupils = [...root.querySelectorAll<HTMLElement>("[data-eye]")];

    const onPointer = (event: PointerEvent) => {
      const box = root.getBoundingClientRect();
      const originX = box.left + box.width * 0.41;
      const originY = box.top + box.height * 0.21;
      const dx = event.clientX - originX;
      const dy = event.clientY - originY;
      const dist = Math.hypot(dx, dy) || 1;
      const t = Math.min(1, dist / 180);
      const lookX = (dx / dist) * t;
      const lookY = (dy / dist) * t;

      for (const pupil of pupils) {
        pupil.style.setProperty("--look-x", lookX.toFixed(3));
        pupil.style.setProperty("--look-y", lookY.toFixed(3));
      }

      if (siamese) {
        const catX = box.left + box.width * 0.696;
        const catY = box.top + box.height * 0.72;
        const cx = event.clientX - catX;
        const cy = event.clientY - catY;
        const cd = Math.hypot(cx, cy) || 1;
        const ct = Math.min(1, cd / 220);
        const yaw = (cx / cd) * ct * 12;
        const pitch = (cy / cd) * ct * 6;
        siamese.style.transform = `rotate(${yaw.toFixed(2)}deg) translateY(${(pitch * 0.4).toFixed(2)}px)`;
      }
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => window.removeEventListener("pointermove", onPointer);
  }, []);

  return (
    <span
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute top-1/2 left-full z-[2] w-[min(42vw,22rem)] -translate-x-[16%] -translate-y-[30%]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-base.png?v=3"
        alt=""
        width={1024}
        height={1024}
        className="block aspect-square h-auto w-full select-none drop-shadow-[0_10px_18px_rgba(0,0,0,0.08)]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={siameseRef}
        src="/hero-siamese.png?v=3"
        alt=""
        width={1024}
        height={1024}
        className="absolute inset-0 h-full w-full origin-[69.63%_93.07%] select-none drop-shadow-[0_10px_18px_rgba(0,0,0,0.08)]"
      />
      {LENSES.map((lens) => (
        <span
          key={lens.left}
          className="absolute aspect-square w-[2.45%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
          style={{ top: lens.top, left: lens.left }}
        >
          <span
            data-eye
            className="absolute aspect-square w-[38%] rounded-full bg-[#111]"
            style={{
              left: "calc(50% + var(--look-x, 0) * 16%)",
              top: "calc(50% + var(--look-y, 0) * 16%)",
              transform: "translate(-50%, -50%)",
            }}
          />
        </span>
      ))}
    </span>
  );
}
