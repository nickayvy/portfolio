"use client";

import { useRef } from "react";
import { playSound } from "@/lib/sound";
import { SiameseHead, TuxCurled } from "./Cats";
import { MIZU_BODY, MIZU_SOCKS } from "./cats";
import { CrayonPad } from "./CrayonDefs";
import { NickHead } from "./NickHead";
import { NICK } from "./nick";
import { smooth } from "./geom";
import { usePauseOffscreen } from "./usePauseOffscreen";

/**
 * The closing crayon scene: Nick cross-legged with a laptop, Mizu the Siamese sitting
 * beside him, the tuxedo cat asleep on his other side, and a steaming cup.
 * Contract: <FooterScene className? /> renders an inline, responsive <svg data-footer-scene>.
 *
 * Every moving part (tail, ears, breathing, steam, z's) is its own small filtered group,
 * so a frame only re-rasterises a few tiny regions. Loops pause while off screen.
 */

const S = {
  ground: smooth([[34, 341], [140, 339], [260, 341], [400, 339], [520, 341], [638, 339]]),
  groundBlue: smooth([[56, 349], [120, 348], [196, 349]]),
  // Nick, scene units
  // plain tee: neckline, short sleeves, straight sides
  neck: smooth([[341, 189], [341, 200]]),
  neckline: smooth([[328, 201], [341, 212], [354, 201]]),
  teeL: smooth([[328, 201], [304, 207], [288, 223], [277, 246], [288, 251], [298, 252], [300, 242]]),
  teeR: smooth([[354, 201], [378, 207], [394, 223], [405, 246], [394, 251], [384, 252], [382, 242]]),
  sideL: smooth([[300, 242], [297, 282], [301, 316]]),
  sideR: smooth([[382, 242], [385, 282], [381, 316]]),
  // thin stick arms that bend at the elbow and reach in to the keyboard
  armL: smooth([[287, 251], [282, 270], [282, 286], [294, 294], [312, 298]]),
  armR: smooth([[395, 251], [400, 270], [400, 286], [388, 294], [370, 298]]),
  legL: smooth([[340, 322], [292, 312], [246, 318], [232, 332], [256, 342], [318, 340], [356, 330]], false),
  legR: smooth([[344, 322], [392, 312], [438, 318], [452, 332], [428, 342], [366, 340], [328, 330]], false),
  laptop: "M300 270C300 266 302 264 306 264L378 262C382 262 384 264 384 268L386 316L298 318Z",
  laptopBase: smooth([[288, 320], [340, 318], [396, 320]]),
  logo: "M335 296l1-7 4 4 4-4 1 7c-1 3-9 3-10 0Z",
  blueNick: smooth([[408, 232], [416, 260], [414, 300]]),
  // cup
  cup: smooth([[604, 310], [606, 328], [610, 337], [630, 337], [634, 328], [636, 310]]),
  cupRim: smooth([[602, 309], [620, 312], [638, 309]]),
  handle: smooth([[635, 316], [648, 316], [650, 326], [639, 332]]),
  saucer: smooth([[596, 339], [620, 342], [646, 339]]),
  steam1: smooth([[615, 300], [610, 290], [617, 280], [612, 270]]),
  steam2: smooth([[627, 298], [632, 288], [625, 278], [630, 268]]),
};

