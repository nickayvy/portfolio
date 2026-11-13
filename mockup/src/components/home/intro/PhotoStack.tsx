"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { photoStack } from "@/content/site";
import { playSound } from "@/lib/sound";
import { PrintArt } from "./PrintArt";

/** Fixed leans so the stack looks hand-placed (and server/client markup agree). */
const LEANS = [2.5, -3, 4, -1.5, 3];
const FLING_MS = 620;

/**
 * Hero photo stack: five placeholder prints. Click, Enter or Space flings the top print
 * off to the side and it slides back in at the bottom of the pile.
 */
export function PhotoStack() {
  const [order, setOrder] = useState<number[]>(() => photoStack.map((_, i) => i));
  const [leaving, setLeaving] = useState<number | null>(null);
  const busy = useRef(false);

  const next = () => {
    if (busy.current) return;
    busy.current = true;
    playSound("paper");
    const top = order[0];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setOrder((o) => [...o.slice(1), o[0]]);
      busy.current = false;
      return;
    }
    setLeaving(top);
    window.setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setLeaving(null);
      busy.current = false;
    }, FLING_MS);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      next();
    }
  };

  const current = photoStack[order[0]];
  return (
    <div
      className="photo-stack"
      role="button"
      tabIndex={0}
      aria-label={`Photo: ${current.caption}. Show the next one.`}
      data-cursor="Next"
      onClick={next}
      onKeyDown={onKey}
    >
      {photoStack.map((p, i) => {
        const place = order.indexOf(i);
        return (
          <span
            key={p.id}
            className="photo-print"
            data-place={Math.min(place, 3)}
            data-tone={p.tone}
            data-leaving={leaving === i ? "" : undefined}
            style={{ "--lean": `${LEANS[i]}deg`, zIndex: 10 - place } as CSSProperties}
            aria-hidden
          >
            <span className="photo-print-art">
              <PrintArt id={p.id} />
            </span>
            <span className="photo-print-caption">{p.caption}</span>
          </span>
        );
      })}
    </div>
  );
}
