import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { addDaysIso, daysUntil, getDocDef, todayIso, EXPIRY_WARNING_DAYS } from "@/lib/docs";
import { button, emailLayout, escapeHtml, sendEmail, uploadLink } from "@/lib/email";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

type Due = { id: string; sub_id: string; company_id: string; doc_type: string; expires_on: string; uploaded_at: string };

export async function GET(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const admin = createAdminClient();
  const today = todayIso();

  const { data: dueData, error } = await admin
    .from("documents")
    .select("id, sub_id, company_id, doc_type, expires_on, uploaded_at")
    .not("expires_on", "is", null)
    .lte("expires_on", addDaysIso(today, EXPIRY_WARNING_DAYS));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const due = (dueData ?? []) as Due[];
  if (due.length === 0) return NextResponse.json({ ok: true, reminders: 0 });

  // Only remind about the newest document of each type; a renewal supersedes the old certificate.
  const subIds = [...new Set(due.map((d) => d.sub_id))];
  const { data: allDocs } = await admin.from("documents").select("id, sub_id, doc_type, uploaded_at").in("sub_id", subIds);
  const newest = new Map<string, { id: string; uploaded_at: string }>();
  for (const d of allDocs ?? []) {
    const key = `${d.sub_id}|${d.doc_type}`;
    const cur = newest.get(key);
    if (!cur || d.uploaded_at > cur.uploaded_at) newest.set(key, { id: d.id, uploaded_at: d.uploaded_at });
  }
  const current = due.filter((d) => newest.get(`${d.sub_id}|${d.doc_type}`)?.id === d.id);

  const [{ data: subs }, { data: companies }] = await Promise.all([
    admin.from("subcontractors").select("id, name, email, invite_token").in("id", subIds),
    admin.from("companies").select("id, name, contact_email").in("id", [...new Set(current.map((d) => d.company_id))]),
  ]);
  const subById = new Map((subs ?? []).map((s) => [s.id as string, s]));
  const companyById = new Map((companies ?? []).map((c) => [c.id as string, c]));
  const digest = new Map<string, string[]>();
  let sent = 0;

  for (const doc of current) {
    const days = daysUntil(doc.expires_on, today);
    const kind = days < 0 ? "expired" : "expiring_30";
    // The unique (document_id, kind) constraint makes each reminder fire once.
    const { error: logErr } = await admin.from("reminder_log").insert({ document_id: doc.id, kind });
    if (logErr) continue; // 23505 = already sent

    const sub = subById.get(doc.sub_id);
    const company = companyById.get(doc.company_id);
    const def = getDocDef(doc.doc_type);
    if (!sub || !company || !def) continue;

    const when = days < 0 ? `expired on ${formatDate(doc.expires_on)}` : `expires on ${formatDate(doc.expires_on)} (in ${days} days)`;

    if (sub.email) {
      await sendEmail({
        to: sub.email,
        subject: `${company.name}: your ${def.label.toLowerCase()} ${days < 0 ? "has expired" : "expires soon"}`,
        html: emailLayout(
          `<p>Hi ${escapeHtml(sub.name)},</p><p>The ${escapeHtml(def.label.toLowerCase())} you gave ${escapeHtml(company.name)} ${when}. Please upload the renewed one so you stay cleared to work and get paid without delay.</p>${button(uploadLink(sub.invite_token), "Upload the renewal")}`,
        ),
        replyTo: company.contact_email ?? undefined,
      });
    }
    const list = digest.get(company.id) ?? [];
    list.push(`<li><strong>${escapeHtml(sub.name)}</strong>: ${escapeHtml(def.label)} ${when}${sub.email ? "" : " (no email on file, text them the link)"}</li>`);
    digest.set(company.id, list);
    sent++;
  }

  for (const [companyId, items] of digest) {
    const company = companyById.get(companyId);
    if (!company?.contact_email) continue;
    await sendEmail({
      to: company.contact_email,
      subject: `${items.length} subcontractor ${items.length === 1 ? "document needs" : "documents need"} attention`,
      html: emailLayout(
        `<p>These certificates are expiring or have expired. We've asked each sub with an email address for the renewal.</p><ul style="padding-left:18px">${items.join("")}</ul>${button(`${site.url}/dashboard`, "Open dashboard")}`,
      ),
    });
  }

  return NextResponse.json({ ok: true, reminders: sent });
}
