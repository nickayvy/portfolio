/** unix-lab: blueprint host map, certificate chain, mail route. */
import { Arrow, Backdrop, Defs, Grid, T } from "./parts";

const LINE = "#dbe6ff";

function Host({ x, y, name, role, os, hl = false }: { x: number; y: number; name: string; role: string; os: string; hl?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={220} height={110} rx={10} fill="#163f95" stroke={hl ? "#ffe14a" : LINE} strokeOpacity={hl ? 1 : 0.7} strokeWidth={2} />
      <rect x={x + 18} y={y + 20} width={26} height={18} rx={3} fill="none" stroke={LINE} strokeWidth={2} />
      <line x1={x + 24} x2={x + 38} y1={y + 44} y2={y + 44} stroke={LINE} strokeWidth={2} />
      <T x={x + 58} y={y + 36} size={20} fill="#ffffff" mono weight={600}>
        {name}
      </T>
      <T x={x + 18} y={y + 72} size={15} fill={LINE} weight={400}>
        {role}
      </T>
      <T x={x + 18} y={y + 94} size={13} fill={LINE} opacity={0.6} mono weight={400}>
        {os}
      </T>
    </g>
  );
}

export function UnixCover({ id, slide }: { id: string; slide: number }) {
  return (
    <>
      <Defs id={id} />
      <Backdrop id={id} from="#0f3a8f" to="#1c56c4" glow="#9cc0ff" glowO={0.25} />
      <Grid step={32} color="#ffffff" o={0.07} />
      <Grid step={160} color="#ffffff" o={0.1} />
      {slide === 0 && (
        <g>
          <line x1={120} x2={1080} y1={400} y2={400} stroke={LINE} strokeWidth={3} />
          <T x={262} y={428} size={14} fill={LINE} mono weight={400}>
            10.0.0.0/24 · lab.internal
          </T>
          {[
            [130, 160, "ns1", "DNS · BIND", "openbsd"],
            [490, 160, "ldap", "OpenLDAP + sssd", "linux"],
            [850, 160, "ca", "private CA · TLS", "openbsd"],
            [130, 530, "nfs", "/home for everyone", "freebsd"],
            [490, 530, "mail", "sendmail + dovecot", "freebsd", true],
            [850, 530, "ws1", "any directory user", "linux"],
          ].map(([x, y, n, r, os, hl]) => (
            <g key={n as string}>
              <line x1={(x as number) + 110} x2={(x as number) + 110} y1={(y as number) < 400 ? (y as number) + 110 : 400} y2={(y as number) < 400 ? 400 : (y as number)} stroke={LINE} strokeWidth={2} strokeDasharray="6 6" />
              <circle cx={(x as number) + 110} cy={400} r={7} fill="#ffffff" />
              <Host x={x as number} y={y as number} name={n as string} role={r as string} os={os as string} hl={Boolean(hl)} />
            </g>
          ))}
          <T x={1080} y={760} size={14} fill={LINE} anchor="end" mono weight={400} opacity={0.7}>
            SHEET 01 / HOST MAP
          </T>
        </g>
      )}
      {slide === 1 && (
        <g>
          <rect x={460} y={110} width={280} height={150} rx={14} fill="#f6f3ea" />
          <circle cx={505} cy={160} r={22} fill="none" stroke="#1f4fd1" strokeWidth={4} />
          <path d="M495 160l8 8 14-16" fill="none" stroke="#1f4fd1" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          <T x={540} y={160} size={22} weight={600}>
            Lab Root CA
          </T>
          <T x={540} y={186} size={14} fill="#7a756b" mono weight={400}>
            self-signed · offline
          </T>
          <rect x={490} y={214} width={220} height={14} rx={7} fill="#1f4fd1" opacity={0.15} />
          {["ldap.lab", "mail.lab", "nfs.lab"].map((n, i) => {
            const x = 150 + i * 330;
            return (
              <g key={n}>
                <path d={`M600 262 C600 340 ${x + 130} 330 ${x + 130} 430`} fill="none" stroke={LINE} strokeWidth={2.5} strokeDasharray="6 7" />
                <rect x={x} y={430} width={260} height={190} rx={14} fill="#f6f3ea" />
                <rect x={x + 24} y={458} width={30} height={24} rx={5} fill="#1f4fd1" />
                <path d={`M${x + 30} 458v-8a9 9 0 0 1 18 0v8`} fill="none" stroke="#1f4fd1" strokeWidth={4} />
                <T x={x + 70} y={478} size={22} weight={600} mono>
                  {n}
                </T>
                <rect x={x + 24} y={512} width={200} height={10} rx={5} fill="#141412" opacity={0.12} />
                <rect x={x + 24} y={536} width={150} height={10} rx={5} fill="#141412" opacity={0.12} />
                <T x={x + 24} y={592} size={14} fill="#1f4fd1" weight={500}>
                  issued by Lab Root CA
                </T>
              </g>
            );
          })}
        </g>
      )}
      {slide >= 2 && (
        <g>
          {[
            [110, "ws1", "sendmail -t"],
            [410, "mail", "sendmail"],
            [710, "mail", "dovecot"],
          ].map(([x, h, s], i) => (
            <g key={i}>
              <rect x={x as number} y={300} width={220} height={130} rx={14} fill="#163f95" stroke={LINE} strokeOpacity={0.7} strokeWidth={2} />
              <T x={(x as number) + 24} y={346} size={22} fill="#ffffff" mono weight={600}>
                {h as string}
              </T>
              <T x={(x as number) + 24} y={380} size={16} fill={LINE} weight={400} mono>
                {s as string}
              </T>
              {i < 2 ? <Arrow x1={(x as number) + 230} y1={365} x2={(x as number) + 290} y2={365} color={LINE} o={0.9} /> : null}
            </g>
          ))}
          <Arrow x1={940} y1={365} x2={1000} y2={365} color="#ffe14a" o={1} />
          <T x={970} y={340} size={13} fill="#ffe14a" anchor="middle" mono weight={400}>
            IMAPS
          </T>
          <rect x={1010} y={300} width={150} height={130} rx={14} fill="#f6f3ea" />
          <rect x={1035} y={330} width={100} height={70} rx={6} fill="none" stroke="#1f4fd1" strokeWidth={4} />
          <path d="M1035 334l50 36 50-36" fill="none" stroke="#1f4fd1" strokeWidth={4} strokeLinejoin="round" />
          <T x={110} y={520} size={20} fill={LINE} weight={400}>
            any directory user → any host → read over TLS
          </T>
          <T x={110} y={240} size={14} fill={LINE} mono weight={400} opacity={0.7}>
            SHEET 03 / MAIL ROUTE
          </T>
        </g>
      )}
    </>
  );
}
