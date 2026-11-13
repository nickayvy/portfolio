"use client";

/**
 * Home-page section progress (lg and up): a column of hand-drawn ticks fixed
 * at the right edge, one per entry in `sections`. Sections already read show
 * a muted ink stroke, the current one is red and fills with read progress,
 * and an ink pill naming it appears while scrolling or on hover/focus.
 * Clicking a tick scrolls to that section. It steps aside where the footer
 * scene would sit underneath it.
 */
import { useEffect, useRef, useState } from "react";
import { sections } from "@/content/site";
import { playSound } from "@/lib/sound";

const TICK = "M1.5 3.3 C6.5 2.2 11 3.7 16.2 2.7 S24.5 2.3 28.5 3.1";
const HIDE_AFTER = 1300;
/** Elements the indicator must not overlap (the closing illustration). */
const AVOID = "[data-footer-scene], .footer-scene";

export function SectionProgress() {
  const navRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const [show, setShow] = useState(false);
  const [hidden, setHidden] = useState(false);
  const hover = useRef(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const ticks = Array.from(nav.querySelectorAll<HTMLElement>("[data-tick]"));
    let tops: number[] = [];
    let bottoms: number[] = [];
    let raf = 0;
    let hideTimer = 0;
    let cur = -1;
    let lastHidden = false;
    let first = true;

    const measure = () => {
      tops = [];
      bottoms = [];
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) {
          tops.push(Number.NaN);
          bottoms.push(Number.NaN);
          continue;
        }
        const r = el.getBoundingClientRect();
        tops.push(r.top + window.scrollY);
        bottoms.push(r.bottom + window.scrollY);
      }
    };

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const probe = y + vh * 0.4;
      const docEnd = document.documentElement.scrollHeight - vh - 2;
      let idx = 0;
      for (let i = 0; i < tops.length; i++) if (!Number.isNaN(tops[i]) && tops[i] <= probe) idx = i;
      if (y >= docEnd) idx = tops.length - 1 - [...tops].reverse().findIndex((t) => !Number.isNaN(t));
      const top = tops[idx];
      const bottom = bottoms[idx];
      // progress through the current section; at the page end everything is read
      let read = Number.isNaN(top) ? 0 : (probe - top) / Math.max(1, bottom - top);
      if (y >= docEnd) read = 1;
      read = Math.min(1, Math.max(0, read));
      ticks.forEach((t, i) => {
        const state = i < idx ? "read" : i === idx ? "current" : "ahead";
        if (t.dataset.state !== state) t.dataset.state = state;
        if (state === "current") t.setAttribute("aria-current", "location");
        else t.removeAttribute("aria-current");
      });
      nav.style.setProperty("--read", read.toFixed(3));
      if (idx !== cur) {
        cur = idx;
        setCurrent(idx);
      }
      // step aside where it would overlap the footer illustration
      const nr = nav.getBoundingClientRect();
      let overlap = false;
      document.querySelectorAll(AVOID).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom > nr.top - 8 && r.top < nr.bottom + 8 && r.right > nr.left - 8 && r.left < nr.right + 8) overlap = true;
      });
      if (overlap !== lastHidden) {
        lastHidden = overlap;
        setHidden(overlap);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onScroll = () => {
      schedule();
      if (first) return;
      setShow(true);
      clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        if (!hover.current) setShow(false);
      }, HIDE_AFTER);
    };

    measure();
    update();
    // the first scroll event can be the browser restoring position
    requestAnimationFrame(() => (first = false));

    const ro = new ResizeObserver(() => {
      measure();
      schedule();
    });
    ro.observe(document.body);
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) ro.observe(el);
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(hideTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const s = sections[current];

  const reveal = (on: boolean) => {
    hover.current = on;
    setShow(on);
  };

  return (
    <nav
      ref={navRef}
      aria-label="Sections"
      className="shell-progress reveal"
      style={{ "--i": 6 } as React.CSSProperties}
      data-show={show ? "" : undefined}
      data-hidden={hidden ? "" : undefined}
      onPointerEnter={() => reveal(true)}
      onPointerLeave={() => reveal(false)}
      onFocus={() => reveal(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) reveal(false);
      }}
    >
      <p className="shell-progress-label" aria-hidden="true" style={{ "--row": current } as React.CSSProperties}>
        <span key={s.id} className="shell-progress-text">
          <span className="shell-progress-number">{String(current + 1).padStart(2, "0")}</span>
          {s.label}
        </span>
      </p>
      <ol>
        {sections.map((sec, i) => (
          <li key={sec.id}>
            <a
              href={`#${sec.id}`}
              data-tick=""
              data-state={i === 0 ? "current" : "ahead"}
              aria-label={`${String(i + 1).padStart(2, "0")} ${sec.label}`}
              onClick={() => playSound("tick")}
            >
              <svg viewBox="0 0 30 6" aria-hidden="true">
                <path d={TICK} className="shell-tick-base" pathLength={1} />
                <path d={TICK} className="shell-tick-ink" pathLength={1} />
              </svg>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
