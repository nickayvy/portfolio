import { Clients } from "@/components/home/Clients";
import { Contact } from "@/components/home/Contact";
import { Experience } from "@/components/home/Experience";
import { Intro } from "@/components/home/Intro";
import { KindWords } from "@/components/home/KindWords";
import { PlaygroundDial } from "@/components/home/PlaygroundDial";
import { Projects } from "@/components/home/Projects";
import { SectionProgress } from "@/components/shell/SectionProgress";

export default function Home() {
  return (
    <>
      <main>
        <Intro />
        <Projects />
        <Experience />
        <Clients />
        <KindWords />
        <PlaygroundDial />
      </main>
      <Contact />
      <SectionProgress />
    </>
  );
}
