import { clients } from "@/content/site";

type Style = (typeof clients.items)[number]["style"];

/** Small abstract marks drawn beside the typographic placeholder wordmarks (not real logos). */
function Mark({ style }: { style: Style }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", "aria-hidden": true, className: "clients-mark" } as const;
  switch (style) {
    case "serif":
      return (
        <svg {...common}>
          <path d="M12 3 L21 20 H3 Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        </svg>
      );
    case "condensed":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" />
          <path d="M8 16V8l4 5 4-5v8" fill="none" stroke="var(--paper)" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "round":
      return (
        <svg {...common}>
          <path d="M3 15c3-4 6-4 9 0s6 4 9 0" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M3 9c3-4 6-4 9 0s6 4 9 0" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" opacity=".55" />
        </svg>
      );
    case "slab":
      return (
        <svg {...common}>
          <path d="M4 4h16v10l-8 6-8-6z" fill="currentColor" />
        </svg>
      );
    case "script":
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M7.5 14.5 12 8l4.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        </svg>
      );
  }
}

/** Clients (#clients): dashed 4-column grid with dots where the rules cross. */
export function Clients() {
  const items = clients.items;
  // the seat fills whatever is left of its row (4 columns desktop, 2 on mobile)
  const vars = {
    "--seat-d": 4 - (items.length % 4),
    "--seat-m": 2 - (items.length % 2),
    "--rows-d": Math.ceil((items.length + 1) / 4),
    "--rows-m": Math.ceil((items.length + 1) / 2),
  } as React.CSSProperties;
  return (
    <section id="clients" className="px-5 py-28 md:px-8" aria-labelledby="clients-h">
      <div className="mx-auto w-full max-w-[38rem]">
        <h2 id="clients-h" className="home-h2 reveal">
          {clients.heading}
        </h2>
        <div className="clients-wrap reveal mt-8" style={{ ...vars, "--i": 1 } as React.CSSProperties}>
          <ul className="clients-grid">
            {items.map((c) => (
              <li key={c.name} className="clients-cell" data-cursor={c.current ? "Current" : undefined}>
                <span className={`clients-word clients-word--${c.style}`}>
                  <Mark style={c.style} />
                  <span aria-hidden>{c.wordmark}</span>
                  <span className="sr-only">
                    {c.name}
                    {c.current ? " (current)" : ""}
                  </span>
                </span>
              </li>
            ))}
            <li className="clients-cell clients-seat">
              <div>
                <p className="text-[14px] leading-5 font-medium">{clients.seat.title}</p>
                <a href={clients.seat.href} className="clients-cta home-focus" data-cursor="Let’s talk">
                  {clients.seat.cta} <span className="link-arrow">→</span>
                </a>
              </div>
            </li>
          </ul>
          <span className="clients-dots" aria-hidden />
        </div>
      </div>
    </section>
  );
}
