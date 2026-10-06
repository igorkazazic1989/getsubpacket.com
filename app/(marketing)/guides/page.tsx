import Link from "next/link";
import type { Metadata } from "next";
import { GUIDES } from "@/data/guides";

export const metadata: Metadata = {
  title: "Guides for builders who hire subcontractors",
  description: "Plain-English guides on 1099s, W-9s, certificates of insurance and workers' comp audits for residential builders and remodelers.",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndex() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-5xl font-bold leading-none">Guides</h1>
      <p className="mt-4 text-lg text-ink/80">Paperwork rules for builders who hire trades, without the legalese.</p>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {GUIDES.map((g) => (
          <li key={g.slug} className="py-5">
            <Link href={`/guides/${g.slug}`} className="font-display text-2xl font-bold hover:underline">
              {g.title}
            </Link>
            <p className="mt-1 text-ink/75">{g.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
