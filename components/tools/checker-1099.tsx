"use client";
import { useState } from "react";
import Link from "next/link";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatUsd } from "@/lib/utils";

type Entity = "individual" | "llc_single" | "partnership" | "corporation" | "llc_corp";
type Method = "check" | "card";
interface Row { id: number; name: string; amount: string; entity: Entity; method: Method }

const ENTITY_LABEL: Record<Entity, string> = {
  individual: "Individual / sole proprietor",
  llc_single: "Single-member LLC",
  partnership: "Partnership or multi-member LLC",
  corporation: "C or S corporation",
  llc_corp: "LLC taxed as corporation",
};

const THRESHOLDS: Record<string, number> = { "2025": 600, "2026": 2000 };

function verdict(r: Row, threshold: number) {
  const amt = Number(r.amount.replace(/[^0-9.]/g, "")) || 0;
  if (!r.amount) return { needs: null as boolean | null, why: "" };
  if (r.method === "card") return { needs: false, why: "Paid by card or payment app: reported on 1099-K by the processor." };
  if (r.entity === "corporation" || r.entity === "llc_corp") return { needs: false, why: "Corporations are generally exempt." };
  if (amt < threshold) return { needs: false, why: `Under ${formatUsd(threshold)}.` };
  return { needs: true, why: `${formatUsd(amt)} paid, at or over ${formatUsd(threshold)}.` };
}

let nextId = 3;

export function Checker1099() {
  const [year, setYear] = useState("2026");
  const [rows, setRows] = useState<Row[]>([
    { id: 1, name: "Kessler Electric", amount: "18500", entity: "llc_single", method: "check" },
    { id: 2, name: "Bright Line Plumbing", amount: "1800", entity: "individual", method: "check" },
  ]);
  const threshold = THRESHOLDS[year];
  const update = (id: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const count = rows.filter((r) => verdict(r, threshold).needs).length;

  return (
    <div className="rounded-lg border-2 border-ink bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="year" className="mb-1.5 block text-sm font-semibold">Payments made in</label>
          <Select id="year" value={year} onChange={(e) => setYear(e.target.value)} className="w-40">
            <option value="2025">2025 ($600)</option>
            <option value="2026">2026 ($2,000)</option>
          </Select>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-2 pr-2 font-semibold">Subcontractor</th>
              <th className="py-2 pr-2 font-semibold">Paid in year</th>
              <th className="py-2 pr-2 font-semibold">Tax classification (from W-9)</th>
              <th className="py-2 pr-2 font-semibold">Paid by</th>
              <th className="py-2 font-semibold">1099-NEC?</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const v = verdict(r, threshold);
              return (
                <tr key={r.id} className="border-b border-line align-top">
                  <td className="py-2 pr-2"><Input aria-label="Subcontractor name" value={r.name} onChange={(e) => update(r.id, { name: e.target.value })} /></td>
                  <td className="py-2 pr-2"><Input aria-label="Amount paid" inputMode="decimal" value={r.amount} onChange={(e) => update(r.id, { amount: e.target.value })} /></td>
                  <td className="py-2 pr-2">
                    <Select aria-label="Tax classification" value={r.entity} onChange={(e) => update(r.id, { entity: e.target.value as Entity })}>
                      {Object.entries(ENTITY_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                    </Select>
                  </td>
                  <td className="py-2 pr-2">
                    <Select aria-label="Payment method" value={r.method} onChange={(e) => update(r.id, { method: e.target.value as Method })}>
                      <option value="check">Check, ACH, cash</option>
                      <option value="card">Card or payment app</option>
                    </Select>
                  </td>
                  <td className="py-2">
                    <p className={v.needs ? "font-display text-lg font-bold text-bad" : "font-display text-lg font-bold text-ok"}>
                      {v.needs === null ? "" : v.needs ? "Yes" : "No"}
                    </p>
                    <p className="text-xs text-ink/60">{v.why}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={() => setRows((rs) => [...rs, { id: nextId++, name: "", amount: "", entity: "individual", method: "check" }])}>
          Add a sub
        </Button>
        <p className="text-sm" aria-live="polite"><strong>{count}</strong> of {rows.length} need a 1099-NEC.</p>
      </div>
      <p className="mt-4 max-w-prose text-xs text-ink/60">General rules only. Attorneys and some other payees are reportable even when incorporated. Confirm with your tax preparer.</p>
      <div className="mt-5 border-l-4 border-pencil bg-paper p-4">
        <p className="font-semibold">Have every W-9 before January</p>
        <p className="mt-1 text-sm text-ink/80">Text each sub one link to upload their W-9 and insurance. Export the 1099 list in one click.</p>
        <Button asChild className="mt-3" variant="pencil">
          <Link href="/login?next=/dashboard">Start free with 3 subs</Link>
        </Button>
      </div>
    </div>
  );
}
