"use client";

import { playSound } from "@/lib/sound";

export function PrintButton() {
  return (
    <button
      type="button"
      className="cs-textlink"
      data-cursor="Print"
      onClick={() => {
        playSound("paper");
        window.print();
      }}
    >
      Print
    </button>
  );
}
