"use client";

import { useRef } from "react";
import { playSound } from "@/lib/sound";
import { SiameseHead, TuxedoHead } from "./Cats";
import { MIZU_BODY, TUX_CURL } from "./cats";
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
  ground: smooth([[38, 341], [140, 339], [260, 341], [400, 339], [520, 341], [632, 339]]),
  groundBlue: smooth([[56, 349], [120, 348], [196, 349]]),
  // Nick, scene units
  neck: smooth([[338, 204], [339, 216]]),
  teeL: smooth([[336, 208], [296, 224], [280, 252], [276, 272], [296, 276], [300, 258]]),
  teeR: smooth([[344, 208], [386, 222], [402, 250], [406, 270], [386, 275], [382, 258]]),
  sideL: smooth([[300, 256], [298, 290], [302, 318]]),
  sideR: smooth([[383, 256], [385, 290], [380, 318]]),
  collar: smooth([[324, 214], [339, 222], [355, 213]]),
  armL: smooth([[286, 274], [290, 296], [304, 306]]),
  armR: smooth([[398, 272], [394, 296], [380, 306]]),
  legL: smooth([[340, 322], [292, 312], [246, 318], [232, 332], [256, 342], [318, 340], [356, 330]], false),
  legR: smooth([[344, 322], [392, 312], [438, 318], [452, 332], [428, 342], [366, 340], [328, 330]], false),
  laptop: "M300 270C300 266 302 264 306 264L378 262C382 262 384 264 384 268L386 316L298 318Z",
  laptopBase: smooth([[288, 320], [340, 318], [396, 320]]),
  logo: "M335 296l1-7 4 4 4-4 1 7c-1 3-9 3-10 0Z",
  blueNick: smooth([[398, 224], [412, 244], [418, 266]]),
  // cup
  cup: smooth([[592, 312], [594, 330], [598, 340], [618, 340], [622, 330], [624, 312]]),
  cupRim: smooth([[590, 311], [608, 314], [626, 311]]),
  handle: smooth([[623, 318], [636, 318], [638, 328], [627, 334]]),
  steam1: smooth([[602, 300], [598, 290], [606, 280], [600, 268], [606, 256]]),
  steam2: smooth([[616, 296], [620, 286], [612, 276], [619, 264]]),
};

export function FooterScene({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  usePauseOffscreen(ref);
  const ink = { stroke: "var(--figure-ink)", strokeLinecap: "round", strokeLinejoin: "round" } as const;

  return (
    <svg
      ref={ref}
      viewBox="20 74 620 290"
      fill="none"
      className={["footer-scene", className].filter(Boolean).join(" ")}
      data-footer-scene=""
      data-paused=""
      aria-hidden
    >
      {/* ground */}
      <g filter="url(#crayon)" strokeLinecap="round">
        <CrayonPad x={30} y={326} w={612} h={32} />
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
          <g className="mizu-tail" filter="url(#crayon)" {...ink}>
            <CrayonPad x={290} y={410} w={140} h={140} />
            <path d={MIZU_BODY.tail} strokeWidth="24" opacity="0.85" />
          </g>
          <g filter="url(#crayon)" {...ink}>
            <path d={MIZU_BODY.blue} stroke="var(--accent-blue)" strokeWidth="22" opacity="0.9" />
            <path d={MIZU_BODY.left} strokeWidth="22" />
            <path d={MIZU_BODY.right} strokeWidth="22" />
            <path d={MIZU_BODY.legL} strokeWidth="20" />
            <path d={MIZU_BODY.legR} strokeWidth="20" />
            <path d={MIZU_BODY.pawL} strokeWidth="16" fill="var(--figure-ink)" fillOpacity="0.55" />
            <path d={MIZU_BODY.pawR} strokeWidth="16" fill="var(--figure-ink)" fillOpacity="0.55" />
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
          <path d={S.teeL} strokeWidth="7" />
          <path d={S.teeR} strokeWidth="7" />
          <path d={S.sideL} strokeWidth="7" />
          <path d={S.sideR} strokeWidth="7" />
          <path d={S.armL} strokeWidth="5" />
          <path d={S.armR} strokeWidth="5" />
          <path d={S.legL} strokeWidth="7" />
          <path d={S.legR} strokeWidth="7" />
        </g>
        <path d={S.laptop} fill="var(--paper)" />
        <g filter="url(#crayon)" {...ink}>
          <path d={S.laptop} strokeWidth="7" />
          <path d={S.laptopBase} strokeWidth="7" />
          <path d={S.logo} strokeWidth="2.5" fill="var(--figure-ink)" />
        </g>
        <g className="nick-sit" transform="translate(256 66) scale(0.42)" style={{ "--ey": 5, "--ex": -2 } as React.CSSProperties}>
          <path d={NICK.faceFill} fill="var(--paper)" />
          <NickHead />
        </g>
      </g>

      {/* the tuxedo, asleep */}
      <g className="scene-tux" data-cursor="Zzz">
        <rect x="470" y="250" width="124" height="92" fill="transparent" />
        <g className="tux-breathe">
          <g filter="url(#crayon)" {...ink}>
            <path d={TUX_CURL.fur} strokeWidth="8" opacity="0.88" />
            <path d={TUX_CURL.body} strokeWidth="7" />
            <path d={TUX_CURL.tail} strokeWidth="11" />
          </g>
        </g>
        <g className="tux-head">
          <g transform="translate(456 268) scale(0.2)">
            <TuxedoHead solid />
          </g>
          <g filter="url(#crayon)" {...ink}>
            <path d={TUX_CURL.pawL} strokeWidth="4" fill="var(--paper)" />
            <path d={TUX_CURL.pawR} strokeWidth="4" fill="var(--paper)" />
          </g>
        </g>
        <g className="tux-z" {...ink} strokeWidth="3.2">
          {[0, 1, 2].map((i) => (
            <path key={i} className="tux-z-letter" style={{ animationDelay: `${i * 1.1}s` }} d="M520 276h8l-8 9h8" />
          ))}
        </g>
      </g>

      {/* cup + steam */}
      <g filter="url(#crayon)" {...ink}>
        <path d="M592 312L624 312L620 340L596 340Z" fill="var(--paper)" stroke="none" />
        <path d={S.cup} strokeWidth="6" />
        <path d={S.cupRim} strokeWidth="5" />
        <path d={S.handle} strokeWidth="5" />
      </g>
      <g filter="url(#crayon)" stroke="var(--accent-blue)" strokeWidth="5" strokeLinecap="round">
        <CrayonPad x={588} y={246} w={42} h={62} />
        <path className="scene-steam" d={S.steam1} />
        <path className="scene-steam" d={S.steam2} style={{ animationDelay: "-0.8s" }} />
      </g>
    </svg>
  );
}
