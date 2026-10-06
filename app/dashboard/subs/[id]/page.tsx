import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCompany } from "@/lib/auth";
import { summarizeSub, STATUS_LABEL, getDocDef, OVERALL_LABEL, type DocRow } from "@/lib/docs";
import type { Sub } from "@/lib/types";
import { site, TAX_1099 } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { StatusTag } from "@/components/status-tag";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteDocument, deleteSub, resetSubLink, sendInvite, updateSub } from "../../actions";

const NOTICES: Record<string, string> = {
  added: "Sub added. Text them the link below.",
  sent: "Upload link emailed.",
  saved: "Saved.",
};

export default async function SubPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const { supabase, company } = await requireCompany();
  const [{ data: subData }, { data: docsData }] = await Promise.all([
    supabase.from("subcontractors").select("*").eq("id", id).maybeSingle(),
    supabase.from("documents").select("*").eq("sub_id", id).order("uploaded_at", { ascending: false }),
  ]);
  const sub = subData as Sub | null;
  if (!sub) notFound();
  const docs = (docsData ?? []) as DocRow[];
  const { items, overall } = summarizeSub(docs);
  const link = `${site.url}/u/${sub.invite_token}`;
  const smsBody = `Hi ${sub.name}, it's ${company.name}. Please upload your insurance certificates, W-9 and signed agreement here (no account needed): ${link}`;
  const notice = Object.keys(NOTICES).find((k) => sp[k]);

  return (
    <div>
      <p className="text-sm"><Link href="/dashboard" className="underline">All subs</Link></p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl font-bold leading-none">{sub.name}</h1>
          <p className="mt-2 text-ink/70">{sub.trade ? `${sub.trade}, ` : ""}{OVERALL_LABEL[overall]}</p>
        </div>
      </div>
      {notice && <p role="status" className="mt-6 border-l-4 border-ok bg-white p-4 text-sm font-semibold">{NOTICES[notice]}</p>}
      {sp.error === "noemail" && <p role="alert" className="mt-6 border-l-4 border-bad bg-white p-4 text-sm font-semibold">Add an email address for this sub first, or text them the link.</p>}

      <section className="mt-8 rounded-lg border-2 border-ink bg-white p-6">
        <h2 className="font-display text-3xl font-bold">Upload link</h2>
        <p className="mt-1 text-sm text-ink/75">Anyone with this link can upload documents for {sub.name}. They can&apos;t see other subs.</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Input readOnly value={link} className="max-w-md" aria-label="Upload link" />
          <CopyButton value={link} />
          {sub.phone && (
            <Button asChild size="sm" variant="pencil">
              <a href={`sms:${sub.phone.replace(/[^0-9+]/g, "")}?&body=${encodeURIComponent(smsBody)}`}>Text the link</a>
            </Button>
          )}
          {sub.email && (
            <form action={sendInvite.bind(null, sub.id)}><Button type="submit" size="sm" variant="outline">Email the link</Button></form>
          )}
        </div>
        {sub.last_invited_at && <p className="mt-2 text-xs text-ink/60">Last emailed {formatDate(sub.last_invited_at)}</p>}
        <form action={resetSubLink.bind(null, sub.id)} className="mt-3">
          <button type="submit" className="text-xs underline text-ink/60">Replace link (the old one stops working)</button>
        </form>
      </section>

      <section className="mt-8 rounded-lg border border-line bg-white">
        <h2 className="px-6 pt-6 font-display text-3xl font-bold">Documents</h2>
        <ul className="mt-4">
          {items.map((i) => (
            <li key={i.def.key} className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-4">
              <div className="flex items-center gap-3">
                <StatusTag label={i.def.short} status={i.status} />
                <div>
                  <p className="font-semibold">{i.def.label}{!i.def.required && <span className="font-normal text-ink/50"> (optional)</span>}</p>
                  <p className="text-xs text-ink/60">
                    {STATUS_LABEL[i.status]}
                    {i.doc?.expires_on ? `, expires ${formatDate(i.doc.expires_on)}` : ""}
                    {i.doc ? `, uploaded ${formatDate(i.doc.uploaded_at)}` : ""}
                  </p>
                </div>
              </div>
              {i.doc && (
                <Button asChild size="sm" variant="outline"><a href={`/api/documents/${i.doc.id}`}>Download</a></Button>
              )}
            </li>
          ))}
        </ul>
        {docs.length > 0 && (
          <details className="border-t border-line px-6 py-4 text-sm">
            <summary className="cursor-pointer font-semibold">All uploads ({docs.length})</summary>
            <ul className="mt-3 space-y-2">
              {docs.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span>{getDocDef(d.doc_type)?.label}: <a className="underline" href={`/api/documents/${d.id}`}>{d.file_name}</a> ({formatDate(d.uploaded_at)})</span>
                  <form action={deleteDocument.bind(null, d.id, sub.id)}><Button type="submit" size="sm" variant="danger">Delete</Button></form>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <section className="mt-8 rounded-lg border border-line bg-white p-6">
        <h2 className="font-display text-3xl font-bold">Details and payments</h2>
        <form action={updateSub.bind(null, sub.id)} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="name">Company or name</Label><Input id="name" name="name" defaultValue={sub.name} required /></div>
          <div><Label htmlFor="trade">Trade</Label><Input id="trade" name="trade" defaultValue={sub.trade ?? ""} /></div>
          <div><Label htmlFor="phone">Mobile</Label><Input id="phone" name="phone" type="tel" defaultValue={sub.phone ?? ""} /></div>
          <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" defaultValue={sub.email ?? ""} /></div>
          <div>
            <Label htmlFor="ytd_paid">Paid in {TAX_1099.year} (check, ACH, cash)</Label>
            <Input id="ytd_paid" name="ytd_paid" inputMode="decimal" defaultValue={String(sub.ytd_paid ?? 0)} />
          </div>
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <input type="checkbox" name="is_corporation" defaultChecked={sub.is_corporation} className="h-4 w-4 accent-[#1E2B33]" />
            C or S corporation on their W-9
          </label>
          <div className="sm:col-span-2"><Button type="submit">Save</Button></div>
        </form>
      </section>

      <form action={deleteSub.bind(null, sub.id)} className="mt-8">
        <Button type="submit" variant="danger" size="sm">Delete {sub.name} and all their files</Button>
      </form>
    </div>
  );
}
