"use client";

import { useEffect, useRef } from "react";

const LENSES = [
  { left: "42.01%", top: "21.58%" },
  { left: "49.93%", top: "23.09%" },
] as const;

const CAT_IRISES = [
  { left: "62.99%", top: "65.82%" },
  { left: "67.97%", top: "66.16%" },
] as const;

export function HeroCharacters() {
  const rootRef = useRef<HTMLSpanElement>(null);
  const siameseHeadRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const siameseHead = siameseHeadRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pupils = [...root.querySelectorAll<HTMLElement>("[data-eye]")];

    const onPointer = (event: PointerEvent) => {
      const box = root.getBoundingClientRect();
      const originX = box.left + box.width * 0.46;
      const originY = box.top + box.height * 0.224;
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

      if (siameseHead) {
        const catX = box.left + box.width * 0.654;
        const catY = box.top + box.height * 0.654;
        const cx = event.clientX - catX;
        const cy = event.clientY - catY;
        const cd = Math.hypot(cx, cy) || 1;
        const ct = Math.min(1, cd / 220);
        const nx = (cx / cd) * ct;
        const ny = (cy / cd) * ct;
        siameseHead.style.transform = `translate(${(nx * 0.4).toFixed(3)}%, ${(ny * 0.25).toFixed(3)}%) rotate(${(nx * 7).toFixed(2)}deg)`;
        siameseHead.style.setProperty("--cat-look-x", nx.toFixed(3));
        siameseHead.style.setProperty("--cat-look-y", ny.toFixed(3));
      }
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => window.removeEventListener("pointermove", onPointer);
  }, []);

  return (
    <span
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute top-[0.62em] left-[calc(100%-0.02em)] z-[2] w-[min(42vw,22rem)] -translate-x-[14.4%] -translate-y-[30.7%] animate-hero-enter in-[.is-booting]:[animation-play-state:paused] motion-reduce:animate-none"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-base.png?v=6"
        alt=""
        width={1024}
        height={1024}
        className="block aspect-square h-auto w-full select-none drop-shadow-[0_10px_18px_rgba(0,0,0,0.08)]"
      />
      <span className="absolute inset-0 drop-shadow-[0_10px_18px_rgba(0,0,0,0.08)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-siamese-body.png?v=1"
          alt=""
          width={1024}
          height={1024}
          className="absolute inset-0 h-full w-full select-none"
        />
        <span
          ref={siameseHeadRef}
          className="absolute inset-0 origin-[65.43%_72.07%] transition-transform duration-150 ease-out"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-siamese-head.png?v=2"
            alt=""
            width={1024}
            height={1024}
            className="absolute inset-0 h-full w-full select-none"
          />
          {CAT_IRISES.map((iris) => (
            <span
              key={iris.left}
              className="absolute aspect-square w-[1.6%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
              style={{ top: iris.top, left: iris.left }}
            >
              <span
                className="absolute h-[67%] w-[55%] rounded-full bg-[#111]"
                style={{
                  left: "calc(50% + var(--cat-look-x, 0) * 21%)",
                  top: "calc(50% + var(--cat-look-y, 0) * 15%)",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className="absolute top-[14%] right-[16%] aspect-square w-[30%] rounded-full bg-white" />
              </span>
            </span>
          ))}
        </span>
      </span>
      {LENSES.map((lens) => (
        <span
          key={lens.left}
          className="absolute aspect-square w-[4.7%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
          style={{ top: lens.top, left: lens.left }}
        >
          <span
            data-eye
            className="absolute aspect-square w-[30%] rounded-full bg-[#111]"
            style={{
              left: "calc(50% + var(--look-x, 0) * 26%)",
              top: "calc(50% + var(--look-y, 0) * 26%)",
              transform: "translate(-50%, -50%)",
            }}
          />
        </span>
      ))}
    </span>
  );
}
