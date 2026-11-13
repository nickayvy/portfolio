"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/content/site";
import { ProjectCover } from "./ProjectCover";

/** Vertical scroll pixels spent per pixel of sideways travel while pinned. */
const RATIO = 0.85;
/** Pinned (scroll-driven) rail only for fine pointers at md and up; touch gets native scroll-snap. */
const PIN_QUERY = "(min-width: 768px) and (hover: hover) and (pointer: fine)";
const CYCLE_MS = 1100;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function Card({ project, index }: { project: Project; index: number }) {
  const [slide, setSlide] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!hover || project.slides < 2) return;
    const t = window.setInterval(() => setSlide((s) => (s + 1) % project.slides), CYCLE_MS);
    return () => window.clearInterval(t);
  }, [hover, project.slides]);

  return (
    <article className="rail-card" data-index={index}>
      <Link
        href={`/work/${project.slug}`}
        className="rail-link"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        aria-label={`${project.title}: ${project.tags.join(", ")}. Read case study`}
      >
        <div
          className="rail-cover"
          data-cursor="View project"
          data-hover={hover || undefined}
          onPointerMove={(e) => {
            // Only a real pointer move starts the cycle: cards sliding under a resting
            // pointer while the page scrolls (synthetic moves, no movement) must not.
            if (hover || e.pointerType !== "mouse" || e.buttons !== 0) return;
            if (e.movementX === 0 && e.movementY === 0) return;
            setHover(true);
            setSlide((s) => (project.slides > 1 ? (s + 1) % project.slides : s));
          }}
          onPointerLeave={() => {
            setHover(false);
            setSlide(0);
          }}
          aria-hidden
        >
          {Array.from({ length: project.slides }, (_, i) => (
            <div key={i} className="rail-slide" data-on={i === slide || undefined}>
              <ProjectCover project={project} slide={i} />
            </div>
          ))}
          {project.slides > 1 ? (
            <div className="rail-dots">
              {Array.from({ length: project.slides }, (_, i) => (
                <span key={i} data-on={i === slide || undefined} />
              ))}
            </div>
          ) : null}
        </div>
        <div className="rail-meta" aria-hidden>
          <div className="min-w-0">
            <p className="rail-title">{project.title}</p>
            <p className="rail-tags">
              {project.tags.map((t, i) => (
                <span key={t}>
                  {i > 0 ? <span className="px-1">·</span> : null}
                  {t}
                </span>
              ))}
            </p>
          </div>
          <span className="rail-read">
            Read case study <span className="rail-arrow">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const n = projects.length;
    const mq = window.matchMedia(PIN_QUERY);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pinned = mq.matches;
    let step = 0;
    let raf = 0;
    let active = -1;
    let inertia = 0;
    let suppressClick = false;

    const setActive = (i: number) => {
      if (i === active) return;
      active = i;
      setStatus(i);
    };

    const measure = () => {
      const cards = track.children;
      step = cards.length > 1 ? (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft : 0;
      section.style.setProperty("--rail-travel", `${step * (n - 1)}px`);
    };

    /** Page-scroll range [start, length] across which the rail travels. */
    const range = (): [number, number] => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      return [top, Math.max(1, section.offsetHeight - window.innerHeight)];
    };

    const update = () => {
      raf = 0;
      if (!pinned) {
        setActive(step ? clamp(Math.round(viewport.scrollLeft / step), 0, n - 1) : 0);
        return;
      }
      const [start, len] = range();
      const p = clamp((window.scrollY - start) / len, 0, 1);
      track.style.setProperty("--rail-x", `${(-p * step * (n - 1)).toFixed(2)}px`);
      setActive(Math.round(p * (n - 1)));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // While the page scrolls, cards slide under a resting pointer: switch off their hit
    // testing until scrolling settles so hover effects don't churn mid-scroll.
    let settle = 0;
    const onPageScroll = () => {
      schedule();
      if (!pinned || drag) return;
      if (!settle) track.dataset.scrolling = "true";
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        settle = 0;
        delete track.dataset.scrolling;
      }, 140);
    };

    const scrollPageTo = (y: number, smooth = false) =>
      window.scrollTo({ top: y, behavior: smooth && !reduce.matches ? "smooth" : "instant" });

    const goTo = (i: number, smooth = true) => {
      const k = clamp(i, 0, n - 1);
      if (pinned) {
        const [start, len] = range();
        scrollPageTo(start + (len * k) / (n - 1), smooth);
      } else {
        viewport.scrollTo({ left: k * step, behavior: smooth && !reduce.matches ? "smooth" : "instant" });
      }
    };

    const stopInertia = () => {
      if (inertia) cancelAnimationFrame(inertia);
      inertia = 0;
    };

    // ---- drag (pinned mode, mouse only). Dragging moves the page, so the scroll position
    // stays the single source of truth and nothing can get stuck.
    let drag: null | { x: number; y0: number; last: number; t: number; v: number; moved: boolean; id: number } = null;

    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true;
        viewport.setPointerCapture(e.pointerId);
        viewport.dataset.dragging = "true";
      }
      if (!drag.moved) return;
      const [start, len] = range();
      scrollPageTo(clamp(drag.y0 - dx * RATIO, start, start + len));
      const now = performance.now();
      const dt = Math.max(1, now - drag.t);
      drag.v = 0.8 * ((e.clientX - drag.last) / dt) + 0.2 * drag.v;
      drag.last = e.clientX;
      drag.t = now;
    };

    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      delete viewport.dataset.dragging;
      const { moved } = drag;
      let v = performance.now() - drag.t > 80 ? 0 : drag.v; // px per ms, sideways
      drag = null;
      if (!moved) return;
      suppressClick = true;
      window.setTimeout(() => (suppressClick = false), 0);
      if (reduce.matches) v = 0;
      const tick = () => {
        v *= 0.93;
        if (Math.abs(v) < 0.02) {
          inertia = 0;
          return;
        }
        const [start, len] = range();
        scrollPageTo(clamp(window.scrollY - v * 16 * RATIO, start, start + len));
        inertia = requestAnimationFrame(tick);
      };
      inertia = requestAnimationFrame(tick);
    };

    const onDown = (e: PointerEvent) => {
      stopInertia();
      if (!pinned || e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { x: e.clientX, y0: window.scrollY, last: e.clientX, t: performance.now(), v: 0, moved: false, id: e.pointerId };
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    };

    const onClickCapture = (e: MouseEvent) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      }
    };

    // Sideways trackpad / shift-wheel moves the rail; vertical wheel is never touched.
    const onWheel = (e: WheelEvent) => {
      stopInertia();
      if (!pinned || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      const [start, len] = range();
      const y = window.scrollY;
      const target = clamp(y + e.deltaX * RATIO, start, start + len);
      if (Math.abs(target - y) < 0.5) return;
      e.preventDefault();
      scrollPageTo(target);
    };

    const onKey = (e: KeyboardEvent) => {
      const cur = Math.max(0, active);
      if (e.key === "ArrowRight") goTo(cur + 1);
      else if (e.key === "ArrowLeft") goTo(cur - 1);
      else if (e.key === "Home" && e.target === viewport) goTo(0);
      else if (e.key === "End" && e.target === viewport) goTo(n - 1);
      else return;
      e.preventDefault();
    };

    // Keyboard focus on a card brings it to the centre.
    const onFocusIn = (e: FocusEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".rail-card");
      if (!card || !pinned) return;
      const i = Number(card.dataset.index);
      if (i !== active) goTo(i);
    };

    const onMq = () => {
      pinned = mq.matches;
      if (!pinned) track.style.removeProperty("--rail-x");
      measure();
      schedule();
    };

    measure();
    update();
    const ro = new ResizeObserver(() => {
      measure();
      schedule();
    });
    ro.observe(track);
    ro.observe(document.body);

    window.addEventListener("scroll", onPageScroll, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    viewport.addEventListener("scroll", schedule, { passive: true });
    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("click", onClickCapture, true);
    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("keydown", onKey);
    viewport.addEventListener("focusin", onFocusIn);
    viewport.addEventListener("touchstart", stopInertia, { passive: true });
    mq.addEventListener("change", onMq);

    return () => {
      cancelAnimationFrame(raf);
      stopInertia();
      ro.disconnect();
      window.removeEventListener("scroll", onPageScroll);
      window.clearTimeout(settle);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      viewport.removeEventListener("scroll", schedule);
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("click", onClickCapture, true);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("keydown", onKey);
      viewport.removeEventListener("focusin", onFocusIn);
      viewport.removeEventListener("touchstart", stopInertia);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  return (
    <section id="work" ref={sectionRef} className="rail-section" style={{ "--n": projects.length } as React.CSSProperties} aria-labelledby="work-h">
      <h2 id="work-h" className="sr-only">
        Featured projects
      </h2>
      <div className="rail-sticky">
        <div
          ref={viewportRef}
          className="rail-viewport reveal"
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label="Featured projects. Use the left and right arrow keys to move between projects."
          data-cursor="Drag"
        >
          <div ref={trackRef} className="rail-track">
            {projects.map((p, i) => (
              <Card key={p.slug} project={p} index={i} />
            ))}
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {`Project ${status + 1} of ${projects.length}: ${projects[status]?.title}`}
        </p>
      </div>
    </section>
  );
}
