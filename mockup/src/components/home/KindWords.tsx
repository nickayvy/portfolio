"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CatFace } from "@/components/art/Cats";
import { kindWords } from "@/content/site";
import { playSound } from "@/lib/sound";

/** Resting lean (deg) and nudge (px) for each depth in the stack: top, second, third. */
const DEPTH = [
  { r: -0.6, x: 0, y: 0 },
  { r: 1.4, x: 6, y: 8 },
  { r: -1.8, x: -7, y: 14 },
];
const OUT_MS = 340;

const pad = (n: number) => String(n).padStart(2, "0");
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** KindWords (#testimonials): a shuffling stack of paper notes. */
export function KindWords() {
  const n = kindWords.length;
  const [order, setOrder] = useState<number[]>(() => kindWords.map((_, i) => i));
  const [leaving, setLeaving] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const busy = useRef(false);
  const top = order[0];

  // Stack height follows the top note's content (animated in CSS).
  useIsoLayoutEffect(() => {
    const el = contentRefs.current[top];
    if (!el) return;
    const measure = () => setHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [top]);

  const shuffle = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    playSound("paper");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = () => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setLeaving(null);
      window.setTimeout(() => (busy.current = false), reduce ? 0 : 260);
    };
    if (reduce) return finish();
    setLeaving(order[0]);
    window.setTimeout(finish, OUT_MS);
  }, [order]);

  return (
    <section id="testimonials" className="overflow-x-clip px-5 py-28 md:px-8" aria-labelledby="kind-h">
      <div className="mx-auto w-full max-w-[38rem]">
        <div className="reveal flex items-baseline justify-between gap-4">
          <h2 id="kind-h" className="home-h2">
            Kind words
          </h2>
          <p className="text-sm text-muted tabular-nums" aria-hidden>
            {pad(top + 1)} / {pad(n)}
          </p>
        </div>

        <div
          className="kind-stack reveal mt-10"
          style={{ height: height ?? undefined, "--i": 1 } as React.CSSProperties}
          data-cursor="Shuffle"
          onClick={shuffle}
        >
          {kindWords.map((k, i) => {
            const depth = order.indexOf(i);
            const d = DEPTH[Math.min(depth, DEPTH.length - 1)];
            const isTop = depth === 0;
            return (
              <figure
                key={k.from}
                className="kind-note"
                data-top={isTop || undefined}
                data-leaving={leaving === i || undefined}
                aria-hidden={!isTop}
                inert={!isTop}
                style={
                  {
                    zIndex: n - depth,
                    "--r": `${d.r}deg`,
                    "--x": `${d.x}px`,
                    "--y": `${d.y}px`,
                  } as React.CSSProperties
                }
              >
                <div
                  className="kind-note-content"
                  ref={(el) => {
                    contentRefs.current[i] = el;
                  }}
                >
                  <p className="kind-note-label">A note from {k.from}</p>
                  <blockquote className="kind-note-quote">
                    <p>“{k.quote}”</p>
                  </blockquote>
                  <figcaption className="kind-note-from">
                    <span className="kind-note-sign">{k.sign}</span>
                    <span className="block text-sm text-muted">{k.title}</span>
                  </figcaption>
                  <span className="kind-note-print" aria-hidden>
                    <span className="kind-note-photo">
                      <CatFace kind={k.avatar} className="h-full w-full" />
                    </span>
                  </span>
                </div>
              </figure>
            );
          })}
        </div>

        <button type="button" className="kind-next home-focus mt-11 text-sm" onClick={shuffle} data-cursor="Shuffle">
          Next note <span className="link-arrow">→</span>
        </button>
        <p className="sr-only" aria-live="polite">
          {`Note ${top + 1} of ${n}, from ${kindWords[top].from}`}
        </p>
      </div>
    </section>
  );
}
