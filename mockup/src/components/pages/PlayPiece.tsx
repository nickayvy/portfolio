import type { PlayItem } from "@/content/site";

/**
 * STUB (pages engineer owns). Renders one playground piece: the real asset when
 * item.asset is set, otherwise generated placeholder art for item.id.
 * Contract: fills its positioned parent (absolute inset-0), object-cover.
 */
export function PlayPiece({ item }: { item: PlayItem }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[var(--paper-fold)] text-xs text-muted">
      {item.title}
    </div>
  );
}
