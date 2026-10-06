import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms", robots: { index: false } };

// TODO: replace with real terms before launch.
export default function Terms() {
  return (
    <div className="prose-body mx-auto max-w-prose px-5 py-14">
      <h1 className="font-display text-5xl font-bold">Terms</h1>
      <p>{site.name} is a document tracking tool. It does not verify that insurance certificates, licenses or tax forms are genuine or accurate, and it does not give legal, insurance or tax advice.</p>
      <p>Pro is billed monthly and can be cancelled at any time from the billing page; access continues to the end of the paid period.</p>
    </div>
  );
}
