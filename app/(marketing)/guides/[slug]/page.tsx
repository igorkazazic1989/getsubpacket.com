import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GUIDES, getGuide } from "@/data/guides";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return { title: g.title, description: g.description, alternates: { canonical: `/guides/${g.slug}` } };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const others = GUIDES.filter((o) => o.slug !== g.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          description: g.description,
          dateModified: g.reviewed,
          citation: g.sources.map((src) => src.url),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: g.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <p className="text-sm">
        <Link href="/guides" className="underline">Guides</Link>
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold leading-[1.02] sm:text-5xl">{g.title}</h1>
      <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink/80">{g.intro}</p>

      <div className="prose-body mt-6 max-w-prose">
        {g.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {s.table && (
              <div className="my-5 overflow-x-auto rounded-md border border-line bg-white">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left">
                      {s.table.head.map((h, i) => (
                        <th key={i} className="px-3 py-2 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.rows.map((r, i) => (
                      <tr key={i} className="border-b border-line align-top last:border-0">
                        {r.map((c, j) => (
                          <td key={j} className="px-3 py-2">{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>

      <aside className="mt-10 border-l-4 border-pencil bg-white p-5">
        <p className="font-display text-2xl font-bold">{g.cta.text}</p>
        <Button asChild className="mt-4" variant="pencil">
          <Link href={g.cta.href}>{g.cta.label}</Link>
        </Button>
      </aside>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-bold">Common questions</h2>
        <dl className="mt-4 divide-y divide-line">
          {g.faqs.map((f) => (
            <div key={f.q} className="py-4">
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-1 max-w-prose leading-relaxed text-ink/80">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10 border-t border-line pt-6 text-sm">
        <h2 className="font-semibold">Sources</h2>
        <ul className="mt-2 space-y-1">
          {g.sources.map((src) => (
            <li key={src.url}>
              <a href={src.url} className="underline" rel="noopener" target="_blank">{src.label}</a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink/60">
          Facts checked against these sources on {formatDate(g.reviewed)}. General information, not legal or tax advice. Rules change; confirm with your tax preparer, insurance agent or attorney.
        </p>
      </section>

      <nav aria-label="More guides" className="mt-12 border-t border-line pt-6">
        <p className="font-semibold">More guides</p>
        <ul className="mt-2 space-y-1">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/guides/${o.slug}`} className="underline">{o.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
