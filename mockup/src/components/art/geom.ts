/**
 * Small, deterministic geometry helpers for the crayon drawings.
 * Everything here runs once at module load and returns plain path strings,
 * rounded to one decimal so server and client markup always match.
 */

export type Pt = readonly [number, number];

const r1 = (n: number) => Math.round(n * 10) / 10;

/** mulberry32: tiny seeded PRNG so "random" jitter is identical on every render. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Catmull-Rom spline through the points, emitted as cubic Béziers. */
export function smooth(pts: readonly Pt[], closed = false, tension = 1): string {
  const n = pts.length;
  if (n < 2) return "";
  const p = (i: number): Pt => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  const segs = closed ? n : n - 1;
  const k = tension / 6;
  for (let i = 0; i < segs; i++) {
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) * k;
    const c1y = p1[1] + (p2[1] - p0[1]) * k;
    const c2x = p2[0] - (p3[0] - p1[0]) * k;
    const c2y = p2[1] - (p3[1] - p1[1]) * k;
    d += `C${r1(c1x)} ${r1(c1y)} ${r1(c2x)} ${r1(c2y)} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return closed ? d + "Z" : d;
}

/** Sample a Catmull-Rom curve through `pts` into a dense polyline. */
export function sample(pts: readonly Pt[], perSeg = 16): Pt[] {
  const out: Pt[] = [];
  const n = pts.length;
  const p = (i: number) => pts[Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < n - 1; i++) {
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    for (let s = 0; s < perSeg; s++) {
      const t = s / perSeg, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[n - 1]);
  return out;
}

function arcLengths(poly: readonly Pt[]) {
  const L = [0];
  for (let i = 1; i < poly.length; i++) {
    L.push(L[i - 1] + Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]));
  }
  return L;
}

function at(poly: readonly Pt[], L: number[], s: number) {
  let i = 1;
  while (i < L.length - 1 && L[i] < s) i++;
  const seg = L[i] - L[i - 1] || 1;
  const t = Math.max(0, Math.min(1, (s - L[i - 1]) / seg));
  const a = poly[i - 1], b = poly[i];
  const tx = (b[0] - a[0]) / seg, ty = (b[1] - a[1]) / seg;
  return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, tx, ty };
}

/**
 * A loopy "curly hair" scribble: the pen travels along `guide` while circling,
 * so it leaves a chain of overlapping loops (like a run of cursive e's).
 * `side` flips which way the loops bulge relative to the direction of travel.
 */
export function coil(
  guide: readonly Pt[],
  opts: { loops: number; r: number; jitter?: number; seed?: number; squash?: number; side?: 1 | -1; lead?: number; spread?: number },
): string {
  const { loops, r, jitter = 0.25, seed = 1, squash = 1, side = 1, lead = 0.5, spread = 0.6 } = opts;
  const poly = sample(guide, 24);
  const L = arcLengths(poly);
  const total = L[L.length - 1];
  const rand = rng(seed);
  // uneven loop spacing and size so it reads as a hand, not a spring
  const w: number[] = [];
  for (let k = 0; k < loops; k++) w.push(1 - spread / 2 + rand() * spread);
  const wsum = w.reduce((m, n) => m + n, 0);
  const cum = [0];
  for (let k = 0; k < loops; k++) cum.push(cum[k] + w[k] / wsum);
  const sizes = w.map(() => r * (1 - jitter / 2 + rand() * jitter));
  const steps = loops * 12;
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const k = Math.min(loops - 1, Math.floor(i / 12));
    const f = (i - k * 12) / 12;
    // blend radius between neighbouring loops so the line stays continuous
    const rr = sizes[k] * (1 - f) + (sizes[k + 1] ?? sizes[k]) * f;
    const g = at(poly, L, (cum[k] + f * (cum[k + 1] - cum[k])) * total);
    const th = f * Math.PI * 2 - Math.PI / 2;
    const nx = -g.ty * side, ny = g.tx * side;
    const along = Math.cos(th) * rr * lead * -1;
    const out = (Math.sin(th) + 1) * rr * squash;
    pts.push([g.x + g.tx * along + nx * out, g.y + g.ty * along + ny * out]);
  }
  return smooth(pts);
}

/**
 * A zig-zag scribble that fills a polygon, like shading with the side of a crayon.
 * Lines run at `angle` degrees, `gap` apart, and alternate direction (boustrophedon).
 */
export function hatch(poly: readonly Pt[], opts: { angle?: number; gap?: number; seed?: number; inset?: number } = {}): string {
  const { angle = -35, gap = 9, seed = 3, inset = 0 } = opts;
  const rand = rng(seed);
  const a = (angle * Math.PI) / 180;
  const ca = Math.cos(a), sa = Math.sin(a);
  // rotate polygon so hatch lines are horizontal
  const rp = poly.map(([x, y]) => [x * ca + y * sa, -x * sa + y * ca] as Pt);
  const ys = rp.map((p) => p[1]);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const pts: Pt[] = [];
  let flip = false;
  for (let y = minY + gap * 0.6; y < maxY - gap * 0.3; y += gap) {
    const xs: number[] = [];
    for (let i = 0; i < rp.length; i++) {
      const p = rp[i], q = rp[(i + 1) % rp.length];
      if ((p[1] <= y && q[1] > y) || (q[1] <= y && p[1] > y)) {
        xs.push(p[0] + ((y - p[1]) / (q[1] - p[1])) * (q[0] - p[0]));
      }
    }
    if (xs.length < 2) continue;
    xs.sort((m, n) => m - n);
    let x0 = xs[0] + inset, x1 = xs[xs.length - 1] - inset;
    if (x1 - x0 < 2) continue;
    x0 += (rand() - 0.5) * gap * 0.5;
    x1 += (rand() - 0.5) * gap * 0.5;
    const yy = y + (rand() - 0.5) * gap * 0.3;
    const row: Pt[] = flip ? [[x1, yy], [x0, yy]] : [[x0, yy], [x1, yy]];
    pts.push(...row);
    flip = !flip;
  }
  // rotate back
  const back = pts.map(([x, y]) => [x * ca - y * sa, x * sa + y * ca] as Pt);
  if (!back.length) return "";
  return back.map((p, i) => `${i ? "L" : "M"}${r1(p[0])} ${r1(p[1])}`).join("");
}

/**
 * Dense, messy scribble that fills a polygon with rows of tight overlapping loops,
 * like scrubbing curly hair in with a crayon. Rows run at `angle` degrees, `gap` apart.
 */
export function scribbleFill(
  poly: readonly Pt[],
  opts: { r?: number; gap?: number; angle?: number; seed?: number; inset?: number } = {},
): string {
  const { r = 10, gap = 13, angle = -12, seed = 5, inset = 4 } = opts;
  const rand = rng(seed);
  const a = (angle * Math.PI) / 180;
  const ca = Math.cos(a), sa = Math.sin(a);
  const rp = poly.map(([x, y]) => [x * ca + y * sa, -x * sa + y * ca] as Pt);
  const ys = rp.map((p) => p[1]);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const back = (x: number, y: number): Pt => [x * ca - y * sa, x * sa + y * ca];
  let d = "";
  let row = 0;
  for (let y = minY + r * 0.6; y < maxY - r * 0.2; y += gap, row++) {
    const xs: number[] = [];
    for (let i = 0; i < rp.length; i++) {
      const p = rp[i], q = rp[(i + 1) % rp.length];
      if ((p[1] <= y && q[1] > y) || (q[1] <= y && p[1] > y)) xs.push(p[0] + ((y - p[1]) / (q[1] - p[1])) * (q[0] - p[0]));
    }
    xs.sort((m, n) => m - n);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const x0 = xs[k] + inset + rand() * r * 0.6;
      const x1 = xs[k + 1] - inset - rand() * r * 0.6;
      const len = x1 - x0;
      if (len < r) continue;
      const yy = y - r + (rand() - 0.5) * r * 0.5;
      const flip = row % 2 === 1;
      const g: Pt[] = flip ? [back(x1, yy), back((x0 + x1) / 2, yy + (rand() - 0.5) * r), back(x0, yy)] : [back(x0, yy), back((x0 + x1) / 2, yy + (rand() - 0.5) * r), back(x1, yy)];
      d += coil(g, { loops: Math.max(1, Math.round(len / (r * 1.25))), r, seed: seed * 31 + row * 7 + k, side: flip ? -1 : 1, lead: 0.95, jitter: 0.5, spread: 0.7 });
    }
  }
  return d;
}
