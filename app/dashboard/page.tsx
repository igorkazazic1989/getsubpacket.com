import Link from "next/link";
import { getCompany, isPro } from "@/lib/auth";
import { summarizeSub, OVERALL_LABEL, type DocRow, type DocStatus } from "@/lib/docs";
import type { Sub } from "@/lib/types";
import { site, TAX_1099 } from "@/lib/site";
import { formatDate, formatUsd } from "@/lib/utils";
import { StatusTag, StatusDot } from "@/components/status-tag";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addSub, createCompany, enableShare, disableShare, rotateShare } from "./actions";

const ERRORS: Record<string, string> = {
  limit: `The free plan covers ${site.freeSubLimit} subs. Upgrade to Pro to add more.`,
  add: "That sub could not be saved. Enter at least a name and try again.",
  name: "Enter your company name.",
  create: "Your company could not be created. Try again.",
};

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const { supabase, company } = await getCompany();

  if (!company) {
    return (
      <div className="max-w-md">
        <h1 className="font-display text-4xl font-bold">What&apos;s your company called?</h1>
        <p className="mt-2 text-ink/75">Your subs see this name when they upload.</p>
        {error && <p role="alert" className="mt-4 text-sm font-semibold text-bad">{ERRORS[error] ?? "Something went wrong."}</p>}
        <form action={createCompany} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Company name</Label>
            <Input id="name" name="name" required placeholder="Hale Homes LLC" />
          </div>
          <Button type="submit" variant="pencil" size="lg">Continue</Button>
        </form>
      </div>
    );
  }

  const [{ data: subsData }, { data: docsData }] = await Promise.all([
    supabase.from("subcontractors").select("*").eq("company_id", company.id).order("created_at"),
    supabase.from("documents").select("*").eq("company_id", company.id),
  ]);
  const subs = (subsData ?? []) as Sub[];
  const docs = (docsData ?? []) as DocRow[];
  const rows = subs.map((sub) => ({ sub, ...summarizeSub(docs.filter((d) => d.sub_id === sub.id)) }));

  const counts: Record<DocStatus, number> = { valid: 0, expiring: 0, missing: 0, expired: 0 };
  rows.forEach((r) => counts[r.overall]++);

  const need1099 = rows.filter((r) => !r.sub.is_corporation && Number(r.sub.ytd_paid) >= TAX_1099.threshold);
  const need1099NoW9 = need1099.filter((r) => r.items.find((i) => i.def.key === "w9")?.status !== "valid");
  const pro = isPro(company);
  const atLimit = !pro && subs.length >= site.freeSubLimit;
  const shareUrl = company.share_token ? `${site.url}/p/${company.share_token}` : null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl font-bold leading-none">{company.name}</h1>
          <p className="mt-2 text-ink/70">
            {subs.length} {subs.length === 1 ? "sub" : "subs"}, {pro ? "Pro" : `Free plan (${subs.length}/${site.freeSubLimit})`}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          {(["expired", "missing", "expiring", "valid"] as DocStatus[]).map((s) => (
            <span key={s} className="flex items-center gap-2">
              <StatusDot status={s} /> {OVERALL_LABEL[s]}: <strong>{counts[s]}</strong>
            </span>
          ))}
        </div>
      </div>

      {error && <p role="alert" className="mt-6 border-l-4 border-bad bg-white p-4 text-sm font-semibold">{ERRORS[error] ?? "Something went wrong."}{error === "limit" && <> <Link href="/dashboard/settings/billing" className="underline">Upgrade</Link></>}</p>}

      <section className="mt-10 overflow-hidden rounded-lg border-2 border-ink bg-white">
        {rows.length === 0 ? (
          <div className="p-8">
            <p className="font-display text-2xl font-bold">Add your first sub</p>
            <p className="mt-1 text-ink/75">Start with the trade you have on a job right now. You&apos;ll get a link to text them.</p>
          </div>
        ) : (
          <ul>
            {rows.map((r) => (
              <li key={r.sub.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4 last:border-0">
                <div className="min-w-[12rem]">
                  <Link href={`/dashboard/subs/${r.sub.id}`} className="font-semibold hover:underline">{r.sub.name}</Link>
                  <p className="text-xs text-ink/60">
                    {r.sub.trade ? `${r.sub.trade}, ` : ""}
                    {OVERALL_LABEL[r.overall]}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {r.items.map((i) => (
                    <StatusTag
                      key={i.def.key}
                      label={i.def.short}
                      status={i.status}
                      detail={i.doc?.expires_on ? `expires ${formatDate(i.doc.expires_on)}` : undefined}
                      className={!i.def.required && i.status === "missing" ? "opacity-40" : undefined}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <CopyButton value={`${site.url}/u/${r.sub.invite_token}`} label="Copy upload link" />
                  <Button asChild size="sm" variant="ghost"><Link href={`/dashboard/subs/${r.sub.id}`}>Open</Link></Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-lg border border-line bg-white p-6">
          <h2 className="font-display text-3xl font-bold">Add a sub</h2>
          {atLimit ? (
            <p className="mt-3 text-ink/80">
              You&apos;re using all {site.freeSubLimit} free subs. <Link href="/dashboard/settings/billing" className="font-semibold underline">Upgrade to Pro</Link> for unlimited subs.
            </p>
          ) : (
            <form action={addSub} className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="name">Company or name</Label><Input id="name" name="name" required /></div>
              <div><Label htmlFor="trade">Trade</Label><Input id="trade" name="trade" placeholder="Electrical" /></div>
              <div><Label htmlFor="phone">Mobile</Label><Input id="phone" name="phone" type="tel" /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" /></div>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input type="checkbox" name="send_invite" defaultChecked className="h-4 w-4 accent-[#1E2B33]" /> Email them the upload link now (if you entered an email)
              </label>
              <div className="sm:col-span-2"><Button type="submit" variant="pencil">Add sub</Button></div>
            </form>
          )}
        </section>

        <div className="space-y-8">
          <section className="rounded-lg border border-line bg-white p-6">
            <h2 className="font-display text-3xl font-bold">1099s for {TAX_1099.year}</h2>
            <p className="mt-2 text-sm text-ink/75">
              Non-corporate subs paid {formatUsd(TAX_1099.threshold)} or more. Update what you&apos;ve paid on each sub&apos;s page.
            </p>
            <p className="mt-4 text-lg">
              <strong>{need1099.length}</strong> need a 1099-NEC
              {need1099NoW9.length > 0 && <span className="text-bad">, <strong>{need1099NoW9.length}</strong> without a W-9</span>}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <a href="/api/export/1099">Export list (CSV)</a>
            </Button>
          </section>

          <section className="rounded-lg border border-line bg-white p-6">
            <h2 className="font-display text-3xl font-bold">Audit packet link</h2>
            <p className="mt-2 text-sm text-ink/75">One link for your insurance auditor or lender: every sub&apos;s status, plus their certificates, licenses and agreements as a ZIP. W-9s are never shared.</p>
            {!pro ? (
              <Button asChild variant="pencil" size="sm" className="mt-4"><Link href="/dashboard/settings/billing">Available on Pro</Link></Button>
            ) : company.share_enabled && shareUrl ? (
              <div className="mt-4 space-y-3">
                <Input readOnly value={shareUrl} aria-label="Audit packet link" />
                <div className="flex flex-wrap gap-2">
                  <CopyButton value={shareUrl} />
                  <form action={rotateShare}><Button type="submit" size="sm" variant="ghost">New link</Button></form>
                  <form action={disableShare}><Button type="submit" size="sm" variant="danger">Turn off</Button></form>
                </div>
              </div>
            ) : (
              <form action={enableShare} className="mt-4"><Button type="submit" size="sm">Create link</Button></form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
