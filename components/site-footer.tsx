import Link from "next/link";
import { site } from "@/lib/site";
import { GUIDES } from "@/data/guides";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 text-sm sm:grid-cols-3">
        <div>
          <p className="font-display text-xl font-bold">{site.name}</p>
          <p className="mt-2 max-w-xs text-ink/70">Subcontractor paperwork for small residential builders and remodelers.</p>
        </div>
        <div>
          <p className="mb-3 font-semibold">Guides</p>
          <ul className="space-y-2">
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="text-ink/80 hover:underline">
                  {g.title.split(":")[0]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold">Free tools</p>
          <ul className="space-y-2">
            <li><Link href="/subcontractor-agreement-template" className="text-ink/80 hover:underline">Subcontractor agreement by state</Link></li>
            <li><Link href="/tools/1099-checker" className="text-ink/80 hover:underline">1099 checker for subs</Link></li>
            <li><Link href="/tools/workers-comp-audit-calculator" className="text-ink/80 hover:underline">Workers&apos; comp audit calculator</Link></li>
            <li><Link href="/privacy" className="text-ink/80 hover:underline">Privacy</Link></li>
            <li><Link href="/terms" className="text-ink/80 hover:underline">Terms</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-5 pb-8 text-xs text-ink/60">
        {site.name} is not a law firm or tax adviser. Templates and guides are general information, not legal or tax advice.
      </p>
    </footer>
  );
}
