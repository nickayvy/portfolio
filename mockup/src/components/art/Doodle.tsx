import type { DoodleName } from "@/content/site";
import type { ReactNode } from "react";

/**
 * Inline crayon icons that sit mid-sentence (about 1.3em, aligned to the text).
 * Contract: <Doodle name className? />. Decorative (aria-hidden).
 * Each icon has one small part (class `dd-*`) that moves on hover; see art.css.
 */

const gear = (() => {
  const teeth = 8;
  const pts: string[] = [];
  for (let i = 0; i < teeth * 4; i++) {
    const a = (i / (teeth * 4)) * Math.PI * 2;
    const r = i % 4 < 2 ? 9.2 : 6.9;
    pts.push(`${(12 + Math.cos(a) * r).toFixed(1)} ${(12 + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
})();

const ICONS: Record<DoodleName, ReactNode> = {
  rocket: (
    <>
      <g className="dd-flame">
        <path d="M10.2 18.6c.2 1.8.9 3 1.8 3.9.9-.9 1.6-2.1 1.8-3.9" fill="var(--accent-red)" stroke="var(--accent-red)" />
      </g>
      <g className="dd-lift">
        <path d="M12 2.2c-3 2.4-4.3 6-4 10.4l1.4 5.4h5.2l1.4-5.4c.3-4.4-1-8-4-10.4Z" fill="var(--paper)" />
        <path d="M8 12.6 5 15.6l.6 3 3.8-1M16 12.6l3 3-.6 3-3.8-1" />
        <circle cx="12" cy="9.2" r="1.9" fill="var(--accent-red)" />
      </g>
    </>
  ),
  wrench: (
    <g className="dd-turn">
      <path d="M14.6 3.4a5 5 0 0 0-4.8 6.6L3.6 16.2a2 2 0 0 0 2.8 2.8l6.2-6.2a5 5 0 0 0 6.6-4.8l-2.8 2.4-2.6-.8-.8-2.6 2.6-3.2Z" fill="var(--paper)" />
      <circle cx="5.2" cy="17.6" r=".5" fill="var(--accent-red)" stroke="var(--accent-red)" />
    </g>
  ),
  bowl: (
    <>
      <g className="dd-steam" stroke="var(--accent-blue)">
        <path d="M9 7.2c-1-1.2 1-2 0-3.4M13 7.2c-1-1.2 1-2 0-3.4" />
      </g>
      <path d="M16.6 2.6 13 10.6M20.4 4.2 14.8 10.8" />
      <path d="M3.2 11h17.6c-.4 4.6-3.8 7.6-8.8 7.6S3.6 15.6 3.2 11Z" fill="var(--paper)" />
      <path d="M8.6 20.8h6.8" />
      <path d="M6.6 14c1.4.8 3.6.8 5-.2" stroke="var(--accent-red)" />
    </>
  ),
  cap: (
    <>
      <path d="M1.8 9.4 12 4.6l10.2 4.8L12 14.2Z" fill="var(--paper)" />
      <path d="M6.2 11.6v4.2c3.4 2.6 8.2 2.6 11.6 0v-4.2" />
      <g className="dd-tassel" stroke="var(--accent-red)">
        <path d="M12 9.4l7.4 1.4v5.4" />
        <path d="M18.6 16.4h1.6l-.2 2.6h-1.2Z" fill="var(--accent-red)" />
      </g>
    </>
  ),
  terminal: (
    <>
      <rect x="2.6" y="4.2" width="18.8" height="15" rx="2.4" fill="var(--paper)" />
      <path d="M2.8 8.2h18.4" />
      <path d="M6.6 12.2l2.6 2-2.6 2" stroke="var(--accent-blue)" />
      <path className="dd-caret" d="M11.4 16.4h3.8" stroke="var(--accent-red)" />
    </>
  ),
  cat: (
    <>
      <g className="dd-ear-l">
        <path d="M5 10.4 4.2 3.2l5.2 3.4" />
      </g>
      <g className="dd-ear-r">
        <path d="M19 10.4l.8-7.2-5.2 3.4" />
      </g>
      <path d="M9.4 6.6c1.7-.5 3.5-.5 5.2 0" />
      <path d="M5 10.4c-1.8 5 1.6 9.8 7 9.8s8.8-4.8 7-9.8" />
      <path d="M9 12.4v.2M15 12.4v.2" stroke="var(--accent-blue)" strokeWidth="2.6" />
      <path d="M11.2 15.2h1.6l-.8.9Z" fill="var(--accent-red)" stroke="var(--accent-red)" />
      <path d="M1.8 14.6l4 .4M2.2 17.6l3.8-1M22.2 14.6l-4 .4M21.8 17.6l-3.8-1" strokeWidth="1.2" />
    </>
  ),
  gear: (
    <g className="dd-spin">
      <path d={gear} fill="var(--paper)" />
      <circle cx="12" cy="12" r="2.6" fill="var(--accent-red)" />
    </g>
  ),
  stream: (
    <>
      <path className="dd-flow" d="M2.4 7.2c3-2.4 5.6 2.4 8.8 0s5.6 2.4 8.8 0" />
      <path className="dd-flow" d="M2.4 12.2c3-2.4 5.6 2.4 8.8 0s5.6 2.4 8.8 0" stroke="var(--accent-blue)" />
      <path className="dd-flow" d="M2.4 17.2c3-2.4 5.6 2.4 8.8 0s5.6 2.4 8.8 0" />
      <path d="M19.4 14.6l2.4-2.4-2.4-2.4" stroke="var(--accent-red)" />
    </>
  ),
};

export function Doodle({ name, className }: { name: DoodleName; className?: string }) {
  return (
    <span className={["doodle", className].filter(Boolean).join(" ")} data-doodle={name} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--figure-ink)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <g filter="url(#crayon-fine)">{ICONS[name]}</g>
      </svg>
    </span>
  );
}
