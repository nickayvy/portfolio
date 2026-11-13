import type { Metadata } from "next";
import Link from "next/link";
import { Mascot } from "@/components/art/Mascot";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="nf">
      <div>
        <div className="nf-mascot">
          <Mascot interactive className="block h-full w-full" />
        </div>
        <p className="nf-code">404</p>
        <h1>This page wandered off.</h1>
        <p>Probably following one of the cats. Let’s get you back.</p>
        <Link href="/" className="pill" data-cursor="Home">
          Back to home <span className="pill-arrow" aria-hidden>→</span>
        </Link>
      </div>
    </main>
  );
}
