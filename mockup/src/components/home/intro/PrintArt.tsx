import { SiameseHead, TuxCurled } from "@/components/art/Cats";
import { CrayonPad } from "@/components/art/CrayonDefs";
import { smooth } from "@/components/art/geom";

/**
 * Crayon vignettes for the placeholder photo prints, one per `photoStack` id.
 * 400-unit box so the shared crayon filter keeps the same texture as the mascot.
 */
const ink = { stroke: "var(--figure-ink)", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;

const P = {
  desk: smooth([[30, 300], [200, 297], [384, 300]]),
  screen: "M98 122L262 118L266 238L94 242Z",
  base: smooth([[66, 252], [180, 248], [296, 252], [310, 274], [180, 278], [52, 274], [66, 252]]),
  code1: "M126 150h52M126 176h86M142 202h44",
  code2: "M194 150h28M198 202h34",
  mug: smooth([[328, 246], [330, 296], [364, 296], [366, 246]]),
  mugHandle: smooth([[366, 256], [382, 258], [382, 278], [365, 282]]),
  steam: smooth([[340, 228], [334, 210], [344, 192], [338, 172]]),
  steam2: smooth([[356, 226], [362, 208], [354, 192]]),
  bowl: smooth([[78, 214], [100, 282], [200, 312], [300, 282], [322, 214]]),
  bowlRim: smooth([[74, 212], [200, 222], [326, 212]]),
  foot: smooth([[160, 314], [200, 322], [240, 314]]),
  noodles: smooth([[110, 214], [140, 196], [170, 214], [200, 194], [230, 214], [262, 196], [290, 214]]),
  sticks: "M232 206L332 92M254 210L352 112",
  bowlSteam: "M150 170c-14-18 14-30 0-50M196 166c-14-18 14-30 0-50",
  lanternString: "M86 18v34",
  lantern: smooth([[86, 52], [56, 70], [52, 106], [70, 132], [86, 136], [102, 132], [120, 106], [116, 70], [86, 52]]),
  lanternRibs: "M86 54v80M68 64c-8 24-8 48 4 70M104 64c8 24 8 48-4 70",
  sun: smooth([[318, 66], [344, 76], [348, 104], [326, 122], [298, 114], [292, 86], [318, 66]]),
  rays: "M320 34v-14M364 90h14M354 52l10-10M282 52l-10-10M354 128l10 10",
  trunk: smooth([[160, 312], [168, 250], [164, 190], [150, 136]]),
  frond1: smooth([[150, 136], [104, 118], [70, 140]]),
  frond2: smooth([[150, 136], [126, 92], [86, 82]]),
  frond3: smooth([[150, 136], [186, 98], [232, 100]]),
  frond4: smooth([[150, 136], [196, 132], [226, 160]]),
  wave1: smooth([[20, 316], [70, 300], [120, 318], [170, 302], [220, 318], [270, 302], [320, 318], [380, 302]]),
  wave2: smooth([[40, 350], [96, 336], [150, 352], [206, 336], [262, 352], [318, 336], [370, 350]]),
};

export function PrintArt({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" aria-hidden className="print-art">
      {id === "desk" && (
        <>
          <path d={P.screen} fill="var(--note)" />
          <g filter="url(#crayon)" strokeWidth="10" stroke="var(--accent-blue)" strokeLinecap="round" opacity="0.9">
            <path d={P.code1} />
            <path d={P.steam} />
            <path d={P.steam2} />
          </g>
          <g filter="url(#crayon)" strokeWidth="10" stroke="var(--accent-red)" strokeLinecap="round">
            <path d={P.code2} />
          </g>
          <g filter="url(#crayon)" {...ink} strokeWidth="11">
            <path d={P.screen} />
            <path d={P.base} />
            <path d={P.mug} />
            <path d={P.mugHandle} />
            <path d={P.desk} />
          </g>
        </>
      )}
      {id === "mizu" && (
        <g transform="translate(20 0) scale(0.9)">
          <SiameseHead solid fill="var(--cat-face)" />
        </g>
      )}
      {id === "tux" && (
        <>
          <g transform="translate(-1215 -592) scale(2.7)">
            <TuxCurled />
          </g>
          <g filter="url(#crayon)" {...ink} strokeWidth="9">
            <CrayonPad x={240} y={60} w={110} h={110} />
            <path d="M262 150h26l-26 28h26M300 96h20l-20 22h20" />
          </g>
        </>
      )}
      {id === "restaurant" && (
        <>
          <path d={P.lantern} fill="color-mix(in srgb, var(--accent-red) 14%, transparent)" />
          <g filter="url(#crayon)" stroke="var(--accent-red)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
            <path d={P.lantern} />
            <path d={P.lanternRibs} strokeWidth="6" />
            <path d={P.noodles} />
          </g>
          <g filter="url(#crayon)" stroke="var(--accent-blue)" strokeWidth="9" strokeLinecap="round" opacity="0.9">
            <path d={P.bowlSteam} />
          </g>
          <g filter="url(#crayon)" {...ink} strokeWidth="11">
            <path d={P.lanternString} strokeWidth="6" />
            <path d={P.bowl} />
            <path d={P.bowlRim} />
            <path d={P.foot} />
            <path d={P.sticks} strokeWidth="9" />
          </g>
        </>
      )}
      {id === "sd" && (
        <>
          <g filter="url(#crayon)" stroke="var(--accent-red)" strokeWidth="11" strokeLinecap="round">
            <path d={P.sun} />
            <path d={P.rays} strokeWidth="8" />
          </g>
          <g filter="url(#crayon)" stroke="var(--accent-blue)" strokeWidth="11" strokeLinecap="round" opacity="0.9">
            <path d={P.wave1} />
            <path d={P.wave2} />
          </g>
          <g filter="url(#crayon)" {...ink} strokeWidth="11">
            <path d={P.trunk} strokeWidth="13" />
            <path d={P.frond1} />
            <path d={P.frond2} />
            <path d={P.frond3} />
            <path d={P.frond4} />
          </g>
        </>
      )}
    </svg>
  );
}
