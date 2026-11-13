"use client";

import { useEffect, useRef } from "react";

const FRAMES = 96;
const COLS = 12;
const ROWS = 8;
const DEAD_ZONE = 24; // px around the cat where the pointer is ignored
const SMOOTH = 0.14; // seconds, critically damped follow

const wrap = (v: number, n: number) => ((v % n) + n) % n;

/**
 * Siamese gaze: a 12×8 sheet of 96 frames of the cat turning in a full circle.
 * Frame 0 faces right (+x) and frames advance clockwise (screen y points down), so a
 * pointer direction maps to frame = angle / 2π × 96. The frame index eases toward
 * the target along the shorter way round, with a critically damped spring.
 * Shows the front-facing still until the pointer first moves (and always under
 * reduced motion).
 */
export function PlaySprite({ src, active }: { src: string; active: boolean }) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const sheetRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const sheet = sheetRef.current;
    if (!box || !sheet || !active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // the 2160×1992 sheet loads only once the piece is on screen
    if (!sheet.style.backgroundImage) sheet.style.backgroundImage = `url(${src})`;

    let pos = 0;
    let vel = 0;
    let target = 0;
    let last = -1;
    let raf = 0;
    let prev = 0;
    let started = false;

    const render = () => {
      const frame = wrap(Math.round(pos), FRAMES);
      if (frame === last) return;
      last = frame;
      const col = frame % COLS;
      const row = Math.floor(frame / COLS);
      sheet.style.backgroundPosition = `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`;
    };

    const step = (now: number) => {
      raf = 0;
      const dt = prev ? Math.min((now - prev) / 1000, 1 / 30) : 1 / 60;
      prev = now;
      // critically damped spring (same family as Unity's SmoothDamp)
      const omega = 2 / SMOOTH;
      const x = omega * dt;
      const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
      const change = pos - target;
      const temp = (vel + omega * change) * dt;
      vel = (vel - omega * temp) * decay;
      pos = target + (change + temp) * decay;
      render();
      if (Math.abs(target - pos) > 0.01 || Math.abs(vel) > 0.01) {
        raf = requestAnimationFrame(step);
      } else {
        pos = wrap(target, FRAMES);
        target = pos;
        prev = 0;
      }
    };

    const lookAt = (x: number, y: number) => {
      const r = box.getBoundingClientRect();
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height * 0.42);
      if (Math.hypot(dx, dy) < DEAD_ZONE) return;
      const angle = Math.atan2(dy, dx);
      const want = (wrap(angle, Math.PI * 2) / (Math.PI * 2)) * FRAMES;
      if (!started) {
        // first look: jump straight to the frame, then reveal the sheet
        started = true;
        pos = target = want;
        last = -1;
        render();
        box.dataset.tracking = "true";
        return;
      }
      let delta = wrap(want, FRAMES) - wrap(pos, FRAMES);
      if (delta > FRAMES / 2) delta -= FRAMES;
      if (delta < -FRAMES / 2) delta += FRAMES;
      target = pos + delta;
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onPointer = (e: PointerEvent) => lookAt(e.clientX, e.clientY);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [active, src]);

  return (
    <>
      <span className="pp-floor" aria-hidden />
      <span ref={boxRef} className="pp-sprite-box" aria-hidden>
        <span ref={sheetRef} className="pp-sprite" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/play/siamese-front.png" alt="" draggable={false} loading="lazy" decoding="async" />
      </span>
    </>
  );
}
