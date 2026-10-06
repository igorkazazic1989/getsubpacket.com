import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { latestByType, type DocRow } from "@/lib/docs";
import { TAX_1099 } from "@/lib/site";
import type { Sub } from "@/lib/types";

const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });
  const { data: company } = await supabase.from("companies").select("id, name").eq("owner_id", user.id).maybeSingle();
  if (!company) return new NextResponse("Not found", { status: 404 });

  const [{ data: subs }, { data: docs }] = await Promise.all([
    supabase.from("subcontractors").select("*").eq("company_id", company.id).order("name"),
    supabase.from("documents").select("*").eq("company_id", company.id).eq("doc_type", "w9"),
  ]);

  const lines = [["Subcontractor", "Email", "Phone", `Paid ${TAX_1099.year}`, "Corporation", "W-9 on file", "Needs 1099-NEC"].map(cell).join(",")];
  for (const s of (subs ?? []) as Sub[]) {
    const w9 = latestByType(((docs ?? []) as DocRow[]).filter((d) => d.sub_id === s.id)).w9;
    const paid = Number(s.ytd_paid) || 0;
    const needs = !s.is_corporation && paid >= TAX_1099.threshold;
    lines.push([s.name, s.email ?? "", s.phone ?? "", paid.toFixed(2), s.is_corporation ? "yes" : "no", w9 ? "yes" : "no", needs ? "yes" : "no"].map(cell).join(","));
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="1099-list-${TAX_1099.year}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
