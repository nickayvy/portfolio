import { CrayonPad } from "./CrayonDefs";
import { NICK } from "./nick";

/**
 * Nick's crayon head as an SVG group in a 400×400 box (no <svg> wrapper), so it can be
 * reused by the mascot, the propeller variant and the footer scene.
 * Eyes read `--ex`/`--ey` (user units) for gaze, and `.nick-eyes[data-shut]` blinks.
 */
export function NickHead({ hair = true, blue = true }: { hair?: boolean; blue?: boolean }) {
  return (
    <g className="nick-head">
      {blue && (
        <g filter="url(#crayon)" stroke="var(--accent-blue)" strokeWidth="15" strokeLinecap="round" opacity="0.9">
          <path d={NICK.blueHair} />
          <path d={NICK.blueJaw} />
        </g>
      )}
      <g filter="url(#crayon)" stroke="var(--figure-ink)" strokeLinecap="round" strokeLinejoin="round">
        <path d={NICK.face} strokeWidth="13" />
        <path d={NICK.faceRight} strokeWidth="13" />
        <path d={NICK.ear} strokeWidth="12" />
        <path d={NICK.earCurl} strokeWidth="10" />
        {hair && (
          <>
            <path d={NICK.hairFill} strokeWidth="10" stroke="var(--hair-fill)" />
            <path d={NICK.hairOuter} strokeWidth="11" />
            <path d={NICK.hairInner} strokeWidth="10" />
            {NICK.hairCurls.map((d, i) => (
              <path key={i} d={d} strokeWidth="8" />
            ))}
          </>
        )}
        <path d={NICK.nose} strokeWidth="11" />
        <path d={NICK.smile} strokeWidth="11" />
      </g>
      <g className="nick-eyes" filter="url(#crayon)" stroke="var(--figure-ink)" strokeLinecap="round">
        <CrayonPad x={130} y={205} w={150} h={60} />
        <g className="nick-pupils">
          <path d={`M${NICK.pupilL[0]} ${NICK.pupilL[1]}h0.5`} strokeWidth="29" />
          <path d={`M${NICK.pupilR[0]} ${NICK.pupilR[1]}h0.5`} strokeWidth="29" />
        </g>
        <g className="nick-squint" strokeWidth="11" strokeLinejoin="round">
          <path d={NICK.squintL} />
          <path d={NICK.squintR} />
        </g>
        <g className="nick-lids" strokeWidth="11">
          <path d={NICK.blinkL} />
          <path d={NICK.blinkR} />
        </g>
      </g>
      <g filter="url(#crayon)" stroke="var(--accent-red)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round">
        <path d={NICK.lensL} />
        <path d={NICK.lensR} />
        <path d={NICK.bridge} />
        <path d={NICK.armL} />
        <path d={NICK.armR} />
      </g>
    </g>
  );
}
