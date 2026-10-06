"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AgreementData } from "@/lib/agreement";
import { STATES } from "@/data/states";

export function AgreementTool({ defaultState = "" }: { defaultState?: string }) {
  const [d, setD] = useState<AgreementData>({
    builder: "",
    builderAddress: "",
    sub: "",
    subAddress: "",
    state: defaultState,
    project: "",
    scope: "",
    price: "",
    paymentTerms: "",
    glLimit: "$1,000,000",
    date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof AgreementData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setD((prev) => ({ ...prev, [k]: e.target.value }));

  async function download() {
    setBusy(true);
    setError(null);
    try {
      const [{ pdf }, { AgreementPdf }] = await Promise.all([import("@react-pdf/renderer"), import("@/components/agreement/agreement-pdf")]);
      const blob = await pdf(<AgreementPdf d={d} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `subcontractor-agreement${d.sub ? "-" + d.sub.toLowerCase().replace(/[^a-z0-9]+/g, "-") : ""}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setDone(true);
    } catch (e) {
      console.error(e);
      setError("The PDF could not be created. Reload the page and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border-2 border-ink bg-white p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="builder">Your company (contractor)</Label>
          <Input id="builder" value={d.builder} onChange={set("builder")} placeholder="Hale Homes LLC" />
        </div>
        <div>
          <Label htmlFor="sub">Subcontractor</Label>
          <Input id="sub" value={d.sub} onChange={set("sub")} placeholder="Kessler Electric" />
        </div>
        <div>
          <Label htmlFor="builderAddress">Your address</Label>
          <Input id="builderAddress" value={d.builderAddress} onChange={set("builderAddress")} />
        </div>
        <div>
          <Label htmlFor="subAddress">Subcontractor address</Label>
          <Input id="subAddress" value={d.subAddress} onChange={set("subAddress")} />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Select id="state" value={d.state} onChange={set("state")}>
            <option value="">Choose a state</option>
            {STATES.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="project">Project address</Label>
          <Input id="project" value={d.project} onChange={set("project")} placeholder="418 Alder St" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="scope">Scope of work</Label>
          <Textarea id="scope" value={d.scope} onChange={set("scope")} placeholder="Rough and finish electrical per plans dated..., including fixtures supplied by owner." />
        </div>
        <div>
          <Label htmlFor="price">Contract price</Label>
          <Input id="price" value={d.price} onChange={set("price")} placeholder="$18,500" />
        </div>
        <div>
          <Label htmlFor="glLimit">Minimum general liability per occurrence</Label>
          <Input id="glLimit" value={d.glLimit} onChange={set("glLimit")} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="paymentTerms">Payment terms</Label>
          <Input id="paymentTerms" value={d.paymentTerms} onChange={set("paymentTerms")} placeholder="Progress payments within 15 days of an approved invoice." />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button type="button" size="lg" onClick={download} disabled={busy}>
          {busy ? "Creating PDF…" : "Download agreement (PDF)"}
        </Button>
        <p className="text-xs text-ink/60">Free, no account. Created in your browser; nothing is uploaded.</p>
      </div>
      {error && <p role="alert" className="mt-3 text-sm font-semibold text-bad">{error}</p>}

      {done && (
        <div className="mt-6 border-l-4 border-pencil bg-paper p-4">
          <p className="font-display text-xl font-bold">Downloaded. Now get it back signed, with the COI and W-9.</p>
          <p className="mt-1 text-sm text-ink/80">
            Text {d.sub || "your sub"} one link. They upload the signed agreement, insurance certificates and W-9 from their phone, and you get a reminder 30 days before any certificate expires.
          </p>
          <Button asChild className="mt-3" variant="pencil">
            <Link href="/login?next=/dashboard">Start free with 3 subs</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
