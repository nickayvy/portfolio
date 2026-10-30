"use client";

import { useEffect, useState } from "react";

const MIN_VISIBLE_MS = 520;
const MAX_WAIT_MS = 6000;
const EXIT_MS = 620;

function whenLoaded(img: HTMLImageElement) {
  if (img.complete) return img.decode().catch(() => undefined);
  return new Promise<void>((resolve) => {
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
  });
}

export function SiteLoader() {
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">(
    "loading",
  );

  useEffect(() => {
    const start = performance.now();
    const html = document.documentElement;
    let cancelled = false;
    let timer = 0;
    html.classList.add("is-booting");

    Promise.race([
      Promise.all([...document.images].map(whenLoaded)),
      new Promise((resolve) => window.setTimeout(resolve, MAX_WAIT_MS)),
    ]).then(() => {
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - start));
      timer = window.setTimeout(() => {
        if (cancelled) return;
        html.classList.remove("is-booting");
        setPhase("exiting");
        timer = window.setTimeout(() => setPhase("done"), EXIT_MS);
      }, wait);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      html.classList.remove("is-booting");
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading the page"
      className={`fixed inset-0 z-[9999] grid place-items-center overflow-hidden bg-background bg-[linear-gradient(to_right,#ece9e1_1px,transparent_1px),linear-gradient(to_bottom,#ece9e1_1px,transparent_1px)] bg-size-[48px_48px] [transition:translate_.62s_cubic-bezier(.19,1,.22,1),opacity_.42s_ease] motion-reduce:[transition-duration:.01ms] ${
        phase === "exiting" ? "pointer-events-none -translate-y-full opacity-96" : ""
      }`}
    >
      <div className="flex -translate-y-[1.5vh] flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/loader-mark.png"
          alt=""
          width={180}
          height={180}
          fetchPriority="high"
          className="block size-[78px] animate-loader-greet object-contain drop-shadow-[5px_6px_0_#ffe28ab8] motion-reduce:animate-none min-[761px]:size-[88px]"
        />
        <div
          aria-hidden
          className="relative mt-6 h-[3px] w-[76px] overflow-hidden bg-[#ececec]"
        >
          <i className="absolute inset-0 origin-left animate-loader-progress bg-[#ffe28a] motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}
