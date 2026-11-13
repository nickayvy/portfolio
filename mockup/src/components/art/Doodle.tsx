import type { DoodleName } from "@/content/site";

/** Inline 1em crayon icon. Contract: <Doodle name className? />. */
export function Doodle({ name, className }: { name: DoodleName; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden data-doodle={name} style={{ height: "1em", width: "1em" }}>
      <circle cx="24" cy="24" r="16" fill="none" stroke="var(--figure-ink)" strokeWidth="4" />
    </svg>
  );
}
