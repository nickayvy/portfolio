import { FooterScene } from "@/components/art/FooterScene";

/** STUB (home engineer owns). Shared closing section + footer, used on every page. */
export function Contact() {
  return (
    <footer id="contact" className="px-5 pt-28 pb-8 md:px-8">
      <div className="mx-auto w-full max-w-[38rem] text-sm text-muted">Contact (stub)</div>
      <FooterScene className="mx-auto mt-16 block h-auto w-full max-w-[46rem]" />
    </footer>
  );
}
