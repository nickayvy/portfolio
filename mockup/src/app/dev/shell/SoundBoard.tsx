"use client";

import { playSound, type SoundName } from "@/lib/sound";

const names: SoundName[] = ["tap", "pop", "tick", "whoosh", "paper", "meow", "toggle"];

export function SoundBoard() {
  return (
    <div className="mt-8 flex flex-wrap gap-2 text-xs">
      {names.map((n) => (
        <button key={n} type="button" className="rounded-full bg-ink px-3 py-1.5 text-paper" onClick={() => playSound(n)}>
          {n}
        </button>
      ))}
    </div>
  );
}
