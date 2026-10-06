"use client";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatUsd } from "@/lib/utils";
import { site } from "@/lib/site";

export function WcCalculator({ embed = false }: { embed?: boolean }) {
  const [amount, setAmount] = useState("40000");
  const [rate, setRate] = useState("12.50");
  const a = Number(amount.replace(/[^0-9.]/g, "")) || 0;
  const r = Number(rate.replace(/[^0-9.]/g, "")) || 0;
  const added = (a * r) / 100;

  return (
    <div className="rounded-lg border-2 border-ink bg-white p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="amount">Paid this policy period to subs without a valid WC certificate</Label>
          <Input id="amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="rate">Your rate per $100 of payroll</Label>
          <Input id="rate" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
          <p className="mt-1 text-xs text-ink/60">On your policy&apos;s declarations page, next to the class code for the work.</p>
        </div>
      </div>
      <div className="mt-6 border-t border-line pt-5" aria-live="polite">
        <p className="text-sm text-ink/70">Estimated added premium at audit</p>
        <p className="font-display text-5xl font-bold tabular-nums">{formatUsd(added)}</p>
        <p className="mt-2 max-w-prose text-sm text-ink/70">
          A rough estimate before experience modifiers, minimums and state rules. Some carriers count only the labor part of a sub&apos;s invoice. Ask your agent how yours does it.
        </p>
      </div>
      {embed ? (
        <p className="mt-5 text-xs text-ink/60">
          Calculator by{" "}
          <a href={`${site.url}/tools/workers-comp-audit-calculator`} target="_blank" rel="noopener" className="font-semibold underline">
            {site.name}
          </a>
        </p>
      ) : (
      <div className="mt-5 border-l-4 border-pencil bg-paper p-4">
        <p className="font-semibold">Keep this number at zero</p>
        <p className="mt-1 text-sm text-ink/80">Collect every sub&apos;s workers&apos; comp certificate by text and get reminded 30 days before it expires.</p>
        <Button asChild className="mt-3" variant="pencil">
          <Link href="/login?next=/dashboard">Start free with 3 subs</Link>
        </Button>
      </div>
      )}
    </div>
  );
}