export function FooterScene({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  usePauseOffscreen(ref);
  const ink = { stroke: "var(--figure-ink)", strokeLinecap: "round", strokeLinejoin: "round" } as const;

  return (
    <svg
      ref={ref}
      viewBox="6 70 660 296"
      fill="none"
      className={["footer-scene", className].filter(Boolean).join(" ")}
      data-footer-scene=""
      data-paused=""
      aria-hidden
    >
      {/* ground */}
      <g filter="url(#crayon)" strokeLinecap="round">
        <CrayonPad x={20} y={322} w={640} h={40} />
        <path d={S.groundBlue} stroke="var(--accent-blue)" strokeWidth="9" opacity="0.9" />
        <path d={S.ground} stroke="var(--figure-ink)" strokeWidth="8" />
      </g>

      {/* Mizu */}
      <g
        className="scene-mizu"
        data-cursor="Meow!"
        onPointerEnter={() => playSound("meow")}
        onClick={() => playSound("meow")}
      >
        <rect x="58" y="168" width="140" height="172" fill="transparent" />
        <g transform="translate(68 146) scale(0.36)">
          {/* the filter sits on an inner group: a filtered element that is itself animated is
              re-rasterised (three turbulence passes) every frame, an unfiltered wrapper can
              be rotated on the compositor */}
          <g className="mizu-tail">
            <g filter="url(#crayon)" {...ink}>
              <CrayonPad x={290} y={410} w={140} h={140} />
              <path d={MIZU_BODY.tail} strokeWidth="24" />
            </g>
          </g>
          <path d={MIZU_BODY.fill} fill="var(--cat-cream)" />
          <g filter="url(#crayon)" {...ink}>
            <path d={MIZU_BODY.blue} stroke="var(--accent-blue)" strokeWidth="22" opacity="0.9" />
            <path d={MIZU_BODY.left} strokeWidth="22" />
            <path d={MIZU_BODY.right} strokeWidth="22" />
            <path d={MIZU_BODY.legL} strokeWidth="14" />
            <path d={MIZU_BODY.legLi} strokeWidth="12" />
            <path d={MIZU_BODY.legR} strokeWidth="12" />
            <path d={MIZU_BODY.legRi} strokeWidth="14" />
            <path d={MIZU_BODY.fluff} strokeWidth="11" />
          </g>
          <g filter="url(#crayon)" strokeLinecap="round" strokeLinejoin="round">
            <path d={MIZU_SOCKS.fill} stroke="var(--cat-mask)" strokeWidth="10" />
            <path d={MIZU_SOCKS.outline} stroke="var(--figure-ink)" strokeWidth="13" />
          </g>
          <g className="mizu-head">
            <SiameseHead solid />
          </g>
        </g>
      </g>

      {/* Nick */}
      <g className="scene-nick" data-cursor="Hi!">
        <rect x="226" y="84" width="232" height="256" fill="transparent" />
        <g filter="url(#crayon)" {...ink}>
          <path d={S.blueNick} stroke="var(--accent-blue)" strokeWidth="9" opacity="0.9" />
          <path d={S.neck} strokeWidth="6" />
          <path d={S.neckline} strokeWidth="6" />
          <path d={S.teeL} strokeWidth="8" />
          <path d={S.teeR} strokeWidth="8" />
          <path d={S.sideL} strokeWidth="8" />
          <path d={S.sideR} strokeWidth="8" />
          <path d={S.armL} strokeWidth="5.5" />
          <path d={S.armR} strokeWidth="5.5" />
          <path d={S.legL} strokeWidth="8" />
          <path d={S.legR} strokeWidth="8" />
        </g>
        <path d={S.laptop} fill="var(--paper)" />
        <g filter="url(#crayon)" {...ink}>
          <path d={S.laptop} strokeWidth="7" />
          <path d={S.laptopBase} strokeWidth="7" />
          <path d={S.logo} strokeWidth="2.5" fill="var(--figure-ink)" />
        </g>
        <g className="nick-sit" transform="translate(264 57) scale(0.38)" style={{ "--ey": 5, "--ex": -2 } as React.CSSProperties}>
          <path d={NICK.faceFill} fill="var(--paper)" />
          <NickHead />
        </g>
      </g>

      {/* the tuxedo, asleep */}
      <g className="scene-tux" data-cursor="Zzz">
        <rect x="470" y="250" width="124" height="92" fill="transparent" />
        <TuxCurled breathe />
        <g className="tux-z" {...ink} strokeWidth="3.2">
          {[0, 1, 2].map((i) => (
            <path key={i} className="tux-z-letter" style={{ animationDelay: `${i * 1.1}s` }} d="M520 276h8l-8 9h8" />
          ))}
        </g>
      </g>

      {/* cup + steam */}
      <g filter="url(#crayon)" {...ink}>
        <path d="M604 310L636 310L632 337L608 337Z" fill="var(--paper)" stroke="none" />
        <path d={S.cup} strokeWidth="6" />
        <path d={S.cupRim} strokeWidth="5" />
        <path d={S.handle} strokeWidth="5" />
        <path d={S.saucer} strokeWidth="5" />
      </g>
      {/* each wisp drifts up and fades on its own small filtered group */}
      {[S.steam1, S.steam2].map((d, i) => (
        <g key={i} className="scene-steam" style={{ animationDelay: `${i * -1.45}s` }}>
          <g filter="url(#crayon)" stroke="var(--accent-blue)" strokeWidth="5" strokeLinecap="round">
            <CrayonPad x={604 + i * 12} y={262} w={22} h={46} />
            <path d={d} />
          </g>
        </g>
      ))}
    </svg>
  );
}
