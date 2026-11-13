/**
 * STUB (art engineer owns). Hand-drawn single-stroke "Nick Nguyen" signature.
 * Contract: <Signature className? draw? /> — an inline <svg> whose strokes use
 * currentColor. When `draw` is true the strokes draw themselves on (loader).
 */
export function Signature({ className }: { className?: string; draw?: boolean }) {
  return (
    <svg viewBox="0 0 1100 260" className={className} role="img" aria-label="Nick Nguyen">
      <text x="20" y="180" fontSize="150" fill="currentColor" style={{ fontFamily: "var(--font-hand)" }}>
        Nick Nguyen
      </text>
    </svg>
  );
}
