import { coil, rng, smooth, type Pt } from "./geom";

/** Hand-drawn ring that overshoots its start a little, like a quick crayon circle. */
export function ring(cx: number, cy: number, r: number, seed: number, over = 0.35, squash = 1): string {
  const rand = rng(seed);
  const pts: Pt[] = [];
  const start = -2.2 + rand() * 0.4;
  const n = 12;
  for (let i = 0; i <= n; i++) {
    const a = start + (i / n) * (Math.PI * 2 + over);
    const rr = r * (0.96 + rand() * 0.08);
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
    { loops: 14, r: 16, seed: 7, side: -1, lead: 0.8, jitter: 0.5, spread: 0.8 },
  ),
  hairInner: coil(
    [[106, 198], [122, 168], [164, 152], [208, 160], [252, 150], [290, 168], [306, 200]],
    { loops: 9, r: 11, seed: 3, side: 1, lead: 0.75, jitter: 0.5, spread: 0.8 },
  ),
  hairCurls: [
    coil([[128, 140], [150, 118], [180, 108]], { loops: 3, r: 11, seed: 21, side: -1, lead: 0.8, jitter: 0.5 }),
    coil([[222, 104], [252, 112], [276, 132]], { loops: 3, r: 10, seed: 22, side: -1, lead: 0.8, jitter: 0.5 }),
  ],
  lensL: ring(160, 233, 33, 4),
  lensR: ring(250, 229, 32, 9),
  bridge: smooth([[193, 229], [205, 219], [218, 227]]),
  armL: smooth([[127, 231], [105, 227]]),
  armR: smooth([[282, 225], [304, 220]]),
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
  dome: "M114 146C108 96 148 70 206 68C264 66 304 94 302 144C252 130 162 130 114 146Z",
  domeLine: smooth([[112, 146], [114, 108], [146, 80], [206, 68], [262, 72], [294, 96], [303, 142]]),
  band: smooth([[108, 150], [158, 136], [208, 131], [258, 134], [308, 147]]),
  seam: smooth([[206, 70], [201, 100], [204, 130]]),
  stem: smooth([[206, 68], [206, 44]]),
  bladeL: smooth([[203, 40], [176, 28], [148, 28], [144, 40], [172, 47], [203, 42]]),
  bladeR: smooth([[209, 40], [238, 30], [266, 33], [268, 45], [240, 49], [209, 43]]),
  blue: smooth([[124, 128], [138, 98], [170, 80]]),
};
