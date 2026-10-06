import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy", robots: { index: false } };

// TODO: replace with a real privacy policy before launch (W-9s contain SSNs/EINs).
export default function Privacy() {
  return (
    <div className="prose-body mx-auto max-w-prose px-5 py-14">
      <h1 className="font-display text-5xl font-bold">Privacy</h1>
      <p>{site.name} stores the documents your subcontractors upload so that you can see and download them. Files are kept in private storage and are only available through your account or an audit link you create and can turn off.</p>
      <p>We use Stripe for payments and Resend to send email. We don&apos;t sell personal data.</p>
      <p>To delete your account and all files, email us.</p>
    </div>
  );
}
