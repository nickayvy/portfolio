import { pinnedNote } from "@/content/site";

/** Ruled paper note held up by a red pushpin: where Nick is building most recently. */
export function PinnedNote() {
  return (
    <div className="pinned-note">
      <Pushpin />
      <p className="text-xs text-muted">{pinnedNote.label}</p>
      <p className="flex items-center gap-2 text-base font-medium">
        <span className="note-badge" aria-hidden>
          {pinnedNote.monogram}
        </span>
        {pinnedNote.company}
      </p>
    </div>
  );
}

/** A pushpin seen slightly from the side: domed cap, collar, steel point, soft shadow. */
function Pushpin() {
  return (
    <svg className="note-pin" viewBox="0 0 30 34" aria-hidden>
      <ellipse cx="12.5" cy="30" rx="6.5" ry="2" fill="var(--ink)" opacity="0.16" />
      <path d="M15.5 17.5 12.6 29.4" stroke="var(--ink-muted)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.6 15.6c1.6 2.2 7.8 3.4 11.4 1.4l-.6-3.4c-3 1.2-7.6.6-10-1Z" fill="var(--accent-red)" />
      <path d="M9.6 15.6c1.6 2.2 7.8 3.4 11.4 1.4l-.6-3.4c-3 1.2-7.6.6-10-1Z" fill="var(--ink)" opacity="0.22" />
      <ellipse cx="15.6" cy="9.4" rx="8.6" ry="7.6" fill="var(--accent-red)" />
      <path d="M7.2 10.6c1.4 4 6.6 6.4 11.8 4.6 2.6-.9 4.2-2.6 4.8-4.4-1.4 3-6 4.8-10.4 3.8-3-.6-5.2-2.2-6.2-4Z" fill="var(--ink)" opacity="0.2" />
      <ellipse cx="12.6" cy="6" rx="3" ry="1.8" fill="var(--paper)" opacity="0.6" transform="rotate(-18 12.6 6)" />
    </svg>
  );
}
