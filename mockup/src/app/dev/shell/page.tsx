import Link from "next/link";
import { sections } from "@/content/site";
import { SectionProgress } from "@/components/shell/SectionProgress";
import { SoundBoard } from "./SoundBoard";

export const metadata = { title: "Shell preview" };

/** Isolated preview for the shell package. Deleted before deploy. */
export default function ShellPreview() {
  return (
    <>
      <main>
        {sections.slice(0, -1).map((s, i) => (
          <section key={s.id} id={s.id} className="mx-auto max-w-[38rem] px-5 py-28 md:px-8" style={{ minHeight: i === 1 ? "180vh" : "110vh" }}>
            {i === 0 && <h1 className="sr-only">Shell preview</h1>}
            <h2 className="reveal text-[14px] leading-5 font-medium" style={{ "--i": 0 } as React.CSSProperties}>
              {String(i + 1).padStart(2, "0")} {s.label}
            </h2>
            {[1, 2, 3].map((n) => (
              <p key={n} className="reveal mt-6 text-muted" style={{ "--i": n } as React.CSSProperties}>
                Dummy paragraph {n} for #{s.id}. It reveals with a blur-fade once the loader is done and it scrolls into view.{" "}
                <a href="#contact" className="text-ink underline">
                  Jump to contact
                </a>
                .
              </p>
            ))}
            <div className="reveal mt-8 flex flex-wrap gap-3" style={{ "--i": 4 } as React.CSSProperties}>
              <span data-cursor="View project" className="rounded-2xl bg-ink px-6 py-10 text-paper">
                data-cursor=&quot;View project&quot;
              </span>
              <span data-cursor="Drag" className="rounded-2xl bg-surface px-6 py-10">
                data-cursor=&quot;Drag&quot;
              </span>
              <Link href="/dev/shell#experience" className="rounded-2xl bg-note px-6 py-10 underline" data-cursor="Link">
                Link to #experience
              </Link>
            </div>
            {i === 0 && <SoundBoard />}
            {i === 1 && (
              <div className="mt-10 h-[60vh] rounded-2xl bg-[linear-gradient(135deg,var(--accent-blue),var(--accent-red))]" />
            )}
          </section>
        ))}
      </main>
      <footer id="contact" className="mx-auto max-w-[38rem] px-5 pt-28 md:px-8">
        <h2 className="reveal text-[14px] font-medium">07 Say hello</h2>
        <p className="reveal mt-6" style={{ "--i": 1 } as React.CSSProperties}>
          Footer stand-in. <Link href="/">Home</Link> · <Link href="/playground">Playground</Link> ·{" "}
          <Link href="/resume">Résumé</Link>
        </p>
        <div data-footer-scene className="mt-16 h-[420px] w-[calc(100vw-2.5rem)] -translate-x-[calc((100vw-2.5rem-100%)/2)] rounded-xl border border-dashed border-rule" />
        <p className="py-10 text-xs text-muted">Footer scene placeholder above (data-footer-scene).</p>
      </footer>
      <SectionProgress />
    </>
  );
}
