"use client";

/**
 * Cursor label contract: hovering any element with `data-cursor="Label"` shows
 * a small ink pill with that text that follows the pointer with a lerp.
 * Fine pointers only; touch and pen-less devices never see it.
 */
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const OFFSET_X = 14;
const OFFSET_Y = 18;

export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const refresh = useRef<() => void>(() => {});
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    const text = textRef.current;
    if (!el || !text) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let x = -100, y = -100; // target (pointer)
    let cx = -100, cy = -100; // drawn position
    let raf = 0;
    let shown = false;
    let label = "";
    let hasPointer = false;
    let scrollQueued = false;

    const render = () => {
      el.style.transform = `translate3d(${cx + OFFSET_X}px, ${cy + OFFSET_Y}px, 0)`;
    };
    const loop = () => {
      const k = reduce.matches ? 1 : 0.22;
      cx += (x - cx) * k;
      cy += (y - cy) * k;
      render();
      if (Math.abs(x - cx) > 0.1 || Math.abs(y - cy) > 0.1) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const setTarget = (target: Element | null) => {
      const host = target instanceof Element ? target.closest<HTMLElement>("[data-cursor]") : null;
      const next = host?.dataset.cursor?.trim() ?? "";
      if (next && next !== label) {
        label = next;
        text.textContent = next;
      }
      if (next && !shown) {
        shown = true;
        // appear where the pointer is rather than sliding in from far away
        cx = x;
        cy = y;
        render();
        el.setAttribute("data-show", "");
      } else if (!next && shown) {
        shown = false;
        el.removeAttribute("data-show");
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !fine.matches) {
        if (shown) setTarget(null);
        return;
      }
      hasPointer = true;
      x = e.clientX;
      y = e.clientY;
      setTarget(e.target as Element);
      kick();
    };
    const onLeave = (e: PointerEvent | MouseEvent) => {
      if ((e as MouseEvent).relatedTarget) return;
      hasPointer = false;
      setTarget(null);
    };
    const onDown = (e: PointerEvent) => {
      if (shown && e.pointerType === "mouse") el.setAttribute("data-pressed", "");
    };
    const onUp = () => {
      el.removeAttribute("data-pressed");
      onUpLate();
    };
    // content moves under a still pointer while scrolling
    const onScroll = () => {
      if (!hasPointer || scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        scrollQueued = false;
        setTarget(document.elementFromPoint(x, y));
      });
    };
    const onBlur = () => setTarget(null);
    refresh.current = () => setTarget(hasPointer ? document.elementFromPoint(x, y) : null);
    const onUpLate = () => window.setTimeout(refresh.current, 60);

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("blur", onBlur);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  // the hovered element may have been replaced by a route change
  useEffect(() => {
    refresh.current();
  }, [pathname]);

  return (
    <div ref={ref} className="shell-cursor" aria-hidden="true">
      <span ref={textRef} className="shell-cursor-pill" />
    </div>
  );
}
