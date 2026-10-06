import type { Metadata } from "next";
import { WcCalculator } from "@/components/tools/wc-calculator";

// Embeddable version for insurance agents, trade associations and blogs.
// Not indexed itself; the canonical page is /tools/workers-comp-audit-calculator.
export const metadata: Metadata = {
  title: "Workers' comp audit calculator",
  robots: { index: false, follow: true },
  alternates: { canonical: "/tools/workers-comp-audit-calculator" },
};

export default function EmbedPage() {
  return (
    <div className="p-3">
      <WcCalculator embed />
    </div>
  );
}
