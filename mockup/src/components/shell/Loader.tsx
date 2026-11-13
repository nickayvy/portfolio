"use client";

/**
 * First-visit loader: a full-screen sheet of paper where the signature draws
 * itself on and the mascot pops up, then the sheet peels away from the
 * bottom-right corner. Plays once per browser session, skipped under reduced
 * motion (decided before paint by <ShellScript/>), never longer than 3s.
 * Sets `html[data-ready="true"]` as the page is uncovered.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Mascot } from "@/components/art/Mascot";
import { Signature } from "@/components/art/Signature";
import { shellState } from "@/lib/prefs";

const PEEL_MS = 560;
const PEEL_EARLIEST = 1180; // ms after navigation start
const PEEL_LATEST = 2300; // later than this there is no time to peel: fade instead

type Pt = [number, number];

/** Clip a convex polygon to the half-plane x + y <= c (or >= c). */
function clip(poly: Pt[], c: number, keepBelow: boolean): Pt[] {
  const inside = (p: Pt) => (keepBelow ? p[0] + p[1] <= c : p[0] + p[1] >= c);
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const ia = inside(a);
    const ib = inside(b);
    if (ia) out.push(a);
    if (ia !== ib) {
      const fa = a[0] + a[1] - c;
      const fb = b[0] + b[1] - c;
      const t = fa / (fa - fb);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}

const toPoly = (pts: Pt[]) =>
  pts.length < 3 ? "polygon(0 0, 0 0, 0 0)" : `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(",")})`;

function finish() {
  const root = document.documentElement;
  const s = shellState();
  s.loading = false;
  root.removeAttribute("data-loading");
  root.setAttribute("data-ready", "true");
  try {
    sessionStorage.setItem("nn-loaded", "1");
  } catch {}
}

export function Loader() {
  const [done, setDone] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);

  // React's dev-mode remount resets attributes on <html>; re-apply what the
  // inline script decided (no-op in production).
  useLayoutEffect(() => {
    const root = document.documentElement;
    const s = shellState();
    s.hydrated = true;
    if (s.theme && root.getAttribute("data-theme") !== s.theme) root.setAttribute("data-theme", s.theme);
    if (!root.hasAttribute("data-js")) root.setAttribute("data-js", "");
    if (s.loading) root.setAttribute("data-loading", "");
    else if (root.getAttribute("data-ready") !== "true") root.setAttribute("data-ready", "true");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-loading")) {
      setDone(true);
      return;
    }
    let raf = 0;
    const timers: number[] = [];
    const now = performance.now();
    const start = Math.max(now, PEEL_EARLIEST);

    // Watch for the inline 3s safety net finishing first.
    const mo = new MutationObserver(() => {
      if (!root.hasAttribute("data-loading")) setDone(true);
    });
    mo.observe(root, { attributes: true, attributeFilter: ["data-loading"] });

    if (start > PEEL_LATEST) {
      root.setAttribute("data-loader-fade", "");
      finish();
      timers.push(window.setTimeout(() => setDone(true), 320));
    } else {
      timers.push(
        window.setTimeout(() => {
          const page = pageRef.current;
          const flap = flapRef.current;
          if (!page || !flap) return finish();
          const W = window.innerWidth;
          const H = window.innerHeight;
          const rect: Pt[] = [[0, 0], [W, 0], [W, H], [0, H]];
          const total = W + H + 40;
          const t0 = performance.now();
          let readySet = false;
          const frame = (t: number) => {
            const p = Math.min(1, (t - t0) / PEEL_MS);
            const e = p * p * (2.2 - 1.2 * p); // eases in, settles slightly at the end
            const d = e * total;
            const c = W + H - d; // fold line x + y = c
            page.style.clipPath = toPoly(clip(rect, c, true));
            // the folded-over corner is the cut-off region mirrored across the fold
            flap.style.clipPath = toPoly(clip(rect, c, false).map(([x, y]) => [c - y, c - x] as Pt));
            if (!readySet && p > 0.25) {
              readySet = true;
              root.setAttribute("data-ready", "true");
            }
            if (p < 1) raf = requestAnimationFrame(frame);
            else {
              finish();
              setDone(true);
            }
          };
          raf = requestAnimationFrame(frame);
        }, start - now),
      );
    }
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (done) document.documentElement.removeAttribute("data-loader-fade");
  }, [done]);

  if (done) return null;

  return (
    <div className="shell-loader" aria-hidden="true">
      <div ref={pageRef} className="shell-loader-page">
        <div className="shell-loader-mark">
          <div className="shell-loader-mascot-mask">
            <div className="shell-loader-mascot">
              <Mascot className="h-full w-full" />
            </div>
          </div>
          <Signature draw className="shell-loader-signature" />
        </div>
      </div>
      <div className="shell-loader-flap-shadow">
        <div ref={flapRef} className="shell-loader-flap" />
      </div>
    </div>
  );
}
