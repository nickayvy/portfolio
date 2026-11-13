"use client";

import { useEffect, useId, useRef, useState } from "react";
import { headerOffset } from "@/lib/prefs";
import { playSound } from "@/lib/sound";

type Item = { id: string; label: string };

const TICK = "M1.2 3.3C4.5 2.2 8 3.7 11 2.7S15.5 2.4 17 3";

function Tick() {
  return (
    <svg className="cs-tick" viewBox="0 0 18 6" aria-hidden>
      <path d={TICK} className="tick-base" />
      <path d={TICK} className="tick-ink" pathLength={1} />
    </svg>
  );
}

/**
 * Contents rail with scroll-spy (lg+) and a floating contents pill (< lg).
 * Also "draws" the marker highlights in the article as they scroll into view.
 */
export function CaseContents({ items }: { items: Item[] }) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const [pillHidden, setPillHidden] = useState(false);
  const railRef = useRef<HTMLOListElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0);
  const sheetId = useId();

  // scroll-spy: one rAF per scroll burst, reads rects, writes CSS vars + data-state
  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);
    const footer = document.getElementById("contact");
    let raf = 0;
    // A section is "current" once its top is within `reach` px of where a jump lands it
    // (header + its scroll-margin-top). Reach stays below the shortest section's height, so after a
    // jump the section jumped to is highlighted and the one below it never steals it.
    const margins = sections.map((s) => headerOffset() + (parseFloat(getComputedStyle(s).scrollMarginTop) || 0));

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      let idx = 0;
      const rects = sections.map((s) => s.getBoundingClientRect());
      const shortest = Math.min(...rects.slice(0, -1).map((r) => r.height));
      const reach = Math.max(28, Math.min(128, shortest * 0.8));
      const lines = margins.map((m) => m + reach);
      rects.forEach((r, i) => {
        if (r.top <= lines[i]) idx = i;
      });
      const r = rects[idx];
      const line = lines[idx] ?? 0;
      const read = r ? Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height))) : 0;

      const writeTicks = (root: ParentNode | null) => {
        if (!root) return;
        root.querySelectorAll<HTMLElement>("[data-tick]").forEach((el, i) => {
          const state = i < idx ? "read" : i === idx ? "current" : "ahead";
          if (el.dataset.state !== state) el.dataset.state = state;
          el.style.setProperty("--read", i === idx ? read.toFixed(3) : i < idx ? "1" : "0");
        });
      };
      writeTicks(railRef.current);
      pillRef.current?.style.setProperty("--read", read.toFixed(3));

      if (idx !== currentRef.current) {
        currentRef.current = idx;
        setCurrent(idx);
      }
      const hide = footer ? footer.getBoundingClientRect().top < vh * 0.9 : false;
      setPillHidden((h) => (h === hide ? h : hide));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  // marker highlights draw on as they enter the viewport (rendered drawn without JS)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const marks = [...document.querySelectorAll<HTMLElement>(".cs-main .cs-mark")];
    const vh = window.innerHeight;
    const pending = marks.filter((m) => m.getBoundingClientRect().top > vh * 0.92);
    pending.forEach((m) => (m.dataset.draw = "pending"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          window.setTimeout(() => delete el.dataset.draw, 120);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    pending.forEach((m) => io.observe(m));
    return () => io.disconnect();
  }, []);

  // mobile sheet: Esc / outside click closes, focus moves in and back
  useEffect(() => {
    if (!open) return;
    sheetRef.current?.querySelector<HTMLElement>("a[aria-current]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        pillRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!sheetRef.current?.contains(t) && !pillRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <>
      <nav aria-label="Contents" className="cs-rail reveal" style={{ "--i": 2 } as React.CSSProperties}>
        <p className="cs-rail-heading">Contents</p>
        <ol ref={railRef}>
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                data-tick=""
                data-state={i === 0 ? "current" : "ahead"}
                aria-current={i === current ? "location" : undefined}
                onClick={() => playSound("tap")}
              >
                <Tick />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="cs-pill-wrap" data-hidden={pillHidden && !open ? "true" : "false"}>
        {open && (
          <div ref={sheetRef} id={sheetId} className="cs-sheet" role="group" aria-label="Contents">
            <p>Contents</p>
            <ol>
              {items.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={i === current ? "location" : undefined}
                    onClick={() => {
                      setOpen(false);
                      playSound("tap");
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
        <button
          ref={pillRef}
          type="button"
          className="cs-pill"
          aria-expanded={open}
          aria-controls={open ? sheetId : undefined}
          aria-label={`Contents, current section: ${items[current]?.label ?? ""}`}
          tabIndex={pillHidden ? -1 : 0}
          onClick={() => {
            setOpen((o) => !o);
            playSound("tap");
          }}
        >
          <Tick />
          <span>{items[current]?.label}</span>
        </button>
      </div>
    </>
  );
}
