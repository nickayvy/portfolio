"use client";

/**
 * Mobile menu (< md): a full-screen paper sheet that drops down under the
 * header with large staggered links, résumé, theme and sound controls.
 * Focus is trapped between the header bar and the sheet, Esc closes and
 * returns focus to the Menu button, and page scroll is locked while open.
 */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { nav } from "@/content/site";
import { SoundToggle, ThemeChoice } from "./Toggles";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({
  open,
  onClose,
  trapWith,
}: {
  open: boolean;
  onClose: (restoreFocus?: boolean) => void;
  trapWith: React.RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const links = [...nav.primary, nav.actions[1]];

  useEffect(() => {
    const root = document.documentElement;
    if (!open) {
      root.removeAttribute("data-menu-open");
      return;
    }
    root.setAttribute("data-menu-open", "");
    // move focus to the first link once the sheet starts to appear
    const t = window.setTimeout(() => ref.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true }), 60);

    const visible = (el: HTMLElement) => el.offsetParent !== null || el.getClientRects().length > 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose(true);
        return;
      }
      if (e.key !== "Tab") return;
      const items = [
        ...(trapWith.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
        ...(ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
      ].filter(visible);
      if (!items.length) return;
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : i === -1 || i === items.length - 1 ? 0 : i + 1;
      e.preventDefault();
      items[next].focus();
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => mq.matches && onClose();
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      root.removeAttribute("data-menu-open");
    };
  }, [open, onClose, trapWith]);

  return (
    <div
      ref={ref}
      id="mobile-menu"
      className="shell-menu"
      data-open={open ? "" : undefined}
      inert={!open}
      role="dialog"
      aria-modal={open ? "true" : undefined}
      aria-label="Menu"
    >
      <nav aria-label="Pages" className="shell-menu-links">
        {links.map((item, i) => (
          <Link key={item.href} href={item.href} style={{ "--i": i } as React.CSSProperties} onClick={() => onClose()}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="shell-menu-controls" style={{ "--i": links.length } as React.CSSProperties}>
        <ThemeChoice />
        <SoundToggle />
      </div>
    </div>
  );
}
