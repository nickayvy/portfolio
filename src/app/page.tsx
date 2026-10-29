export default function Home() {
  return (
    <main
      className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0a0a0b] text-[#f4f2ef]"
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
      <h1 className="relative px-6 text-center animate-[rise_1.1s_cubic-bezier(0.22,1,0.36,1)_both]">
        <span className="font-display text-[clamp(3.5rem,14vw,9rem)] leading-[0.95] tracking-[-0.03em] bg-linear-to-br from-[#f4f2ef] via-[#c9b8a8] to-[#f4f2ef] bg-size-[200%_auto] bg-clip-text text-transparent animate-[shimmer_8s_ease-in-out_infinite]">
          nickayy
        </span>
      </h1>
    </main>
  );
}
