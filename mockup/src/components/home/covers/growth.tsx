/** creator-growth: phone feed, posts chart, watched accounts, cost drop. */
import { Backdrop, Bar, Chip, Defs, Phone, T, W, H } from "./parts";

const TILE = ["#ffd7c2", "#c9e8d6", "#f7e7a6", "#cfe0ff", "#f4c4d6", "#d9f2c4", "#ffe4b8", "#d6d0f5", "#bfe6e0"];

export function GrowthCover({ id, slide }: { id: string; slide: number }) {
  const sh = `${id}-sh`;
  const sh2 = `${id}-sh2`;
  return (
    <>
      <Defs id={id}>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1fb36b" stopOpacity="0.35" />
          <stop offset="1" stopColor="#1fb36b" stopOpacity="0" />
        </linearGradient>
      </Defs>
      {slide === 0 && (
        <g>
          <Backdrop id={id} from="#0e6b41" to="#22b66d" glow="#e9ffe8" glowO={0.45} />
          <circle cx={1010} cy={680} r={260} fill="#0b5a37" opacity={0.35} />
          <Phone x={450} y={110} shadow={sh}>
            <circle cx={510} cy={196} r={30} fill="#1fb36b" />
            <circle cx={510} cy={196} r={22} fill="#dff5e8" />
            <Bar x={556} y={180} w={120} h={12} o={0.75} />
            <Bar x={556} y={202} w={80} h={9} o={0.2} />
            {[
              ["1,200+", "accounts"],
              ["54k", "posts / mo"],
              ["−90%", "cost"],
            ].map(([v, l], i) => (
              <g key={l}>
                <T x={500 + i * 98} y={268} size={20} weight={600} anchor="middle">
                  {v}
                </T>
                <T x={500 + i * 98} y={290} size={12} anchor="middle" fill="#7a756b" weight={400}>
                  {l}
                </T>
              </g>
            ))}
            {TILE.map((c, i) => (
              <rect key={i} x={458 + (i % 3) * 96} y={316 + Math.floor(i / 3) * 96} width={92} height={92} rx={8} fill={c} />
            ))}
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={504 + i * 96} cy={362} r={18} fill="#ffffff" opacity={0.6} />
            ))}
          </Phone>
          <Chip x={170} y={250} label="Watching 1,200+ creators" dot="#1fb36b" shadow={sh2} />
          <Chip x={800} y={470} label="54,000 posts a month" dot="#ff8a3d" shadow={sh2} />
          <Chip x={240} y={560} label="+ app traffic" fill="#141412" ink="#ffffff" shadow={sh2} />
        </g>
      )}
      {slide === 1 && (
        <g>
          <Backdrop id={id} from="#e9f6ee" to="#bfe7cf" glow="#ffffff" glowO={0.7} />
          <rect x={170} y={130} width={860} height={540} rx={28} fill="#ffffff" filter={`url(#${sh})`} />
          <T x={220} y={200} size={22} fill="#7a756b" weight={400}>
            Posts processed
          </T>
          <T x={220} y={262} size={60} weight={600}>
            54,000
          </T>
          <T x={470} y={262} size={24} fill="#7a756b" weight={400}>
            / month
          </T>
          <Chip x={820} y={176} label="Live" dot="#1fb36b" fill="#eef8f2" size={16} />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={220} x2={980} y1={340 + i * 80} y2={340 + i * 80} stroke="#141412" strokeOpacity={0.07} />
          ))}
          <path d="M220 590 C300 570 340 540 400 548 S520 470 600 480 S720 400 790 392 S900 330 980 318 L980 620 L220 620 Z" fill={`url(#${id}-area)`} />
          <path d="M220 590 C300 570 340 540 400 548 S520 470 600 480 S720 400 790 392 S900 330 980 318" fill="none" stroke="#1fb36b" strokeWidth={5} strokeLinecap="round" />
          <circle cx={980} cy={318} r={10} fill="#ffffff" stroke="#1fb36b" strokeWidth={5} />
          {["W1", "W2", "W3", "W4"].map((w, i) => (
            <T key={w} x={240 + i * 230} y={650} size={14} fill="#7a756b" weight={400}>
              {w}
            </T>
          ))}
        </g>
      )}
      {slide === 2 && (
        <g>
          <Backdrop id={id} from="#06331f" to="#0f6b42" glow="#7dffb5" glowO={0.18} />
          {Array.from({ length: 40 }, (_, i) => {
            const c = i % 10;
            const r = Math.floor(i / 10);
            const cx = 150 + c * 100 + (r % 2) * 50;
            const cy = 200 + r * 120;
            const hue = TILE[i % TILE.length];
            const live = (i * 7) % 5 === 0;
            return (
              <g key={i} opacity={cx > 1100 ? 0 : 1}>
                <circle cx={cx} cy={cy} r={40} fill="none" stroke={live ? "#4be08e" : "#ffffff"} strokeOpacity={live ? 1 : 0.18} strokeWidth={4} />
                <circle cx={cx} cy={cy} r={32} fill={hue} />
                <circle cx={cx} cy={cy - 8} r={11} fill="#ffffff" opacity={0.75} />
                <path d={`M${cx - 18} ${cy + 22}q18-22 36 0`} fill="#ffffff" opacity={0.75} />
                {live ? <circle cx={cx + 28} cy={cy - 28} r={8} fill="#4be08e" stroke="#06331f" strokeWidth={3} /> : null}
              </g>
            );
          })}
          <Chip x={410} y={660} label="1,200+ accounts monitored" fill="#ffffff" dot="#1fb36b" size={22} shadow={sh2} />
        </g>
      )}
      {slide >= 3 && (
        <g>
          <Backdrop id={id} from="#f2efe6" to="#d7eadc" glow="#ffffff" glowO={0.6} />
          <rect x={300} y={120} width={600} height={560} rx={28} fill="#ffffff" filter={`url(#${sh})`} />
          <T x={350} y={190} size={22} fill="#7a756b" weight={400}>
            Operating cost
          </T>
          <T x={350} y={250} size={56} weight={600} fill="#0e8a52">
            −90%
          </T>
          <rect x={390} y={300} width={150} height={300} rx={14} fill="#141412" opacity={0.1} />
          <rect x={660} y={570} width={150} height={30} rx={10} fill="#1fb36b" />
          <T x={465} y={640} size={18} anchor="middle" fill="#7a756b" weight={400}>
            Before
          </T>
          <T x={735} y={640} size={18} anchor="middle" fill="#7a756b" weight={400}>
            After
          </T>
          <path d="M545 330 C620 330 700 420 730 548" fill="none" stroke="#1fb36b" strokeWidth={3} strokeDasharray="8 10" />
        </g>
      )}
      <rect width={W} height={H} fill="none" />
    </>
  );
}
