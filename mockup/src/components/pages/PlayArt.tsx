import { useId, type CSSProperties, type ReactNode } from "react";

/**
 * Generated placeholder art for playground items without a real asset.
 * One distinct composition per id, coloured by the tile's tone through the
 * --pp-bg / --pp-fg / --pp-ac / --pp-soft variables set on `.pp[data-tone]`.
 * Anything that loops carries data-anim so it pauses off screen and stops under
 * reduced motion (see pages.css).
 */
export function PlayArt({ id, title }: { id: string; title: string }) {
  const Art = ART[id];
  if (Art) return <Art />;
  return (
    <Svg>
      <text x="200" y="210" textAnchor="middle" fontSize="28" fill="var(--pp-fg)">
        {title}
      </text>
    </Svg>
  );
}

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

function Svg({ children, crayon }: { children: ReactNode; crayon?: boolean }) {
  return (
    <svg className="pp-svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" aria-hidden>
      {crayon ? <g filter="url(#crayon)">{children}</g> : children}
    </svg>
  );
}

/* ------------------------------------------------------------------ */

function ShardRouter() {
  const shards = [72, 152, 232, 312];
  return (
    <Svg>
      <g fill="none" stroke="var(--pp-fg)" strokeWidth="2" strokeLinecap="round">
        <path d="M14 200h46" strokeDasharray="4 6" />
        {shards.map((y) => (
          <path key={y} d={`M170 200C220 200 220 ${y + 18} 268 ${y + 18}`} opacity="0.35" />
        ))}
      </g>
      <rect x="60" y="160" width="110" height="80" rx="14" fill="var(--pp-fg)" />
      <text x="115" y="194" textAnchor="middle" fontSize="16" fill="var(--pp-bg)" className="pp-mono">
        hash(key)
      </text>
      <text x="115" y="218" textAnchor="middle" fontSize="16" fill="var(--pp-soft)" className="pp-mono">
        % 4
      </text>
      <text x="14" y="186" fontSize="12" fill="var(--pp-fg)" opacity="0.7" className="pp-mono">
        user:42
      </text>
      {shards.map((y, n) => (
        <g key={y}>
          <path d={`M268 ${y}v36a40 9 0 0 0 80 0v-36`} fill="var(--pp-soft)" stroke="var(--pp-fg)" strokeWidth="2" />
          <ellipse cx="308" cy={y} rx="40" ry="9" fill="var(--pp-bg)" stroke="var(--pp-fg)" strokeWidth="2" />
          <text x="308" y={y + 32} textAnchor="middle" fontSize="12" fill="var(--pp-fg)" className="pp-mono">
            shard {n}
          </text>
          <circle
            cx="170"
            cy="200"
            r="6"
            fill="var(--pp-ac)"
            className="pp-dot"
            data-anim=""
            style={v({ "--dx": "98px", "--dy": `${y + 18 - 200}px`, "--n": n })}
          />
        </g>
      ))}
    </Svg>
  );
}

const TICKERS = [
  ["NKAY", "182.40", "▲0.6", "up"],
  ["MIZU", "41.07", "▼0.2", "dn"],
  ["TUXX", "9.88", "▲1.4", "up"],
  ["SIMX", "73.15", "▲0.1", "up"],
  ["KAFK", "120.02", "▼0.9", "dn"],
  ["HASH", "64.00", "▲0.3", "up"],
] as const;

function TickStream() {
  const row = (k: string) => (
    <div className="pp-tape-row pp-mono" data-anim="" key={k} aria-hidden>
      {[...TICKERS, ...TICKERS].map(([s, p, d, c], i) => (
        <span key={i}>
          <b>{s}</b> {p} <i className={c}>{d}</i>
        </span>
      ))}
    </div>
  );
  return (
    <>
      <p className="pp-label pp-mono">topic: ticks · simulated</p>
      <div className="pp-tape">{row("a")}</div>
      <div className="pp-offsets pp-mono">
        <div>
          <span>offset 4011</span>
          <em>written · committed</em>
        </div>
        <div>
          <span>offset 4012</span>
          <em>written · committed</em>
        </div>
      </div>
    </>
  );
}

