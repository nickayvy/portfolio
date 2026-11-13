/**
 * Small SVG building blocks for the generated project covers.
 * Every cover is drawn in a 1200×800 viewBox (3:2) and sliced to fill its frame.
 * Raw hex is allowed here: covers are illustrative product shots, theme independent.
 */
import type { ReactNode } from "react";

export const W = 1200;
export const H = 800;

export const SANS = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Inter, 'Helvetica Neue', Arial, sans-serif";
export const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

/** Shared <defs>: a soft drop shadow and a grain, namespaced by `id`. */
export function Defs({ id, children }: { id: string; children?: ReactNode }) {
  return (
    <defs>
      <filter id={`${id}-sh`} x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="0" dy="22" stdDeviation="24" floodColor="#0b0b0a" floodOpacity="0.22" />
      </filter>
      <filter id={`${id}-sh2`} x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0b0b0a" floodOpacity="0.18" />
      </filter>
      {children}
    </defs>
  );
}

export function T({
  x,
  y,
  size = 20,
  weight = 500,
  fill = "#141412",
  anchor = "start",
  mono = false,
  opacity,
  children,
}: {
  x: number;
  y: number;
  size?: number;
  weight?: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  mono?: boolean;
  opacity?: number;
  children: ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      textAnchor={anchor}
      opacity={opacity}
      fontFamily={mono ? MONO : SANS}
      letterSpacing={mono ? 0 : -0.02 * size}
    >
      {children}
    </text>
  );
}

/** A grey text placeholder bar. */
export function Bar({ x, y, w, h = 10, fill = "#141412", o = 0.12 }: { x: number; y: number; w: number; h?: number; fill?: string; o?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} opacity={o} />;
}

/** A pill chip with a label. */
export function Chip({
  x,
  y,
  label,
  fill = "#ffffff",
  ink = "#141412",
  size = 18,
  dot,
  shadow,
}: {
  x: number;
  y: number;
  label: string;
  fill?: string;
  ink?: string;
  size?: number;
  dot?: string;
  shadow?: string;
}) {
  const w = label.length * size * 0.56 + (dot ? 50 : 34);
  const h = size * 2.2;
  return (
    <g filter={shadow ? `url(#${shadow})` : undefined}>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} />
      {dot ? <circle cx={x + 22} cy={y + h / 2} r={6} fill={dot} /> : null}
      <T x={x + (dot ? 36 : 17)} y={y + h / 2 + size * 0.36} size={size} fill={ink}>
        {label}
      </T>
    </g>
  );
}

/** Desktop browser / app window chrome. */
export function Win({
  x,
  y,
  w,
  h,
  dark = false,
  url,
  shadow,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  dark?: boolean;
  url?: string;
  shadow?: string;
  children?: ReactNode;
}) {
  const bg = dark ? "#15181d" : "#ffffff";
  const bar = dark ? "#1d2127" : "#f3f1ec";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={18} fill={bg} filter={shadow ? `url(#${shadow})` : undefined} />
      <path d={`M${x} ${y + 18}a18 18 0 0 1 18-18h${w - 36}a18 18 0 0 1 18 18v28h-${w}z`} fill={bar} />
      <circle cx={x + 24} cy={y + 23} r={6} fill="#ff6159" />
      <circle cx={x + 44} cy={y + 23} r={6} fill="#ffbd2e" />
      <circle cx={x + 64} cy={y + 23} r={6} fill="#28c941" />
      {url ? (
        <g>
          <rect x={x + w / 2 - 150} y={y + 11} width={300} height={24} rx={8} fill={dark ? "#0f1115" : "#e7e3db"} />
          <T x={x + w / 2} y={y + 28} size={13} anchor="middle" fill={dark ? "#8b93a1" : "#7a756b"} weight={400}>
            {url}
          </T>
        </g>
      ) : null}
      {children}
    </g>
  );
}

/** A phone body; children are drawn in screen coordinates starting at (x, y). */
export function Phone({ x, y, w = 300, h = 620, shadow, screen = "#ffffff", children }: { x: number; y: number; w?: number; h?: number; shadow?: string; screen?: string; children?: ReactNode }) {
  return (
    <g>
      <rect x={x - 12} y={y - 12} width={w + 24} height={h + 24} rx={52} fill="#141412" filter={shadow ? `url(#${shadow})` : undefined} />
      <rect x={x} y={y} width={w} height={h} rx={42} fill={screen} />
      {children}
      <rect x={x + w / 2 - 50} y={y + 12} width={100} height={28} rx={14} fill="#141412" />
    </g>
  );
}

/** Soft background with a two-stop gradient and light pools. */
export function Backdrop({ id, from, to, glow = "#ffffff", glowO = 0.35 }: { id: string; from: string; to: string; glow?: string; glowO?: number }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.3" cy="0.2" r="0.7">
          <stop offset="0" stopColor={glow} stopOpacity={glowO} />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-bg)`} />
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
    </g>
  );
}

/** Thin grid lines (blueprints, terminals). */
export function Grid({ step = 40, color = "#ffffff", o = 0.07 }: { step?: number; color?: string; o?: number }) {
  const lines: ReactNode[] = [];
  for (let x = step; x < W; x += step) lines.push(<line key={`x${x}`} x1={x} y1={0} x2={x} y2={H} />);
  for (let y = step; y < H; y += step) lines.push(<line key={`y${y}`} x1={0} y1={y} x2={W} y2={y} />);
  return (
    <g stroke={color} strokeOpacity={o} strokeWidth={1}>
      {lines}
    </g>
  );
}

export function Arrow({ x1, y1, x2, y2, color = "#ffffff", o = 0.7, dash }: { x1: number; y1: number; x2: number; y2: number; color?: string; o?: number; dash?: string }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const s = 10;
  const p1 = `${x2 - s * Math.cos(a - 0.5)},${y2 - s * Math.sin(a - 0.5)}`;
  const p2 = `${x2 - s * Math.cos(a + 0.5)},${y2 - s * Math.sin(a + 0.5)}`;
  return (
    <g stroke={color} strokeOpacity={o} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1={x1} y1={y1} x2={x2} y2={y2} strokeDasharray={dash} />
      <polyline points={`${p1} ${x2},${y2} ${p2}`} />
    </g>
  );
}
