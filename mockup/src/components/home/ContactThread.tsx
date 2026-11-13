"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Mascot } from "@/components/art/Mascot";
import { contact, person } from "@/content/site";
import { playSound } from "@/lib/sound";

type Phase = "idle" | "typing" | "said" | "replies";

/** The notebook chat sheet: typing dots, then the message pops in, then quick replies. */
export function ContactThread() {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("replies");
      return;
    }
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // Wait for the loader before playing the sequence if it is still up.
        const start = () => {
          setPhase("typing");
          timers.push(
            window.setTimeout(() => {
              setPhase("said");
              playSound("pop");
            }, 1300),
            window.setTimeout(() => setPhase("replies"), 1900),
          );
        };
        if (document.documentElement.dataset.ready === "true" || !document.querySelector("[data-loader]")) start();
        else timers.push(window.setTimeout(start, 600));
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const said = phase === "said" || phase === "replies";

  return (
    <div ref={ref} className="contact-sheet mt-8" data-phase={phase}>
      <div className="contact-holes" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <ol className="contact-thread" aria-live="polite">
        <li className="contact-msg">
          <span className="contact-avatar" aria-hidden>
            <Mascot className="h-full w-full" />
          </span>
          <div className="contact-bubbles">
            <span className="contact-typing" data-show={phase === "typing" || undefined} aria-hidden>
              <i />
              <i />
              <i />
            </span>
            {contact.thread.map((line) => (
              <p key={line} className="contact-bubble" data-show={said || undefined}>
                <span className="sr-only">{person.shortName} says: </span>
                {line}
              </p>
            ))}
          </div>
        </li>
        <li className="contact-replies" data-show={phase === "replies" || undefined}>
          <a href={`mailto:${person.email}`} className="contact-chip home-focus" data-cursor="Say hello">
            Email {person.shortName}
          </a>
          <Link href="/resume" className="contact-chip home-focus">
            View résumé
          </Link>
        </li>
      </ol>
    </div>
  );
}
