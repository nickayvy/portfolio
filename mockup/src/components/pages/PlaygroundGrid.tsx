"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PlayItem } from "@/content/site";
import { PlayPiece } from "@/components/pages/PlayPiece";
import { playSound } from "@/lib/sound";

const HASH = "#view-";
/** aspect ratio of the lightbox stage per tile size */
const AR: Record<PlayItem["size"], number> = { 1: 1, 2: 16 / 9, 3: 1 };

const idFromHash = (items: PlayItem[]) => {
  const h = window.location.hash;
  if (!h.startsWith(HASH)) return -1;
  const id = decodeURIComponent(h.slice(HASH.length));
  return items.findIndex((i) => i.id === id);
};

/**
 * Dense bento grid of playground pieces plus the lightbox.
 * The lightbox is a native modal <dialog> (focus containment, Esc, inert page).
 * Its state lives in the URL hash `#view-<id>` so pieces are deep-linkable.
 */
export function PlaygroundGrid({ items }: { items: PlayItem[] }) {
  const [index, setIndex] = useState(-1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const returnTo = useRef(-1);
  const openRef = useRef(-1);
  openRef.current = index;

  const writeHash = (i: number) => {
    const url = i < 0 ? window.location.pathname + window.location.search : `${HASH}${items[i].id}`;
    window.history.replaceState(window.history.state, "", url);
  };

  const open = useCallback(
    (i: number, fromTile = true) => {
      if (fromTile) returnTo.current = i;
      setIndex(i);
      writeHash(i);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items],
  );

  const close = useCallback(() => {
    if (openRef.current < 0) return;
    const back = returnTo.current >= 0 ? returnTo.current : openRef.current;
    setIndex(-1);
    writeHash(-1);
    playSound("whoosh");
    // move focus back to the tile that opened it (or the one last shown)
    requestAnimationFrame(() => tileRefs.current[back]?.focus({ preventScroll: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const step = useCallback(
    (d: number) => {
      if (openRef.current < 0) return;
      const n = (openRef.current + d + items.length) % items.length;
      returnTo.current = n;
      setIndex(n);
      writeHash(n);
      playSound("tick");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items],
  );

  // open from the hash on load and on hash changes (links from the home dial)
  useEffect(() => {
    const sync = () => {
      const i = idFromHash(items);
      if (i >= 0) {
        returnTo.current = i;
        setIndex(i);
        tileRefs.current[i]?.scrollIntoView({ block: "center" });
      } else if (openRef.current >= 0) {
        setIndex(-1);
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [items]);

  // show / hide the native dialog, lock page scroll while open
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index >= 0 && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
      playSound("whoosh");
    } else if (index < 0 && d.open) {
      d.close();
    }
    if (index < 0) document.documentElement.style.overflow = "";
  }, [index]);

  useEffect(() => () => void (document.documentElement.style.overflow = ""), []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const item = index >= 0 ? items[index] : null;

  return (
    <>
      <ul className="pg-grid" aria-label="Playground pieces">
        {items.map((it, i) => (
          <li key={it.id} data-size={it.size} className="reveal" style={{ "--i": Math.min(i, 8) } as React.CSSProperties}>
            <button
              ref={(el) => {
                tileRefs.current[i] = el;
              }}
              type="button"
              className="pg-tile"
              data-cursor="View"
              aria-label={`View ${it.title}`}
              aria-haspopup="dialog"
              onClick={() => {
                playSound("tap");
                open(i);
              }}
            >
              <PlayPiece item={it} />
              <span className="pg-tile-label" aria-hidden>
                {it.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lb"
        aria-labelledby="lb-title"
        aria-describedby="lb-note"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onKeyDown={onKeyDown}
        onClick={(e) => {
          // backdrop / empty space closes; the media and the bar do not
          const t = e.target as HTMLElement;
          if (t === e.currentTarget || t.classList.contains("lb-inner") || t.classList.contains("lb-stage")) close();
        }}
      >
        {item && (
          <div className="lb-inner">
            <div className="lb-stage">
              <div key={item.id} className="lb-media" style={{ "--ar": AR[item.size] } as React.CSSProperties}>
                <PlayPiece item={item} />
              </div>
            </div>
            <div className="lb-info">
              <h2 id="lb-title">{item.title}</h2>
              <p id="lb-note">{item.note}</p>
              <div className="lb-bar">
                <button type="button" onClick={() => step(-1)} aria-label="Previous piece" data-cursor="Prev">
                  ← Prev
                </button>
                <span className="lb-count" aria-live="polite">
                  {index + 1} / {items.length}
                </span>
                <button type="button" onClick={() => step(1)} aria-label="Next piece" data-cursor="Next">
                  Next →
                </button>
                <button type="button" onClick={close} data-cursor="Close" autoFocus>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
