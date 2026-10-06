import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free tools for builders who hire subcontractors",
  description: "Free subcontractor agreement generator, 1099 checker and workers' comp audit calculator for residential builders.",
  alternates: { canonical: "/tools" },
};

const TOOLS = [
  { href: "/subcontractor-agreement-template", t: "Subcontractor agreement generator", d: "Fill in the blanks for your state and download a PDF." },
  { href: "/tools/1099-checker", t: "1099 checker", d: "See which subs need a 1099-NEC for 2025 or 2026 payments." },
  { href: "/tools/workers-comp-audit-calculator", t: "Workers' comp audit calculator", d: "Estimate what uncovered subs could add to your premium." },
];

export default function ToolsIndex() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-5xl font-bold leading-none">Free tools</h1>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {TOOLS.map((x) => (
          <li key={x.href} className="py-5">
            <Link href={x.href} className="font-display text-2xl font-bold hover:underline">{x.t}</Link>
            <p className="mt-1 text-ink/75">{x.d}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
