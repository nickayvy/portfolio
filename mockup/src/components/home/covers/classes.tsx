/** class-assistant: registration table with rating chips, rating popover, extension popup. */
import { Backdrop, Bar, Chip, Defs, T, Win } from "./parts";

const ROWS: [string, string, string, number][] = [
  ["CPSC 131", "Data Structures", "Prof. A.", 4.6],
  ["CPSC 240", "Assembly", "Prof. B.", 3.1],
  ["CPSC 323", "Compilers", "Prof. C.", 4.2],
  ["CPSC 335", "Algorithms", "Prof. D.", 2.4],
  ["CPSC 351", "Operating Sys.", "Prof. E.", 3.8],
];

function chipColor(r: number) {
  return r >= 4 ? "#1f9d55" : r >= 3 ? "#e8a317" : "#e5391f";
}

function Rating({ x, y, r, big = false }: { x: number; y: number; r: number; big?: boolean }) {
  const w = big ? 120 : 66;
  const h = big ? 56 : 30;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={chipColor(r)} />
      <T x={x + w / 2} y={y + h * 0.68} size={big ? 28 : 16} anchor="middle" fill="#ffffff" weight={600}>
        {r.toFixed(1)}
      </T>
    </g>
  );
}

export function ClassCover({ id, slide }: { id: string; slide: number }) {
  const sh = `${id}-sh`;
  const sh2 = `${id}-sh2`;
  return (
    <>
      <Defs id={id} />
      <Backdrop id={id} from="#d8402d" to="#f39a76" glow="#fff3e6" glowO={0.4} />
      {slide === 0 && (
        <Win x={150} y={110} w={900} h={580} url="registration · class search" shadow={sh}>
          <T x={190} y={206} size={26} weight={600}>
            Class search
          </T>
          <Bar x={190} y={226} w={240} h={10} o={0.12} />
          {["Course", "Title", "Instructor", "Rating"].map((h, i) => (
            <T key={h} x={[190, 360, 600, 880][i]} y={290} size={14} fill="#7a756b" weight={500}>
              {h.toUpperCase()}
            </T>
          ))}
          {ROWS.map(([c, t, p, r], i) => {
            const y = 310 + i * 72;
            return (
              <g key={c}>
                <line x1={190} x2={1010} y1={y} y2={y} stroke="#141412" strokeOpacity={0.08} />
                <T x={190} y={y + 44} size={18} mono weight={500}>
                  {c}
                </T>
                <T x={360} y={y + 44} size={18} weight={400}>
                  {t}
                </T>
                <T x={600} y={y + 44} size={18} weight={400} fill="#3c3a36">
                  {p}
                </T>
                <Rating x={880} y={y + 20} r={r} />
              </g>
            );
          })}
        </Win>
      )}
      {slide === 1 && (
        <g>
          <Win x={90} y={150} w={660} h={500} url="registration" shadow={sh}>
            {ROWS.slice(0, 4).map(([c, , p, r], i) => {
              const y = 230 + i * 92;
              return (
                <g key={c} opacity={i === 0 ? 1 : 0.4}>
                  <T x={130} y={y + 40} size={20} mono>
                    {c}
                  </T>
                  <T x={300} y={y + 40} size={20} weight={400}>
                    {p}
                  </T>
                  <Rating x={560} y={y + 16} r={r} />
                </g>
              );
            })}
          </Win>
          <g filter={`url(#${sh})`}>
            <rect x={640} y={190} width={440} height={330} rx={22} fill="#ffffff" />
          </g>
          <T x={680} y={250} size={18} fill="#7a756b" weight={400}>
            Prof. A. · CPSC 131
          </T>
          <Rating x={680} y={280} r={4.6} big />
          <T x={820} y={318} size={20} weight={400} fill="#3c3a36">
            overall quality
          </T>
          {[0.92, 0.7, 0.85].map((v, i) => (
            <g key={i}>
              <Bar x={680} y={380 + i * 36} w={360} h={12} o={0.08} />
              <rect x={680} y={380 + i * 36} width={360 * v} height={12} rx={6} fill={chipColor(4.6)} />
            </g>
          ))}
          <Chip x={700} y={570} label="27% less time registering" fill="#141412" ink="#ffffff" size={20} shadow={sh2} />
        </g>
      )}
      {slide >= 2 && (
        <g>
          <Win x={110} y={120} w={980} h={560} url="registration" shadow={sh}>
            <rect x={110} y={166} width={980} height={50} fill="#f3f1ec" />
            <circle cx={1050} cy={191} r={14} fill="#e5391f" />
            <T x={1050} y={197} size={14} anchor="middle" fill="#ffffff" weight={700}>
              R
            </T>
            {[0, 1, 2, 3].map((i) => (
              <Bar key={i} x={160} y={270 + i * 70} w={380 - i * 40} h={14} o={0.1} />
            ))}
          </Win>
          <g filter={`url(#${sh})`}>
            <rect x={690} y={230} width={380} height={380} rx={20} fill="#ffffff" />
          </g>
          <path d="M1036 230l14-18 14 18z" fill="#ffffff" />
          <T x={720} y={286} size={22} weight={600}>
            Class Registration
          </T>
          <T x={720} y={314} size={22} weight={600}>
            Assistant
          </T>
          <T x={720} y={346} size={15} fill="#7a756b" mono weight={400}>
            manifest_version: 3
          </T>
          {["Show ratings inline", "Ratings via GraphQL", "Highlight top rated"].map((l, i) => (
            <g key={l}>
              <line x1={720} x2={1040} y1={384 + i * 64} y2={384 + i * 64} stroke="#141412" strokeOpacity={0.08} />
              <T x={720} y={424 + i * 64} size={18} weight={400}>
                {l}
              </T>
              <rect x={984} y={404 + i * 64} width={56} height={30} rx={15} fill={i === 2 ? "#d6cfc2" : "#1f9d55"} />
              <circle cx={i === 2 ? 1000 : 1024} cy={419 + i * 64} r={11} fill="#ffffff" />
            </g>
          ))}
        </g>
      )}
    </>
  );
}
