"use client";

/**
 * Live clock for Nick's time zone, e.g. `PST — 03:24:59` (PDT in summer).
 * Renders nothing on the server and until mounted, so there is no hydration
 * mismatch; ticks on the second.
 */
import { useEffect, useState } from "react";
import { person } from "@/content/site";

let fmt: Intl.DateTimeFormat | null = null;

function read(now: Date) {
  fmt ??= new Intl.DateTimeFormat("en-US", {
    timeZone: person.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  });
  const parts = fmt.formatToParts(now);
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? "";
  return { zone: get("timeZoneName"), time: `${get("hour")}:${get("minute")}:${get("second")}` };
}

export function Clock({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      const d = new Date();
      setNow(d);
      timer = window.setTimeout(tick, 1000 - d.getMilliseconds() + 5);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  if (!now) return <p className={`shell-clock ${className}`} aria-hidden="true" />;
  const { zone, time } = read(now);
  return (
    <p className={`shell-clock ${className}`}>
      <span className="sr-only">Nick’s local time: </span>
      <span>{zone}</span>
      <span aria-hidden="true">—</span>
      <time className="shell-clock-time" dateTime={now.toISOString()} aria-live="off">
        {time}
      </time>
    </p>
  );
}
