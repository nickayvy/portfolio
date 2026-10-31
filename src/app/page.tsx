import { HeroCharacters } from "@/components/hero-characters";
import { ScrollRoll } from "@/components/scroll-roll";
import { SectionTabs } from "@/components/section-tabs";

type LinkItem = { label: string; handle: string; href: string; icon: string };

const about: LinkItem[] = [
  {
    label: "Resume",
    handle: "PDF",
    href: "/resume.pdf",
    icon: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  },
];

const contacts: LinkItem[] = [
  {
    label: "Email",
    handle: "hello@nickayy.dev",
    href: "mailto:hello@nickayy.dev",
    icon: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z",
  },
  {
    label: "GitHub",
    handle: "@nickayvy",
    href: "https://github.com/nickayvy",
    icon: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  {
    label: "LinkedIn",
    handle: "Nicholas Nguyen",
    href: "https://www.linkedin.com/in/nicholas-nguyen-445a29249",
    icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

const ease = "ease-[cubic-bezier(.19,1,.22,1)]";

function LinkRows({ items }: { items: LinkItem[] }) {
  return (
    <ul className="border-t border-[#e8e8e8]">
      {items.map(({ label, handle, href, icon }, index) => (
        <li key={label}>
          <a
            href={href}
            {...(!href.startsWith("mailto:") && { target: "_blank", rel: "noopener noreferrer" })}
            className={`group grid grid-cols-[36px_28px_minmax(120px,.45fr)_minmax(0,1fr)_20px] items-center gap-4 border-b border-[#e8e8e8] px-1 py-[26px] transition-[padding] duration-700 ${ease} hover:pl-[22px] max-[760px]:grid-cols-[32px_minmax(max-content,.45fr)_minmax(0,1fr)_18px] max-[760px]:gap-2.5 max-[760px]:px-0 max-[760px]:py-[18px]`}
          >
            <span
              className={`inline-flex size-9 items-center justify-center rounded-[11px] border border-[#e8e8e8] text-foreground transition-[background-color,border-color,rotate,scale] duration-500 ${ease} group-hover:-rotate-6 group-hover:scale-[1.07] group-hover:border-[#ffe28a] group-hover:bg-[#ffe28a] max-[760px]:size-8 max-[760px]:rounded-[10px]`}
            >
              <svg viewBox="0 0 24 24" aria-hidden className="size-[17px] fill-current">
                <path d={icon} />
              </svg>
            </span>
            <span className="font-mono text-xs tracking-[0.08em] text-[#999] max-[760px]:hidden">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className={`justify-self-start bg-[linear-gradient(#ffe28a,#ffe28a)] bg-size-[0_42%] bg-position-[0_68%] bg-no-repeat text-[clamp(22px,3.2vw,28px)] font-extrabold tracking-[-0.02em] text-foreground transition-[background-size] duration-600 ${ease} group-hover:bg-size-[100%_42%] max-[760px]:text-lg max-[760px]:whitespace-nowrap`}
            >
              {label}
            </span>
            <span
              className={`min-w-0 truncate font-mono text-[13px] text-[#999] transition-colors duration-500 ${ease} group-hover:text-foreground max-[760px]:text-[10.5px]`}
            >
              {handle}
            </span>
            <span
              className={`-translate-x-2 text-xl text-foreground opacity-0 transition-[opacity,translate] duration-700 ${ease} group-hover:translate-x-0 group-hover:opacity-100 max-[760px]:translate-x-0 max-[760px]:text-[17px] max-[760px]:opacity-100`}
            >
              →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

const sections = [
  {
    id: "about",
    label: "About",
    body: <LinkRows items={about} />,
  },
  {
    id: "work",
    label: "Work",
    body: "Selected projects will go here.",
  },
  {
    id: "contact",
    label: "Contact",
    body: <LinkRows items={contacts} />,
  },
];

const lineMask = "-mb-[.2em] block overflow-hidden pb-[.2em]";
const lineLift =
  "block animate-lift in-[.is-booting]:[animation-play-state:paused] motion-reduce:animate-none";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-x-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ece9e1_1px,transparent_1px),linear-gradient(to_bottom,#ece9e1_1px,transparent_1px)] bg-size-[48px_48px]"
      />

      <div className="relative mx-auto flex w-full max-w-[820px] flex-1 flex-col px-8 max-[760px]:px-5">
        <section data-roll className="relative z-[1] flex flex-1 items-start pt-[9vh] pb-32">
          <h1 className="relative text-[clamp(72px,12vw,140px)] font-bold leading-[0.86] tracking-[-0.05em]">
            <span className={lineMask}>
              <span className={`${lineLift} [animation-delay:.1s]`}>Nick</span>
            </span>
            <span className="relative z-[2] inline-block">
              <span className={lineMask}>
                <span className={`${lineLift} [animation-delay:.24s]`}>
                  makes
                </span>
              </span>
              <HeroCharacters />
            </span>
            <span className={lineMask}>
              <span className={`${lineLift} [animation-delay:.38s]`}>
                things.
              </span>
            </span>
          </h1>
        </section>

        <div data-roll className="relative z-20">
          <footer className="flex animate-fadeup flex-wrap items-baseline gap-x-6 gap-y-1 pb-6 in-[.is-booting]:[animation-play-state:paused] motion-reduce:animate-none">
            <span className="text-xs tracking-[0.25em] text-[#9a9a9a]">
              ENGINEER / SAN DIEGO
            </span>
          </footer>
        </div>

        <SectionTabs sections={sections} />
      </div>
      <ScrollRoll />
    </main>
  );
}
