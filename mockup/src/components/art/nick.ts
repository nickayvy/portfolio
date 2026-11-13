import { coil, rng, scribbleFill, smooth, type Pt } from "./geom";

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

/** Outline of Nick's mop: heavy on top, short at the sides, fringe dipping over the brow. */
const MOP: Pt[] = [
  [100, 204], [88, 172], [94, 134], [118, 104], [156, 80], [206, 68], [254, 74], [290, 96], [312, 130], [318, 166], [306, 198],
  [284, 190], [262, 182], [246, 194], [224, 186], [204, 200], [182, 190], [160, 200], [140, 188], [118, 198],
];

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
  /** dense dark mop: scribbled fill, a lumpy outline of bigger curls, a few strays */
  hairFill: scribbleFill(MOP, { r: 10, gap: 12, angle: -10, seed: 4 }),
  hairOuter: coil(
    [[100, 204], [88, 172], [94, 134], [118, 104], [156, 80], [206, 68], [254, 74], [290, 96], [312, 130], [318, 166], [308, 198]],
    { loops: 10, r: 11, seed: 7, side: -1, lead: 0.9, jitter: 0.9, spread: 1.3 },
  ),
  hairInner: coil(
    [[114, 194], [140, 186], [168, 196], [196, 186], [222, 198], [252, 184], [282, 190], [302, 200]],
    { loops: 8, r: 9, seed: 3, side: 1, lead: 0.8, jitter: 0.5, spread: 0.7 },
  ),
  hairCurls: [
    spiral(132, 74, 13, 31),
    spiral(232, 52, 12, 32),
    spiral(326, 140, 11, 33),
    spiral(102, 214, 9, 34),
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
  blueHair: smooth([[80, 192], [72, 150], [86, 110], [112, 82]]),
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
