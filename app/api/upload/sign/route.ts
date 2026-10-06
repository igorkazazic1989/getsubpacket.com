import { NextResponse } from "next/server";
import { createAdminClient, BUCKET } from "@/lib/supabase/admin";
import { DOC_KEYS, type DocType } from "@/lib/docs";

const MAX = 15 * 1024 * 1024;
const EXT = ["pdf", "jpg", "jpeg", "png", "heic", "heif", "webp"];

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const docType = body?.docType as DocType;
  const fileName = typeof body?.fileName === "string" ? body.fileName : "";
  const size = Number(body?.size);
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";

  if (!token || !DOC_KEYS.includes(docType)) return NextResponse.json({ error: "This upload link is not valid." }, { status: 400 });
  if (!EXT.includes(ext)) return NextResponse.json({ error: "Upload a PDF or a photo (JPG, PNG, HEIC)." }, { status: 400 });
  if (!size || size > MAX) return NextResponse.json({ error: "Files can be up to 15 MB." }, { status: 400 });

  const admin = createAdminClient();
  const { data: sub } = await admin.from("subcontractors").select("id, company_id").eq("invite_token", token).maybeSingle();
  if (!sub) return NextResponse.json({ error: "This upload link has been replaced. Ask your builder for the new one." }, { status: 404 });

  const path = `${sub.company_id}/${sub.id}/${docType}-${Date.now()}.${ext}`;
  const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    console.error(error);
    return NextResponse.json({ error: "The upload could not start. Try again." }, { status: 500 });
  }
  return NextResponse.json({ path: data.path, uploadToken: data.token });
}
