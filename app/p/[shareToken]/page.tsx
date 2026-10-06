import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadPacket } from "@/lib/packet";
import { OVERALL_LABEL, STATUS_LABEL } from "@/lib/docs";
import { formatDate } from "@/lib/utils";
import { site } from "@/lib/site";
import { StatusTag } from "@/components/status-tag";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Subcontractor audit packet", robots: { index: false, follow: false } };

export default async function PacketPage({ params }: { params: Promise<{ shareToken: string }> }) {
  const { shareToken } = await params;
  const packet = await loadPacket(shareToken);
  if (!packet) notFound();
  const { company, rows } = packet;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <p className="font-display text-xl font-bold">{site.name}</p>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl font-bold leading-none">{company.name}</h1>
          <p className="mt-2 text-ink/70">Subcontractor documents as of {formatDate(today)}. {rows.length} subcontractors.</p>
        </div>
        <Button asChild variant="pencil" size="lg">
          <a href={`/api/packet/${shareToken}`}>Download all files (ZIP)</a>
        </Button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border-2 border-ink bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="px-4 py-3 font-semibold">Subcontractor</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Documents</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.sub.id} className="border-b border-line align-top last:border-0">
                <td className="px-4 py-3">
                  <p className="font-semibold">{r.sub.name}</p>
                  {r.sub.trade && <p className="text-xs text-ink/60">{r.sub.trade}</p>}
                </td>
                <td className="px-4 py-3">{OVERALL_LABEL[r.overall]}</td>
                <td className="px-4 py-3">
                  <ul className="space-y-1.5">
                    {r.items.filter((i) => i.def.required || i.doc).map((i) => (
                      <li key={i.def.key} className="flex items-center gap-2">
                        <StatusTag label={i.def.short} status={i.status} className="h-6 min-w-[2.5rem] text-xs" />
                        {i.doc ? (
                          <a className="underline" href={`/api/packet/${shareToken}/${i.doc.id}`}>{i.def.label}</a>
                        ) : (
                          <span className="text-ink/60">{i.def.label}</span>
                        )}
                        <span className="text-xs text-ink/60">
                          {STATUS_LABEL[i.status]}
                          {i.doc?.expires_on ? `, expires ${formatDate(i.doc.expires_on)}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 max-w-prose text-xs text-ink/60">
        W-9 forms are not shared because they contain tax ID numbers. Documents were uploaded by the subcontractors. {site.name} does not verify coverage with insurers; confirm with the issuing agent where it matters.
      </p>
    </div>
  );
}
