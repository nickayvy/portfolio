import { useId } from "react";
import type { Project } from "@/content/site";
import { ClassCover } from "./covers/classes";
import { GrowthCover } from "./covers/growth";
import { H, W } from "./covers/parts";
import { StockCover } from "./covers/stock";
import { StoreCover } from "./covers/store";
import { UnixCover } from "./covers/unix";

const SCENES: Record<string, (p: { id: string; slide: number }) => React.ReactNode> = {
  "creator-growth": GrowthCover,
  "stock-pipeline": StockCover,
  "unix-lab": UnixCover,
  "class-assistant": ClassCover,
  "creator-storefront": StoreCover,
};

/**
 * Generated placeholder cover art for a project (CSS/SVG only, no external images).
 * Contract: fills its positioned parent (absolute inset-0). `slide` picks one of
 * project.slides variations (0-based, wraps).
 */
export function ProjectCover({ project, slide = 0 }: { project: Project; slide?: number }) {
  const raw = useId();
  const id = `pc${raw.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const count = Math.max(1, project.slides);
  const s = ((slide % count) + count) % count;
  const Scene = SCENES[project.slug];
  return (
    <div className="cover" data-slug={project.slug}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="cover-svg"
        role="img"
        aria-label={`${project.title}, illustration ${s + 1} of ${count}`}
      >
        {Scene ? <Scene id={id} slide={s} /> : <rect width={W} height={H} fill="#e6e0d5" />}
      </svg>
      <span className="cover-tag" aria-hidden>
        Placeholder
      </span>
    </div>
  );
}
