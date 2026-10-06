import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AgreementTool } from "@/components/tools/agreement-tool";
import { JsonLd } from "@/components/json-ld";
import { STATES, getState, hasStateContent } from "@/data/states";

export const dynamicParams = false;

export function generateStaticParams() {
  return STATES.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const s = getState(state);
  if (!s) return {};
  return {
    title: `${s.name} subcontractor agreement template (free PDF)`,
    description: `Free subcontractor agreement for residential construction in ${s.name}. Fill in scope, price and insurance, then download a PDF governed by ${s.name} law.`,
    alternates: { canonical: `/subcontractor-agreement-template/${s.slug}` },
    // Only let Google index a state page once it has verified, state-specific content.
    robots: hasStateContent(s) ? undefined : { index: false, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const s = getState(state);
  if (!s) notFound();
  const idx = STATES.findIndex((x) => x.slug === s.slug);
  const neighbours = [STATES[(idx + 1) % STATES.length], STATES[(idx + 2) % STATES.length], STATES[(idx + STATES.length - 1) % STATES.length]];

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: `How to prepare a subcontractor agreement in ${s.name}`,
          step: [
            { "@type": "HowToStep", name: "Fill in the parties and project", text: "Enter your company, the subcontractor and the project address." },
            { "@type": "HowToStep", name: "Describe scope and price", text: "Write the scope of work, the contract price and payment terms." },
            { "@type": "HowToStep", name: "Set insurance minimums", text: `Set the general liability minimum and require workers' comp as ${s.name} law requires.` },
            { "@type": "HowToStep", name: "Download, review and sign", text: `Download the PDF, have a ${s.name} attorney review it, and collect the signed copy with the COI and W-9.` },
          ],
        }}
      />
      <p className="text-sm">
        <Link href="/subcontractor-agreement-template" className="underline">Subcontractor agreement template</Link>
      </p>
      <h1 className="mt-3 font-display text-5xl font-bold leading-none">{s.name} subcontractor agreement template</h1>
      <p className="mt-4 max-w-prose text-lg text-ink/80">
        For residential builders and remodelers hiring trades in {s.name}. The PDF is governed by {s.name === "District of Columbia" ? "District of Columbia" : s.name} law and requires workers&apos; comp as {s.abbr} law requires.
      </p>
      <div className="mt-8"><AgreementTool defaultState={s.name} /></div>

      <div className="prose-body mt-12 max-w-prose">
        <h2>What this agreement covers</h2>
        <p>Scope of work and change orders in writing, price and payment terms, the sub&apos;s status as an independent contractor, insurance minimums with certificates before work starts and before renewal, indemnification, licenses and safety, a one-year workmanship warranty, termination, and {s.name} governing law.</p>
        <p>It also requires a signed W-9 before the first payment and a lien waiver with each payment where {s.name} law allows it. Those two clauses save the most time in January and at closing.</p>
        {s.notes && s.notes.length > 0 && (
          <>
            <h2>{s.name} specifics</h2>
            {s.notes.map((n, i) => (
              <p key={i}>{n}</p>
            ))}
            {s.sources && s.sources.length > 0 && (
              <p className="text-sm text-ink/70">
                Sources:{" "}
                {s.sources.map((u, i) => (
                  <a key={u} href={u} className="underline" rel="nofollow noopener" target="_blank">
                    {i > 0 ? ", " : ""}
                    {new URL(u).hostname}
                  </a>
                ))}
              </p>
            )}
          </>
        )}
        <h2>Before you rely on it</h2>
        <p>Licensing, lien, prompt-payment and indemnity rules differ by state and change over time. Treat this as a starting draft and have a {s.name} construction attorney review it once. After that, reuse it for every sub.</p>
      </div>

      <nav aria-label="Other states" className="mt-12 border-t border-line pt-6 text-sm">
        <p className="font-semibold">Other states</p>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          {neighbours.map((n) => (
            <li key={n.slug}>
              <Link href={`/subcontractor-agreement-template/${n.slug}`} className="underline">{n.name}</Link>
            </li>
          ))}
          <li><Link href="/subcontractor-agreement-template" className="underline">All states</Link></li>
        </ul>
      </nav>
    </div>
  );
}
