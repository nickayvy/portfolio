/**
 * UI sound contract. STUB: the shell engineer replaces the body with a WebAudio
 * synth (no audio files). Signature must not change: other components call it.
 * Must be a silent no-op on the server, when muted, and before the first user gesture.
 */
export type SoundName = "tap" | "pop" | "tick" | "whoosh" | "paper" | "meow" | "toggle";

export function playSound(name: SoundName): void {
  void name;
}
