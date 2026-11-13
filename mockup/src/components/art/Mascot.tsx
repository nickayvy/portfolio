/**
 * STUB (art engineer owns). Crayon head of Nick: curly hair, round glasses.
 * Contract:
 *   <Mascot className? interactive? />      head only, viewBox 0 0 400 400
 *   <MascotPropeller className? />          head wearing a propeller cap (playground title, 404)
 * `interactive` enables hover/tap reactions and eye tracking. Decorative: aria-hidden.
 */
export function Mascot({ className }: { className?: string; interactive?: boolean }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden>
      <circle cx="200" cy="210" r="120" fill="none" stroke="var(--figure-ink)" strokeWidth="10" />
    </svg>
  );
}

export function MascotPropeller({ className }: { className?: string }) {
  return <Mascot className={className} />;
}
