/**
 * STUB (art engineer owns). Small crayon cat portraits used as avatars.
 * Contract: <CatFace kind="siamese" | "tuxedo" | "blank" className? /> inline svg, viewBox 0 0 120 120.
 */
export function CatFace({ kind, className }: { kind: "siamese" | "tuxedo" | "blank"; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden data-kind={kind}>
      <circle cx="60" cy="64" r="38" fill="none" stroke="var(--figure-ink)" strokeWidth="5" />
    </svg>
  );
}
