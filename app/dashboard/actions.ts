"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCompany, requireUser, isPro } from "@/lib/auth";
import { createAdminClient, BUCKET } from "@/lib/supabase/admin";
import { inviteEmail, sendEmail } from "@/lib/email";
import { randomToken } from "@/lib/utils";
import type { Sub } from "@/lib/types";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

export async function createCompany(formData: FormData) {
  const { supabase, user } = await requireUser();
  const name = str(formData, "name");
  if (!name) redirect("/dashboard?error=name");
  const { error } = await supabase.from("companies").insert({ owner_id: user.id, name, contact_email: user.email });
  if (error) {
    console.error(error);
    redirect("/dashboard?error=create");
  }
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function addSub(formData: FormData) {
  const { supabase, company } = await requireCompany();
  const name = str(formData, "name");
  if (!name) redirect("/dashboard?error=add");
  const email = str(formData, "email") || null;
  const phone = str(formData, "phone") || null;
  const trade = str(formData, "trade") || null;

  const { data, error } = await supabase
    .from("subcontractors")
    .insert({ company_id: company.id, name, email, phone, trade, invite_token: randomToken() })
    .select()
    .single();

  if (error || !data) {
    if (error?.message?.includes("FREE_LIMIT_REACHED")) redirect("/dashboard?error=limit");
    console.error(error);
    redirect("/dashboard?error=add");
  }

  const sub = data as Sub;
  if (sub.email && formData.get("send_invite") === "on") {
    const mail = inviteEmail({ subName: sub.name, companyName: company.name, inviteToken: sub.invite_token });
    await sendEmail({ to: sub.email, ...mail, replyTo: company.contact_email ?? undefined });
    await supabase.from("subcontractors").update({ last_invited_at: new Date().toISOString() }).eq("id", sub.id);
  }
  revalidatePath("/dashboard");
  redirect(`/dashboard/subs/${sub.id}?added=1`);
}

export async function sendInvite(subId: string) {
  const { supabase, company } = await requireCompany();
  const { data } = await supabase.from("subcontractors").select("*").eq("id", subId).single();
  const sub = data as Sub | null;
  if (!sub?.email) redirect(`/dashboard/subs/${subId}?error=noemail`);
  const mail = inviteEmail({ subName: sub.name, companyName: company.name, inviteToken: sub.invite_token });
  await sendEmail({ to: sub.email, ...mail, replyTo: company.contact_email ?? undefined });
  await supabase.from("subcontractors").update({ last_invited_at: new Date().toISOString() }).eq("id", sub.id);
  revalidatePath(`/dashboard/subs/${subId}`);
  redirect(`/dashboard/subs/${subId}?sent=1`);
}

export async function updateSub(subId: string, formData: FormData) {
  const { supabase } = await requireCompany();
  const ytd = Number(str(formData, "ytd_paid").replace(/[^0-9.]/g, "")) || 0;
  await supabase
    .from("subcontractors")
    .update({
      name: str(formData, "name") || undefined,
      trade: str(formData, "trade") || null,
      email: str(formData, "email") || null,
      phone: str(formData, "phone") || null,
      ytd_paid: ytd,
      is_corporation: formData.get("is_corporation") === "on",
    })
    .eq("id", subId);
  revalidatePath(`/dashboard/subs/${subId}`);
  revalidatePath("/dashboard");
  redirect(`/dashboard/subs/${subId}?saved=1`);
}

export async function resetSubLink(subId: string) {
  const { supabase } = await requireCompany();
  await supabase.from("subcontractors").update({ invite_token: randomToken() }).eq("id", subId);
  revalidatePath(`/dashboard/subs/${subId}`);
}

export async function deleteSub(subId: string) {
  const { supabase, company } = await requireCompany();
  const { data: docs } = await supabase.from("documents").select("file_path").eq("sub_id", subId);
  const { error } = await supabase.from("subcontractors").delete().eq("id", subId).eq("company_id", company.id);
  if (!error && docs?.length) {
    await createAdminClient().storage.from(BUCKET).remove(docs.map((d) => d.file_path as string));
  }
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteDocument(docId: string, subId: string) {
  const { supabase } = await requireCompany();
  // RLS limits this select/delete to the owner's documents.
  const { data } = await supabase.from("documents").select("file_path").eq("id", docId).single();
  if (data) {
    await supabase.from("documents").delete().eq("id", docId);
    await createAdminClient().storage.from(BUCKET).remove([data.file_path as string]);
  }
  revalidatePath(`/dashboard/subs/${subId}`);
}

export async function enableShare() {
  const { company } = await requireCompany();
  if (!isPro(company)) redirect("/dashboard/settings/billing?need=pro");
  await createAdminClient()
    .from("companies")
    .update({ share_enabled: true, share_token: company.share_token ?? randomToken(24) })
    .eq("id", company.id);
  revalidatePath("/dashboard");
}

export async function rotateShare() {
  const { company } = await requireCompany();
  if (!isPro(company)) redirect("/dashboard/settings/billing?need=pro");
  await createAdminClient().from("companies").update({ share_enabled: true, share_token: randomToken(24) }).eq("id", company.id);
  revalidatePath("/dashboard");
}

export async function disableShare() {
  const { company } = await requireCompany();
  await createAdminClient().from("companies").update({ share_enabled: false }).eq("id", company.id);
  revalidatePath("/dashboard");
}
