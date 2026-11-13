import { coil, rng, smooth, type Pt } from "./geom";

/** Hand-drawn ring that overshoots its start a little, like a quick crayon circle. */
export function ring(cx: number, cy: number, r: number, seed: number, over = 0.35, squash = 1): string {
  const rand = rng(seed);
  const pts: Pt[] = [];
  const start = -2.2 + rand() * 0.4;
  const n = 16;
  for (let i = 0; i <= n; i++) {
    const a = start + (i / n) * (Math.PI * 2 + over);
    const rr = r * (0.975 + rand() * 0.05);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * squash]);
  }
  return smooth(pts);
}

/** A small loose curl, about one and a half turns, winding inwards. */
export function spiral(cx: number, cy: number, r: number, seed: number): string {
  const rand = rng(seed);
  const pts: Pt[] = [];
  const a0 = rand() * Math.PI * 2;
  const n = 14;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = a0 + t * Math.PI * 2.1;
    const rr = r * (1 - 0.5 * t);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return smooth(pts);
}

/** Nick's head, in a 400×400 box. Shared by Mascot, MascotPropeller and FooterScene. */
export const NICK = {
  face: smooth([
    [106, 192], [101, 236], [110, 280], [138, 315], [180, 334], [224, 330], [264, 309], [292, 276], [302, 252],
  ]),
  /** closed face shape, used as a paper underlay where the head overlaps a body */
  faceFill: smooth([
    [106, 192], [101, 236], [110, 280], [138, 315], [180, 334], [224, 330], [264, 309], [292, 276], [304, 240], [306, 196], [206, 160],
  ], true),
  faceRight: smooth([[303, 214], [306, 196]]),
  ear: smooth([[302, 222], [322, 214], [338, 230], [334, 256], [316, 268], [300, 262]]),
  earCurl: smooth([[317, 232], [326, 243], [316, 253]]),
  hairOuter: coil(
    [[102, 216], [80, 182], [82, 132], [116, 94], [180, 80], [236, 74], [286, 96], [318, 132], [328, 176], [313, 210]],
    { loops: 12, r: 18, seed: 7, side: -1, lead: 0.8, jitter: 0.45, spread: 0.7 },
  ),
  hairInner: coil(
    [[108, 192], [124, 162], [164, 146], [208, 152], [252, 144], [290, 160], [306, 192]],
    { loops: 7, r: 12, seed: 3, side: 1, lead: 0.75, jitter: 0.45, spread: 0.7 },
  ),
  hairCurls: [
    coil([[150, 122], [176, 108], [200, 104]], { loops: 2, r: 11, seed: 21, side: -1, lead: 0.8, jitter: 0.5 }),
  ],
  lensL: ring(158, 234, 37, 4),
  lensR: ring(253, 230, 36, 9),
  bridge: smooth([[195, 231], [206, 221], [217, 229]]),
  armL: smooth([[121, 233], [104, 229]]),
  armR: smooth([[289, 226], [305, 221]]),
  nose: smooth([[209, 246], [203, 268], [214, 275]]),
  smile: smooth([[183, 298], [203, 309], [224, 297]]),
  pupilL: [163, 237] as Pt,
  pupilR: [253, 233] as Pt,
  blinkL: smooth([[148, 238], [162, 243], [176, 238]]),
  blinkR: smooth([[238, 234], [252, 239], [266, 234]]),
  squintL: smooth([[150, 226], [170, 236], [151, 246]]),
  squintR: smooth([[264, 222], [244, 232], [263, 242]]),
  blueHair: smooth([[72, 196], [62, 150], [74, 104], [100, 76]]),
  blueJaw: smooth([[300, 282], [284, 306], [262, 324]]),
};

/** Beanie with a propeller, sitting on Nick's curls (same 400×400 box). */
export const CAP = {
  dome: "M122 136C118 92 156 62 206 60C258 58 294 90 292 132C250 120 166 122 122 136Z",
  domeLine: smooth([[120, 138], [124, 102], [152, 74], [206, 60], [258, 64], [286, 88], [293, 132]]),
  band: smooth([[116, 140], [160, 126], [208, 121], [254, 123], [298, 135]]),
  seam: smooth([[206, 62], [202, 92], [205, 120]]),
  stem: smooth([[206, 60], [206, 42]]),
  bladeL: "M204 38C186 24 156 20 144 30C140 40 170 46 204 42Z",
  bladeR: "M208 38C226 24 256 20 268 30C272 40 242 46 208 42Z",
  blue: smooth([[132, 120], [146, 92], [174, 76]]),
};
