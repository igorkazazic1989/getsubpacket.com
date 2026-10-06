import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TagBoard } from "@/components/tag-board";
import { JsonLd } from "@/components/json-ld";
import { site, TAX_1099 } from "@/lib/site";
import { formatUsd } from "@/lib/utils";

const FAQS = [
  { q: "Do my subs need an account?", a: "No. Each sub gets their own link. They open it on their phone, take a photo or pick a PDF, and they're done." },
  { q: "What can subs upload?", a: "General liability and workers' comp certificates, a workers' comp exemption, their W-9, their license and the signed agreement. PDFs and photos both work." },
  { q: "Who can see the files?", a: "You. Files are stored privately. If you turn on an audit packet link, anyone you give that link to can see the status and download the files, until you turn it off." },
  { q: "Is this legal or tax advice?", a: "No. The agreement template and guides are general information. Have your attorney and tax preparer confirm what applies to you." },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: site.name,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: [
              { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
              { "@type": "Offer", price: String(site.priceMonthly), priceCurrency: "USD", name: "Pro (monthly)" },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]}
      />

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 md:grid-cols-[1.1fr_1fr] md:pt-20">
        <div>
          <h1 className="font-display text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl">
            Know every sub is covered before the auditor asks.
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink/80">
            Text each sub one link. They upload their insurance certificates, W-9 and signed agreement from their phone. You see who&apos;s good to work, and you hear about renewals 30 days before anything expires.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="pencil">
              <Link href="/login">Start free with {site.freeSubLimit} subs</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/subcontractor-agreement-template">Get a free subcontractor agreement</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-ink/60">For residential builders and remodelers with 1 to 10 people. No credit card.</p>
        </div>
        <TagBoard />
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">The workers&apos; comp audit</h2>
            <p className="mt-4 max-w-prose leading-relaxed text-ink/80">
              At your annual premium audit, payments to subs who can&apos;t show workers&apos; comp coverage for the dates they worked can be counted as your own payroll, and you pay the premium. A current certificate for every sub, for the whole policy period, keeps that bill off your desk.
            </p>
            <Link href="/tools/workers-comp-audit-calculator" className="mt-4 inline-block font-semibold underline">
              Estimate what uncovered subs could cost you
            </Link>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">1099 season</h2>
            <p className="mt-4 max-w-prose leading-relaxed text-ink/80">
              For payments made in {TAX_1099.year}, you file a 1099-NEC for each non-corporate sub you paid {formatUsd(TAX_1099.threshold)} or more, due by January 31. That takes a W-9 from every one of them. Collect them now, and export the list when your preparer asks.
            </p>
            <Link href="/tools/1099-checker" className="mt-4 inline-block font-semibold underline">
              Check which subs need a 1099
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-4xl font-bold">How it works</h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Add a sub", "Name, trade and phone or email. Takes ten seconds."],
            ["Text them the link", "Send it from your own phone, or let us email it. No app, no password for them."],
            ["They upload from the job site", "Photos or PDFs of their COIs, W-9, license and the signed agreement."],
            ["You get the reminders", "30 days before a certificate expires, we ask the sub for the renewal and tell you."],
          ].map(([t, d], i) => (
            <li key={t} className="border-t-4 border-ink pt-4">
              <p className="font-display text-5xl font-bold text-pencil [-webkit-text-stroke:1px_#1E2B33]">{i + 1}</p>
              <p className="mt-2 font-display text-2xl font-bold">{t}</p>
              <p className="mt-1 text-ink/75">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="pricing" className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-4xl font-bold">Pricing</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-line p-6">
              <p className="font-display text-2xl font-bold">Free</p>
              <p className="mt-1 font-display text-5xl font-bold">$0</p>
              <ul className="mt-5 space-y-2 text-ink/80">
                <li>Up to {site.freeSubLimit} subs</li>
                <li>Upload links for each sub</li>
                <li>Expiration reminders</li>
                <li>1099 list export</li>
              </ul>
              <Button asChild className="mt-6" variant="outline">
                <Link href="/login">Start free</Link>
              </Button>
            </div>
            <div className="rounded-lg border-2 border-ink p-6 shadow-[6px_6px_0_0_#F2C230]">
              <p className="font-display text-2xl font-bold">Pro</p>
              <p className="mt-1 font-display text-5xl font-bold">
                ${site.priceMonthly}
                <span className="font-sans text-base font-normal text-ink/60"> / month</span>
              </p>
              <ul className="mt-5 space-y-2 text-ink/80">
                <li>Unlimited subs</li>
                <li>Everything in Free</li>
                <li>Audit packet link: share status with your insurance auditor or lender and let them download every file as one ZIP</li>
                <li>Cancel any time from the billing page</li>
              </ul>
              <Button asChild className="mt-6" variant="pencil">
                <Link href="/login?next=/dashboard/settings/billing">Start with Pro</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="font-display text-4xl font-bold">Questions</h2>
        <dl className="mt-6 divide-y divide-line">
          {FAQS.map((f) => (
            <div key={f.q} className="py-5">
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-1 leading-relaxed text-ink/80">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
