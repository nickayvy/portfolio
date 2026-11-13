import { hatch, smooth, type Pt } from "./geom";

/** Pink for Mizu's tag and the cats' noses: crayon red rubbed thin over paper. */
export const PINK = "var(--cat-pink)";

const mirror = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [400 - x, y] as Pt).reverse();

/** Cat head outline (no ears) as a closed polygon in a 400×400 box. */
const HEAD: Pt[] = [
  [170, 128], [200, 123], [230, 128], [298, 170], [314, 230], [298, 288], [252, 322], [200, 333],
  [148, 322], [102, 288], [86, 230], [102, 170],
];

const EAR_L: Pt[] = [[100, 178], [94, 72], [166, 126]];
const EAR_R: Pt[] = mirror(EAR_L);
const EAR_IN_L: Pt[] = [[110, 158], [106, 98], [148, 130]];
const EAR_IN_R: Pt[] = mirror(EAR_IN_L);

/** Shared face parts. Eyes sit at (158, 226) and (242, 226). */
export const CAT = {
  head: smooth(HEAD, true),
  earL: smooth(EAR_L, false, 0.4),
  earR: smooth(EAR_R, false, 0.4),
  nose: "M188 258Q200 254 212 258Q206 268 200 270Q194 268 188 258Z",
  mouth: smooth([[172, 286], [186, 292], [200, 276], [214, 292], [228, 286]]),
  whiskersL: "M120 262L56 250M122 280L60 290",
  whiskersR: "M280 262L344 250M278 280L340 290",
  eyeL: "M130 226Q158 198 186 226Q158 248 130 226Z",
  eyeR: "M214 226Q242 198 270 226Q242 248 214 226Z",
  sleepL: smooth([[136, 228], [158, 240], [180, 230]]),
  sleepR: smooth([[220, 230], [242, 240], [264, 228]]),
  collar: smooth([[124, 318], [160, 338], [200, 344], [240, 338], [276, 318]]),
  tagRing: "M200 346v6",
};

/** A soft egg shape, wider at the top (where the mask reaches the eyes). */
function blob(cx: number, cy: number, rx: number, ry: number, egg: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const s = Math.sin(a);
    pts.push([cx + Math.cos(a) * rx * (1 - egg * s), cy + s * ry]);
  }
  return pts;
}

/** Siamese: colourpoint mask scribbled in around eyes and muzzle, dark ear insides. */
export const SIAMESE = {
  mask: hatch(blob(200, 250, 70, 58, 0.22), { angle: -28, gap: 10, seed: 4 }),
  earL: hatch(EAR_IN_L, { angle: 70, gap: 10, seed: 6 }),
  earR: hatch(EAR_IN_R, { angle: -70, gap: 10, seed: 7 }),
};

/** Tuxedo: black scribble everywhere except a white blaze and muzzle. */
const BLAZE_L: Pt[] = [
  [102, 170], [170, 128], [200, 123], [200, 186], [194, 214], [180, 250], [152, 266], [132, 296], [148, 322], [102, 288], [86, 230],
];
export const TUXEDO = {
  left: hatch(BLAZE_L, { angle: -38, gap: 9, seed: 11 }),
  right: hatch(mirror(BLAZE_L), { angle: 38, gap: 9, seed: 12 }),
  earL: hatch([[102, 172], [96, 78], [160, 128]], { angle: 70, gap: 8, seed: 13 }),
  earR: hatch(mirror([[102, 172], [96, 78], [160, 128]]), { angle: -70, gap: 8, seed: 14 }),
  blaze: smooth([[200, 186], [194, 214], [180, 250], [152, 266], [132, 296]]),
  blazeR: smooth([[200, 186], [206, 214], [220, 250], [248, 266], [268, 296]]),
};

/**
 * Mizu sitting upright, below a SiameseHead, in the same 400-unit space
 * (head chin at y≈333, ground at y=540).
 */
export const MIZU_BODY = {
  left: smooth([[130, 316], [94, 376], [72, 452], [78, 510], [104, 538]]),
  right: smooth([[270, 316], [306, 376], [328, 452], [322, 510], [298, 538]]),
  legL: smooth([[170, 396], [166, 468], [162, 524]]),
  legR: smooth([[230, 396], [234, 468], [238, 524]]),
  pawL: "M140 538C138 522 160 516 174 524C182 530 180 540 172 541Z",
  pawR: "M228 541C220 540 218 530 226 524C240 516 262 522 260 538Z",
  tuft: "M178 352l11 13 11-13 11 13 11-13",
  tail: smooth([[300, 528], [350, 538], [394, 520], [414, 478], [406, 440], [388, 424]]),
  blue: smooth([[70, 420], [54, 472], [62, 526]]),
  fill: smooth([[130, 300], [94, 376], [72, 452], [78, 510], [104, 540], [296, 540], [322, 510], [328, 452], [306, 376], [270, 300]], true),
};

/** The tuxedo cat curled up asleep, in footer-scene units (ground at y=340). */
const CURL: Pt[] = [
  [486, 300], [512, 289], [548, 288], [578, 298], [592, 316], [588, 334], [560, 341], [520, 341], [490, 338],
];
export const TUX_CURL = {
  body: smooth(CURL, true),
  fur: hatch(CURL, { angle: -48, gap: 8, seed: 31 }),
  tail: smooth([[588, 326], [578, 342], [544, 348], [510, 347], [488, 342]]),
  pawL: "M478 338c-2-8 14-10 20-4c3 4 0 8-5 8Z",
  pawR: "M500 340c-1-8 15-9 19-3c2 4-1 7-6 7Z",
};
