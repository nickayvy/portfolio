import { notFound } from "next/navigation";
import { Contact } from "@/components/home/Contact";
import { projects } from "@/content/site";

/** STUB (pages engineer owns). */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <>
      <main className="px-5 pt-32 md:px-8">
        <div className="mx-auto w-full max-w-[38rem]">{project.title} (stub)</div>
      </main>
      <Contact />
    </>
  );
}
