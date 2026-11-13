"use client";

import { useEffect, useRef, useState } from "react";
import type { PlayItem } from "@/content/site";
import { PlayArt } from "@/components/pages/PlayArt";
import { PlaySprite } from "@/components/pages/PlaySprite";

/** Transparent cut-outs read better contained on their tone than cropped. */
const CONTAIN = new Set(["loader-mark", "siamese-front"]);

/**
 * Renders one playground piece: the real asset when item.asset is set, otherwise
 * generated placeholder art for item.id.
 * Contract: fills its positioned parent (absolute inset-0). Looping motion pauses
 * while the piece is off screen and is removed under reduced motion.
 */
export function PlayPiece({ item }: { item: PlayItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const asset = item.asset;
  return (
    <div ref={ref} className="pp" data-tone={item.tone} data-inview={inView ? "true" : "false"} data-piece={item.id}>
      {asset?.type === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset.src}
          alt=""
          className="pp-img"
          data-fit={CONTAIN.has(item.id) ? "contain" : undefined}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      )}
      {asset?.type === "video" && <PlayVideo src={asset.src} active={inView} />}
      {asset?.type === "sprite" && <PlaySprite src={asset.src} active={inView} />}
      {!asset && (
        <>
          <PlayArt id={item.id} title={item.title} />
          <span className="pp-tag" aria-hidden>
            Placeholder
          </span>
        </>
      )}
    </div>
  );
}

function PlayVideo({ src, active }: { src: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (active && !reduced) v.play().catch(() => {});
    else v.pause();
  }, [active]);
  return (
    <video
      ref={ref}
      className="pp-video"
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-hidden
    />
  );
}
