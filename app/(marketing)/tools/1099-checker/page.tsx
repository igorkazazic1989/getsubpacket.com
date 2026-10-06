import Link from "next/link";
import type { Metadata } from "next";
import { Checker1099 } from "@/components/tools/checker-1099";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "1099 checker for subcontractors (2025 and 2026 thresholds)",
  description: "Enter what you paid each subcontractor and see who needs a Form 1099-NEC. Uses $600 for 2025 payments and $2,000 for 2026 payments.",
  alternates: { canonical: "/tools/1099-checker" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: `1099 checker by ${site.name}`, applicationCategory: "BusinessApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }} />
      <h1 className="font-display text-5xl font-bold leading-none">Which subs need a 1099?</h1>
      <p className="mt-4 max-w-prose text-lg text-ink/80">
        Add each sub, what you paid them in the year and the tax classification from their W-9. Payments made in 2026 use the new $2,000 threshold.
      </p>
      <div className="mt-8"><Checker1099 /></div>
      <div className="prose-body mt-12 max-w-prose">
        <h2>How the checker decides</h2>
        <p>It asks the same four questions a tax preparer would. Was the sub paid by check, ACH or cash? Card and payment-app payments are reported on 1099-K by the processor instead. Is the sub a corporation according to their W-9? C and S corporations generally don&apos;t get a 1099-NEC. Did the total reach the threshold for the year you paid: $600 for 2025 payments, $2,000 for 2026 payments?</p>
        <p>Example: an electrician set up as a single-member LLC, paid $18,500 by check in 2026, needs a 1099-NEC. A plumber paid $1,800 by ACH in 2026 doesn&apos;t, though the same payment in 2025 would have. A drywall crew that is an S corporation doesn&apos;t, whatever you paid them.</p>
        <p>Forms go to the sub and the IRS by January 31 of the year after you paid. Source: <a href="https://www.irs.gov/forms-pubs/about-form-1099-nec" rel="noopener" target="_blank">IRS, About Form 1099-NEC</a>.</p>
      </div>
      <p className="mt-8 max-w-prose">
        How the rules work: <Link className="underline" href="/guides/do-i-need-to-send-a-1099-to-a-subcontractor">Do I need to send a 1099 to my subcontractor?</Link>
      </p>
    </div>
  );
}
