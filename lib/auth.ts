import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Company } from "@/lib/types";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function getCompany() {
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("companies").select("*").eq("owner_id", user.id).maybeSingle();
  return { supabase, user, company: (data as Company | null) ?? null };
}

export async function requireCompany() {
  const r = await getCompany();
  if (!r.company) redirect("/dashboard");
  return { ...r, company: r.company as Company };
}

export function isPro(c: Pick<Company, "subscription_status"> | null | undefined) {
  return c?.subscription_status === "active" || c?.subscription_status === "trialing";
}
