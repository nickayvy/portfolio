"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { playSound } from "@/lib/sound";
import { CrayonPad } from "./CrayonDefs";
import { NickHead } from "./NickHead";
import { CAP } from "./nick";
import { usePauseOffscreen } from "./usePauseOffscreen";

/**
 * Crayon head of Nick: curly hair, round red glasses.
 * Contract:
 *   <Mascot className? interactive? />      head only, viewBox 0 0 400 400
 *   <MascotPropeller className? />          head wearing a propeller cap (playground title, 404)
 * `interactive`: pupils follow the pointer, occasional blinks, and a poke (click, Enter
 * or Space) makes him jolt and go dizzy. Otherwise purely decorative.
 */
export function Mascot({ className, interactive = false }: { className?: string; interactive?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  useMascotLife(ref, interactive);

  const poke = () => {
    const svg = ref.current;
    if (!svg) return;
    playSound("pop");
    svg.removeAttribute("data-poked");
    // restart the CSS animation
    void svg.getBoundingClientRect();
    svg.setAttribute("data-poked", "");
    window.clearTimeout(Number(svg.dataset.pokeTimer));
    svg.dataset.pokeTimer = String(window.setTimeout(() => svg.removeAttribute("data-poked"), 1700));
  };

  const interactiveProps = interactive
    ? {
        role: "button",
        tabIndex: 0,
        "aria-label": "Poke Nick",
        "data-cursor": "Hi!",
        onClick: poke,
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            poke();
          }
        },
      }
    : { "aria-hidden": true as const };

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 400"
      fill="none"
      className={["mascot", interactive && "mascot--live", className].filter(Boolean).join(" ")}
      {...interactiveProps}
    >
      <g className="mascot-tilt">
        <g className="mascot-body">
          <NickHead />
        </g>
      </g>
      {interactive && <DizzyStars />}
    </svg>
  );
}

export function MascotPropeller({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  usePauseOffscreen(ref);
  return (
    <svg ref={ref} data-paused="" viewBox="0 0 400 400" fill="none" className={["mascot mascot--cap", className].filter(Boolean).join(" ")} aria-hidden>
      <g className="mascot-tilt">
        <NickHead />
        {/* paper fill hides the top of the curls under the beanie */}
        <path d={CAP.dome} fill="var(--paper)" />
        <g filter="url(#crayon)" stroke="var(--accent-blue)" strokeWidth="13" strokeLinecap="round" opacity="0.9">
          <path d={CAP.blue} />
        </g>
        <g filter="url(#crayon)" stroke="var(--figure-ink)" strokeLinecap="round" strokeLinejoin="round">
          <path d={CAP.domeLine} strokeWidth="10" />
          <path d={CAP.band} strokeWidth="10" />
          <path d={CAP.seam} strokeWidth="7" />
          <path d={CAP.stem} strokeWidth="9" />
        </g>
        <g className="propeller">
          <g filter="url(#crayon)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8">
            <CrayonPad x={136} y={18} w={142} h={40} />
            <path d={CAP.bladeL} stroke="var(--accent-red)" fill="var(--accent-red)" />
            <path d={CAP.bladeR} stroke="var(--accent-blue)" fill="var(--accent-blue)" />
            <path d="M206 41h0.5" stroke="var(--figure-ink)" strokeWidth="14" />
          </g>
        </g>
      </g>
    </svg>
  );
}

/** Little crayon stars that circle the head after a poke. */
function DizzyStars() {
  const star = "M0 -15L0 15M-15 0L15 0M-10 -10L10 10M-10 10L10 -10";
  return (
    <g className="mascot-dizzy" strokeLinecap="round" strokeWidth="8" filter="url(#crayon)">
      <CrayonPad x={50} y={0} w={300} h={96} />
      {[0, 1, 2].map((i) => (
        <g key={i} className="mascot-star" style={{ animationDelay: `${-i * 0.33}s` }}>
          <path d={star} stroke={i === 1 ? "var(--accent-blue)" : "var(--accent-red)"} />
        </g>
      ))}
    </g>
  );
}

/** Gaze tracking and blinking, paused while off screen. */
function useMascotLife(ref: React.RefObject<SVGSVGElement | null>, enabled: boolean) {
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const eyes = svg.querySelector<SVGGElement>(".nick-eyes");
    let visible = false;
    let raf = 0;
    let blinkTimer = 0;
    let px = 0;
    let py = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const blink = () => {
      if (!eyes) return;
      eyes.setAttribute("data-shut", "");
      window.setTimeout(() => eyes.removeAttribute("data-shut"), 130);
    };
    const scheduleBlink = () => {
      window.clearTimeout(blinkTimer);
      blinkTimer = window.setTimeout(() => {
        if (visible && document.visibilityState === "visible") {
          blink();
          if (Math.random() < 0.25) window.setTimeout(blink, 260);
        }
        if (!reduce.matches) scheduleBlink();
      }, 2600 + Math.random() * 3400);
    };

    // eyes ease toward the pointer instead of snapping, like they are catching up
    let ex = 0;
    let ey = 0;
    let tx = 0;
    let ty = 0;
    const update = () => {
      raf = 0;
      const r = svg.getBoundingClientRect();
      const cx = r.left + r.width * 0.52;
      const cy = r.top + r.height * 0.58;
      const dx = px - cx;
      const dy = py - cy;
      const d = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, d / 260) * 7;
      tx = (dx / d) * reach;
      ty = (dy / d) * reach * 0.8;
      ex += (tx - ex) * 0.22;
      ey += (ty - ey) * 0.22;
      svg.style.setProperty("--ex", ex.toFixed(2));
      svg.style.setProperty("--ey", ey.toFixed(2));
      if (Math.abs(tx - ex) + Math.abs(ty - ey) > 0.05 && visible) raf = requestAnimationFrame(update);
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf && visible) raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(svg);
    if (enabled && !reduce.matches) window.addEventListener("pointermove", onMove, { passive: true });
    if (!reduce.matches) scheduleBlink();

    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.clearTimeout(blinkTimer);
      cancelAnimationFrame(raf);
    };
  }, [ref, enabled]);
}
