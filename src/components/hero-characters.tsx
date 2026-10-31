"use client";

import { useEffect, useRef } from "react";
import { createCssSpriteRenderer, createFrameAnimator } from "@/lib/interactive-motion";

const LENSES = [
  { left: "42.01%", top: "21.58%" },
  { left: "49.93%", top: "23.09%" },
] as const;

const GAZE_FRAMES = 96;
const GAZE_COLUMNS = 12;
const GAZE_ROWS = 8;
const GAZE_DEAD_ZONE = 24;

export const LOOK_EVENT = "hero:look";

export function HeroCharacters() {
  const rootRef = useRef<HTMLSpanElement>(null);
  const siameseRef = useRef<HTMLSpanElement>(null);
  const gazeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const siamese = siameseRef.current;
    const gaze = gazeRef.current;
    if (!root || !siamese || !gaze) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pupils = [...root.querySelectorAll<HTMLElement>("[data-eye]")];
    const animator = createFrameAnimator({
      frameCount: GAZE_FRAMES,
      circular: true,
      smoothTime: 0.14,
      render: createCssSpriteRenderer(gaze, GAZE_COLUMNS, GAZE_ROWS),
    });

    const lookAt = (x: number, y: number) => {
      const box = root.getBoundingClientRect();
      const originX = box.left + box.width * 0.46;
      const originY = box.top + box.height * 0.224;
      const dx = x - originX;
      const dy = y - originY;
      const dist = Math.hypot(dx, dy) || 1;
      const t = Math.min(1, dist / 180);
      const lookX = (dx / dist) * t;
      const lookY = (dy / dist) * t;

      for (const pupil of pupils) {
        pupil.style.setProperty("--look-x", lookX.toFixed(3));
        pupil.style.setProperty("--look-y", lookY.toFixed(3));
      }

      const cx = x - (box.left + box.width * 0.697);
      const cy = y - (box.top + box.height * 0.716);
      if (Math.hypot(cx, cy) < GAZE_DEAD_ZONE) return;
      animator.setDirection(cx, cy, 0);
      siamese.dataset.tracking = "";
    };
    const onPointer = (event: PointerEvent) => lookAt(event.clientX, event.clientY);
    const onLook = (event: Event) => {
      const { x, y } = (event as CustomEvent<{ x: number; y: number }>).detail;
      lookAt(x, y);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener(LOOK_EVENT, onLook);
    return () => {
      animator.destroy();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener(LOOK_EVENT, onLook);
    };
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
      <span
        ref={siameseRef}
        className="group/siamese absolute top-[57.04%] left-[56.52%] aspect-[300/415] w-[26.33%] drop-shadow-[0_10px_18px_rgba(0,0,0,0.08)]"
      >
        <span
          ref={gazeRef}
          className="absolute inset-0 bg-[url(/hero-siamese-gaze.webp?v=7)] bg-size-[1200%_800%] bg-no-repeat opacity-0 transition-opacity duration-200 group-data-tracking/siamese:opacity-100"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-siamese-front.png?v=1"
          alt=""
          width={300}
          height={415}
          className="absolute inset-0 h-full w-full select-none transition-opacity duration-200 group-data-tracking/siamese:opacity-0"
        />
      </span>
      {LENSES.map((lens) => (
        <span
          key={lens.left}
          className="absolute aspect-square w-[4.7%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full after:absolute after:inset-x-[14%] after:top-1/2 after:h-[1.5px] after:animate-blink-lid after:rounded-[2px] after:bg-[#111] after:opacity-0 after:content-[''] motion-reduce:after:animate-none"
          style={{ top: lens.top, left: lens.left }}
        >
          <span
            data-eye
            className="absolute aspect-square w-[30%] animate-blink-pupil rounded-full bg-[#111] motion-reduce:animate-none"
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
