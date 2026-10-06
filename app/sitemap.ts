import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { GUIDES } from "@/data/guides";
import { INDEXABLE_STATES } from "@/data/states";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (path: string, priority = 0.6): MetadataRoute.Sitemap[number] => ({ url: `${site.url}${path}`, lastModified: now, priority });
  return [
    u("/", 1),
    u("/guides", 0.7),
    u("/tools", 0.7),
    u("/tools/1099-checker", 0.9),
    u("/tools/workers-comp-audit-calculator", 0.9),
    u("/subcontractor-agreement-template", 0.9),
    ...GUIDES.map((g) => ({ ...u(`/guides/${g.slug}`, 0.8), lastModified: new Date(g.reviewed) })),
    ...INDEXABLE_STATES().map((s) => u(`/subcontractor-agreement-template/${s.slug}`, 0.6)),
  ];
}
