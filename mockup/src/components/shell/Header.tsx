"use client";

/**
 * Fixed 64px site header. The bar is drawn in white with
 * `mix-blend-mode: difference`, so it reads as ink on paper in both themes and
 * stays legible over dark project covers. Below `md` it collapses to the
 * signature, a `Say hello` pill and a `Menu` button that opens <MobileMenu/>.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Signature } from "@/components/art/Signature";
import { nav, person } from "@/content/site";
import { playSound } from "@/lib/sound";
import { Clock } from "./Clock";
import { MobileMenu } from "./MobileMenu";
import { SoundToggle, ThemeToggle } from "./Toggles";

const [hello, resume] = nav.actions;

export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => menuButton.current?.focus());
  }, []);

  // close on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="shell-header" data-menu-open={open ? "" : undefined}>
        <header ref={barRef} className="shell-header-bar reveal" style={{ "--i": 0 } as React.CSSProperties}>
          <div className="shell-header-left">
            <Link href="/" aria-label={`${person.name} — home`} className="shell-logo">
              <Signature className="shell-logo-signature" />
            </Link>
            <nav aria-label="Primary" className="shell-nav">
              {nav.primary.map((item) => (
                <Link key={item.href} href={item.href} className="link-underline">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="shell-header-right">
            <a href={hello.href} className="shell-hello-pill" data-cursor={hello.cursor}>
              {hello.label}
            </a>
            <a href={hello.href} className="link-underline shell-ink shell-desktop" data-cursor={hello.cursor}>
              {hello.label}
            </a>
            <Link href={resume.href} className="link-underline shell-ink shell-desktop">
              {resume.label}
            </Link>
            <SoundToggle className="link-underline shell-desktop" />
            <ThemeToggle className="shell-desktop" />
            <Clock className="shell-wide" />
            <button
              ref={menuButton}
              type="button"
              className="link-underline shell-ink shell-menu-button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => {
                setOpen((o) => !o);
                playSound("paper");
              }}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </header>
      </div>
      <MobileMenu open={open} onClose={close} trapWith={barRef} />
    </>
  );
}
