"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlayPiece } from "@/components/pages/PlayPiece";
import { playground } from "@/content/site";
import { playSound } from "@/lib/sound";

const ITEMS = playground.slice(0, 10);
const N = ITEMS.length;
const STEP = 360 / N; // 36°
/** Sideways wheel/trackpad travel (px) per dial step. */
const WHEEL_PX = 60;

const mod = (a: number, n: number) => ((a % n) + n) % n;

/** PlaygroundDial (#playground): preview print + a brass dial that picks the piece. */
export function PlaygroundDial() {
  // `pos` is an unbounded step count so the wheel always turns the short way round.
  const [pos, setPos] = useState(0);
  const [layers, setLayers] = useState<number[]>([0]);
  const [dragging, setDragging] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const selected = mod(pos, N);
  const item = ITEMS[selected];

  // Preview: keep the outgoing print beneath the incoming one while it fades in.
  useEffect(() => {
    setLayers((l) => (l[l.length - 1] === selected ? l : [...l.slice(-1), selected]));
  }, [selected]);

  const commit = useCallback((next: number, sound = true) => {
    const prev = posRef.current;
    if (next === prev) return;
    posRef.current = next;
    setPos(next);
    if (sound) {
      const steps = Math.min(3, Math.abs(next - prev));
      for (let s = 0; s < steps; s++) window.setTimeout(() => playSound("tick"), s * 70);
    }
  }, []);

  // ---- pointer drag: horizontal travel turns the top of the wheel like a thumb on a dial.
  useEffect(() => {
    const wheel = wheelRef.current;
    const stage = stageRef.current;
    if (!wheel || !stage) return;
    let drag: null | { id: number; x: number; base: number; moved: boolean; radius: number; last: number } = null;
    let suppressClick = false;
    let acc = 0;
    let accTimer = 0;
    let lastStepAt = 0;

    const setAngle = (deg: number | null) => {
      if (deg === null) wheel.style.removeProperty("--drag-angle");
      else wheel.style.setProperty("--drag-angle", `${deg.toFixed(2)}deg`);
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drag = { id: e.pointerId, x: e.clientX, base: posRef.current, moved: false, radius: wheel.offsetWidth / 2, last: posRef.current };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved) {
        if (Math.abs(dx) < 5) return;
        drag.moved = true;
        wheel.setPointerCapture(e.pointerId);
        setDragging(true);
      }
      // arc length → angle; dragging right turns the wheel clockwise (previous piece rises).
      const deg = ((dx / (drag.radius * 0.8)) * 180) / Math.PI;
      const live = drag.base - deg / STEP;
      setAngle(-live * STEP);
      const r = Math.round(live);
      if (r !== drag.last) {
        drag.last = r;
        commit(r);
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const moved = drag.moved;
      drag = null;
      if (!moved) return;
      suppressClick = true;
      window.setTimeout(() => (suppressClick = false), 0);
      setDragging(false);
      setAngle(null); // spring back to the snapped step
    };
    const onCancel = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      drag = null;
      setDragging(false);
      setAngle(null);
    };

    // Click a window to bring it to the notch (short way round).
    const onClick = (e: MouseEvent) => {
      if (suppressClick) {
        suppressClick = false;
        return;
      }
      const hole = (e.target as HTMLElement).closest<HTMLElement>("[data-k]");
      if (!hole) return;
      const k = Number(hole.dataset.k);
      const cur = posRef.current;
      let d = mod(k - cur, N);
      if (d > N / 2) d -= N;
      commit(cur + d);
    };

    // Sideways trackpad swipes turn the dial; vertical wheel always scrolls the page,
    // unless a pointer is actively dragging the dial.
    const onWheel = (e: WheelEvent) => {
      const sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!sideways && !drag?.moved) return;
      e.preventDefault();
      acc += sideways ? e.deltaX : e.deltaY;
      window.clearTimeout(accTimer);
      accTimer = window.setTimeout(() => (acc = 0), 180);
      const now = performance.now();
      if (Math.abs(acc) >= WHEEL_PX && now - lastStepAt > 90) {
        lastStepAt = now;
        commit(posRef.current + Math.sign(acc));
        acc = 0;
      }
    };

    wheel.addEventListener("pointerdown", onDown);
    wheel.addEventListener("pointermove", onMove);
    wheel.addEventListener("pointerup", onUp);
    wheel.addEventListener("pointercancel", onCancel);
    wheel.addEventListener("lostpointercapture", onCancel);
    wheel.addEventListener("click", onClick);
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.clearTimeout(accTimer);
      wheel.removeEventListener("pointerdown", onDown);
      wheel.removeEventListener("pointermove", onMove);
      wheel.removeEventListener("pointerup", onUp);
      wheel.removeEventListener("pointercancel", onCancel);
      wheel.removeEventListener("lostpointercapture", onCancel);
      wheel.removeEventListener("click", onClick);
      stage.removeEventListener("wheel", onWheel);
    };
  }, [commit]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const cur = posRef.current;
    const map: Record<string, number> = {
      ArrowRight: cur + 1,
      ArrowUp: cur + 1,
      ArrowLeft: cur - 1,
      ArrowDown: cur - 1,
      PageUp: cur + 3,
      PageDown: cur - 3,
      Home: cur - mod(cur, N),
      End: cur - mod(cur, N) + N - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    commit(map[e.key]);
  };

  return (
    <section id="playground" className="dial-section px-5 py-28 md:px-8" aria-labelledby="playground-h">
      <div className="mx-auto w-full max-w-[38rem]">
        <h2 id="playground-h" className="home-h2 reveal">
          Playground
        </h2>
        <div className="dial reveal" style={{ "--i": 1 } as React.CSSProperties}>
          <Link
            href={`/playground#view-${item.id}`}
            className="dial-print"
            data-cursor="View"
            aria-label={`View ${item.title} in the playground`}
          >
            {layers.map((k) => (
              <div key={k} className="dial-print-layer" data-in={k === selected || undefined}>
                <PlayPiece item={ITEMS[k]} />
              </div>
            ))}
          </Link>

          <div className="dial-stage" ref={stageRef}>
            <div className="dial-body">
              <div
                ref={wheelRef}
                className="dial-wheel"
                role="slider"
                tabIndex={0}
                aria-label="Turn the dial to choose a playground piece"
                aria-valuemin={1}
                aria-valuemax={N}
                aria-valuenow={selected + 1}
                aria-valuetext={`${selected + 1} of ${N}: ${item.title}`}
                aria-orientation="horizontal"
                data-dragging={dragging || undefined}
                data-cursor="Drag"
                onKeyDown={onKeyDown}
                style={{ "--angle": `${-pos * STEP}deg` } as React.CSSProperties}
              >
                <div className="dial-plate" aria-hidden />
                {ITEMS.map((it, k) => (
                  <div
                    key={it.id}
                    className="dial-hole"
                    data-k={k}
                    data-on={k === selected || undefined}
                    style={{ "--a": `${k * STEP}deg` } as React.CSSProperties}
                    aria-hidden
                  >
                    <div className="dial-window">
                      <PlayPiece item={it} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="dial-rim" aria-hidden />
              <div className="dial-light" aria-hidden />
              <div className="dial-notch" aria-hidden />
            </div>
          </div>

          <div className="dial-cta">
            <Link href="/playground" className="ink-pill" data-cursor="Let’s play">
              Come play <span className="link-arrow" aria-hidden>→</span>
            </Link>
            <p className="mt-3 text-[14px] leading-5 text-muted">Explorations, experiments and things I made just because.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
