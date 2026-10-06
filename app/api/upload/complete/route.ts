import { NextResponse } from "next/server";
import { createAdminClient, BUCKET } from "@/lib/supabase/admin";
import { DOC_KEYS, getDocDef, type DocType } from "@/lib/docs";
import { sendEmail, emailLayout, escapeHtml, button } from "@/lib/email";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const docType = body?.docType as DocType;
  const path = typeof body?.path === "string" ? body.path : "";
  const fileName = (typeof body?.fileName === "string" ? body.fileName : "document").slice(0, 200);
  const expiresOn = typeof body?.expiresOn === "string" && DATE.test(body.expiresOn) ? body.expiresOn : null;
  const def = getDocDef(docType);

  if (!token || !def || !DOC_KEYS.includes(docType)) return NextResponse.json({ error: "This upload link is not valid." }, { status: 400 });
  if (def.expiryRequired && !expiresOn) return NextResponse.json({ error: "Enter the expiration date." }, { status: 400 });

  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subcontractors")
    .select("id, name, company_id, company:companies(name, contact_email)")
    .eq("invite_token", token)
    .maybeSingle();
  if (!sub) return NextResponse.json({ error: "This upload link has been replaced." }, { status: 404 });

  const prefix = `${sub.company_id}/${sub.id}/`;
  if (!path.startsWith(prefix) || path.includes("..")) return NextResponse.json({ error: "Invalid upload." }, { status: 400 });

  // Make sure the file actually landed in storage.
  const objectName = path.slice(prefix.length);
  const { data: listed } = await admin.storage.from(BUCKET).list(prefix.slice(0, -1), { search: objectName });
  if (!listed?.some((o) => o.name === objectName)) return NextResponse.json({ error: "The file didn't upload. Try again." }, { status: 400 });

  const { error } = await admin.from("documents").insert({
    sub_id: sub.id,
    company_id: sub.company_id,
    doc_type: docType,
    file_path: path,
    file_name: fileName,
    expires_on: def.expires ? expiresOn : null,
  });
  if (error) {
    console.error(error);
    return NextResponse.json({ error: "The upload could not be saved." }, { status: 500 });
  }

  const company = (Array.isArray(sub.company) ? sub.company[0] : sub.company) as { name: string; contact_email: string | null } | null;
  if (company?.contact_email) {
    await sendEmail({
      to: company.contact_email,
      subject: `${sub.name} uploaded: ${def.label}`,
      html: emailLayout(
        `<p><strong>${escapeHtml(sub.name)}</strong> uploaded their ${escapeHtml(def.label.toLowerCase())}${expiresOn ? `, expiring ${formatDate(expiresOn)}` : ""}.</p>${button(`${site.url}/dashboard/subs/${sub.id}`, "Open in dashboard")}`,
      ),
    });
  }
  return NextResponse.json({ ok: true });
}