function LabMap() {
  const hosts = [
    { x: 80, y: 90, a: "ns1", b: "BIND" },
    { x: 320, y: 90, a: "ca", b: "TLS" },
    { x: 60, y: 230, a: "nfs", b: "/home" },
    { x: 340, y: 230, a: "mail", b: "sendmail" },
    { x: 120, y: 330, a: "obsd", b: "OpenBSD" },
    { x: 280, y: 330, a: "fbsd", b: "FreeBSD" },
  ];
  const gid = `pp-grid${useId().replace(/:/g, "")}`;
  return (
    <Svg>
      <defs>
        <pattern id={gid} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="var(--pp-fg)" strokeOpacity="0.08" />
        </pattern>
      </defs>
      <rect x="-200" y="-200" width="800" height="800" fill={`url(#${gid})`} />
      {hosts.map((h) => (
        <path key={h.a} d={`M200 200L${h.x} ${h.y}`} stroke="var(--pp-fg)" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5" />
      ))}
      <g className="pp-pulse" data-anim="">
        <circle cx="200" cy="200" r="46" fill="var(--pp-ac)" />
        <text x="200" y="198" textAnchor="middle" fontSize="15" fill="#fff" className="pp-mono">
          ldap
        </text>
        <text x="200" y="216" textAnchor="middle" fontSize="11" fill="#fff" opacity="0.85" className="pp-mono">
          directory
        </text>
      </g>
      {hosts.map((h) => (
        <g key={h.a}>
          <rect x={h.x - 44} y={h.y - 22} width="88" height="44" rx="8" fill="var(--pp-bg)" stroke="var(--pp-fg)" strokeWidth="2" />
          <text x={h.x} y={h.y - 3} textAnchor="middle" fontSize="13" fill="var(--pp-fg)" className="pp-mono">
            {h.a}
          </text>
          <text x={h.x} y={h.y + 13} textAnchor="middle" fontSize="10" fill="var(--pp-fg)" opacity="0.6" className="pp-mono">
            {h.b}
          </text>
        </g>
      ))}
    </Svg>
  );
}

function RatingBadge() {
  const rows = [
    ["Intro to Programming", "MW 9:00", "4.6", "hi"],
    ["Data Structures", "TTh 11:30", "3.9", "mid"],
    ["Discrete Math", "F 13:00", "4.2", "hi"],
  ];
  return (
    <div className="pp-reg">
      {rows.map(([c, t, r, tone], n) => (
        <div className="pp-reg-row" key={c}>
          <b>{c}</b>
          <span className="muted">{t}</span>
          <span className="pp-chip" data-anim="" data-tone={tone} style={v({ "--n": n })}>
            ★ {r}
          </span>
        </div>
      ))}
    </div>
  );
}

function ScrollRoll() {
  return (
    <div className="pp-roll3d">
      {[0, 1, 2].map((n) => (
        <div className="pp-sheet" data-anim="" key={n} style={v({ "--n": n })}>
          <i />
          <i />
          <i />
          <i />
        </div>
      ))}
    </div>
  );
}

function CursorTrail() {
  const d = "M40 300C80 250 70 190 120 200S150 290 190 250 210 140 250 160 290 230 330 140";
  return (
    <Svg>
      <g filter="url(#crayon)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} pathLength={1} stroke="var(--pp-fg)" strokeWidth="10" className="pp-draw" data-anim="" />
        <path d="M46 318C90 270 80 214 126 220" pathLength={1} stroke="#e5391f" strokeWidth="5" className="pp-draw" data-anim="" opacity="0.8" />
        <path d="M258 178C292 238 300 196 336 158" pathLength={1} stroke="#1f4fd1" strokeWidth="5" className="pp-draw" data-anim="" opacity="0.8" />
      </g>
      <g className="pp-cursor" data-anim="">
        <path d="M330 140l0 44 12-12 9 20 8-4-9-19 17-1z" fill="var(--pp-fg)" stroke="var(--pp-bg)" strokeWidth="3" strokeLinejoin="round" />
      </g>
    </Svg>
  );
}

