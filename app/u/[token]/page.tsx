import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { DOC_TYPES, summarizeSub, type DocRow } from "@/lib/docs";
import { site } from "@/lib/site";
import { UploadPanel, type UploadItem } from "./upload-panel";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Upload your documents", robots: { index: false, follow: false } };

export default async function UploadPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subcontractors")
    .select("id, name, company:companies(name)")
    .eq("invite_token", token)
    .maybeSingle();
  if (!sub) notFound();

  const { data: docs } = await admin.from("documents").select("*").eq("sub_id", sub.id);
  const { items } = summarizeSub((docs ?? []) as DocRow[]);
  const company = (Array.isArray(sub.company) ? sub.company[0] : sub.company) as { name: string } | null;

  const uploadItems: UploadItem[] = items.map((i) => ({
    key: i.def.key,
    label: i.def.label,
    help: i.def.help,
    expires: i.def.expires,
    expiryRequired: i.def.expiryRequired,
    required: i.def.required,
    status: i.status,
    currentName: i.doc?.file_name ?? null,
    currentExpires: i.doc?.expires_on ?? null,
  }));
  const done = items.filter((i) => i.def.required).every((i) => i.status === "valid");

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <p className="font-display text-xl font-bold">{site.name}</p>
      <h1 className="mt-6 font-display text-4xl font-bold leading-tight">
        {company?.name ?? "Your builder"} needs these from {sub.name}
      </h1>
      <p className="mt-2 text-ink/75">Take a photo or pick a PDF for each one. No account needed. Only {company?.name ?? "your builder"} can see your files.</p>
      {done && (
        <p role="status" className="mt-5 border-l-4 border-ok bg-white p-4 font-semibold">
          You&apos;re all set. We&apos;ll email you before anything expires.
        </p>
      )}
      <UploadPanel token={token} items={uploadItems} />
      <p className="mt-10 text-xs text-ink/50">Questions about what to upload? Ask {company?.name ?? "your builder"} directly. {DOC_TYPES.length} document types, PDF, JPG, PNG or HEIC, up to 15 MB each.</p>
    </div>
  );
}
