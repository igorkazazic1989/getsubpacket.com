import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPro } from "@/lib/auth";
import { summarizeSub, worstStatus, type DocRow, type DocType } from "@/lib/docs";
import type { Company, Sub } from "@/lib/types";

// W-9s contain SSNs/EINs. They stay visible to the builder only and are never shared via the audit link.
export const NOT_SHARED: DocType[] = ["w9"];

export function isSharedType(t: string) {
  return !NOT_SHARED.includes(t as DocType);
}

// Loads everything the public audit packet needs. Returns null if the link is off, unknown or the plan lapsed.
export async function loadPacket(shareToken: string) {
  if (!shareToken || shareToken.length < 20) return null;
  const admin = createAdminClient();
  const { data: c } = await admin.from("companies").select("*").eq("share_token", shareToken).eq("share_enabled", true).maybeSingle();
  const company = c as Company | null;
  if (!company || !isPro(company)) return null;
  const [{ data: subs }, { data: docs }] = await Promise.all([
    admin.from("subcontractors").select("*").eq("company_id", company.id).order("name"),
    // Filter at the query, so W-9 rows never even reach this code path.
    admin.from("documents").select("*").eq("company_id", company.id).not("doc_type", "in", `(${NOT_SHARED.join(",")})`),
  ]);
  const allDocs = (docs ?? []) as DocRow[];
  const rows = ((subs ?? []) as Sub[]).map((sub) => {
    const s = summarizeSub(allDocs.filter((d) => d.sub_id === sub.id));
    const items = s.items.filter((i) => isSharedType(i.def.key));
    const overall = worstStatus(items.filter((i) => i.def.required || i.doc).map((i) => i.status));
    return { sub, items, overall };
  });
  return { company, rows };
}
