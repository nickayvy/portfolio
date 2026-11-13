import { Clients } from "@/components/home/Clients";
import { Contact } from "@/components/home/Contact";
import { Experience } from "@/components/home/Experience";
import { KindWords } from "@/components/home/KindWords";
import { PlaygroundDial } from "@/components/home/PlaygroundDial";
import { Projects } from "@/components/home/Projects";

/** Isolated preview of the HOME package (deleted before deploy). */
export default function DevHome() {
  return (
    <>
      <main>
        <section id="intro" className="grid min-h-[90vh] place-items-center px-5 text-sm text-muted">
          Intro placeholder (art engineer)
        </section>
        <Projects />
        <Experience />
        <Clients />
        <KindWords />
        <PlaygroundDial />
      </main>
      <Contact />
    </>
  );
}
