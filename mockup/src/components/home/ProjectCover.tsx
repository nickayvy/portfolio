import type { Project } from "@/content/site";

/**
 * STUB (home engineer owns). Generated placeholder cover art for a project.
 * Contract: fills its positioned parent (absolute inset-0). `slide` picks one of
 * project.slides variations (0-based). Pure CSS/SVG, no external images.
 */
export function ProjectCover({ project, slide = 0 }: { project: Project; slide?: number }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[var(--paper-fold)] text-muted">
      {project.title} · {slide + 1}
    </div>
  );
}
