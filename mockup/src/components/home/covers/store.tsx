/** creator-storefront: storefront, checkout, analytics, LLM catalog cleanup. */
import { Arrow, Backdrop, Bar, Chip, Defs, Phone, T } from "./parts";

const PRODUCT = ["#e9c9a8", "#c8d7c0", "#d9c4e0", "#f0d58c"];

function Product({ x, y, w, c, price }: { x: number; y: number; w: number; c: string; price: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={w} rx={14} fill={c} />
      <ellipse cx={x + w / 2} cy={y + w * 0.62} rx={w * 0.26} ry={w * 0.08} fill="#141412" opacity={0.08} />
      <rect x={x + w * 0.32} y={y + w * 0.22} width={w * 0.36} height={w * 0.4} rx={10} fill="#ffffff" opacity={0.7} />
      <Bar x={x} y={y + w + 14} w={w * 0.7} h={10} o={0.5} />
      <T x={x} y={y + w + 48} size={16} weight={600}>
        {price}
      </T>
    </g>
  );
}

export function StoreCover({ id, slide }: { id: string; slide: number }) {
  const sh = `${id}-sh`;
  const sh2 = `${id}-sh2`;
  return (
    <>
      <Defs id={id} />
      <Backdrop id={id} from="#f3ece0" to="#e2d3bd" glow="#ffffff" glowO={0.7} />
      <circle cx={980} cy={140} r={220} fill="#e9a77a" opacity={0.25} />
      <circle cx={200} cy={720} r={240} fill="#9fb8a0" opacity={0.2} />
      {slide === 0 && (
        <g>
          <rect x={200} y={90} width={800} height={620} rx={28} fill="#ffffff" filter={`url(#${sh})`} />
          <path d="M200 118a28 28 0 0 1 28-28h744a28 28 0 0 1 28 28v122h-800z" fill="#2c2a26" />
          <circle cx={600} cy={240} r={52} fill="#e9a77a" stroke="#ffffff" strokeWidth={8} />
          <T x={600} y={330} size={26} weight={600} anchor="middle">
            @creator&apos;s shop
          </T>
          <Bar x={520} y={348} w={160} h={10} o={0.15} />
          {PRODUCT.map((c, i) => (
            <Product key={i} x={250 + i * 180} y={392} w={160} c={c} price={["$24", "$38", "$18", "$42"][i]} />
          ))}
          <Chip x={790} y={118} label="Follow" fill="#ffffff" size={16} />
        </g>
      )}
      {slide === 1 && (
        <g>
          <Phone x={450} y={100} shadow={sh}>
            <T x={480} y={110 + 92} size={24} weight={600}>
              Checkout
            </T>
            {[0, 1].map((i) => (
              <g key={i}>
                <rect x={480} y={230 + i * 100} width={70} height={70} rx={12} fill={PRODUCT[i]} />
                <Bar x={566} y={248 + i * 100} w={110} h={11} o={0.6} />
                <Bar x={566} y={272 + i * 100} w={70} h={9} o={0.18} />
                <T x={720} y={262 + i * 100} size={17} weight={600} anchor="end">
                  {["$24", "$38"][i]}
                </T>
              </g>
            ))}
            <line x1={480} x2={720} y1={450} y2={450} stroke="#141412" strokeOpacity={0.1} />
            <T x={480} y={490} size={17} fill="#7a756b" weight={400}>
              Total
            </T>
            <T x={720} y={490} size={22} weight={600} anchor="end">
              $62
            </T>
            <rect x={480} y={620} width={240} height={56} rx={28} fill="#141412" />
            <T x={600} y={655} size={19} anchor="middle" fill="#ffffff">
              Pay
            </T>
          </Phone>
          <Chip x={160} y={300} label="Rebuilt checkout APIs" fill="#ffffff" dot="#1f9d55" shadow={sh2} />
          <Chip x={820} y={520} label="order.created →" fill="#141412" ink="#ffffff" size={17} shadow={sh2} />
        </g>
      )}
      {slide === 2 && (
        <g>
          <rect x={120} y={120} width={560} height={560} rx={24} fill="#ffffff" filter={`url(#${sh})`} />
          <T x={160} y={180} size={18} fill="#7a756b" weight={400}>
            GMV
          </T>
          <Bar x={160} y={200} w={140} h={22} o={0.8} />
          <path d="M160 560 L230 520 L300 540 L370 470 L440 480 L510 400 L580 380 L640 300" fill="none" stroke="#f26b3a" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={160} x2={640} y1={300 + i * 90} y2={300 + i * 90} stroke="#141412" strokeOpacity={0.06} />
          ))}
          <rect x={720} y={120} width={360} height={260} rx={24} fill="#ffffff" filter={`url(#${sh})`} />
          <T x={760} y={180} size={18} fill="#7a756b" weight={400}>
            Subscribers
          </T>
          {[40, 60, 52, 80, 96, 120].map((h, i) => (
            <rect key={i} x={760 + i * 50} y={340 - h} width={34} height={h} rx={8} fill="#7b6cf6" opacity={0.35 + i * 0.1} />
          ))}
          <rect x={720} y={420} width={360} height={260} rx={24} fill="#ffffff" filter={`url(#${sh})`} />
          <T x={760} y={480} size={18} fill="#7a756b" weight={400}>
            Conversion by merchant
          </T>
          {[0.8, 0.55, 0.68, 0.4].map((v, i) => (
            <g key={i}>
              <circle cx={772} cy={520 + i * 38} r={10} fill={PRODUCT[i]} />
              <Bar x={794} y={514 + i * 38} w={250} h={12} o={0.06} />
              <rect x={794} y={514 + i * 38} width={250 * v} height={12} rx={6} fill="#1f9d55" opacity={0.8} />
            </g>
          ))}
        </g>
      )}
      {slide >= 3 && (
        <g>
          <g transform="rotate(-3 300 400)">
            <rect x={110} y={210} width={380} height={380} rx={20} fill="#ffffff" filter={`url(#${sh})`} />
            <rect x={140} y={240} width={120} height={120} rx={12} fill={PRODUCT[0]} />
            <T x={140} y={410} size={17} fill="#7a756b" weight={400} mono>
              {"AMAZING mug!!! 12oz"}
            </T>
            <T x={140} y={440} size={17} fill="#7a756b" weight={400} mono>
              {"ceramic?? dishwasher"}
            </T>
            <T x={140} y={470} size={17} fill="#7a756b" weight={400} mono>
              {"safe i think. BEST GIFT"}
            </T>
            <path d="M140 520 q40 -14 80 0 t80 0 t80 0" fill="none" stroke="#e5391f" strokeWidth={3} opacity={0.6} />
          </g>
          <Arrow x1={520} y1={400} x2={660} y2={400} color="#141412" o={0.6} />
          <Chip x={480} y={300} label="multimodal LLM" fill="#141412" ink="#ffffff" size={16} shadow={sh2} />
          <rect x={690} y={190} width={400} height={420} rx={20} fill="#ffffff" filter={`url(#${sh})`} />
          <rect x={720} y={220} width={120} height={120} rx={12} fill={PRODUCT[0]} />
          <T x={860} y={262} size={22} weight={600}>
            Ceramic mug
          </T>
          <T x={860} y={292} size={16} fill="#7a756b" weight={400}>
            12 oz
          </T>
          {[
            ["Material", "Ceramic"],
            ["Care", "Dishwasher safe"],
            ["Category", "Kitchen · Gifts"],
          ].map(([k, v], i) => (
            <g key={k}>
              <line x1={720} x2={1060} y1={380 + i * 62} y2={380 + i * 62} stroke="#141412" strokeOpacity={0.08} />
              <T x={720} y={418 + i * 62} size={17} fill="#7a756b" weight={400}>
                {k}
              </T>
              <T x={1060} y={418 + i * 62} size={17} anchor="end">
                {v}
              </T>
            </g>
          ))}
        </g>
      )}
    </>
  );
}
