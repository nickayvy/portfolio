import type { Metadata } from "next";
import { MascotPropeller } from "@/components/art/Mascot";
import { Contact } from "@/components/home/Contact";
import { PlaygroundGrid } from "@/components/pages/PlaygroundGrid";
import { playground } from "@/content/site";

export const metadata: Metadata = {
  title: "Playground",
  description: "Explorations, experiments and things Nick made just because.",
};

export default function Playground() {
  return (
    <>
      <main className="px-5 pb-8 md:px-8">
        <div className="pg-wrap">
          <section className="pg-hero" aria-labelledby="pg-title">
            <h1 id="pg-title" className="pg-title reveal">
              Playgroun
              <span className="pg-d">
                d
                <span className="pg-perch" aria-hidden>
                  <span className="pg-teeter">
                    <MascotPropeller className="block h-auto w-full" />
                  </span>
                </span>
              </span>
            </h1>
          </section>
          <PlaygroundGrid items={playground} />
          <p className="pg-caption reveal">Explorations, experiments and things I made just because. Click any piece for a closer look.</p>
        </div>
      </main>
      <Contact />
    </>
  );
}
