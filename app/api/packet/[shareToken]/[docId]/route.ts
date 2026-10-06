import { NextResponse } from "next/server";
import { createAdminClient, BUCKET } from "@/lib/supabase/admin";
import { isPro } from "@/lib/auth";
import { isSharedType } from "@/lib/packet";

export async function GET(_req: Request, { params }: { params: Promise<{ shareToken: string; docId: string }> }) {
  const { shareToken, docId } = await params;
  const admin = createAdminClient();
  const { data: company } = await admin
    .from("companies")
    .select("id, subscription_status")
    .eq("share_token", shareToken)
    .eq("share_enabled", true)
    .maybeSingle();
  if (!company || !isPro(company)) return new NextResponse("Not found", { status: 404 });
  const { data: doc } = await admin.from("documents").select("file_path, file_name, doc_type").eq("id", docId).eq("company_id", company.id).maybeSingle();
  if (!doc || !isSharedType(doc.doc_type)) return new NextResponse("Not found", { status: 404 });
  const { data } = await admin.storage.from(BUCKET).createSignedUrl(doc.file_path, 60, { download: doc.file_name });
  if (!data) return new NextResponse("File unavailable", { status: 500 });
  return NextResponse.redirect(data.signedUrl);
}