function RateLimiter() {
  const ips = ["10.0.0.4", "10.0.0.7", "10.0.0.9"];
  return (
    <>
      <p className="pp-label pp-mono">per-IP token buckets</p>
      <span className="pp-429 pp-mono" data-anim="">
        429
      </span>
      <div className="pp-buckets">
        {ips.map((ip, n) => (
          <div className="pp-bucket" key={ip} data-full={n === 2 ? "" : undefined}>
            <div className="pp-bucket-glass">
              <span data-anim="" style={v({ "--n": n })} />
            </div>
            <small className="pp-mono">{ip}</small>
          </div>
        ))}
      </div>
    </>
  );
}

function MenuBoard() {
  const items = ["Wonton soup", "Chow mein", "Orange chicken", "Fried rice", "Egg rolls"];
  return (
    <div className="pp-menu">
      <h3>Minh Ky</h3>
      <p>today’s specials</p>
      <ul>
        {items.map((i) => (
          <li key={i}>
            <span>{i}</span>
            <span>✦</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Digits() {
  return (
    <span data-anim="">
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i}>{i}</span>
      ))}
    </span>
  );
}

function PostCounter() {
  return (
    <div className="pp-counter">
      <div className="pp-odo" aria-hidden>
        <span>54,</span>
        <span className="pp-roll" data-speed="3">
          <Digits />
        </span>
        <span className="pp-roll" data-speed="2">
          <Digits />
        </span>
        <span className="pp-roll" data-speed="1">
          <Digits />
        </span>
      </div>
      <small>posts a month</small>
      <div className="pp-counter-bar">
        <span data-anim="" />
      </div>
    </div>
  );
}

function CertChain() {
  const leaf = [
    { x: 92, label: "ldap.lab" },
    { x: 308, label: "mail.lab" },
  ];
  return (
    <Svg>
      <g fill="none" stroke="var(--pp-fg)" strokeWidth="2" opacity="0.5">
        {leaf.map((l) => (
          <path key={l.x} d={`M200 162C200 210 ${l.x} 200 ${l.x} 236`} strokeDasharray="6 6" />
        ))}
      </g>
      <Cert x={130} y={64} w={140} title="Lab Root CA" sub="self-signed" seal />
      {leaf.map((l) => (
        <Cert key={l.x} x={l.x - 62} y={236} w={124} title={l.label} sub="issued by lab CA" />
      ))}
      <g className="pp-pulse" data-anim="">
        <circle cx="252" cy="148" r="16" fill="var(--pp-ac)" />
        <path d="M244 160l-4 18 12-6 12 6-4-18" fill="var(--pp-ac)" />
      </g>
    </Svg>
  );
}

function Cert({ x, y, w, title, sub, seal }: { x: number; y: number; w: number; title: string; sub: string; seal?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="98" rx="8" fill="var(--pp-soft)" stroke="var(--pp-fg)" strokeOpacity="0.4" strokeWidth="1.5" />
      <rect x={x + 8} y={y + 8} width={w - 16} height="82" rx="4" fill="none" stroke="var(--pp-fg)" strokeOpacity="0.2" />
      <text x={x + w / 2} y={y + 38} textAnchor="middle" fontSize="15" fill="var(--pp-fg)" fontWeight="500">
        {title}
      </text>
      <text x={x + w / 2} y={y + 58} textAnchor="middle" fontSize="10" fill="var(--pp-fg)" opacity="0.6" className="pp-mono">
        {sub}
      </text>
      {!seal && <rect x={x + 24} y={y + 70} width={w - 48} height="4" rx="2" fill="var(--pp-fg)" opacity="0.25" />}
    </g>
  );
}

function CheckoutFlow() {
  return (
    <div className="pp-flow">
      <div className="pp-phone">
        <b>Cart</b>
        <i />
        <i />
        <div className="btn">Checkout</div>
        <span className="pp-tap" data-anim="" />
      </div>
      <div className="pp-phone">
        <b>Pay</b>
        <i />
        <div className="btn">Pay</div>
        <span className="pp-tap" data-anim="" />
      </div>
      <div className="pp-phone">
        <b>Paid</b>
        <div className="ok">✓</div>
      </div>
    </div>
  );
}

function CrayonKit() {
  const crayons = [
    { c: "#141412", y: 104, r: -8 },
    { c: "#e5391f", y: 150, r: -4 },
    { c: "#1f4fd1", y: 196, r: -10 },
  ];
  return (
    <Svg>
      {crayons.map((k) => (
        <g key={k.c} transform={`rotate(${k.r} 120 ${k.y})`}>
          <rect x="40" y={k.y - 13} width="150" height="26" rx="5" fill={k.c} />
          <rect x="74" y={k.y - 13} width="74" height="26" fill="#fff" opacity="0.18" />
          <path d={`M190 ${k.y - 13}L222 ${k.y}L190 ${k.y + 13}Z`} fill={k.c} />
        </g>
      ))}
      <g filter="url(#crayon)" fill="none" strokeLinecap="round">
        <path d="M244 110C270 96 300 128 340 104" stroke="#141412" strokeWidth="10" />
        <path d="M244 158C276 142 306 172 346 150" stroke="#e5391f" strokeWidth="10" />
        <path d="M244 206C272 192 300 222 344 198" stroke="#1f4fd1" strokeWidth="10" />
      </g>
      <g className="pp-mono" fontSize="12" fill="var(--pp-fg)">
        <text x="40" y="282">feTurbulence</text>
        <text x="40" y="302" opacity="0.7">
          → feDisplacementMap
        </text>
        <text x="40" y="322" opacity="0.5">
          → grain mask
        </text>
      </g>
    </Svg>
  );
}

function MailRoute() {
  const stops = [
    { x: 70, y: 110, a: "alice@obsd", b: "sender" },
    { x: 290, y: 110, a: "sendmail", b: "FreeBSD" },
    { x: 290, y: 280, a: "dovecot", b: "IMAP" },
    { x: 70, y: 280, a: "desktop", b: "TLS" },
  ];
  return (
    <Svg>
      <path d="M70 110H290V280H70" fill="none" stroke="var(--pp-fg)" strokeWidth="2" strokeDasharray="6 7" opacity="0.45" />
      {stops.map((s) => (
        <g key={s.a}>
          <rect x={s.x - 58} y={s.y - 26} width="116" height="52" rx="10" fill="var(--pp-bg)" stroke="var(--pp-fg)" strokeWidth="2" />
          <text x={s.x} y={s.y - 3} textAnchor="middle" fontSize="13" fill="var(--pp-fg)" className="pp-mono">
            {s.a}
          </text>
          <text x={s.x} y={s.y + 14} textAnchor="middle" fontSize="10" fill="var(--pp-fg)" opacity="0.6" className="pp-mono">
            {s.b}
          </text>
        </g>
      ))}
      <g
        className="pp-env"
        data-anim=""
        style={v({ "--x1": "220px", "--y1": "0px", "--x2": "220px", "--y2": "170px", "--x3": "0px", "--y3": "170px" })}
      >
        <g transform="translate(52 52)">
          <rect width="36" height="26" rx="3" fill="var(--pp-ac)" />
          <path d="M2 3l16 12 16-12" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>
      <g transform="translate(184 186)">
        <rect x="-4" y="6" width="24" height="18" rx="3" fill="var(--pp-fg)" />
        <path d="M2 6V1a6 6 0 0 1 12 0v5" fill="none" stroke="var(--pp-fg)" strokeWidth="3" />
      </g>
    </Svg>
  );
}

const ART: Record<string, () => React.JSX.Element> = {
  "shard-router": ShardRouter,
  "tick-stream": TickStream,
  "ldap-map": LabMap,
  "rmp-badge": RatingBadge,
  "scroll-roll": ScrollRoll,
  "cursor-fx": CursorTrail,
  "rate-limiter": RateLimiter,
  "menu-board": MenuBoard,
  "post-counter": PostCounter,
  "cert-chain": CertChain,
  "checkout-flow": CheckoutFlow,
  "crayon-kit": CrayonKit,
  "mail-route": MailRoute,
};
