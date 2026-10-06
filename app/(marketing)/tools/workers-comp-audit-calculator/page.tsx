import Link from "next/link";
import type { Metadata } from "next";
import { WcCalculator } from "@/components/tools/wc-calculator";
import { EmbedSnippet } from "@/components/embed-snippet";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Workers' comp audit calculator: what uninsured subs can cost you",
  description:
    "Estimate how much payments to subcontractors without workers' comp coverage could add to your premium at audit, with a worked example and where to find your rate.",
  alternates: { canonical: "/tools/workers-comp-audit-calculator" },
};

const FAQS = [
  { q: "Where do I find my rate per $100 of payroll?", a: "On the declarations page of your workers' comp policy, next to each class code. Use the rate for the class code that matches the sub's work, since that is usually what the auditor assigns." },
  { q: "Does the auditor count the whole invoice?", a: "It depends on the carrier and state. Some count the full amount paid, others only the labor part when the invoice separates labor and materials. Ask your agent." },
  { q: "What counts as proof of coverage?", a: "A certificate of insurance, or a valid state exemption, that covers the dates the sub worked for you. A certificate that expired before the work, or started after it, doesn't help." },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: `Workers' comp audit calculator by ${site.name}`, applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      <h1 className="font-display text-5xl font-bold leading-none">What could uncovered subs add to your audit?</h1>
      <p className="mt-4 max-w-prose text-lg text-ink/80">
        Payments to subs who can&apos;t show workers&apos; comp coverage are often added to your payroll at the premium audit. Put in your own numbers.
      </p>
      <div className="mt-8"><WcCalculator /></div>

      <div className="prose-body mt-12 max-w-prose">
        <h2>How the estimate works</h2>
        <p>Workers&apos; comp premium is charged per $100 of payroll, at a rate that depends on the class code for the work. If the auditor treats what you paid an uncovered sub as your payroll, the added premium is roughly that amount divided by 100, times your rate.</p>
        <p>Example: you paid a framing sub $40,000 during the policy year and have no certificate for those dates. Your framing rate is $12.50 per $100. $40,000 ÷ 100 × $12.50 = $5,000 added at audit. Experience modifiers, state rules and carrier practice move the real number up or down.</p>
        <h2>What it doesn&apos;t include</h2>
        <p>The premium is usually the smaller risk. In some states the hiring contractor can also be responsible for injuries to an uninsured sub&apos;s workers. North Carolina&apos;s G.S. 97-19 is one example. And in Texas, most private employers aren&apos;t required to carry workers&apos; comp at all, so ask your carrier how it treats Texas non-subscriber subs.</p>
        <h2>How to bring it to zero</h2>
        <p>Collect a workers&apos; comp certificate or exemption from every sub before the first payment, track its expiration, and keep every certificate that covered the policy year. At audit, give the auditor one list of each sub, what you paid them and the certificates for those dates.</p>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-bold">Common questions</h2>
        <dl className="mt-4 divide-y divide-line">
          {FAQS.map((f) => (
            <div key={f.q} className="py-4">
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-1 max-w-prose leading-relaxed text-ink/80">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mt-8 max-w-prose">
        More: <Link className="underline" href="/guides/workers-comp-audit-uninsured-subcontractors">How the workers&apos; comp audit treats uninsured subcontractors</Link> and{" "}
        <Link className="underline" href="/guides/subcontractor-insurance-expired-mid-job">what to do when a sub&apos;s insurance expires mid-job</Link>.
      </p>

      <EmbedSnippet path="/embed/workers-comp-calculator" title="Workers' comp audit calculator" />
    </div>
  );
}
