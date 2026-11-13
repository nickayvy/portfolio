import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/pages/PrintButton";
import { person, resume } from "@/content/site";

export const metadata: Metadata = {
  title: "Résumé",
  description: `${person.name}, ${person.role} in ${person.location}.`,
};

const strip = (href: string) => href.replace(/^https?:\/\//, "").replace(/\/$/, "");

export default function Resume() {
  const links = [
    { label: person.email, href: `mailto:${person.email}` },
    { label: strip(person.currentSite), href: person.currentSite },
    { label: strip(person.linkedin.href).replace(/^www\./, ""), href: person.linkedin.href },
    { label: strip(person.github.href), href: person.github.href },
  ];

  return (
    <main className="rs-page px-5 pt-[104px] pb-28 md:px-8 md:pt-[120px]">
      <div className="mx-auto w-full max-w-[46rem]">
        <div className="rs-actions reveal">
          <Link href="/" className="cs-back">
            <span className="cs-arrow" aria-hidden>
              ←
            </span>
            Home
          </Link>
          <div className="rs-actions-right">
            <PrintButton />
            <a href="/resume.pdf" download className="pill" data-cursor="Download">
              Download PDF <span className="pill-arrow" aria-hidden>↓</span>
            </a>
          </div>
        </div>

        <article className="rs-sheet reveal" style={{ "--i": 1 } as React.CSSProperties} aria-labelledby="rs-name">
          <header>
            <h1 id="rs-name" className="rs-name">
              {person.fullName}
            </h1>
            <p className="rs-sub">
              {person.role} · {person.location}
            </p>
            <ul className="rs-contact">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </header>

          <section aria-labelledby="rs-edu">
            <h2 id="rs-edu" className="rs-h2">
              Education
            </h2>
            {resume.education.map((e) => (
              <div key={e.school} className="rs-item">
                <div className="rs-item-head">
                  <b>{e.school}</b>
                  <span>{e.dates}</span>
                </div>
                <div className="rs-item-head">
                  <span className="!text-ink">{e.degree}</span>
                  <span>{e.place}</span>
                </div>
              </div>
            ))}
          </section>

          <section aria-labelledby="rs-exp">
            <h2 id="rs-exp" className="rs-h2">
              Experience
            </h2>
            {resume.experience.map((x) => (
              <div key={x.company} className="rs-item">
                <div className="rs-item-head">
                  <b>{x.company}</b>
                  <span>{x.dates}</span>
                </div>
                <div className="rs-item-head">
                  <span className="!text-ink">{x.role}</span>
                  <span>{x.place}</span>
                </div>
                <ul>
                  {x.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section aria-labelledby="rs-skills">
            <h2 id="rs-skills" className="rs-h2">
              Skills
            </h2>
            <dl className="rs-skills">
              {resume.skills.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </section>
        </article>
      </div>
    </main>
  );
}
