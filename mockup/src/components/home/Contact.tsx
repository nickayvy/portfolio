import { FooterScene } from "@/components/art/FooterScene";
import { contact } from "@/content/site";
import { ContactThread } from "./ContactThread";

/** Evaluated when the page is prerendered, so it reads as the build date. */
const BUILT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "America/Los_Angeles",
}).format(new Date());

const isExternal = (href: string) => /^https?:/.test(href);

/** Shared closing section + footer (#contact), used on home, case study and playground pages. */
export function Contact() {
  return (
    <footer id="contact" className="px-5 pt-28 pb-8 md:px-8" aria-labelledby="contact-h">
      <div className="mx-auto w-full max-w-[38rem]">
        <h2 id="contact-h" className="home-h2 reveal">
          {contact.heading}
        </h2>

        <div className="reveal" style={{ "--i": 1 } as React.CSSProperties}>
          <ContactThread />
        </div>

        <dl className="contact-list">
          {contact.rows.map((row, i) => (
            <div key={row.label} className="contact-row reveal" style={{ "--i": i + 2 } as React.CSSProperties}>
              <dt className="text-muted">{row.label}</dt>
              <dd>
                {row.kind === "text" ? row.value : null}
                {row.kind === "mail" ? (
                  <a href={row.href} className="home-underline home-focus" data-cursor="Say hello">
                    {row.value}
                  </a>
                ) : null}
                {row.kind === "links"
                  ? row.links.map((l, k) => (
                      <span key={l.href}>
                        {k > 0 ? <span className="contact-sep" aria-hidden>·</span> : null}
                        <a
                          href={l.href}
                          className="contact-link home-focus"
                          {...(isExternal(l.href) ? { target: "_blank", rel: "noreferrer" } : {})}
                        >
                          <span className="home-underline">{l.label}</span>
                          <span className="contact-arrow" aria-hidden>
                            ↗
                          </span>
                          {isExternal(l.href) ? <span className="sr-only"> (opens in a new tab)</span> : null}
                        </a>
                      </span>
                    ))
                  : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="contact-scene reveal">
        <FooterScene className="mx-auto mt-16 block h-auto w-full max-w-[46rem]" />
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-[38rem] flex-wrap items-end justify-between gap-x-6 gap-y-3 text-[12px] leading-4 text-muted">
        <div className="space-y-1">
          <p>{contact.footnote}</p>
          <p>
            {contact.copyright}
            <span className="mx-2" aria-hidden>
              ·
            </span>
            Last updated <time dateTime={new Date().toISOString().slice(0, 10)}>{BUILT}</time>
          </p>
        </div>
        <a href="#top" className="home-underline home-focus">
          Back to top <span aria-hidden>↑</span>
        </a>
      </div>
    </footer>
  );
}
