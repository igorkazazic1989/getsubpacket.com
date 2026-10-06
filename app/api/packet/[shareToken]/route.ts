import JSZip from "jszip";
import { NextResponse } from "next/server";
import { loadPacket } from "@/lib/packet";
import { createAdminClient, BUCKET } from "@/lib/supabase/admin";
import { STATUS_LABEL } from "@/lib/docs";

export const runtime = "nodejs";
export const maxDuration = 60;

const safe = (s: string) => s.replace(/[^\w.\- ]+/g, "_").trim().slice(0, 80) || "file";
const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`;

export async function GET(_req: Request, { params }: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = await params;
  const packet = await loadPacket(shareToken);
  if (!packet) return new NextResponse("Not found", { status: 404 });

  const admin = createAdminClient();
  const zip = new JSZip();
  const summary: string[] = [["Subcontractor", "Trade", "Document", "Status", "Expires", "File"].map(csvCell).join(",")];

  for (const r of packet.rows) {
    const folder = zip.folder(safe(r.sub.name))!;
    for (const i of r.items) {
      if (!i.doc && !i.def.required) continue;
      let fileLabel = "";
      if (i.doc) {
        const { data } = await admin.storage.from(BUCKET).download(i.doc.file_path);
        if (data) {
          fileLabel = `${i.def.short}-${safe(i.doc.file_name)}`;
          folder.file(fileLabel, await data.arrayBuffer());
        }
      }
      summary.push([r.sub.name, r.sub.trade ?? "", i.def.label, STATUS_LABEL[i.status], i.doc?.expires_on ?? "", fileLabel].map(csvCell).join(","));
    }
  }
  zip.file("summary.csv", summary.join("\n"));

  const buf = await zip.generateAsync({ type: "arraybuffer" });
  const name = `${safe(packet.company.name)}-subcontractor-packet-${new Date().toISOString().slice(0, 10)}.zip`;
  return new NextResponse(buf, {
    headers: { "Content-Type": "application/zip", "Content-Disposition": `attachment; filename="${name}"`, "Cache-Control": "no-store" },
  });
}
