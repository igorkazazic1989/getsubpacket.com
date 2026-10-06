import { site } from "@/lib/site";
import { CopyButton } from "@/components/copy-button";

export function EmbedSnippet({ path, title, height = 560 }: { path: string; title: string; height?: number }) {
  const code = `<iframe src="${site.url}${path}" title="${title}" width="100%" height="${height}" style="border:0;max-width:720px" loading="lazy"></iframe>
<p style="font-size:12px">Calculator by <a href="${site.url}/tools/workers-comp-audit-calculator">${site.name}</a></p>`;
  return (
    <section className="mt-12 rounded-lg border border-line bg-white p-6">
      <h2 className="font-display text-3xl font-bold">Put this calculator on your site</h2>
      <p className="mt-2 max-w-prose text-sm text-ink/75">
        Insurance agents, trade associations and bookkeepers can embed it for free. Paste this where you want it to appear.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-md bg-paper p-3 text-xs"><code>{code}</code></pre>
      <div className="mt-3"><CopyButton value={code} label="Copy embed code" /></div>
    </section>
  );
}
