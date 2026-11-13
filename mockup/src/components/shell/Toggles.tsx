"use client";

/** Theme and sound controls shared by the desktop header and the mobile menu. */
import { setSoundOn, setTheme, toggleTheme, useSoundOn, useTheme } from "@/lib/prefs";
import { playSound, unlockAudio } from "@/lib/sound";

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="shell-theme-icon">
      <path d="M20.2 14.6A8.4 8.4 0 0 1 9.4 3.8a8.4 8.4 0 1 0 10.8 10.8Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="shell-theme-icon">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M5.4 18.6l1.5-1.5M17.1 6.9l1.5-1.5" />
    </svg>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      className={`shell-theme-toggle link-underline ${className}`}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => {
        toggleTheme();
        playSound("toggle");
      }}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
      <span>{dark ? "Light" : "Dark"}</span>
    </button>
  );
}

/** Segmented `Light / Dark` choice used in the mobile menu. */
export function ThemeChoice() {
  const theme = useTheme();
  return (
    <div role="group" aria-label="Colour theme" className="shell-menu-theme">
      <button
        type="button"
        aria-pressed={theme === "light"}
        onClick={() => {
          setTheme("light");
          playSound("toggle");
        }}
      >
        Light
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        aria-pressed={theme === "dark"}
        onClick={() => {
          setTheme("dark");
          playSound("toggle");
        }}
      >
        Dark
      </button>
    </div>
  );
}

export function SoundToggle({ className = "" }: { className?: string }) {
  const on = useSoundOn();
  return (
    <button
      type="button"
      className={className}
      aria-pressed={on}
      onClick={() => {
        const next = !on;
        setSoundOn(next);
        if (next) {
          unlockAudio();
          playSound("toggle");
        }
      }}
    >
      Sound {on ? "on" : "off"}
    </button>
  );
}
