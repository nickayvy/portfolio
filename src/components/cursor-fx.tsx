"use client";

import { useEffect, useRef } from "react";

const ease = "ease-[cubic-bezier(.33,1,.68,1)]";

export function CursorFx() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!matchMedia("(pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const html = document.documentElement;
    html.classList.add("has-cursor-fx");

    const onMove = (event: PointerEvent) => {
      el.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
      el.dataset.on = "";
    };
    const onOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const isText = !!target.closest(
        "input, textarea, [contenteditable='true']",
      );
      const isLink =
        !isText &&
        !!target.closest(
          "a, button, [role='button'], select, label, summary",
        );
      el.dataset.mode = isText ? "text" : isLink ? "link" : "";
    };
    const onLeave = () => {
      delete el.dataset.on;
      el.dataset.mode = "";
    };

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerover", onOver, { passive: true });
    html.addEventListener("mouseleave", onLeave);
    return () => {
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerover", onOver);
      html.removeEventListener("mouseleave", onLeave);
      html.classList.remove("has-cursor-fx");
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="group pointer-events-none fixed top-0 left-0 z-[99999] opacity-0 transition-opacity duration-250 will-change-transform data-on:opacity-100"
    >
      <svg
        viewBox="0 0 24 24"
        width={22}
        height={22}
        className={`-mt-[3px] -ml-[4px] block origin-[4px_3px] drop-shadow-[0_1px_2px_#00000040] transition-[opacity,scale] duration-200 ${ease} group-data-[mode=link]:scale-50 group-data-[mode=link]:opacity-0 group-data-[mode=text]:scale-50 group-data-[mode=text]:opacity-0`}
      >
        <path
          d="M5.5 3.2 L18.8 11.4 L12.6 12.8 L9.9 19.6 Z"
          className="fill-foreground stroke-white [paint-order:stroke] [stroke-linejoin:round] [stroke-width:2.2px]"
        />
      </svg>
      <i
        className={`absolute top-0 left-0 -mt-[5px] -ml-[5px] block size-[10px] scale-[.4] rounded-full bg-foreground opacity-0 shadow-[0_1px_5px_#00000038] transition-[opacity,scale,width,height,margin,background-color,border-color,box-shadow] duration-200 ${ease} group-data-[mode=link]:-mt-3 group-data-[mode=link]:-ml-3 group-data-[mode=link]:size-6 group-data-[mode=link]:scale-100 group-data-[mode=link]:border-[1.5px] group-data-[mode=link]:border-foreground group-data-[mode=link]:bg-[#ffe28a8c] group-data-[mode=link]:opacity-100 group-data-[mode=link]:shadow-none group-data-[mode=text]:-mt-[10px] group-data-[mode=text]:-ml-px group-data-[mode=text]:h-5 group-data-[mode=text]:w-[2px] group-data-[mode=text]:scale-100 group-data-[mode=text]:rounded-[2px] group-data-[mode=text]:opacity-100`}
      />
    </div>
  );
}
