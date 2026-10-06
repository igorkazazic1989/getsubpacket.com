import Link from "next/link";
import type { Metadata } from "next";
import { AgreementTool } from "@/components/tools/agreement-tool";
import { STATES } from "@/data/states";

export const metadata: Metadata = {
  title: "Free subcontractor agreement template (PDF) for residential builders",
  description: "Fill in a subcontractor agreement for residential construction and download it as a PDF. Covers scope, payment, insurance, W-9 and lien waivers.",
  alternates: { canonical: "/subcontractor-agreement-template" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <h1 className="font-display text-5xl font-bold leading-none">Subcontractor agreement template</h1>
      <p className="mt-4 max-w-prose text-lg text-ink/80">
        A plain-English agreement for residential jobs: scope, price, insurance, W-9, lien waivers, warranty and termination. Fill it in and download the PDF.
      </p>
      <div className="mt-8"><AgreementTool /></div>
      <section className="mt-14">
        <h2 className="font-display text-3xl font-bold">By state</h2>
        <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
          {STATES.map((s) => (
            <li key={s.slug}>
              <Link href={`/subcontractor-agreement-template/${s.slug}`} className="underline">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
