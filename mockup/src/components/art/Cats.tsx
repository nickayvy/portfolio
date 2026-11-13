import { CAT, PINK, SIAMESE, TUX_CURL, TUXEDO } from "./cats";
import { CrayonPad } from "./CrayonDefs";

type Kind = "siamese" | "tuxedo" | "blank";

/**
 * Small crayon cat portraits used as avatars.
 * Contract: <CatFace kind="siamese" | "tuxedo" | "blank" className? />, viewBox 0 0 120 120.
 * Drawn in a 400-unit box and scaled down so the crayon filter keeps its texture.
 */
export function CatFace({ kind, className }: { kind: Kind; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden data-kind={kind}>
      <g transform="translate(2 -2) scale(0.29)">
        {kind === "siamese" && <SiameseHead solid fill="var(--cat-face)" />}
        {kind === "tuxedo" && <TuxedoHead solid fill="var(--cat-face)" />}
        {kind === "blank" && <BlankHead />}
      </g>
    </svg>
  );
}

export function SiameseHead({ collar = true, solid = false, fill = "var(--cat-cream)" }: { collar?: boolean; solid?: boolean; fill?: string }) {
  return (
    <g className="cat-siamese" stroke="var(--figure-ink)" strokeLinecap="round" strokeLinejoin="round">
      {/* each ear is its own small filtered group so it can twitch cheaply */}
      <g className="cat-ear cat-ear-l" filter="url(#crayon)">
        <path d={SIAMESE.earL} strokeWidth="8" stroke="var(--cat-point)" />
        <path d={CAT.earL} strokeWidth="10" />
      </g>
      <g className="cat-ear cat-ear-r" filter="url(#crayon)">
        <path d={SIAMESE.earR} strokeWidth="8" stroke="var(--cat-point)" />
        <path d={CAT.earR} strokeWidth="10" />
      </g>
      {solid && <path d={CAT.head} fill={fill} stroke="none" />}
      <g filter="url(#crayon)" stroke="var(--cat-point)" strokeWidth="8">
        <path d={SIAMESE.mask} />
      </g>
      <g filter="url(#crayon)">
        <path d={CAT.head} strokeWidth="10" />
        <path d={CAT.eyeL} fill="var(--note)" strokeWidth="7" />
        <path d={CAT.eyeR} fill="var(--note)" strokeWidth="7" />
        <path d={CAT.nose} fill="var(--figure-ink)" strokeWidth="6" />
        <path d={CAT.mouth} strokeWidth="7" />
        <path d={CAT.whiskersL} strokeWidth="5" />
        <path d={CAT.whiskersR} strokeWidth="5" />
      </g>
      <g className="cat-eyes" filter="url(#crayon)" strokeLinecap="round">
        <CrayonPad x={124} y={196} w={152} h={60} />
        <path d="M158 226h.5M242 226h.5" stroke="var(--accent-blue)" strokeWidth="30" />
        <path d="M158 227h.5M242 227h.5" stroke="var(--figure-ink)" strokeWidth="11" />
      </g>
      {collar && (
        <g filter="url(#crayon)" strokeLinecap="round">
          <path d={CAT.collar} stroke="var(--accent-red)" strokeWidth="16" />
          <circle cx="200" cy="364" r="15" fill={PINK} stroke={PINK} strokeWidth="6" />
        </g>
      )}
    </g>
  );
}

export function TuxedoHead({ asleep = true, solid = false, fill = "var(--cat-cream)" }: { asleep?: boolean; solid?: boolean; fill?: string }) {
  return (
    <g className="cat-tuxedo">
      {solid && <path d={`${CAT.head}${CAT.earL}${CAT.earR}`} fill={fill} stroke="none" />}
      <g filter="url(#crayon)" stroke="var(--cat-fur)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="10">
        <path d={TUXEDO.left} />
        <path d={TUXEDO.right} />
        <path d={TUXEDO.earL} />
        <path d={TUXEDO.earR} />
      </g>
      <g filter="url(#crayon)" stroke="var(--figure-ink)" strokeLinecap="round" strokeLinejoin="round">
        <path d={CAT.earL} strokeWidth="10" />
        <path d={CAT.earR} strokeWidth="10" />
        <path d={CAT.head} strokeWidth="10" />
        <path d={TUXEDO.blaze} strokeWidth="6" />
        <path d={TUXEDO.blazeR} strokeWidth="6" />
        <path d={CAT.nose} fill={PINK} stroke={PINK} strokeWidth="6" />
        <path d={CAT.mouth} strokeWidth="7" />
        <path d={CAT.whiskersL} strokeWidth="5" />
        <path d={CAT.whiskersR} strokeWidth="5" />
      </g>
      {/* eyes: a paper underlay keeps them readable over the black scribble */}
      <g filter="url(#crayon)" strokeLinecap="round">
        {asleep ? (
          <>
            <path d={`${CAT.sleepL}${CAT.sleepR}`} stroke="var(--cat-cream)" strokeWidth="14" />
            <path d={`${CAT.sleepL}${CAT.sleepR}`} stroke="var(--figure-ink)" strokeWidth="7" />
          </>
        ) : (
          <>
            <CrayonPad x={124} y={196} w={152} h={60} />
            <path d={CAT.eyeL + CAT.eyeR} fill="var(--paper)" stroke="var(--paper)" strokeWidth="12" />
            <path d={CAT.eyeL + CAT.eyeR} stroke="var(--figure-ink)" strokeWidth="7" />
            <path d="M158 226h.5M242 226h.5" stroke="var(--figure-ink)" strokeWidth="18" />
          </>
        )}
      </g>
    </g>
  );
}

function BlankHead() {
  return (
    <g stroke="var(--ink-muted)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="9" strokeDasharray="4 22">
      <path d={CAT.earL} />
      <path d={CAT.earR} />
      <path d={CAT.head} />
      <path d="M186 232q14-26 30-8q4 18-14 26v16M201 296v1" strokeDasharray="none" opacity="0.7" />
    </g>
  );
}

/**
 * The tuxedo curled up asleep, in footer-scene units (ground at y=340, spans x≈456–592).
 * `breathe` adds the slow breathing classes used by the footer scene.
 */
export function TuxCurled({ breathe = false }: { breathe?: boolean }) {
  const ink = { stroke: "var(--figure-ink)", strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <g className="tux-curled">
      <g className={breathe ? "tux-breathe" : undefined}>
        <g filter="url(#crayon)" {...ink}>
          <path d={TUX_CURL.fur} strokeWidth="8" stroke="var(--cat-fur)" />
          <path d={TUX_CURL.body} strokeWidth="7" />
          <path d={TUX_CURL.tail} strokeWidth="11" />
        </g>
      </g>
      <g className={breathe ? "tux-head" : undefined}>
        <g transform="translate(456 268) scale(0.2)">
          <TuxedoHead solid />
        </g>
        <g filter="url(#crayon)" {...ink}>
          <path d={TUX_CURL.pawL} strokeWidth="4" fill="var(--cat-cream)" />
          <path d={TUX_CURL.pawR} strokeWidth="4" fill="var(--cat-cream)" />
        </g>
      </g>
    </g>
  );
}
