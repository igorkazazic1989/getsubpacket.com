import { StatusTag } from "@/components/status-tag";
import type { DocStatus } from "@/lib/docs";

const ROWS: { name: string; trade: string; tags: [string, DocStatus][]; note: string }[] = [
  { name: "Rivera Framing", trade: "Framing", tags: [["GL", "valid"], ["WC", "valid"], ["W-9", "valid"], ["AGR", "valid"]], note: "Good to work" },
  { name: "Kessler Electric", trade: "Electrical", tags: [["GL", "valid"], ["WC", "expiring"], ["W-9", "valid"], ["AGR", "valid"]], note: "WC renews in 12 days" },
  { name: "Bright Line Plumbing", trade: "Plumbing", tags: [["GL", "valid"], ["WC", "valid"], ["W-9", "missing"], ["AGR", "valid"]], note: "W-9 missing" },
  { name: "Oak & Iron Drywall", trade: "Drywall", tags: [["GL", "expired"], ["WC", "valid"], ["W-9", "valid"], ["AGR", "missing"]], note: "GL expired Aug 31" },
];

// Static demo of the dashboard, used in the hero.
export function TagBoard() {
  return (
    <figure className="relative">
      <div aria-hidden className="mx-auto h-5 w-28 rounded-t-md bg-ink" />
      <div className="rounded-lg border-2 border-ink bg-white shadow-[6px_6px_0_0_#1E2B33]">
        <div className="flex items-baseline justify-between border-b border-line px-5 py-3">
          <p className="font-display text-lg font-bold">418 Alder St remodel</p>
          <p className="text-xs text-ink/60">4 subs</p>
        </div>
        <ul>
          {ROWS.map((r) => (
            <li key={r.name} className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 last:border-0">
              <div className="min-w-[9rem]">
                <p className="font-semibold leading-tight">{r.name}</p>
                <p className="text-xs text-ink/60">{r.note}</p>
              </div>
              <div className="flex gap-1.5">
                {r.tags.map(([label, status]) => (
                  <StatusTag key={label} label={label} status={status} />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="sr-only">Example: four subcontractors with insurance, W-9 and agreement status.</figcaption>
    </figure>
  );
}
