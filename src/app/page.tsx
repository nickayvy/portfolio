import { HeroCharacters } from "@/components/hero-characters";

const links = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nicholas-nguyen-445a29249",
  },
  { label: "Resume", href: "/resume.pdf" },
];

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-4 fill-current">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-x-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ece9e1_1px,transparent_1px),linear-gradient(to_bottom,#ece9e1_1px,transparent_1px)] bg-size-[48px_48px]"
      />

      <header className="relative z-20 flex items-center justify-between px-6 pt-6 text-sm sm:px-8 sm:pt-7">
        <span className="flex items-center gap-2 font-medium tracking-wide">
          <span className="size-2 rounded-full border-[1.5px] border-current" />
          NICK
        </span>
        <nav
          className="flex items-center gap-5 text-[#3a3a3a]"
          aria-label="Profiles"
        >
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
          <a
            href="https://github.com/nickayvy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <GitHubIcon />
            github.com/nickayvy
          </a>
        </nav>
      </header>

      <section className="relative z-[1] flex flex-1 items-start px-6 pt-[9vh] pb-32 sm:px-8">
        <h1 className="relative text-[clamp(4.5rem,17vw,15rem)] font-bold leading-[0.86] tracking-[-0.05em]">
          <span className="block">Nick</span>
          <span className="relative z-[2] inline-block">
            makes
            <HeroCharacters />
          </span>
          <span className="block">things.</span>
        </h1>
      </section>

      <footer className="relative z-20 flex flex-wrap items-baseline gap-x-6 gap-y-1 px-6 pb-6 sm:px-8">
        <span className="text-lg font-bold">nickayy</span>
        <span className="text-xs tracking-[0.25em] text-[#9a9a9a]">
          SOFTWARE ENGINEER / SDSU CS / SAN DIEGO
        </span>
      </footer>
    </main>
  );
}
