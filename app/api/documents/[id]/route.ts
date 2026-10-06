import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, BUCKET } from "@/lib/supabase/admin";

// Owner-only download. RLS on `documents` decides whether the row is visible.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: doc } = await supabase.from("documents").select("file_path, file_name").eq("id", id).maybeSingle();
  if (!doc) return new NextResponse("Not found", { status: 404 });
  const { data, error } = await createAdminClient().storage.from(BUCKET).createSignedUrl(doc.file_path, 60, { download: doc.file_name });
  if (error || !data) return new NextResponse("File unavailable", { status: 500 });
  return NextResponse.redirect(data.signedUrl);
}
