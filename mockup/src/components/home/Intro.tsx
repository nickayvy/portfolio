import { Mascot } from "@/components/art/Mascot";
import { cta } from "@/content/site";
import { Bio } from "./intro/Bio";
import { Greeting } from "./intro/Greeting";
import { PhotoStack } from "./intro/PhotoStack";
import { PinnedNote } from "./intro/PinnedNote";

/** Home hero: mascot + photo stack, cycling greeting, intro copy, CTA and pinned note. */
export function Intro() {
  return (
    <section id="intro" aria-label="Introduction" className="intro px-5 pt-32 pb-20 md:px-8 md:pt-[16vh] md:pb-28">
      <div className="mx-auto flex w-full max-w-[38rem] flex-col">
        <h1 className="sr-only">Nick Nguyen, software engineer</h1>
        <div className="reveal flex items-end justify-between" style={{ "--i": 1 } as React.CSSProperties}>
          <Mascot interactive className="intro-mascot -ml-2 h-auto w-[clamp(84px,9vw,112px)]" />
          <PhotoStack />
        </div>
        <div className="reveal mt-8" style={{ "--i": 2 } as React.CSSProperties}>
          <Greeting />
        </div>
        <div className="mt-5">
          <Bio />
        </div>
        <div className="reveal mt-9 flex flex-wrap items-start gap-x-10 gap-y-8" style={{ "--i": 4 } as React.CSSProperties}>
          <div className="flex flex-col items-start gap-3">
            <a href={cta.href} className="intro-cta" data-cursor={cta.cursor}>
              {cta.label}
              <span className="intro-cta-arrow" aria-hidden>
                <span>→</span>
                <span>→</span>
              </span>
            </a>
            <span className="flex items-center gap-2 text-xs text-muted">
              <span className="status-dot" aria-hidden />
              {cta.status}
            </span>
          </div>
          <PinnedNote />
        </div>
      </div>
    </section>
  );
}
