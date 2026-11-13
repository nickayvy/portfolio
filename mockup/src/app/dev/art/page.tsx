import { Mascot, MascotPropeller } from "@/components/art/Mascot";
import { Signature } from "@/components/art/Signature";
import { Doodle } from "@/components/art/Doodle";
import { CatFace } from "@/components/art/Cats";
import { FooterScene } from "@/components/art/FooterScene";

const DOODLES = ["rocket", "wrench", "bowl", "cap", "terminal", "cat", "gear", "stream"] as const;

export default function ArtPreview() {
  return (
    <main className="space-y-10 p-10">
      <section id="mascot" className="flex flex-wrap items-end gap-10">
        <Mascot className="w-[112px]" interactive />
        <Mascot className="w-[84px]" />
        <Mascot className="w-[300px]" interactive />
        <MascotPropeller className="w-[300px]" />
        <MascotPropeller className="w-[90px]" />
      </section>
      <section id="signature" className="space-y-8">
        <Signature className="h-7 w-auto" />
        <Signature className="w-[220px]" draw />
        <Signature className="w-[900px]" />
      </section>
      <section id="scene" className="space-y-10">
        <FooterScene className="mx-auto max-w-[46rem]" />
        <FooterScene className="max-w-[350px]" />
      </section>
      <section id="cats" className="flex flex-wrap items-end gap-8">
        {(["siamese", "tuxedo", "blank"] as const).map((k) => (
          <div key={k} className="flex items-end gap-4">
            <CatFace kind={k} className="w-[48px]" />
            <CatFace kind={k} className="w-[120px]" />
            <CatFace kind={k} className="w-[320px]" />
          </div>
        ))}
      </section>
      <section id="doodles" className="space-y-4">
        {[16, 24, 64].map((size) => (
          <p key={size} style={{ fontSize: size, lineHeight: 1.6 }}>
            {DOODLES.map((n) => (
              <span key={n}>
                {n} <Doodle name={n} />{" "}
              </span>
            ))}
          </p>
        ))}
      </section>
    </main>
  );
}
