import type { CSSProperties } from "react";
import { smooth, type Pt } from "./geom";

/**
 * Hand-drawn "Nick Nguyen" signature: two connected strokes plus the dot of the i,
 * laid out upright and then sheared into a quick forward slant.
 * Contract: <Signature className? draw? />, strokes in currentColor.
 * With `draw`, the strokes ink themselves on in writing order (about 1.3s).
 */
const SLANT = 0.32;
const BASE = 170;
const shear = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [x + (BASE - y) * SLANT, y]);

const N1: Pt[] = [
  // lead-in and N
  [18, 196], [44, 182], [70, 120], [96, 44], [101, 40], [112, 96], [138, 170], [144, 172], [158, 110], [176, 36],
  [182, 28],
];
const ICK: Pt[] = [
  // i
  [190, 170], [214, 126], [208, 162], [220, 171], [236, 162],
];
const CK: Pt[] = [
  // c, entered from the top like a quick hook
  [264, 132], [256, 120], [236, 128], [228, 152], [240, 170], [262, 166],
  // k: tall loop, stem, then the kicked arm
  [286, 134], [312, 70], [318, 34], [306, 30], [294, 62], [282, 128], [278, 172], [286, 138], [312, 120], [322, 132],
  [304, 148], [292, 148], [318, 164], [346, 170], [370, 160],
];
const IDOT: Pt[] = [[206, 100], [212, 96]];
const NGUYEN: Pt[] = [
  // N
  [402, 194], [428, 176], [452, 112], [476, 40], [482, 38], [494, 96], [516, 168], [522, 170], [538, 108], [556, 34],
  [566, 28], [566, 44], [552, 110],
  // into g: bowl, descender loop
  [556, 136], [584, 124], [570, 120], [552, 132], [550, 162], [568, 166], [588, 140], [592, 126], [588, 168], [576, 220],
  [560, 246], [542, 244], [546, 222], [578, 190], [608, 168],
  // u
  [622, 126], [618, 162], [630, 170], [650, 146], [656, 124], [652, 160], [662, 170],
  // y with its tail
  [684, 128], [680, 160], [692, 168], [712, 140], [716, 126], [710, 190], [696, 236], [680, 248], [670, 236], [690, 206],
  [730, 176], [746, 166],
  // e
  [770, 156], [786, 138], [776, 126], [758, 136], [756, 160], [772, 170], [794, 160],
  // n, then the long exit stroke
  [808, 128], [806, 170], [814, 140], [832, 124], [844, 132], [842, 166], [852, 172], [900, 160], [1000, 142], [1082, 132],
];

const STROKES = [
  { d: smooth(shear(N1)), dur: 0.22, delay: 0 },
  { d: smooth(shear(ICK)), dur: 0.08, delay: 0.24 },
  { d: smooth(shear(CK)), dur: 0.24, delay: 0.34 },
  { d: smooth(shear(IDOT)), dur: 0.05, delay: 0.6 },
  { d: smooth(shear(NGUYEN)), dur: 0.7, delay: 0.66 },
];

export function Signature({ className, draw = false }: { className?: string; draw?: boolean }) {
  return (
    <svg
      viewBox="0 10 1120 250"
      className={["signature", className].filter(Boolean).join(" ")}
      role="img"
      aria-label="Nick Nguyen"
      data-draw={draw ? "" : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {STROKES.map((s, i) => (
        <path
          key={i}
          d={s.d}
          pathLength={1}
          style={{ "--sig-dur": `${s.dur}s`, "--sig-delay": `${s.delay}s` } as CSSProperties}
        />
      ))}
    </svg>
  );
}
