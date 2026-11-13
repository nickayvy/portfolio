"use client";

import { useEffect, useRef, useState } from "react";
import { greetings } from "@/content/site";

const HOLD = 2600;
const OUT = 260;

/**
 * Large greeting that cycles through `greetings` with a blur swap.
 * Screen readers get a single static "Hello"; the cycling copy is aria-hidden.
 * Pauses while off screen or the tab is hidden; static under reduced motion.
 */
export function Greeting() {
  const [i, setI] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = true;
    let t = 0;
    let t2 = 0;
    const tick = () => {
      t = window.setTimeout(() => {
        if (visible && document.visibilityState === "visible") {
          setLeaving(true);
          t2 = window.setTimeout(() => {
            setI((n) => (n + 1) % greetings.length);
            setLeaving(false);
          }, OUT);
        }
        tick();
      }, HOLD);
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    tick();
    return () => {
      io.disconnect();
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, []);

  const g = greetings[i];
  return (
    <p ref={ref} className="greeting flex items-baseline gap-2.5">
      <span className="sr-only">{greetings[0].word}</span>
      <span aria-hidden className="relative inline-flex overflow-hidden pb-[0.12em]">
        <span key={i} lang={langOf(i)} className="hello-word" data-leaving={leaving ? "" : undefined}>
          {g.word},
        </span>
      </span>
      <span aria-hidden key={`l${i}`} className="hello-language text-xs text-muted" data-leaving={leaving ? "" : undefined}>
        {g.language}
      </span>
    </p>
  );
}

const LANGS = ["en", "vi", "es", "ja", "fr", "zh", "it", "en"];
const langOf = (i: number) => LANGS[i] ?? "en";
