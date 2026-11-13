import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Doodle } from "@/components/art/Doodle";
import { intro, type IntroToken } from "@/content/site";

/**
 * The three intro paragraphs, rendered from tokens. Every word is its own span so the
 * copy can blur in word by word once the loader lifts (see intro.css: the animation
 * keys off html[data-ready] and has a 3s fallback so it never stays hidden).
 */
export function Bio() {
  let w = 0;
  const word = (content: ReactNode, key: string) => (
    <span key={key} className="hero-word" style={{ "--w": w++ } as CSSProperties}>
      {content}
    </span>
  );
  // spaces stay plain text between the word boxes, so they wrap and collapse naturally
  // (and an underlined link never drags its underline past a line end)
  const words = (text: string, key: string) =>
    text
      .split(/(\s+)/)
      .filter(Boolean)
      .map((t, j) => (/^\s+$/.test(t) ? " " : word(t, `${key}-${j}`)));

  const render = (tok: IntroToken, key: string): ReactNode => {
    if (typeof tok === "string") return words(tok, key);
    if ("doodle" in tok) return word(<Doodle name={tok.doodle} />, key);
    const inner = words(tok.link, key);
    return tok.href.startsWith("/") ? (
      <Link key={key} href={tok.href} className="hero-link">
        {inner}
      </Link>
    ) : (
      <a key={key} href={tok.href} className="hero-link">
        {inner}
      </a>
    );
  };

  return (
    <div className="hero-bio">
      {intro.map((para, p) => (
        <p key={p}>{para.map((tok, t) => render(tok, `${p}-${t}`))}</p>
      ))}
    </div>
  );
}
