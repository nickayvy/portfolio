/**
 * UI sound contract: a tiny WebAudio synth, no audio files.
 * Signature must not change: other components call it.
 * Silent no-op on the server, when muted, and before the first user gesture
 * (the AudioContext is only created inside a pointer/key gesture).
 */
import { getSoundOn } from "./prefs";

export type SoundName = "tap" | "pop" | "tick" | "whoosh" | "paper" | "meow" | "toggle";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let gestureBound = false;
const lastPlayed: Partial<Record<SoundName, number>> = {};

function createContext() {
  if (ctx || typeof window === "undefined") return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  try {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.32;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    master.connect(comp).connect(ctx.destination);
    const len = Math.floor(ctx.sampleRate * 0.4);
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  } catch {
    ctx = null;
  }
}

/** Lazily create the context on the first gesture while sound is on. */
function onGesture() {
  if (!getSoundOn()) return;
  createContext();
  if (ctx && ctx.state === "suspended") void ctx.resume();
}

if (typeof window !== "undefined" && !gestureBound) {
  gestureBound = true;
  const opts = { capture: true, passive: true } as const;
  window.addEventListener("pointerdown", onGesture, opts);
  window.addEventListener("keydown", onGesture, opts);
  window.addEventListener("touchend", onGesture, opts);
}

/** Called by the sound toggle (itself a user gesture) so the click can be heard. */
export function unlockAudio() {
  createContext();
  if (ctx && ctx.state === "suspended") void ctx.resume();
}

/* ------------------------------------------------------------ voices */

function env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function osc(type: OscillatorType, f0: number, f1: number, t: number, dur: number, peak: number, attack = 0.004, dest?: AudioNode) {
  const c = ctx!;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  env(g, t, peak, attack, dur);
  o.connect(g).connect(dest ?? master!);
  o.start(t);
  o.stop(t + attack + dur + 0.02);
  return o;
}

function noise(t: number, dur: number, peak: number, filter: BiquadFilterType, f0: number, f1 = f0, q = 1, attack = 0.003) {
  const c = ctx!;
  const s = c.createBufferSource();
  s.buffer = noiseBuf;
  const bq = c.createBiquadFilter();
  bq.type = filter;
  bq.Q.value = q;
  bq.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) bq.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = c.createGain();
  env(g, t, peak, attack, dur);
  s.connect(bq).connect(g).connect(master!);
  s.start(t, Math.random() * 0.15);
  s.stop(t + attack + dur + 0.02);
}

const voices: Record<SoundName, (t: number) => void> = {
  // soft woody click
  tap: (t) => {
    osc("sine", 900, 520, t, 0.05, 0.22);
    noise(t, 0.02, 0.06, "bandpass", 2400, 2400, 2);
  },
  // rounded upward bloop
  pop: (t) => {
    osc("sine", 320, 880, t, 0.09, 0.3, 0.006);
    osc("triangle", 640, 1300, t + 0.01, 0.06, 0.05);
  },
  // tiny mechanical detent
  tick: (t) => {
    noise(t, 0.018, 0.16, "bandpass", 3800, 3800, 6, 0.001);
    osc("square", 1800, 1500, t, 0.012, 0.025, 0.001);
  },
  // airy sweep
  whoosh: (t) => {
    noise(t, 0.17, 0.12, "bandpass", 380, 2200, 1.4, 0.05);
  },
  // dry paper rustle: three short filtered bursts
  paper: (t) => {
    noise(t, 0.05, 0.09, "highpass", 2200, 3200, 0.7);
    noise(t + 0.045, 0.06, 0.07, "bandpass", 3000, 4800, 1.2);
    noise(t + 0.1, 0.07, 0.05, "highpass", 2600, 4200, 0.7);
  },
  // little synth meow: saw through a formant filter, pitch up then down
  meow: (t) => {
    const c = ctx!;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 3;
    bp.frequency.setValueAtTime(900, t);
    bp.frequency.linearRampToValueAtTime(1500, t + 0.07);
    bp.frequency.linearRampToValueAtTime(1000, t + 0.19);
    bp.connect(master!);
    const o = c.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(560, t);
    o.frequency.linearRampToValueAtTime(820, t + 0.06);
    o.frequency.linearRampToValueAtTime(520, t + 0.19);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.03);
    g.gain.setValueAtTime(0.16, t + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.19);
    o.connect(g).connect(bp);
    o.start(t);
    o.stop(t + 0.2);
  },
  // two-note switch blip
  toggle: (t) => {
    osc("sine", 660, 660, t, 0.04, 0.16);
    osc("sine", 990, 990, t + 0.05, 0.05, 0.14);
  },
};

const MIN_GAP: Partial<Record<SoundName, number>> = { tick: 0.028, meow: 0.35, paper: 0.08 };

export function playSound(name: SoundName): void {
  if (typeof window === "undefined" || !getSoundOn() || !ctx || !master) return;
  if (ctx.state === "suspended") void ctx.resume();
  const t = ctx.currentTime + 0.005;
  const gap = MIN_GAP[name] ?? 0.03;
  if (lastPlayed[name] !== undefined && t - lastPlayed[name]! < gap) return;
  lastPlayed[name] = t;
  try {
    voices[name](t);
  } catch {
    /* never let a sound break an interaction */
  }
}
