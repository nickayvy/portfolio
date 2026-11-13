import { experience } from "@/content/site";

/** Experience (#experience): dashed-rule rows, company / role / dates. */
export function Experience() {
  return (
    <section id="experience" className="px-5 py-28 md:px-8" aria-labelledby="experience-h">
      <div className="mx-auto w-full max-w-[38rem]">
        <h2 id="experience-h" className="home-h2 reveal">
          Experience
        </h2>
        <ol className="xp-list mt-8">
          {experience.map((e, i) => (
            <li key={e.company + e.role} className="xp-row reveal" style={{ "--i": i + 1 } as React.CSSProperties}>
              <span className="xp-company">{e.company}</span>
              <span className="xp-role">{e.role}</span>
              <span className="xp-time">
                <time>{e.start}</time> – <time>{e.end}</time>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
