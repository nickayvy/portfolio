/**
 * Crayon filters, mounted once in the root layout.
 *
 *   url(#crayon)       figures (strokes ~6–13 units in a 400-unit drawing)
 *   url(#crayon-fine)  small inline doodles (≤ 24px, 24-unit viewBox)
 *
 * Three passes: a slow turbulence displacement bends every line a little (hand wobble),
 * a fast, tiny displacement roughens the edges (wax dragging on paper tooth), and a
 * high-frequency noise mask knocks small holes out of the stroke (broken grain).
 * Noise is in the user units of the element using the filter, so the texture scales
 * with the drawing. Regions are bounding-box relative, so filtered groups must not be
 * a single straight line (give those a <CrayonPad/>).
 */
export function CrayonDefs() {
  return (
    <svg aria-hidden width="0" height="0" focusable="false" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <filter id="crayon" x="-12%" y="-12%" width="124%" height="124%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.021" numOctaves="2" seed="17" result="bend" />
          <feDisplacementMap in="SourceGraphic" in2="bend" scale="7" xChannelSelector="G" yChannelSelector="B" result="bent" />
          <feTurbulence type="turbulence" baseFrequency="0.38" numOctaves="1" seed="3" result="tooth" />
          <feDisplacementMap in="bent" in2="tooth" scale="1.5" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.7 0.55" numOctaves="2" seed="29" result="grain" />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 -2.4 0 0 2.15"
            result="holes"
          />
          <feComposite in="rough" in2="holes" operator="in" />
        </filter>
        <filter id="crayon-fine" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves="1" seed="5" result="bend" />
          <feDisplacementMap in="SourceGraphic" in2="bend" scale="0.9" xChannelSelector="G" yChannelSelector="B" result="bent" />
          <feTurbulence type="fractalNoise" baseFrequency="3.2" numOctaves="1" seed="8" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 -2 0 0 1.95" result="holes" />
          <feComposite in="bent" in2="holes" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * An invisible box that widens a filtered group's bounding box, so thin strokes
 * (a ground line, a wisp of steam) are not clipped by the bbox-relative filter region.
 */
export function CrayonPad({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={w} height={h} fill="none" stroke="none" pointerEvents="none" />;
}
