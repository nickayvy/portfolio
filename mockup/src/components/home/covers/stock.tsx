/** stock-pipeline: terminal + ticker tape, shard router, gateway, offset commits. */
import { Arrow, Backdrop, Chip, Defs, Grid, T, Win } from "./parts";

const TICKS: [string, string, boolean][] = [
  ["ACME", "101.24", true],
  ["NOVA", "48.07", false],
  ["ORBT", "212.90", true],
  ["KITE", "17.36", true],
  ["MESA", "63.12", false],
  ["PIER", "88.45", true],
  ["SURF", "9.81", false],
];

const GREEN = "#3ddc84";
const RED = "#ff5f56";
const AMBER = "#ffbd2e";

function Tape({ y, offset = 0 }: { y: number; offset?: number }) {
  return (
    <g>
      <rect x={-10} y={y} width={1220} height={64} fill="#0a0c0f" />
      <line x1={0} x2={1200} y1={y} y2={y} stroke="#ffffff" strokeOpacity={0.08} />
      {[...TICKS, ...TICKS].map(([s, p, up], i) => (
        <g key={i} transform={`translate(${offset + i * 190} ${y + 40})`}>
          <text fontFamily="ui-monospace, Menlo, monospace" fontSize={20} fill="#e8e6e1">
            {s}
          </text>
          <text x={62} fontFamily="ui-monospace, Menlo, monospace" fontSize={20} fill={up ? GREEN : RED}>
            {p} {up ? "▲" : "▼"}
          </text>
        </g>
      ))}
    </g>
  );
}

function Box({ x, y, w, h, title, sub, accent = "#ffffff" }: { x: number; y: number; w: number; h: number; title: string; sub?: string; accent?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill="#15181d" stroke={accent} strokeOpacity={0.35} strokeWidth={2} />
      <T x={x + 22} y={y + 38} size={20} fill="#f1eee9">
        {title}
      </T>
      {sub ? (
        <T x={x + 22} y={y + 64} size={15} fill="#8b93a1" weight={400} mono>
          {sub}
        </T>
      ) : null}
    </g>
  );
}

