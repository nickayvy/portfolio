const links = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nicholas-nguyen-445a29249",
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/nickayvy",
    external: true,
  },
  {
    label: "Resume",
    href: "/resume.pdf",
    external: true,
  },
] as const;

export default function Home() {
  return (
    <main
      className="relative flex min-h-dvh flex-col items-center justify-center gap-12 overflow-hidden bg-[#0a0a0b] px-6 py-16 text-[#f4f2ef]"
      aria-label="Home"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35 mix-blend-overlay"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="pointer-events-none absolute -left-[10%] top-[20%] h-[min(70vw,520px)] w-[min(70vw,520px)] rounded-full opacity-45 blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, #c45c3e 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[5%] bottom-[10%] h-[min(70vw,520px)] w-[min(70vw,520px)] rounded-full opacity-45 blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, #3d5a80 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <h1 className="relative text-center animate-[rise_1.1s_cubic-bezier(0.22,1,0.36,1)_both]">
        <span className="font-display text-[clamp(3.5rem,14vw,9rem)] leading-[0.95] tracking-[-0.03em] bg-linear-to-br from-[#f4f2ef] via-[#c9b8a8] to-[#f4f2ef] bg-size-[200%_auto] bg-clip-text text-transparent animate-[shimmer_8s_ease-in-out_infinite]">
          nickayy
        </span>
      </h1>

      <nav
        className="relative flex flex-wrap items-center justify-center gap-3 sm:gap-4 animate-[rise_1.1s_cubic-bezier(0.22,1,0.36,1)_both] [animation-delay:120ms]"
        aria-label="Contact and profiles"
      >
        {links.map(({ label, href, external }) => (
          <a
            key={label}
            href={href}
            className="rounded-full border border-[#f4f2ef]/15 bg-[#f4f2ef]/5 px-5 py-2.5 text-sm font-medium tracking-wide text-[#f4f2ef]/90 backdrop-blur-sm transition-colors hover:border-[#c9b8a8]/40 hover:bg-[#f4f2ef]/10 hover:text-[#f4f2ef] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9b8a8]"
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {label}
          </a>
        ))}
      </nav>
    </main>
  );
}
