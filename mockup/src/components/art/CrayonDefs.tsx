/**
 * STUB (art engineer owns). Mounted once in the root layout.
 * Contract: defines SVG filters with ids `crayon` (figures) and `crayon-fine`
 * (small inline doodles). Any inline <svg> applies them with filter="url(#crayon)".
 */
export function CrayonDefs() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter id="crayon" />
        <filter id="crayon-fine" />
      </defs>
    </svg>
  );
}