export function StockCover({ id, slide }: { id: string; slide: number }) {
  const sh = `${id}-sh`;
  return (
    <>
      <Defs id={id} />
      <Backdrop id={id} from="#0b0d10" to="#1b2028" glow="#3ddc84" glowO={slide === 0 ? 0.08 : 0.05} />
      <Grid step={40} o={0.05} />
      {slide === 0 && (
        <g>
          <Win x={220} y={110} w={760} h={480} dark url="consumer — python" shadow={sh}>
            {[
              ["$ docker compose up ticks consumer gateway", "#8b93a1"],
              ["consumer[0] partition=2 offset=10482  write ok  commit ✓", GREEN],
              ["consumer[1] partition=0 offset=9917   write ok  commit ✓", GREEN],
              ["router      key=price:ACME → shard 3", "#e8e6e1"],
              ["router      key=user:204  → shard 0", "#e8e6e1"],
              ["consumer[0] partition=2 offset=10483  retry (no commit)", AMBER],
              ["consumer[0] partition=2 offset=10483  write ok  commit ✓", GREEN],
              ["gateway     429 Too Many Requests  ip=10.0.0.7", RED],
              ["router      key=pick:88  → shard 1", "#e8e6e1"],
            ].map(([l, c], i) => (
              <T key={i} x={250} y={110 + 92 + i * 40} size={17} fill={c} mono weight={400}>
                {l}
              </T>
            ))}
            <rect x={250} y={110 + 92 + 9 * 40 - 16} width={11} height={20} fill={GREEN} />
          </Win>
          <Tape y={660} />
        </g>
      )}
      {slide === 1 && (
        <g>
          <Box x={90} y={330} w={210} h={92} title="ticks" sub="kafka topic" accent={GREEN} />
          <Arrow x1={310} y1={376} x2={420} y2={376} />
          <Box x={430} y={318} w={260} h={116} title="consumer" sub="hash(key) % 4" accent="#7b97ff" />
          {[0, 1, 2, 3].map((i) => {
            const y = 150 + i * 140;
            return (
              <g key={i}>
                <path d={`M700 376 C760 376 780 ${y + 46} 860 ${y + 46}`} fill="none" stroke="#ffffff" strokeOpacity={0.4} strokeWidth={2.5} strokeDasharray={i === 3 ? undefined : "6 8"} />
                <Box x={870} y={y} w={240} h={92} title={`shard ${i}`} sub={["user:*", "pick:*", "price:*", "price:ACME"][i]} accent={i === 3 ? GREEN : "#ffffff"} />
                {[0, 1, 2, 3, 4].map((k) => (
                  <rect key={k} x={1040 + (k % 3) * 18} y={y + 22 + Math.floor(k / 3) * 18} width={12} height={12} rx={3} fill={i === 3 && k === 4 ? GREEN : "#ffffff"} opacity={i === 3 && k === 4 ? 1 : 0.25} />
                ))}
              </g>
            );
          })}
          <Chip x={430} y={470} label="deterministic routing" fill="#1d2127" ink="#e8e6e1" size={16} dot={GREEN} />
        </g>
      )}
      {slide === 2 && (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <circle cx={150} cy={190 + i * 105} r={26} fill="#1d2127" stroke="#ffffff" strokeOpacity={0.3} strokeWidth={2} />
              <T x={150} y={196 + i * 105} size={14} anchor="middle" fill="#8b93a1" mono weight={400}>
                ip{i + 1}
              </T>
              <Arrow x1={182} y1={190 + i * 105} x2={400} y2={400} o={i === 4 ? 0.9 : 0.35} color={i === 4 ? RED : "#ffffff"} />
            </g>
          ))}
          <rect x={410} y={250} width={300} height={300} rx={22} fill="#15181d" stroke="#ffffff" strokeOpacity={0.3} strokeWidth={2} filter={`url(#${sh})`} />
          <T x={440} y={300} size={24} fill="#f1eee9">
            nginx gateway
          </T>
          <T x={440} y={330} size={15} fill="#8b93a1" mono weight={400}>
            limit_req per IP
          </T>
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <rect key={k} x={445 + k * 40} y={380} width={30} height={120} rx={6} fill="#ffffff" opacity={0.08} />
          ))}
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={445 + k * 40} y={440 - k * 12} width={30} height={60 + k * 12} rx={6} fill={GREEN} opacity={0.85} />
          ))}
          <Arrow x1={720} y1={400} x2={850} y2={400} color={GREEN} o={0.9} />
          <rect x={860} y={320} width={250} height={160} rx={22} fill="#15181d" stroke={GREEN} strokeOpacity={0.5} strokeWidth={2} />
          <T x={890} y={378} size={24} fill="#f1eee9">
            FastAPI
          </T>
          <T x={890} y={410} size={15} fill="#8b93a1" mono weight={400}>
            /ticks /picks /users
          </T>
          <Chip x={418} y={590} label="429 for noisy neighbours" fill="#2a1414" ink="#ffb3ad" size={16} dot={RED} />
        </g>
      )}
      {slide >= 3 && (
        <g>
          <T x={140} y={210} size={22} fill="#8b93a1" weight={400}>
            partition 2 · offsets
          </T>
          {Array.from({ length: 9 }, (_, i) => {
            const state = i < 5 ? "done" : i === 5 ? "write" : "wait";
            const fill = state === "done" ? GREEN : state === "write" ? AMBER : "#2a2f37";
            return (
              <g key={i}>
                <rect x={140 + i * 106} y={250} width={96} height={130} rx={14} fill={fill} opacity={state === "wait" ? 1 : 0.9} />
                <T x={188 + i * 106} y={325} size={18} anchor="middle" fill={state === "wait" ? "#8b93a1" : "#0b0d10"} mono weight={600}>
                  {10478 + i}
                </T>
              </g>
            );
          })}
          <path d="M140 420 H 666" stroke={GREEN} strokeWidth={4} strokeLinecap="round" />
          <path d="M666 404 v32" stroke={GREEN} strokeWidth={4} strokeLinecap="round" />
          <T x={140} y={470} size={20} fill="#e8e6e1" weight={400}>
            committed only after the write succeeds
          </T>
          <Tape y={620} offset={-80} />
        </g>
      )}
    </>
  );
}
