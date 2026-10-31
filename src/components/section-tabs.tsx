"use client";

import { useRef, useState, type KeyboardEvent } from "react";

type Section = { id: string; label: string; body: string };

export function SectionTabs({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + sections.length) % sections.length;
    setActive(sections[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="relative z-[1] pt-8 pb-24">
      <div
        data-roll
        role="tablist"
        aria-label="Sections"
        className="isolate mb-8 flex items-end gap-5 pb-2.5 min-[761px]:mb-12 min-[761px]:gap-7 min-[761px]:pb-4"
      >
        {sections.map(({ id, label }, index) => {
          const selected = id === active;
          return (
            <button
              key={id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`tab-${id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className="relative min-h-[1.16em] pb-[7px] text-[clamp(24px,7.5vw,32px)] leading-[0.96] font-bold tracking-[-0.03em] whitespace-nowrap text-[#b8b8b8] opacity-76 transition-[color,opacity,translate] duration-600 ease-[cubic-bezier(.19,1,.22,1)] after:absolute after:bottom-[2px] after:-left-[2%] after:-z-10 after:h-[.32em] after:w-[104%] after:origin-left after:scale-x-0 after:bg-[#ffe28a] after:transition-transform after:duration-800 after:ease-[cubic-bezier(.19,1,.22,1)] after:content-[''] hover:not-aria-selected:-translate-y-0.5 hover:not-aria-selected:text-[#777] hover:not-aria-selected:opacity-100 aria-selected:text-foreground aria-selected:opacity-100 aria-selected:after:scale-x-100 min-[761px]:pb-2.5 min-[761px]:text-4xl"
            >
              {label}
            </button>
          );
        })}
      </div>

      <div data-roll>
        {sections.map(({ id, body }) => (
          <div
            key={id}
            id={`panel-${id}`}
            role="tabpanel"
            aria-labelledby={`tab-${id}`}
            hidden={id !== active}
          >
            <p className="max-w-xl text-lg text-[#3a3a3a]">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
