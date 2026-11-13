import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contact } from "@/components/home/Contact";
import { ProjectCover } from "@/components/home/ProjectCover";
import { CaseContents } from "@/components/pages/CaseContents";
import { RichText } from "@/components/pages/RichText";
import { getCaseStudy } from "@/content/case-studies";
import { cta, nav, projects } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
}

const hostOf = (href: string) => {
  try {
    const u = new URL(href);
    return `${u.host}${u.pathname === "/" ? "" : u.pathname}`;
  } catch {
    return href;
  }
};

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  const study = getCaseStudy(slug);
  if (!project || !study) notFound();
  const next = projects[(index + 1) % projects.length];
  const sayHello = nav.actions[0];

  const contents = [
    { id: "overview", label: "Overview" },
    ...study.sections.map((s) => ({ id: s.id, label: s.title })),
    ...(project.links.length ? [{ id: "links", label: "Links" }] : []),
  ];

  let i = 0; // reveal stagger
  const r = () => ({ "--i": i++ }) as React.CSSProperties;

  return (
    <>
      <main className="px-5 pt-[104px] pb-8 md:px-8 md:pt-[120px]">
        <div className="cs-layout">
          <CaseContents items={contents} />

          <article className="cs-main">
            <section id="overview" aria-labelledby="cs-title">
              <Link href="/#work" className="cs-back reveal" style={r()} data-cursor="Back">
                <span className="cs-arrow" aria-hidden>
                  ←
                </span>
                Featured projects
              </Link>
              <h1 id="cs-title" className="cs-title reveal" style={r()}>
                {project.title}
              </h1>
              <p className="cs-summary reveal" style={r()}>
                {project.summary}
              </p>

              <dl className="cs-meta reveal" style={r()}>
                <div>
                  <dt>Role</dt>
                  <dd>{project.role}</dd>
                </div>
                <div>
                  <dt>Context</dt>
                  <dd>{project.context}</dd>
                </div>
                <div>
                  <dt>Stack</dt>
                  <dd>{project.stack.join(", ")}</dd>
                </div>
                <div>
                  <dt>Results</dt>
                  <dd>
                    <mark className="cs-mark">{project.results}</mark>
                  </dd>
                </div>
                {project.links.length > 0 && (
                  <div>
                    <dt>Links</dt>
                    <dd className="cs-meta-links">
                      {project.links.map((l) => (
                        <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="cs-link" data-cursor="Visit">
                          {l.label} <span aria-hidden>↗</span>
                        </a>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>

              <figure className="cs-figure reveal" style={r()}>
                <div className="cs-frame">
                  <ProjectCover project={project} slide={0} />
                </div>
                <figcaption className="cs-caption">{study.heroCaption}</figcaption>
              </figure>
            </section>

            {study.sections.map((s) => (
              <section key={s.id} id={s.id} className="cs-section" aria-labelledby={`${s.id}-h`}>
                <h2 id={`${s.id}-h`} className="cs-h2 reveal">
                  {s.title}
                </h2>
                <div className="cs-body reveal" style={{ "--i": 1 } as React.CSSProperties}>
                  {s.body.map((p, k) => (
                    <p key={k}>
                      <RichText text={p} />
                    </p>
                  ))}
                </div>
                {s.figure && s.figure.slide < project.slides && (
                  <figure className="cs-figure reveal">
                    <div className="cs-frame">
                      <ProjectCover project={project} slide={s.figure.slide} />
                    </div>
                    <figcaption className="cs-caption">{s.figure.caption}</figcaption>
                  </figure>
                )}
              </section>
            ))}

            {project.links.length > 0 && (
              <section id="links" className="cs-section" aria-labelledby="links-h">
                <h2 id="links-h" className="cs-h2 reveal">
                  Links
                </h2>
                <dl className="cs-linklist reveal">
                  {project.links.map((l) => (
                    <div key={l.label} className="contents">
                      <dt>{l.label}</dt>
                      <dd>
                        <a href={l.href} target="_blank" rel="noreferrer" data-cursor="Visit">
                          {hostOf(l.href)} <span aria-hidden>↗</span>
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <aside className="cs-card reveal" aria-labelledby="cs-hire">
              <h2 id="cs-hire">Hiring a software engineer?</h2>
              <p>{cta.status}. If this is the kind of work your team needs, let’s talk.</p>
              <div className="cs-card-actions">
                <a href={sayHello.href} className="pill" data-cursor={sayHello.cursor}>
                  Say hello <span className="pill-arrow" aria-hidden>↗</span>
                </a>
                <Link href="/resume" className="cs-textlink" data-cursor="Résumé">
                  View résumé <span className="pill-arrow" aria-hidden>↗</span>
                </Link>
              </div>
            </aside>

            <Link href={`/work/${next.slug}`} className="cs-next reveal" data-cursor="Next project">
              <span className="cs-next-label">Next project</span>
              <span className="block">
                <span className="cs-next-title">
                  {next.title}
                  <span className="cs-arrow" aria-hidden>
                    →
                  </span>
                </span>
              </span>
              <span className="cs-frame block" aria-hidden>
                <ProjectCover project={next} slide={0} />
              </span>
            </Link>
          </article>
        </div>
      </main>
      <Contact />
    </>
  );
}
